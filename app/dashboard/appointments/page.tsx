'use client'

import { useEffect, useState } from 'react'
import { Plus, Calendar as CalendarIcon, List } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import { useBusinessStore } from '@/store/useBusinessStore'
import { useAppointmentStore } from '@/store/useAppointmentStore'
import { getAppointments } from '@/app/actions/appointment'
import { CreateAppointmentModal } from './_components/create-appointment-modal'
import { columns } from './_components/columns'
import { Calendar } from '@/components/ui/calendar'
import { format } from 'date-fns'

const Appointments = () => {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list')
  const { currentBusiness } = useBusinessStore()
  const { appointments, setAppointments } = useAppointmentStore()
  const [date, setDate] = useState<Date | undefined>(new Date())

  useEffect(() => {
    const fetchAppointments = async () => {
      if (currentBusiness) {
        const result = await getAppointments(currentBusiness.id)
        if (result.success) {
          setAppointments(result.appointments)
        }
      }
    }
    
    fetchAppointments()
  }, [currentBusiness, setAppointments])

  const toolbar = (
    <div className="flex items-center space-x-2">
      <Button onClick={() => setShowCreateModal(true)}>
        <Plus className="mr-2 h-4 w-4" /> New Appointment
      </Button>
      <Button 
        variant="outline" 
        onClick={() => setViewMode(viewMode === 'list' ? 'calendar' : 'list')}
      >
        {viewMode === 'list' ? (
          <CalendarIcon className="mr-2 h-4 w-4" />
        ) : (
          <List className="mr-2 h-4 w-4" />
        )}
        {viewMode === 'list' ? 'Calendar View' : 'List View'}
      </Button>
    </div>
  )

  const getDayAppointments = (day: Date) => {
    return appointments.filter(appointment => 
      format(new Date(appointment.startTime), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
    )
  }

  return (
    <div className="space-y-4">
      <div className="section-heading">
        <h2>Appointments</h2>
        <p>Manage your appointments here</p>
      </div>
      
      {viewMode === 'list' ? (
        <DataTable
          columns={columns}
          data={appointments}
          searchKey="customer.name"
          toolbar={toolbar}
        />
      ) : (
        <div className="space-y-4">
          {toolbar}
          <div className="flex justify-center">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
              components={{
                DayContent: ({ date }) => (
                  <div className="relative w-full h-full">
                    <div>{format(date, 'd')}</div>
                    {getDayAppointments(date).length > 0 && (
                      <div className="absolute bottom-0 left-0 right-0 flex justify-center">
                        <div className="h-1 w-1 bg-primary rounded-full" />
                      </div>
                    )}
                  </div>
                ),
              }}
            />
          </div>
          {date && (
            <div className="mt-4">
              <h3 className="text-lg font-medium mb-2">
                Appointments for {format(date, 'MMMM d, yyyy')}
              </h3>
              <div className="space-y-2">
                {getDayAppointments(date).map((appointment) => (
                  <div
                    key={appointment.id}
                    className="p-4 rounded-lg border bg-card text-card-foreground"
                  >
                    <div className="font-medium">{appointment.customer.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {format(new Date(appointment.startTime), 'h:mm a')} - {format(new Date(appointment.endTime), 'h:mm a')}
                    </div>
                    <div className="text-sm">{appointment.service.name}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      
      {showCreateModal && (
        <CreateAppointmentModal onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  )
}

export default Appointments
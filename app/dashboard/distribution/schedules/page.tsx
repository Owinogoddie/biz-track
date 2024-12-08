'use client'
import { useEffect, useState } from 'react'
import { Plus, Calendar as CalendarIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { DataTable } from '@/components/ui/data-table'
import { useBusinessStore } from '@/store/useBusinessStore'
import { useDeliveryScheduleStore } from '@/store/useDeliveryScheduleStore'
import { useDistributionClientStore } from '@/store/useDistributionClientStore'
import { useDeliveryRouteStore } from '@/store/useDeliveryRouteStore'
import { getDeliverySchedules } from '@/app/actions/deliverySchedule'
import { getDistributionClients } from '@/app/actions/distributionClient'
import { getDeliveryRoutes } from '@/app/actions/deliveryRoute'
import { CreateScheduleModal } from './_components/create-schedule-modal'
import { columns } from './_components/columns'

const DeliverySchedules = () => {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const { currentBusiness } = useBusinessStore()
  const { schedules, setSchedules } = useDeliveryScheduleStore()
  const { clients, setClients } = useDistributionClientStore()
  const { routes, setRoutes } = useDeliveryRouteStore()

  useEffect(() => {
    const fetchData = async () => {
      if (currentBusiness) {
        const [schedulesResult, clientsResult, routesResult] = await Promise.all([
          getDeliverySchedules(currentBusiness.id),
          getDistributionClients(currentBusiness.id),
          getDeliveryRoutes(currentBusiness.id)
        ])

        if (schedulesResult.success) setSchedules(schedulesResult.schedules)
        if (clientsResult.success) setClients(clientsResult.clients)
        if (routesResult.success) setRoutes(routesResult.routes)
      }
    }
    
    fetchData()
  }, [currentBusiness, setSchedules, setClients, setRoutes])

  const toolbar = (
    <div className="flex items-center gap-4">
      <Button onClick={() => setShowCreateModal(true)}>
        <Plus className="mr-2 h-4 w-4" /> Add Schedule
      </Button>
    </div>
  )

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight">Delivery Schedules</h2>
        <p className="text-muted-foreground">
          Manage your delivery schedules and frequencies here.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-[1fr_300px]">
      <DataTable 
           columns={columns({ clients, routes })} // Call the function here
           data={schedules}
           searchKey="client.name"
           toolbar={toolbar}
         />
        
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md border"
          />
        </div>
      </div>
      
      {showCreateModal && (
        <CreateScheduleModal 
          clients={clients}
          routes={routes}
          onClose={() => setShowCreateModal(false)} 
        />
      )}
    </div>
  )
}

export default DeliverySchedules
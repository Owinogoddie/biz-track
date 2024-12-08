import { addDays, addWeeks, addMonths, eachDayOfInterval, eachWeekOfInterval, eachMonthOfInterval, isSameDay, setHours, setMinutes, isWithinInterval } from 'date-fns'
import { TimeSlot, RecurringPattern } from '@/types/appointment'
import prisma from '@/lib/prisma'

const BUSINESS_HOURS = {
  start: 9, // 9 AM
  end: 17, // 5 PM
  slotDuration: 30 // 30 minutes
}

export async function generateTimeSlots(date: Date, businessId: string, duration: number = BUSINESS_HOURS.slotDuration): Promise<TimeSlot[]> {
  const slots: TimeSlot[] = []
  const startHour = BUSINESS_HOURS.start
  const endHour = BUSINESS_HOURS.end

  // Get existing appointments for the day
  const existingAppointments = await prisma.appointment.findMany({
    where: {
      businessId,
      startTime: {
        gte: setHours(setMinutes(date, 0), startHour),
        lt: setHours(setMinutes(date, 0), endHour)
      }
    }
  })

  // Generate all possible time slots
  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += duration) {
      const slotStart = setHours(setMinutes(date, minute), hour)
      const slotEnd = setMinutes(slotStart, minute + duration)

      // Check if slot overlaps with any existing appointment
      const isAvailable = !existingAppointments.some(appointment => 
        isWithinInterval(slotStart, { start: new Date(appointment.startTime), end: new Date(appointment.endTime) }) ||
        isWithinInterval(slotEnd, { start: new Date(appointment.startTime), end: new Date(appointment.endTime) })
      )

      slots.push({
        startTime: slotStart,
        endTime: slotEnd,
        available: isAvailable
      })
    }
  }

  return slots
}

export function generateRecurringDates(startDate: Date, pattern: RecurringPattern): Date[] {
  const dates: Date[] = []
  
  switch (pattern.frequency) {
    case 'DAILY':
      const dailyInterval = { start: startDate, end: pattern.endDate }
      dates.push(...eachDayOfInterval(dailyInterval, { step: pattern.interval }))
      break
      
    case 'WEEKLY':
      const weeklyInterval = { start: startDate, end: pattern.endDate }
      dates.push(...eachWeekOfInterval(weeklyInterval, { step: pattern.interval }))
      break
      
      case 'MONTHLY':
        const monthlyInterval = { start: startDate, end: pattern.endDate };
        const monthlyDates = eachMonthOfInterval(monthlyInterval); // Generate dates first
        dates.push(
          ...monthlyDates.filter((_, index) => index % pattern.interval === 0) // Apply filter to the result before pushing
        );
        break;
      
  }

  return dates
}

export async function checkAvailability(startTime: Date, endTime: Date, businessId: string): Promise<boolean> {
  const conflictingAppointments = await prisma.appointment.findMany({
    where: {
      businessId,
      OR: [
        {
          startTime: {
            lt: endTime,
            gte: startTime
          }
        },
        {
          endTime: {
            gt: startTime,
            lte: endTime
          }
        }
      ]
    }
  })

  return conflictingAppointments.length === 0
}
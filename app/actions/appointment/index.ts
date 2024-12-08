'use server'

import prisma from '@/lib/prisma'
import { getUserAction } from '../auth'
import { AppointmentStatus } from '@prisma/client'
import { generateRecurringDates, checkAvailability } from '@/lib/appointment-utils'
import { RecurringPattern } from '@/types/appointment'

export interface CreateAppointmentInput {
  serviceId: string
  customerId: string
  businessId: string
  startTime: Date
  endTime: Date
  notes?: string
  recurringPattern?: RecurringPattern
}

export async function createAppointment(data: CreateAppointmentInput) {
  try {
    const userResult = await getUserAction()
    
    if (!userResult.success || !userResult.user) {
      return { success: false, error: 'User not authenticated' }
    }

    // Check availability for the initial appointment
    const isAvailable = await checkAvailability(data.startTime, data.endTime, data.businessId)
    if (!isAvailable) {
      return { success: false, error: 'Time slot is not available' }
    }

    // Handle recurring appointments
    if (data.recurringPattern) {
      const recurringDates = generateRecurringDates(data.startTime, data.recurringPattern)
      const appointmentDuration = data.endTime.getTime() - data.startTime.getTime()

      // Check availability for all recurring dates
      const availabilityChecks = await Promise.all(
        recurringDates.map(date => {
          const recurringEndTime = new Date(date.getTime() + appointmentDuration)
          return checkAvailability(date, recurringEndTime, data.businessId)
        })
      )

      if (!availabilityChecks.every(available => available)) {
        return { success: false, error: 'Some recurring time slots are not available' }
      }

      // Create all recurring appointments
      const appointments = await Promise.all(
        recurringDates.map(date => {
          const recurringEndTime = new Date(date.getTime() + appointmentDuration)
          return prisma.appointment.create({
            data: {
              ...data,
              startTime: date,
              endTime: recurringEndTime,
              status: 'SCHEDULED'
            },
            include: {
              service: true,
              customer: true,
            },
          })
        })
      )

      return { success: true, appointments }
    }

    // Create single appointment
    const appointment = await prisma.appointment.create({
      data: {
        ...data,
        status: 'SCHEDULED'
      },
      include: {
        service: true,
        customer: true,
      },
    })

    return { success: true, appointment }
  } catch (error) {
    return { success: false, error: 'Failed to create appointment' }
  }
}
export async function getAppointments(businessId: string) {
  try {
    const userResult = await getUserAction()
    
    if (!userResult.success || !userResult.user) {
      return { success: false, error: 'User not authenticated' }
    }

    const appointments = await prisma.appointment.findMany({
      where: {
        businessId
      },
      include: {
        service: true,
        customer: true,
      },
      orderBy: {
        startTime: 'asc'
      }
    })

    return { success: true, appointments }
  } catch (error) {
    return { success: false, error: 'Failed to fetch appointments' }
  }
}

export async function updateAppointmentStatus(id: string, status: AppointmentStatus) {
  try {
    const userResult = await getUserAction()
    
    if (!userResult.success || !userResult.user) {
      return { success: false, error: 'User not authenticated' }
    }

    const appointment = await prisma.appointment.update({
      where: { id },
      data: { status },
      include: {
        service: true,
        customer: true,
      }
    })

    return { success: true, appointment }
  } catch (error) {
    return { success: false, error: 'Failed to update appointment status' }
  }
}

export async function deleteAppointment(id: string) {
  try {
    const userResult = await getUserAction()
    
    if (!userResult.success || !userResult.user) {
      return { success: false, error: 'User not authenticated' }
    }

    await prisma.appointment.delete({
      where: { id }
    })

    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to delete appointment' }
  }
}
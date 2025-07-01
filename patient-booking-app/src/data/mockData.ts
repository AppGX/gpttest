import type { Certificate, Service, ServiceSchedule, QueueInfo } from '@/types'

export const certificates: Certificate[] = [
  {
    id: 1,
    name: 'Справка для водительских прав',
    description: 'Медицинская справка для получения водительского удостоверения',
    price: 2500,
    requiredServices: [1, 2, 3, 4]
  },
  {
    id: 2,
    name: 'Справка для работы',
    description: 'Медицинская справка для трудоустройства',
    price: 1500,
    requiredServices: [1, 2, 5]
  },
  {
    id: 3,
    name: 'Справка для спортивной секции',
    description: 'Медицинская справка для занятий спортом',
    price: 1200,
    requiredServices: [1, 2, 6]
  },
  {
    id: 4,
    name: 'Справка для учебы',
    description: 'Медицинская справка для поступления в учебное заведение',
    price: 1000,
    requiredServices: [1, 2]
  },
  {
    id: 5,
    name: 'Справка для путевки',
    description: 'Медицинская справка для санаторно-курортного лечения',
    price: 1800,
    requiredServices: [1, 2, 3, 7]
  }
]

export const services: Service[] = [
  {
    id: 1,
    name: 'Терапевт',
    description: 'Осмотр врача-терапевта',
    duration: 30,
    price: 800,
    hasQueue: true,
    supportAppointments: true
  },
  {
    id: 2,
    name: 'Анализ крови',
    description: 'Общий анализ крови',
    duration: 15,
    price: 400,
    hasQueue: true,
    supportAppointments: false
  },
  {
    id: 3,
    name: 'Офтальмолог',
    description: 'Проверка зрения',
    duration: 20,
    price: 600,
    hasQueue: false,
    supportAppointments: true
  },
  {
    id: 4,
    name: 'Нарколог',
    description: 'Освидетельствование у нарколога',
    duration: 15,
    price: 500,
    hasQueue: false,
    supportAppointments: true
  },
  {
    id: 5,
    name: 'Флюорография',
    description: 'Рентгенологическое исследование грудной клетки',
    duration: 10,
    price: 300,
    hasQueue: true,
    supportAppointments: false
  },
  {
    id: 6,
    name: 'ЭКГ',
    description: 'Электрокардиография',
    duration: 15,
    price: 350,
    hasQueue: false,
    supportAppointments: true
  },
  {
    id: 7,
    name: 'Анализ мочи',
    description: 'Общий анализ мочи',
    duration: 10,
    price: 250,
    hasQueue: true,
    supportAppointments: false
  }
]

export const timeSlots: string[] = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30'
]

export const occupiedSlots: string[] = ['10:00', '14:00', '15:30']

// Функция для получения расписания услуги на дату
export const getServiceSchedule = (serviceId: number, date: string): ServiceSchedule => {
  const service = services.find(s => s.id === serviceId)
  if (!service) {
    return { serviceId, date, availableSlots: [] }
  }

  // Имитация разного расписания для разных дней
  const dayOfWeek = new Date(date).getDay()
  let availableSlots: string[] = []
  
  if (service.supportAppointments) {
    // Для услуг с записью по времени - имитируем занятость слотов
    switch (dayOfWeek) {
      case 1: // Понедельник - много свободных слотов
        availableSlots = timeSlots.filter(slot => !['10:00', '14:00'].includes(slot))
        break
      case 2: // Вторник - средняя загруженность
        availableSlots = timeSlots.filter(slot => !['09:30', '10:30', '11:00', '15:00'].includes(slot))
        break
      case 3: // Среда - высокая загруженность
        availableSlots = timeSlots.filter(slot => ['09:00', '12:30', '16:30', '17:30'].includes(slot))
        break
      case 4: // Четверг - все занято (только очередь)
        availableSlots = []
        break
      case 5: // Пятница - несколько слотов
        availableSlots = timeSlots.filter(slot => ['14:00', '14:30', '15:00'].includes(slot))
        break
      default: // Выходные - меньше слотов
        availableSlots = timeSlots.filter(slot => ['10:00', '11:00', '15:00', '16:00'].includes(slot))
    }
  }

  // Информация об очереди для услуг с живой очередью
  let queueInfo: QueueInfo | undefined
  if (service.hasQueue) {
    // Имитация данных очереди
    const queueLength = Math.floor(Math.random() * 15) + 3 // от 3 до 17 человек
    const estimatedWaitTime = queueLength * (service.duration + 5) // время + перерыв
    const nextHour = new Date().getHours() + Math.floor(estimatedWaitTime / 60)
    const nextMinute = Math.floor(estimatedWaitTime % 60)
    
    queueInfo = {
      length: queueLength,
      estimatedWaitTime,
      nextAvailableTime: `${nextHour.toString().padStart(2, '0')}:${nextMinute.toString().padStart(2, '0')}`
    }
  }

  return {
    serviceId,
    date,
    availableSlots,
    queueInfo
  }
}

// Функция для получения информации об очереди
export const getQueueInfo = (serviceId: number): QueueInfo => {
  const service = services.find(s => s.id === serviceId)
  if (!service || !service.hasQueue) {
    return { length: 0, estimatedWaitTime: 0 }
  }

  const queueLength = Math.floor(Math.random() * 12) + 5 // от 5 до 16 человек
  const estimatedWaitTime = queueLength * (service.duration + 5)
  const now = new Date()
  const nextTime = new Date(now.getTime() + estimatedWaitTime * 60000)
  
  return {
    length: queueLength,
    estimatedWaitTime,
    nextAvailableTime: `${nextTime.getHours().toString().padStart(2, '0')}:${nextTime.getMinutes().toString().padStart(2, '0')}`
  }
} 
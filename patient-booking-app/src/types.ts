// Интерфейсы для системы записи пациентов

export type CertificateCategory = 'certificates' | 'preconception' | 'screening'

export interface Certificate {
  id: number
  name: string
  description: string
  price: number
  requiredServices: number[]
  category: CertificateCategory
  icon?: string
}

export interface CertificateGroup {
  category: CertificateCategory
  title: string
  description: string
  icon: string
  certificates: Certificate[]
}

export interface Service {
  id: number
  name: string
  description: string
  duration: number // в минутах
  price: number
  hasQueue: boolean
  supportAppointments: boolean // поддерживает ли запись по времени
  category?: CertificateCategory[] // для каких категорий справок подходит
}

export interface TimeSlot {
  time: string
  available: boolean
}

// Расписание услуги на конкретную дату
export interface ServiceSchedule {
  serviceId: number
  date: string
  availableSlots: string[]
  queueInfo?: QueueInfo
}

export interface ServiceBooking {
  service: Service
  bookingType: 'appointment' | 'queue'
  date?: string
  time?: string
  queuePosition?: number
}

export interface Booking {
  id?: number
  certificate: Certificate
  serviceBookings: ServiceBooking[]
  createdAt?: Date
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
}

export interface BookingFormData {
  selectedCertificate: Certificate | null
  selectedServices: Service[]
  serviceBookings: ServiceBooking[]
  currentServiceIndex: number
}

export interface QueueInfo {
  length: number
  estimatedWaitTime: number // в минутах
  nextAvailableTime?: string // приблизительное время приема
}

export type BookingStep = 1 | 2 | 3 | 4 | 5 
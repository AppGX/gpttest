<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import type { Certificate, Service, BookingFormData, BookingStep, QueueInfo, ServiceBooking, ServiceSchedule } from './types'
import { certificates, services, getServiceSchedule, getQueueInfo } from './data/mockData'

// Реактивные данные
const currentStep = ref<BookingStep>(1)
const queueInfo = ref<QueueInfo>({ length: 8, estimatedWaitTime: 120 })
const currentServiceSchedule = ref<ServiceSchedule | null>(null)

const formData = ref<BookingFormData>({
  selectedCertificate: null,
  selectedServices: [],
  serviceBookings: [],
  currentServiceIndex: 0
})

// Вычисляемые свойства
const availableServices = computed(() => {
  if (!formData.value.selectedCertificate) return []
  return services.filter(service => 
    formData.value.selectedCertificate!.requiredServices.includes(service.id)
  )
})

const additionalServices = computed(() => {
  const requiredServiceIds = formData.value.selectedCertificate?.requiredServices || []
  const selectedServiceIds = formData.value.selectedServices.map(s => s.id)
  
  return services.filter(service => 
    !requiredServiceIds.includes(service.id) && 
    !selectedServiceIds.includes(service.id)
  )
})

const currentService = computed(() => {
  return formData.value.selectedServices[formData.value.currentServiceIndex]
})

const currentServiceBooking = computed(() => {
  return formData.value.serviceBookings[formData.value.currentServiceIndex]
})

const today = computed(() => {
  return new Date().toISOString().split('T')[0]
})

// Получение доступных слотов времени для текущей услуги и даты
const availableTimeSlots = computed(() => {
  if (!currentServiceSchedule.value) return []
  return currentServiceSchedule.value.availableSlots
})

// Определение доступных способов записи для текущей услуги
const availableBookingOptions = computed(() => {
  const service = currentService.value
  if (!service) return { appointment: false, queue: false }
  
  const schedule = currentServiceSchedule.value
  const hasAvailableSlots = schedule && schedule.availableSlots.length > 0
  
  return {
    appointment: service.supportAppointments && hasAvailableSlots,
    queue: service.hasQueue
  }
})

// Рекомендуемый тип записи
const recommendedBookingType = computed(() => {
  const options = availableBookingOptions.value
  
  // Приоритет: если есть доступное время - предлагаем запись по времени
  if (options.appointment) return 'appointment'
  if (options.queue) return 'queue'
  return null
})

const canProceedFromServices = computed(() => {
  return formData.value.selectedServices.length > 0
})

const canProceedFromBooking = computed(() => {
  const booking = currentServiceBooking.value
  if (!booking) return false
  
  if (booking.bookingType === 'appointment') {
    return booking.date && booking.time
  }
  return booking.bookingType === 'queue' && booking.date
})

const hasMoreServices = computed(() => {
  return formData.value.currentServiceIndex < formData.value.selectedServices.length - 1
})

const formattedDateTime = computed(() => {
  return (booking: ServiceBooking) => {
    if (!booking.date) return ''
    const date = new Date(booking.date)
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      weekday: 'long'
    }
    const dateStr = date.toLocaleDateString('ru-RU', options)
    
    if (booking.bookingType === 'appointment' && booking.time) {
      return `${dateStr} в ${booking.time}`
    } else if (booking.bookingType === 'queue') {
      const queueInfo = currentServiceSchedule.value?.queueInfo
      const timeInfo = queueInfo?.nextAvailableTime ? ` (ориентировочно в ${queueInfo.nextAvailableTime})` : ''
      return `${dateStr} - живая очередь${timeInfo}`
    }
    return dateStr
  }
})

const totalCost = computed(() => {
  let total = 0
  if (formData.value.selectedCertificate) {
    total += formData.value.selectedCertificate.price
  }
  formData.value.selectedServices.forEach(service => {
    total += service.price
  })
  return total
})

const totalDuration = computed(() => {
  return formData.value.selectedServices.reduce((total, service) => total + service.duration, 0)
})

// Наблюдатели
watch([currentService, () => currentServiceBooking.value?.date], async () => {
  if (currentService.value && currentServiceBooking.value?.date) {
    await updateServiceSchedule()
  }
})

// Методы
const updateServiceSchedule = async () => {
  const service = currentService.value
  const booking = currentServiceBooking.value
  
  if (!service || !booking?.date) {
    currentServiceSchedule.value = null
    return
  }
  
  currentServiceSchedule.value = getServiceSchedule(service.id, booking.date)
  
  // Автоматически устанавливаем рекомендуемый тип записи
  if (recommendedBookingType.value && !booking.bookingType) {
    setBookingType(recommendedBookingType.value as 'appointment' | 'queue')
  }
}

const selectCertificate = (certificate: Certificate) => {
  formData.value.selectedCertificate = certificate
  formData.value.selectedServices = []
  formData.value.serviceBookings = []
  formData.value.currentServiceIndex = 0
}

const toggleService = (service: Service) => {
  const index = formData.value.selectedServices.findIndex(s => s.id === service.id)
  if (index >= 0) {
    // Удаляем услугу
    formData.value.selectedServices.splice(index, 1)
    formData.value.serviceBookings.splice(index, 1)
  } else {
    // Добавляем услугу
    formData.value.selectedServices.push(service)
    formData.value.serviceBookings.push({
      service,
      bookingType: 'appointment', // временно, будет определен автоматически
      date: today.value // устанавливаем сегодняшнюю дату по умолчанию
    })
  }
}

const addAdditionalService = (service: Service) => {
  formData.value.selectedServices.push(service)
  formData.value.serviceBookings.push({
    service,
    bookingType: 'appointment',
    date: today.value
  })
}

const isServiceSelected = (service: Service) => {
  return formData.value.selectedServices.some(s => s.id === service.id)
}

const setBookingType = (type: 'appointment' | 'queue') => {
  if (formData.value.serviceBookings[formData.value.currentServiceIndex]) {
    formData.value.serviceBookings[formData.value.currentServiceIndex].bookingType = type
    // Сбрасываем время при смене типа
    if (type === 'queue') {
      formData.value.serviceBookings[formData.value.currentServiceIndex].time = undefined
      // Получаем позицию в очереди
      const queueInfo = getQueueInfo(currentService.value.id)
      formData.value.serviceBookings[formData.value.currentServiceIndex].queuePosition = queueInfo.length + 1
    }
  }
}

const setDate = async (date: string) => {
  if (formData.value.serviceBookings[formData.value.currentServiceIndex]) {
    formData.value.serviceBookings[formData.value.currentServiceIndex].date = date
    formData.value.serviceBookings[formData.value.currentServiceIndex].time = undefined
    await updateServiceSchedule()
  }
}

const handleDateInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  setDate(target.value)
}

const setTime = (time: string) => {
  if (formData.value.serviceBookings[formData.value.currentServiceIndex]) {
    formData.value.serviceBookings[formData.value.currentServiceIndex].time = time
  }
}

const nextStep = () => {
  if (currentStep.value < 5) {
    currentStep.value = (currentStep.value + 1) as BookingStep
    
    // При переходе на шаг 3, начинаем с первой услуги
    if (currentStep.value === 3) {
      formData.value.currentServiceIndex = 0
      // Инициализируем расписание для первой услуги
      if (currentService.value && currentServiceBooking.value?.date) {
        updateServiceSchedule()
      }
    }
  }
}

const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value = (currentStep.value - 1) as BookingStep
  }
}

const nextService = () => {
  if (hasMoreServices.value) {
    formData.value.currentServiceIndex++
    // Инициализируем расписание для следующей услуги
    if (currentService.value && currentServiceBooking.value?.date) {
      updateServiceSchedule()
    }
  } else {
    // Переходим к дополнительным услугам
    nextStep()
  }
}

const prevService = () => {
  if (formData.value.currentServiceIndex > 0) {
    formData.value.currentServiceIndex--
    // Инициализируем расписание для предыдущей услуги
    if (currentService.value && currentServiceBooking.value?.date) {
      updateServiceSchedule()
    }
  } else {
    prevStep()
  }
}

const skipAdditionalServices = () => {
  nextStep()
}

const confirmAllBookings = () => {
  console.log('All bookings confirmed:', {
    certificate: formData.value.selectedCertificate,
    serviceBookings: formData.value.serviceBookings
  })
  nextStep()
  
  // Обновляем очередь для услуг с живой очередью
  formData.value.serviceBookings.forEach(booking => {
    if (booking.bookingType === 'queue') {
      queueInfo.value.length++
      queueInfo.value.estimatedWaitTime = queueInfo.value.length * 15
    }
  })
}

const resetForm = () => {
  currentStep.value = 1
  formData.value = {
    selectedCertificate: null,
    selectedServices: [],
    serviceBookings: [],
    currentServiceIndex: 0
  }
}

const printBookings = () => {
  let printContent = `
    ТАЛОН ЗАПИСИ
    ============
    Справка: ${formData.value.selectedCertificate?.name}
    
    УСЛУГИ:
  `
  
  formData.value.serviceBookings.forEach((booking, index) => {
    printContent += `
    ${index + 1}. ${booking.service.name}
       ${booking.bookingType === 'appointment' 
         ? `Дата и время: ${formattedDateTime.value(booking)}` 
         : 'Тип записи: Живая очередь'
       }
       Стоимость: ${booking.service.price} ₽
       Длительность: ${booking.service.duration} мин
    `
  })
  
  printContent += `
    ============
    Общая стоимость: ${totalCost.value} ₽
    Общая длительность: ${totalDuration.value} мин
    ============
    Дата выдачи: ${new Date().toLocaleString('ru-RU')}
  `
  
  alert('Талон готов к печати!\n\n' + printContent)
}

// Хуки жизненного цикла
onMounted(() => {
  console.log('App mounted')
  
  // Имитация обновления очереди
  setInterval(() => {
    if (Math.random() > 0.7) {
      queueInfo.value.length = Math.max(0, queueInfo.value.length - 1)
      queueInfo.value.estimatedWaitTime = queueInfo.value.length * 15
    }
  }, 30000)
})
</script>

<template>
  <div id="app">
    <div class="container">
      <h1>🏥 Система записи пациентов</h1>
      
      <!-- Индикатор прогресса -->
      <div class="progress-bar">
        <div class="progress-steps">
          <div 
            v-for="step in 5" 
            :key="step"
            class="progress-step"
            :class="{ 
              'active': currentStep === step, 
              'completed': currentStep > step 
            }"
          >
            {{ step }}
          </div>
        </div>
      </div>

      <!-- Шаг 1: Выбор справки -->
      <div v-if="currentStep === 1" class="step">
        <h2>📋 Выберите справку для получения</h2>
        <div class="certificate-list">
          <div 
            v-for="certificate in certificates" 
            :key="certificate.id"
            class="certificate-item"
            @click="selectCertificate(certificate)"
            :class="{ 'selected': formData.selectedCertificate?.id === certificate.id }"
          >
            <h3>{{ certificate.name }}</h3>
            <p>{{ certificate.description }}</p>
            <div class="price">{{ certificate.price }} ₽</div>
          </div>
        </div>
        <div style="text-align: center; margin-top: 2rem;">
          <button 
            v-if="formData.selectedCertificate" 
            @click="nextStep()" 
            class="btn btn-primary"
          >
            Продолжить →
          </button>
        </div>
      </div>

      <!-- Шаг 2: Выбор услуг -->
      <div v-if="currentStep === 2" class="step">
        <h2>🔬 Выберите необходимые услуги</h2>
        <p style="text-align: center; margin-bottom: 2rem; color: var(--text-secondary);">
          Для справки "{{ formData.selectedCertificate?.name }}" доступны следующие услуги:
        </p>
        
        <div class="services-list">
          <div 
            v-for="service in availableServices" 
            :key="service.id"
            class="service-item"
            @click="toggleService(service)"
            :class="{ 
              'selected': isServiceSelected(service),
              'multiple-select': true
            }"
          >
            <div class="service-checkbox">
              <span v-if="isServiceSelected(service)">✓</span>
            </div>
            <div class="service-content">
              <h3>{{ service.name }}</h3>
              <p>{{ service.description }}</p>
              <div class="service-details">
                <div class="duration">{{ service.duration }} мин</div>
                <div class="price">{{ service.price }} ₽</div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="formData.selectedServices.length > 0" class="selected-summary">
          <h3>📝 Выбранные услуги ({{ formData.selectedServices.length }})</h3>
          <div class="selected-list">
            <div v-for="service in formData.selectedServices" :key="service.id" class="selected-item">
              <span>{{ service.name }}</span>
              <span>{{ service.price }} ₽</span>
            </div>
          </div>
          <div class="summary-total">
            <strong>Итого услуг: {{ formData.selectedServices.reduce((sum, s) => sum + s.price, 0) }} ₽</strong>
          </div>
        </div>

        <div class="navigation">
          <button @click="prevStep()" class="btn btn-secondary">← Назад</button>
          <button 
            v-if="canProceedFromServices" 
            @click="nextStep()" 
            class="btn btn-primary"
          >
            Настроить время записи →
          </button>
        </div>
      </div>

      <!-- Шаг 3: Настройка времени для каждой услуги -->
      <div v-if="currentStep === 3" class="step">
        <h2>⏰ Настройка записи</h2>
        <div class="service-progress">
          <p>Услуга {{ formData.currentServiceIndex + 1 }} из {{ formData.selectedServices.length }}</p>
          <div class="progress-indicator">
            <div 
              v-for="(service, index) in formData.selectedServices" 
              :key="service.id"
              class="service-indicator"
              :class="{ 
                'active': index === formData.currentServiceIndex,
                'completed': index < formData.currentServiceIndex 
              }"
            >
              {{ index + 1 }}
            </div>
          </div>
        </div>

        <div v-if="currentService" class="current-service">
          <h3>🔹 {{ currentService.name }}</h3>
          <p>{{ currentService.description }}</p>
          <div class="service-info">
            <span>Длительность: {{ currentService.duration }} мин</span>
            <span>Стоимость: {{ currentService.price }} ₽</span>
          </div>
        </div>

        <!-- Выбор даты -->
        <div class="date-selection">
          <h3>📅 Выберите дату</h3>
          <div class="date-picker">
            <input 
              type="date" 
              :value="currentServiceBooking?.date || today"
              @input="handleDateInput"
              :min="today"
            >
          </div>
        </div>

        <!-- Автоматически определенные варианты записи -->
        <div v-if="currentServiceBooking?.date && currentServiceSchedule" class="smart-booking-options">
          <!-- Рекомендация системы -->
          <div v-if="recommendedBookingType" class="recommendation">
            <div class="recommendation-badge">
              <span v-if="recommendedBookingType === 'appointment'">✨ Рекомендуем запись по времени</span>
              <span v-else>✨ Доступна только живая очередь</span>
            </div>
            <p class="recommendation-text">
              <span v-if="recommendedBookingType === 'appointment'">
                На выбранную дату есть {{ availableTimeSlots.length }} свободных слотов времени
              </span>
              <span v-else>
                На выбранную дату нет свободного времени, но доступна живая очередь
              </span>
            </p>
          </div>

          <!-- Доступные варианты записи -->
          <div class="booking-options">
            <!-- Запись по времени -->
            <div 
              v-if="availableBookingOptions.appointment"
              class="option-card available" 
              @click="setBookingType('appointment')" 
              :class="{ 'selected': currentServiceBooking?.bookingType === 'appointment' }"
            >
              <div class="option-header">
                <h3>📅 Запись по времени</h3>
                <span class="availability-badge available">Доступно {{ availableTimeSlots.length }} слотов</span>
              </div>
              <p>Выберите точное время для прохождения услуги</p>
            </div>
            
            <div 
              v-else-if="currentService?.supportAppointments"
              class="option-card unavailable"
            >
              <div class="option-header">
                <h3>📅 Запись по времени</h3>
                <span class="availability-badge unavailable">Нет свободного времени</span>
              </div>
              <p>На выбранную дату все слоты времени заняты</p>
            </div>
            
            <!-- Живая очередь -->
            <div 
              v-if="availableBookingOptions.queue"
              class="option-card available" 
              @click="setBookingType('queue')" 
              :class="{ 'selected': currentServiceBooking?.bookingType === 'queue' }"
            >
              <div class="option-header">
                <h3>🕒 Живая очередь</h3>
                <span class="availability-badge available">Доступно</span>
              </div>
              <p>Пройдите услугу без предварительной записи по времени</p>
              <div v-if="currentServiceSchedule?.queueInfo" class="queue-preview">
                <small>
                  В очереди: {{ currentServiceSchedule.queueInfo.length }} чел. 
                  (ориентировочно {{ currentServiceSchedule.queueInfo.nextAvailableTime }})
                </small>
              </div>
            </div>

            <div 
              v-else-if="currentService?.hasQueue"
              class="option-card unavailable"
            >
              <div class="option-header">
                <h3>🕒 Живая очередь</h3>
                <span class="availability-badge unavailable">Недоступно</span>
              </div>
              <p>Данная услуга не поддерживает живую очередь</p>
            </div>
          </div>

          <!-- Сообщение если нет доступных вариантов -->
          <div v-if="!availableBookingOptions.appointment && !availableBookingOptions.queue" class="no-options">
            <div class="alert alert-warning">
              <h3>⚠️ Нет доступных вариантов записи</h3>
              <p>На выбранную дату запись недоступна. Попробуйте выбрать другую дату.</p>
            </div>
          </div>
        </div>

        <!-- Выбор времени для записи по времени -->
        <div v-if="currentServiceBooking?.bookingType === 'appointment' && currentServiceBooking?.date" class="time-selection">
          <h3>🕐 Выберите время</h3>
          <div v-if="availableTimeSlots.length > 0" class="time-slots">
            <div class="time-grid">
              <button 
                v-for="time in availableTimeSlots" 
                :key="time"
                @click="setTime(time)"
                class="time-slot"
                :class="{ 'selected': currentServiceBooking?.time === time }"
              >
                {{ time }}
              </button>
            </div>
          </div>
          <div v-else class="no-time-slots">
            <p>На выбранную дату нет свободного времени</p>
          </div>
        </div>

        <!-- Детали живой очереди -->
        <div v-if="currentServiceBooking?.bookingType === 'queue' && currentServiceSchedule?.queueInfo" class="queue-details">
          <div class="queue-info-card">
            <h3>📊 Информация об очереди</h3>
            <div class="queue-stats">
              <div class="stat">
                <span class="stat-label">В очереди:</span>
                <span class="stat-value">{{ currentServiceSchedule.queueInfo.length }} человек</span>
              </div>
              <div class="stat">
                <span class="stat-label">Ожидание:</span>
                <span class="stat-value">~{{ currentServiceSchedule.queueInfo.estimatedWaitTime }} мин</span>
              </div>
              <div class="stat">
                <span class="stat-label">Прием около:</span>
                <span class="stat-value">{{ currentServiceSchedule.queueInfo.nextAvailableTime }}</span>
              </div>
            </div>
            <div class="queue-position" v-if="currentServiceBooking?.queuePosition">
              <p><strong>Ваша позиция в очереди: {{ currentServiceBooking.queuePosition }}</strong></p>
            </div>
          </div>
        </div>

        <div class="navigation">
          <button @click="prevService()" class="btn btn-secondary">← Назад</button>
          <button 
            v-if="canProceedFromBooking" 
            @click="nextService()" 
            class="btn btn-primary"
          >
            {{ hasMoreServices ? 'Следующая услуга →' : 'К дополнительным услугам →' }}
          </button>
        </div>
      </div>

      <!-- Шаг 4: Дополнительные услуги -->
      <div v-if="currentStep === 4" class="step">
        <h2>➕ Дополнительные услуги</h2>
        <p style="text-align: center; margin-bottom: 2rem; color: var(--text-secondary);">
          Хотите записаться на дополнительные услуги?
        </p>

        <div v-if="additionalServices.length > 0" class="services-list">
          <div 
            v-for="service in additionalServices" 
            :key="service.id"
            class="service-item additional-service"
            @click="addAdditionalService(service)"
          >
            <div class="service-content">
              <h3>{{ service.name }}</h3>
              <p>{{ service.description }}</p>
              <div class="service-details">
                <div class="duration">{{ service.duration }} мин</div>
                <div class="price">{{ service.price }} ₽</div>
              </div>
            </div>
            <div class="add-button">+</div>
          </div>
        </div>

        <div v-else class="no-additional">
          <p>🎉 Все доступные услуги уже выбраны!</p>
        </div>

        <div class="navigation">
          <button @click="prevStep()" class="btn btn-secondary">← Настроить время</button>
          <button @click="skipAdditionalServices()" class="btn btn-primary">
            Завершить выбор →
          </button>
        </div>
      </div>

      <!-- Шаг 5: Подтверждение всех записей -->
      <div v-if="currentStep === 5" class="step confirmation">
        <h2>✅ Подтверждение записей</h2>
        
        <div class="booking-summary">
          <h3>📄 Детали всех записей</h3>
          
          <div class="certificate-info">
            <h4>📋 Справка</h4>
            <p>{{ formData.selectedCertificate?.name }} - {{ formData.selectedCertificate?.price }} ₽</p>
          </div>

          <div class="services-info">
            <h4>🔬 Услуги ({{ formData.serviceBookings.length }})</h4>
            <div v-for="(booking, index) in formData.serviceBookings" :key="index" class="booking-item">
              <div class="booking-header">
                <h5>{{ index + 1 }}. {{ booking.service.name }}</h5>
                <span class="booking-price">{{ booking.service.price }} ₽</span>
              </div>
              <div class="booking-details">
                <p>{{ booking.service.description }}</p>
                <div class="booking-meta">
                  <span>⏱️ {{ booking.service.duration }} мин</span>
                  <span v-if="booking.bookingType === 'appointment' && booking.date && booking.time">
                    📅 {{ formattedDateTime(booking) }}
                  </span>
                  <span v-else-if="booking.bookingType === 'queue'">
                    🕒 Живая очередь
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div class="summary-totals">
            <div class="total-row">
              <strong>Общая стоимость: {{ totalCost }} ₽</strong>
            </div>
            <div class="total-row">
              <strong>Общая длительность: {{ totalDuration }} мин</strong>
            </div>
            <div class="total-row">
              <strong>Количество услуг: {{ formData.serviceBookings.length }}</strong>
            </div>
          </div>
        </div>
        
        <div class="actions">
          <button @click="resetForm()" class="btn btn-secondary">🔄 Новая запись</button>
          <button @click="printBookings()" class="btn btn-secondary">🖨️ Распечатать талон</button>
          <button @click="confirmAllBookings()" class="btn btn-primary">✅ Подтвердить все записи</button>
        </div>
      </div>
    </div>
  </div>
</template>

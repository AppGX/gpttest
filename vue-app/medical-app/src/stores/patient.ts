import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Patient {
  id: string
  firstName: string
  lastName: string
  birthDate: string
  phone: string
  email: string
  contraindications: string[]
}

export const usePatientStore = defineStore('patient', () => {
  // State
  const currentPatient = ref<Patient>({
    id: 'patient-001',
    firstName: 'Иван',
    lastName: 'Петров',
    birthDate: '1985-05-15',
    phone: '+7 (999) 123-45-67',
    email: 'ivan.petrov@email.com',
    contraindications: []
  })

  const selectedService = ref<string>('')
  const currentStep = ref<number>(1)

  // Getters
  const fullName = computed(() => 
    `${currentPatient.value.firstName} ${currentPatient.value.lastName}`
  )

  const hasContraindications = computed(() => 
    currentPatient.value.contraindications.length > 0
  )

  // Actions
  function updatePatient(patient: Partial<Patient>) {
    Object.assign(currentPatient.value, patient)
  }

  function addContraindication(contraindication: string) {
    if (!currentPatient.value.contraindications.includes(contraindication)) {
      currentPatient.value.contraindications.push(contraindication)
    }
  }

  function removeContraindication(contraindication: string) {
    const index = currentPatient.value.contraindications.indexOf(contraindication)
    if (index > -1) {
      currentPatient.value.contraindications.splice(index, 1)
    }
  }

  function setSelectedService(service: string) {
    selectedService.value = service
  }

  function setCurrentStep(step: number) {
    currentStep.value = step
  }

  function resetPatientData() {
    selectedService.value = ''
    currentStep.value = 1
    currentPatient.value.contraindications = []
  }

  // Имитация противопоказаний для демо
  function generateRandomContraindications(serviceType: string) {
    const allContraindications = [
      'Гипертония',
      'Диабет',
      'Аллергия на лекарства',
      'Беременность',
      'Сердечная недостаточность',
      'Почечная недостаточность',
      'Онкология в анамнезе'
    ]

    // Случайная генерация противопоказаний
    const randomCount = Math.floor(Math.random() * 3) // 0-2 противопоказания
    const shuffled = allContraindications.sort(() => 0.5 - Math.random())
    const selected = shuffled.slice(0, randomCount)
    
    currentPatient.value.contraindications = selected
  }

  return {
    // State
    currentPatient,
    selectedService,
    currentStep,
    // Getters
    fullName,
    hasContraindications,
    // Actions
    updatePatient,
    addContraindication,
    removeContraindication,
    setSelectedService,
    setCurrentStep,
    resetPatientData,
    generateRandomContraindications
  }
}) 
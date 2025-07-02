import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Procedure {
  id: string
  name: string
  description: string
  requiredDocuments: string[]
  contraindications: string[]
  validityPeriod: number // в днях
  status: 'required' | 'completed' | 'contraindicated'
  isOptional?: boolean
}

export interface MedicalService {
  id: string
  name: string
  description: string
  procedures: Procedure[]
  estimatedTime: number // в днях
  icon: string
}

export const useServicesStore = defineStore('services', () => {
  // State
  const availableServices = ref<MedicalService[]>([
    {
      id: 'spravka',
      name: 'Справка',
      description: 'Получение медицинской справки для различных целей',
      icon: 'mdi-file-document-outline',
      estimatedTime: 3,
      procedures: [
        {
          id: 'general-analysis',
          name: 'Общий анализ крови',
          description: 'Клинический анализ крови с лейкоцитарной формулой',
          requiredDocuments: ['Результаты анализа крови'],
          contraindications: ['Острое воспалительное заболевание'],
          validityPeriod: 14,
          status: 'required'
        },
        {
          id: 'urine-analysis',
          name: 'Общий анализ мочи',
          description: 'Клинический анализ мочи',
          requiredDocuments: ['Результаты анализа мочи'],
          contraindications: [],
          validityPeriod: 14,
          status: 'required'
        },
        {
          id: 'therapist-exam',
          name: 'Осмотр терапевта',
          description: 'Консультация и осмотр врача-терапевта',
          requiredDocuments: ['Заключение терапевта'],
          contraindications: ['Инфекционное заболевание'],
          validityPeriod: 30,
          status: 'required'
        }
      ]
    },
    {
      id: 'screening',
      name: 'Скрининг',
      description: 'Комплексное профилактическое обследование',
      icon: 'mdi-heart-pulse',
      estimatedTime: 7,
      procedures: [
        {
          id: 'blood-biochemistry',
          name: 'Биохимический анализ крови',
          description: 'Биохимическое исследование крови',
          requiredDocuments: ['Результаты биохимии крови'],
          contraindications: ['Диабет', 'Почечная недостаточность'],
          validityPeriod: 30,
          status: 'required'
        },
        {
          id: 'ecg',
          name: 'ЭКГ',
          description: 'Электрокардиография',
          requiredDocuments: ['Результаты ЭКГ'],
          contraindications: ['Сердечная недостаточность'],
          validityPeriod: 30,
          status: 'required'
        },
        {
          id: 'fluorography',
          name: 'Рентген грудной клетки',
          description: 'Рентгенологическое исследование органов грудной клетки',
          requiredDocuments: ['Результаты рентгена'],
          contraindications: ['Беременность'],
          validityPeriod: 365,
          status: 'required'
        },
        {
          id: 'ophthalmologist',
          name: 'Осмотр офтальмолога',
          description: 'Консультация врача-офтальмолога',
          requiredDocuments: ['Заключение офтальмолога'],
          contraindications: [],
          validityPeriod: 365,
          status: 'required',
          isOptional: true
        }
      ]
    },
    {
      id: 'pregravidarka',
      name: 'Прегравидарка',
      description: 'Подготовка к планированию беременности',
      icon: 'mdi-baby-face-outline',
      estimatedTime: 14,
      procedures: [
        {
          id: 'gynecologist-exam',
          name: 'Осмотр гинеколога',
          description: 'Консультация и осмотр врача-гинеколога',
          requiredDocuments: ['Заключение гинеколога'],
          contraindications: ['Острое воспалительное заболевание'],
          validityPeriod: 30,
          status: 'required'
        },
        {
          id: 'hormones-analysis',
          name: 'Анализ на гормоны',
          description: 'Исследование гормонального профиля',
          requiredDocuments: ['Результаты анализа на гормоны'],
          contraindications: ['Гормональная терапия'],
          validityPeriod: 60,
          status: 'required'
        },
        {
          id: 'infections-analysis',
          name: 'Анализ на инфекции',
          description: 'Исследование на TORCH-инфекции',
          requiredDocuments: ['Результаты анализа на инфекции'],
          contraindications: [],
          validityPeriod: 90,
          status: 'required'
        },
        {
          id: 'ultrasound',
          name: 'УЗИ органов малого таза',
          description: 'Ультразвуковое исследование',
          requiredDocuments: ['Результаты УЗИ'],
          contraindications: [],
          validityPeriod: 90,
          status: 'required'
        }
      ]
    }
  ])

  const currentService = ref<MedicalService | null>(null)
  const routeSheet = ref<Procedure[]>([])

  // Getters
  const getServiceById = computed(() => {
    return (id: string) => availableServices.value.find(service => service.id === id)
  })

  const requiredProcedures = computed(() => 
    routeSheet.value.filter(proc => proc.status === 'required')
  )

  const completedProcedures = computed(() =>
    routeSheet.value.filter(proc => proc.status === 'completed')
  )

  const contraindicatedProcedures = computed(() =>
    routeSheet.value.filter(proc => proc.status === 'contraindicated')
  )

  const isRouteSheetComplete = computed(() =>
    requiredProcedures.value.length === 0
  )

  // Actions
  function selectService(serviceId: string) {
    const service = availableServices.value.find(s => s.id === serviceId)
    if (service) {
      currentService.value = service
      generateRouteSheet(service)
    }
  }

  function generateRouteSheet(service: MedicalService, contraindications: string[] = []) {
    routeSheet.value = service.procedures.map(procedure => {
      // Проверяем противопоказания
      const hasContraindication = contraindications.some(contra => 
        procedure.contraindications.includes(contra)
      )

      return {
        ...procedure,
        status: hasContraindication ? 'contraindicated' : 'required'
      }
    })
  }

  function updateProcedureStatus(procedureId: string, status: Procedure['status']) {
    const procedure = routeSheet.value.find(p => p.id === procedureId)
    if (procedure) {
      procedure.status = status
    }
  }

  function addAlternativeProcedure(originalProcedureId: string) {
    const alternatives: Record<string, Procedure> = {
      'fluorography': {
        id: 'chest-mri',
        name: 'МРТ грудной клетки',
        description: 'Магнитно-резонансная томография (альтернатива рентгену)',
        requiredDocuments: ['Результаты МРТ'],
        contraindications: ['Металлические импланты'],
        validityPeriod: 365,
        status: 'required'
      }
    }

    const alternative = alternatives[originalProcedureId]
    if (alternative && !routeSheet.value.find(p => p.id === alternative.id)) {
      routeSheet.value.push(alternative)
    }
  }

  function resetRouteSheet() {
    currentService.value = null
    routeSheet.value = []
  }

  return {
    // State
    availableServices,
    currentService,
    routeSheet,
    // Getters
    getServiceById,
    requiredProcedures,
    completedProcedures,
    contraindicatedProcedures,
    isRouteSheetComplete,
    // Actions
    selectService,
    generateRouteSheet,
    updateProcedureStatus,
    addAlternativeProcedure,
    resetRouteSheet
  }
}) 
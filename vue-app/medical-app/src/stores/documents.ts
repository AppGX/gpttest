import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Document {
  id: string
  type: string
  fileName: string
  uploadDate: string
  expiryDate: string
  procedureId: string
  fileUrl: string
  isValid: boolean
  size?: number
  mimeType?: string
}

export const useDocumentsStore = defineStore('documents', () => {
  // State
  const uploadedDocuments = ref<Document[]>([])
  const existingDocuments = ref<Document[]>([
    // Имитация уже существующих документов в системе
    {
      id: 'doc-001',
      type: 'Результаты анализа крови',
      fileName: 'blood_analysis_2024.pdf',
      uploadDate: '2024-01-15',
      expiryDate: '2024-01-29',
      procedureId: 'general-analysis',
      fileUrl: '/documents/blood_analysis_2024.pdf',
      isValid: true,
      size: 1024000,
      mimeType: 'application/pdf'
    },
    {
      id: 'doc-002',
      type: 'Результаты ЭКГ',
      fileName: 'ecg_2023.pdf',
      uploadDate: '2023-12-10',
      expiryDate: '2024-01-09',
      procedureId: 'ecg',
      fileUrl: '/documents/ecg_2023.pdf',
      isValid: false, // Просрочен
      size: 2048000,
      mimeType: 'application/pdf'
    }
  ])
  
  const isUploading = ref(false)
  const uploadProgress = ref(0)

  // Getters
  const validDocuments = computed(() => 
    [...uploadedDocuments.value, ...existingDocuments.value].filter(doc => doc.isValid)
  )

  const expiredDocuments = computed(() =>
    [...uploadedDocuments.value, ...existingDocuments.value].filter(doc => !doc.isValid)
  )

  const getDocumentsByProcedure = computed(() => {
    return (procedureId: string) => 
      [...uploadedDocuments.value, ...existingDocuments.value]
        .filter(doc => doc.procedureId === procedureId)
  })

  const getDocumentsByType = computed(() => {
    return (type: string) =>
      [...uploadedDocuments.value, ...existingDocuments.value]
        .filter(doc => doc.type === type)
  })

  const totalDocuments = computed(() => 
    uploadedDocuments.value.length + existingDocuments.value.length
  )

  const completedProcedures = computed(() => {
    const procedureIds = new Set(
      validDocuments.value.map(doc => doc.procedureId)
    )
    return Array.from(procedureIds)
  })

  // Actions
  function uploadDocument(file: File, procedureId: string, type: string): Promise<Document> {
    return new Promise((resolve, reject) => {
      isUploading.value = true
      uploadProgress.value = 0

      // Имитация загрузки с прогрессом
      const interval = setInterval(() => {
        uploadProgress.value += 10
        if (uploadProgress.value >= 100) {
          clearInterval(interval)
          
          const newDocument: Document = {
            id: `doc-${Date.now()}`,
            type,
            fileName: file.name,
            uploadDate: new Date().toISOString().split('T')[0],
            expiryDate: calculateExpiryDate(type),
            procedureId,
            fileUrl: URL.createObjectURL(file),
            isValid: true,
            size: file.size,
            mimeType: file.type
          }

          uploadedDocuments.value.push(newDocument)
          isUploading.value = false
          uploadProgress.value = 0
          resolve(newDocument)
        }
      }, 200)

      // Имитация ошибки загрузки (1% вероятность)
      setTimeout(() => {
        if (Math.random() < 0.01) {
          clearInterval(interval)
          isUploading.value = false
          uploadProgress.value = 0
          reject(new Error('Ошибка загрузки файла'))
        }
      }, 1000)
    })
  }

  function removeDocument(documentId: string) {
    const uploadedIndex = uploadedDocuments.value.findIndex(doc => doc.id === documentId)
    if (uploadedIndex > -1) {
      const document = uploadedDocuments.value[uploadedIndex]
      if (document.fileUrl.startsWith('blob:')) {
        URL.revokeObjectURL(document.fileUrl)
      }
      uploadedDocuments.value.splice(uploadedIndex, 1)
    }
  }

  function replaceDocument(oldDocumentId: string, file: File, procedureId: string, type: string): Promise<Document> {
    removeDocument(oldDocumentId)
    return uploadDocument(file, procedureId, type)
  }

  function validateDocument(documentId: string): boolean {
    const document = [...uploadedDocuments.value, ...existingDocuments.value]
      .find(doc => doc.id === documentId)
    
    if (!document) return false

    const now = new Date()
    const expiryDate = new Date(document.expiryDate)
    const isValid = expiryDate > now

    // Обновляем статус валидности
    document.isValid = isValid
    
    return isValid
  }

  function calculateExpiryDate(documentType: string): string {
    const now = new Date()
    const validityPeriods: Record<string, number> = {
      'Результаты анализа крови': 14,
      'Результаты анализа мочи': 14,
      'Заключение терапевта': 30,
      'Результаты биохимии крови': 30,
      'Результаты ЭКГ': 30,
      'Результаты рентгена': 365,
      'Заключение офтальмолога': 365,
      'Заключение гинеколога': 30,
      'Результаты анализа на гормоны': 60,
      'Результаты анализа на инфекции': 90,
      'Результаты УЗИ': 90,
      'Результаты МРТ': 365
    }

    const validityDays = validityPeriods[documentType] || 30
    const expiryDate = new Date(now.getTime() + validityDays * 24 * 60 * 60 * 1000)
    return expiryDate.toISOString().split('T')[0]
  }

  function checkDocumentExpiry() {
    const now = new Date()
    
    // Проверяем все документы на просроченность
    const allDocuments = [...uploadedDocuments.value, ...existingDocuments.value]
    allDocuments.forEach(document => {
      const expiryDate = new Date(document.expiryDate)
      document.isValid = expiryDate > now
    })
  }

  function getRequiredDocuments(procedureIds: string[]): string[] {
    // Моковые данные о требуемых документах для процедур
    const procedureDocuments: Record<string, string[]> = {
      'general-analysis': ['Результаты анализа крови'],
      'urine-analysis': ['Результаты анализа мочи'],
      'therapist-exam': ['Заключение терапевта'],
      'blood-biochemistry': ['Результаты биохимии крови'],
      'ecg': ['Результаты ЭКГ'],
      'fluorography': ['Результаты рентгена'],
      'ophthalmologist': ['Заключение офтальмолога'],
      'gynecologist-exam': ['Заключение гинеколога'],
      'hormones-analysis': ['Результаты анализа на гормоны'],
      'infections-analysis': ['Результаты анализа на инфекции'],
      'ultrasound': ['Результаты УЗИ'],
      'chest-mri': ['Результаты МРТ']
    }

    const requiredDocs = new Set<string>()
    procedureIds.forEach(procedureId => {
      const docs = procedureDocuments[procedureId] || []
      docs.forEach(doc => requiredDocs.add(doc))
    })

    return Array.from(requiredDocs)
  }

  function getMissingDocuments(procedureIds: string[]): string[] {
    const required = getRequiredDocuments(procedureIds)
    const available = validDocuments.value.map(doc => doc.type)
    
    return required.filter(docType => !available.includes(docType))
  }

  function resetDocuments() {
    // Очищаем загруженные документы и освобождаем URL
    uploadedDocuments.value.forEach(doc => {
      if (doc.fileUrl.startsWith('blob:')) {
        URL.revokeObjectURL(doc.fileUrl)
      }
    })
    uploadedDocuments.value = []
    
    // Сбрасываем состояние загрузки
    isUploading.value = false
    uploadProgress.value = 0
  }

  // Инициализация: проверяем просроченные документы при загрузке
  checkDocumentExpiry()

  return {
    // State
    uploadedDocuments,
    existingDocuments,
    isUploading,
    uploadProgress,
    // Getters
    validDocuments,
    expiredDocuments,
    getDocumentsByProcedure,
    getDocumentsByType,
    totalDocuments,
    completedProcedures,
    // Actions
    uploadDocument,
    removeDocument,
    replaceDocument,
    validateDocument,
    calculateExpiryDate,
    checkDocumentExpiry,
    getRequiredDocuments,
    getMissingDocuments,
    resetDocuments
  }
}) 
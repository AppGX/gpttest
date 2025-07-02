<template>
  <v-container>
    <v-row class="mb-6">
      <v-col cols="12">
        <v-btn
          variant="text"
          @click="goBack"
          class="mb-4"
        >
          <v-icon class="mr-2">mdi-arrow-left</v-icon>
          Назад
        </v-btn>
        
        <h1 class="text-h3 text-primary mb-4">
          Управление услугами
        </h1>
        <p class="text-h6 text-grey-darken-1">
          Записывайтесь на процедуры, загружайте результаты или отмечайте пройденные услуги
        </p>
      </v-col>
    </v-row>

    <!-- Прогресс-бар -->
    <v-row class="mb-6">
      <v-col cols="12">
        <v-stepper :model-value="3" alt-labels hide-actions non-linear>
          <v-stepper-header>
            <v-stepper-item title="Выбор услуги" :value="1" :complete="true" icon="mdi-medical-bag" />
            <v-divider />
            <v-stepper-item title="Маршрутный лист" :value="2" :complete="true" icon="mdi-clipboard-list" />
            <v-divider />
            <v-stepper-item title="Управление услугами" :value="3" :complete="false" icon="mdi-clipboard-check" />
            <v-divider />
            <v-stepper-item title="Завершение" :value="4" :complete="false" icon="mdi-check-circle" />
          </v-stepper-header>
        </v-stepper>
      </v-col>
    </v-row>

    <!-- Пройденные услуги -->
    <v-row v-if="completedProceduresInfo.length" class="mb-6">
      <v-col cols="12">
        <v-card>
          <v-card-title>
            <v-icon class="mr-2">mdi-check-circle</v-icon>
            Пройденные услуги
          </v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item
                v-for="procedure in completedProceduresInfo"
                :key="procedure.id"
              >
                <template #prepend>
                  <v-avatar
                    color="success"
                    size="small"
                  >
                    <v-icon
                      icon="mdi-check"
                      color="white"
                      size="small"
                    />
                  </v-avatar>
                </template>
                
                <v-list-item-title>{{ procedure.name }}</v-list-item-title>
                <v-list-item-subtitle>
                  Пройдена: {{ formatDate(procedure.completedDate) }} • Срок действия: {{ procedure.validityPeriod }} дн.
                </v-list-item-subtitle>
                
                <template #append>
                  <div class="d-flex flex-column align-end">
                    <v-chip
                      color="success"
                      size="small"
                      variant="outlined"
                      class="mb-1"
                    >
                      Завершено
                    </v-chip>
                    <div class="text-caption text-success">
                      Действует до: {{ formatDate(procedure.expiryDate) }}
                    </div>
                  </div>
                </template>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Список всех процедур -->
    <v-row class="mb-6">
      <v-col cols="12">
        <v-card>
          <v-card-title>
            <v-icon class="mr-2">mdi-clipboard-list</v-icon>
            Процедуры маршрутного листа
          </v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item
                v-for="procedure in allProcedures"
                :key="procedure.id"
              >
                <template #prepend>
                  <v-avatar
                    :color="getProcedureStatusColor(procedure.status)"
                    size="small"
                  >
                    <v-icon
                      :icon="getProcedureStatusIcon(procedure.status)"
                      color="white"
                      size="small"
                    />
                  </v-avatar>
                </template>
                
                <v-list-item-title>{{ procedure.name }}</v-list-item-title>
                <v-list-item-subtitle>
                  {{ procedure.description }} • Срок действия: {{ procedure.validityPeriod }} дн.
                </v-list-item-subtitle>
                
                <template #append>
                  <div class="d-flex align-center gap-2">
                    <v-chip
                      :color="getProcedureStatusColor(procedure.status)"
                      size="small"
                      variant="outlined"
                      class="mr-2"
                    >
                      {{ getProcedureStatusText(procedure.status) }}
                    </v-chip>
                    
                    <!-- Кнопки действий в зависимости от статуса -->
                    <div v-if="procedure.status === 'required'" class="d-flex gap-1">
                      <v-btn
                        size="small"
                        color="primary"
                        variant="outlined"
                        @click="scheduleAppointment(procedure)"
                      >
                        <v-icon class="mr-1">mdi-calendar-plus</v-icon>
                        Записаться
                      </v-btn>
                      
                      <v-btn
                        size="small"
                        color="info"
                        variant="outlined"
                        @click="uploadResults(procedure)"
                      >
                        <v-icon class="mr-1">mdi-upload</v-icon>
                        Загрузить результат
                      </v-btn>
                      
                      <v-btn
                        size="small"
                        color="success"
                        variant="outlined"
                        @click="markAsCompleted(procedure)"
                      >
                        <v-icon class="mr-1">mdi-check</v-icon>
                        Отметить пройденной
                      </v-btn>
                    </div>
                    
                    <div v-else-if="procedure.status === 'completed'" class="d-flex gap-1">
                      <v-btn
                        size="small"
                        color="warning"
                        variant="outlined"
                        @click="updateResults(procedure)"
                      >
                        <v-icon class="mr-1">mdi-refresh</v-icon>
                        Обновить результат
                      </v-btn>
                    </div>
                    
                    <div v-else-if="procedure.status === 'contraindicated'">
                      <v-tooltip text="Процедура противопоказана из-за имеющихся ограничений">
                        <template #activator="{ props }">
                          <v-icon v-bind="props" color="warning">mdi-information</v-icon>
                        </template>
                      </v-tooltip>
                    </div>
                  </div>
                </template>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Диалог загрузки документа -->
    <v-dialog v-model="uploadDialog" max-width="600">
      <v-card>
        <v-card-title>
          <v-icon class="mr-2">mdi-upload</v-icon>
          Загрузить документ для: {{ selectedProcedure?.name }}
        </v-card-title>
        <v-card-text>
          <v-file-input
            v-model="selectedFiles"
            accept=".pdf,.jpg,.jpeg,.png"
            label="Выберите файл"
            prepend-icon="mdi-paperclip"
            show-size
            clearable
            multiple
          />
          
          <v-select
            v-model="selectedDocumentType"
            :items="getDocumentTypesForProcedure(selectedProcedure)"
            label="Тип документа"
            variant="outlined"
            class="mt-4"
          />
          
          <v-progress-linear
            v-if="documentsStore.isUploading"
            :model-value="documentsStore.uploadProgress"
            color="primary"
            height="6"
            class="mt-4"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            variant="text"
            @click="closeUploadDialog"
          >
            Отмена
          </v-btn>
          <v-btn
            color="primary"
            variant="elevated"
            :disabled="!selectedFiles.length || !selectedDocumentType || documentsStore.isUploading"
            @click="uploadDocumentForProcedure"
          >
            <v-icon class="mr-2">mdi-upload</v-icon>
            Загрузить
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Загруженные документы -->
    <v-row v-if="documentsStore.uploadedDocuments.length" class="mb-6">
      <v-col cols="12">
        <v-card>
          <v-card-title>
            <v-icon class="mr-2">mdi-file-multiple</v-icon>
            Загруженные документы
          </v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item
                v-for="document in documentsStore.uploadedDocuments"
                :key="document.id"
              >
                <template #prepend>
                  <v-avatar color="success" size="small">
                    <v-icon icon="mdi-file" color="white" size="small" />
                  </v-avatar>
                </template>
                
                <v-list-item-title>{{ document.fileName }}</v-list-item-title>
                <v-list-item-subtitle>
                  {{ document.type }} • {{ formatFileSize(document.size || 0) }}
                </v-list-item-subtitle>
                
                <template #append>
                  <v-btn
                    icon="mdi-delete"
                    size="small"
                    variant="text"
                    color="error"
                    @click="removeDocument(document.id)"
                  />
                </template>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Кнопки навигации -->
    <v-row class="mt-6">
      <v-col cols="12" class="d-flex justify-space-between">
        <v-btn
          variant="outlined"
          @click="goBack"
        >
          <v-icon class="mr-2">mdi-arrow-left</v-icon>
          Назад
        </v-btn>
        
        <v-btn
          color="primary"
          variant="elevated"
          @click="proceedToReview"
          :disabled="!hasRequiredDocuments"
        >
          Завершить
          <v-icon class="ml-2">mdi-check</v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { usePatientStore } from '../stores/patient'
import { useServicesStore } from '../stores/services'
import { useDocumentsStore } from '../stores/documents'
// import StepProgress from '../components/common/StepProgress.vue'

const router = useRouter()
const patientStore = usePatientStore()
const servicesStore = useServicesStore()
const documentsStore = useDocumentsStore()

const selectedFiles = ref<File[]>([])
const uploadDialog = ref(false)
const selectedProcedure = ref<any>(null)
const selectedDocumentType = ref<string>('')

// Все процедуры с их статусами
const allProcedures = computed(() => {
  return servicesStore.routeSheet.map(procedure => ({
    ...procedure,
    status: procedure.status
  }))
})

// Пройденные процедуры для отображения
const completedProceduresInfo = computed(() => {
  return allProcedures.value
    .filter(procedure => procedure.status === 'completed')
    .map(procedure => {
      const completedDate = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
      const expiryDate = new Date(completedDate.getTime() + procedure.validityPeriod * 24 * 60 * 60 * 1000)
      
      return {
        id: procedure.id,
        name: procedure.name,
        completedDate: completedDate.toISOString(),
        validityPeriod: procedure.validityPeriod,
        expiryDate: expiryDate.toISOString()
      }
    })
})

const hasRequiredDocuments = computed(() => {
  return allProcedures.value
    .filter(procedure => procedure.status === 'required')
    .length === 0
})

function getProcedureStatusColor(status: string): string {
  switch (status) {
    case 'completed': return 'success'
    case 'contraindicated': return 'warning'
    default: return 'primary'
  }
}

function getProcedureStatusIcon(status: string): string {
  switch (status) {
    case 'completed': return 'mdi-check'
    case 'contraindicated': return 'mdi-alert'
    default: return 'mdi-clock-outline'
  }
}

function getProcedureStatusText(status: string): string {
  switch (status) {
    case 'completed': return 'Завершено'
    case 'contraindicated': return 'Противопоказано'
    default: return 'Требуется'
  }
}

// Новые методы для действий с процедурами
function scheduleAppointment(procedure: any) {
  alert(`Запись на "${procedure.name}" будет реализована в следующей версии`)
}

function uploadResults(procedure: any) {
  selectedProcedure.value = procedure
  selectedDocumentType.value = ''
  selectedFiles.value = []
  uploadDialog.value = true
}

function markAsCompleted(procedure: any) {
  servicesStore.updateProcedureStatus(procedure.id, 'completed')
}

function updateResults(procedure: any) {
  selectedProcedure.value = procedure
  selectedDocumentType.value = ''
  selectedFiles.value = []
  uploadDialog.value = true
}



function closeUploadDialog() {
  uploadDialog.value = false
  selectedProcedure.value = null
  selectedDocumentType.value = ''
  selectedFiles.value = []
}

function getDocumentTypesForProcedure(procedure: any): string[] {
  if (!procedure) return []
  return procedure.requiredDocuments
}

async function uploadDocumentForProcedure() {
  if (!selectedFiles.value.length || !selectedDocumentType.value || !selectedProcedure.value) return
  
  try {
    // Берем первый файл из массива
    const file = selectedFiles.value[0]
    await documentsStore.uploadDocument(
      file, 
      selectedProcedure.value.id, 
      selectedDocumentType.value
    )
    
    // Отмечаем процедуру как завершенную после загрузки документа
    servicesStore.updateProcedureStatus(selectedProcedure.value.id, 'completed')
    
    closeUploadDialog()
  } catch (error) {
    console.error('Ошибка загрузки файла:', error)
  }
}



function removeDocument(documentId: string) {
  documentsStore.removeDocument(documentId)
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('ru-RU')
}

function formatFileSize(bytes: number) {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

function goBack() {
  patientStore.setCurrentStep(2)
  router.push('/route-sheet')
}

function proceedToReview() {
  patientStore.setCurrentStep(4)
  router.push('/final-review')
}
</script>

<style scoped>
.v-file-input {
  margin-bottom: 16px;
}
</style> 
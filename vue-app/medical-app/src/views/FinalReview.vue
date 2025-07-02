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
          Финальная проверка
        </h1>
        <p class="text-h6 text-grey-darken-1">
          Проверьте все данные перед отправкой заявки
        </p>
      </v-col>
    </v-row>

    <!-- Прогресс-бар -->
    <v-row class="mb-6">
      <v-col cols="12">
        <v-stepper :model-value="4" alt-labels hide-actions non-linear>
          <v-stepper-header>
            <v-stepper-item title="Выбор услуги" :value="1" :complete="true" icon="mdi-medical-bag" />
            <v-divider />
            <v-stepper-item title="Маршрутный лист" :value="2" :complete="true" icon="mdi-clipboard-list" />
            <v-divider />
            <v-stepper-item title="Управление услугами" :value="3" :complete="true" icon="mdi-clipboard-check" />
            <v-divider />
            <v-stepper-item title="Завершение" :value="4" :complete="false" icon="mdi-check-circle" />
          </v-stepper-header>
        </v-stepper>
      </v-col>
    </v-row>

    <!-- Информация о пациенте -->
    <v-row class="mb-6">
      <v-col cols="12">
        <v-card>
          <v-card-title>
            <v-icon class="mr-2">mdi-account</v-icon>
            Информация о пациенте
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="6">
                <div class="mb-2">
                  <strong>ФИО:</strong> {{ patientStore.fullName }}
                </div>
                <div class="mb-2">
                  <strong>Дата рождения:</strong> {{ formatDate(patientStore.currentPatient.birthDate) }}
                </div>
              </v-col>
              <v-col cols="12" md="6">
                <div class="mb-2">
                  <strong>Телефон:</strong> {{ patientStore.currentPatient.phone }}
                </div>
                <div class="mb-2">
                  <strong>Email:</strong> {{ patientStore.currentPatient.email }}
                </div>
              </v-col>
            </v-row>
            
            <div v-if="patientStore.hasContraindications" class="mt-4">
              <strong>Противопоказания:</strong>
              <v-chip
                v-for="contra in patientStore.currentPatient.contraindications"
                :key="contra"
                size="small"
                color="warning"
                variant="outlined"
                class="ml-2"
              >
                {{ contra }}
              </v-chip>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Выбранная услуга -->
    <v-row class="mb-6">
      <v-col cols="12">
        <v-card>
          <v-card-title>
            <v-icon class="mr-2">mdi-medical-bag</v-icon>
            Выбранная услуга
          </v-card-title>
          <v-card-text>
            <div class="d-flex align-center mb-2">
              <v-icon :icon="currentService?.icon" color="primary" class="mr-2" />
              <span class="text-h6">{{ currentService?.name }}</span>
            </div>
            <p class="text-body-1">{{ currentService?.description }}</p>
            <div class="mt-2">
              <v-chip color="info" variant="outlined" size="small">
                Расчетное время: {{ currentService?.estimatedTime }} дн.
              </v-chip>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Статус процедур -->
    <v-row class="mb-6">
      <v-col cols="12" md="4">
        <v-card color="success" variant="outlined">
          <v-card-text class="text-center">
            <v-icon icon="mdi-check-circle" size="large" color="success" class="mb-2" />
            <div class="text-h4">{{ completedCount }}</div>
            <div class="text-body-2">Процедур завершено</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card color="warning" variant="outlined">
          <v-card-text class="text-center">
            <v-icon icon="mdi-alert-circle" size="large" color="warning" class="mb-2" />
            <div class="text-h4">{{ contraindicatedCount }}</div>
            <div class="text-body-2">Противопоказано</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card color="info" variant="outlined">
          <v-card-text class="text-center">
            <v-icon icon="mdi-file-multiple" size="large" color="info" class="mb-2" />
            <div class="text-h4">{{ documentsCount }}</div>
            <div class="text-body-2">Документов загружено</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Список пройденных услуг -->
    <v-row class="mb-6">
      <v-col cols="12">
        <v-card>
          <v-card-title>
            <v-icon class="mr-2">mdi-check-circle</v-icon>
            Пройденные услуги
          </v-card-title>
          <v-card-text>
            <v-list v-if="completedProcedures.length">
              <v-list-item
                v-for="procedure in completedProcedures"
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
                  {{ procedure.description }} • Срок действия: {{ procedure.validityPeriod }} дн.
                </v-list-item-subtitle>
                
                <template #append>
                  <v-chip
                    color="success"
                    size="small"
                    variant="outlined"
                  >
                    Завершено
                  </v-chip>
                </template>
              </v-list-item>
            </v-list>
            <div v-else class="text-center py-4 text-grey-darken-1">
              Услуги не пройдены
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Проверка готовности -->
    <v-row class="mb-6">
      <v-col cols="12">
        <v-alert
          :type="isReadyToSubmit ? 'success' : 'warning'"
          variant="outlined"
        >
          <v-alert-title>
            {{ isReadyToSubmit ? 'Готово к отправке' : 'Не все требования выполнены' }}
          </v-alert-title>
          <div v-if="!isReadyToSubmit">
            <p>Для завершения необходимо:</p>
            <ul>
              <li v-if="requiredProceduresCount > 0">
                Пройти оставшиеся процедуры: {{ requiredProceduresCount }} шт.
              </li>
            </ul>
          </div>
          <div v-else>
            <p>Все необходимые процедуры пройдены. Заявка готова к отправке.</p>
          </div>
        </v-alert>
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
          color="success"
          variant="elevated"
          :disabled="!isReadyToSubmit"
          @click="submitApplication"
        >
          <v-icon class="mr-2">mdi-send</v-icon>
          Отправить заявку
        </v-btn>
      </v-col>
    </v-row>

    <!-- Диалог успешной отправки -->
    <v-dialog v-model="showSuccessDialog" max-width="500">
      <v-card>
        <v-card-title class="text-center">
          <v-icon icon="mdi-check-circle" color="success" size="large" class="mb-2" />
          <div>Заявка отправлена!</div>
        </v-card-title>
        <v-card-text class="text-center">
          <p>Ваша заявка № {{ applicationNumber }} успешно отправлена на рассмотрение.</p>
          <p>Ожидаемое время обработки: {{ processingTime }} рабочих дней.</p>
          <p>Уведомление о готовности будет отправлено на {{ patientStore.currentPatient.email }}</p>
        </v-card-text>
        <v-card-actions class="justify-center">
          <v-btn
            color="primary"
            variant="elevated"
            @click="resetAndGoHome"
          >
            Вернуться на главную
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { usePatientStore } from '../stores/patient'
import { useServicesStore } from '../stores/services'
import { useDocumentsStore } from '../stores/documents'

const router = useRouter()
const patientStore = usePatientStore()
const servicesStore = useServicesStore()
const documentsStore = useDocumentsStore()

const showSuccessDialog = ref(false)
const applicationNumber = ref('')
const processingTime = ref(5)

const currentService = computed(() => servicesStore.currentService)
const completedCount = computed(() => servicesStore.completedProcedures.length)
const contraindicatedCount = computed(() => servicesStore.contraindicatedProcedures.length)
const documentsCount = computed(() => documentsStore.uploadedDocuments.length)
const completedProcedures = computed(() => servicesStore.completedProcedures)

const requiredProceduresCount = computed(() => servicesStore.requiredProcedures.length)

const isReadyToSubmit = computed(() => 
  servicesStore.requiredProcedures.length === 0
)

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('ru-RU')
}

function goBack() {
  patientStore.setCurrentStep(3)
  router.push('/documents')
}

function submitApplication() {
  // Генерируем номер заявки
  applicationNumber.value = `MED-${Date.now().toString().slice(-6)}`
  
  // Определяем время обработки в зависимости от услуги
  const timeMap: Record<string, number> = {
    'spravka': 3,
    'screening': 7,
    'pregravidarka': 14
  }
  processingTime.value = timeMap[patientStore.selectedService] || 5
  
  showSuccessDialog.value = true
}

function resetAndGoHome() {
  // Сбрасываем все данные
  patientStore.resetPatientData()
  servicesStore.resetRouteSheet()
  documentsStore.resetDocuments()
  
  showSuccessDialog.value = false
  router.push('/')
}
</script>

<style scoped>
.v-card {
  margin-bottom: 16px;
}
</style> 
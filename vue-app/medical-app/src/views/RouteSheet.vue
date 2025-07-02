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
          Маршрутный лист
        </h1>
        <p class="text-h6 text-grey-darken-1">
          {{ currentService?.name }} - {{ currentService?.description }}
        </p>
      </v-col>
    </v-row>

    <!-- Прогресс-бар -->
    <v-row class="mb-6">
      <v-col cols="12">
        <StepProgress :current-step="2" :total-steps="4" />
      </v-col>
    </v-row>

    <!-- Противопоказания (если есть) -->
    <v-row v-if="patientStore.hasContraindications" class="mb-6">
      <v-col cols="12">
        <v-alert
          type="warning"
          variant="outlined"
          class="mb-4"
        >
          <v-alert-title>Обнаружены противопоказания</v-alert-title>
          <v-list density="compact">
            <v-list-item
              v-for="contra in patientStore.currentPatient.contraindications"
              :key="contra"
            >
              <v-list-item-title>{{ contra }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-alert>
      </v-col>
    </v-row>

    <!-- Статистика -->
    <v-row class="mb-6">
      <v-col cols="12" md="3">
        <v-card color="success" variant="outlined">
          <v-card-text class="text-center">
            <div class="text-h4">{{ completedCount }}</div>
            <div class="text-body-2">Пройдено</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="3">
        <v-card color="primary" variant="outlined">
          <v-card-text class="text-center">
            <div class="text-h4">{{ requiredCount }}</div>
            <div class="text-body-2">Требуется</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="3">
        <v-card color="warning" variant="outlined">
          <v-card-text class="text-center">
            <div class="text-h4">{{ contraindicatedCount }}</div>
            <div class="text-body-2">Противопоказано</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="3">
        <v-card color="info" variant="outlined">
          <v-card-text class="text-center">
            <div class="text-h4">{{ currentService?.estimatedTime || 0 }}</div>
            <div class="text-body-2">Дней</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Список процедур -->
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>
            <v-icon class="mr-2">mdi-clipboard-list</v-icon>
            Процедуры
          </v-card-title>
          <v-card-text>
                                      <v-list>
               <div v-for="(procedure, index) in servicesStore.routeSheet" :key="procedure.id">
                 <v-list-item>
                   <template #prepend>
                     <v-avatar
                       :color="getStatusColor(procedure.status)"
                       size="small"
                     >
                       <v-icon
                         :icon="getStatusIcon(procedure.status)"
                         color="white"
                         size="small"
                       />
                     </v-avatar>
                   </template>
                   
                   <v-list-item-title>{{ procedure.name }}</v-list-item-title>
                   <v-list-item-subtitle>{{ procedure.description }}</v-list-item-subtitle>
                   
                   <template #append>
                     <div class="d-flex flex-column align-end">
                       <v-chip
                         :color="getStatusColor(procedure.status)"
                         size="small"
                         variant="outlined"
                         class="mb-2"
                       >
                         {{ getStatusText(procedure.status) }}
                       </v-chip>
                       
                       <div class="text-caption text-grey-darken-1">
                         Срок: {{ procedure.validityPeriod }} дн.
                       </div>
                       
                       <div v-if="procedure.contraindications.length" class="text-caption text-warning">
                         Противопоказания: {{ procedure.contraindications.join(', ') }}
                       </div>
                     </div>
                   </template>
                 </v-list-item>
                 
                 <!-- Альтернативные процедуры -->
                 <div v-if="procedure.status === 'contraindicated'" class="ml-12 mb-4">
                   <v-btn
                     size="small"
                     variant="outlined"
                     color="info"
                     @click="showAlternatives(procedure.id)"
                   >
                     <v-icon class="mr-2">mdi-swap-horizontal</v-icon>
                     Показать альтернативы
                   </v-btn>
                 </div>
                 
                 <v-divider v-if="index < servicesStore.routeSheet.length - 1" />
               </div>
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
          @click="proceedToDocuments"
        >
          Продолжить
          <v-icon class="ml-2">mdi-arrow-right</v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { usePatientStore } from '../stores/patient'
import { useServicesStore } from '../stores/services'
import StepProgress from '../components/common/StepProgress.vue'

const router = useRouter()
const patientStore = usePatientStore()
const servicesStore = useServicesStore()

const currentService = computed(() => servicesStore.currentService)

const completedCount = computed(() => servicesStore.completedProcedures.length)
const requiredCount = computed(() => servicesStore.requiredProcedures.length)
const contraindicatedCount = computed(() => servicesStore.contraindicatedProcedures.length)

function getStatusColor(status: string) {
  switch (status) {
    case 'completed': return 'success'
    case 'required': return 'primary'
    case 'contraindicated': return 'warning'
    default: return 'grey'
  }
}

function getStatusIcon(status: string) {
  switch (status) {
    case 'completed': return 'mdi-check'
    case 'required': return 'mdi-clock-outline'
    case 'contraindicated': return 'mdi-alert'
    default: return 'mdi-help'
  }
}

function getStatusText(status: string) {
  switch (status) {
    case 'completed': return 'Пройдено'
    case 'required': return 'Требуется'
    case 'contraindicated': return 'Противопоказано'
    default: return 'Неизвестно'
  }
}

function showAlternatives(procedureId: string) {
  servicesStore.addAlternativeProcedure(procedureId)
}

function goBack() {
  patientStore.setCurrentStep(1)
  router.push('/')
}

function proceedToDocuments() {
  patientStore.setCurrentStep(3)
  router.push('/documents')
}
</script>

<style scoped>
.v-list-item {
  padding: 16px;
}
</style> 
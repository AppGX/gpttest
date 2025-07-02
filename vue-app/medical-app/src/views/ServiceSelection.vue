<template>
  <v-container class="service-selection">
    <v-row class="mb-6">
      <v-col cols="12" class="text-center">
        <h1 class="text-h3 text-primary mb-4">
          Медицинская система для пациентов
        </h1>
        <p class="text-h6 text-grey-darken-1">
          Выберите тип медицинской услуги
        </p>
      </v-col>
    </v-row>

    <!-- Информация о пациенте -->
    <v-row class="mb-6">
      <v-col cols="12">
        <v-card class="pa-4" elevation="2">
          <v-card-title class="text-h5">
            <v-icon class="mr-2">mdi-account</v-icon>
            Добро пожаловать, {{ patientStore.fullName }}
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="6">
                <div class="d-flex align-center">
                  <strong class="mr-2">Дата рождения:</strong>
                  {{ formatDate(patientStore.currentPatient.birthDate) }}
                </div>
              </v-col>
              <v-col cols="12" md="6">
                <div class="d-flex align-center">
                  <strong class="mr-2">Телефон:</strong>
                  {{ patientStore.currentPatient.phone }}
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Прогресс-бар -->
    <v-row class="mb-6">
      <v-col cols="12">
        <StepProgress :current-step="1" :total-steps="4" />
      </v-col>
    </v-row>

    <!-- Карточки услуг -->
    <v-row>
      <v-col
        v-for="service in servicesStore.availableServices"
        :key="service.id"
        cols="12"
        md="4"
      >
        <ServiceCard
          :service="service"
          @select="selectService"
        />
      </v-col>
    </v-row>

    <!-- Кнопка демо-режима -->
    <v-row class="mt-6">
      <v-col cols="12" class="text-center">
        <v-btn
          variant="outlined"
          color="info"
          @click="toggleDemoMode"
        >
          <v-icon class="mr-2">mdi-flask</v-icon>
          {{ demoMode ? 'Отключить' : 'Включить' }} демо-режим
        </v-btn>
        <p v-if="demoMode" class="text-caption mt-2 text-info">
          Демо-режим: случайные противопоказания будут генерироваться автоматически
        </p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { usePatientStore } from '../stores/patient'
import { useServicesStore } from '../stores/services'
import ServiceCard from '../components/cards/ServiceCard.vue'
import StepProgress from '../components/common/StepProgress.vue'

const router = useRouter()
const patientStore = usePatientStore()
const servicesStore = useServicesStore()

const demoMode = ref(true)

function selectService(serviceId: string) {
  patientStore.setSelectedService(serviceId)
  patientStore.setCurrentStep(2)
  servicesStore.selectService(serviceId)
  
  // Генерируем противопоказания в демо-режиме
  if (demoMode.value) {
    patientStore.generateRandomContraindications(serviceId)
  }
  
  // Генерируем маршрутный лист с учетом противопоказаний
  const service = servicesStore.getServiceById(serviceId)
  if (service) {
    servicesStore.generateRouteSheet(service, patientStore.currentPatient.contraindications)
  }
  
  router.push('/route-sheet')
}

function toggleDemoMode() {
  demoMode.value = !demoMode.value
  if (!demoMode.value) {
    patientStore.currentPatient.contraindications = []
  }
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('ru-RU')
}
</script>

<style scoped>
.service-selection {
  max-width: 1200px;
  margin: 0 auto;
}
</style> 
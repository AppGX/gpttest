<template>
  <div class="step-progress">
    <v-stepper
      :model-value="currentStep"
      alt-labels
      hide-actions
      non-linear
    >
      <v-stepper-header>
        <v-stepper-item
          title="Выбор услуги"
          :value="1"
          :complete="currentStep > 1"
          icon="mdi-medical-bag"
        />
        
        <v-divider />
        
        <v-stepper-item
          title="Маршрутный лист"
          :value="2"
          :complete="currentStep > 2"
          icon="mdi-clipboard-list"
        />
        
        <v-divider />
        
        <v-stepper-item
          title="Документы"
          :value="3"
          :complete="currentStep > 3"
          icon="mdi-file-upload"
        />
        
        <v-divider />
        
        <v-stepper-item
          title="Завершение"
          :value="4"
          :complete="currentStep > 4"
          icon="mdi-check-circle"
        />
      </v-stepper-header>
    </v-stepper>
  </div>
</template>

<script setup lang="ts">
interface Props {
  currentStep: number
  totalSteps: number
}

defineProps<Props>()
</script>

<style scoped>
.step-progress {
  margin: 20px 0;
}
</style> 
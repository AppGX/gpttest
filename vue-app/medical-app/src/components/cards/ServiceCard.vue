<template>
  <v-card
    class="service-card"
    elevation="4"
    hover
    @click="$emit('select', service.id)"
  >
    <v-card-title class="d-flex align-center">
      <v-icon
        :icon="service.icon"
        size="large"
        color="primary"
        class="mr-3"
      />
      <span>{{ service.name }}</span>
    </v-card-title>
    
    <v-card-text>
      <p class="text-body-1 mb-3">
        {{ service.description }}
      </p>
      
      <div class="service-info">
        <v-chip
          color="info"
          variant="outlined"
          size="small"
          class="mr-2 mb-2"
        >
          <v-icon start icon="mdi-clock-outline" />
          {{ service.estimatedTime }} дн.
        </v-chip>
        
        <v-chip
          color="success"
          variant="outlined"
          size="small"
          class="mb-2"
        >
          <v-icon start icon="mdi-format-list-checks" />
          {{ service.procedures.length }} процедур
        </v-chip>
      </div>
    </v-card-text>
    
    <v-card-actions>
      <v-btn
        color="primary"
        variant="elevated"
        block
        @click="$emit('select', service.id)"
      >
        Выбрать
        <v-icon end icon="mdi-arrow-right" />
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import type { MedicalService } from '../../stores/services'

interface Props {
  service: MedicalService
}

defineProps<Props>()
defineEmits<{
  select: [serviceId: string]
}>()
</script>

<style scoped>
.service-card {
  height: 100%;
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
}

.service-card:hover {
  transform: translateY(-4px);
}

.service-info {
  display: flex;
  flex-wrap: wrap;
}
</style> 
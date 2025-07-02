<script setup lang="ts">
import { ref } from 'vue'
import { RouterView } from 'vue-router'

const helpDialog = ref(false)

function showHelp() {
  helpDialog.value = true
}
</script>

<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
      flat
    >
      <v-app-bar-title>
        <v-icon class="mr-2">mdi-hospital-box</v-icon>
        Медицинская система
      </v-app-bar-title>
      
      <v-spacer />
      
      <v-btn
        icon="mdi-help-circle"
        variant="text"
        @click="showHelp"
      />
    </v-app-bar>

    <v-main>
      <RouterView />
    </v-main>

    <v-footer
      app
      class="bg-grey-lighten-4"
    >
      <v-container>
        <v-row>
          <v-col cols="12" class="text-center">
            <span class="text-body-2">
              © 2024 Медицинская система для пациентов | Демо-версия
            </span>
          </v-col>
        </v-row>
      </v-container>
    </v-footer>

    <!-- Диалог помощи -->
    <v-dialog v-model="helpDialog" max-width="600">
      <v-card>
        <v-card-title>
          <v-icon class="mr-2">mdi-help-circle</v-icon>
          Помощь
        </v-card-title>
        <v-card-text>
          <h3>Как пользоваться системой:</h3>
          <ol>
            <li><strong>Выберите услугу:</strong> Справка, Скрининг или Прегравидарка</li>
            <li><strong>Изучите маршрутный лист:</strong> Посмотрите необходимые процедуры и противопоказания</li>
            <li><strong>Загрузите документы:</strong> Добавьте результаты анализов и заключения врачей</li>
            <li><strong>Проверьте данные:</strong> Убедитесь, что все документы загружены</li>
            <li><strong>Отправьте заявку:</strong> Подтвердите отправку заявки на рассмотрение</li>
          </ol>
          
          <v-divider class="my-4" />
          
          <p><strong>Демо-режим:</strong> Система автоматически генерирует случайные противопоказания для демонстрации функционала.</p>
          
          <p><strong>Поддерживаемые форматы файлов:</strong> PDF, JPG, PNG</p>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="primary"
            variant="elevated"
            @click="helpDialog = false"
          >
            Понятно
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<style>
html, body {
  font-family: 'Roboto', sans-serif;
}

.v-application {
  font-family: 'Roboto', sans-serif !important;
}

.v-main {
  padding-top: 64px;
}
</style>

<template>
    <div class="min-h-screen bg-white text-gray-900 p-6 md:p-8" :class="{ 'dark': isDark }">
      <div class="max-w-4xl mx-auto">
        <div class="flex flex-col md:flex-row justify-between items-center mb-8">
          <div class="flex items-center gap-3">
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
              Текущие опросы
            </h1>
          </div>
          <button 
            @click="toggle" 
            class="px-4 py-2.5 text-sm bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-xl transition-all duration-300"
          >
            {{ isDark ? 'Светлая тема' : 'Тёмная тема' }}
          </button>
        </div>
  
        <div class="grid gap-6">
          <div
            v-for="survey in surveysWithStatus"
            :key="survey.route"
            class="relative bg-white shadow-md rounded-2xl p-6 border border-gray-200 dark:bg-gray-700 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 transition-all duration-300"
          >
            <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 mb-4">
              <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
                {{ survey.name }}
              </h2>
              <span :class="`px-3 py-1 rounded-full text-xs font-medium ${statusPillClass(survey.statusColor)}`">
                {{ survey.statusText }}
              </span>
            </div>
            
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-6">{{ survey.until_what }}</p>
            
            <div class="flex justify-between items-center">
              <NuxtLink
                :to="'/' + survey.route"
                class="inline-flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl hover:bg-indigo-700 transition-all duration-300"
              >
                Пройти опрос
              </NuxtLink>
              
              <div class="text-xs text-gray-500 dark:text-gray-300">
                ID: {{ survey.route }}
              </div>
            </div>
          </div>
        </div>
  
        <footer class="mt-16 text-center">
          <div class="mb-3 text-sm text-gray-600 dark:text-gray-400">
            🕒 Время по Екатеринбургу: 
            <span class="font-mono bg-gray-100 px-2 py-1 rounded-md">{{ time }}</span>
          </div>
          <div class="text-sm text-gray-500 dark:text-gray-300">
            ☁️ Используем 
            <a href="https://cloud.yandex.ru/services/forms" target="_blank" class="text-indigo-600 hover:text-indigo-500 underline">
              Yandex Cloud Forms
            </a>
          </div>
        </footer>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
import surveys from '@/data/surveys.json'
import { useTime } from '@/composables/useTime'
import { useTheme } from '@/composables/useTheme'

const { time } = useTime()
const { isDark, toggle } = useTheme()

// Функция для форматирования даты в читаемый вид
function formatDate(dateStr: string) {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'Asia/Yekaterinburg'
  }
  return new Date(dateStr).toLocaleDateString('ru-RU', options)
}

function getStatus(untilStr: string) {
  try {
    const now = new Date().toLocaleString('en-US', { timeZone: 'Asia/Yekaterinburg' })
    const nowDate = new Date(now)
    const until = new Date(untilStr)
    
    const diffMs = until.getTime() - nowDate.getTime()
    const diffDays = diffMs / (1000 * 60 * 60 * 24)

    if (diffMs <= 0) {
      return { 
        statusText: 'Завершён', 
        statusColor: 'red',
        formattedDate: `Завершён ${formatDate(untilStr)}`
      }
    } 
    if (diffDays <= 3) {
      return { 
        statusText: 'Скоро завершится', 
        statusColor: 'yellow',
        formattedDate: `Завершается ${formatDate(untilStr)}`
      }
    }
    return { 
      statusText: 'Активен', 
      statusColor: 'green',
      formattedDate: `Активен до ${formatDate(untilStr)}`
    }
  } catch (e) {
    console.error('Ошибка обработки даты:', e)
    return { 
      statusText: 'Ошибка даты', 
      statusColor: 'gray',
      formattedDate: 'Некорректная дата'
    }
  }
}


const surveysWithStatus = surveys.map(s => {
  const status = getStatus(s.until_what)
  return {
    ...s,
    ...status,
    until_what: status.formattedDate
  }
})

const statusPillClass = (color: string) => {
  return {
    green: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    yellow: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    red: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    gray: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
  }[color] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
}
</script>

  
  <style scoped>
  body {
    @apply transition-colors duration-300;
  }
  
  .grid {
    display: grid;
    gap: 1.5rem;
  }
  
  footer {
    font-size: 0.875rem;
  }
  
  button {
    font-weight: 600;
  }
  
  a {
    font-weight: 600;
  }
  
  .dark {
    background-color: #1a202c;
    color: white;
  }
  
  /* Закругление для полоски и блока одинаковое */
  .relative {
    border-radius: 1.5rem;
  }
  
  /* Убедимся, что полоска будет на своём месте */
  .absolute {
    z-index: 10;
  }
  </style>
  
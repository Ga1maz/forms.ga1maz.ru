<template>
    <div class="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-zinc-900 text-gray-900 dark:text-white p-6 md:p-8">
      <!-- Кнопка "Назад" с проверкой -->
      <button 
        @click="goBack" 
        class="mb-4 self-start text-blue-600 hover:underline flex items-center gap-1 rounded-xl px-4 py-2 transition-all duration-300 bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 shadow-md hover:shadow-lg"
      >
        <ArrowLeft v-if="ArrowLeft" class="w-5 h-5" />
        <span v-else>←</span>
        Назад
      </button>
  
      <!-- Сообщение если опрос не найден -->
      <div v-if="!surveyFound" class="text-center p-8 bg-red-100 dark:bg-red-900 rounded-xl">
        <h2 class="text-2xl font-bold text-red-600 dark:text-red-300 mb-4">Опрос не найден</h2>
        <p class="text-gray-700 dark:text-gray-300">Проверьте правильность ссылки или обратитесь к администратору</p>
      </div>
  
      <!-- Если опрос найден, но URL отсутствует -->
      <div v-else-if="surveyFound && !url" class="text-center p-8 bg-yellow-100 dark:bg-yellow-900 rounded-xl">
        <h2 class="text-2xl font-bold text-yellow-600 dark:text-yellow-300 mb-4">URL опроса недоступен</h2>
        <p class="text-gray-700 dark:text-gray-300">{{ survey.name }}</p>
      </div>
  
      <!-- Если опрос просрочен -->
      <div v-else-if="isExpired" class="text-center p-8 bg-orange-100 dark:bg-orange-900 rounded-xl">
        <h2 class="text-2xl font-bold text-orange-600 dark:text-orange-300 mb-4">Опрос закрыт</h2>
        <p class="text-gray-700 dark:text-gray-300 mb-2">{{ survey.name }}</p>
        <p class="text-sm">Дата окончания: {{ formatDate(survey.until_what) }}</p>
      </div>
  
      <!-- Основной контент если все в порядке -->
      <div v-else class="w-full">
        <h1 class="text-2xl font-bold mb-4 text-center">{{ survey.name }}</h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mb-4 text-center">
          Доступен до: {{ formatDate(survey.until_what) }}
        </p>
        
        <iframe
          v-if="url"
          :src="url"
          class="w-full h-[80vh] border rounded-xl shadow-lg bg-white dark:bg-zinc-800 border-gray-200 dark:border-gray-600 transition-all duration-300"
          title="Опрос"
        ></iframe>
      </div>
    </div>
  </template>
  
  <script setup>
import surveys from '@/data/surveys.json'
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const survey = ref(null)
const url = ref(null)
const surveyFound = ref(false)

const router = useRouter()
const route = useRoute()

// Проверка срока действия
const isExpired = computed(() => {
  if (!survey.value || !survey.value.until_what) return true
  const endDate = new Date(survey.value.until_what)
  return endDate < new Date()
})

// Импорт иконки
let ArrowLeft = ref(null)
try {
  const module = await import('lucide-vue-next')
  ArrowLeft.value = module.ArrowLeft
} catch (e) {
  console.warn('Не удалось загрузить иконку ArrowLeft:', e)
}

// Поиск нужного опроса
const currentRoute = route.params.slug
const foundSurvey = surveys.find(s => s.route === currentRoute)

if (foundSurvey) {
  survey.value = foundSurvey
  surveyFound.value = true

  if (!isExpired.value) {
    url.value = foundSurvey.inframe_url
  }
}

const formatDate = (dateString) => {
  if (!dateString) return 'не указана'
  const options = { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }
  return new Date(dateString).toLocaleDateString('ru-RU', options)
}

const goBack = () => {
  router.go(-1)
}

</script>


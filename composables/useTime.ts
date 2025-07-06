export const useTime = () => {
    const time = ref('')

    const update = () => {
      const now = new Date()
      const timeStr = now.toLocaleString('ru-RU', {
        timeZone: 'Asia/Yekaterinburg',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      })

      time.value = timeStr
    }

    if (process.client) {
      onMounted(() => {
        update()
        setInterval(update, 1000)
      })
    }

    return { time }
}

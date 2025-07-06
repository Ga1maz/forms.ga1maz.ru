export const useTheme = () => {
    const isDark = useState('dark-mode', () => false)
    
    const toggle = () => {
      isDark.value = !isDark.value
      document.documentElement.classList.toggle('dark', isDark.value)
    }
    
    return { isDark, toggle }
  }
  
import { ref, computed, onMounted } from 'vue'

const isOnline = ref(true)

const useDevice = (setConnectivityListeners?: boolean) => {
	const isDevelopment = computed(
		() => import.meta.env.MODE.toLowerCase() === 'development'
	)

	onMounted(() => {
		if (setConnectivityListeners) {
			isOnline.value = window.navigator.onLine
			window.addEventListener('online', () => (isOnline.value = true))
			window.addEventListener('offline', () => (isOnline.value = false))
		}
	})

	return { isDevelopment, isOnline }
}

export default useDevice

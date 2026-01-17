import { ref } from 'vue'

const loaderActive = ref(false)

const useFullpageLoader = () => {
	return { loaderActive }
}

export default useFullpageLoader

import { watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import useFullpageLoader from '../composables/use-fullpage-loader'
import { AuthState, useAuthState } from '../composables/use-auth-state'
import { auth } from '../firebase/firebase'

const initAuthListener = () => {
	const route = useRoute()
	const router = useRouter()
	const { authState } = useAuthState()
	const { loaderActive } = useFullpageLoader()

	loaderActive.value = true

	watch(
		() => authState.value,
		() => {
			if (authState.value === AuthState.Loading) {
				loaderActive.value = true
				return
			}

			loaderActive.value = false

			if (route.meta.loggedIn && !auth.currentUser) {
				// is a route where login is required, but client is not logged in
				// redirect to login page
				return router.push('/login')
			}

			if (route.fullPath === '/login' && auth.currentUser) {
				// user is already logged in but at login page url
				// redirect to homepage
				return router.push('/')
			}
		}
	)
}

export default initAuthListener

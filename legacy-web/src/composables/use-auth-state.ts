import { ref } from 'vue'
import { onAuthStateChanged } from '@firebase/auth'
import { auth } from '../firebase/firebase'

export enum AuthState {
	Loading,
	Authenticated,
	UnAuthenticated,
}

const authState = ref<AuthState>(AuthState.Loading)

export const useAuthState = (setAuthListener?: boolean) => {
	if (setAuthListener) {
		onAuthStateChanged(auth, () => {
			authState.value = auth.currentUser
				? AuthState.Authenticated
				: AuthState.UnAuthenticated
		})
	}

	return { authState }
}

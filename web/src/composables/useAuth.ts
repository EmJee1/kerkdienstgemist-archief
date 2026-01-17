import { ref, onMounted } from 'vue'
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, type User } from 'firebase/auth'
import { auth } from '@/firebase/firebase'

const user = ref<User | null>(null)
const loading = ref(true)

export function useAuth() {
  onMounted(() => {
    onAuthStateChanged(auth, (firebaseUser) => {
      user.value = firebaseUser
      loading.value = false
    })
  })

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password)
  }

  const logout = async () => {
    await signOut(auth)
  }

  return {
    user,
    loading,
    login,
    logout,
  }
}

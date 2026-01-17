<template>
  <div class="min-h-screen flex items-center justify-center bg-neutral-50 p-4">
    <Card class="w-full max-w-md">
      <CardHeader>
        <CardTitle class="text-2xl text-center">Kerkdienst Archief</CardTitle>
        <CardDescription class="text-center">
          Log in om toegang te krijgen tot het archief
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div v-if="error" class="p-3 text-sm bg-red-50 border border-red-200 text-red-800 rounded-md">
            {{ error }}
          </div>

          <div class="space-y-2">
            <label for="email" class="text-sm font-medium">Email</label>
            <Input
              id="email"
              v-model="email"
              type="email"
              placeholder="uw@email.nl"
              autocomplete="email"
              required
              :disabled="loading"
            />
          </div>

          <div class="space-y-2">
            <label for="password" class="text-sm font-medium">Wachtwoord</label>
            <Input
              id="password"
              v-model="password"
              type="password"
              placeholder="••••••••"
              autocomplete="current-password"
              required
              :disabled="loading"
            />
          </div>

          <Button type="submit" class="w-full" :disabled="loading">
            {{ loading ? 'Inloggen...' : 'Inloggen' }}
          </Button>
        </form>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const { login } = useAuth()

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

const handleSubmit = async () => {
  if (!email.value || !password.value) return

  loading.value = true
  error.value = ''

  try {
    await login(email.value, password.value)
  } catch (err) {
    error.value = 'Inloggen mislukt. Controleer uw gegevens en probeer het opnieuw.'
    console.error(err)
  } finally {
    loading.value = false
  }
}
</script>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { validate as validateEmail } from 'email-validator'
import { signInWithEmailAndPassword } from '@firebase/auth'
import { auth } from '../firebase/firebase'
import Notification from '../components/Notification.vue'
import { ColorType } from '../models/styling'

const submitted = ref(false)
const error = ref(false)
const email = ref('')
const password = ref('')

const onSubmit = () => {
	signInWithEmailAndPassword(auth, email.value, password.value).catch(err => {
		console.error(err)
		error.value = true
	})
}

const isValidatedEmail = computed(() => validateEmail(email.value))
const isValidatedPassword = computed(() => password.value.length > 6)
</script>

<template>
	<div class="section">
		<h1 class="is-size-1">Login</h1>
		<form @submit.prevent="onSubmit">
			<div class="field" v-if="error">
				<div class="control">
					<Notification :type="ColorType.Danger">
						<template v-slot:header>Fout bij het inloggen</template>
						<template v-slot:body>
							Controleer je gegevens en neem contact op met de beheerder als dit
							fout blijft gaan
						</template>
					</Notification>
				</div>
			</div>
			<div class="field">
				<div class="control has-icons-left has-icons-right">
					<input
						class="input"
						type="email"
						placeholder="Email"
						autocomplete="email"
						v-model="email"
						:disabled="submitted"
					/>
					<span class="icon is-small is-left">
						<i class="fas fa-envelope"></i>
					</span>
					<span
						class="icon is-small is-right"
						:class="{ validated: isValidatedEmail }"
					>
						<i class="fas fa-check"></i>
					</span>
				</div>
			</div>
			<div class="field">
				<div class="control has-icons-left has-icons-right">
					<input
						class="input"
						type="password"
						placeholder="Password"
						autocomplete="current-password"
						v-model="password"
						:disabled="submitted"
					/>
					<span class="icon is-small is-left">
						<i class="fas fa-key"></i>
					</span>
					<span
						class="icon is-small is-right"
						:class="{ validated: isValidatedPassword }"
					>
						<i class="fas fa-check"></i>
					</span>
				</div>
			</div>
			<div class="field">
				<button type="submit" class="button is-primary">Submit</button>
			</div>
		</form>
	</div>
</template>

<style lang="scss">
h1 {
	margin-bottom: 1rem;
}

.validated svg path {
	fill: green;
}
</style>

<template>
	<Modal @close="$emit('close')">
		<template v-slot:header>
			<p class="moda-card-title">iFrame embed aanmaken</p>
			<button
				class="delete"
				aria-label="close"
				@click="$emit('close')"
			></button>
		</template>
		<template v-slot:body>
			<form @submit.prevent="onSubmit">
				<Notification v-if="error" :type="ColorType.Danger">
					<template v-slot:header>Fout bij het aanmaken</template>
					<template v-slot:body>
						Bij het aanmaken is er iets fout gegaan, probeer het zometeen
						opnieuw. Neem contact op met
						<a href="mailto:mart-janroeleveld@outlook.com">
							mart-janroeleveld@outlook.com
						</a>
						als dit blijft gebeuren
					</template>
				</Notification>
				<label for="name" class="label">
					iFrame naam (bijv. kerkwebsite)
				</label>
				<input :disabled="loading" class="input" id="name" v-model="name" />
				<Button
					:color-type="ColorType.Primary"
					:disabled="loading"
					icon="fas fa-plus"
					class="mt-2"
					submit
				>
					Aanmaken
				</Button>
				<Loader v-if="loading" />
			</form>
		</template>
	</Modal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { v4 as uuid } from 'uuid'
import { addDoc, collection, Timestamp } from '@firebase/firestore'
import Modal from '../Modal.vue'
import Button from '../Button.vue'
import Notification from '../Notification.vue'
import { ColorType } from '../../models/styling'
import { IIFrameEmbed } from '../../models/embedding'
import { firestore } from '../../firebase/firebase'
import Loader from '../Loader.vue'

const emit = defineEmits<{ (e: 'close'): void }>()

const name = ref('')
const error = ref(false)
const loading = ref(false)

const onSubmit = async () => {
	loading.value = true

	const newDoc: Partial<IIFrameEmbed> = {
		name: name.value,
		apiKey: uuid(),
		createdAt: Timestamp.fromDate(new Date()),
	}

	try {
		await addDoc(collection(firestore, 'iframes'), newDoc)
		emit('close')
	} catch (err) {
		console.error(err)
		error.value = true
	} finally {
		loading.value = false
	}
}
</script>

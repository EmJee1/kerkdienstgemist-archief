<template>
	<Modal @close="$emit('close')">
		<template v-slot:header>
			<p class="moda-card-title">iFrame embed</p>
			<button
				class="delete"
				aria-label="close"
				@click="$emit('close')"
			></button>
		</template>
		<template v-slot:body>
			<InputCopy :text="iFrameCode" />
			<hr />
			<Notification :type="ColorType.Warning" v-if="iFrameName">
				<template v-slot:header>Belangrijke informatie</template>
				<template v-slot:body>
					Als u dit verwijderd zullen alle plekken die dit specifieke iFrame
					gebruiken niet meer functioneren omdat de rechten hiervan verwijderd
					zullen worden. Controleer goed of deze niet meer nodig zijn voordat u
					kiest voor verwijderen.
				</template>
			</Notification>
			<Notification :type="ColorType.Danger" v-if="error">
				<template v-slot:header>Fout bij het verwijderen</template>
				<template v-slot:body>
					Bij het verwijderen van het iframe is er iets fout gegaan, probeer het
					zometeen opnieuw. Neem contact op met
					<a href="mailto:mart-janroeleveld@outlook.com">
						mart-janroeleveld@outlook.com
					</a>
					als dit blijft gebeuren
				</template>
			</Notification>
			<form @submit.prevent="onDeleteSubmit">
				<label for="iframe-name" class="label">
					Type de naam van dit iFrame ({{ iFrame.name }}) om te verwijderen
				</label>
				<input class="input" id="iframe-name" v-model="iFrameName" />
				<Button
					class="mt-2"
					icon="fas fa-trash"
					:color-type="ColorType.Danger"
					:disabled="iFrameName !== iFrame.name"
				>
					Verwijderen
				</Button>
				<Loader v-if="loading" />
			</form>
		</template>
	</Modal>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { deleteDoc, doc } from '@firebase/firestore'
import Modal from '../Modal.vue'
import Button from '../Button.vue'
import Loader from '../Loader.vue'
import InputCopy from '../InputCopy.vue'
import Notification from '../Notification.vue'
import { firestore } from '../../firebase/firebase'
import { IIFrameEmbed } from '../../models/embedding'
import { ColorType } from '../../models/styling'

const emit = defineEmits<{ (e: 'close'): void }>()
const props = defineProps<{ iFrame: IIFrameEmbed }>()

const error = ref(false)
const loading = ref(false)
const iFrameName = ref('')

const iFrameCode = computed(
	() =>
		`<iframe src="https://kerdienstgemist-archief.web.app/iframe-embed?apiKey=${props.iFrame.apiKey}" title="kerkdiensten archief"></iframe>`
)

const onDeleteSubmit = async (e: Event) => {
	if (props.iFrame.name !== iFrameName.value) return

	loading.value = true

	try {
		await deleteDoc(doc(firestore, 'iframes', props.iFrame.id))
		emit('close')
	} catch (err) {
		console.error(err)
		error.value = true
	} finally {
		loading.value = false
	}
}
</script>

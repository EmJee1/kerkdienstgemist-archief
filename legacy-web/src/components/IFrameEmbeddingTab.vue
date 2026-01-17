<template>
	<table class="table is-hoverable" style="width: 100%">
		<thead>
			<tr>
				<th>Naam</th>
				<th>Aangemaakt op</th>
			</tr>
		</thead>
		<tbody>
			<tr v-for="iFrame in iFrames" @click="selectedIFrame = iFrame">
				<td>{{ iFrame.name }}</td>
				<td>{{ formatDate(iFrame.createdAt.toDate()) }}</td>
			</tr>
		</tbody>
	</table>
	<Button
		icon="fas fa-plus"
		:color-type="ColorType.Primary"
		@click="showCreateIFrame = true"
	>
		Aanmaken
	</Button>
	<IFrameEmbeddingModal
		v-if="selectedIFrame"
		:i-frame="selectedIFrame"
		@close="selectedIFrame = undefined"
	/>
	<CreateIFrameModal
		v-if="showCreateIFrame"
		@close="showCreateIFrame = false"
	/>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { v4 as uuid } from 'uuid'
import { firestore } from '../firebase/firebase'
import { IIFrameEmbed } from '../models/embedding'
import { ColorType } from '../models/styling'
import { formatDate } from '../util/datetime-helpers'
import Button from './Button.vue'
import CreateIFrameModal from './modals/CreateIFrameModal.vue'
import IFrameEmbeddingModal from './modals/IFrameEmbeddingModal.vue'
import { subscribeAll } from '../firebase/firebase-helpers'
import { collection, CollectionReference } from '@firebase/firestore'

const showCreateIFrame = ref(false)
const iFrames = ref<IIFrameEmbed[]>([])
const selectedIFrame = ref<IIFrameEmbed>()

onMounted(() => {
	subscribeAll<IIFrameEmbed>(
		collection(firestore, 'iframes') as CollectionReference<IIFrameEmbed>,
		data => {
			console.log('new embedding items:', data)
			iFrames.value = data
		}
	)
})
</script>

<style scoped lang="scss">
tbody tr {
	cursor: pointer;
}
</style>

<template>
	<h1 class="title">Archief</h1>
	<div class="columns is-multiline">
		<div class="column is-6" v-for="service in services">
			<Service :service="service" @click="urlModal = service" />
		</div>
	</div>
	<LoadMoreButton :loading="loading" :load-next="loadNextDataChunk" />
	<GeneratedUrlModal
		v-if="urlModal"
		:service="urlModal"
		@close="urlModal = undefined"
	/>
</template>

<script setup lang="ts">
import {
	collection,
	CollectionReference,
	limit,
	query,
	getDocs,
	startAfter,
	orderBy,
} from '@firebase/firestore'
import { ref, onMounted } from 'vue'
import { firestore } from '../firebase/firebase'
import { IService } from '../models/kerdienst-gemist'
import GeneratedUrlModal from '../components/modals/GeneratedUrlModal.vue'
import LoadMoreButton from '../components/LoadMoreButton.vue'
import Service from '../components/Service.vue'

const loading = ref(true)
const services = ref<IService[]>([])
const urlModal = ref<IService>()

const loadNextDataChunk = async () => {
	loading.value = true

	const startAtIndex = services.value.length

	const collectionRef = collection(
		firestore,
		'services'
	) as CollectionReference<IService>

	const servicesQuery = startAtIndex
		? query<IService>(
				collectionRef,
				orderBy('createdAt', 'desc'),
				startAfter(services.value[services.value.length - 1].createdAt),
				limit(9)
		  )
		: query<IService>(collectionRef, orderBy('createdAt', 'desc'), limit(9))

	try {
		const querySnapshot = await getDocs(servicesQuery)
		querySnapshot.forEach(doc =>
			services.value.push({ ...doc.data(), id: doc.id })
		)
	} catch (err) {
		alert('Er is iets fout gegaan met het ophalen van de data')
		console.error(err)
	} finally {
		loading.value = false
	}
}

onMounted(loadNextDataChunk)
</script>

<style scoped lang="scss">
.column {
	margin-bottom: 1rem;
}
</style>

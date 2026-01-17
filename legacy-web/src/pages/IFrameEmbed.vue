<template>
	<h1 class="title">iFrame Embedding</h1>
	<p v-if="authorized === AuthState.UnAuthenticated">
		Je hebt geen rechten om deze pagina te bekijken
	</p>
	<p v-else>Je hebt rechten, congrats!</p>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { AuthState } from '../composables/use-auth-state'
import useFullpageLoader from '../composables/use-fullpage-loader'

const route = useRoute()
const { loaderActive } = useFullpageLoader()

const authorized = ref<AuthState>(AuthState.Loading)

onMounted(() => {
	loaderActive.value = true

	const apiKey = route.query.apiKey?.toString()

	if (!apiKey) {
		authorized.value = AuthState.UnAuthenticated
	}

	loaderActive.value = false

	console.log(apiKey)
})
</script>

<script setup lang="ts">
import '@fortawesome/fontawesome-free/js/all.js'
import 'bulma/css/bulma.css'
import './util/axios'
import FullPageLoader from './components/FullPageLoader.vue'
import Navbar from './components/Navbar.vue'
import useDevice from './composables/use-device'
import ClientOffline from './pages/ClientOffline.vue'
import useFullpageLoader from './composables/use-fullpage-loader'
import { useAuthState } from './composables/use-auth-state'
import initAuthListener from './util/auth-listener'

useAuthState(true)
initAuthListener()
const { isOnline } = useDevice(true)
const { loaderActive } = useFullpageLoader()
</script>

<template>
	<FullPageLoader v-if="loaderActive" />
	<ClientOffline v-else-if="!isOnline" />
	<div v-else>
		<Navbar />
		<div class="section">
			<div class="container">
				<router-view />
			</div>
		</div>
	</div>
</template>

<style>
* {
	font-family: 'Inter', sans-serif;
}
</style>

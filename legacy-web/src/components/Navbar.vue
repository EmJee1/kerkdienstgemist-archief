<script setup lang="ts">
import { useRouter } from 'vue-router'
import { auth } from '../firebase/firebase'

const router = useRouter()

const signout = () =>
	auth
		.signOut()
		.then(() => router.push('/login'))
		.catch(console.error)
</script>

<template>
	<nav role="navigation" aria-label="main navigation">
		<div class="section py-4">
			<div id="navbarBasicExample" class="nav-menu">
				<div class="navbar-start">
					<router-link to="/archive" class="navbar-item">Archief</router-link>
					<router-link to="/embedding" class="navbar-item">
						Embedding
					</router-link>
				</div>

				<div class="navbar-end">
					<div class="navbar-item">
						<div class="buttons">
							<a class="button is-light" @click="signout"> Uitloggen </a>
						</div>
					</div>
				</div>
			</div>
		</div>
	</nav>
</template>

<style lang="scss" scoped>
.nav-menu {
	display: flex;
	align-items: center;
	justify-content: space-between;

	.navbar-start {
		gap: 1rem;
	}
}
</style>

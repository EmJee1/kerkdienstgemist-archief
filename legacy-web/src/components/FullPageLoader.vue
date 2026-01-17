<template>
	<div class="full-page-loader">
		<Loader />
	</div>
</template>

<script setup lang="ts">
import Loader from './Loader.vue'
</script>

<style lang="scss">
.full-page-loader {
	position: fixed;
	inset: 0;
	display: grid;
	place-items: center;
}
</style>

<template>
	<Loader v-if="loading" />
	<div v-else class="load-more">
		<button class="button is-info is-rounded" @click="loadNext">
			Laad meer
		</button>
	</div>
</template>

<script setup lang="ts">
import Loader from './Loader.vue'

defineProps<{ loading: boolean; loadNext: () => void }>()
</script>

<style scoped lang="scss">
.load-more {
	display: flex;
	justify-content: center;
}
</style>

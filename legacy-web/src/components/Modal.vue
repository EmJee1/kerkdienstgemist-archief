<template>
	<div class="modal is-active">
		<div class="modal-background" @click="$emit('close')"></div>
		<div class="modal-card">
			<header class="modal-card-head">
				<slot name="header" />
			</header>
			<section class="modal-card-body">
				<slot name="body" />
			</section>
			<footer class="modal-card-foot">
				<slot name="footer" />
			</footer>
		</div>
	</div>
</template>

<script setup lang="ts">
defineEmits<{ (e: 'close'): void }>()
</script>

<style lang="scss">
.modal .modal-card-head {
	justify-content: space-between;
}
</style>

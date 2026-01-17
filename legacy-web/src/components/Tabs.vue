<template>
	<div class="tabs" :class="{ 'is-centered': center, 'is-boxed': boxed }">
		<ul>
			<slot />
		</ul>
	</div>
</template>

<script setup lang="ts">
defineProps<{ center?: boolean; boxed?: boolean }>()
</script>

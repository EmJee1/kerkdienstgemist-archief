<template>
	<li :class="{ 'is-active': active }">
		<a>
			<span v-if="icon" class="icon is-small">
				<i :class="icon" aria-hidden="true"></i>
			</span>
			<span>{{ name }}</span>
		</a>
	</li>
</template>

<script setup lang="ts">
defineProps<{ name: string; icon?: string; active?: boolean }>()
</script>

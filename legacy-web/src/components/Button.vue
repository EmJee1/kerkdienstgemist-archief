<template>
	<button
		:type="submit ? 'submit' : 'button'"
		class="button"
		:class="{ [colorType]: true }"
	>
		<span v-if="icon" class="icon">
			<i :class="{ [icon]: true }"></i>
		</span>
		<span>
			<slot />
		</span>
	</button>
</template>

<script setup lang="ts">
import { ColorType } from '../models/styling'

defineProps<{ colorType: ColorType; submit?: boolean; icon?: string }>()
</script>

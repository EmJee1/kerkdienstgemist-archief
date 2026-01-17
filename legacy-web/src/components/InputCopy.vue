<template>
	<div class="input-copy" @click="copyText">
		<input disabled type="text" class="input" :value="text" ref="inputRef" />
		<button
			class="button is-info"
			:class="{
				[ColorType.Info]: copyStatus === undefined,
				[ColorType.Danger]: copyStatus === false,
				[ColorType.Success]: copyStatus,
			}"
		>
			<span class="icon">
				<i class="fas fa-copy"></i>
			</span>
		</button>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ColorType } from '../models/styling'

const props = defineProps<{ text: string }>()

const inputRef = ref<HTMLInputElement>()
const copyStatus = ref<boolean>()

const copyText = () => {
	if (!inputRef.value) return

	copyStatus.value = undefined

	// disabled selects are not selectable, by toggling disabled the select method works as expected
	inputRef.value.disabled = false
	inputRef.value.select()
	inputRef.value.disabled = true

	navigator.clipboard
		.writeText(props.text)
		.then(() => (copyStatus.value = true))
		.catch(err => {
			copyStatus.value = false
			console.error(err)
		})
		.finally(() => setTimeout(() => (copyStatus.value = undefined), 2000))
}
</script>

<style lang="scss">
.input-copy {
	display: flex;

	.input[type='text'] {
		cursor: pointer;
	}
}
</style>

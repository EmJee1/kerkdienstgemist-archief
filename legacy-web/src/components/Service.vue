<template>
	<div class="service">
		<div>
			<h4 class="is-size-4">{{ service.title }}</h4>
			<p>
				{{ formatDate(service.createdAt.toDate()) }} -
				{{ formatTime(service.createdAt.toDate()) }}
			</p>
		</div>
		<span class="button is-light">
			<span class="icon">
				<i class="fas fa-share-alt"></i>
			</span>
			<span>Link maken</span>
		</span>
	</div>
</template>

<script setup lang="ts">
import { IService } from '../models/kerdienst-gemist'
import { formatDate, formatTime } from '../util/datetime-helpers'

defineProps<{ service: IService }>()
</script>

<style lang="scss" scoped>
.service {
	margin-bottom: 0.4rem;
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 1rem;
	border-radius: 8px;
	border: 1px solid whitesmoke;
	cursor: pointer;
	transition: background-color 0.3s ease-in-out;

	&:hover {
		background: whitesmoke;
	}
}
</style>

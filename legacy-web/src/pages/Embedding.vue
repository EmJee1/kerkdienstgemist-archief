<template>
	<h1 class="title">Embedding</h1>
	<Tabs center boxed>
		<TabItem
			:name="EmbeddingTabs.IFrame"
			icon="far fa-window-maximize"
			:active="selectedTab === EmbeddingTabs.IFrame"
			@click="selectedTab = EmbeddingTabs.IFrame"
		/>
		<TabItem
			:name="EmbeddingTabs.Api"
			icon="fas fa-project-diagram"
			:active="selectedTab === EmbeddingTabs.Api"
			@click="selectedTab = EmbeddingTabs.Api"
		/>
	</Tabs>
	<IFrameEmbeddingTab v-if="selectedTab === EmbeddingTabs.IFrame" />
	<ApiEmbeddingTab v-if="selectedTab === EmbeddingTabs.Api" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Tabs from '../components/Tabs.vue'
import TabItem from '../components/TabItem.vue'
import ApiEmbeddingTab from '../components/ApiEmbeddingTab.vue'
import IFrameEmbeddingTab from '../components/IFrameEmbeddingTab.vue'

enum EmbeddingTabs {
	Api = 'API',
	IFrame = 'iFrame',
}

const selectedTab = ref<EmbeddingTabs>(EmbeddingTabs.IFrame)
</script>

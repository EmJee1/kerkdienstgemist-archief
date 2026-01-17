<template>
  <Card class="relative">
    <!-- Loading overlay -->
    <div
      v-if="loading"
      class="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center rounded-lg z-10"
    >
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-900"></div>
    </div>

    <CardHeader>
      <CardTitle class="text-lg">{{ service.title }}</CardTitle>
      <CardDescription>
        {{ formatDateTime(service.createdAt.toDate()) }}
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div v-if="service.pastor" class="flex items-center gap-2 text-sm text-neutral-600">
        <User class="w-4 h-4" />
        <span>{{ service.pastor }}</span>
      </div>
    </CardContent>
    <CardFooter class="flex justify-between">
      <Button variant="outline" size="sm" @click="$emit('view', service)" :disabled="loading">
        <ExternalLink class="w-4 h-4 mr-2" />
        Bekijk
      </Button>
      <Button variant="ghost" size="sm" @click="$emit('share', service)" :disabled="loading">
        <Share2 class="w-4 h-4 mr-2" />
        Deel
      </Button>
    </CardFooter>
  </Card>
</template>

<script setup lang="ts">
import type { IService } from '@/models/service'
import { formatDateTime } from '@/lib/datetime'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { User, ExternalLink, Share2 } from 'lucide-vue-next'

defineProps<{
  service: IService
  loading?: boolean
}>()

defineEmits<{
  view: [service: IService]
  share: [service: IService]
}>()
</script>

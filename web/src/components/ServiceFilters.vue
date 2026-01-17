<template>
  <Card class="mb-6">
    <CardContent class="pt-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- Date From Filter -->
        <div class="space-y-2">
          <label for="date-from" class="text-sm font-medium">Van datum</label>
          <Input
            id="date-from"
            type="date"
            :value="dateFrom"
            @input="$emit('update:dateFrom', ($event.target as HTMLInputElement).value)"
          />
        </div>

        <!-- Date To Filter -->
        <div class="space-y-2">
          <label for="date-to" class="text-sm font-medium">Tot datum</label>
          <Input
            id="date-to"
            type="date"
            :value="dateTo"
            @input="$emit('update:dateTo', ($event.target as HTMLInputElement).value)"
          />
        </div>

        <!-- Pastor Filter -->
        <div class="space-y-2">
          <label for="pastor" class="text-sm font-medium">Voorganger</label>
          <Select :model-value="selectedPastor" @update:model-value="(value) => $emit('update:selectedPastor', value as string)">
            <SelectTrigger id="pastor">
              <SelectValue placeholder="Alle voorgangers" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle voorgangers</SelectItem>
              <SelectItem v-for="pastor in pastors" :key="pastor" :value="pastor">
                {{ pastor }}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <!-- Clear Filters Button -->
      <div class="mt-4 flex justify-end">
        <Button variant="outline" size="sm" @click="$emit('clear')">
          <X class="w-4 h-4 mr-2" />
          Filters wissen
        </Button>
      </div>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { X } from 'lucide-vue-next'

defineProps<{
  dateFrom: string
  dateTo: string
  selectedPastor: string
  pastors: string[]
}>()

defineEmits<{
  'update:dateFrom': [value: string]
  'update:dateTo': [value: string]
  'update:selectedPastor': [value: string]
  clear: []
}>()
</script>

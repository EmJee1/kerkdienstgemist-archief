<template>
  <Card class="mb-6">
    <CardContent class="pt-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- Date From Filter -->
        <div class="space-y-2">
          <label class="text-sm font-medium">Van datum</label>
          <Popover>
            <PopoverTrigger as-child>
              <Button
                variant="outline"
                :class="cn('w-full justify-start text-left font-normal', !dateFromValue && 'text-muted-foreground')"
              >
                <CalendarIcon class="mr-2 h-4 w-4" />
                {{ dateFromValue ? df.format(dateFromValue.toDate(getLocalTimeZone())) : "Kies een datum" }}
              </Button>
            </PopoverTrigger>
            <PopoverContent class="w-auto p-0" align="start">
              <Calendar
                v-model="dateFromValue"
                initial-focus
                @update:model-value="handleDateFromChange"
              />
            </PopoverContent>
          </Popover>
        </div>

        <!-- Date To Filter -->
        <div class="space-y-2">
          <label class="text-sm font-medium">Tot datum</label>
          <Popover>
            <PopoverTrigger as-child>
              <Button
                variant="outline"
                :class="cn('w-full justify-start text-left font-normal', !dateToValue && 'text-muted-foreground')"
              >
                <CalendarIcon class="mr-2 h-4 w-4" />
                {{ dateToValue ? df.format(dateToValue.toDate(getLocalTimeZone())) : "Kies een datum" }}
              </Button>
            </PopoverTrigger>
            <PopoverContent class="w-auto p-0" align="start">
              <Calendar
                v-model="dateToValue"
                initial-focus
                @update:model-value="handleDateToChange"
              />
            </PopoverContent>
          </Popover>
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
import { ref, watch } from 'vue'
import { DateFormatter, getLocalTimeZone, parseDate } from '@internationalized/date'
import type { DateValue } from '@internationalized/date'
import { CalendarIcon, X } from 'lucide-vue-next'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

const props = defineProps<{
  dateFrom: string
  dateTo: string
  selectedPastor: string
  pastors: string[]
}>()

const emit = defineEmits<{
  'update:dateFrom': [value: string]
  'update:dateTo': [value: string]
  'update:selectedPastor': [value: string]
  clear: []
}>()

const df = new DateFormatter('nl-NL', {
  dateStyle: 'long',
})

const dateFromValue = ref<DateValue>()
const dateToValue = ref<DateValue>()

// Initialize date values from props
watch(() => props.dateFrom, (newVal) => {
  if (newVal) {
    dateFromValue.value = parseDate(newVal)
  } else {
    dateFromValue.value = undefined
  }
}, { immediate: true })

watch(() => props.dateTo, (newVal) => {
  if (newVal) {
    dateToValue.value = parseDate(newVal)
  } else {
    dateToValue.value = undefined
  }
}, { immediate: true })

const handleDateFromChange = (date: DateValue | undefined) => {
  if (date) {
    const jsDate = date.toDate(getLocalTimeZone())
    const year = jsDate.getFullYear()
    const month = String(jsDate.getMonth() + 1).padStart(2, '0')
    const day = String(jsDate.getDate()).padStart(2, '0')
    emit('update:dateFrom', `${year}-${month}-${day}`)
  } else {
    emit('update:dateFrom', '')
  }
}

const handleDateToChange = (date: DateValue | undefined) => {
  if (date) {
    const jsDate = date.toDate(getLocalTimeZone())
    const year = jsDate.getFullYear()
    const month = String(jsDate.getMonth() + 1).padStart(2, '0')
    const day = String(jsDate.getDate()).padStart(2, '0')
    emit('update:dateTo', `${year}-${month}-${day}`)
  } else {
    emit('update:dateTo', '')
  }
}
</script>

<template>
  <Dialog :open="open" @update:open="handleOpenChange">
    <DialogContent>
      <DialogTitle>Metadata bewerken</DialogTitle>
      <DialogDescription>
        Wijzig metadata voor deze kerkdienst zoals de voorganger.
      </DialogDescription>
      <div class="space-y-4 mt-4">
        <div class="space-y-2">
          <label class="block pb-0.5 text-sm font-medium">Voorganger</label>
          <Select v-model="selectedPastor">
            <SelectTrigger class="w-full">
              <SelectValue placeholder="Selecteer een voorganger" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">
                <SelectItemText>Geen voorganger</SelectItemText>
              </SelectItem>
              <SelectItem
                v-for="pastor in pastors"
                :key="pastor"
                :value="pastor"
              >
                <SelectItemText>{{ pastor }}</SelectItemText>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div class="flex justify-end gap-2">
          <Button variant="outline" @click="handleCancel">Annuleren</Button>
          <Button @click="handleSave" :disabled="saving">
            {{ saving ? "Opslaan..." : "Opslaan" }}
          </Button>
        </div>
      </div>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import type { IService } from "@/models/service";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectItemText,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface Props {
  open: boolean;
  service: IService | null;
  pastors: string[];
}

interface Emits {
  (e: "update:open", value: boolean): void;
  (e: "save", serviceId: string, pastor: string): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const selectedPastor = ref("");
const saving = ref(false);

// Watch for service changes to populate the form
watch(
  () => props.service,
  (newService) => {
    if (newService) {
      selectedPastor.value = newService.pastor || "none";
    }
  },
  { immediate: true },
);

const handleOpenChange = (value: boolean) => {
  emit("update:open", value);
};

const handleCancel = () => {
  emit("update:open", false);
};

const handleSave = async () => {
  if (!props.service) return;

  saving.value = true;
  // Convert "none" to empty string for the database
  const pastorValue =
    selectedPastor.value === "none" ? "" : selectedPastor.value;
  emit("save", props.service.id, pastorValue);
  // Note: saving state will be reset when dialog closes
};

// Reset saving state when dialog closes
watch(
  () => props.open,
  (isOpen) => {
    if (!isOpen) {
      saving.value = false;
    }
  },
);
</script>

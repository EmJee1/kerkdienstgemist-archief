<template>
  <div class="min-h-screen bg-neutral-50">
    <!-- Loading State -->
    <div
      v-if="authLoading"
      class="min-h-screen flex items-center justify-center"
    >
      <div class="text-center">
        <div
          class="animate-spin rounded-full h-12 w-12 border-b-2 border-neutral-900 mx-auto"
        ></div>
        <p class="mt-4 text-neutral-600">Laden...</p>
      </div>
    </div>

    <!-- Login View -->
    <Login v-else-if="!user" />

    <!-- Main Application -->
    <div v-else class="min-h-screen">
      <!-- Header -->
      <header class="bg-white shadow-sm border-b">
        <div class="container mx-auto px-4 py-4">
          <div class="flex justify-between items-center">
            <h1 class="text-2xl font-bold text-neutral-900">
              Kerkdienst Archief
            </h1>
            <Button variant="outline" @click="handleLogout">
              <LogOut class="w-4 h-4 mr-2" />
              Uitloggen
            </Button>
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <main class="container mx-auto px-4 py-8">
        <!-- Filters -->
        <ServiceFilters
          v-model:date-from="dateFrom"
          v-model:date-to="dateTo"
          v-model:selected-pastor="selectedPastor"
          :pastors="availablePastors"
          @clear="clearFilters"
        />

        <!-- Services Table -->
        <div v-if="loading && services.length === 0" class="text-center py-12">
          <div
            class="animate-spin rounded-full h-12 w-12 border-b-2 border-neutral-900 mx-auto"
          ></div>
          <p class="mt-4 text-neutral-600">Diensten laden...</p>
        </div>

        <DataTable v-else :columns="tableColumns" :data="services" />

        <!-- Infinite Scroll Trigger -->
        <div
          v-if="services.length > 0"
          ref="scrollTrigger"
          class="mt-8 text-center"
        >
          <div
            v-if="loading"
            class="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-900 mx-auto"
          ></div>
          <div v-else-if="!hasMore" class="text-neutral-500 text-sm">
            Geen diensten meer om te laden
          </div>
        </div>
      </main>
    </div>

    <EditServiceDialog
      :open="editDialogOpen"
      :service="editingService"
      :pastors="availablePastors"
      @update:open="editDialogOpen = $event"
      @save="updateServicePastor"
    />

    <Toaster />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  getDoc,
  doc,
  startAfter,
  where,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { toast } from "vue-sonner";
import { firestore } from "@/firebase/firebase";
import { useAuth } from "@/composables/useAuth";
import type { User } from "firebase/auth";
import type { IService, IPastorsIndex } from "@/models/service";
import Login from "@/components/Login.vue";
import ServiceFilters from "@/components/ServiceFilters.vue";
import DataTable from "@/components/DataTable.vue";
import Toaster from "@/components/Toaster.vue";
import EditServiceDialog from "@/components/EditServiceDialog.vue";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-vue-next";
import { columns } from "@/components/columns";

const { user, loading: authLoading, logout } = useAuth();

// Services state
const services = ref<IService[]>([]);
const loading = ref(false);
const hasMore = ref(true);
const loadingServiceId = ref<string | null>(null);
const scrollTrigger = ref<HTMLElement | null>(null);
const LIMIT = 18;

const CLOUD_FUNCTION_BASE_URL =
  "https://us-central1-kerdienstgemist-archief.cloudfunctions.net";

// Filter state
const dateFrom = ref("");
const dateTo = ref("");
const selectedPastor = ref("all");
const availablePastors = ref<string[]>([]);

// Edit dialog state
const editDialogOpen = ref(false);
const editingService = ref<IService | null>(null);

// Computed: Table columns with action handlers
const tableColumns = computed(() =>
  columns(viewService, editService, loadingServiceId.value),
);

// Load available pastors from Firestore index
const loadPastors = async () => {
  try {
    const pastorsDoc = await getDoc(doc(firestore, "indexes", "pastors"));
    if (pastorsDoc.exists()) {
      const data = pastorsDoc.data() as IPastorsIndex;
      availablePastors.value = data.names.sort();
    }
  } catch (error) {
    console.error("Error loading pastors:", error);
    toast.error("Fout bij het laden van voorgangers");
  }
};

// Load services from Firestore with filters
const loadServices = async (isLoadMore = false) => {
  loading.value = true;

  try {
    const servicesCollection = collection(firestore, "services");

    // Build query constraints
    const constraints = [];

    // Date range filters
    if (dateFrom.value) {
      const fromDate = new Date(dateFrom.value);
      fromDate.setHours(0, 0, 0, 0);
      constraints.push(where("createdAt", ">=", Timestamp.fromDate(fromDate)));
    }

    if (dateTo.value) {
      const toDate = new Date(dateTo.value);
      toDate.setHours(23, 59, 59, 999);
      constraints.push(where("createdAt", "<=", Timestamp.fromDate(toDate)));
    }

    // Pastor filter
    if (selectedPastor.value !== "all") {
      constraints.push(where("pastor", "==", selectedPastor.value));
    }

    // Always order by createdAt
    constraints.push(orderBy("createdAt", "desc"));

    // Handle pagination
    if (isLoadMore && services.value.length > 0) {
      const lastService = services.value[services.value.length - 1];
      if (lastService) {
        constraints.push(startAfter(lastService.createdAt));
      }
    }

    // Add limit
    constraints.push(limit(LIMIT));

    const q = query(servicesCollection, ...constraints);
    const snapshot = await getDocs(q);

    const newServices = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as IService[];

    if (isLoadMore) {
      services.value = [...services.value, ...newServices];
    } else {
      services.value = newServices;
    }

    hasMore.value = snapshot.docs.length === LIMIT;
  } catch (error) {
    console.error("Error loading services:", error);
    toast.error("Fout bij het laden van diensten");
  } finally {
    loading.value = false;
  }
};

const loadMore = () => {
  if (!loading.value && hasMore.value) {
    loadServices(true);
  }
};

const clearFilters = () => {
  dateFrom.value = "";
  dateTo.value = "";
  selectedPastor.value = "all";
  // Reload services will be triggered by watchers
};

const handleLogout = async () => {
  try {
    await logout();
    services.value = [];
  } catch (error) {
    console.error("Error logging out:", error);
    toast.error("Fout bij uitloggen");
  }
};

const fetchSignedUrl = async (service: IService): Promise<string | null> => {
  loadingServiceId.value = service.id;

  try {
    const url = `${CLOUD_FUNCTION_BASE_URL}/createSignedServiceDownloadUrl?servicePath=${encodeURIComponent(service.file)}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Failed to fetch signed URL");
    }

    const data = await response.json();
    return data.url;
  } catch (error) {
    console.error("Error fetching signed URL:", error);
    toast.error("Fout bij het ophalen van de dienst URL");
    return null;
  } finally {
    loadingServiceId.value = null;
  }
};

const viewService = async (service: IService) => {
  const signedUrl = await fetchSignedUrl(service);
  if (signedUrl) {
    window.open(signedUrl, "_blank");
  }
};

const editService = (service: IService) => {
  editingService.value = service;
  editDialogOpen.value = true;
};

const updateServicePastor = async (serviceId: string, pastor: string) => {
  try {
    const serviceRef = doc(firestore, "services", serviceId);
    await updateDoc(serviceRef, {
      pastor: pastor || null,
    });

    // Update the local services array
    const serviceIndex = services.value.findIndex((s) => s.id === serviceId);
    if (serviceIndex !== -1) {
      services.value = services.value.map((s, i) =>
        i === serviceIndex ? { ...s, pastor: pastor || undefined } : s
      );
    }

    toast.success("Metadata succesvol bijgewerkt");
    editDialogOpen.value = false;
  } catch (error) {
    console.error("Error updating service:", error);
    toast.error("Fout bij het bijwerken van metadata");
  }
};

onMounted(() => {
  // Load services and pastors when authenticated
  if (user.value) {
    loadServices();
    loadPastors();
  }

  // Setup intersection observer for infinite scroll
  const observer = new IntersectionObserver(
    (entries) => {
      const entry = entries[0];
      if (entry?.isIntersecting && !loading.value && hasMore.value) {
        loadMore();
      }
    },
    {
      rootMargin: "100px", // Trigger 100px before the element comes into view
    }
  );

  // Watch for scrollTrigger ref changes and observe
  watch(scrollTrigger, (newTrigger, oldTrigger) => {
    if (oldTrigger) {
      observer.unobserve(oldTrigger);
    }
    if (newTrigger) {
      observer.observe(newTrigger);
    }
  });

  // Cleanup on unmount
  onUnmounted(() => {
    if (scrollTrigger.value) {
      observer.unobserve(scrollTrigger.value);
    }
    observer.disconnect();
  });
});

// Watch for user authentication and load services
watch(user, (newUser: User | null) => {
  if (newUser && services.value.length === 0) {
    loadServices();
    loadPastors();
  }
});

// Watch for filter changes and reload services
watch([dateFrom, dateTo, selectedPastor], () => {
  if (user.value) {
    loadServices();
  }
});
</script>

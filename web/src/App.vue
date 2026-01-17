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

        <!-- Services Grid -->
        <div v-if="loading && services.length === 0" class="text-center py-12">
          <div
            class="animate-spin rounded-full h-12 w-12 border-b-2 border-neutral-900 mx-auto"
          ></div>
          <p class="mt-4 text-neutral-600">Diensten laden...</p>
        </div>

        <div
          v-else-if="filteredServices.length === 0"
          class="text-center py-12"
        >
          <p class="text-neutral-600">Geen diensten gevonden</p>
        </div>

        <div
          v-else
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <ServiceCard
            v-for="service in filteredServices"
            :key="service.id"
            :service="service"
            :loading="loadingServiceId === service.id"
            @view="viewService"
            @share="shareService"
          />
        </div>

        <!-- Load More Button -->
        <div
          v-if="!loading && hasMore && filteredServices.length > 0"
          class="mt-8 text-center"
        >
          <Button @click="loadMore" :disabled="loading">
            {{ loading ? "Laden..." : "Meer laden" }}
          </Button>
        </div>

        <div v-if="loading && services.length > 0" class="mt-8 text-center">
          <div
            class="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-900 mx-auto"
          ></div>
        </div>
      </main>
    </div>

    <Toaster />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  startAfter,
} from "firebase/firestore";
import { toast } from "vue-sonner";
import { firestore } from "@/firebase/firebase";
import { useAuth } from "@/composables/useAuth";
import type { IService } from "@/models/service";
import Login from "@/components/Login.vue";
import ServiceCard from "@/components/ServiceCard.vue";
import ServiceFilters from "@/components/ServiceFilters.vue";
import Toaster from "@/components/Toaster.vue";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-vue-next";

const { user, loading: authLoading, logout } = useAuth();

// Services state
const services = ref<IService[]>([]);
const loading = ref(false);
const hasMore = ref(true);
const loadingServiceId = ref<string | null>(null);
const LIMIT = 12;

const CLOUD_FUNCTION_BASE_URL =
  "https://us-central1-kerdienstgemist-archief.cloudfunctions.net";

// Filter state
const dateFrom = ref("");
const dateTo = ref("");
const selectedPastor = ref("all");

// Computed: Available pastors for filter
const availablePastors = computed(() => {
  const pastors = services.value
    .map((s) => s.pastor)
    .filter((p): p is string => !!p);
  return [...new Set(pastors)].sort();
});

// Computed: Filtered services
const filteredServices = computed(() => {
  return services.value.filter((service) => {
    // Filter by date range
    if (dateFrom.value) {
      const serviceDate = service.createdAt.toDate();
      const fromDate = new Date(dateFrom.value);
      if (serviceDate < fromDate) return false;
    }

    if (dateTo.value) {
      const serviceDate = service.createdAt.toDate();
      const toDate = new Date(dateTo.value);
      toDate.setHours(23, 59, 59, 999); // End of day
      if (serviceDate > toDate) return false;
    }

    // Filter by pastor
    if (selectedPastor.value !== "all") {
      if (service.pastor !== selectedPastor.value) return false;
    }

    return true;
  });
});

// Load services from Firestore
const loadServices = async (isLoadMore = false) => {
  loading.value = true;

  try {
    const servicesCollection = collection(firestore, "services");

    let q;
    if (isLoadMore && services.value.length > 0) {
      const lastService = services.value[services.value.length - 1];
      if (lastService) {
        q = query(
          servicesCollection,
          orderBy("createdAt", "desc"),
          startAfter(lastService.createdAt),
          limit(LIMIT),
        );
      } else {
        q = query(
          servicesCollection,
          orderBy("createdAt", "desc"),
          limit(LIMIT),
        );
      }
    } else {
      q = query(servicesCollection, orderBy("createdAt", "desc"), limit(LIMIT));
    }

    const snapshot = await getDocs(q);

    const newServices = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as IService[];

    if (isLoadMore) {
      services.value.push(...newServices);
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
  loadServices(true);
};

const clearFilters = () => {
  dateFrom.value = "";
  dateTo.value = "";
  selectedPastor.value = "all";
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

const shareService = async (service: IService) => {
  const signedUrl = await fetchSignedUrl(service);
  if (signedUrl) {
    navigator.clipboard
      .writeText(signedUrl)
      .then(() => {
        toast.success("Link gekopieerd naar klembord");
      })
      .catch(() => {
        toast.error("Kon link niet kopiëren");
      });
  }
};

onMounted(() => {
  // Load services when authenticated
  if (user.value) {
    loadServices();
  }
});

// Watch for user authentication and load services
import { watch } from "vue";
watch(user, (newUser) => {
  if (newUser && services.value.length === 0) {
    loadServices();
  }
});
</script>

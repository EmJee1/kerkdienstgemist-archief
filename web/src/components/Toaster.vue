<template>
  <Toaster
    position="top-right"
    :duration="4000"
    :toast-options="{
      style: {
        background: 'white',
        color: 'rgb(23, 23, 23)',
        border: '1px solid rgb(229, 229, 229)',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        padding: '16px',
        fontSize: '1rem',
        borderRadius: '8px',
      },
    }"
  />
</template>

<script setup lang="ts">
import { Toaster } from "vue-sonner";
</script>

<style>
/* Import vue-sonner styles */
@import "vue-sonner/style.css";
</style>

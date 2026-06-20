<script setup>
defineProps({
  errors: { type: Array, required: true }, // [{ step, message }]
})
</script>

<template>
  <div
    class="flex flex-col gap-[8px] p-[16px] rounded-[6px] bg-danger-muted-rest border border-danger-muted text-danger"
  >
    <p class="m-0 text-sm font-medium">Please fix the following errors before submitting</p>
    <p v-for="(e, i) in errors" :key="i" class="m-0 text-sm">• Step {{ e.step }}: {{ e.message }}</p>
  </div>
</template>

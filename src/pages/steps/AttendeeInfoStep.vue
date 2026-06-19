<script setup>
import TicketSelector from '../../components/TicketSelector.vue'
import AttendeeForm from '../../components/AttendeeForm.vue'
</script>

<template>
  <div class="flex flex-col gap-[32px]">
    <TicketSelector />

    <section class="flex flex-col gap-[32px]">
      <h2 class="text-h3 text-neutral">Attendee Information</h2>
      <AttendeeForm />
    </section>
  </div>
</template>

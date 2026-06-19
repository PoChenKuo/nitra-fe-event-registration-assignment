<script setup>
import { provideWizard } from '../composables/useWizard.js'
import AppHeader from '../components/AppHeader.vue'
import WizardStepper from '../components/WizardStepper.vue'
import WizardFooter from '../components/WizardFooter.vue'

// Owns the wizard navigation state for the whole shell.
provideWizard()
</script>

<template>
  <q-layout view="hHh lpR fFf">
    <!-- Header region: brand header + stepper, pinned to top -->
    <q-header class="bg-surface-l0 text-neutral">
      <AppHeader />
      <div class="h-px bg-[var(--divider-default)]" />
      <WizardStepper />
      <div class="h-px bg-[var(--divider-default)]" />
    </q-header>

    <!-- Main content region: active step page -->
    <q-page-container>
      <router-view />
    </q-page-container>

    <!-- Footer region: action bar, pinned to bottom -->
    <q-footer class="bg-surface-l0 text-neutral">
      <div class="h-px bg-[var(--divider-default)]" />
      <WizardFooter />
    </q-footer>
  </q-layout>
</template>

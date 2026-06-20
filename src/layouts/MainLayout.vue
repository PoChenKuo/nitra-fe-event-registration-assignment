<script setup>
import { provideWizard } from '../composables/useWizard.js'
import { provideRegistration } from '../composables/useRegistration.js'
import AppHeader from '../components/AppHeader.vue'
import WizardStepper from '../components/WizardStepper.vue'
import WizardFooter from '../components/WizardFooter.vue'

// Owns the wizard navigation state and the registration data store for the
// whole shell, so step pages can mount/unmount without losing state.
provideWizard()
const { submitted } = provideRegistration()
</script>

<template>
  <q-layout view="hHh lpR fFf">
    <!-- Header region: brand header + stepper (stepper hidden on the success screen) -->
    <q-header class="bg-surface-l0 text-neutral">
      <AppHeader />
      <template v-if="!submitted">
        <div class="h-px bg-[var(--divider-default)]" />
        <WizardStepper />
        <div class="h-px bg-[var(--divider-default)]" />
      </template>
    </q-header>

    <!-- Main content region: active step page -->
    <q-page-container>
      <router-view />
    </q-page-container>

    <!-- Footer region: action bar (hidden on the success screen) -->
    <q-footer v-if="!submitted" class="bg-surface-l0 text-neutral">
      <div class="h-px bg-[var(--divider-default)]" />
      <WizardFooter />
    </q-footer>
  </q-layout>
</template>

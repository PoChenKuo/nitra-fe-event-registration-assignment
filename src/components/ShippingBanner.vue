<script setup>
// Shown on the Add-ons page whenever the cart contains merchandise.
// Styled per Figma "Shipping Info Banner" (node 1220:2186).
</script>

<template>
  <div
    class="flex items-start gap-[12px] p-[16px] rounded-[8px] bg-info-subtle-rest border border-info-opacity"
  >
    <q-icon name="info" size="20px" class="shrink-0 text-info" />
    <div class="flex-[1_0_0] min-w-0 flex flex-col gap-[4px]">
      <p class="m-0 text-md font-semibold leading-[20px] text-neutral">Shipping Information</p>
      <p class="m-0 text-md font-regular leading-[20px] text-neutral">
        Merchandise items will be shipped to your address one week before the conference. Please
        ensure your shipping address in Step 1 is correct.
      </p>
    </div>
  </div>
</template>

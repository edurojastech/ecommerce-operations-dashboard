<script setup lang="ts">
defineProps<{
  label: string
  value: string
}>()
</script>

<template>
  <div class="metric-card">
    <span class="metric-card__label">{{ label }}</span>
    <strong class="metric-card__value">{{ value }}</strong>
  </div>
</template>

<style scoped lang="scss">
.metric-card {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  padding: 1.1rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.metric-card__label {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.metric-card__value {
  font-size: 1.75rem;
  font-weight: 700;
  line-height: 1.1;
  color: var(--color-text);
}
</style>

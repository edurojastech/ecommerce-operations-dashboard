<script setup lang="ts">
defineProps<{
  loading: boolean
}>()

const emit = defineEmits<{
  refresh: []
}>()
</script>

<template>
  <header class="dashboard-header">
    <div class="dashboard-header__text">
      <h1>E-commerce Operations Dashboard</h1>
      <p>Operational overview based on simulated order data.</p>
    </div>

    <button
      type="button"
      class="btn btn--primary"
      :disabled="loading"
      @click="emit('refresh')"
    >
      {{ loading ? 'Refreshing…' : 'Refresh data' }}
    </button>
  </header>
</template>

<style scoped lang="scss">
.dashboard-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.dashboard-header__text h1 {
  font-size: 1.5rem;
  font-weight: 700;
}

.dashboard-header__text p {
  margin-top: 0.35rem;
  color: var(--color-text-muted);
  font-size: 0.95rem;
}

@media (max-width: 520px) {
  .dashboard-header {
    flex-direction: column;
    align-items: stretch;
  }

  .dashboard-header .btn {
    width: 100%;
    justify-content: center;
  }
}
</style>

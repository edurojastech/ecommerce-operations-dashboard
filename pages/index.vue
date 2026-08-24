<script setup lang="ts">
const MAX_VISIBLE_ORDERS = 20

const store = useOrdersStore()

const visibleOrders = computed(() => store.orders.slice(0, MAX_VISIBLE_ORDERS))
const { metrics } = useOrderMetrics(computed(() => store.orders))

const isInitialLoading = computed(() => store.loading && store.orders.length === 0)
const isEmpty = computed(() => !store.loading && !store.error && store.orders.length === 0)

onMounted(() => {
  store.fetchOrders()
})
</script>

<template>
  <div class="dashboard">
    <DashboardHeader :loading="store.loading" @refresh="store.refreshOrders" />

    <section v-if="store.error" class="state state--error">
      <p>{{ store.error }}</p>
      <button type="button" class="btn btn--primary" @click="store.fetchOrders">
        Try again
      </button>
    </section>

    <section v-else-if="isInitialLoading" class="state state--loading">
      <p>Loading orders…</p>
    </section>

    <template v-else>
      <section class="metrics-grid" aria-label="Order metrics">
        <MetricCard label="Total Orders" :value="String(metrics.total)" />
        <MetricCard label="Completed Orders" :value="String(metrics.completed)" />
        <MetricCard label="Pending Orders" :value="String(metrics.pending)" />
        <MetricCard label="Completion Rate" :value="`${metrics.completionRate.toFixed(1)}%`" />
      </section>

      <section class="orders-section">
        <div class="orders-section__header">
          <h2>Recent Orders</h2>
          <span class="orders-section__count">
            Showing {{ visibleOrders.length }} of {{ store.orders.length }}
          </span>
        </div>

        <div v-if="isEmpty" class="state state--empty">
          <p>No orders found.</p>
        </div>
        <OrdersTable v-else :orders="visibleOrders" />
      </section>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { Order } from '~/types/order'
import { getOrderStatus, getOrderStatusLabel } from '~/utils/status'

defineProps<{
  orders: Order[]
}>()
</script>

<template>
  <div class="orders-table-wrapper">
    <table class="orders-table">
      <thead>
        <tr>
          <th scope="col">Order</th>
          <th scope="col">Customer</th>
          <th scope="col">Product</th>
          <th scope="col">Status</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="order in orders" :key="order.id">
          <td>#{{ order.id }}</td>
          <td>Customer {{ order.userId }}</td>
          <td class="orders-table__product">{{ order.title }}</td>
          <td>
            <span
              class="status-badge"
              :class="`status-badge--${getOrderStatus(order)}`"
            >
              {{ getOrderStatusLabel(order) }}
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped lang="scss">
.orders-table-wrapper {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  overflow-x: auto;
}

.orders-table {
  width: 100%;
  min-width: 560px;
  border-collapse: collapse;
}

.orders-table th,
.orders-table td {
  text-align: left;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--color-border);
  font-size: 0.9rem;
  white-space: nowrap;
}

.orders-table__product {
  white-space: normal;
  min-width: 240px;
}

.orders-table th {
  font-size: 0.72rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--color-text-muted);
  background-color: var(--color-bg);
}

.orders-table tbody tr:last-child td {
  border-bottom: none;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.65rem;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 600;
}

.status-badge--completed {
  background-color: var(--color-success-bg);
  color: var(--color-success);
}

.status-badge--pending {
  background-color: var(--color-pending-bg);
  color: var(--color-pending);
}
</style>

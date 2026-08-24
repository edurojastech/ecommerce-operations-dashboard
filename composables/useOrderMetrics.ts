import { computed, type ComputedRef, type Ref } from 'vue'
import type { Order, OrderMetrics } from '~/types/order'

/**
 * Derives dashboard metrics from a reactive list of orders.
 * Kept separate from the store so metric logic can be reasoned about
 * (and unit tested) independently of how orders are fetched or stored.
 */
export function useOrderMetrics(orders: Ref<Order[]> | ComputedRef<Order[]>) {
  const total = computed(() => orders.value.length)
  const completed = computed(() => orders.value.filter(order => order.completed).length)
  const pending = computed(() => total.value - completed.value)
  const completionRate = computed(() => (total.value > 0 ? (completed.value / total.value) * 100 : 0))

  const metrics = computed<OrderMetrics>(() => ({
    total: total.value,
    completed: completed.value,
    pending: pending.value,
    completionRate: completionRate.value
  }))

  return { total, completed, pending, completionRate, metrics }
}

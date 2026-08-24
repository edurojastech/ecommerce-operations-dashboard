import type { Order } from '~/types/order'

const ORDERS_ENDPOINT = 'https://jsonplaceholder.typicode.com/todos'

/**
 * Data-fetching layer for orders.
 * Talks to JSONPlaceholder (used here as a simulated orders API) and knows
 * nothing about application state — that responsibility belongs to the
 * Pinia store (see stores/orders.ts).
 */
export function useOrders() {
  async function fetchOrders(): Promise<Order[]> {
    return await $fetch<Order[]>(ORDERS_ENDPOINT)
  }

  return { fetchOrders }
}

import { defineStore } from 'pinia'
import type { Order } from '~/types/order'

interface OrdersState {
  orders: Order[]
  loading: boolean
  error: string | null
}

/**
 * Single source of truth for order-related state.
 * Components read orders/loading/error from here instead of holding
 * their own copies, so the dashboard always renders a consistent view.
 */
export const useOrdersStore = defineStore('orders', {
  state: (): OrdersState => ({
    orders: [],
    loading: false,
    error: null
  }),

  actions: {
    async fetchOrders(): Promise<void> {
      const { fetchOrders } = useOrders()

      this.loading = true
      this.error = null

      try {
        this.orders = await fetchOrders()
      } catch {
        this.error = 'Unable to load orders right now. Please try again.'
      } finally {
        this.loading = false
      }
    },

    async refreshOrders(): Promise<void> {
      await this.fetchOrders()
    }
  }
})

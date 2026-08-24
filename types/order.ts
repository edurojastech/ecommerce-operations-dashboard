/**
 * Raw shape returned by the JSONPlaceholder /todos endpoint.
 * Mapped here as a simulated e-commerce order.
 */
export interface Order {
  id: number
  userId: number
  title: string
  completed: boolean
}

export type OrderStatus = 'completed' | 'pending'

export interface OrderMetrics {
  total: number
  completed: number
  pending: number
  completionRate: number
}

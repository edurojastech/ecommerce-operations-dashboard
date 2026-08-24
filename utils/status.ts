import type { Order, OrderStatus } from '~/types/order'

export function getOrderStatus(order: Order): OrderStatus {
  return order.completed ? 'completed' : 'pending'
}

export function getOrderStatusLabel(order: Order): string {
  return order.completed ? 'Completed' : 'Pending'
}

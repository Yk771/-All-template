import { CartItem } from '../types';

export function getItemPrice(item: CartItem): number {
  return item.product.price;
}

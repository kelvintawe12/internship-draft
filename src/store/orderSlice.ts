// src/store/orderSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  date: string;
  total: number;
  status: 'pending' | 'shipped' | 'delivered';
  items: OrderItem[];
}

interface OrderState {
  orders: Order[];
}

const initialState: OrderState = {
  orders: [],
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setOrders(state, action: PayloadAction<Order[]>) {
      state.orders = action.payload;
    },
    addToOrder(state, action: PayloadAction<{ productId: string; quantity: number }>) {
      const { productId, quantity } = action.payload;
      const existingOrder = state.orders.find(order => order.id === productId);

      if (existingOrder) {
        // Update quantity if the product already exists in the order
        existingOrder.items[0].quantity += quantity;
      } else {
        // Add a new order item
        state.orders.push({
          id: productId,
          date: new Date().toISOString(),
          total: 0, // Update total calculation logic as needed
          status: 'pending',
          items: [
            {
              id: productId,
              name: 'Product Name', // Replace with actual product name
              quantity,
              price: 0, // Replace with actual product price
            },
          ],
        });
      }
    },
  },
});

export const { setOrders, addToOrder } = orderSlice.actions;
export default orderSlice.reducer;
import { createSlice } from '@reduxjs/toolkit';

interface OrderItem {
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
    setOrders(state, action) {
      state.orders = action.payload;
    },
    addToOrder(state, action) {
      console.log('Add to order:', action.payload);
    },
  },
});

export const { setOrders, addToOrder } = orderSlice.actions;
export default orderSlice.reducer;
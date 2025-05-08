import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface OrderItem {
  productId: string;
  quantity: number;
}

interface OrderState {
  items: OrderItem[];
}

const initialState: OrderState = {
  items: [],
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    addToOrder: (state, action: PayloadAction<OrderItem>) => {
      const { productId, quantity } = action.payload;
      const existingItem = state.items.find((item) => item.productId === productId);
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({ productId, quantity });
      }
    },
    clearOrder: (state) => {
      state.items = [];
    },
  },
});

export const { addToOrder, clearOrder } = orderSlice.actions;
export default orderSlice.reducer;
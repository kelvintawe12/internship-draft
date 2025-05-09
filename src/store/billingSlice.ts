import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Invoice {
  id: string;
  date: string;
  amount: number;
  status: 'pending' | 'paid' | 'failed';
}

interface BillingState {
  invoices: Invoice[];
}

const initialState: BillingState = {
  invoices: [],
};

const billingSlice = createSlice({
  name: 'billing',
  initialState,
  reducers: {
    setInvoices(state, action: PayloadAction<Invoice[]>) {
      state.invoices = action.payload;
    },
  },
});

export const { setInvoices } = billingSlice.actions;
export default billingSlice.reducer;
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Ticket {
  id: string;
  subject: string;
  status: 'open' | 'pending' | 'closed';
  date: string;
  description?: string;
}

interface SupportState {
  tickets: Ticket[];
}

const initialState: SupportState = {
  tickets: [],
};

const supportSlice = createSlice({
  name: 'support',
  initialState,
  reducers: {
    setTickets(state, action: PayloadAction<Ticket[]>) {
      state.tickets = action.payload;
    },
  },
});

export const { setTickets } = supportSlice.actions;
export default supportSlice.reducer;
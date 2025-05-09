import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Message {
  id: string;
  from: string;
  subject: string;
  date: string;
  content: string;
  recipientType: 'admin' | 'support' | 'user';
}

interface MessageState {
  messages: Message[];
}

const initialState: MessageState = {
  messages: [],
};

const messageSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    setMessages(state, action: PayloadAction<Message[]>) {
      state.messages = action.payload;
    },
  },
});

export const { setMessages } = messageSlice.actions;
export default messageSlice.reducer;
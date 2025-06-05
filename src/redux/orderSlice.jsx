import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentOrder: null,
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setOrder1: (state, action) => {
      state.currentOrder = action.payload;
    },
    clearOrder: (state) => {
      state.currentOrder = null;
    },
  },
});

export const { setOrder1, clearOrder } = orderSlice.actions;
export default orderSlice.reducer;
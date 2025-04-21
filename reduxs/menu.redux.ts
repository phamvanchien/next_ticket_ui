import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface MenuSliceType {
  sidebarSelected?: string
}

const initialState: MenuSliceType = {
  sidebarSelected: ''
};

const menuSlice = createSlice({
  name: 'menu data',
  initialState,
  reducers: {
    setSidebarSelected(state, action: PayloadAction<string>) {
      state.sidebarSelected = action.payload;
    }
  },
});

export const { 
  setSidebarSelected
} = menuSlice.actions;

export default menuSlice.reducer;
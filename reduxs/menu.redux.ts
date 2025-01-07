import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface MenuSliceType {
  sidebar?: string
}

const initialState: MenuSliceType = {
  sidebar: '',
};

const menuSlice = createSlice({
  name: 'sidebar select',
  initialState,
  reducers: {
    setSidebarSelected(state, action: PayloadAction<string | undefined>) {
      state.sidebar = action.payload;
    }
  },
});

export const { setSidebarSelected } = menuSlice.actions;

export default menuSlice.reducer;
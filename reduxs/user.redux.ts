import { ResponseUserDataType } from '@/types/user.type';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserSliceType {
  data: ResponseUserDataType | null
}

const initialState: UserSliceType = {
  data: null
};

const userSlice = createSlice({
  name: 'user logged',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<ResponseUserDataType>) {
      state.data = action.payload;
    }
  },
});

export const { setUser } = userSlice.actions;

export default userSlice.reducer;
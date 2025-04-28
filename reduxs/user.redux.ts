import { ResponseUserDataType } from '@/types/user.type';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserSliceType {
  data: ResponseUserDataType | null
  userUpdated?: ResponseUserDataType
}

const initialState: UserSliceType = {
  data: null,
  userUpdated: undefined
};

const userSlice = createSlice({
  name: 'user logged',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<ResponseUserDataType>) {
      state.data = action.payload;
    },
    setUserUpdated(state, action: PayloadAction<ResponseUserDataType>) {
      state.userUpdated = action.payload;
    }
  },
});

export const { setUser, setUserUpdated } = userSlice.actions;

export default userSlice.reducer;
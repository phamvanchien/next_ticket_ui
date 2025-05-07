import { ProjectAttributeType, ProjectStatusType, ProjectType } from '@/types/project.type';
import { UserType } from '@/types/user.type';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface NotificationSliceType {
  notifyViewed?: number
}

const initialState: NotificationSliceType = {
  notifyViewed: undefined
};

const notificationSlice = createSlice({
  name: 'Notification data',
  initialState,
  reducers: {
    setNotifyViewed(state, action: PayloadAction<number>) {
      state.notifyViewed = action.payload;
    }
  },
});

export const { 
  setNotifyViewed
} = notificationSlice.actions;

export default notificationSlice.reducer;
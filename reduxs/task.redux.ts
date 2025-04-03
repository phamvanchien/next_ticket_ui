import { TaskType } from '@/types/task.type';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TaskSliceType {
  taskCreated?: TaskType
  taskUpdated?: TaskType
}

const initialState: TaskSliceType = {
  taskCreated: undefined,
  taskUpdated: undefined
};

const projectSlice = createSlice({
  name: 'task data',
  initialState,
  reducers: {
    setTaskCreated(state, action: PayloadAction<TaskType>) {
      state.taskCreated = action.payload;
    },
    setTaskUpdated(state, action: PayloadAction<TaskType>) {
      state.taskUpdated = action.payload;
    }
  },
});

export const { setTaskCreated, setTaskUpdated } = projectSlice.actions;

export default projectSlice.reducer;
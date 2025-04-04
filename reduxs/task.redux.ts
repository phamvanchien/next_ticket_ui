import { RequestGetTaskType, TaskType } from '@/types/task.type';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TaskSliceType {
  taskCreated?: TaskType
  taskUpdated?: TaskType,
  taskFilter: RequestGetTaskType
}

const initialState: TaskSliceType = {
  taskCreated: undefined,
  taskUpdated: undefined,
  taskFilter: {}
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
    },
    setTaskFilter(state, action: PayloadAction<RequestGetTaskType>) {
      state.taskFilter = action.payload;
    }
  },
});

export const { setTaskCreated, setTaskUpdated, setTaskFilter } = projectSlice.actions;

export default projectSlice.reducer;
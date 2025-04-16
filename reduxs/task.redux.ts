import { RequestGetTaskType, TaskType } from '@/types/task.type';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TaskSliceType {
  taskCreated?: TaskType
  taskUpdated?: TaskType
  taskDeleted?: TaskType
  taskFilter: RequestGetTaskType
  subTaskDone?: CheckListReduxType
  subTaskUnDo?: CheckListReduxType
  subTaskDeleted?: CheckListReduxType
  subTaskCreated?: CheckListReduxType
}

interface CheckListReduxType {
  taskId: number
  date: string
}

const initialState: TaskSliceType = {
  taskCreated: undefined,
  taskUpdated: undefined,
  taskDeleted: undefined,
  taskFilter: {},
  subTaskDone: undefined,
  subTaskUnDo: undefined,
  subTaskDeleted: undefined,
  subTaskCreated: undefined
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
    setTaskDeleted(state, action: PayloadAction<TaskType>) {
      state.taskDeleted = action.payload;
    },
    setTaskFilter(state, action: PayloadAction<RequestGetTaskType>) {
      state.taskFilter = action.payload;
    },
    setSubtaskDone(state, action: PayloadAction<CheckListReduxType>) {
      state.subTaskDone = action.payload;
    },
    setSubtaskUndo(state, action: PayloadAction<CheckListReduxType>) {
      state.subTaskUnDo = action.payload;
    },
    setSubtaskDeleted(state, action: PayloadAction<CheckListReduxType>) {
      state.subTaskDeleted = action.payload;
    },
    setSubtaskCreated(state, action: PayloadAction<CheckListReduxType>) {
      state.subTaskCreated = action.payload;
    }
  },
});

export const { setTaskCreated, setTaskUpdated, setTaskFilter, setSubtaskDone, setSubtaskUndo, setSubtaskDeleted, setSubtaskCreated, setTaskDeleted } = projectSlice.actions;

export default projectSlice.reducer;
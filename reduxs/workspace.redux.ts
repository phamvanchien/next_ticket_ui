import { WorkspaceType } from '@/types/workspace.type';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface WorkspaceSliceType {
  workspaceSelected?: WorkspaceType,
  workspaceUpdated?: WorkspaceType
}

const initialState: WorkspaceSliceType = {
  workspaceSelected: undefined,
  workspaceUpdated:  undefined
};

const workspaceSlice = createSlice({
  name: 'workspace data',
  initialState,
  reducers: {
    setWorkspaceSelected(state, action: PayloadAction<WorkspaceType | undefined>) {
      state.workspaceSelected = action.payload;
    },
    setWorkspaceUpdated(state, action: PayloadAction<WorkspaceType | undefined>) {
      state.workspaceUpdated = action.payload;
    }
  },
});

export const { 
  setWorkspaceSelected,
  setWorkspaceUpdated
} = workspaceSlice.actions;

export default workspaceSlice.reducer;
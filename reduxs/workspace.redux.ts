import { WorkspaceType } from '@/types/workspace.type';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface WorkspaceSliceType {
  workspaceSelected?: WorkspaceType
}

const initialState: WorkspaceSliceType = {
  workspaceSelected: undefined
};

const workspaceSlice = createSlice({
  name: 'workspace data',
  initialState,
  reducers: {
    setWorkspaceSelected(state, action: PayloadAction<WorkspaceType | undefined>) {
      state.workspaceSelected = action.payload;
    }
  },
});

export const { 
  setWorkspaceSelected
} = workspaceSlice.actions;

export default workspaceSlice.reducer;
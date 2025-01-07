import { WorkspaceType } from '@/types/workspace.type';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface WorkspaceSliceType {
  data: WorkspaceType | null
}

const initialState: WorkspaceSliceType = {
  data: null
};

const workspaceSlice = createSlice({
  name: 'Workspace',
  initialState,
  reducers: {
    setWorkspace(state, action: PayloadAction<WorkspaceType>) {
      state.data = action.payload;
    }
  },
});

export const { setWorkspace } = workspaceSlice.actions;

export default workspaceSlice.reducer;
import { ProjectAttributeType } from '@/types/project.type';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface WorkspaceSliceType {
  setAttribute: ProjectAttributeType[] | []
  dataUpdated: ProjectAttributeType | null
}

const initialState: WorkspaceSliceType = {
  setAttribute: [],
  dataUpdated: null
};

const workspaceSlice = createSlice({
  name: 'Project Attributes',
  initialState,
  reducers: {
    setAittributeList(state, action: PayloadAction<ProjectAttributeType[]>) {
      state.setAttribute = action.payload;
    },
    attributeUpdated(state, action: PayloadAction<ProjectAttributeType>) {
      state.dataUpdated = action.payload;
    }
  },
});

export const { setAittributeList, attributeUpdated } = workspaceSlice.actions;

export default workspaceSlice.reducer;
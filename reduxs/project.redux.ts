import { ProjectStatusType } from '@/types/project.type';
import { UserType } from '@/types/user.type';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ProjectSliceType {
  statusCreated?: ProjectStatusType
  statusUpdated?: ProjectStatusType
  statusDeletedId?: number
  membersProject?: UserType[]
  keywordSearchMember?: string
}

const initialState: ProjectSliceType = {
  statusCreated: undefined,
  statusUpdated: undefined,
  statusDeletedId: undefined,
  membersProject: undefined,
  keywordSearchMember: undefined
};

const projectSlice = createSlice({
  name: 'project data',
  initialState,
  reducers: {
    setStatusCreated(state, action: PayloadAction<ProjectStatusType>) {
      state.statusCreated = action.payload;
    },
    setStatusUpdated(state, action: PayloadAction<ProjectStatusType>) {
      state.statusUpdated = action.payload;
    },
    setStatusDeletedId(state, action: PayloadAction<number>) {
      state.statusDeletedId = action.payload;
    },
    setMembersProject(state, action: PayloadAction<UserType[]>) {
      state.membersProject = action.payload;
    },
    setKeywordSearchMembers(state, action: PayloadAction<string>) {
      state.keywordSearchMember = action.payload;
    }
  },
});

export const { setStatusCreated, setStatusUpdated, setStatusDeletedId, setMembersProject, setKeywordSearchMembers } = projectSlice.actions;

export default projectSlice.reducer;
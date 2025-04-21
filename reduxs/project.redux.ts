import { ProjectAttributeType, ProjectStatusType } from '@/types/project.type';
import { UserType } from '@/types/user.type';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ProjectSliceType {
  statusCreated?: ProjectStatusType
  statusUpdated?: ProjectStatusType
  statusDeletedId?: number
  membersProject?: UserType[]
  keywordSearchMember?: string
  attributeCreated?: ProjectAttributeType
  attributeDeleted?: number
  attributeUpdated?: ProjectAttributeType,
  isOwner: boolean
  isMember: boolean
}

const initialState: ProjectSliceType = {
  statusCreated: undefined,
  statusUpdated: undefined,
  statusDeletedId: undefined,
  membersProject: undefined,
  keywordSearchMember: undefined,
  attributeCreated: undefined,
  attributeDeleted: undefined,
  attributeUpdated: undefined,
  isOwner: false,
  isMember: false
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
    },
    setAttributeCreated(state, action: PayloadAction<ProjectAttributeType>) {
      state.attributeCreated = action.payload;
    },
    setAttributeDeleted(state, action: PayloadAction<number>) {
      state.attributeDeleted = action.payload;
    },
    setAttributeUpdated(state, action: PayloadAction<ProjectAttributeType>) {
      state.attributeUpdated = action.payload;
    },
    setIsOwnerProject(state, action: PayloadAction<boolean>) {
      state.isOwner = action.payload;
    },
    setIsMemberProject(state, action: PayloadAction<boolean>) {
      state.isMember = action.payload;
    }
  },
});

export const { 
  setStatusCreated, 
  setStatusUpdated, 
  setStatusDeletedId, 
  setMembersProject, 
  setKeywordSearchMembers, 
  setAttributeCreated, 
  setAttributeDeleted,
  setAttributeUpdated,
  setIsOwnerProject,
  setIsMemberProject
} = projectSlice.actions;

export default projectSlice.reducer;
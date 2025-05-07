import { combineReducers } from '@reduxjs/toolkit';
import userSlice from './user.redux';
import projectSlide from './project.redux';
import taskSlide from './task.redux';
import workspaceSlide from './workspace.redux';
import menuSlide from './menu.redux';
import notificationSlice from './notification.redux';

const rootReducer = combineReducers({
  userSlice: userSlice,
  projectSlide: projectSlide,
  taskSlide: taskSlide,
  workspaceSlide: workspaceSlide,
  menuSlide: menuSlide,
  notificationSlice: notificationSlice
});

export default rootReducer;
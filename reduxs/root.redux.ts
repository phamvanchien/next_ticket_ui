import { combineReducers } from '@reduxjs/toolkit';
import userSlice from './user.redux';
import projectSlide from './project.redux';
import taskSlide from './task.redux';

const rootReducer = combineReducers({
  userSlice: userSlice,
  projectSlide: projectSlide,
  taskSlide: taskSlide
});

export default rootReducer;
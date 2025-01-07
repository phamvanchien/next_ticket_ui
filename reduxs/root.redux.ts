import { combineReducers } from '@reduxjs/toolkit';
import userSlice from './user.redux';
import menuSlice from './menu.redux';
import workspaceSlice from './workspace.redux';

const rootReducer = combineReducers({
  userSlice: userSlice,
  menuSlice: menuSlice,
  workspaceSlice: workspaceSlice
});

export default rootReducer;
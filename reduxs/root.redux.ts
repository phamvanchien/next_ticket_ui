import { combineReducers } from '@reduxjs/toolkit';
import userSlice from './user.redux';
import menuSlice from './menu.redux';
import workspaceSlice from './workspace.redux';
import attributeSlice from './attribute.redux';

const rootReducer = combineReducers({
  userSlice: userSlice,
  menuSlice: menuSlice,
  workspaceSlice: workspaceSlice,
  attributeSlice: attributeSlice
});

export default rootReducer;
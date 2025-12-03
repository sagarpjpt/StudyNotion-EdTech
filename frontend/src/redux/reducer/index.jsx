import { combineReducers } from "@reduxjs/toolkit";
import profileReducer from '../slices/profileSlice'
import cartReducer from '../slices/cartSlice'
import courseReducer from "../slices/courseSlice"
import viewCourseReducer from '../slices/viewCourseSlice'

const rootReducer = combineReducers({
    // profile reducer
    profile: profileReducer,
    // cart reducer
    cart: cartReducer,
    // course reducer
    course: courseReducer,
    // viewCourse reduced
    viewCourse: viewCourseReducer
})

export default rootReducer
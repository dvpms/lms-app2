import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import uiReducer from './slices/uiSlice'
import { subjectsApi } from './api/subjectsApi'
import { materialsApi } from './api/materialsApi'
import { quizzesApi } from './api/quizzesApi'
import { questionsApi } from './api/questionsApi'
import { activityApi } from './api/activityApi'
import { leaderboardApi } from './api/leaderboardApi'
import { studentsApi } from './api/studentsApi'
import { uploadApi } from './api/uploadApi'
import { adminApi } from './api/adminApi'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    [subjectsApi.reducerPath]: subjectsApi.reducer,
    [materialsApi.reducerPath]: materialsApi.reducer,
    [quizzesApi.reducerPath]: quizzesApi.reducer,
    [questionsApi.reducerPath]: questionsApi.reducer,
    [activityApi.reducerPath]: activityApi.reducer,
    [leaderboardApi.reducerPath]: leaderboardApi.reducer,
    [studentsApi.reducerPath]: studentsApi.reducer,
    [uploadApi.reducerPath]: uploadApi.reducer,
    [adminApi.reducerPath]: adminApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      subjectsApi.middleware,
      materialsApi.middleware,
      quizzesApi.middleware,
      questionsApi.middleware,
      activityApi.middleware,
      leaderboardApi.middleware,
      studentsApi.middleware,
      uploadApi.middleware,
      adminApi.middleware,
    ),
})

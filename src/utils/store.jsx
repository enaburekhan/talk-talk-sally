import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { postsApi } from './postsApi';

export const store = configureStore({
  reducer: {
    // add the generated reducer as a specific top-level slice
    [postsApi.reducerPath]: postsApi.reducer,
  },

  // add the api middleware enables caching, invalidation, polling, and other useful features of rtk-query
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(postsApi.middleware),
});

setupListeners(store.dispatch);

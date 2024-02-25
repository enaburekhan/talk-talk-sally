// Need to use the React-specific entry point to import createApi
import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

// Define a service using a base URL and expected endpoints
export const postsApi = createApi({
  reducerPath: 'postsApi',
  baseQuery: fakeBaseQuery(),
  endpoints: (builder) => ({
    getPosts: builder.query({
      queryfn() {
        return { data: 'ok' };
      },
    }),
    addPosts: builder.mutation({
      async queryFn(data) {
        try {
          await addDoc(collection(db, 'posts'), {
            ...data,
            timestamp: serverTimestamp(),
          });
        } catch (err) {
          return { error: err };
        }
      },
    }),
  }),
});

export const { useGetPostsQuery, useAddPostsMutation } = postsApi;

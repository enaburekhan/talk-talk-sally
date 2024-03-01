// Need to use the React-specific entry point to import createApi
import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  addDoc,
  collection,
  getDocs,
  serverTimestamp,
  query,
  where,
} from 'firebase/firestore';
import { db } from './firebase';

// Define a service using a base URL and expected endpoints
export const postsApi = createApi({
  reducerPath: 'postsApi',
  baseQuery: fakeBaseQuery(),
  endpoints: (builder) => ({
    fetchPosts: builder.query({
      queryFn: async () => {
        try {
          const postsQuery = query(collection(db, 'posts'));
          const querySnapshot = await getDocs(postsQuery);
          let posts = [];
          console.log('querySnapshot1', querySnapshot);
          // Extract data from querySnapshot
          querySnapshot?.forEach((doc) => {
            posts.push({
              id: doc.id,
              ...doc.data(),
            });
          });

          console.log('posts', posts);
          return { data: posts };
        } catch (err) {
          console.log('err', err.message);
          return { error: err.message };
        }
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

export const { useFetchPostsQuery, useAddPostsMutation } = postsApi;

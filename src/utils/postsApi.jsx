// Need to use the React-specific entry point to import createApi
import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  addDoc,
  collection,
  getDocs,
  serverTimestamp,
  query,
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
} from 'firebase/firestore';
import { db } from './firebase';

// Define a service using a base URL and expected endpoints
export const postsApi = createApi({
  reducerPath: 'postsApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['Post'],
  endpoints: (builder) => ({
    fetchPosts: builder.query({
      queryFn: async () => {
        try {
          const postsQuery = query(collection(db, 'posts'));
          const querySnapshot = await getDocs(postsQuery);
          let posts = [];
          // Extract data from querySnapshot
          querySnapshot?.forEach((doc) => {
            // convert Firestore timestamp to Javascript Date object
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
      providesTags: ['Post'],
    }),
    fetchPost: builder.query({
      async queryFn(id) {
        try {
          const docRef = doc(db, 'posts', id);
          const snapshot = await getDoc(docRef);
          return { data: snapshot.data() };
        } catch (err) {
          return { error: err };
        }
      },
      providesTags: ['Post'],
    }),
    addPosts: builder.mutation({
      async queryFn(data) {
        try {
          await addDoc(collection(db, 'posts'), {
            ...data,
            timestamp: serverTimestamp(),
          });
          return { data: 'ok' };
        } catch (err) {
          return { error: err };
        }
      },
      invalidatesTags: ['Post'],
    }),
    deletePost: builder.mutation({
      async queryFn(id) {
        try {
          await deleteDoc(doc(db, 'posts', id));
          return { data: 'ok' };
        } catch (err) {
          return { error: err };
        }
      },
      invalidatesTags: ['Post'],
    }),
    updatePost: builder.mutation({
      async queryFn({ id, data }) {
        try {
          await updateDoc(doc(db, 'posts', id), {
            ...data,
            timestamp: serverTimestamp(),
          });
          return { data: 'ok' };
        } catch (err) {
          return { error: err };
        }
      },
      invalidatesTags: ['Post'],
    }),
  }),
});

export const {
  useFetchPostsQuery,
  useAddPostsMutation,
  useDeletePostMutation,
  useFetchPostQuery,
  useUpdatePostMutation,
} = postsApi;

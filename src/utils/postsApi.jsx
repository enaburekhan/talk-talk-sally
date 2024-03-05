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
            const data = doc.data();
            posts.push({
              id: doc.id,
              ...data,
              reactions: data.reactions || {},
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
    addReaction: builder.mutation({
      queryFn: ({ postId, reaction }) => ({
        url: `posts/${postId}/reactions`,
        method: 'POST',
        body: { reaction },
      }),
      onQueryStarted: async (
        { postId, reaction },
        { dispatch, queryFulfilled }
      ) => {
        try {
          // Get the document reference for the post
          const postRef = doc(db, 'posts', postId);

          // Get the current data of the post from firestore
          const postSnapshot = await getDoc(postRef);

          // Ensure the post exists
          if (!postSnapshot.exists()) {
            throw new Error('Post not found');
          }

          // Get the existing reactions or initialize an empty object
          const existingReactions = postSnapshot.data().reactions || {};

          // Update the reactions for the existing post
          await updateDoc(postRef, {
            reactions: {
              ...existingReactions,
              [reaction]: (existingReactions[reaction] || 0) + 1,
            },
            timestamp: serverTimestamp(),
          });
          // Optionally, you can dispatch an action to update the local state if needed
          dispatch(
            postsApi.util.updateQueryData('fetchPosts', undefined, (draft) => {
              const post = draft.find((post) => post.id === postId);
              if (post) {
                post.reactions[reaction] = (post.reactions[reaction] || 0) + 1;
              }
            })
          );

          // Continue with the query fulfillment
          await queryFulfilled();
        } catch (err) {
          return { error: err };
        }
      },
    }),
  }),
});

export const {
  useFetchPostsQuery,
  useAddPostsMutation,
  useDeletePostMutation,
  useFetchPostQuery,
  useUpdatePostMutation,
  useAddReactionMutation,
} = postsApi;

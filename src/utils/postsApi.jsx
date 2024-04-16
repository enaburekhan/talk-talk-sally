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
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';

// Define a service using a base URL and expected endpoints
export const postsApi = createApi({
  reducerPath: 'postsApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['Post', 'Comment'],
  endpoints: (builder) => ({
    fetchPosts: builder.query({
      queryFn: async () => {
        try {
          const postsQuery = query(collection(db, 'posts'));
          const querySnapshot = await getDocs(postsQuery);
          let posts = [];
          // Extract data from querySnapshot
          querySnapshot?.forEach((doc) => {
            const data = doc.data();
            posts.push({
              id: doc.id,
              ...data,
              reactions: data.reactions || {},
            });
          });
          return { data: posts };
        } catch (err) {
          console.error('Error fetching posts:', err);
          return { err };
        }
      },
      providesTags: ['Post'],
    }),
    fetchPost: builder.query({
      async queryFn(id) {
        try {
          const postRef = doc(db, 'posts', id);
          const postSnapshot = await getDoc(postRef);
          const postData = postSnapshot.data();

          // Fetch comments associated with the post
          const commentsSnapshot = await getDocs(
            collection(db, `posts/${id}/comments`)
          );
          const commentsData = commentsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          // Include comments data in the post data
          const postDataWithComments = {
            ...postData,
            comments: commentsData,
          };
          return { data: postDataWithComments };
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
      queryFn: ({ postId, reaction, userId }) => ({
        url: `posts/${postId}/reactions`,
        method: 'POST',
        body: { reaction, userId },
      }),
      onQueryStarted: async (
        { postId, reaction, userId },
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

          // Check if the user has already reacted with the selected reaction
          if (
            existingReactions[reaction] &&
            existingReactions[reaction].includes[userId]
          ) {
            throw new Error('User already reacted with this reaction');
          }

          // Update the reactions for the existing post
          await updateDoc(postRef, {
            reactions: {
              ...existingReactions,
              [reaction]: [...(existingReactions[reaction] || []), userId],
            },
            timestamp: serverTimestamp(),
          });
          // Optionally, you can dispatch an action to update the local state if needed
          dispatch(
            postsApi.util.updateQueryData('fetchPosts', undefined, (draft) => {
              const post = draft.find((post) => post.id === postId);
              if (post) {
                post.reactions[reaction] = (
                  post.reactions[reaction] || []
                ).concat(userId);
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
    // Add a mutation for user signup
    userSignup: builder.mutation({
      async queryFn({ email, password }) {
        try {
          const auth = getAuth();
          const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
          );
          const user = userCredential.user;
          return { data: user };
        } catch (err) {
          return { error: err };
        }
      },
    }),

    // Add a mutation for user signin
    userSignin: builder.mutation({
      async queryFn({ email, password }) {
        try {
          const auth = getAuth();
          const userCredential = await signInWithEmailAndPassword(
            auth,
            email,
            password
          );
          const user = userCredential.user;
          return { data: user };
        } catch (err) {
          return { error: err };
        }
      },
    }),
    userSignout: builder.mutation({
      async queryFn() {
        try {
          const auth = getAuth();
          await signOut(auth);
          return { data: 'Signout Successfully' };
        } catch (error) {
          console.error('error', error);
          return { error: error.message };
        }
      },
    }),
    addComment: builder.mutation({
      queryFn: async ({ postId, email, comment }) => {
        try {
          const commentRef = await addDoc(
            collection(db, `posts/${postId}/comments`),
            {
              email,
              comment,
              timestamp: serverTimestamp(),
            }
          );
          return { data: { id: commentRef.id, email, comment } };
        } catch (error) {
          return { error };
        }
      },
      invalidatesTags: ['Comment'],
    }),
    fetchComments: builder.query({
      queryFn: async (postId) => {
        try {
          const commentsSnapshot = await getDocs(
            collection(db, `posts/${postId}/comments`)
          );
          const commentsData = commentsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          return { data: commentsData };
        } catch (error) {
          return { error };
        }
      },
      providesTags: (result, error, postId) => [{ type: 'Comment', postId }],
    }),
    deleteComment: builder.mutation({
      queryFn: async (id) => {
        try {
          await deleteDoc(doc(db, `posts/${id}/comments`, commentId));
          return { data: 'ok' };
        } catch (err) {
          return { error: err };
        }
      },
      invalidatesTags: ['Comment'],
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
  useUserSignupMutation,
  useUserSigninMutation,
  useUserSignoutMutation,
  useAddCommentMutation,
  useFetchCommentsQuery,
} = postsApi;

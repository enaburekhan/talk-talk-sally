import {
  createAsyncThunk,
  createSlice,
  isRejectedWithValue,
} from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  const response = await axios.get(
    'https://opensheet.elk.sh/10DE07ZmtneIpeQzukJLo16BJAtv01t44msvb6_NlD9k/sheet1'
  );
  return response.data;
});

// const reorderProperties = (originalObject) => {
//   const orderedProperties = ['id', 'title', 'content'];
//   const reorderedObject = {};

//   orderedProperties.forEach((property) => {
//     if (originalObject.hasOwnProperty(property)) {
//       reorderedObject[property] = originalObject[property];
//     }
//   });
//   return reorderedObject;
// };

export const addNewPost = createAsyncThunk(
  'posts/addNewPost',
  async (newPost) => {
    try {
      console.log('newpost', newPost);

      const response = await axios.post(
        'https://script.google.com/macros/s/AKfycbzo0MEL8IEuPgeeP5RHS_PclmWVAwSkZRTD3g7V-4io35dcQmQye3_zz5ta3ZI6RsdZBw/exec',

        newPost
      );
      // The response includes the complete post object, including unique id
      const data = response.data;
      console.log('data', data);
      return data;
    } catch (error) {
      console.error('Error adding post:', error);

      // Reject with the error message
      return isRejectedWithValue(error.response.data);
    }
  }
);

const initialState = {
  posts: [],
  status: 'idle',
  error: null,
};

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchPosts.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // filter out duplicate posts based on unique property (e.g., post.id)
        const uniquePosts = action.payload.filter(
          (newPost) =>
            !state.posts.some((existingPost) => existingPost.id === newPost.id)
        );
        // We can directly add the new unique post object to our posts array
        state.posts = state.posts.concat(uniquePosts);
      })
      .addCase(addNewPost.fulfilled, (state, action) => {
        console.log('payload', state.posts.push(action.payload));
        state.posts.push(action.payload);
        console.log('state.posts', JSON.parse(JSON.stringify(state.posts)));
      });
  },
});

export default postsSlice.reducer;

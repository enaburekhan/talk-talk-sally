import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  const response = await axios.get(
    'https://opensheet.elk.sh/10DE07ZmtneIpeQzukJLo16BJAtv01t44msvb6_NlD9k/sheet1'
  );
  const data = response.data;
  return data;
});

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
        // We can directly add the new post object to our posts array
        state.posts = state.posts.concat(uniquePosts);
      });
    // .addCase(addNewPost.fulfilled, (state, action) => {
    //   state.posts.push(action.payload)
    // })
  },
});

export default postsSlice.reducer;

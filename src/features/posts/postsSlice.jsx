import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

// const API_KEY = 'AIzaSyBxKxoyo-wxdgnBANcON62jL1RsCi7Pql4';

// const SPREADSHEET_ID =
//   '702253097207-nug5ahk0epv9eu7ggu9cqddndufjilnk.apps.googleusercontent.com';
// const api = 'https://opensheet.elk.sh/10DE07ZmtneIpeQzukJLo16BJAtv01t44msvb6_NlD9k/sheet1'

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  const response = await axios.get(
    'https://opensheet.elk.sh/10DE07ZmtneIpeQzukJLo16BJAtv01t44msvb6_NlD9k/sheet1'
  );
  const data = response.data;
  console.log('data', data);
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
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // We can directly add the new post object to our posts array
        state.posts = state.posts.concat(action.payload);
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
    // .addCase(addNewPost.fulfilled, (state, action) => {
    //   state.posts.push(action.payload)
    // })
  },
});

export default postsSlice.reducer;

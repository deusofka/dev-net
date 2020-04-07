import axios from "axios";
import {
  GET_POSTS,
  POST_ERROR,
  UPDATE_LIKES,
  DELETE_POST,
  ADD_POST,
  GET_POST,
  UPDATE_COMMENT,
} from "./types";
import { setAlert } from "./alert";

const handleError = (e, dispatch) => {
  // store error from res.status(500).send("Server Error") in profile state
  dispatch({
    type: POST_ERROR,
    payload: { msg: e.response.statusText, status: e.response.status },
  });
};

const handleErrors = (e, dispatch) => {
  const errors = e.response.data.errors;
  // show alerts for errors from res.status(404).json(errors: [{msg: "Profile does not exist"}])
  if (errors) {
    errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
  }
  // store error from res.status(500).send("Server Error") in profile state
  dispatch({
    type: POST_ERROR,
    payload: { msg: e.response.statusText, status: e.response.status },
  });
};

// Get posts
export const getPosts = () => async (dispatch) => {
  try {
    const res = await axios.get("/api/posts");
    dispatch({
      type: GET_POSTS,
      payload: res.data,
    });
  } catch (e) {
    handleError(e, dispatch);
  }
};

// Get post
export const getPost = (userId) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/posts/${userId}`);
    dispatch({
      type: GET_POST,
      payload: res.data,
    });
  } catch (e) {
    handleError(e, dispatch);
  }
};

// Add post
export const addPost = (formData) => async (dispatch) => {
  try {
    const res = await axios.post("/api/posts/", formData);
    dispatch({
      type: ADD_POST,
      payload: res.data,
    });
    dispatch(setAlert("Post Created", "success"));
  } catch (e) {
    handleError(e, dispatch);
  }
};

// Delete post
export const deletePost = (postId) => async (dispatch) => {
  try {
    await axios.delete(`/api/posts/${postId}`);
    dispatch({
      type: DELETE_POST,
      payload: postId,
    });
    dispatch(setAlert("Post Removed", "success"));
  } catch (e) {
    handleError(e, dispatch);
  }
};

// Add like
export const addLike = (postId) => async (dispatch) => {
  try {
    const res = await axios.post(`/api/posts/${postId}/like`);
    dispatch({
      type: UPDATE_LIKES,
      payload: { postId, likes: res.data },
    });
  } catch (e) {
    handleErrors(e, dispatch);
  }
};
// Remove like
export const removeLike = (postId) => async (dispatch) => {
  try {
    const res = await axios.delete(`/api/posts/${postId}/like`);
    dispatch({
      type: UPDATE_LIKES,
      payload: { postId, likes: res.data },
    });
  } catch (e) {
    handleErrors(e, dispatch);
  }
};

// Add comment
export const addComment = (formData, postId) => async (dispatch) => {
  try {
    const res = await axios.post(`/api/posts/${postId}/comments`, formData);
    dispatch({
      type: UPDATE_COMMENT,
      payload: { comments: res.data },
    });
    dispatch(setAlert("Comment Added", "success"));
  } catch (e) {
    handleError(e, dispatch);
  }
};
// Delete comment
export const deleteComment = (postId, commentId) => async (dispatch) => {
  try {
    const res = await axios.delete(
      `/api/posts/${postId}/comments/${commentId}`
    );
    dispatch({
      type: UPDATE_COMMENT,
      payload: res.data,
    });
    dispatch(setAlert("Comment Removed"));
  } catch (e) {
    handleError(e, dispatch);
  }
};

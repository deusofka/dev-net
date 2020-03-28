import axios from "axios";
import { GET_PROFILE, PROFILE_ERROR } from "./types";

// Get current user's profile
export const getCurrentProfile = () => async dispatch => {
  try {
    const res = await axios.get("api/profile/");
    dispatch({ type: GET_PROFILE, payload: res.data });
  } catch (e) {
    console.log(e);
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: e.response.statusText, status: e.response.status }
    });
  }
};

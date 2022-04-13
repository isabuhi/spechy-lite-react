import axios from "axios";
import { BASE_URL } from "../../../../../@core/auth/jwt/jwtService";

export const getUsers = (data) => {
  return async (dispatch) => {
    await axios
      .post(`${BASE_URL}/api/user-management/user/pagination`, {
        limit: 10,
        offset: 1,
        page: data.page,
        perPage: data.perPage,
        user_id: data.user_id,
        status: data.status,
        searchValue: data.searchValue,
        name: data.name,
        memberCount: data.memberCount,
      })
      .then((response) => {
        console.log("hellllo", response.data.data);
        dispatch({
          type: "GET_USERS_DATA",
          data: response.data.data,
          // memberCount: response.data.data.memberCount,
        });
      });
  };
};

export const getFilterUsers = (id) => {
  return async (dispatch) => {
    await axios
      .get(`${BASE_URL}/api/user-management/user/select/${id}`)
      .then((response) => {
        dispatch({
          type: "GET_SMS_TEMPLATE",
          data: response.data.data[0],
        });
      });
  };
};
export const deleteUser = (id) => {
  return async (dispatch) => {
    await axios
      .delete(`${BASE_URL}/api/user-management/user/delete/${id}`)
      .then((res) => {
        dispatch({
          type: "DELETE_USERS_TEMPLATE",
          data: id,
        });
        dispatch({
          type: "CLOSE_USERS_MODAL",
          data: false,
        });
      });
  };
};

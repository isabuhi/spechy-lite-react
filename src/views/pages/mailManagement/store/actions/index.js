import axios from "axios";
import { BASE_URL } from "../../../../../@core/auth/jwt/jwtService";

export const getMailManagementList = (data) => {
  return async (dispatch) => {
    await axios
      .post(`${BASE_URL}/api/mail-management/account/pagination`, {
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
        console.log("helllloMail", response.data.data);
        dispatch({
          type: "GET_USER_GROUPS_DATA",
          data: response.data.data,
        });
      });
  };
};

export const getFilterItems = (id) => {
  return async (dispatch) => {
    await axios
      .get(`${BASE_URL}/api/mail-management/account/select/${id}`)
      .then((response) => {
        // console.log(response.data.data);
        dispatch({
          type: "GET_SMS_TEMPLATE",
          data: response.data.data,
        });
      });
  };
};

export const deleteUserGroups = (id) => {
  return async (dispatch) => {
    await axios
      .delete(`${BASE_URL}/api/user-management/teams/delete-team/${id}`)
      .then((res) => {
        dispatch({
          type: "DELETE_USER_GROUP",
          data: id,
        });
        dispatch({
          type: "CLOSE_MODAL",
          data: false,
        });
      });
  };
};

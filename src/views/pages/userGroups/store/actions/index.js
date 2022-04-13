import axios from "axios";
import { BASE_URL } from "../../../../../@core/auth/jwt/jwtService";

export const getUserGroupsList = (data) => {
  return async (dispatch) => {
    await axios
      .post(`${BASE_URL}/api/user-management/teams/pagination`, {
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
          type: "GET_USER_GROUPS_DATA",
          data: response.data.data,
          memberCount: response.data.data.memberCount,
        });
      });
  };
};

// export const getUserGroupsList = (params) => {
//   return async (dispatch) => {
//     await axios
//       .post(`${BASE_URL}/api/user-management/user/get-all-users`, params)
//       .then((response) => {
//         console.log("checkthepag", response);
//         // dispatch({
//         //   type: "GET_USER_GROUPS_DATA",
//         //   allData: response.data.data,
//         //   templatesList: response.data.data,
//         //   total: response.data.last_page,
//         //   totalItems: response.data.total,
//         //   currentPage: response.data.current_page,
//         //   params,
//         // });
//         // console.log("request has been made from actions.", response.data);
//       });
//   };
// };

export const getFilterItems = (id) => {
  return async (dispatch) => {
    await axios
      .get(`${BASE_URL}/api/user-management/teams/select/${id}`)
      .then((response) => {
        console.log(response.data.data);
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
          type: "DELETE_GROUP_MODAL_OPEN",
          data: false,
        });
      });
  };
};

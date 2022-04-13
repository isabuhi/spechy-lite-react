import axios from "axios";
import { BASE_URL } from "../../../../../@core/auth/jwt/jwtService";

export const getAllData = (data) => {
  return async (dispatch) => {
    await axios
      .post(`${BASE_URL}/api/project-management/auto-assign/pagination`, {
        limit: 10,
        offset: 1,
        page: data.page,
        perPage: data.perPage,
        searchValue: data.searchValue,
        tempFreezing: 0,
        type: 0,
        project_id: data.project_id,
      })
      .then((response) => {
        dispatch({
          type: "GET_ALL_DATA",
          data: response.data.data,
          totalPage: response.data.numberOfPage,
        });
      });
  };
};

// export const getConversationReadCodeList = (params) => {
//   return async (dispatch) => {
//     await axios
//       .post(`${BASE_URL}/api/project-management/auto-assign/pagination`, params)
//       .then((response) => {
//         console.log("request has been made from actions.", response);
//         // dispatch({
//         //   type: "GET_EMAIL_TEMPLATE_DATA",
//         //   allData: response.data.data,
//         //   templatesList: response.data.data,
//         //   totalPages: response.data.last_page,
//         //   totalItems: response.data.total,
//         //   currentPage: response.data.current_page,
//         //   params,
//         // });
//       });
//   };
// };
export const getFilterItems = (id) => {
  return async (dispatch) => {
    await axios
      .get(`${BASE_URL}/api/project-management/auto-assign/select/${id}`)
      .then((response) => {
        dispatch({
          type: "GET_SMS_TEMPLATE",
          data: response.data.data,
        });
      });
  };
};
export const deleteProject = (id) => {
  return async (dispatch) => {
    await axios
      .delete(`${BASE_URL}/api/project-management/auto-assign/delete/${id}`)
      .then((res) => {
        dispatch({
          type: "DELETE_AUTO_ASSIGN",
          data: id,
        });
        dispatch({
          type: "DELETE_AUTO_ASSIGN_MODAL_OPEN",
          data: false,
        });
      });
  };
};

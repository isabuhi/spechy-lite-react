import axios from "axios";
import { BASE_URL } from "../../../../../@core/auth/jwt/jwtService";

export const getCategory = (data) => {
  return async (dispatch) => {
    await axios
      .post(`${BASE_URL}/api/ticket-management/ticket-category/pagination`, {
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
          type: "GET_CATEGORY_DATA",
          data: response.data.data,
          // memberCount: response.data.data.memberCount,
        });
      });
  };
};

// export const getConversationReadCodeList = (params) => {
//     return async (dispatch) => {
//         await axios
//             .post(
//                 `${BASE_URL}/api/ticket-management/ticket-category/pagination`,
//                 params
//             )
//             .then((response) => {
//                 dispatch({
//                     type: "GET_EMAIL_TEMPLATE_DATA",
//                     allData: response.data.data,
//                     templatesList: response.data.data,
//                     totalPages: response.data.last_page,
//                     totalItems: response.data.total,
//                     currentPage: response.data.current_page,
//                     params,
//                 });
//                 //console.log("request has been made from actions.", response.data)
//             });
//     };
// };
export const getFilterItems = (id) => {
  return async (dispatch) => {
    await axios
      .get(`${BASE_URL}/api/ticket-management/ticket-category/select/${id}`)
      .then((response) => {
        //console.log(response.data.data)
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
      .delete(`${BASE_URL}/api/ticket-management/ticket-category/delete/${id}`)
      .then((res) => {
        dispatch({
          type: "DELETE_GATEGORIES_TEMPLATE",
          data: id,
        });
        dispatch({
          type: "CLOSE_GATEGORIES_MODAL",
          data: false,
        });
      });
  };
};

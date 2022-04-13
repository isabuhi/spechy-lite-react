import axios from "axios";
import { BASE_URL } from "../../../../../@core/auth/jwt/jwtService";

export const getConversationReadCodeList = (params) => {
  return async (dispatch) => {
    await axios
      .post(`${BASE_URL}/api/customer-management/call-lists/pagination`, params)
      .then((response) => {
        dispatch({
          type: "GET_ALL_CALL_DATA",
          allData: response.data.data,
          templatesList: response.data.data,
          totalPages: response.data.last_page,
          totalItems: response.data.total,
          currentPage: response.data.current_page,
          params,
        });
        console.log("request has been made from actions.", response.data);
      });
  };
};

export const deleteAW = (id) => {
  return async (dispatch) => {
    await axios
      .delete(
        `${BASE_URL}/api/project-management/ready-answer/delete-answer/${id}`
      )
      .then((res) => {
        dispatch({
          type: "DELETE_SMS_TEMPLATE",
          data: id,
        });
        dispatch({
          type: "CLOSE_MODAL",
          data: false,
        });
      });
  };
};

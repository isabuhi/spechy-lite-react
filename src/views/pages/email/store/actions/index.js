import axios from "axios";
import { BASE_URL } from "../../../../../@core/auth/jwt/jwtService";

export const getConversationReadCodeList = (params) => {
  return async (dispatch) => {
    await axios
      .post(
        `${BASE_URL}/api/project-management/email-template/pagination`,
        params
      )
      .then((response) => {
        dispatch({
          type: "GET_EMAIL_TEMPLATE_DATA",
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
export const getFilterItems = (id) => {
  return async (dispatch) => {
    await axios
      .get(`${BASE_URL}/api/project-management/email-template/select/${id}`)
      .then((response) => {
        console.log(response.data.data);
        dispatch({
          type: "GET_SMS_TEMPLATE",
          data: response.data.data,
        });
      });
  };
};
export const deleteEmail = (id) => {
  return async (dispatch) => {
    await axios
      .delete(
        `${BASE_URL}/api/project-management/email-template/delete-email-template/${id}`
      )
      .then((res) => {
        dispatch({
          type: "DELETE_EMAIL_TEMPLATE",
          data: id,
        });
        dispatch({
          type: "CLOSE_EMAIL_MODAL",
          data: false,
        });
      });
  };
};

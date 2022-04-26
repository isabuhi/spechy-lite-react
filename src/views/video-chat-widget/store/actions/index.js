import axios from "axios";
import { BASE_URL } from "../../../../@core/auth/jwt/jwtService";

export const getChatVedioList = (params) => {
  return async (dispatch) => {
    await axios
      .post(
        `${BASE_URL}/api/conversation-management/video-chat-widget/pagination`,
        params
      )
      .then((response) => {
        dispatch({
          type: "GET_VEDIO_WIDGET_DATA",
          allData: response.data.data,
          templatesList: response.data.data,
          totalPages: response.data.last_page,
          totalItems: response.data.total,
          currentPage: response.data.current_page,
          params,
        });
      });
  };
};
export const getFilterItems = (id) => {
  return async (dispatch) => {
    await axios
      .get(
        `${BASE_URL}/api/conversation-management/video-chat-widget/select/chat-button/${id}`
      )
      .then((response) => {
        dispatch({
          type: "GET_VEDIO_WIDGET_SELECT",
          data: response.data.data,
        });
      });
  };
};

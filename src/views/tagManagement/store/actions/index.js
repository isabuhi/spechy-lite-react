import axios from "axios";
import { BASE_URL } from "../../../../../src/@core/auth/jwt/jwtService";

export const getTags = (data) => {
  return async (dispatch) => {
    await axios
      .post(`${BASE_URL}/api/project-management/tag/pagination`, {
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
        console.log("hellllotag", response.data.data);
        dispatch({
          type: "GET_TAG_DATA",
          data: response.data.data,
          // memberCount: response.data.data.memberCount,
        });
      });
  };
};

export const getEmailTemplate = (templateID) => {
  return async (dispatch) => {
    await axios
      .get(`${BASE_URL}/api/project-management/tag/select/${templateID}`)
      .then((response) => {
        dispatch({
          type: "GET_SMS_TEMPLATE",
          data: response.data.data[0],
        });
      });
  };
};
export const deleteTag = (templateID) => {
  console.log(templateID);
  return async (dispatch) => {
    await axios
      .delete(`${BASE_URL}/api/project-management/tag/delete/${templateID}`, {
        template_id: templateID,
      })
      .then((res) => {
        dispatch({
          type: "DELETE_TAG_TEMPLATE",
          data: templateID,
        });
        dispatch({
          type: "CLOSE_TAG_MODAL",
          data: false,
        });
      });
  };
};

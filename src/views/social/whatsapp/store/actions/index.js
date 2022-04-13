import axios from "axios";
import {BASE_URL} from "../../../../../@core/auth/jwt/jwtService";

export const getWhatsappList = (params) => {
    return async (dispatch) => {
        await axios
            .post(
                `${BASE_URL}/api/conversation-management/whatsapp-account/pagination`,
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
                // console.log("request has been made from actions.", response.data)
            });
    };
};
export const getEmailTemplate = (templateID) => {
    return async (dispatch) => {
        await axios
            .get(
                `${BASE_URL}/api/project-management/sms-template/select/${templateID}`
            )
            .then((response) => {
                dispatch({
                    type: "GET_SMS_TEMPLATE",
                    data: response.data.data[0],
                });
            });
    };
};
export const deleteWhatsapp = (templateID) => {
    return async (dispatch) => {
        await axios
            .get(
                `${BASE_URL}/api/conversation-management/whatsapp-account/delete/${templateID}`,
                {
                    template_id: templateID,
                }
            )
            .then((res) => {
                dispatch({
                    type: "DELETE_SMS_TEMPLATE",
                    data: templateID,
                });
                dispatch({
                    type: "CLOSE_MODAL",
                    data: false,
                });
            });
    };
};

import axios from "axios";
import { BASE_URL } from "../../../../../src/@core/auth/jwt/jwtService";

// ** Get all Data
export const getAllData = (data) => {
  return async (dispatch) => {
    await axios
      .post(`${BASE_URL}/api/customer-management/customer/company/pagination`, {
        limit: 10,
        offset: 1,
        page: data.page,
        per_page: data.per_page,
        searchValue: data.searchValue,
        customer_company_id: data.customer_company_id,
      })
      .then((response) => {
        dispatch({
          type: "GET_ALL_DATA",
          data: response.data.data,
          total: response.data.total,
        });
      });
  };
};

export const getFilterItems = () => {
  return async (dispatch) => {
    await axios
      .get(
        `${BASE_URL}/api/project-management/address-management/country/get-all-countries`
      )
      .then((res) => {
        console.log("showtheres", res);
        dispatch({
          type: "GET_FILTER_ITEMS",
          data: res.data.data,
        });
      });
  };
};

export const getCompany = (customer_company_id) => {
  return async (dispatch) => {
    await axios
      .get(
        `${BASE_URL}/api/customer-management/customer/company/select/${customer_company_id}`
      )
      .then((response) => {
        dispatch({
          type: "GET_COMPANY_DATA",
          data: response.data.data[0],
        });
        console.log("hellll2", data);
      });
  };
};

export const addCompany = (data) => {
  return async (dispatch) => {
    await axios
      .post(
        `${BASE_URL}/api/customer-management/customer/company/create-new-company`,
        {
          name: data.name,
          customer_company_id: data.customer_company_id,
          email_address: data.email_address,
          phone_number: data.phone_number,
          country: data.country,
          district: data.district,
          city: data.city,
          member: data.member,
        }
      )
      .then((response) => {
        if (response.status === 200) {
          dispatch({
            type: "ADD_COMPANY",
            data: data.data,
          });
          console.log("hellll3", data);
        }
      });
  };
};

export const deleteCompany = (customer_company_id) => {
  return async (dispatch) => {
    await axios
      .delete(
        `${BASE_URL}/api/customer-management/customer/company/delete-company/${customer_company_id}`
      )
      .then((response) => {
        console.log("whhhhhhatif", response);
        dispatch({
          type: "DELETE_COMPANY",
          data: response.id,
        });
        // console.log("deletethestate",data)
        dispatch({
          type: "DELETE_COMPANY_MODAL_OPEN",
          data: false,
        });
      });
  };
};

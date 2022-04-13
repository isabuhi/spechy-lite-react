import axios from "axios";
import { BASE_URL } from "../../../../@core/auth/jwt/jwtService";

// ** Get all Data
// export const getAllCustomerData = (data) => {
//   return async (dispatch) => {
//     await axios
//       .post(`${BASE_URL}/api/customer-management/customer/pagination`, {
//         limit: 10,
//         offset: 1,
//         page: data.page,
//         per_page: data.per_page,
//         searchValue: data.searchValue,
//         customer_id: data.customer_id,
//       })
//       .then((response) => {
//         dispatch({
//           type: "GET_ALL_CUSTOMER_DATA",
//           data: response.data.data,
//           total: response.data.total,
//         });
//       });
//   };
// };
console.log("helloftomcinstomer");

export const getAllCustomerData = (params) => {
  return async (dispatch) => {
    await axios
      .post(`${BASE_URL}/api/customer-management/customer/pagination`, params)
      .then((response) => {
        dispatch({
          type: "GET_ALL_CUSTOMER_DATA",
          allData: response.data.data,
          data: response.data.data,
          totalPages: response.data.last_page,
          totalItems: response.data.total,
          currentPage: response.data.current_page,
          params,
        });
        //console.log("request has been made from actions.", response.data)
      });
  };
};

export const getCountries = () => {
  return async (dispatch) => {
    await axios
      .get(
        `${BASE_URL}/api/project-management/address-management/country/get-all-countries`
      )
      .then((res) => {
        dispatch({
          type: "GET_FILTER_ITEMS",
          data: res.data.data,
        });
      });
  };
};

export const getFilterItems = (id) => {
  return async (dispatch) => {
    await axios
      .get(`${BASE_URL}/api/customer-management/customer/select/${id}`)
      .then((response) => {
        console.log(response.data.data);
        dispatch({
          type: "GET_CUSTOMER_DATA",
          data: response.data.data,
        });
      });
  };
};

// export const deleteCustomer = (customer_id) => {
//   return async (dispatch) => {
//     await axios
//       .delete(
//         `${BASE_URL}/api/customer-management/customer/delete-customer/${customer_id}`
//       )
//       .then((response) => {
//         dispatch({
//           type: "DELETE_CUSTOMER",
//           data: response.customer_id,
//         });
//         // console.log("deletethestate",data)
//         dispatch({
//           type: "DELETE_MODAL_OPEN",
//           data: false,
//         });
//       });
//   };
// };

export const deleteCustomer = (id) => {
  console.log("givemethecustomer", id);
  return async (dispatch) => {
    await axios
      .delete(
        `${BASE_URL}/api/customer-management/customer/delete-customer/${id}`,
        {
          id: id,
        }
      )
      .then((res) => {
        dispatch({
          type: "DELETE_CUSTOMER_TEMPLATE",
          data: id,
        });
        dispatch({
          type: "CLOSE_MODALS",
          data: false,
        });
      });
  };
};

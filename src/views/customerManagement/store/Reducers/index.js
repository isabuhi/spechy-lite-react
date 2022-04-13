const initialState = {
  allData: [],
  data: [],
  totalPage: 1,
  params: {},
  selectedProject: null,
  filterItems: [],
  addedProject: null,
  totalLogPage: 1,
  isDeleteModalOpens: {
    status: false,
    id: null,
  },
};

const customers = (state = initialState, action) => {
  switch (action.type) {
    case "GET_FILTER_ITEMS":
      return { ...state, filterItems: action.data };
    case "GET_ALL_CUSTOMER_DATA":
      return { ...state, allData: action.data, total: action.total };

    case "GET_DATA":
      return {
        ...state,
        data: action.data,
        total: action.total,
        params: action.params,
      };

    // case "GET_SMS_ROLES":
    //   console.log("rolesms", { ...state, allData: action.data });

    //   return {
    //     ...state,
    //     allData: action.data,
    //     // totalPage:action.totalPage
    //   };
    case "GET_CUSTOMER_DATA":
      return { ...state, selectedContact: action.data };
    // case "ADD_COMPANY":
    //   console.log("addingdatatoproject", {
    //     ...state,
    //     addedContact: action.data,
    //   });
    //   return { ...state, addedProject: action.data };
    case "DELETE_CUSTOMER_TEMPLATE":
      let newState = state.allData.filter((c) => c.customer_id !== action.data);

      return {
        ...state,
        allData: newState,
      };

    // case "DELETE_MODAL_OPENS":
    //   return {
    //     ...state,
    //     isDeleteModalOpens: {
    //       status: action.data,
    //       id: action.id,
    //     },
    //   };
    case "CLOSE_MODALS":
      return {
        ...state,
        isDeleteModalOpens: {
          status: action.data,
          id: action.id,
        },
      };

    default:
      return { ...state };
  }
};
export default customers;

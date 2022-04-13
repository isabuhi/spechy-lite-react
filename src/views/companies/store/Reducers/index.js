const initialState = {
  allData: [],
  data: [],
  totalPage: 1,
  params: {},
  selectedProject: null,
  filterItems: [],
  addedProject: null,
  totalLogPage: 1,
  isDeleteModalOpen: {
    status: false,
    id: null,
  },
};

const companies = (state = initialState, action) => {
  switch (action.type) {
    case "GET_FILTER_ITEMS":
      return { ...state, filterItems: action.data };
    case "GET_ALL_DATA":
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
    case "GET_COMPANY_DATA":
      return { ...state, selectedContact: action.data };
    case "ADD_COMPANY":
      return { ...state, addedProject: action.data };
    case "DELETE_COMPANY":
      let newState = state.allData.filter(
        (c) => c.customer_company_id !== action.data
      );

      return {
        ...state,
        allData: newState,
      };

    case "DELETE_COMPANY_MODAL_OPEN":
      return {
        ...state,
        isDeleteModalOpen: {
          status: action.data,
          id: action.id,
        },
      };

    default:
      return { ...state };
  }
};
export default companies;

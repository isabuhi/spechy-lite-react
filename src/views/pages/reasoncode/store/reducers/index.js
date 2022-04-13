const initialState = {
  allData: [],
  data: [],
  totalPage: 1,
  params: {},
  selectedUser: null,
  addedUser: null,
  filterItems: [],
  userLogData: [],
  totalLogPage: 1,
  isDeleteModalOpen: {
    status: false,
    id: null,
  },
};

const reasonCode = (state = initialState, action) => {
  switch (action.type) {
    case "GET_FILTER_ITEMS":
      return { ...state, filterItems: action.data };

    case "GET_REASON_CODE_DATA":
      return { ...state, allData: action.allData, totalPage: action.totalPage };
    case "GET_DATA":
      return {
        ...state,
        data: action.data,
        totalPage: action.totalPages,
        params: action.params,
      };
    case "GET_USER":
      return { ...state, selectedUser: action.data };
    case "ADD_USER":
      return { ...state, addedUser: action.data };
    case "DELETE_REASON":
      let newState = state.allData.filter((c) => c.userID !== action.data);
      return {
        ...state,
        allData: newState,
      };
    case "USER_LOG_DATA":
      return {
        ...state,
        userLogData: action.data.data,
        totalLogPage: action.totalLogPage,
      };
    case "DELETE_REASON_MODAL_OPEN":
      console.log("thedeletemodeopen", {
        ...state,
        isDeleteModalOpen: {
          status: action.data,
          id: action.id,
        },
      });
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
export default reasonCode;

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

const chatWidgetVedio = (state = initialState, action) => {
  switch (action.type) {
    case "GET_VEDIO_WIDGET_SELECT":
      return { ...state, filterItems: action.data };

    case "GET_VEDIO_WIDGET_DATA":
      return { ...state, allData: action.allData, totalPage: action.totalPage };

    default:
      return { ...state };
  }
};
export default chatWidgetVedio;

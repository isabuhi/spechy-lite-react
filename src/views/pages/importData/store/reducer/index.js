// ** Initial State
const initialState = {
    templatesList: [],
    total: 1,
    totalPages: 1,
    currentPage: 1,
    params: {},
    allData: [],
    searchedValue: '',
    isDeleteModalOpen: {
        status: false,
        id: null
    }
}

const emailTemplate = (state = initialState, action) => {
    switch (action.type) {
        case 'GET_EMAIL_TEMPLATE_DATA':
            return {
                ...state,
                allData: action.allData,
                templatesList: action.templatesList,
                total: action.totalItems,
                totalPages: action.totalPages,
                params: action.params,
                currentPage: action.currentPage
            }
        case 'CLOSE_MODAL':
            console.log("thedeletemodeopen", {
                ...state,
                isDeleteModalOpen: {
                    status: action.templatesList,
                    id: action.id
                }
            })
            return {
                ...state,
                isDeleteModalOpen: {
                    status: action.data,
                    id: action.id
                }
            }
        default:
            return state
    }
}

export default emailTemplate

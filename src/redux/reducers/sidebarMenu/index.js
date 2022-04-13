const initialState = {
    menu: []
}

const menuReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'MENU_MOUNTED' :
            return {
                ...state, menu: action.payload
            }

        default:
            return state
    }
}

export default menuReducer;

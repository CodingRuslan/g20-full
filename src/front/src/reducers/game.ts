const initialState = {
  loading: false,
  trades: [],
  countries: [],
  error: '',
  success: '',
  links: []
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'GET_TRADES':
      return {
        ...state,
        trades: action.payload,
      };

    case 'ADD_TRADES':
      return {
        ...state,
        trades: [action.payload, ...state.trades],
      };

    case 'DELETE_TRADE':
      return {
        ...state,
        trades: state.trades.filter((item: any) => item.id !== action.payload),
      };

    case 'GET_COUNTRIES':
      return {
        ...state,
        countries: action.payload,
      };

    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
      };

    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };

    case 'SET_SUCCESS':
      return {
        ...state,
        success: action.payload,
      };

    case 'CLEAR_SUCCESS':
      return {
        ...state,
        success: null,
      };

    case 'LOAD_LINKS':
      return {
        ...state,
        links: action.payload,
      };

    default:
      return state;
  }
};

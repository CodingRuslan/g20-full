import moment from 'moment';
import {ReferenceBookService} from '../services';


const referenceBookService = new ReferenceBookService();


const getAllCountries = () => async dispatch => {
  dispatch({ type: 'SET_LOADING', payload: true});
    try {
        const {data} = await referenceBookService.getAllCountries();

        return data;
      } catch ({ response: {data} }) {
        dispatch({ type: 'SET_ERROR', payload: data.error});
        return data;
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false});
      }

  };

  const addResources = () => async dispatch => {
    dispatch({ type: 'SET_LOADING', payload: true});
      try {
          const {data} = await referenceBookService.addResources();

          return data;
        } catch ({ response: {data} }) {
          dispatch({ type: 'SET_ERROR', payload: data.error});
          return data;
        } finally {
          dispatch({ type: 'SET_LOADING', payload: false});
        }

    };

  const getGameStatus = () => async dispatch => {
    dispatch({ type: 'SET_LOADING', payload: true});
      try {
          const {data} = await referenceBookService.getGameStatus();

          return data;
        } catch ({ response: {data} }) {
          dispatch({ type: 'SET_ERROR', payload: data.error});
          return data;
        } finally {
          dispatch({ type: 'SET_LOADING', payload: false});
        }

    };

    const setGameStatus = () => async dispatch => {
      dispatch({ type: 'SET_LOADING', payload: true});
        try {
            await referenceBookService.setGameStatus();
          } catch ({ response: {data} }) {
            dispatch({ type: 'SET_ERROR', payload: data.error});
            return data;
          } finally {
            dispatch({ type: 'SET_LOADING', payload: false});
          }

      };

  const addResourceToCountry = body => async dispatch => {
    dispatch({ type: 'SET_LOADING', payload: true});
      try {
          const {data} = await referenceBookService.addResourceToCountry(body);

          return data;
        } catch ({ response: {data} }) {
          dispatch({ type: 'SET_ERROR', payload: data.error});
          return data;
        } finally {
          dispatch({ type: 'SET_LOADING', payload: false});
        }

    };

  const addResourceToAll = ({resource, count}) => async dispatch => {
      dispatch({ type: 'SET_LOADING', payload: true});
        try {
            const {data} = await referenceBookService.addResourceToAll({resource, count});

            return data;
          } catch ({ response: {data} }) {
            dispatch({ type: 'SET_ERROR', payload: data.error});
            return data;
          } finally {
            dispatch({ type: 'SET_LOADING', payload: false});
          }

    };

  const getAllResources = () => async dispatch => {
    dispatch({ type: 'SET_LOADING', payload: true});
    try {
        const {data} = await referenceBookService.getAllResources();

        return data;
      } catch ({ response: {data} }) {
        dispatch({ type: 'SET_ERROR', payload: data.error});
        return data;
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false});
      }

  };

  const createTrade = data => async dispatch => {
    dispatch({ type: 'SET_LOADING', payload: true});
    try {
        const result = await referenceBookService.createTrade(data);

        if(result.data.status === 'active') {
          dispatch({ type: 'ADD_TRADES', payload: result.data});
          dispatch({ type: 'CLEAR_ERROR'});
          dispatch({
            type: 'SET_SUCCESS',
            payload: `[${moment().utc().add(3, 'hours').format('HH:mm:ss')}] Сделка зарегистрирована`}
          );
        } else {
          dispatch({ type: 'DELETE_TRADE', payload: result.data.deletedTrade});
          dispatch({ type: 'CLEAR_ERROR'});
          dispatch({
            type: 'SET_SUCCESS',
            payload: `[${moment().utc().add(3, 'hours').format('HH:mm:ss')}] Сделка успешно закрыта`}
          );
        }
      } catch ({ response: {data} }) {
        dispatch({ type: 'SET_ERROR', payload: data.error});
        return data;
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false});
      }
  };

  const getAllTrades = () => async dispatch => {
    dispatch({ type: 'SET_LOADING', payload: true});
    try {
        const {data} = await referenceBookService.getAllTrades();

        dispatch({ type: 'GET_TRADES', payload: data})

        return data;
      } catch ({ response: {data} }) {
        dispatch({ type: 'SET_ERROR', payload: data.error});
        return data;
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false});
      }

  };

  const getAllAds = () => async dispatch => {
    dispatch({ type: 'SET_LOADING', payload: true});
    try {
        const {data} = await referenceBookService.getAllAds();

        dispatch({ type: 'GET_TRADES', payload: data})

        return data;
      } catch ({ response: {data} }) {
        dispatch({ type: 'SET_ERROR', payload: data.error});
        return data;
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false});
      }

  };

  const getAllClosedTrades = () => async dispatch => {
    dispatch({ type: 'SET_LOADING', payload: true});
    try {
        const {data} = await referenceBookService.getAllClosedTrades();

        dispatch({ type: 'GET_TRADES', payload: data})

        return data;
      } catch ({ response: {data} }) {
        dispatch({ type: 'SET_ERROR', payload: data.error});
        return data;
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false});
      }

  };

  const getInfoAboutCountries = () => async dispatch => {
    dispatch({ type: 'SET_LOADING', payload: true});
    try {
      const {data} = await referenceBookService.getInfoAboutContries();

      dispatch({ type: 'GET_COUNTRIES', payload: data});
      return data;
    } catch ({ response: {data} }) {
      dispatch({ type: 'SET_ERROR', payload: data.error});
      return data;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false});
    }
  }

  const getAllBuilds = () => async dispatch => {
    dispatch({ type: 'SET_LOADING', payload: true});
    try {
      const {data} = await referenceBookService.getAllBuilds();

      return data;
    } catch ({ response: {data} }) {
      dispatch({ type: 'SET_ERROR', payload: data.error});
      return data;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false});
    }
  }

  const deleteTrade = (id, uniqTradeKey) => async dispatch => {
    dispatch({ type: 'SET_LOADING', payload: true});
    try {
      const {data} = await referenceBookService.deleteTrade({id, uniqTradeKey});
      if(data.affected === 1) {
        dispatch({ type: 'DELETE_TRADE', payload: id});
      }

      dispatch({ type: 'CLEAR_ERROR'});
      dispatch({
        type: 'SET_SUCCESS',
        payload: `[${moment().utc().add(3, 'hours').format('HH:mm:ss')}] Сделка успешно удалена!`}
       );

      return data;
    } catch ({ response: {data} }) {
      dispatch({ type: 'SET_ERROR', payload: data.error});
      return data;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false});
    }
  }

  const importDatabase = file => async dispatch => {
    const data = new FormData();
    data.append('file', file);

    dispatch({ type: 'SET_LOADING', payload: true});
      try {
          await referenceBookService.importDatabase(data);
        } catch ({ response: {data} }) {
          dispatch({ type: 'SET_ERROR', payload: data.error});
          return data;
        } finally {
          dispatch({ type: 'SET_LOADING', payload: false});
        }
  };

  const downloadTradeDatabase = () => async dispatch => {
    dispatch({ type: 'SET_LOADING', payload: true});
    try {
        const {data} = await referenceBookService.downloadTradeDatabase();

        downloadFile(data, 'База всех сделок.xlsx');

      } catch ({ response: {data} }) {
        dispatch({ type: 'SET_ERROR', payload: data.error});
        return data;
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false});
      }

  };

  const clearMessage = () => async dispatch => {
    dispatch({ type: 'CLEAR_ERROR', payload: true});
  }

  const clearSuccessMessage = () => async dispatch => {
    dispatch({ type: 'CLEAR_SUCCESS', payload: true});
  }

  const createBuild = body => async dispatch => {
    dispatch({ type: 'SET_LOADING', payload: true});
    try {
        const {data} = await referenceBookService.createBuild(body);
        dispatch({ type: 'CLEAR_ERROR'});
        dispatch({
          type: 'SET_SUCCESS',
          payload: `[${moment().utc().add(3, 'hours').format('HH:mm:ss')}] Развитие сферы выполнено!`}
        );
        return data;
      } catch ({ response: {data} }) {
        dispatch({ type: 'SET_ERROR', payload: data.error});
        return data;
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false});
      }

  };

  const addMoney = body => async dispatch => {
    dispatch({ type: 'SET_LOADING', payload: true});
    try {
        const {data} = await referenceBookService.addMoney(body);

        return data;
      } catch ({ response: {data} }) {
        dispatch({ type: 'SET_ERROR', payload: data.error});
        return data;
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false});
      }

  };

  const getHeaderLinks = () => async dispatch => {
    dispatch({ type: 'SET_LOADING', payload: true});
    try {
        const {data} = await referenceBookService.getHeaderLinks();
        dispatch({ type: 'LOAD_LINKS', payload: data});

        return data;
      } catch ({ response: {data} }) {
        dispatch({ type: 'SET_ERROR', payload: data.error});
        return data;
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false});
      }

  };

  const setTimerResourceUpdating = body => async dispatch => {
    dispatch({ type: 'SET_LOADING', payload: true});
    try {
      const {data} = await referenceBookService.setTimerResourceUpdating(body);
      dispatch({ type: 'SET_TIMER', payload: data});

      return Number(data);
    } catch ({ response: {data} }) {
      dispatch({ type: 'SET_ERROR', payload: data.error});
      return data;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false});
    }
  };

  const getTimerResourceUpdating = () => async dispatch => {
    try {
      const {data} = await referenceBookService.getTimerResourceUpdating();
      dispatch({ type: 'SET_TIMER', payload: data});

      return Number(data)
    } catch ({ response: {data} }) {
      dispatch({ type: 'SET_ERROR', payload: data.error});
      return data;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false});
    }
  };

  const deleteTimerResourceUpdating = () => async dispatch => {
    dispatch({ type: 'SET_LOADING', payload: true});
    try {
      const {data} = await referenceBookService.deleteTimerResourceUpdating();
      dispatch({ type: 'REMOVE_TIMER'});

      return data;
    } catch ({ response: {data} }) {
      dispatch({ type: 'SET_ERROR', payload: data.error});
      return data;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false});
    }
  };

  const downloadFile = (buffer, nameOfFile) => {
    const data = new Blob([buffer], { type: 'application/octet-stream' });
    const csvURL = window.URL.createObjectURL(data);
    let tempLink = document.createElement('a');
    tempLink.href = csvURL;
    tempLink.setAttribute('download', nameOfFile);
    tempLink.click();
  }

  export {
    getAllCountries,
    getAllResources,
    createTrade,
    getAllTrades,
    getInfoAboutCountries,
    getAllAds,
    getAllClosedTrades,
    deleteTrade,
    addResourceToCountry,
    addResourceToAll,
    importDatabase,
    downloadTradeDatabase,
    getGameStatus,
    setGameStatus,
    getAllBuilds,
    createBuild,
    clearMessage,
    addResources,
    addMoney,
    getHeaderLinks,
    clearSuccessMessage,
    setTimerResourceUpdating,
    getTimerResourceUpdating,
    deleteTimerResourceUpdating
  };

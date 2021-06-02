import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { routerMiddleware } from 'connected-react-router';
import { createBrowserHistory } from 'history';

import reducer from './reducers';

export const history = createBrowserHistory();

export const store = createStore(reducer(history), applyMiddleware(thunk, routerMiddleware(history)));

(window as any).store = store;

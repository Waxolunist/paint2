import {combineReducers, compose, createStore} from 'redux';
import {lazyReducerEnhancer} from 'pwa-helpers';
import {connectRouter} from 'lit-redux-router';

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?? compose;

const store = createStore(
  (state: any): any => state,
  composeEnhancers(lazyReducerEnhancer(combineReducers))
);

connectRouter(store);

export default store;

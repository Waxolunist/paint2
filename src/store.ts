import {
  combineReducers,
  compose,
  createStore,
  applyMiddleware,
  Action,
} from 'redux';
import {lazyReducerEnhancer} from 'pwa-helpers';
import {connectRouter} from 'lit-redux-router';
import paint from './ducks/paint';
import thunk from 'redux-thunk';

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?? compose;

const logger = <S, T>({getState}: {getState: () => S}) => (
  next: (action: Action<T>) => any
) => (action: Action<T>) => {
  console.log('will dispatch', action);

  // Call the next dispatch method in the middleware chain.
  const returnValue = next(action);

  console.log('state after dispatch', getState());

  // This will likely be the action itself, unless
  // a middleware further in chain changed it.
  return returnValue;
};

const store = createStore(
  <STATE>(state: STATE): STATE => state,
  composeEnhancers(
    lazyReducerEnhancer(combineReducers),
    applyMiddleware(thunk, logger)
  )
);

connectRouter(store);

store.addReducers({
  paint,
});

export default store;

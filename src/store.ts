import {
  combineReducers,
  compose,
  createStore,
  applyMiddleware,
  Action, Middleware, Dispatch,
} from 'redux';
import {lazyReducerEnhancer} from 'pwa-helpers';
import {connectRouter, navigate} from 'lit-redux-router';
import paint from './ducks/paint';
import thunk from 'redux-thunk';
import {RouterState} from 'lit-redux-router/lib/reducer';
import {PaintState} from './ducks/paint-model';
import { Actions } from 'lit-redux-router/lib/actions';
import database from './database';

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}

export type AppState = {router: RouterState, paint: PaintState};

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?? compose;

const logger = <S, T>({getState}: {getState: () => S}) => (
  next: (action: Action<T>) => any
) => (action: Action<T>) => {
  console.log('will dispatch', action);
  const returnValue = next(action);
  console.log('state after dispatch', getState());
  return returnValue;
};

const router: Middleware<unknown, AppState> = <T extends string>({dispatch, getState}: {dispatch: Dispatch, getState: () => AppState}) => (
    next: (action: Actions | Action<T>) => any
) => (action: Action<T>) => {
  const retVal = next(action);
  if(action.type.startsWith('@paint')) {
    const {router, paint} = getState();
    const activePaintingId = paint.activePainting?.painting?.id;
    if (activePaintingId && router.activeRoute === '/') {
      dispatch(navigate(`/paint/${activePaintingId}`));
    } else if(!activePaintingId && router.activeRoute !== '/') {
      dispatch(navigate('/'));
    }
  }
  return retVal;
};

const store = createStore(
  <STATE=AppState>(state: STATE): STATE => state,
  composeEnhancers(
    lazyReducerEnhancer(combineReducers),
    applyMiddleware(thunk.withExtraArgument(database()), logger, router)
  )
);

connectRouter(store);

store.addReducers({
  paint,
});

export default store;

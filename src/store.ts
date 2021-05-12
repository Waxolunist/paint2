import {
  combineReducers,
  compose,
  createStore,
  applyMiddleware,
  Action,
  Middleware,
  Dispatch,
  Store,
  AnyAction,
} from 'redux';
import {lazyReducerEnhancer} from 'pwa-helpers';
import {connectRouter, navigate} from 'lit-redux-router';
import paint from './ducks/paint';
import thunk from 'redux-thunk';
import {RouterState} from 'lit-redux-router/lib/reducer';
import {PaintState} from './ducks/paint-model';
import {Actions} from 'lit-redux-router/lib/actions';
import database from './database';
import {LazyStore} from 'pwa-helpers/lazy-reducer-enhancer';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}

export type AppState = {router: RouterState; paint: PaintState};

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?? compose;

const logger =
  <S, T>({getState}: {getState: () => S}) =>
  (next: (action: Action<T>) => unknown) =>
  (action: Action<T>) => {
    console.groupCollapsed(`store dispatch ${action.type}`);
    console.log('will dispatch', action);
    const returnValue = next(action);
    console.log('state after dispatch', getState());
    console.groupEnd();
    return returnValue;
  };

const knownRoutes = ['/', '/about'];

const router: Middleware<unknown, AppState> =
  <T extends string>({
    dispatch,
    getState,
  }: {
    dispatch: Dispatch;
    getState: () => AppState;
  }) =>
  (next: (action: Actions | Action<T>) => unknown) =>
  (action: Action<T>) => {
    const retVal = next(action);
    if (action.type.startsWith('@paint')) {
      const {router, paint} = getState();
      const activePaintingId = paint.activePainting?.painting?.id;
      if (activePaintingId && router.activeRoute === '/') {
        dispatch(navigate(`/paint/${activePaintingId}`));
      } else if (
        !activePaintingId &&
        knownRoutes.indexOf(router.activeRoute) < 0
      ) {
        dispatch(navigate('/'));
      }
    }
    return retVal;
  };

let store: Store<AppState, AnyAction> = <Store<AppState, AnyAction>>{};

const composeStore = () => {
  if (!store.dispatch) {
    const storeInternal = createStore<AppState, AnyAction, LazyStore, unknown>(
      (state) => <AppState>state,
      composeEnhancers(
        lazyReducerEnhancer(combineReducers),
        applyMiddleware(thunk.withExtraArgument(database()), logger, router)
      )
    );

    connectRouter(storeInternal);

    storeInternal.addReducers({
      paint,
    });
    store = storeInternal;
  }
  return store;
};

export const initStore = (): Store<AppState, AnyAction> => {
  const store = composeStore();
  return store;
};

initStore();
export default store;

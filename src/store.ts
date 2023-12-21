import {navigate} from 'lit-redux-router';
import {Actions} from 'lit-redux-router/lib/actions';
import routeReducer from 'lit-redux-router/lib/reducer';
import Route from 'lit-redux-router/lib/route';
import {LazyStore} from 'pwa-helpers/lazy-reducer-enhancer';
import {Action, Dispatch, MiddlewareAPI, UnknownAction} from 'redux';
import database from './database';
import paintReducer from './ducks/paint';
import {configureStore, EnhancedStore} from '@reduxjs/toolkit';

export type AppState = {
  paint: ReturnType<typeof paintReducer>;
  router: ReturnType<typeof routeReducer>;
};

type UntypedMiddleware = (
  api: MiddlewareAPI<Dispatch<UnknownAction | Actions>, AppState>
) => (next: (action: unknown) => unknown) => (action: unknown) => unknown;

const logger: UntypedMiddleware = (api) => (next) => (action) => {
  try {
    console.groupCollapsed(`store dispatch ${(<UnknownAction>action).type}`);
    console.log('will dispatch', action);
    const returnValue = next(action);
    console.log('state after dispatch', api.getState());
    return returnValue;
  } finally {
    console.groupEnd();
  }
};

const knownRoutes = ['/', '/about'];

const router: UntypedMiddleware = (api) => (next) => (action) => {
  const retVal = next(action);
  if ((<UnknownAction>action).type.startsWith('@paint')) {
    const {router, paint} = api.getState();
    const activePaintingId = paint.activePainting?.painting?.id;
    if (activePaintingId && router?.activeRoute === '/') {
      api.dispatch(navigate(`/paint/${activePaintingId}`));
    } else if (
      !activePaintingId &&
      router?.activeRoute &&
      knownRoutes.indexOf(router?.activeRoute) < 0
    ) {
      api.dispatch(navigate('/'));
    }
  }
  return retVal;
};

const store: EnhancedStore<AppState, Actions | Action> = configureStore({
  reducer: {
    paint: paintReducer,
    router: routeReducer,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({
      thunk: {
        extraArgument: database(),
      },
      serializableCheck: false,
    }).concat(logger, router);
  },
});

Route(store as Readonly<LazyStore & EnhancedStore<AppState, Action>>);

export default store;

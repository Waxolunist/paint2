import {navigate} from 'lit-redux-router';
import {Actions} from 'lit-redux-router/lib/actions';
import reducer from 'lit-redux-router/lib/reducer';
import Route from 'lit-redux-router/lib/route';
import {RouterState} from 'lit-redux-router/lib/reducer';
import {Dispatch, Middleware, UnknownAction} from 'redux';
import database from './database';
import paintReducer from './ducks/paint';
import {PaintState} from './ducks/paint-model';
import {configureStore, EnhancedStore} from '@reduxjs/toolkit';

export type AppState = {router?: RouterState; paint: PaintState};

// @ts-ignore
const logger: Middleware<Record<string, never>, AppState> =
  ({getState}: {getState: () => AppState}) =>
  (next: Dispatch<Actions | UnknownAction>) =>
  (action: UnknownAction | Actions) => {
    try {
      console.groupCollapsed(`store dispatch ${action?.type}`);
      console.log('will dispatch', action);
      const returnValue = next(action);
      console.log('state after dispatch', getState());
      return returnValue;
    } finally {
      console.groupEnd();
    }
  };

const knownRoutes = ['/', '/about'];

// @ts-ignore
const router: Middleware<
  Record<string, never>,
  AppState,
  Dispatch<Actions | UnknownAction>
> =
  ({
    dispatch,
    getState,
  }: {
    dispatch: Dispatch<UnknownAction | Actions>;
    getState: () => AppState;
  }) =>
  (next: Dispatch<Actions | UnknownAction>) =>
  (action: UnknownAction | Actions) => {
    const retVal = next(action);
    if (action.type.startsWith('@paint')) {
      const {router, paint} = getState();
      const activePaintingId = paint.activePainting?.painting?.id;
      if (activePaintingId && router?.activeRoute === '/') {
        dispatch(navigate(`/paint/${activePaintingId}`));
      } else if (
        !activePaintingId &&
        router?.activeRoute &&
        knownRoutes.indexOf(router?.activeRoute) < 0
      ) {
        dispatch(navigate('/'));
      }
    }
    return retVal;
  };

const store: EnhancedStore<AppState, Actions | UnknownAction> = configureStore({
  reducer: {
    paint: paintReducer,
    router: reducer,
  },
  //@ts-ignore
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({
      thunk: {
        extraArgument: database(),
      },
      serializableCheck: false,
    }).concat(logger, router);
  },
});

//@ts-ignore
Route(store);

export default store;

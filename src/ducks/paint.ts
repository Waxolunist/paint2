import {Action, AnyAction, Reducer} from 'redux';
import {
  CRUDPayload,
  Painting,
  PaintingImpl,
  PaintingRawDataImpl,
  PaintState,
  Stroke,
} from './paint-model';
import {
  extractIdFromUrl,
  newSortedDeduplicatedPaintingsArray,
  removePaintingFromArray,
} from './paint-utils';
import {ThunkAction as TAction, ThunkDispatch as TDispatch} from 'redux-thunk';
import {AppState} from '../store';
import {PaintingDatabase} from '../database';

/*** types ***/
const STORE = '@paint/STORE';
const UNLOAD = '@paint/UNLOAD';
const LOAD = '@paint/LOAD';
const NEW = '@paint/NEW';
const DELETE = '@paint/DELETE';
const INIT = '@paint/INIT';

export type CRUDActionTypes =
  | typeof STORE
  | typeof LOAD
  | typeof UNLOAD
  | typeof NEW
  | typeof DELETE
  | typeof INIT;
/*** actions ***/
interface CRUDAction extends Action {
  type: CRUDActionTypes;
  payload?: CRUDPayload | PaintState | number | string;
}

type PaintActionTypes = CRUDAction;

export type ThunkDispatch = TDispatch<
  AppState,
  Promise<PaintingDatabase>,
  PaintActionTypes
>;

export type ThunkAction = TAction<
  void,
  AppState,
  Promise<PaintingDatabase>,
  PaintActionTypes
>;

const loadPainting = async (
  database: PaintingDatabase,
  paintings: Painting[],
  id?: number | string
): Promise<CRUDPayload | undefined> => {
  const paintingIdToLoad = id || extractIdFromUrl();
  const painting = paintings.find((p) => p.id == paintingIdToLoad);
  if (painting) {
    const rawData = await database.strokes.get(
      parseInt(paintingIdToLoad as string)
    );
    return {
      painting,
      rawData: rawData,
    };
  }
  return undefined;
};

export const storeData =
  ({
    id,
    dataUrl,
    strokes,
  }: {
    id: number;
    dataUrl: string;
    strokes: Stroke[];
  }): ThunkAction =>
  async (dispatch, getState, database: Promise<PaintingDatabase>) => {
    getState()
      .paint.paintings.find((p) => p.id == id)
      ?.freeMemory();
    const db = await database;
    const painting = new PaintingImpl(dataUrl, id);
    const rawData = new PaintingRawDataImpl(id, strokes);
    try {
      await db.transaction('rw', db.paintings, db.strokes, async () => {
        const updated = await db.paintings.update(id, painting);
        if (updated) {
          await Promise.all([painting.cleanState(), db.strokes.put(rawData)]);
        }
      });
      return dispatch({
        type: STORE,
        payload: {
          painting,
          rawData,
        },
      });
    } catch (e) {
      console.error(e);
    }
    return undefined;
  };

export const loadData =
  (id?: number | string): ThunkAction =>
  async (dispatch, getState, database) => {
    if (id) {
      const db = await database;
      const {paint} = getState();
      const payload = await loadPainting(db, paint.paintings, id);
      if (payload) {
        return dispatch({
          type: LOAD,
          payload,
        });
      }
    }
    return undefined;
  };

export const unloadData = (): ThunkAction => async (dispatch) =>
  dispatch({type: UNLOAD});

export const newPainting =
  (): ThunkAction => async (dispatch, _getState, database) => {
    const db = await database;
    const painting = new PaintingImpl();
    await db.paintings.put(painting);
    return dispatch({
      type: NEW,
      payload: {
        painting,
      },
    });
  };

export const removePainting =
  (id?: number | string): ThunkAction =>
  async (dispatch, getState, database: Promise<PaintingDatabase>) => {
    try {
      if (id) {
        const painting = getState().paint.paintings.find((p) => p.id == id);
        painting?.freeMemory();
        const db = await database;
        await db.transaction('rw', db.paintings, db.strokes, async () => {
          await Promise.all([
            db.paintings.delete(parseInt(id as string)),
            db.strokes.delete(parseInt(id as string)),
          ]);
        });
        return dispatch({
          type: DELETE,
          payload: id,
        });
      }
      return undefined;
    } catch (e) {
      console.error(e);
    }
    return undefined;
  };

export const initialLoad =
  (): ThunkAction => async (dispatch, _getState, database) => {
    const db = await database;
    const paintingsDB = await db.paintings.toArray();
    const paintingsArray = paintingsDB.map(
      (p) => new PaintingImpl(p.dataUrl, p.id)
    );
    await Promise.all(paintingsArray.map((p) => p.cleanState()));
    const payload = await loadPainting(db, paintingsArray);
    return dispatch({
      type: INIT,
      payload: {
        paintings: paintingsArray,
        activePainting: payload,
        initialized: true,
      },
    });
  };

const initialState: PaintState = {
  paintings: [],
  activePainting: undefined,
  initialized: false,
};

const paintReducer: Reducer<PaintState, AnyAction> = (
  state = initialState,
  action: AnyAction
): PaintState => {
  switch (action.type) {
    case STORE:
      return {
        ...state,
        paintings: newSortedDeduplicatedPaintingsArray([
          ...state.paintings,
          ((<CRUDAction>action).payload as CRUDPayload).painting,
        ]),
      };
    case UNLOAD:
      return {
        ...state,
        activePainting: undefined,
      };
    case LOAD:
    case NEW:
      return {
        ...state,
        paintings: newSortedDeduplicatedPaintingsArray([
          ...state.paintings,
          ((<CRUDAction>action).payload as CRUDPayload).painting,
        ]),
        activePainting: (<CRUDAction>action).payload as CRUDPayload,
      };
    case DELETE:
      return {
        ...state,
        paintings: removePaintingFromArray(
          (<CRUDAction>action).payload as string,
          state.paintings
        ),
        activePainting: undefined,
      };
    case INIT:
      return {
        ...state,
        ...((<CRUDAction>action).payload as PaintState),
      };
    default:
      return state;
  }
};

export default paintReducer;

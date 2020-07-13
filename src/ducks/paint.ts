import {
  PaintState,
  CRUDPayload,
  PaintingImpl,
  PaintingRawData,
  Painting,
} from './paint-model';
import {AnyAction, Reducer} from 'redux';
import {ThunkDispatch as TDispatch, ThunkAction as TAction} from 'redux-thunk';
import database from '../database';

/*** types ***/
const STORE = '@paint/STORE';
const LOAD = '@paint/LOAD';
const NEW = '@paint/NEW';

/*** actions ***/
interface CRUDAction extends AnyAction {
  type: typeof STORE | typeof LOAD | typeof NEW;
  payload: CRUDPayload;
}

type PaintActionTypes = CRUDAction;

export type ThunkDispatch = TDispatch<PaintState, null, PaintActionTypes>;

export type ThunkAction = TAction<void, PaintState, null, PaintActionTypes>;

export const storeData = ({
  id,
  dataUrl,
  strokes,
}: {
  id?: string;
  dataUrl: string;
  strokes: Stroke[];
}): ThunkAction => async (dispatch) => {
  const db = await database();
  const painting = new PaintingImpl(dataUrl, id);
  const paintingId = await db.paintings.put(painting);
  await painting.cleanState();
  const rawData = new PaintingRawData(paintingId, strokes);
  await db.strokes.put(rawData);
  return dispatch({
    type: STORE,
    payload: {
      painting,
      rawData,
    },
  });
};

export const loadData = (id?: number | string): ThunkAction => async (dispatch) => {
  console.log(id);
  const db = await database();
  if(id) {
    const painting = await db.paintings.get(parseInt(id as string));
    if (painting) {
      return dispatch({
        type: LOAD, payload: {
          painting,
          rawData: undefined,
        }
      });
    }
  }
  return undefined;
};

export const newPainting = (): ThunkAction => async (dispatch) => {
  const db = await database();
  const painting = new PaintingImpl();
  await db.paintings.put(painting);
  return dispatch({
    type: NEW,
    payload: {
      painting,
    },
  });
};

const initialState: PaintState = {
  paintings: [],
  activePainting: undefined,
};

const paintingsArray = (paintings: Painting[]): Painting[] => {
  return [
    ...new Map(
      paintings
        .filter((p) => p)
        .map((p: Painting): [number | undefined, Painting] => [p.id, p])
        .sort(([idA], [idB]) => idA! - idB!)
    ).values(),
  ];
};

const paintReducer: Reducer<PaintState, AnyAction> = (
  state = initialState,
  action: AnyAction
): PaintState => {
  switch (action.type) {
    case STORE:
      return {
        ...state,
        paintings: paintingsArray([
          ...state.paintings,
          (<CRUDAction>action).payload.painting,
        ]),
        activePainting: undefined,
      };
    case LOAD:
    case NEW:
      return {
        ...state,
        paintings: paintingsArray([
          ...state.paintings,
          (<CRUDAction>action).payload.painting,
        ]),
        activePainting: (<CRUDAction>action).payload,
      };
    default:
      return state;
  }
};

export default paintReducer;

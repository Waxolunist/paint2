import {PaintState, CRUDPayload} from './paint-model';
import {AnyAction, Reducer} from 'redux';
import {ThunkDispatch as TDispatch, ThunkAction as TAction} from 'redux-thunk';

/*** types ***/
const STORE = '@paint/STORE';
const LOAD = '@paint/LOAD';

/*** actions ***/
interface CRUDAction extends AnyAction {
  type: typeof STORE | typeof LOAD;
  payload: CRUDPayload;
}

type PaintActionTypes = CRUDAction;

export type ThunkDispatch = TDispatch<PaintState, null, PaintActionTypes>;

export type ThunkAction = TAction<void, PaintState, null, PaintActionTypes>;

export const storeData = (payload: CRUDPayload): ThunkAction => (dispatch) =>
  dispatch({type: STORE, payload});

export const loadData = (id: number): ThunkAction => (dispatch) => {
  console.log(id);
  return dispatch({type: LOAD, payload: {} as CRUDPayload});
};

const initialState: PaintState = {
  paintings: [],
  activePainting: undefined,
};

const paintReducer: Reducer<PaintState, AnyAction> = (
  state = initialState,
  action: AnyAction
): PaintState => {
  switch (action.type) {
    case STORE:
      return {
        ...state,
        paintings: [...state.paintings, (<CRUDAction>action).payload.painting],
      };
    case LOAD:
      return {
        ...state,
        paintings: [...state.paintings, (<CRUDAction>action).payload.painting],
        activePainting: (<CRUDAction>action).payload,
      };
    default:
      return state;
  }
};

export default paintReducer;

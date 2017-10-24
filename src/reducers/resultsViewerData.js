import actionTypes from '../constants'

const initialState = {
  isLoadingTree: null,
  isUpdatingTree: null,
  isUpdatingTreeFailed: null,
  isLoadingTreeFailed: null,
}

export default function(state = initialState, action) {
  switch (action.type) {
    case actionTypes.FETCH_RESULTS_VIEWER_DATA:
      return {
        ...state,
        isLoadingTree: true,
        isLoadingTreeFailed: false,
        isUpdatingTreeFailed: false,
        hasUpdates: false,
      }
    case actionTypes.FETCH_RESULTS_VIEWER_DATA_SUCCEEDED:
      return {
        ...state,
        isLoadingTree: false,
        isLoadingTreeFailed: false,
        hasUpdates: action.hasUpdates ? true : false,
      }
    case actionTypes.FETCH_RESULTS_VIEWER_DATA_FAILED:
      return { ...state, isLoadingTreeFailed: true, isLoadingTree: false, hasUpdates: false }
    case actionTypes.UPDATE_RESULTS_VIEWER_DATA:
      return { ...state, isUpdatingTreeFailed: false, isUpdatingTree: true, hasUpdates: false }
    case actionTypes.UPDATE_RESULTS_VIEWER_DATA_SUCCEEDED:
    case actionTypes.CANCEL_UPDATE_RESULTS_VIEWER_DATA:
      return {
        ...state,
        isUpdatingTree: false,
        isUpdatingTreeFailed: false,
        isLoadingTreeFailed: false,
        hasUpdates: action.hasUpdates,
      }
    case actionTypes.UPDATE_RESULTS_VIEWER_DATA_FAILED:
      return { ...state, isUpdatingTree: false, isUpdatingTreeFailed: true }
    case actionTypes.CLEAR_RESULTS_VIEWER_DATA:
      return { ...state, isLoadingTreeFailed: false, isLoadingTree: false }
    default:
      return { ...state }
  }
}

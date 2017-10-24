import actionTypes from '../constants'
import filterTypes from '../constants/filterTypes'
import channelConfig from '../configs/channelConfig'
import { loadFromStorage, saveInStorage } from '../utils'

const initialState = {
  code: null,
  desc: null,
  date: filterTypes.DATES.TODAY,
  marketStatusIds: ['1', '2', '3', '8', '10'],
  market: filterTypes.MARKETS.ALL_MARKETS,
  customDates: [],
  rowHeight: loadFromStorage('GRID_ROW_HEIGHT') || 'Default',
}

export default function(state = initialState, action) {
  switch (action.type) {
    case actionTypes.SET_RESULTS_VIEWER_FILTER_CODE:
      return { ...state, code: action.code }
    case actionTypes.SET_RESULTS_VIEWER_FILTER_DESC:
      return { ...state, desc: action.desc }
    case actionTypes.SET_RESULTS_VIEWER_FILTER_DATE:
      return { ...state, date: action.date }
    case actionTypes.ADD_CUSTOM_DATE_FILTER:
      return { ...state, customDates: [...state.customDates, action.customDate] }
    case actionTypes.ADD_RESULTS_VIEWER_MARKET_STATUS_ID_FILTER:
      return { ...state, marketStatusIds: [...state.marketStatusIds, action.id] }
    case actionTypes.REMOVE_RESULTS_VIEWER_MARKET_STATUS_ID_FILTER:
      let index = state.marketStatusIds.indexOf(action.id)
      if (index >= 0) {
        return {
          ...state,
          marketStatusIds: [...state.marketStatusIds.slice(0, index), ...state.marketStatusIds.slice(index + 1)],
        }
      } else {
        return { ...state }
      }
    case actionTypes.SET_RESULTS_VIEWER_ROW_HEIGHT:
      saveInStorage('GRID_ROW_HEIGHT', action.rowHeight)
      return { ...state, rowHeight: action.rowHeight }
    default:
      return { ...state }
  }
}

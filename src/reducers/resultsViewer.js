import actionTypes from '../constants'
import filterTypes from '../constants/filterTypes'
import channelConfig from '../configs/channelConfig'
import { loadFromStorage, saveInStorage } from '../utils'

const initialState = {
  code: null,
  desc: null,
  date: filterTypes.DATES.TODAY,
  eventSearchString: '',
  customDates: [],
  startTimeSort: filterTypes.SORTS.ASC.value,
  activeColumn: null,
  activeColumnSort: filterTypes.SORTS.DEFAULT.value,
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
    case actionTypes.SET_RESULTS_VIEWER_START_TIME_SORT:
      return { ...state, startTimeSort: action.sort }
    case actionTypes.SET_RESULTS_VIEWER_COLUMN_SORT:
      return { ...state, activeColumn: action.column, activeColumnSort: action.sort }
    case actionTypes.ADD_RESULTS_VIEWER_CUSTOM_DATE_FILTER:
      return { ...state, customDates: [...state.customDates, action.customDate] }
    case actionTypes.SET_EVENT_SEARCH_VALUE:
      return { ...state, eventSearchString: action.eventSearchString }
    case actionTypes.RESET_RESULTS_VIEWER_FILTERS:
      return { ...initialState, code: state.code, date: state.date, eventSearchString: '', rowHeight: state.rowHeight }
    case actionTypes.SET_RESULTS_VIEWER_ROW_HEIGHT:
      saveInStorage('GRID_ROW_HEIGHT', action.rowHeight)
      return { ...state, rowHeight: action.rowHeight }
    default:
      return { ...state }
  }
}

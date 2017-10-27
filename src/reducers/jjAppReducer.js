import actionTypes from '../jjcomponents/jjapp/constants'
import dataExpi from '../data/expi'

const initialState = {
  expi: [],
  isFetchingExpi: false,
  getExpiFailed: false,
}

const jjAppReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_EXPI:
      return { ...state, isFetchingExpi: true, getExpiFailed: false, expi: dataExpi }
    default:
      return { ...state }
  }
}

export default jjAppReducer

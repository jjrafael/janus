import { put, call, select } from 'redux-saga/effects'
import { takeLatest } from 'redux-saga'
import { push, replace } from 'react-router-redux'
import httpMethods from 'phxConstants/httpMethods'
import { parseErrorMessageInXhr } from 'phxServices/apiUtils'
import appActionTypes from './constants'
import actionTypes from '../../constants'
import * as API from './services'
import { toastr } from 'phxComponents/toastr/index'
import { formatCombinationTypes, mergeUpdateIndicators } from './helpers'

function _sortByLabel(a, b) {
  if (a.label < b.label) return -1
  if (a.label > b.label) return 1
  return 0
}

function* fetchFilterAccumulatorRiskData(action) {
  const { params } = action
  const { response, xhr } = yield call(API.fetchAccumulatorFilter, params)
  if (response) {
    yield put({
      type: appActionTypes.FETCH_CONSOLIDATED_ACCUMULATOR_RISK_FILTER_SUCCEEDED,
      accumulatorRiskList: response.consolidatedAccumulatorRiskResponseList,
    })
    yield put({
      type: appActionTypes.SET_TOP_PANEL_DETAILS,
      topPanelDetails: response.combinationRiskTotalsResponse,
    })
    yield put({
      type: appActionTypes.SHOULD_ITEM_RESET,
      accumulatorRiskList: response.consolidatedAccumulatorRiskResponseList,
    })
  } else {
    yield put({ type: appActionTypes.FETCH_CONSOLIDATED_ACCUMULATOR_RISK_FILTER_FAILED, errorMessage: 'Error' })
    const msg = parseErrorMessageInXhr(httpMethods.HTTP_POST, xhr)
    toastr.add({ message: msg, type: 'ERROR' })
  }
}

function* fetchArbetDetailAccumulatorRiskData(action) {
  const { params } = action
  const { response, xhr } = yield call(API.fetchAccumulatorArbetDetails, params)
  if (response) {
    // yield put({
    //   type: appActionTypes.FETCH_CONSOLIDATED_ACCUMULATOR_RISK_ARBET_DETAILS_SUCCEEDED,
    //   arbetDetails: response.list,
    // })
    if (response.list.length === 0) {
      yield put({
        type: appActionTypes.FETCH_CONSOLIDATED_ACCUMULATOR_RISK_ARBET_DETAILS_SUCCEEDED,
        arbetDetails: response.list,
      })
    } else {
      yield put({
        type: appActionTypes.FETCH_PROFILE_FLAGS,
        profileId: [...response.list].shift().accountId,
        arbetDetails: response.list,
      })
    }
  } else {
    const msg = parseErrorMessageInXhr(httpMethods.HTTP_POST, xhr)
    yield put({ type: appActionTypes.FETCH_CONSOLIDATED_ACCUMULATOR_RISK_ARBET_DETAILS_FAILED, errorMessage: 'Error' })
  }
}

function* reloadArbetDetailAccumulatorRiskData(action) {
  const { params } = action
  const { response, xhr } = yield call(API.fetchAccumulatorArbetDetails, params)
  if (response) {
    yield put({
      type: appActionTypes.RELOAD_CONSOLIDATED_ACCUMULATOR_RISK_ARBET_DETAILS_SUCCEEDED,
      arbetDetails: response.list,
    })
  } else {
    const msg = parseErrorMessageInXhr(httpMethods.HTTP_POST, xhr)
    yield put({ type: appActionTypes.RELOAD_CONSOLIDATED_ACCUMULATOR_RISK_ARBET_DETAILS_FAILED, errorMessage: 'Error' })
  }
}

function* fetchDetailsAccumulatorRiskData(action) {
  const { paramId } = action
  const { response, xhr } = yield call(API.fetchAccumulatorDetails, paramId)
  if (response) {
    yield put({
      type: appActionTypes.FETCH_CONSOLIDATED_ACCUMULATOR_RISK_DETAILS_SUCCEEDED,
      riskDetails: response,
    })
  } else {
    const msg = parseErrorMessageInXhr(httpMethods.HTTP_POST, xhr)
    yield put({ type: appActionTypes.FETCH_CONSOLIDATED_ACCUMULATOR_RISK_FILTER_FAILED, errorMessage: 'Error' })
  }
}

function* putIndicators(action) {
  const { indicators, defaultIndicators } = action
  const { response, xhr } = yield call(API.putCombiIndicators, indicators)
  if (response) {
    yield put({
      type: appActionTypes.PUT_COMBINATION_LIABILITY_INDICATOR_SUCCEEDED,
      indicators: mergeUpdateIndicators(indicators, defaultIndicators),
    })
    yield put({
      type: appActionTypes.UPDATE_COMBINATION_LIABILITY_INDICATOR,
      indicators: mergeUpdateIndicators(indicators, defaultIndicators),
    })
    yield put({ type: appActionTypes.RESET_LIMIT_CHANGE })
    toastr.add({ message: 'Change saved!' })
  } else {
    const msg = parseErrorMessageInXhr(httpMethods.HTTP_PUT, xhr)
    yield put({ type: appActionTypes.PUT_COMBINATION_LIABILITY_INDICATOR_FAILED, errorMessage: 'Error' })
    toastr.add({ message: 'Failed to saved combination limit.', type: 'ERROR' })
  }
}

function* fetchProfileFlags(action) {
  const { profileId, arbetDetails } = action
  const { response, xhr } = yield call(API.fetchProfileFlags, profileId)
  if (response) {
    yield put({ type: appActionTypes.FETCH_PROFILE_FLAGS_SUCCEEDED, flags: response })
    yield put({
      type: appActionTypes.FETCH_CONSOLIDATED_ACCUMULATOR_RISK_ARBET_DETAILS_SUCCEEDED,
      arbetDetails,
    })
  } else {
    yield put({
      type: appActionTypes.FETCH_CONSOLIDATED_ACCUMULATOR_RISK_ARBET_DETAILS_SUCCEEDED,
      arbetDetails,
    })
    yield put({ type: appActionTypes.FETCH_PROFILE_FLAGS_FAILED, errorMessage: 'Error' })
  }
}

function* setBlockingRule(action) {
  const { id, params, filterParams } = action
  const { response, xhr } = yield call(API.setBlockingRule, id, params)
  if (response) {
    yield put({ type: appActionTypes.SET_BLOCKING_RULE_SUCCEEDED })
    yield put({ type: appActionTypes.FETCH_CONSOLIDATED_ACCUMULATOR_RISK_FILTER, params: filterParams })
    yield put({ type: appActionTypes.TOGGLE_BLOCKING_RULE_MODAL, value: false })
    toastr.add({ message: 'New blocking rule applied!' })
  } else {
    const msg = parseErrorMessageInXhr(httpMethods.HTTP_PUT, xhr)
    yield put({ type: appActionTypes.SET_BLOCKING_RULE_FAILED, errorMessage: 'Error' })
    toastr.add({ message: 'Failed to set new blocking rule', type: 'ERROR' })
  }
}

function* fetchEventPathsFilter(action) {
  const { response, xhr } = yield call(API.fetchEventPathsFilter, action.itemId, action.itemType)
  if (response) {
    yield put({
      ...action,
      type: appActionTypes.FETCH_EVENT_PATHS_FILTER_SUCCEEDED,
      response: response,
    })
  } else {
    const msg = parseErrorMessageInXhr(httpMethods.HTTP_POST, xhr)
    yield put({ type: appActionTypes.FETCH_EVENT_PATHS_FILTER_FAILED, errorMessage: 'Error' })
  }
}

function* fetchEventPathsChildFilter(action) {
  const { response, xhr } = yield call(API.fetchEventPathsFilter, action.itemId, action.itemType)
  if (response) {
    yield put({
      ...action,
      type: appActionTypes.FETCH_EVENT_PATHS_CHILD_FILTER_SUCCEEDED,
      response: response,
    })
  } else {
    const msg = parseErrorMessageInXhr(httpMethods.HTTP_POST, xhr)
    yield put({ type: appActionTypes.FETCH_EVENT_PATHS_CHILD_FILTER_FAILED, errorMessage: 'Error' })
  }
}

function* fetchEventPathEventsFilter(action) {
  const { response, xhr } = yield call(API.fetchEventPathsFilter, action.itemId, action.itemType)
  if (response) {
    yield put({
      ...action,
      type: appActionTypes.FETCH_EVENT_PATH_EVENTS_FILTER_SUCCEEDED,
      response: response,
    })
  } else {
    const msg = parseErrorMessageInXhr(httpMethods.HTTP_POST, xhr)
    yield put({ type: appActionTypes.FETCH_EVENT_PATH_EVENTS_FILTER_FAILED, errorMessage: 'Error' })
  }
}

function* fetchEventPathMarketsFilter(action) {
  const { response, xhr } = yield call(API.fetchEventPathsFilter, action.itemId, action.itemType)
  if (response) {
    yield put({
      ...action,
      type: appActionTypes.FETCH_EVENT_PATH_MARKETS_FILTER_SUCCEEDED,
      response: response,
    })
  } else {
    const msg = parseErrorMessageInXhr(httpMethods.HTTP_POST, xhr)
    yield put({ type: appActionTypes.FETCH_EVENT_PATH_MARKETS_FILTER_FAILED, errorMessage: 'Error' })
  }
}

function* fetchEventPathOutcomesFilter(action) {
  const { response, xhr } = yield call(API.fetchEventPathsFilter, action.itemId, action.itemType)
  if (response) {
    yield put({
      ...action,
      type: appActionTypes.FETCH_EVENT_PATH_OUTCOMES_FILTER_SUCCEEDED,
      response: response,
    })
  } else {
    const msg = parseErrorMessageInXhr(httpMethods.HTTP_POST, xhr)
    yield put({ type: appActionTypes.FETCH_EVENT_PATH_OUTCOMES_FILTER_FAILED, errorMessage: 'Error' })
  }
}

export default function* combinationRiskManagerSaga() {
  yield takeLatest(appActionTypes.FETCH_CONSOLIDATED_ACCUMULATOR_RISK_FILTER, fetchFilterAccumulatorRiskData)
  yield takeLatest(appActionTypes.FETCH_CONSOLIDATED_ACCUMULATOR_RISK_DETAILS, fetchDetailsAccumulatorRiskData)
  yield takeLatest(
    appActionTypes.FETCH_CONSOLIDATED_ACCUMULATOR_RISK_ARBET_DETAILS,
    fetchArbetDetailAccumulatorRiskData
  )
  yield takeLatest(
    appActionTypes.RELOAD_CONSOLIDATED_ACCUMULATOR_RISK_ARBET_DETAILS,
    reloadArbetDetailAccumulatorRiskData
  )
  yield takeLatest(appActionTypes.PUT_COMBINATION_LIABILITY_INDICATOR, putIndicators)
  yield takeLatest(appActionTypes.FETCH_PROFILE_FLAGS, fetchProfileFlags)
  yield takeLatest(appActionTypes.SET_BLOCKING_RULE, setBlockingRule)
  yield takeLatest(appActionTypes.FETCH_EVENT_PATHS_FILTER, fetchEventPathsFilter)
  yield takeLatest(appActionTypes.FETCH_EVENT_PATHS_CHILD_FILTER, fetchEventPathsChildFilter)
  yield takeLatest(appActionTypes.FETCH_EVENT_PATH_EVENTS_FILTER, fetchEventPathEventsFilter)
  yield takeLatest(appActionTypes.FETCH_EVENT_PATH_MARKETS_FILTER, fetchEventPathMarketsFilter)
  yield takeLatest(appActionTypes.FETCH_EVENT_PATH_OUTCOMES_FILTER, fetchEventPathOutcomesFilter)
}

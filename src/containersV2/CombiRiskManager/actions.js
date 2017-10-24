import constants from './constants'

export function fetchFilters(params) {
  return {
    type: constants.FETCH_CONSOLIDATED_ACCUMULATOR_RISK_FILTER,
    params,
  }
}

export function fetchArbetDetails(params) {
  return {
    type: constants.FETCH_CONSOLIDATED_ACCUMULATOR_RISK_ARBET_DETAILS,
    params,
  }
}

export function reloadArbetDetails(params) {
  return {
    type: constants.RELOAD_CONSOLIDATED_ACCUMULATOR_RISK_ARBET_DETAILS,
    params,
  }
}

export function fetchDetails(paramId) {
  return {
    type: constants.FETCH_CONSOLIDATED_ACCUMULATOR_RISK_DETAILS,
    paramId,
  }
}

export function updateCombinationLiabilityIndicators(indicators) {
  return {
    type: constants.UPDATE_COMBINATION_LIABILITY_INDICATOR,
    indicators,
  }
}

export function removeCombinationLiabilityIndicators(indicators) {
  return {
    type: constants.REMOVE_COMBINATION_LIABILITY_INDICATOR,
  }
}

export function disabledAutoRefresh() {
  return {
    type: constants.DISABLE_AUTOREFRESH,
  }
}

export function setAutoRefresh(value) {
  return {
    type: constants.SET_AUTOREFRESH,
    value,
  }
}

export function setBetType(betType) {
  return {
    type: constants.SET_BET_TYPE,
    betType,
  }
}

export function setBlockingTypeMap(blockingTypeMap) {
  return {
    type: constants.SET_BLOCKING_TYPE_MAP,
    blockingTypeMap,
  }
}

export function toggleBlockingRuleModal(value) {
  return {
    type: constants.TOGGLE_BLOCKING_RULE_MODAL,
    value: value,
  }
}

export function setMainPanelSelectedItem(itemId, riskDetail) {
  return {
    type: constants.SET_MAIN_PANEL_SELECTED_ITEM,
    itemId,
    riskDetail,
  }
}

export function putCombinationLiabilityIndicators(indicators, defaultIndicators) {
  return {
    type: constants.PUT_COMBINATION_LIABILITY_INDICATOR,
    indicators,
    defaultIndicators,
  }
}

export function initializeDefault() {
  return {
    type: constants.INITIALIZE_DEFAULT,
  }
}

export function toggleFilterModal() {
  return {
    type: constants.TOGGLE_FILTER_MODAL,
  }
}

export function setFlagItemModified() {
  return {
    type: constants.SET_FLAG_ITEM_MODIFIED,
  }
}

export function removeFlagItemModified() {
  return {
    type: constants.REMOVE_FLAG_ITEM_MODIFIED,
  }
}

export function setLimitChange(indicatorType, actionType, value) {
  return {
    type: constants.SET_LIMIT_CHANGE,
    indicatorType,
    actionType,
    value,
  }
}

export function resetLimitChange() {
  return {
    type: constants.RESET_LIMIT_CHANGE,
  }
}

export function fetchProfileFlags(profileId) {
  return {
    type: constants.FETCH_PROFILE_FLAGS,
    profileId,
  }
}

export function setBlockingRule(id, params, filterParams) {
  return {
    type: constants.SET_BLOCKING_RULE,
    id,
    params,
    filterParams,
  }
}

export function setSportFilterType(filterType) {
  return {
    type: constants.SET_SPORT_FILTER_TYPE,
    filterType,
  }
}

export function fetchEventPathsFilter(itemId, itemType) {
  return {
    type: constants.FETCH_EVENT_PATHS_FILTER,
    itemId,
    itemType,
  }
}

export function fetchEventPathsChildFilter(itemId, itemType, sportId, isOpen) {
  return {
    type: constants.FETCH_EVENT_PATHS_CHILD_FILTER,
    itemId,
    itemType,
    sportId,
    isOpen,
  }
}

export function fetchEventPathEventsFilter(itemId, itemType, sportId, parentId, isOpen) {
  return {
    type: constants.FETCH_EVENT_PATH_EVENTS_FILTER,
    itemId,
    itemType,
    sportId,
    parentId,
    isOpen,
  }
}

export function fetchEventPathMarketsFilter(itemId, itemType, sportId, eventPathId, eventId, isOpen) {
  return {
    type: constants.FETCH_EVENT_PATH_MARKETS_FILTER,
    itemId,
    itemType,
    sportId,
    eventPathId,
    eventId,
    isOpen,
  }
}

export function fetchEventPathOutcomesFilter(itemId, itemType) {
  return {
    type: constants.FETCH_EVENT_PATH_OUTCOMES_FILTER,
    itemId,
    itemType,
  }
}

export function toggleEventPathFilter(isChecked, item, itemType) {
  return {
    type: constants.TOGGLE_EVENT_PATH_FILTER,
    isChecked,
    item,
    itemType,
  }
}

export function setEventPathSelectedFilter() {
  return {
    type: constants.SET_EVENT_PATH_SELECTED_FILTER,
  }
}

export function updateFilters(filters) {
  return {
    type: constants.UPDATE_FILTERS,
    filters,
  }
}

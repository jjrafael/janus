import constants, { betTypes } from './constants'
import moment from 'moment'
import _ from 'lodash'
import {
  accumRiskConvertStringToInt,
  formatCombinationTypes,
  stringToNumeral,
  placeLimitChange,
  attachUpdatedLimitIndicators,
} from './helpers'

const initialState = {
  accumulatorRiskList: [],
  topPanelDetails: {
    combinationRiskTotals: {
      totalStakes: 0,
      totalPayout: 0,
      totalLiability: 0,
      totalBetCount: 0,
      totalCombinations: 0,
    },
    totalStakes: 0,
    singleStake: 0,
    singleBetCount: 0,
    singleBetCountPercentage: 0,
    singleStakePercentage: 0,
    doubleStake: 0,
    doubleBetCount: 0,
    doubleBetCountPercentage: 0,
    doubleStakePercentage: 0,
    trebleStake: 0,
    trebleBetCount: 0,
    trebleBetCountPercentage: 0,
    trebleStakePercentage: 0,
    fourPlusStake: 0,
    fourPlusBetCount: 0,
    fourPlusBetCountPercentage: 0,
    fourPlusStakePercentage: 0,
  },
  currentBlockingTypeMap: {},
  riskDetails: [],
  selectedRiskDetail: {},
  arbetDetails: [],
  combiLiabilityIndicators: [],
  defaultCombiLiabilityIndicators: [],
  currentBetType: 'None',
  mainPanelSelectedItemId: null,
  isFetchingConsolidatedAccumulatorRiskFilter: false,
  isFetchingConsolidatedAccumulatorRiskFilterFailed: false,
  isFetchingConsolidatedAccumulatorRiskDetails: false,
  isFetchingConsolidatedAccumulatorRiskDetailsFailed: false,
  isFetchingConsolidatedAccumulatorArbetDetails: false,
  isFetchingConsolidatedAccumulatorArbetDetailsFailed: false,
  isSettingBlockingRule: false,
  isSettingBlockingRuleFailed: false,
  isLimitUpdating: false,
  isLimitUpdatingFailed: false,

  errorMessage: null,

  filters: {
    marketStartTimeAfter: moment().format(),
    marketStartTimeBefore: moment()
      .endOf('day')
      .add(1, 'days')
      .format(),
    stakeRangeMin: null,
    stakeRangeMax: null,
    payoutRangeMin: null,
    payoutRangeMax: null,
    combinationSize: 2,
    greaterCombinationSize: true,
    sportCodes: [],
    eventPaths: [],
    gameEvents: [],
    rankEvents: [],
    markets: [],
    outcomes: [],
    channelIds: [1, 2, 50, 3, 51, 4, 52, 5, 53, 6, 54],
    blockAny: true,
    blockSpecific: true,
    blockNone: true,
    betStatus: ['PENDING', 'WON', 'LOST', 'LAST_LEG', 'VOID', 'DYNAMIC', 'UNKNOWN'],
    settledStatus: 'NOT_SETTLED',
  },

  sportFilterType: 'all',
  // Header
  enabledAutoRefresh: true,
  refreshInterval: 2,

  //Modals
  showBlockingRuleModal: false,
  showFilterModal: false,

  hasChangeUnsaved: false,
  unsavedLimitChange: [],
  userFlags: [],

  isFetchingEventPathFilters: false,
  isFetchingEventPathFiltersFailed: false,
  originalEventPathsFilter: {},
  eventPathsFilter: {},
  sportId: null,

  selectedEventPathFilters: [],
  toBeSelectedEventPathFilters: [],
  selectedEventPathFiltersMap: {},
}

const combinationRiskManager = (state = initialState, action) => {
  switch (action.type) {
    case constants.FETCH_CONSOLIDATED_ACCUMULATOR_RISK_FILTER:
      return {
        ...state,
        isFetchingConsolidatedAccumulatorRiskFilter: true,
        isFetchingConsolidatedAccumulatorRiskFilterFailed: false,
      }
    case constants.FETCH_CONSOLIDATED_ACCUMULATOR_RISK_FILTER_SUCCEEDED:
      return {
        ...state,
        accumulatorRiskList: [
          ...stringToNumeral(action.accumulatorRiskList, [
            'averagePrice',
            'liability',
            'potentialPayout',
            'totalStakes',
          ]),
        ],
        // accumulatorRiskList: action.accumulatorRiskList,
        isFetchingConsolidatedAccumulatorRiskFilter: false,
        isFetchingConsolidatedAccumulatorRiskFilterFailed: false,
      }
    case constants.FETCH_CONSOLIDATED_ACCUMULATOR_RISK_FILTER_FAILED:
      return {
        ...state,
        isFetchingConsolidatedAccumulatorRiskFilter: false,
        isFetchingConsolidatedAccumulatorRiskFilterFailed: true,
      }
    case constants.FETCH_CONSOLIDATED_ACCUMULATOR_RISK_DETAILS:
      return {
        ...state,
        isFetchingConsolidatedAccumulatorRiskDetails: true,
        isFetchingConsolidatedAccumulatorRiskDetailsFailed: false,
      }
    case constants.FETCH_CONSOLIDATED_ACCUMULATOR_RISK_DETAILS_SUCCEEDED:
      return {
        ...state,
        riskDetails: action.riskDetails,
        isFetchingConsolidatedAccumulatorRiskDetails: false,
        isFetchingConsolidatedAccumulatorRiskDetailsFailed: false,
      }
    case constants.FETCH_CONSOLIDATED_ACCUMULATOR_RISK_DETAILS_FAILED:
      return {
        ...state,
        isFetchingConsolidatedAccumulatorRiskDetails: false,
        isFetchingConsolidatedAccumulatorRiskDetailsFailed: true,
      }
    case constants.FETCH_CONSOLIDATED_ACCUMULATOR_RISK_ARBET_DETAILS:
      return {
        ...state,
        isFetchingConsolidatedAccumulatorArbetDetails: true,
        isFetchingConsolidatedAccumulatorArbetDetailsFailed: false,
      }
    case constants.FETCH_CONSOLIDATED_ACCUMULATOR_RISK_ARBET_DETAILS_SUCCEEDED:
      return {
        ...state,
        arbetDetails: action.arbetDetails,
        isFetchingConsolidatedAccumulatorArbetDetails: false,
        isFetchingConsolidatedAccumulatorArbetDetailsFailed: false,
      }
    case constants.FETCH_CONSOLIDATED_ACCUMULATOR_RISK_ARBET_DETAILS_FAILED:
      return {
        ...state,
        isFetchingConsolidatedAccumulatorArbetDetails: false,
        isFetchingConsolidatedAccumulatorArbetDetailsFailed: true,
      }
    case constants.RELOAD_CONSOLIDATED_ACCUMULATOR_RISK_ARBET_DETAILS:
      return {
        ...state,
        isFetchingConsolidatedAccumulatorArbetDetails: false,
        isFetchingConsolidatedAccumulatorArbetDetailsFailed: false,
      }
    case constants.RELOAD_CONSOLIDATED_ACCUMULATOR_RISK_ARBET_DETAILS_SUCCEEDED:
      return {
        ...state,
        arbetDetails: action.arbetDetails,
        isFetchingConsolidatedAccumulatorArbetDetails: false,
        isFetchingConsolidatedAccumulatorArbetDetailsFailed: false,
      }
    case constants.RELOAD_CONSOLIDATED_ACCUMULATOR_RISK_ARBET_DETAILS_FAILED:
      return {
        ...state,
        isFetchingConsolidatedAccumulatorArbetDetails: false,
        isFetchingConsolidatedAccumulatorArbetDetailsFailed: true,
      }
    case constants.UPDATE_COMBINATION_LIABILITY_INDICATOR:
      return {
        ...state,
        isLimitUpdating: false,
        isLimitUpdatingFailed: false,
        defaultCombiLiabilityIndicators: action.indicators,
        combiLiabilityIndicators: [
          ...formatCombinationTypes(action.indicators, {
            payout: state.selectedRiskDetail.potentialPayout,
            stake: state.selectedRiskDetail.totalStakes,
            liability: state.selectedRiskDetail.liability,
          }),
        ],
      }
    case constants.INITIALIZE_DEFAULT:
      return {
        ...state,
        selectedRiskDetail: {},
        arbetDetails: [],
        combiLiabilityIndicators: [],
        defaultCombiLiabilityIndicators: [],
        currentBetType: 'None',
        mainPanelSelectedItemId: null,
      }
    case constants.SET_MAIN_PANEL_SELECTED_ITEM:
      return {
        ...state,
        mainPanelSelectedItemId: action.itemId,
        selectedRiskDetail: action.riskDetail,
      }
    case constants.REMOVE_COMBINATION_LIABILITY_INDICATOR:
      return {
        ...state,
        combiLiabilityIndicators: [],
      }
    case constants.SORT_ACCUMULATOR_DATA:
      // TODO: implement custom data sorting
      return { ...state }
    case constants.SET_TOP_PANEL_DETAILS:
      return {
        ...state,
        topPanelDetails: {
          ...state.topPanelDetails,
          ...action.topPanelDetails,
        },
      }
    case constants.DISABLE_AUTOREFRESH:
      return {
        ...state,
        enabledAutoRefresh: false,
        refreshInterval: 0,
      }
    case constants.SET_AUTOREFRESH:
      return {
        ...state,
        enabledAutoRefresh: true,
        refreshInterval: action.value,
      }
    case constants.SET_BET_TYPE:
      return {
        ...state,
        currentBetType: betTypes[action.betType],
      }
    case constants.SET_BLOCKING_TYPE_MAP:
      return {
        ...state,
        currentBlockingTypeMap: action.blockingTypeMap,
      }
    case constants.TOGGLE_BLOCKING_RULE_MODAL:
      return {
        ...state,
        showBlockingRuleModal: action.value,
      }
    case constants.TOGGLE_FILTER_MODAL:
      return {
        ...state,
        showFilterModal: !state.showFilterModal,
      }
    case constants.SET_FLAG_ITEM_MODIFIED:
      return {
        ...state,
        hasChangeUnsaved: true,
      }
    case constants.REMOVE_FLAG_ITEM_MODIFIED:
      return {
        ...state,
        hasChangeUnsaved: false,
      }
    case constants.SET_LIMIT_CHANGE:
      let unsaved = [
        ...placeLimitChange(
          state.defaultCombiLiabilityIndicators,
          state.unsavedLimitChange,
          action.indicatorType,
          action.actionType,
          action.value
        ),
      ]
      return {
        ...state,
        unsavedLimitChange: unsaved,
        hasChangeUnsaved: unsaved.length > 0,
      }
    case constants.RESET_LIMIT_CHANGE:
      return {
        ...state,
        unsavedLimitChange: [],
        hasChangeUnsaved: false,
      }
    case constants.FETCH_PROFILE_FLAGS_SUCCEEDED:
      return {
        ...state,
        userFlags: action.flags,
      }
    case constants.RESET_PROFILE_FLAGS:
      return {
        ...state,
        userFlags: [],
      }

    case constants.SET_SPORT_FILTER_TYPE:
      return {
        ...state,
        sportFilterType: action.filterType,
      }

    case constants.FETCH_EVENT_PATHS_FILTER:
      return {
        ...state,
        isFetchingEventPathFilters: true,
        isFetchingEventPathFiltersFailed: false,
        sportId: action.itemType === 'eventpath' ? action.itemId : null,
      }
    case constants.FETCH_EVENT_PATHS_FILTER_SUCCEEDED:
      let originalEventPathsFilter = { ...state.originalEventPathsFilter }
      let eventPathsFilter = { ...state.eventPathsFilter }
      const itemType = action.itemType
      const itemId = action.itemId
      if (itemType === 'eventpath' && _.has(originalEventPathsFilter, itemId)) {
        // originalEventPathsFilter[itemId] = action.response;
        // if(!action.itemParent) {
        _.each(action.response, ep => {
          ep.isLoading = false
          ep.isOpen = false
          originalEventPathsFilter[itemId].children[ep.id] = ep
        })
        // }
      } else {
        // if(!action.itemParent) {
        originalEventPathsFilter[itemId] = {
          children: {},
        }

        _.each(action.response, ep => {
          originalEventPathsFilter[itemId].children[ep.id] = {}
          ep.isLoading = false
          ep.isOpen = false
          ep.children = {}
          originalEventPathsFilter[itemId].children[ep.id] = ep
        })
        // }
      }

      return {
        ...state,
        isFetchingEventPathFilters: false,
        isFetchingEventPathFiltersFailed: false,
        originalEventPathsFilter: originalEventPathsFilter,
        eventPathsFilter: action.response.map(ep => {
          return ep.id
        }),
      }
    case constants.FETCH_EVENT_PATHS_FILTER_FAILED:
      return {
        ...state,
        isFetchingEventPathFilters: false,
        isFetchingEventPathFiltersFailed: true,
      }

    case constants.FETCH_EVENT_PATHS_CHILD_FILTER:
      let origEventPathsFilter = { ...state.originalEventPathsFilter }
      origEventPathsFilter[action.sportId].children[action.itemId].isOpen = action.isOpen
      origEventPathsFilter[action.sportId].children[action.itemId].isLoading = true
      return {
        ...state,
        originalEventPathsFilter: origEventPathsFilter,
      }

    case constants.FETCH_EVENT_PATHS_CHILD_FILTER_SUCCEEDED:
      let originalEPF = { ...state.originalEventPathsFilter }
      let epChild = originalEPF[action.sportId].children[action.itemId]
      epChild.isLoading = false
      _.each(action.response, ep => {
        ep.isOpen = false
        ep.isLoading = false
        ep.children = {}

        // ep.children[ep.id] = ep;

        originalEPF[action.sportId].children[action.itemId].children[ep.id] = ep
      })

      return {
        ...state,
        originalEventPathsFilter: originalEPF,
      }

    case constants.FETCH_EVENT_PATHS_CHILD_FILTER_FAILED:
      return {
        ...state,
      }

    case constants.FETCH_EVENT_PATH_EVENTS_FILTER:
      let FetchEPFEvents = { ...state.originalEventPathsFilter }
      FetchEPFEvents[action.sportId].children[action.parentId].children[action.itemId].isOpen = action.isOpen
      FetchEPFEvents[action.sportId].children[action.parentId].children[action.itemId].isLoading = true
      return {
        ...state,
        originalEventPathsFilter: FetchEPFEvents,
      }

    case constants.FETCH_EVENT_PATH_EVENTS_FILTER_SUCCEEDED:
      let EPFEvents = { ...state.originalEventPathsFilter }
      let EPFEventChild = EPFEvents[action.sportId].children[action.parentId].children[action.itemId]
      EPFEventChild.isLoading = false
      _.each(action.response, ep => {
        ep.isOpen = false
        ep.isLoading = false
        ep.children = {}
        // ep.children[ep.id] = ep;
        EPFEvents[action.sportId].children[action.parentId].children[action.itemId].children[ep.id] = ep
      })

      return {
        ...state,
        originalEventPathsFilter: EPFEvents,
      }

    case constants.FETCH_EVENT_PATH_EVENTS_FILTER_FAILED:
      return {
        ...state,
      }

    case constants.FETCH_EVENT_PATH_MARKETS_FILTER:
      let FetchEPFMarkets = { ...state.originalEventPathsFilter }
      FetchEPFMarkets[action.sportId].children[action.eventPathId].children[action.eventId].children[
        action.itemId
      ].isOpen =
        action.isOpen
      FetchEPFMarkets[action.sportId].children[action.eventPathId].children[action.eventId].children[
        action.itemId
      ].isLoading = true
      return {
        ...state,
        originalEventPathsFilter: FetchEPFMarkets,
      }

    case constants.FETCH_EVENT_PATH_MARKETS_FILTER_SUCCEEDED:
      let EPFMarkets = { ...state.originalEventPathsFilter }
      let EPFMarketChild =
        EPFMarkets[action.sportId].children[action.eventPathId].children[action.eventId].children[action.itemId]
      EPFMarketChild.isLoading = false
      _.each(action.response, ep => {
        ep.isOpen = false
        ep.isLoading = false
        ep.children = {}
        // ep.children[ep.id] = ep;
        EPFMarkets[action.sportId].children[action.eventPathId].children[action.eventId].children[
          action.itemId
        ].children[ep.id] = ep
      })

      return {
        ...state,
        originalEventPathsFilter: EPFMarkets,
      }

    case constants.FETCH_EVENT_PATH_MARKETS_FILTER_FAILED:
      return {
        ...state,
      }

    case constants.TOGGLE_EVENT_PATH_FILTER:
      const iId = action.item.id
      let type = action.itemType
      let id =
        type === 'eventpath' /* && !_.has(selectedEventPathFiltersMap.eventPath, id)*/
          ? `ep${iId}`
          : type === 'gameevent'
            ? `ge${iId}`
            : type === 'rankevent' ? `re${iId}` : type === 'market' ? `m${iId}` : `o${iId}`
      let toBeSelectedFilter = [...state.toBeSelectedEventPathFilters]
      let selectedEventPathFiltersMap = { ...state.selectedEventPathFiltersMap }
      selectedEventPathFiltersMap[id] = action.item

      if (toBeSelectedFilter.indexOf(id) === -1 && action.isChecked) {
        toBeSelectedFilter.push(id)
      } else {
        toBeSelectedFilter.splice(toBeSelectedFilter.indexOf(id), 1)
      }

      return {
        ...state,
        toBeSelectedEventPathFilters: toBeSelectedFilter,
        selectedEventPathFiltersMap: selectedEventPathFiltersMap,
      }

    case constants.SET_EVENT_PATH_SELECTED_FILTER:
      let toBeSelectedEventPathFilters = [...state.toBeSelectedEventPathFilters]
      let selectedEventPathFilters = [...state.selectedEventPathFilters]
      _.each(toBeSelectedEventPathFilters, id => {
        if (selectedEventPathFilters.indexOf(id) === -1) {
          selectedEventPathFilters.push(id)
          // toBeSelectedEventPathFilters.splice(toBeSelectedEventPathFilters.indexOf(id), 1);
        }
      })

      return {
        ...state,
        toBeSelectedEventPathFilters: toBeSelectedEventPathFilters,
        selectedEventPathFilters: selectedEventPathFilters,
      }

    case constants.PUT_COMBINATION_LIABILITY_INDICATOR:
      return {
        ...state,
        isLimitUpdating: true,
        isLimitUpdatingFailed: false,
      }
    case constants.PUT_COMBINATION_LIABILITY_INDICATOR_SUCCEEDED:
      return {
        ...state,
        accumulatorRiskList: [
          ...attachUpdatedLimitIndicators(state.accumulatorRiskList, state.mainPanelSelectedItemId, action.indicators),
        ],
      }
    case constants.PUT_COMBINATION_LIABILITY_INDICATOR_FAILED:
      return {
        ...state,
        isLimitUpdating: false,
        isLimitUpdatingFailed: true,
      }
    case constants.SET_BLOCKING_RULE:
      return {
        ...state,
        isSettingBlockingRule: true,
        isSettingBlockingRuleFailed: false,
      }
    case constants.SET_BLOCKING_RULE_SUCCEEDED:
      return {
        ...state,
        isSettingBlockingRule: false,
        isSettingBlockingRuleFailed: false,
        showBlockingRuleModal: false,
      }
    case constants.SET_BLOCKING_RULE_FAILED:
      return {
        ...state,
        isSettingBlockingRule: false,
        isSettingBlockingRuleFailed: true,
      }
    case constants.UPDATE_FILTERS:
      return {
        ...state,
        filters: {
          ...action.filters,
        },
      }
    case constants.SHOULD_ITEM_RESET:
      const { mainPanelSelectedItemId: selectedId } = state
      const currentSelectedItem = action.accumulatorRiskList.find(item => item.accumulatorRiskId === selectedId)
      if (!currentSelectedItem) {
        return {
          ...state,
          currentBlockingTypeMap: {},
          riskDetails: [],
          selectedRiskDetail: {},
          arbetDetails: [],
          combiLiabilityIndicators: [],
          defaultCombiLiabilityIndicators: [],
          currentBetType: 'None',
          mainPanelSelectedItemId: null,
        }
      } else {
        return {
          ...state,
        }
      }
    default:
      return { ...state }
  }
}

export default combinationRiskManager

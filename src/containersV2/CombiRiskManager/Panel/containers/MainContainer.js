import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { List } from 'immutable'

import { CombiMainPanel as MainPanel } from '../components'
import {
  fetchDetails,
  fetchArbetDetails,
  updateCombinationLiabilityIndicators,
  setBetType,
  setBlockingTypeMap,
  setMainPanelSelectedItem,
  resetLimitChange,
} from '../../actions'

const mapStateToProps = state => {
  return {
    accumList: List([...state.combinationRiskManager.accumulatorRiskList]),
    filters: state.combinationRiskManager.filters,
    currentBetType: state.combinationRiskManager.currentBetType,
    mainPanelSelectedItemId: state.combinationRiskManager.mainPanelSelectedItemId,
    hasChangeUnsaved: state.combinationRiskManager.hasChangeUnsaved,
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      fetchDetails,
      fetchArbetDetails,
      updateCombinationLiabilityIndicators,
      setBetType,
      setBlockingTypeMap,
      setMainPanelSelectedItem,
      resetLimitChange,
    },
    dispatch
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(MainPanel)

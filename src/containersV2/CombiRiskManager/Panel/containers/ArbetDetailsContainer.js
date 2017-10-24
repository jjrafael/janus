import React from 'react'
import { connect } from 'react-redux'
import { List } from 'immutable'
import { ArbetDetails } from '../components'

const mapStateToProps = state => {
  return {
    arbetList: state.combinationRiskManager.arbetDetails,
    currentBetType: state.combinationRiskManager.currentBetType,
    list: List([...state.combinationRiskManager.arbetDetails]),
    isFetching: state.combinationRiskManager.isFetchingConsolidatedAccumulatorArbetDetails,
    fetchFailed: state.combinationRiskManager.isFetchingConsolidatedAccumulatorArbetDetailsFailed,
    userFlags: state.combinationRiskManager.userFlags,
  }
}

export default connect(mapStateToProps)(ArbetDetails)

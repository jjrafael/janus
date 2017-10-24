import React from 'react'
import { List } from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { CombinationBet } from '../components'
import { toggleBlockingRuleModal } from '../../actions'

const mapStateToProps = state => {
  const accumulatorRiskId = state.co
  return {
    riskDetails: List([...state.combinationRiskManager.riskDetails]),
    betType: state.combinationRiskManager.currentBetType,
    channels: state.apiConstants.values.channels,
    currentBlockingTypeMap: state.combinationRiskManager.currentBlockingTypeMap,
    itemId: state.combinationRiskManager.mainPanelSelectedItemId,
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      toggleBlockingRuleModal,
    },
    dispatch
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(CombinationBet)

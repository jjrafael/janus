import React from 'react'
import { List } from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { CombinationLiabilityIndicators } from '../components'
import { setLimitChange } from '../../actions'

const mapStateToProps = state => {
  return {
    indicators: List([...state.combinationRiskManager.combiLiabilityIndicators]),
    defaultIndicators: state.combinationRiskManager.defaultCombiLiabilityIndicators,
    itemId: state.combinationRiskManager.mainPanelSelectedItemId,
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      setLimitChange,
    },
    dispatch
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(CombinationLiabilityIndicators)

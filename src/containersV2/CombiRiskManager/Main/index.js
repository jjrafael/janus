import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { List } from 'immutable'
import { connect } from 'react-redux'
import { hashHistory } from 'react-router'
import { bindActionCreators } from 'redux'
import appConstants from '../constants'
import ModalWindow from 'components/modal'
import TopPanel from '../TopPanel'
import { CombiMainPanel, CombinationBet, CombinationLiabilityIndicators, ArbetDetails } from '../Panel/components'
import BlockingRuleModal from './BlockingRuleModal'
import FilterModal from './FilterModal'
import ModalLoader from 'phxV2Components/ModalLoader/'

function mapStateToProps({ combinationRiskManager }) {
  const { showBlockingRuleModal, showFilterModal, isLimitUpdating } = combinationRiskManager
  return {
    showBlockingRuleModal,
    showFilterModal,
    isLimitUpdating,
  }
}

class Main extends Component {
  render() {
    const { children, showBlockingRuleModal, showFilterModal, isLimitUpdating } = this.props
    return (
      <div className="page-main no-footer no-side combi-risk-manager-main">
        <div className="form-inner">
          <TopPanel />
          <CombiMainPanel />
          <CombinationBet />
          <CombinationLiabilityIndicators />
          <ArbetDetails />
        </div>
        {showBlockingRuleModal && <BlockingRuleModal />}
        {showFilterModal && <FilterModal />}
        {isLimitUpdating && <ModalLoader />}
        {children}
      </div>
    )
  }
}

export default connect(mapStateToProps)(Main)

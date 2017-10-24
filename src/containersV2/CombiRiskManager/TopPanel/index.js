import React, { Component } from 'react'
import { connect } from 'react-redux'
import { hashHistory } from 'react-router'
import { bindActionCreators } from 'redux'
import appConstants from '../constants'
import ModalWindow from 'components/modal'
import { fetchFilters } from '../actions'

function mapStateToProps(state) {
  return {
    filters: state.combinationRiskManager.filters,
    details: state.combinationRiskManager.topPanelDetails,
    enabledAutoRefresh: state.combinationRiskManager.enabledAutoRefresh,
    refreshInterval: state.combinationRiskManager.refreshInterval,
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      fetchFilters,
    },
    dispatch
  )
}

class TopPanel extends Component {
  constructor(props) {
    super(props)

    this.state = {
      //internal states
    }
  }

  // componentDidMount() {
  //   const { enabledAutoRefresh, refreshInterval, fetchFilters, filters } = this.props;
  //   if (enabledAutoRefresh) {
  //     fetchFilters(filters); // Initial request if auto refresh is enabled
  //     this.timer = setInterval(e => {
  //       fetchFilters(filters);
  //     }, refreshInterval * 60000);
  //   } else {
  //     fetchFilters(filters);
  //   }
  // }

  // componentWillUnmount() {
  //   clearInterval(this.timer)
  // }

  render() {
    const { children, details } = this.props
    return (
      <div className="top-panel">
        <div className="top-panel-section">
          <div className="form-wrapper col-xs-6 col-sm-4 col-md-4 col-lg-4">
            <h4>Total Stakes</h4>
            <div className="singular-wrapper">
              <div>{parseFloat(details.combinationRiskTotals.totalStakes).toFixed(2) + ' PHP'}</div>
            </div>
          </div>

          <div className="form-wrapper col-xs-6 col-sm-4 col-md-4 col-lg-4">
            <h4>Total Number of Bets</h4>
            <div className="singular-wrapper">
              <div>{details.combinationRiskTotals.totalBetCount}</div>
            </div>
          </div>

          <div className="form-wrapper col-xs-6 col-sm-4 col-md-4 col-lg-4">
            <h4>Combination Count</h4>
            <div className="singular-wrapper">
              <div>{details.combinationRiskTotals.totalCombinations}</div>
            </div>
          </div>
        </div>

        <div className="top-panel-section">
          <div className="form-wrapper col-xs-6 col-sm-3 col-md-3 col-lg-3">
            <h4>Singles</h4>
            <div className="singular-wrapper">
              <div>{`${details.singleStake} (${parseFloat(details.singleStakePercentage).toFixed(2)}%)`}</div>
              <div>{`${details.singleBetCount} ${details.singleBetCount > 1 ? 'Bets' : 'Bet'} (${parseFloat(
                details.singleBetCountPercentage
              ).toFixed(2)}%)`}</div>
            </div>
          </div>

          <div className="form-wrapper col-xs-6 col-sm-3 col-md-3 col-lg-3">
            <h4>Doubles</h4>
            <div className="singular-wrapper">
              <div>{`${details.doubleStake} (${parseFloat(details.doubleStakePercentage).toFixed(2)}%)`}</div>
              <div>{`${details.doubleBetCount} ${details.doubleBetCount > 1 ? 'Bets' : 'Bet'} (${parseFloat(
                details.doubleBetCountPercentage
              ).toFixed(2)}%)`}</div>
            </div>
          </div>

          <div className="form-wrapper col-xs-6 col-sm-3 col-md-3 col-lg-3">
            <h4>Trebles</h4>
            <div className="singular-wrapper">
              <div>{`${details.trebleStake} (${parseFloat(details.trebleStakePercentage).toFixed(2)}%)`}</div>
              <div>{`${details.trebleBetCount} ${details.trebleBetCount > 1 ? 'Bets' : 'Bet'} (${parseFloat(
                details.trebleBetCountPercentage
              ).toFixed(2)}%)`}</div>
            </div>
          </div>

          <div className="form-wrapper col-xs-6 col-sm-3 col-md-3 col-lg-3">
            <h4>4+ Combos</h4>
            <div className="singular-wrapper">
              <div>{`${details.fourPlusStake} (${parseFloat(details.fourPlusStakePercentage).toFixed(2)}%)`}</div>
              <div>{`${details.fourPlusBetCount} ${details.fourPlusBetCount > 1 ? 'Bets' : 'Bet'} (${parseFloat(
                details.fourPlusBetCountPercentage
              ).toFixed(2)}%)`}</div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TopPanel)

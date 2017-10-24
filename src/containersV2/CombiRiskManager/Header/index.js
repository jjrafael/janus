import React, { Component } from 'react'
import { connect } from 'react-redux'
import { hashHistory } from 'react-router'
import { bindActionCreators } from 'redux'
import moment from 'moment'
import Header, { ListItem } from 'componentsV2/Header'
import constants from '../constants'
import { logout } from 'actions/user'
import ConfirmModal from 'componentsV2/Modal/ConfirmModal'
import Clock from 'components/clock'
import classNames from 'classnames'
import { toastr } from 'phxComponents/toastr/index'
import { mapPermissionsToProps } from 'componentsV2/checkPermission/index'
import ModalWindow from 'components/modal'
import {
  fetchFilters,
  setAutoRefresh,
  disabledAutoRefresh,
  toggleFilterModal,
  putCombinationLiabilityIndicators,
  reloadArbetDetails,
  fetchDetails,
  updateCombinationLiabilityIndicators,
  setBetType,
  setBlockingTypeMap,
  setMainPanelSelectedItem,
} from '../actions'
import cx from 'classnames'

function mapStateToProps(state) {
  return {
    user: state.user,
    enabledAutoRefresh: state.combinationRiskManager.enabledAutoRefresh,
    refreshInterval: state.combinationRiskManager.refreshInterval,
    isFetchingConsolidatedAccum: state.combinationRiskManager.isFetchingConsolidatedAccumulatorRiskFilter,
    filters: state.combinationRiskManager.filters,
    hasChangeUnsaved: state.combinationRiskManager.hasChangeUnsaved,
    indicators: state.combinationRiskManager.unsavedLimitChange,
    defaultIndicators: state.combinationRiskManager.defaultCombiLiabilityIndicators,
    selectedItemId: state.combinationRiskManager.mainPanelSelectedItemId,
    accumList: state.combinationRiskManager.accumulatorRiskList,
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      setAutoRefresh,
      disabledAutoRefresh,
      fetchFilters,
      toggleFilterModal,
      putCombinationLiabilityIndicators,
      reloadArbetDetails,
      fetchDetails,
      updateCombinationLiabilityIndicators,
      setBetType,
      setBlockingTypeMap,
      setMainPanelSelectedItem,
    },
    dispatch
  )
}

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      interval: null,
    }
  }

  componentWillMount() {
    const { enabledAutoRefresh, fetchFilters, filters } = this.props
    if (enabledAutoRefresh) {
      fetchFilters(filters)
      this._setInterval(2)
    }
  }

  componentWillUpdate(nextProp, nextState) {
    if (this.props.accumList !== nextProp.accumList) {
      const lastSelectedItem = nextProp.accumList.find(item => item.accumulatorRiskId === this.props.selectedItemId)
      if (lastSelectedItem) {
        const {
          accumulatorRiskId: itemId,
          accumulatorRiskBreakdownIds,
          combinationLiabilityIndicators,
          selections,
          blockingTypeMap,
          potentialPayout: payout,
          totalStakes: stake,
          liability,
        } = lastSelectedItem
        this.props.setBetType(selections)
        this.props.setBlockingTypeMap(blockingTypeMap)
        this.props.setMainPanelSelectedItem(itemId, lastSelectedItem)
        !this.props.hasChangeUnsaved && this.props.updateCombinationLiabilityIndicators(combinationLiabilityIndicators)
        this.props.fetchDetails(itemId)
        this.props.reloadArbetDetails(accumulatorRiskBreakdownIds)
      }
    }
  }

  componentWillUnmount() {
    clearInterval(this.timer)
  }

  _setInterval(interval) {
    const { enabledAutoRefresh, refreshInterval, fetchFilters, filters } = this.props
    if (enabledAutoRefresh) {
      //console.log('jj new interval2: ', interval + ' @ '+moment().format('HH:mm:ss A'));
      this.timer = setInterval(e => {
        fetchFilters(filters)
      }, interval * 60000)
    } else {
      fetchFilters(filters)
    }
  }

  logout = () => {
    this.props.dispatch(logout())
    hashHistory.replace('/login')
  }

  goLobby = () => {
    hashHistory.replace('/')
  }

  handleChange = event => {
    clearInterval(this.timer)
    this.timer = 0
    this.props.dispatch(setAutoRefresh(Number(event.target.value)))
    if (event.target.value == 0) {
      this.props.dispatch(disabledAutoRefresh())
    } else {
      this._setInterval(Number(event.target.value))
    }
  }

  refresh = () => {
    this.props.dispatch(fetchFilters(this.props.filters))
  }

  saveCombiLimit = () => {
    const { hasChangeUnsaved, putCombinationLiabilityIndicators, indicators, defaultIndicators } = this.props
    if (!hasChangeUnsaved) return

    putCombinationLiabilityIndicators(indicators, defaultIndicators)
  }

  render() {
    const { user, refreshInterval, isFetchingConsolidatedAccum, hasChangeUnsaved } = this.props

    return (
      <Header
        title="Combination Risk Manager"
        user={user.details}
        onClick={e => {
          this.logout()
        }}
      >
        <ListItem title="Filter" onClick={e => this.props.toggleFilterModal()}>
          <i className="phxico phx-filter icon-medium" />
        </ListItem>
        <ListItem title="Refresh" className="withActionSelect">
          <i
            className={`phxico ${isFetchingConsolidatedAccum ? 'phx-spin' : ''} phx-refresh icon-medium`}
            onClick={this.refresh}
          />
          <div className="action-select">
            <select name="refreshInterval" value={refreshInterval} onChange={this.handleChange}>
              {constants.refreshOptions.map(item => {
                return (
                  <option value={item.value} key={item.value}>
                    {item.description}
                  </option>
                )
              })}
            </select>
          </div>
        </ListItem>
        <ListItem className={cx({ disabled: !hasChangeUnsaved })} title="Save" onClick={this.saveCombiLimit}>
          <i className="phxico phx-save icon-medium" />
        </ListItem>
      </Header>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(mapPermissionsToProps(App))

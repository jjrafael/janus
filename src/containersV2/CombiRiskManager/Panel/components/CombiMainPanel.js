import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { List } from 'immutable'
import { AutoSizer } from 'react-virtualized'
import { RVTableWithSort } from './'
import { rowRenderer, cellIconRenderer, cellMoneyFormatRenderer } from '../rvtrenderer'
import ConfirmModal from 'componentsV2/Modal/ConfirmModal'
import {
  fetchDetails,
  fetchArbetDetails,
  updateCombinationLiabilityIndicators,
  setBetType,
  setBlockingTypeMap,
  setMainPanelSelectedItem,
  resetLimitChange,
} from '../../actions'

class CombiMainPanel extends Component {
  constructor(props) {
    super(props)

    this.state = {
      modalConfirmVisible: false,
      lastSelectedItemProps: null,
    }

    this.cancelAction = this.cancelAction.bind(this)
    this.continueToDetail = this.continueToDetail.bind(this)
    this.loadDetails = this.loadDetails.bind(this)
    this.processDetail = this.processDetail.bind(this)
    this.noRowData = this.noRowData.bind(this)
  }

  cancelAction() {
    this.setState({ lastSelectedItemProps: null, modalConfirmVisible: false })
  }

  continueToDetail() {
    this.processDetail(this.state.lastSelectedItemProps)
    this.props.resetLimitChange()
    this.setState({ lastSelectedItemProps: null, modalConfirmVisible: false })
  }

  loadDetails({ index, rowData, itemId }) {
    if (this.props.hasChangeUnsaved) {
      const itemProps = { index, rowData, itemId }
      this.setState({ modalConfirmVisible: true, lastSelectedItemProps: itemProps })
      return
    }

    this.processDetail({ index, rowData, itemId })
  }

  processDetail({ index, rowData, itemId }) {
    const { accumulatorRiskBreakdownIds, combinationLiabilityIndicators, selections, blockingTypeMap } = rowData
    this.props.setBetType(selections)
    this.props.setBlockingTypeMap(blockingTypeMap)
    this.props.setMainPanelSelectedItem(itemId, rowData)
    this.props.updateCombinationLiabilityIndicators(combinationLiabilityIndicators)
    this.props.fetchDetails(itemId)
    this.props.fetchArbetDetails(accumulatorRiskBreakdownIds)
  }

  noRowData() {
    return (
      <div className="no-combi-found">
        <div className="no-found-message">No record found</div>
      </div>
    )
  }

  render() {
    const { accumList: list, mainPanelSelectedItemId: itemId, currentBetType, filters, hasChangeUnsaved } = this.props
    const { modalConfirmVisible } = this.state
    const style = {
      acenter: { textAlign: 'center' },
      aright: { textAlign: 'right' },
      aleft: { textAlign: 'left' },
      hasSelection: { height: 'calc(100vh - 610px)' },
      defaultNone: { height: 'calc(100vh - 190px)' },
    }

    const columns = List([
      { label: '', dataKey: '', width: 15, disableSort: true },
      { label: '', dataKey: 'blockStatus', width: 35, style: style.acenter, cellRenderer: cellIconRenderer },
      { label: 'Selections', dataKey: 'selections', width: 100, style: style.acenter },
      { label: 'Result Status', dataKey: 'resultStatus', width: 150, style: style.acenter },
      { label: 'Number of Bets', dataKey: 'numberOfBets', width: 150, style: style.acenter },
      {
        label: 'Total Stakes',
        dataKey: 'totalStakes',
        width: 150,
        style: style.aright,
        cellRenderer: cellMoneyFormatRenderer,
      },
      {
        label: 'Potential Payout',
        dataKey: 'potentialPayout',
        width: 150,
        style: style.aright,
        cellRenderer: cellMoneyFormatRenderer,
      },
      {
        label: 'Liability',
        dataKey: 'liability',
        width: 150,
        style: style.aright,
        cellRenderer: cellMoneyFormatRenderer,
      },
      {
        label: 'Average Price',
        dataKey: 'averagePrice',
        width: 150,
        style: style.aright,
        cellRenderer: cellMoneyFormatRenderer,
      },
      { label: 'Outcomes', dataKey: 'outcomes', width: 300, flexGrow: 1 },
    ])

    return (
      <div>
        <div className="form-wrapper">
          <div style={currentBetType === 'None' ? style.defaultNone : style.hasSelection}>
            <AutoSizer>
              {({ width, height }) => (
                <RVTableWithSort
                  width={width}
                  height={height}
                  headerHeight={20}
                  rowHeight={20}
                  list={list}
                  columns={columns}
                  rowRenderer={rowRenderer}
                  identifier="accumulatorRiskId"
                  onRowClick={({ index, rowData, itemId }) => this.loadDetails({ index, rowData, itemId })}
                  selectedRow={itemId}
                  hasChangeUnsaved={hasChangeUnsaved}
                  noRowsRenderer={this.noRowData}
                />
              )}
            </AutoSizer>
          </div>
        </div>
        <ConfirmModal
          isVisible={modalConfirmVisible}
          message={
            <div>
              <p>Your unsaved changes will be discarded when you move to another record.</p>
              <p>Are you sure you want to proceed?</p>
            </div>
          }
          onConfirm={this.continueToDetail}
          onCancel={this.cancelAction}
        />
      </div>
    )
  }
}

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

export default connect(mapStateToProps, mapDispatchToProps)(CombiMainPanel)

CombiMainPanel.propTypes = {
  list: PropTypes.instanceOf(List).isRequired,
}

CombiMainPanel.defaultProps = {
  list: List([]),
}

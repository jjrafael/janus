import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { List } from 'immutable'
import { AutoSizer } from 'react-virtualized'
import 'react-virtualized/styles.css'
import { RVTableBasic } from './'
import { rowRenderer, CellInputRenderer, CellSelectRenderer } from '../rvtrenderer'
import { setLimitChange } from '../../actions'

const CombinationLiabilityIndicators = ({
  indicators: list,
  defaultIndicators: defaultList,
  setLimitChange,
  itemId,
}) => {
  const style = {
    acenter: { textAlign: 'center' },
    aright: { textAlign: 'right' },
    aleft: { textAlign: 'left' },
    hasSelection: { height: 'calc(100vh - 600px)' },
    defaultNone: { height: 'calc(100vh - 190px)' },
  }

  const handleChange = ({ value, dataKey, type, rowData }) => {
    let [key, action] = dataKey.split('_')
    let indicatorType = `${key.toUpperCase()}_${type}`
    setLimitChange(indicatorType, action, value)
  }

  const getCellRendererForInput = props => {
    return <CellInputRenderer {...props} onChange={handleChange} key={itemId} />
  }

  const getCellRendererForSelect = props => {
    return <CellSelectRenderer {...props} onSelect={handleChange} key={itemId} />
  }

  const columns = List([
    { label: '', dataKey: 'type', width: 100 },
    {
      label: 'Warning Limit',
      dataKey: 'warning_cliLimit',
      width: 200,
      style: style.aright,
      cellRenderer: getCellRendererForInput,
    },
    { label: '%', dataKey: 'warning_percent', width: 100, style: style.acenter },
    {
      label: 'Warning Action',
      dataKey: 'warning_actionType',
      width: 200,
      flexGrow: 1,
      cellRenderer: getCellRendererForSelect,
    },
    {
      label: 'Critical Limit',
      dataKey: 'critical_cliLimit',
      width: 200,
      style: style.aright,
      cellRenderer: getCellRendererForInput,
    },
    { label: '%', dataKey: 'critical_percent', width: 100, style: style.acenter },
    {
      label: 'Critical Action',
      dataKey: 'critical_actionType',
      width: 200,
      flexGrow: 1,
      cellRenderer: getCellRendererForSelect,
    },
  ])
  return list.size === 0 ? null : (
    <div className="form-wrapper">
      <h4>Limits for Combination</h4>
      <div className="margin-5">
        <AutoSizer disableHeight>
          {({ width }) => (
            <RVTableBasic
              width={width}
              height={80}
              headerHeight={20}
              rowHeight={20}
              list={list}
              columns={columns}
              rowRenderer={rowRenderer}
              identifier="type"
              keyLink={itemId} // Optional
            />
          )}
        </AutoSizer>
      </div>
    </div>
  )
}

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

CombinationLiabilityIndicators.propTypes = {
  indicators: PropTypes.instanceOf(List).isRequired,
}

CombinationLiabilityIndicators.defaultProps = {
  indicators: List([]),
}

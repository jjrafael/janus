import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { List } from 'immutable'
import { AutoSizer } from 'react-virtualized'
import { RVTableBasic } from './'
import 'react-virtualized/styles.css'
import { formatDateOnList } from '../../helpers'
import { rowRenderer, cellMoneyFormatRenderer } from '../rvtrenderer'
import { toggleBlockingRuleModal } from '../../actions'

const CombinationBet = ({
  riskDetails,
  betType,
  channels,
  currentBlockingTypeMap,
  toggleBlockingRuleModal,
  itemId,
  tableOnly,
}) => {
  const style = {
    acenter: { textAlign: 'center' },
    aright: { textAlign: 'right' },
    aleft: { textAlign: 'left' },
  }

  const _toggleBlockingRuleModal = () => {
    toggleBlockingRuleModal(true)
  }

  const columns = List([
    { label: 'Event Date', dataKey: 'eventDate', width: 200 },
    { label: 'Event', dataKey: 'eventDescription', width: 320, flexGrow: 1 },
    { label: 'Market', dataKey: 'marketDescription', width: 200 },
    { label: 'Period', dataKey: 'periodDescription', width: 200 },
    { label: 'Outcome', dataKey: 'outcomeDescription', width: 200 },
    {
      label: 'Ave. Price',
      dataKey: 'averagePrice',
      width: 200,
      cellRenderer: cellMoneyFormatRenderer,
      style: style.aright,
    },
    { label: 'Market Status', dataKey: 'marketStatus', width: 200 },
    { label: 'Result', dataKey: 'result', width: 200, flexGrow: 1 },
  ])

  const columnsShort = List([
    { label: 'Event Date', dataKey: 'eventDate', width: 200 },
    { label: 'Event Description', dataKey: 'eventDescription', width: 320, flexGrow: 1 },
    { label: 'Market', dataKey: 'marketDescription', width: 200 },
    { label: 'Outcome', dataKey: 'outcomeDescription', width: 200 },
  ])

  if (tableOnly === true) {
    return (
      <div className="combinationBet-tableOnly">
        <AutoSizer disableHeight>
          {({ width }) => (
            <RVTableBasic
              width={width}
              height={80}
              headerHeight={20}
              rowHeight={20}
              list={formatDateOnList(riskDetails, 'eventDate')}
              columns={columnsShort}
              rowRenderer={rowRenderer}
              identifier="outcomeDescription"
              keyLink={itemId}
            />
          )}
        </AutoSizer>
      </div>
    )
  } else {
    return riskDetails.size === 0 ? null : (
      <div className="form-wrapper">
        <h4>Combination Bet Type: {betType}</h4>
        <div className="margin-5">
          <AutoSizer disableHeight>
            {({ width }) => (
              <RVTableBasic
                width={width}
                height={80}
                headerHeight={20}
                rowHeight={20}
                list={formatDateOnList(riskDetails, 'eventDate')}
                columns={columns}
                rowRenderer={rowRenderer}
                identifier="outcomeDescription"
                keyLink={itemId}
              />
            )}
          </AutoSizer>
        </div>
        <div className="blockingrules-section">
          <div className="channels">
            {channels.map(channel => {
              if (currentBlockingTypeMap.hasOwnProperty(channel.id)) {
                return (
                  <div className="channel" data-id={channel.id}>
                    <i className={`phxico phx-${channel.description.toLowerCase()} `} />
                    <label>{channel.description}</label>
                    <div className="channel-rule" data-rule={currentBlockingTypeMap[channel.id]}>
                      {currentBlockingTypeMap[channel.id]}
                    </div>
                  </div>
                )
              }
            })}
          </div>
          <button type="button" className="btn btn-primary" onClick={_toggleBlockingRuleModal}>
            Set New Blocking Rule
          </button>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
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

CombinationBet.propTypes = {
  riskDetails: PropTypes.instanceOf(List).isRequired,
  betType: PropTypes.string.isRequired,
}

CombinationBet.defaultProps = {
  riskDetails: List([]),
  betType: 'None',
}

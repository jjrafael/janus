import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import _ from 'lodash'
import {
  fetchEventPathsFilter,
  fetchEventPathsChildFilter,
  fetchEventPathEventsFilter,
  fetchEventPathMarketsFilter,
  toggleEventPathFilter,
  setEventPathSelectedFilter,
} from '../../actions'
function mapStateToProps(state) {
  const {
    eventPathsFilter,
    originalEventPathsFilter,
    sportId,
    isFetchingEventPathFilters,
    isFetchingEventPathFiltersFailed,
    toBeSelectedEventPathFilters,
    selectedEventPathFilters,
    selectedEventPathFiltersMap,
  } = state.combinationRiskManager
  return {
    eventPathsFilter,
    originalEventPathsFilter,
    sportId,
    isFetchingEventPathFilters,
    isFetchingEventPathFiltersFailed,
    toBeSelectedEventPathFilters,
    selectedEventPathFilters,
    selectedEventPathFiltersMap,
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      fetchEventPathsFilter,
      // fetchEventPathsChildFilter,
      // fetchEventPathEventsFilter,
      // fetchEventPathMarketsFilter,
      toggleEventPathFilter,
      // setEventPathSelectedFilter
    },
    dispatch
  )
}
const Tree = ({
  data,
  sportId,
  originalEventPathsFilter,
  selectedEventPathFilters,
  fetchEventPathsFilter,
  toggleEventPathFilter,
  className = '',
}) => {
  return (
    <ul className={className} style={{ ...(!className && { marginTop: 5, marginLeft: 17 }) }}>
      {_.map(data, ep => {
        const treeDetails = originalEventPathsFilter[sportId].children[ep]
        const hasChildren = treeDetails.hasChildren
        const isDisabled = selectedEventPathFilters.indexOf(`ep${treeDetails.id}`) !== -1
        return (
          <li>
            <span className="ep-toggle">
              {hasChildren ? (
                <i
                  className={`phx-ico phx-chevron-${treeDetails.isOpen ? 'down' : 'right'}`}
                  onClick={() => {
                    fetchEventPathsFilter(treeDetails.id, 'eventpath', sportId, !treeDetails.isOpen)
                  }}
                />
              ) : (
                ''
              )}
            </span>
            <label className={`${!hasChildren ? 'no-child' : ''} ${isDisabled ? 'disabled' : ''}`}>
              <input
                type="checkbox"
                onChange={e => {
                  toggleEventPathFilter(e.target.checked, treeDetails, 'eventpath')
                }}
                disabled={isDisabled}
              />{' '}
              <span className="path-icon path-icon--path">
                <i className="phxico phx-event-path icon-small" />
              </span>{' '}
              {treeDetails.description}
            </label>
            {hasChildren ? <Tree data={treeDetails.children} /> : null}
          </li>
        )
      })}
    </ul>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(Tree)

import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {
  fetchEventPathsFilter,
  fetchEventPathsChildFilter,
  fetchEventPathEventsFilter,
  fetchEventPathMarketsFilter,
  toggleEventPathFilter,
  setEventPathSelectedFilter,
} from '../actions'
import Tree from './EventPathComponents/tree'
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
    allSports: state.apiConstants.values.riskSports,
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
      fetchEventPathsChildFilter,
      fetchEventPathEventsFilter,
      fetchEventPathMarketsFilter,
      toggleEventPathFilter,
      setEventPathSelectedFilter,
    },
    dispatch
  )
}

const EventPaths = ({
  allSports,
  eventPathsFilter,
  originalEventPathsFilter,
  sportId,
  isFetchingEventPathFilters,
  isFetchingEventPathFiltersFailed,
  fetchEventPathsFilter,
  fetchEventPathsChildFilter,
  fetchEventPathEventsFilter,
  fetchEventPathMarketsFilter,
  toggleEventPathFilter,
  setEventPathSelectedFilter,
  toBeSelectedEventPathFilters,
  selectedEventPathFilters,
  selectedEventPathFiltersMap,
}) => {
  console.log(allSports, 'allSports')
  const fetchEPFilter = (id, type, parent) => {
    if (id) {
      fetchEventPathsFilter(id, type, parent)
    }
  }
  return (
    <div className="filter-container flex-3">
      <div className="filter-header">Event Path</div>
      <div className="filter-wrap">
        <div className="filter-item">
          <div className="flex-2">
            <select
              onChange={e => {
                fetchEPFilter(e.target.value, 'eventpath')
              }}
            >
              <option value=""> Select Sport </option>
              {!_.isEmpty(allSports)
                ? _.map(allSports, sport => {
                    return <option value={`${sport.defaultEventPathId}`}>{sport.description}</option>
                  })
                : null}
            </select>
          </div>
          <div className="flex-2" />
        </div>
        <div className="filter-item epf-container">
          <div className="flex-2">
            {/*<Tree data={eventPathsFilter} className="event-paths-filter"/>*/}
            {isFetchingEventPathFilters ? (
              <div className="event-paths-filter">
                <div className="loading tcenter">
                  <i className="phxico phx-spinner phx-spin" />
                </div>
              </div>
            ) : (
              <ul className="event-paths-filter">
                {!_.isEmpty(eventPathsFilter)
                  ? _.map(eventPathsFilter, ep => {
                      const eventPath = originalEventPathsFilter[sportId].children[ep]
                      const hasChildren = eventPath.hasChildren
                      const isDisabledEP = selectedEventPathFilters.indexOf(`ep${eventPath.id}`) !== -1
                      return (
                        <li>
                          <span className="ep-toggle">
                            {hasChildren ? (
                              <i
                                className={`phx-ico phx-chevron-${eventPath.isOpen ? 'down' : 'right'}`}
                                onClick={() => {
                                  fetchEventPathsChildFilter(eventPath.id, 'eventpath', sportId, !eventPath.isOpen)
                                }}
                              />
                            ) : (
                              ''
                            )}
                          </span>
                          <label className={`${!hasChildren ? 'no-child' : ''} ${isDisabledEP ? 'disabled' : ''}`}>
                            <input
                              type="checkbox"
                              onChange={e => {
                                toggleEventPathFilter(e.target.checked, eventPath, 'eventpath')
                              }}
                              disabled={isDisabledEP}
                            />{' '}
                            <span className="path-icon path-icon--path">
                              <i className="phxico phx-event-path icon-small" />
                            </span>{' '}
                            {eventPath.description}
                          </label>
                          <ul style={{ marginTop: 5, marginLeft: 17 }}>
                            {eventPath.isLoading &&
                              eventPath.isOpen && (
                                <li>
                                  <i>loading...</i>
                                </li>
                              )}
                            {eventPath.isOpen &&
                              !eventPath.isLoading &&
                              !_.isEmpty(eventPath.children) &&
                              _.map(eventPath.children, epc => {
                                const isDisabledEPC = selectedEventPathFilters.indexOf(`ep${epc.id}`) !== -1
                                return (
                                  <li>
                                    <span className="ep-toggle">
                                      {epc.hasChildren ? (
                                        <i
                                          className={`phx-ico phx-chevron-${epc.isOpen ? 'down' : 'right'}`}
                                          onClick={() => {
                                            fetchEventPathEventsFilter(
                                              epc.id,
                                              'eventpath',
                                              sportId,
                                              eventPath.id,
                                              !epc.isOpen
                                            )
                                          }}
                                        />
                                      ) : (
                                        ''
                                      )}
                                    </span>
                                    <label
                                      className={`${!epc.hasChildren ? 'no-child' : ''} ${isDisabledEPC
                                        ? 'disabled'
                                        : ''}`}
                                    >
                                      <input
                                        type="checkbox"
                                        onChange={e => {
                                          toggleEventPathFilter(e.target.checked, epc, 'eventpath')
                                        }}
                                        disabled={isDisabledEPC}
                                      />{' '}
                                      <span className="path-icon path-icon--path">
                                        <i className="phxico phx-event-path icon-small" />
                                      </span>{' '}
                                      {epc.description}
                                    </label>
                                    <ul style={{ marginTop: 5, marginLeft: 17 }}>
                                      {epc.isLoading &&
                                        epc.isOpen && (
                                          <li>
                                            <i>loading...</i>
                                          </li>
                                        )}
                                      {epc.isOpen &&
                                        !epc.isLoading &&
                                        !_.isEmpty(epc.children) &&
                                        _.map(epc.children, epe => {
                                          console.log(
                                            epe,
                                            `${epe.type === 'RANKEVENT' ? 're' : 'ge'}${epe.id}`,
                                            'sdasdas'
                                          )
                                          const isDisabledEvent =
                                            selectedEventPathFilters.indexOf(
                                              `${epe.type === 'RANKEVENT' ? 're' : 'ge'}${epe.id}`
                                            ) !== -1
                                          return (
                                            <li>
                                              <span className="ep-toggle">
                                                {epe.hasChildren ? (
                                                  <i
                                                    className={`phx-ico phx-chevron-${epe.isOpen ? 'down' : 'right'}`}
                                                    onClick={() => {
                                                      fetchEventPathMarketsFilter(
                                                        epe.id,
                                                        'market',
                                                        sportId,
                                                        eventPath.id,
                                                        epc.id,
                                                        !epe.isOpen
                                                      )
                                                    }}
                                                  />
                                                ) : (
                                                  ''
                                                )}
                                              </span>
                                              <label
                                                className={`${!epe.hasChildren ? 'no-child' : ''} ${isDisabledEvent
                                                  ? 'disabled'
                                                  : ''}`}
                                              >
                                                <input
                                                  type="checkbox"
                                                  onChange={e => {
                                                    toggleEventPathFilter(e.target.checked, epe, 'event')
                                                  }}
                                                  disabled={isDisabledEvent}
                                                />{' '}
                                                <span className={`path-icon path-icon--event`}>
                                                  <i
                                                    className={`phxico phx-${epe.type === 'RANKEVENT'
                                                      ? 'rank-event'
                                                      : 'game-event'} icon-small`}
                                                  />
                                                </span>{' '}
                                                {epe.description}
                                              </label>
                                              <ul style={{ marginTop: 5, marginLeft: 17 }}>
                                                {epe.isLoading &&
                                                  epe.isOpen && (
                                                    <li>
                                                      <i>loading...</i>
                                                    </li>
                                                  )}
                                                {epe.isOpen &&
                                                  !epe.isLoading &&
                                                  !_.isEmpty(epe.children) &&
                                                  _.map(epe.children, epm => {
                                                    return (
                                                      <li>
                                                        <span className="ep-toggle">
                                                          {epm.hasChildren ? (
                                                            <i
                                                              className={`phx-ico phx-chevron-${epm.isOpen
                                                                ? 'down'
                                                                : 'right'}`}
                                                              onClick={() => {
                                                                fetchEventPathMarketsFilter(
                                                                  epm.id,
                                                                  'event',
                                                                  sportId,
                                                                  epc.id,
                                                                  epe.id,
                                                                  !epm.isOpen
                                                                )
                                                              }}
                                                            />
                                                          ) : (
                                                            ''
                                                          )}
                                                        </span>
                                                        <label className={`${!epm.hasChildren ? 'no-child' : ''}`}>
                                                          <input type="checkbox" />{' '}
                                                          <span className={`path-icon path-icon--event`}>
                                                            <i
                                                              className={`phxico phx-${epm.type === 'RANKEVENT'
                                                                ? 'rank-event'
                                                                : 'game-event'} icon-small`}
                                                            />
                                                          </span>{' '}
                                                          {epm.description}
                                                        </label>
                                                      </li>
                                                    )
                                                  })}
                                              </ul>
                                            </li>
                                          )
                                        })}
                                    </ul>
                                  </li>
                                )
                              })}
                          </ul>
                        </li>
                      )
                    })
                  : null}
              </ul>
            )}
          </div>
          <div className="epf-action-buttons">
            <button
              disabled={_.isEqual(toBeSelectedEventPathFilters, selectedEventPathFilters)}
              onClick={e => setEventPathSelectedFilter()}
            >
              <span className="phx-ico phx-chevron-right" />
            </button>
            <button disabled={true}>
              <span className="phx-ico phx-chevron-left" />
            </button>
          </div>
          <div className="flex-2">
            <ul className="event-paths-filter">
              {_.map(selectedEventPathFilters, id => {
                const data = selectedEventPathFiltersMap[id]
                console.log(data, 'selectedEventPathFilters')
                return (
                  <li>
                    <label className={``}>
                      <input
                        type="checkbox"
                        onChange={e => {
                          // toggleEventPathFilter(e.target.checked, eventPath, "eventpath")
                        }}
                      />{' '}
                      <span
                        className={`path-icon path-icon--${data.type === 'EVENTPATH'
                          ? 'path'
                          : data.type === 'RANKEVENT' || data.type === 'GAMEEVENT'
                            ? 'event'
                            : data.type === 'MARKET' ? 'market' : 'outcome'}`}
                      >
                        <i
                          className={`phxico phx-${data.type === 'EVENTPATH'
                            ? 'event-path'
                            : data.type === 'GAMEEVENT'
                              ? 'game-event'
                              : data.type === 'RANKEVENT'
                                ? 'rank-event'
                                : data.type === 'MARKET' ? 'market' : 'outcome'} icon-small`}
                        />
                      </span>{' '}
                      {data.description}
                    </label>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
export default connect(mapStateToProps, mapDispatchToProps)(EventPaths)

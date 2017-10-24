import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import _ from 'lodash'
import { setSportFilterType } from '../actions'
function mapStateToProps(state) {
  const { sportFilterType } = state.combinationRiskManager
  return {
    allSports: state.apiConstants.values.riskSports,
    sportFilterType,
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      setSportFilterType,
    },
    dispatch
  )
}

const Sports = ({ allSports, sportFilterType, setSportFilterType }) => {
  const isAll = sportFilterType === 'all'
  const setSportFilter = e => {
    console.log(e.target.value)
    setSportFilterType(e.target.value)
  }
  return (
    <div className="filter-container flex-1">
      <div className="filter-header">Sport</div>
      <div className="filter-wrap">
        <ul>
          <li>
            <label>
              <input
                type="radio"
                name="sportFilter"
                defaultChecked={isAll}
                defaultValue="all"
                onClick={setSportFilter}
              />{' '}
              All Sports
            </label>
          </li>
          <li>
            <label>
              <input
                type="radio"
                name="sportFilter"
                defaultChecked={!isAll}
                defaultValue="specific"
                onClick={setSportFilter}
              />{' '}
              Specific Sports
            </label>
            <ul className="specific-sports">
              {!_.isEmpty(allSports)
                ? _.map(allSports, sport => {
                    return (
                      <li>
                        <label className={`${isAll ? 'disabled' : ''}`}>
                          <input type="checkbox" disabled={sportFilterType === 'all'} />{' '}
                          <span className={`path-icon sports-ico-${sport.code}`} />
                          {sport.description}
                        </label>
                      </li>
                    )
                  })
                : null}
            </ul>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(Sports)

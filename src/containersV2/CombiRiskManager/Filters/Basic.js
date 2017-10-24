import React, { Component } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { settledStatus } from '../constants'
import { TimeInput, Checkbox, Channels, Money, NumberInput } from '../Form'
import DateRangePicker from 'components/dateRangePickerV2'

class Basic extends Component {
  constructor(props) {
    super(props)

    const { marketStartTimeAfter, marketStartTimeBefore } = props.filters
    const { filters, channels } = props
    const defaultAfter = moment(marketStartTimeAfter).format('MM/DD/YYYY')
    const defaultBefore = moment(marketStartTimeBefore).format('MM/DD/YYYY')

    this.state = {
      errors: [],
      errorMessages: {},
      defaultAfter,
      defaultBefore,
      filters,
      channels,
      dependencyObjStake: {
        dependAtValue: props.filters.stakeRangeMin,
      },
      dependencyObjPayout: {
        dependAtValue: props.filters.payoutRangeMin,
      },
    }

    this.onItemChange = this.onItemChange.bind(this)
    this.validateForError = this.validateForError.bind(this)
  }

  onItemChange({ name, value, error, errorMessage, dependentObjName }) {
    this.validateForError({ value, name, error, errorMessage })
    if (dependentObjName) {
      let { [dependentObjName]: obj } = this.state
      let newObj = {
        ...obj,
        dependAtValue: value,
      }

      this.setState({ [dependentObjName]: newObj })
    }

    this.props.onFilterChange({ name, value })
  }

  validateForError({ value, name, error, errorMessage }) {
    let { errorMessages: oldErrorMessages, errors: oldErrors } = this.state
    let errorMessages = {
      ...oldErrorMessages,
      [name]: errorMessage,
    }

    let errors = [...this.state.errors]
    let i = oldErrors.indexOf(name)
    if (i >= 0 && !error) {
      errors.splice(i, 1)
    } else if (i === -1 && error) {
      errors.push(name)
    }
    this.setState({ errorMessages, errors })
  }

  componentWillUpdate(nextProp, nextState) {
    if (this.state.errors !== nextState.errors) {
      const { errors } = nextState
      this.props.errorListener({ error: errors.length > 0, type: 'basicFilterError' })
    }

    if (this.props.filters !== nextProp.filters) {
      this.setState({ filters: nextProp.filters })
    }
  }

  render() {
    const {
      defaultAfter,
      defaultBefore,
      errors,
      errorMessages,
      filters,
      channels,
      dependencyObjPayout,
      dependencyObjStake,
    } = this.state
    return (
      <div className="filter-container flex-3">
        <div className="filter-header">Basic</div>
        <div className="filter-wrap">
          <div className="filter-item">
            <label htmlFor="starting-after">Show Markets Starting After:</label>
            <div className="filter-input">
              <DateRangePicker
                placeholder="MM/DD/YYYY"
                inputName="marketStartTimeAfter"
                showDatePickerOnFocus={true}
                value={defaultAfter}
                onDateChange={({ value, name, error, errorMessage }) => {
                  if (moment(value, 'L', true).isValid()) {
                    this.onItemChange({
                      name,
                      value: moment(
                        new Date(`${value} ${moment(filters.marketStartTimeAfter).format('HH:mm')}`)
                      ).format(),
                      error,
                      errorMessage,
                    })
                  } else {
                    this.validateForError({ value, name, error, errorMessage })
                  }
                }}
              >
                {errors.includes('marketStartTimeAfter') && (
                  <span className="error">
                    <em>{errorMessages.marketStartTimeAfter && errorMessages.marketStartTimeAfter}</em>
                  </span>
                )}
              </DateRangePicker>
              <div className="spacer" />
              <TimeInput
                value={filters.marketStartTimeAfter}
                name="marketStartTimeAfter"
                onChange={this.onItemChange}
                onBlur={this.onItemChange}
              />
            </div>
          </div>
          <div className="filter-item">
            <label htmlFor="starting-before">Show Markets Starting Before:</label>
            <div className="filter-input">
              <DateRangePicker
                placeholder="MM/DD/YYYY"
                inputName="marketStartTimeBefore"
                showDatePickerOnFocus={true}
                value={defaultBefore}
                onDateChange={({ value, name, error, errorMessage }) => {
                  if (moment(value, 'L', true).isValid()) {
                    this.onItemChange({
                      name,
                      value: moment(
                        new Date(`${value} ${moment(filters.marketStartTimeBefore).format('HH:mm')}`)
                      ).format(),
                      error,
                      errorMessage,
                    })
                  } else {
                    this.validateForError({ value, name, error, errorMessage })
                  }
                }}
              >
                {errors.includes('marketStartTimeBefore') && (
                  <span className="error">
                    <em>{errorMessages.marketStartTimeBefore && errorMessages.marketStartTimeBefore}</em>
                  </span>
                )}
              </DateRangePicker>
              {<div className="spacer" />}
              <TimeInput
                value={filters.marketStartTimeBefore}
                name="marketStartTimeBefore"
                onChange={this.onItemChange}
                onBlur={this.onItemChange}
              />
            </div>
          </div>
          <div className="filter-item">
            <label htmlFor="stakes-range">Total Stakes Range:</label>
            <div className="filter-input">
              <Money
                name="stakeRangeMin"
                onChange={this.onItemChange}
                value={filters.stakeRangeMin}
                dependentObjName="dependencyObjStake"
              />
              <div className="spacer">-</div>
              <Money
                name="stakeRangeMax"
                onChange={this.onItemChange}
                value={filters.stakeRangeMax}
                dependent={true}
                dependencyObj={dependencyObjStake}
                dependAtCondition=">"
                dependentTo="stakeRangeMin"
              />
            </div>
          </div>
          <div className="filter-item">
            <label htmlFor="payout-range">Potential Payout Range:</label>
            <div className="filter-input">
              <Money
                name="payoutRangeMin"
                onChange={this.onItemChange}
                value={filters.payoutRangeMin}
                dependentObjName="dependencyObjPayout"
              />
              <div className="spacer">-</div>
              <Money
                name="payoutRangeMax"
                onChange={this.onItemChange}
                value={filters.payoutRangeMax}
                dependent={true}
                dependencyObj={dependencyObjPayout}
                dependAtCondition=">"
                dependentTo="payoutRangeMin"
              />
            </div>
          </div>
          <div className="filter-item">
            <label htmlFor="payout-range">Combination Size:</label>
            <div className="filter-input">
              <NumberInput name="combinationSize" value={filters.combinationSize} onChange={this.onItemChange} />
              <div className="spacer"> &nbsp; </div>
              <div className="option">
                <label htmlFor="and-greater">
                  <Checkbox
                    name="greaterCombinationSize"
                    onChange={this.onItemChange}
                    value={filters.greaterCombinationSize}
                  />
                  And Greater?
                </label>
              </div>
            </div>
          </div>
          <div className="filter-item">
            <label htmlFor="payout-range">Channels:</label>
            <div className="filter-input">
              <Channels channelIds={filters.channelIds} channels={channels} onChange={this.onItemChange} />
            </div>
          </div>
          <div className="filter-item">
            <label htmlFor="payout-range">Blocking Status:</label>
            <div className="filter-input">
              <div className="option">
                <label htmlFor="any">
                  <Checkbox name="blockAny" onChange={this.onItemChange} value={filters.blockAny} />
                  Any
                </label>
                <label htmlFor="specific">
                  <Checkbox name="blockSpecific" onChange={this.onItemChange} value={filters.blockSpecific} />
                  Specific
                </label>
                <label htmlFor="none">
                  <Checkbox name="blockNone" onChange={this.onItemChange} value={filters.blockNone} />
                  None
                </label>
              </div>
            </div>
          </div>
          <div className="filter-item">
            <label htmlFor="payout-range">Settled:</label>
            <div className="filter-input">
              <div className="option">
                {Object.keys(settledStatus).map((k, i) => (
                  <label key={i}>
                    <input
                      type="radio"
                      name="settledStatus"
                      value={settledStatus[k]}
                      checked={settledStatus[k] === filters.settledStatus}
                      onChange={({ target }) => this.onItemChange(target)}
                    />
                    {k}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Basic

Basic.propTypes = {
  filters: PropTypes.object.isRequired,
  onFilterChange: PropTypes.func.isRequired,
  errorListener: PropTypes.func.isRequired,
}

Basic.defaultProps = {
  onFilterChange: ({ name, value }) => {},
}

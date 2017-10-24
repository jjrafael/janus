import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { hashHistory } from 'react-router'
import { bindActionCreators } from 'redux'
import ModalWindow from 'components/modal'
import { toggleFilterModal, fetchFilters, updateFilters } from '../actions'
import { Basic as BasicFilter, BetStatus, Sports as SportsFilter, EventPaths } from '../Filters'

function mapStateToProps({ combinationRiskManager, apiConstants }) {
  return {
    showFilterModal: combinationRiskManager.showFilterModal,
    channels: apiConstants.values.channels,
    filters: combinationRiskManager.filters,
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      toggleFilterModal,
      fetchFilters,
      updateFilters,
    },
    dispatch
  )
}

class FilterModal extends Component {
  constructor(props) {
    super(props)

    this.state = {
      filters: props.filters,
      error: false,
      basicFilterError: false,
    }

    this.betStatusChange = this.betStatusChange.bind(this)
    this.basicFilterChange = this.basicFilterChange.bind(this)
    this.errorListener = this.errorListener.bind(this)
    this.onSaveFilter = this.onSaveFilter.bind(this)
  }

  onSaveFilter() {
    const { filters, error } = this.state
    if (!error) {
      this.props.updateFilters(filters)
      this.props.fetchFilters(filters)
      this.props.toggleFilterModal()
    }
  }

  betStatusChange({ betStatus }) {
    const { filters } = this.state
    let newFilters = {
      ...filters,
      betStatus,
    }

    this.setState({ filters: newFilters })
  }

  basicFilterChange({ name, value }) {
    const { filters } = this.state
    let newFilters = {
      ...filters,
      [name]: name === 'combinationSize' ? Number(value) : value,
    }

    this.setState({ filters: newFilters })
  }

  errorListener({ error, type }) {
    this.setState({ [type]: error })
  }

  componentWillUpdate(nextProps, nextState) {
    if (this.props.filters !== nextProps.filters) {
      this.setState({ filters: nextProps.filters, betStatus: nextProps.filters.betStatus })
    }

    // if (this.state.filters !== nextState.filters) {
    //   console.log(nextState.filters)
    // }
  }

  render() {
    const { showFilterModal, channels } = this.props
    const { filters, error, basicFilterError } = this.state
    return (
      <ModalWindow
        className="large tall"
        onClose={this.props.toggleFilterModal}
        title="Combination Risk Filter"
        closeButton={true}
        isVisibleOn={showFilterModal}
        shouldCloseOnOverlayClick={false}
      >
        <h4>Combination Risk Filter</h4>
        <div className="form-inner">
          <div className="form-wrapper">
            <div className="filter-wrapper">
              <BasicFilter
                onFilterChange={this.basicFilterChange}
                channels={channels}
                filters={filters}
                errorListener={this.errorListener}
              />
              <BetStatus onChange={this.betStatusChange} betStatus={filters.betStatus} />
            </div>
            <div className="filter-wrapper">
              <SportsFilter />
              <EventPaths />
            </div>
          </div>
        </div>
        <div className="button-group modal-controls">
          <button className="btn btn-action" onClick={this.props.toggleFilterModal}>
            Cancel
          </button>
          <button
            className="btn btn-action btn-primary"
            disabled={error || basicFilterError}
            onClick={this.onSaveFilter}
          >
            OK
          </button>
        </div>
      </ModalWindow>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FilterModal)

FilterModal.propTypes = {
  filters: PropTypes.object.isRequired,
}

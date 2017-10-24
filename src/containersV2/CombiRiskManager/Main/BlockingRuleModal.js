import React, { Component } from 'react'
import { connect } from 'react-redux'
import { hashHistory } from 'react-router'
import { bindActionCreators } from 'redux'
import ModalWindow from 'components/modal'
import { toggleBlockingRuleModal, setBlockingRule, fetchFilters } from '../actions'
import { CombinationBet } from '../Panel/components'

function mapStateToProps(state) {
  return {
    showBlockingRuleModal: state.combinationRiskManager.showBlockingRuleModal,
    channels: state.apiConstants.values.channels,
    accumulatorRiskId: state.combinationRiskManager.selectedRiskDetail.accumulatorRiskId,
    filterParams: state.combinationRiskManager.filters,
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      toggleBlockingRuleModal,
      setBlockingRule,
      fetchFilters,
    },
    dispatch
  )
}

class BlockingRuleModal extends Component {
  constructor(props) {
    super(props)
    this._setBlockingType = this._setBlockingType.bind(this)
    this._closeBlockingRuleModal = this._closeBlockingRuleModal.bind(this)
    this._backBlockingRuleModal = this._backBlockingRuleModal.bind(this)
    this._nextBlockingRuleModal = this._nextBlockingRuleModal.bind(this)
    this._setBlockingChannels = this._setBlockingChannels.bind(this)
    this._confirmBlockingRule = this._confirmBlockingRule.bind(this)

    this.state = {
      page: 1,
      blockType: null,
      selectedChannels: [],
    }
  }

  componentDidMount() {
    const { channels } = this.props
    channels.map(channel => {
      this.state.selectedChannels.push(channel.id)
    })
  }

  setBlockingRulePage(page) {
    this.setState({
      page: page,
    })
  }

  _setBlockingChannels(e) {
    const { channels } = this.props
    const { selectedChannels } = this.state
    let _selected = selectedChannels

    if (_selected.indexOf(Number(e.target.value)) !== -1) {
      if (_selected.length > 1) {
        let index = _selected.indexOf(Number(e.target.value))
        _selected.splice(index, 1)
      }
    } else {
      _selected.push(Number(e.target.value))
    }
    this.setState({ selectedChannels: _selected })
  }

  _setBlockingType(e) {
    this.setState({
      blockType: e.target.value,
    })
  }

  _closeBlockingRuleModal() {
    this.props.toggleBlockingRuleModal(false)
    this.setState({
      page: 1,
      blockType: null,
    })
  }

  _confirmBlockingRule() {
    this.props.setBlockingRule(
      this.props.accumulatorRiskId,
      {
        blockingType: this.state.blockType,
        channelIds: this.state.selectedChannels,
      },
      this.props.filterParams
    )
  }

  _backBlockingRuleModal() {
    this.setBlockingRulePage(1)
  }

  _nextBlockingRuleModal() {
    this.setBlockingRulePage(2)
  }

  render() {
    const { showBlockingRuleModal, channels } = this.props
    const { page, blockType, selectedChannels } = this.state
    return (
      <ModalWindow
        onClose={this._closeBlockingRuleModal}
        title="Set New Blocking Rule"
        closeButton={true}
        isVisibleOn={showBlockingRuleModal}
        shouldCloseOnOverlayClick={false}
      >
        <h4>Blocking Rules</h4>
        <div className="form-inner">
          {page === 1 ? (
            <div className="form-wrapper" data-page={1}>
              <p>Do you wish to block this combination of outcomes?</p>
              <div className="blocktype-inner">
                <div className="blocktype-item">
                  <input
                    type="radio"
                    name="blocking-type"
                    value="SPECIFIC"
                    onChange={this._setBlockingType}
                    checked={blockType === 'SPECIFIC'}
                  />
                  <label>
                    <strong>Specific</strong> - Only when combined in this bet type
                  </label>
                </div>
                <div className="blocktype-item">
                  <input
                    type="radio"
                    name="blocking-type"
                    value="ANY"
                    onChange={this._setBlockingType}
                    checked={blockType === 'ANY'}
                  />
                  <label>
                    <strong>Any</strong> - When included on other outcomes in other bet types
                  </label>
                </div>
                <div className="blocktype-item">
                  <input
                    type="radio"
                    name="blocking-type"
                    value="NONE"
                    onChange={this._setBlockingType}
                    checked={blockType === 'NONE'}
                  />
                  <label>
                    <strong>None</strong> - Removes all blocking
                  </label>
                </div>
              </div>
            </div>
          ) : (
            <div className="form-wrapper" data-page={2}>
              <p>
                You are about to <strong>remove</strong> combination blocking for the following outcomes:
              </p>
              <CombinationBet tableOnly={true} />
              <div className="form-wrapper">
                <h4>Select Channel(s)</h4>
                <div className="blocktype-channels">
                  {channels.map(channel => {
                    return (
                      <div className="channel">
                        <input
                          type="checkbox"
                          name="blocking-channels"
                          value={Number(channel.id)}
                          onChange={this._setBlockingChannels}
                          checked={selectedChannels.indexOf(channel.id) !== -1 ? true : false}
                        />
                        <label>{channel.description}</label>
                      </div>
                    )
                  })}
                </div>
              </div>
              <p>Please confirm, If you wish to proceed.</p>
            </div>
          )}
        </div>
        <div className="button-group modal-controls">
          <div className="button-group-merged fleft">
            <button
              className="btn btn-action"
              onClick={this._backBlockingRuleModal}
              disabled={page === 1 ? true : false}
            >
              Back
            </button>
            <button
              className="btn btn-action"
              onClick={this._nextBlockingRuleModal}
              disabled={page === 2 ? true : blockType && page === 1 ? false : true}
            >
              Next
            </button>
          </div>
          <div className="button-group-merged fright">
            <button className="btn btn-action" onClick={this._closeBlockingRuleModal}>
              Cancel
            </button>
            <button
              className="btn btn-action btn-primary"
              onClick={this._confirmBlockingRule}
              disabled={blockType && page === 2 ? false : true}
            >
              Confirm
            </button>
          </div>
        </div>
      </ModalWindow>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BlockingRuleModal)

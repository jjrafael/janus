import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import appNames from 'constants/appNames'
import { useApp, fetchAppPermissions } from 'actions/apps'
import { startupApp } from 'actions/startup'
import constants from './constants'
import Header from './Header'
import Main from './Main'

const mapStateToProps = state => {
  return {
    startup: state.startup,
    user: state.user.details,
    isFetchingAppPermissions: state.apps.isFetchingAppPermissions,
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      startupApp,
      useApp,
      fetchAppPermissions,
    },
    dispatch
  )
}

class CombiRiskManager extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    this.props.fetchAppPermissions(this.props.user.id, constants.APPLICATION_ID)
    this.props.startupApp(appNames.COMBI_RISK_MANAGER)
    this.props.useApp(this.props.user.id, constants.APPLICATION_ID)
  }

  _renderLoadingIndicator() {
    return (
      <div className="loading tcenter">
        <i className="phxico phx-spinner phx-spin" />
        <h3>Loading {appNames.COMBI_RISK_MANAGER}</h3>
      </div>
    )
  }

  render() {
    const { startup, user, isFetchingAppPermissions } = this.props
    const isAppStartingUp = app && app.isStartingUp
    if (!startup.apps[appNames.COMBI_RISK_MANAGER] || isAppStartingUp || isFetchingAppPermissions) {
      return this._renderLoadingIndicator()
    }
    return (
      <div id="combi-risk-manager">
        <Header />
        <section className="page-container">
          <Main />
        </section>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CombiRiskManager)

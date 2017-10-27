import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { getExpi } from './actions'

const mapStateToProps = state => {
  return {
    //external props to include on this component
    expi: state.jjAppReducer.expi,
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      //actions
      getExpi,
    },
    dispatch
  )
}

class JJApp extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      //internal states
    }
  }

  componentWillMount() {
    //execute after the component loaded
    this.props.getExpi()
  }

  render() {
    const { expi } = this.props
    return <div id="jj-container">{expi.map((item, i) => <span>{item.years}</span>)}</div>
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(JJApp)

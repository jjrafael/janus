import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { getExpi } from './actions'

const mapStateToProps = state => {
  return {
    //external props to include on this component
    expi: state.nucleusReducer.expi,
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

class Nucleus extends React.Component {
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
    return <div id="main-container">{expi.map((item, i) => <span>{item.years}</span>)}</div>
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Nucleus)

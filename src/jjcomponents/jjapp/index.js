import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

const mapStateToProps = state => {
  return {
    //external props to include on this component
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      //actions
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

  componentDidMount() {
    //execute after the component loaded
  }

  render() {
    return <div id="jj-container">WOWOWOWOWOWOWOOWBEH</div>
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(JJApp)

import React from 'react'
import { Router, Route, IndexRoute, IndexRedirect } from 'react-router'
import { history } from './store.js'
import Lobby from './containers/Lobby/'
import Login from './containers/Login'
import EnsureLoggedInContainer from './containers/EnsureLoggedInContainer'
import CombiRiskManager from './containersV2/CombiRiskManager'
import JJApp from './jjcomponents/jjapp'
import NotFound from './containers/NotFound'
import ToastContainer from './components/toastr/index'

//TODO: FIX ROUTING
const router = (
  <div className="app-phoenix">
    <Router onUpdate={() => window.scrollTo(0, 0)} history={history}>
      <Route path="/login" component={Login} />
      <Route component={EnsureLoggedInContainer}>
        <Route path="/" component={Lobby} />
        <Route path="/combination-risk-manager" component={CombiRiskManager} />
        <Route path="/jj" component={JJApp} />
        <Route path="*" component={NotFound} />
      </Route>
    </Router>
    <ToastContainer />
  </div>
)

// export
export { router }

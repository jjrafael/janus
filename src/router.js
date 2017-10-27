import React from 'react'
import { Router, Route, IndexRoute, IndexRedirect } from 'react-router'
import { history } from './store.js'
import Nucleus from './components/nucleus'
import NotFound from './components/NotFound'
import ToastContainer from './components/toastr/index'

//TODO: FIX ROUTING
const router = (
  <div className="app-phoenix">
    <Router onUpdate={() => window.scrollTo(0, 0)} history={history}>
      <Route path="/" component={Nucleus} />
      <Route path="*" component={NotFound} />
    </Router>
    <ToastContainer />
  </div>
)

// export
export { router }

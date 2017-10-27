import { createStore, applyMiddleware, compose } from 'redux'
import { hashHistory } from 'react-router'
import { syncHistoryWithStore, routerMiddleware } from 'react-router-redux'
import createSagaMiddleware from 'redux-saga'
import createLogger from 'redux-logger'
import { reducers } from './reducers/jjapp'
import { sagas } from './sagas/jjapp'
import React from 'react'

// add the middlewares
let middlewares = []

// add the router middleware
middlewares.push(routerMiddleware(hashHistory))

// add the saga middleware
const sagaMiddleware = createSagaMiddleware()
middlewares.push(sagaMiddleware)

// add the redux logger
const logger = createLogger({ collapsed: true })
if (process.env.NODE_ENV !== 'production') {
	middlewares.push(logger)
}

// apply the middleware
let middleware = applyMiddleware(...middlewares)

// add the redux dev tools
if (process.env.NODE_ENV !== 'production' && window.devToolsExtension) {
	middleware = compose(middleware, window.devToolsExtension())
}

// create the store
const store = createStore(reducers, middleware)
const history = syncHistoryWithStore(hashHistory, store)
sagaMiddleware.run(sagas)

// export
export { store, history }

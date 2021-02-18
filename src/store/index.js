import { createStore, applyMiddleware, compose } from 'redux'
import AppReducer from './reducer'
import thunk from 'redux-thunk'

// 增强函数
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({}) :compose

const enhancer = composeEnhancers(applyMiddleware(thunk))

let store = createStore(
    AppReducer,
    enhancer
)

export default store
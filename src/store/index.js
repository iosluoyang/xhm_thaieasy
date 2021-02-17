import { createStore } from 'redux'
import AppReducer from './reducer'

let store = createStore(AppReducer)

export default store
// import { legacy_createStore as createStore } from "redux"
// import rootReducer from "./rootReducer"
// const rootstore = createStore(rootReducer)


// redux-toolkit will not use rootAction.js and Redudcer.js
import { configureStore} from '@reduxjs/toolkit'
import adminslice from './adminslice';
import toolslice from './toolslice';


const rootstore = configureStore({
    reducer:{
        admin: adminslice.reducer,
        tool: toolslice.reducer
    }
})


export default rootstore;
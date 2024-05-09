// const INITIAL_STATE = {
//     type: 'default',
//     status: false
// }


// const toolReducer = (state = INITIAL_STATE, action) => {
//     switch (action.type) {
//         case 'tool/settype':
//             return {
//                 ...state,
//                 type: action.payload
//             }
//         case 'tool/setstatus':
//             return {
//                 ...state,
//                 status: action.payload
//             }
//         default:
//             return state
//     }
// }
// export default toolReducer;
import { createSlice } from "@reduxjs/toolkit";

export default createSlice({
    name:'tool',
    initialState:{
        type: 'default',
        status: false,
    },
    reducers:{
        settype: (state,action) =>{
                state.type = action.payload;
        },// type: 'tool/settype'
        setstatus: (state,action) =>{
                state.status =  action.payload;
        }
    }
})





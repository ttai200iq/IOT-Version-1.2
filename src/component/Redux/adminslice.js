// const INITIAL_STATE = {
//     user:'unknown',
//     lang:'vi',
//     status: false
// }


// const adminReducer = (state = INITIAL_STATE, action) => {
//     switch (action.type) {
//         case 'admin/setuser':
//             return {
//                 ...state,
//                 user: action.payload
//             }
//         case 'admin/setlang':
//             return {
//                 ...state,
//                 lang: action.payload
//             }


//         case 'admin/setstatus':
//             return {
//                 ...state,
//                 status: action.payload
//             }
//         default:
//             return state
//     }
// }

// export default adminReducer;

import { createSlice } from "@reduxjs/toolkit";

export default createSlice({
    name: 'admin',
    initialState: {
        manager:'',
        user: '',
        admin:'',
        username:'',
        mail:'',
        lang: 'vi',
        type:'user',
        token:'',
        inf:"default",
        menu:false,
        search:false,
        status: false
    },
    reducers: {
      
        setmanager: (state, action) => {
            state.manager = action.payload;
        },// type: 'admin/setuser'
        setuser: (state, action) => {
            state.user = action.payload;
        },// type: 'admin/setuser'
        setusername: (state, action) => {
            state.username = action.payload;
        },
        setmail: (state, action) => {
            state.mail = action.payload;
        },
        setlang: (state, action) => {
            state.lang = action.payload;
        },// type: 'admin/setuser'
        settype: (state, action) => {
            state.type = action.payload;
        },
        setadmin: (state, action) => {
            state.admin = action.payload;
        },
        settoken: (state, action) => {
            state.token = action.payload;
        },
        setinf: (state, action) => {
            state.inf = action.payload;
        },
        setmenu: (state, action) => {
            state.menu = action.payload;
        },
        setsearch: (state, action) => {
            state.search = action.payload;
        },
        setstatus: (state, action) => {
            state.status = action.payload;
        }
    }
})


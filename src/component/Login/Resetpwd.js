import React, { useContext, useEffect, useState } from "react";
import "./login.scss"
import { useIntl } from 'react-intl';
import axios from "axios";
import { host } from "../constant";
import { AlertContext } from "../Context/AlertContext";
import { action } from "./Action";
import { useDispatch } from "react-redux";
import adminslice from "../Redux/adminslice";
import { Link } from "react-router-dom";
import { loginState } from "../../App";

//import Reducer,{INITSTATE} from "./Reducer";
//import Logger from "../Logger";

export default function Pwd() {
    const dataLang = useIntl();
    const [mail, setMail] = useState('');
    const [pass, setPass] = useState('');
    const [authpass, setAuthpass] = useState('');
    //const [repass,setRepass] =useState('');
    //const [mail,setMail] =useState('');
    //const {envDispatch} = useContext(EnvContext);
    const { alertDispatch } = useContext(AlertContext);
    const [savepwd, setSavepwd] = useState(false);
    const rootDispatch = useDispatch()
    const [showpass, setShowpass] = useState(false);
    const [showauthpass, setShowauthpass] = useState(false);

    useEffect(function () {

        // console.log(state.register)
        // var userLang = navigator.language || navigator.userLanguage; 
        // if(userLang === 'vi-VN'){
        rootDispatch(adminslice.actions.setlang('vi'))
        //envDispatch({type:'LANG',payload:'vi'})
        // }else{
        //     dispatch({type:'LANG',payload:'en'})
        // }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    const handlePwd = function (e) {
        e.preventDefault();



        if (pass === authpass) {

            axios.post(host.AUTH + '/resetPassword', { mail: mail, password: authpass }, { withCredentials: true }).then(
                function (res) {

                    // console.log(res.data)
                    if (res.data.status) {

                        alertDispatch(action('LOAD_CONTENT', { content: dataLang.formatMessage({ id: "alert_36" }), show: 'block' }))
                    } else {
                        if (res.data.number === 3) {
                            alertDispatch(action('LOAD_CONTENT', { content: dataLang.formatMessage({ id: "alert_3" }), show: 'block' }))
                        } else {

                            alertDispatch(action('LOAD_CONTENT', { content: dataLang.formatMessage({ id: "alert_39" }), show: 'block' }))
                        }
                    }

                })
        } else {
            alertDispatch(action('LOAD_CONTENT', { content: dataLang.formatMessage({ id: "alert_35" }), show: 'block' }))
        }


    }



    return (

        <div className="DAT_Login">


            <form className="DAT_Login_Form" onSubmit={handlePwd}>
                <p>DAT GROUP</p>
                {/* <div className="DAT_Login_Form-input">
                    <p><i className="fa fa-user icon" /></p>
                    <input type="text" placeholder={dataLang.formatMessage({ id: 'username' })} required minLength="4" value={user} onChange={(e) => { setUser(e.target.value.trim().toLocaleLowerCase()) }} autoComplete="on" />
                </div>
                <div className="DAT_Login_Form-input">
                    <p><i className="fa fa-key icon" /></p>
                    <input type="password" placeholder={dataLang.formatMessage({ id: 'password' })} required minLength="4" value={pass} onChange={(e) => { setPass(e.target.value.trim()) }} autoComplete="on" />
                </div> */}


                <div className="DAT_Login_Form-input">
                    <p><ion-icon name="mail-open-outline"></ion-icon></p>
                    <input type="email" placeholder={dataLang.formatMessage({ id: 'mail' })} required minLength="4" value={mail} onChange={(e) => { setMail(e.target.value.trim()) }} autoComplete="on" />
                </div>

                <div className="DAT_Login_Form-input">
                    <p><ion-icon name="key-outline"></ion-icon></p>
                    <input type={(showpass) ? "text" : "password"} placeholder={dataLang.formatMessage({ id: 'newpass' })} required minLength="4" value={pass} onChange={(e) => { setPass(e.target.value.trim()) }} autoComplete="on" />
                    <p style={{ cursor: "pointer" }} onClick={() => setShowpass(!showpass)}> {(showpass) ? <ion-icon name="eye-outline"></ion-icon> : <ion-icon name="eye-off-outline"></ion-icon>}</p>
                </div>

                <div className="DAT_Login_Form-input">
                    <p><ion-icon name="keypad-outline"></ion-icon></p>
                    <input type={(showauthpass) ? "text" : "password"} placeholder={dataLang.formatMessage({ id: 'aupass' })} required minLength="4" value={authpass} onChange={(e) => { setAuthpass(e.target.value.trim()) }} autoComplete="on" />
                    <p style={{ cursor: "pointer" }} onClick={() => setShowauthpass(!showauthpass)}> {(showauthpass) ? <ion-icon name="eye-outline"></ion-icon> : <ion-icon name="eye-off-outline"></ion-icon>}</p>
                </div>


                <button>Xác nhận</button>

                <div style={{ width: '100%', marginTop: '10px', color: 'white', cursor: 'pointer', textAlign: 'center' }} onClick={() => loginState.value = 'Login'}>Đăng nhập</div>

            </form>


        </div>



    );

}


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

export default function Login() {
    const dataLang = useIntl();
    const [user, setUser] = useState('');
    const [pass, setPass] = useState('');
    //const [repass,setRepass] =useState('');
    //const [mail,setMail] =useState('');
    //const {envDispatch} = useContext(EnvContext);
    const { alertDispatch } = useContext(AlertContext);
    const [savepwd, setSavepwd] = useState(false);
    const rootDispatch = useDispatch()


    const  [showpass,setShowpass] = useState(false);
  

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


    const handleLogin = function (e) {
        e.preventDefault();




        axios.post((savepwd) ? host.AUTH + '/Login' : host.AUTH + '/Login2', { username: user, password: pass }, { withCredentials: true }).then(
            function (res) {

                //console.log(res.data)
                
                if (res.data.status) {
                    if (savepwd) {
                        localStorage.setItem('token', JSON.stringify(res.data.accessToken))
                    } else {
                        sessionStorage.setItem('token', JSON.stringify(res.data.accessToken))
                    }
                    // localStorage.setItem('pageDefault', JSON.stringify({status:false}))
                    rootDispatch(adminslice.actions.setstatus(res.data.status))
                    rootDispatch(adminslice.actions.setuser(res.data.user))
                } else {
                    localStorage.clear();
                    sessionStorage.clear();
                    alertDispatch(action('LOAD_CONTENT', { content: dataLang.formatMessage({ id: "alert_29" }), show: 'block' }))

                }

            })


    }



    return (

        <div className="DAT_Login">


            <form className="DAT_Login_Form" onSubmit={handleLogin}>
                <p>Đăng nhập</p>
                <div className="DAT_Login_Form-input">
                    <p><ion-icon name="person-outline"></ion-icon></p>
                    <input type="text" placeholder={dataLang.formatMessage({ id: 'username' })} required minLength="4" value={user} onChange={(e) => { setUser(e.target.value.trim().toLocaleLowerCase()) }} autoComplete="on" />
                </div>
                <div className="DAT_Login_Form-input">
                    <p><ion-icon name="key-outline"></ion-icon></p>
                    <input type={(showpass)?"text":"password"} placeholder={dataLang.formatMessage({ id: 'password' })} required minLength="4" value={pass} onChange={(e) => { setPass(e.target.value.trim()) }} autoComplete="on" />
                    <p style={{cursor:"pointer"}} onClick={() => setShowpass(!showpass)}> {(showpass)?<ion-icon name="eye-outline"></ion-icon>:<ion-icon name="eye-off-outline"></ion-icon>}</p>
                </div>

                <div className="DAT_Login_Form-box">
                    <input
                        id="savepwd"
                        type="checkbox"
                        checked={savepwd}
                        onChange={e => setSavepwd(e.target.checked)}
                    />
                    <label htmlFor="savepwd" />
                    Lưu đăng nhập
                </div>

                <button>{dataLang.formatMessage({ id: 'login' })}</button>

                    <div style={{ width: '100%', marginTop: '10px', color: 'white', cursor: 'pointer', textAlign: 'center' }} onClick={()=> loginState.value = 'Pwd'}>Bạn quên mật khẩu?</div>

            </form>


        </div>



    );

}


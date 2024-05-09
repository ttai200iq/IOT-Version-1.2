import React, { Suspense, useContext, useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import axios from "axios";
import "./index.scss";
import Alert from "./component/Alert/Alert";
import { host } from "./component/constant";
import adminslice from "./component/Redux/adminslice";
import { useDispatch, useSelector } from "react-redux";

import Login from './component/Login/login';
import Pwd from "./component/Login/Resetpwd";
import MenuTop from "./component/MenuTop/MenuTop";
import SlideBar from "./component/Slidebar/SlideBar";
import { PacmanLoader, ClockLoader } from "react-spinners";
import { signal } from "@preact/signals-react";
import Default from "./component/Default/Default";
import Verify from "./component/Verify/Verify";
import { io } from "socket.io-client";
import { useLayoutEffect } from "react";
import { overview } from "./component/LibOverview/Tooloverview";

const View = React.lazy(() => import('./component/View/View'));
const Auto = React.lazy(() => import('./component/Control/Auto'));
const Sol = React.lazy(() => import('./component/Control/Sol'));
const Elev = React.lazy(() => import('./component/Control/Elev'));
const Ups = React.lazy(() => import('./component/Control/Ups'));

const Map = React.lazy(() => import('./component/Map/Map'));
const Logs = React.lazy(() => import('./component/Logs/Logs'));
const Report = React.lazy(() => import('./component/Report/Report'));
const Error = React.lazy(() => import('./component/Error/Error'));
const Storage = React.lazy(() => import('./component/Storage/Storage'));
const Project = React.lazy(() => import('./component/Project/Project'));
const User = React.lazy(() => import('./component/User/User'));
const Account = React.lazy(() => import('./component/Account/Account'));
const Contact = React.lazy(() => import('./component/Contact/Contact'));
const Export = React.lazy(() => import('./component/Export/Export'));

// const Contact = React.lazy(() => import('./component/Contact/Contact'));

export const loginState = signal('Login');
export const pageDefault = signal({ status: false });
export const list = signal([])
export const socket = signal(io.connect(host.DEVICE))
export const view = signal({ type: 'single', id: 'none', tab: '0' });

export default function App() {
    const [loading, setLoading] = useState(true);
    const user = useSelector((state) => state.admin.user)
    const manager = useSelector((state) => state.admin.manager)
    const status = useSelector((state) => state.admin.status)
    const type = useSelector((state) => state.admin.type)
    const showdevice = useSelector((state) => state.tool.status)
    const rootDispatch = useDispatch()



    // const navigate = useNavigate()
    // const {inf,menu,envDispatch} = useContext(EnvContext);
    //const {data, inf,search,envDispatch} =useContext(EnvContext);

    //const [isverify,setIsverify] = usedata('');


    //const isInStandaloneMode = () => (window.matchMedia('(display-mode: fullscreen)').matches) || (window.navigator.fullscreen) || document.referrer.includes('android-app://');



    useLayoutEffect(() => {

        // pageDefault.value = JSON.parse(localStorage?.getItem('pageDefault')) || { status: false }

        if (window.location.pathname !== '/Verify') {

            const Token = async () => {
                await axios.get(host.DEVICE + "/getToken", { secure: true, reconnect: true }).then(
                    async function (res) {

                        console.log("Token", res.data[0])
                        rootDispatch(adminslice.actions.settoken(res.data[0].token))
                        //envDispatch(action('TOKEN',res.data[0].token));




                    })
            }


            const checkAuth = async () => {
                await axios.get(host.AUTH + window.location.pathname, {

                    headers: {
                        token: JSON.parse(localStorage.getItem('token')) || JSON.parse(sessionStorage.getItem('token'))
                    },
                    withCredentials: true
                }
                ).then(
                    function (res) {

                        if (res.data.status) {
                            console.log(res.data)
                            rootDispatch(adminslice.actions.setstatus(res.data.status))
                            rootDispatch(adminslice.actions.setuser(res.data.user))
                        } else {
                            setLoading(false)
                        }
                    }
                )
            }


            const userInfor = async () => {
                await axios.post(host.DEVICE + "/getInf",

                    { username: user },
                    { withCredentials: true }).then(
                        function (res) {
                            //console.log(res.data)
                            rootDispatch(adminslice.actions.setmanager(res.data.manager))
                            rootDispatch(adminslice.actions.settype(res.data.type))
                            rootDispatch(adminslice.actions.setadmin(res.data.admin))
                            rootDispatch(adminslice.actions.setlang(res.data.lang))
                            rootDispatch(adminslice.actions.setmail(res.data.mail))
                            rootDispatch(adminslice.actions.setusername(res.data.username))
                            setLoading(false)
                        })
            }

            const getPage = async () => {
                await axios.post(host.DEVICE + "/getDefault", { user: user }, { secure: true, reconnect: true }).then(
                    function (res) {
                        //console.log(res.data)
                        if (res.data.status) {
                            pageDefault.value = res.data.data
                        } else {
                            pageDefault.value = { status: false }
                        }
                    }
                )
            }

            const getAllproject = async () => {
                //console.log(user)
                await axios.post(host.DEVICE + "/getProjectID", { username: user }, { secure: true, reconnect: true }).then(
                    async function (res) {
                        list.value = []
                        //console.log("Project", res.data)
                        if (res.data.status) {
                            res.data.data.map((data) => {
                                list.value = [...list.value, { type: 'project', id: data.projectid, code: data.code }]
                            })
                        }
                        await axios.post(host.DEVICE + "/getlistDeviceID", { username: user }, { secure: true, reconnect: true }).then(
                            function (res) {

                                //console.log("Device", res.data)
                                if (res.data.status) {
                                    res.data.data.map((data) => {
                                        list.value = [...list.value, { type: 'device', id: data.deviceid, code: data.code }]
                                    })

                                }
                                //console.log("List", list.value)
                            })

                    })
            }



            checkAuth();
            if (status) {
                Token();
                userInfor();
                getAllproject();
                getPage();
            }


        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [status]);


    const handleclick = (event) => {
        rootDispatch(adminslice.actions.setinf('default'))
        rootDispatch(adminslice.actions.setsearch(false))

    }


    return (
        <>


            <Router>
                <Alert />
                {(loading)
                    ? (window.location.pathname === '/Verify') ? <Verify /> : <div className="DAT_loading"><PacmanLoader color='#007bff' size={40} loading={loading} /></div>
                    : <>{(status)
                        ? <>
                            {showdevice || overview.value
                                ? <></>
                                : <MenuTop user={user} />
                            }
                            <div className="DAT_content" id="DAT_content" >
                                <SlideBar user={user}></SlideBar>
                                {(type !== "user")
                                    ? <>
                                        <div className="DAT_content_view" onClick={(event) => { handleclick(event) }}>


                                            <Routes>
                                                <Route exact path='/' element={<Suspense fallback={<div className="DAT_loading"><ClockLoader color='#007bff' size={50} loading={true} /></div>}><View username={manager} /></Suspense>} />
                                                <Route path='/Auto' element={<Suspense fallback={<div className="DAT_loading"><ClockLoader color='#007bff' size={50} loading={true} /></div>}><Auto username={manager} /></Suspense>} />
                                                <Route path='/Solar' element={<Suspense fallback={<div className="DAT_loading"><ClockLoader color='#007bff' size={50} loading={true} /></div>}><Sol username={manager} /></Suspense>} />
                                                <Route path='/Elev' element={<Suspense fallback={<div className="DAT_loading"><ClockLoader color='#007bff' size={50} loading={true} /></div>}><Elev username={manager} /></Suspense>} />
                                                <Route path='/UPS' element={<Suspense fallback={<div className="DAT_loading"><ClockLoader color='#007bff' size={40} loading={true} /></div>}><Ups username={manager} /></Suspense>} />

                                                {/* <Route path='/Map' element={<Suspense fallback={<div className="DAT_loading"><ClockLoader color='#007bff' size={50} loading={true} /></div>}><Map username={manager} /></Suspense>} /> */}
                                                <Route path='/log' element={<Suspense fallback={<div className="DAT_loading" ><ClockLoader color='#007bff' size={50} loading={true} /></div>}><Logs username={manager} /></Suspense>} />
                                                <Route path='/Report' element={<Suspense fallback={<div className="DAT_loading" ><ClockLoader color='#007bff' size={50} loading={true} /></div>}><Report username={manager} /></Suspense>} />
                                                <Route path='/Error' element={<Suspense fallback={<div className="DAT_loading" ><ClockLoader color='#007bff' size={50} loading={true} /></div>}><Error username={manager} /></Suspense>} />
                                                <Route path='/Device' element={<Suspense fallback={<div className="DAT_loading" ><ClockLoader color='#007bff' size={50} loading={true} /></div>}><Storage username={manager} /></Suspense>} />
                                                <Route path='/Project' element={<Suspense fallback={<div className="DAT_loading" ><ClockLoader color='#007bff' size={50} loading={true} /></div>}><Project username={manager} /></Suspense>} />
                                                <Route path='/User' element={<Suspense fallback={<div className="DAT_loading" ><ClockLoader color='#007bff' size={50} loading={true} /></div>}><User username={manager} /></Suspense>} />
                                                <Route path='/Account' element={<Suspense fallback={<div className="DAT_loading" ><ClockLoader color='#007bff' size={50} loading={true} /></div>}><Account username={manager} /></Suspense>} />
                                                <Route path='/Export' element={<Suspense fallback={<div className="DAT_loading" ><ClockLoader color='#007bff' size={50} loading={true} /></div>}><Export username={manager} /></Suspense>} />
                                                <Route path='/Contact' element={<Suspense fallback={<div className="DAT_loading" ><ClockLoader color='#007bff' size={50} loading={true} /></div>}><Contact username={manager} /></Suspense>} />
                                                <Route path='/Login' element={<Navigate to="/" />} />
                                                <Route path='/Logout' element={<Navigate to="/Login" />} />
                                            </Routes>
                                        </div>



                                    </>
                                    : <>

                                        {(pageDefault.value.status)
                                            ? <div className="DAT_content_view" onClick={(event) => { handleclick(event) }}>


                                                <Routes>
                                                    <Route exact path='/' element={<Suspense fallback={<div className="DAT_loading"><ClockLoader color='#007bff' size={50} loading={true} /></div>}><View username={manager} /></Suspense>} />
                                                    <Route path='/Auto' element={<Suspense fallback={<div className="DAT_loading"><ClockLoader color='#007bff' size={50} loading={true} /></div>}><Auto username={manager} /></Suspense>} />
                                                    <Route path='/Solar' element={<Suspense fallback={<div className="DAT_loading"><ClockLoader color='#007bff' size={50} loading={true} /></div>}><Sol username={manager} /></Suspense>} />
                                                    <Route path='/Elev' element={<Suspense fallback={<div className="DAT_loading"><ClockLoader color='#007bff' size={50} loading={true} /></div>}><Elev username={manager} /></Suspense>} />
                                                    <Route path='/UPS' element={<Suspense fallback={<div className="DAT_loading"><ClockLoader color='#007bff' size={40} loading={true} /></div>}><Ups username={manager} /></Suspense>} />

                                                    {/* <Route path='/Map' element={<Suspense fallback={<div className="DAT_loading"><ClockLoader color='#007bff' size={50} loading={true} /></div>}><Map username={manager} /></Suspense>} /> */}
                                                    <Route path='/log' element={<Suspense fallback={<div className="DAT_loading" ><ClockLoader color='#007bff' size={50} loading={true} /></div>}><Logs username={manager} /></Suspense>} />
                                                    <Route path='/Report' element={<Suspense fallback={<div className="DAT_loading" ><ClockLoader color='#007bff' size={50} loading={true} /></div>}><Report username={manager} /></Suspense>} />
                                                    <Route path='/Error' element={<Suspense fallback={<div className="DAT_loading" ><ClockLoader color='#007bff' size={50} loading={true} /></div>}><Error username={manager} /></Suspense>} />
                                                    <Route path='/Device' element={<Suspense fallback={<div className="DAT_loading" ><ClockLoader color='#007bff' size={50} loading={true} /></div>}><Storage username={manager} /></Suspense>} />
                                                    <Route path='/Project' element={<Suspense fallback={<div className="DAT_loading" ><ClockLoader color='#007bff' size={50} loading={true} /></div>}><Project username={manager} /></Suspense>} />
                                                    <Route path='/User' element={<Suspense fallback={<div className="DAT_loading" ><ClockLoader color='#007bff' size={50} loading={true} /></div>}><User username={manager} /></Suspense>} />
                                                    <Route path='/Account' element={<Suspense fallback={<div className="DAT_loading" ><ClockLoader color='#007bff' size={50} loading={true} /></div>}><Account username={manager} /></Suspense>} />
                                                    <Route path='/Export' element={<Suspense fallback={<div className="DAT_loading" ><ClockLoader color='#007bff' size={50} loading={true} /></div>}><Export username={manager} /></Suspense>} />
                                                    <Route path='/Contact' element={<Suspense fallback={<div className="DAT_loading" ><ClockLoader color='#007bff' size={50} loading={true} /></div>}><Contact username={manager} /></Suspense>} />
                                                    <Route path='/Login' element={<Navigate to="/" />} />
                                                    <Route path='/Logout' element={<Navigate to="/Login" />} />
                                                </Routes>
                                            </div>
                                            : <Default username={manager} />
                                        }


                                    </>


                                }

                            </div>
                        </>
                        : (loginState.value === 'Login') ? <Login /> : <Pwd />
                    }
                    </>
                }





            </Router>
        </>
    );


}


import React, { useContext, useEffect, useState } from "react";
import "./MenuTop.scss";
import { Link, useNavigate } from 'react-router-dom';
import { useIntl } from 'react-intl';
import axios from "axios";
import { host } from "../constant";
import { SettingContext } from "../Context/SettingContext";
import { AlertContext } from "../Context/AlertContext";
import { action } from "../Control/Action";
import { useDispatch, useSelector } from "react-redux";
//import { rootAction } from "../Redux/rootAction"; // using when use redux core
import adminslice from "../Redux/adminslice";
import { signal } from "@preact/signals-react";
import { time, date, state } from "../Logs/Logs";
import { socket } from '../../App'
import { useLayoutEffect } from "react";

export const notifcount = signal(0)
export const notif = signal([])
export const logo = signal('')
export const avatar = signal('')

export const searchmoblile = signal(false)



export default function MenuTop(props) {

    const navigate = useNavigate();
    const lang = useIntl();
    //const { search, inf, menu, envDispatch } = useContext(EnvContext);
    const { lasttab, currentID, settingDispatch } = useContext(SettingContext)
    const { alertDispatch } = useContext(AlertContext);

    const [status, setStatus] = useState(false)
    const [notify, setNotify] = useState(false)

    const rootDispatch = useDispatch()
    const inf = useSelector((state) => state.admin.inf)
    const menu = useSelector((state) => state.admin.menu)
    const search = useSelector((state) => state.admin.search)
    const username = useSelector((state) => state.admin.username)
    const mail = useSelector((state) => state.admin.mail)
    const type = useSelector((state) => state.admin.type)
    const manager = useSelector((state) => state.admin.manager)
    const admin = useSelector((state) => state.admin.admin)
    //const [nofcount, setNofcount] = useState(0);
    //const socket_client = useRef(io(host.DEVICE));




    const sms = [
        { id: '1', tit: 'Thiết bị: I0622B067116', text: 'Phát hiện sự cố, mã sự cố [500]', time: '11/10/2023 08:33:12' },
        { id: '2', tit: 'Thiết bị: I0622B067116', text: 'Phát hiện sự cố, mã sự cố [1000]', time: '11/09/2023 08:33:12' },
        { id: '3', tit: 'Thiết bị: I0622B067116', text: 'Phát hiện sự cố. mã sự cố [1500]', time: '11/08/2023 08:33:12' },
    ]

    useLayoutEffect(() => {

        axios.post(host.DEVICE + "/getLogo", { user: props.user }, { credential: true }, { headers: { "Content-Type": "multipart/form-data" }, })
            .then((res) => {
                //console.log(res.data)
                if (res.data.status) {
                    logo.value = res.data.data
                }
            })

        axios.post(host.DEVICE + "/getAvatar", { user: props.user }, { credential: true }, { headers: { "Content-Type": "multipart/form-data" }, })
            .then((res) => {
                //console.log(res.data)
                if (res.data.status) {
                    avatar.value = res.data.data
                }
            })
    }, [])





    useLayoutEffect(() => {
        // console.log(manager)
        //const user = (type === 'user' || type === 'mainuser') ? admin : manager
        socket.value.on("Err/" + manager, function (data) {
            // console.log(data)
            notif.value.unshift({ id: notif.value.length + 1, status: 1, type: 'error', tit: data.deviceid + "[" + data.code + "]", content: 'content1', date: data.date, time: data.time })
            var notif_ = notif.value.filter((item) => {
                if (item.status) {
                    return item
                }
            })
            notifcount.value = notif_.length
        })

        axios.post(host.DEVICE + "/getNotif", { user: manager }, { secure: true, reconnect: true }).then(
            (res) => {
                //console.log(res.data)
                notif.value = res.data
                var notif_ = notif.value.filter((item) => {
                    if (item.status) {
                        return item
                    }
                })

                notifcount.value = notif_.length

            }
        )
        return (() => {
            socket.value.off("Err/" + manager);
        })


    }, [manager])



    const handleModify = (event, type) => {

        const arr = event.currentTarget.id.split("_")
        //console.log(arr)
        if (arr[0] === 'MOUSE') {

            if (type) {
                //console.log('Enter',event.currentTarget.id)
                setNotify('Notify_' + arr[1])
            } else {
                //console.log('Leave',event.currentTarget.id)
                setNotify('Nof_ERR')
            }
        } else {
            if (arr[2] === 'error') {


                axios.post(host.DEVICE + "/updateNotif", { status: 0, id: arr[1], user: manager }, { secure: true, reconnect: true }).then(
                    (res) => {
                        // console.log(res.data)
                        if (res.data, status) {
                            const i = notif.value.findIndex((data) => data.id == arr[1])
                            notif.value[i].status = 0
                            var notif_ = notif.value.filter((item) => {
                                if (item.status) {
                                    return item
                                }
                            })

                            notifcount.value = notif_.length


                            date.value = notif.value[i].date
                            time.value = notif.value[i].time
                            state.value = 1

                            navigate('/Log');
                            //window.location.reload();
                        }


                    }
                )




            }
        }




    }


    const handleDelete = (event) => {
        // console.log(event.currentTarget.id)
        const arr = event.currentTarget.id.split("_");


        axios.post(host.DEVICE + "/removeNotif", { id: arr[1], user: manager }, { secure: true, reconnect: true }).then(
            (res) => {
                if (res.data) {
                    notif.value = notif.value.filter((item) => item.id != arr[1])
                    var notif_ = notif.value.filter((item) => {
                        if (item.status) {
                            return item
                        }
                    })
                    //console.log(notif_)
                    notifcount.value = notif_.length
                }


            }
        )


        // notif.value = notif.value.filter((item) => {
        //     item.id !== arr[1]
        // })
    }


    const getId = (event) => {
        const ID = event.currentTarget.id;
        if (ID === "DAT_menuaction") {

            if (menu) {
                //envDispatch({ type: 'MENU', payload: false })
                //envDispatch({ type: 'INF', payload: "default" })
                //envDispatch({ type: 'SEARCH', payload: false })
                rootDispatch(adminslice.actions.setmenu(false))
                rootDispatch(adminslice.actions.setinf("default"))
                rootDispatch(adminslice.actions.setsearch(false))

            } else {
                // envDispatch({ type: 'MENU', payload: true })
                // envDispatch({ type: 'INF', payload: "default" })
                // envDispatch({ type: 'SEARCH', payload: false })
                rootDispatch(adminslice.actions.setmenu(true))
                rootDispatch(adminslice.actions.setinf("default"))
                rootDispatch(adminslice.actions.setsearch(false))

            }
        }

    }

    const handeHead = (e) => {
        rootDispatch(adminslice.actions.setsearch(false))
        //envDispatch({ type: 'SEARCH', payload: false })
        const ID = e.currentTarget.id;

        if (status) {
            if (ID != inf) {
                //envDispatch({ type: 'INF', payload: ID })
                rootDispatch(adminslice.actions.setinf(ID))
                //rootDispatch(rootAction('tool/settype',ID))           // test for redux
                //rootDispatch(toolslice.actions.settype(ID))             // test for redux-toolkit

            } else {
                rootDispatch(adminslice.actions.setinf("default"))
                //envDispatch({ type: 'INF', payload: 'default' })
                setStatus(false)

                // rootDispatch(rootAction('tool/settype','default'))   // test for redux
                // rootDispatch(rootAction('admin/setstatus',false))    // test for redux
                //rootDispatch(toolslice.actions.settype('default'))      // test for redux-toolkit
                //rootDispatch(adminslice.actions.setstatus(false))       // test for redux
            }

        } else {
            setStatus(true)
            //envDispatch({ type: 'INF', payload: ID })
            rootDispatch(adminslice.actions.setinf(ID))
            // rootDispatch(rootAction('tool/settype',ID))              // test for redux
            // rootDispatch(rootAction('admin/setstatus',true))         // test for redux
            //rootDispatch(toolslice.actions.settype(ID))                 // test for redux-toolkit
            //rootDispatch(adminslice.actions.setstatus(true))           // test for redux-toolkit

        }


    }

    let logout = function () {



        //navigate('/Login');
        const setDefault = async () => {
            localStorage.clear();
            sessionStorage.clear();
            navigate('/Logout');
            window.location.reload();
            // await axios.post(host.DEVICE + '/setDefault',{user: props.user, page:{status:false} }, { withCredentials: true })
            //    .then(function (res) {
            //        console.log(res.data)
            //        localStorage.clear();
            //        sessionStorage.clear();
            //        navigate('/Logout');
            //        window.location.reload();
            //    })
        }

        setDefault();



    }

    const handleAdd = (event) => {

        let tab = parseInt(lasttab) + 1
        let name = String("Màn hình " + tab)
        settingDispatch({ type: "ADD_SCREEN", payload: { deviceid: currentID, tab: tab, name: name, data: { id: '0', width: '500', data: [] }, setting: {} } })
        settingDispatch({ type: "LOAD_LASTTAB", payload: tab })

        axios.post(host.DEVICE + "/addTabMD", { id: currentID, tab: tab, name: name, data: JSON.stringify({ id: '0', width: '500', data: [] }), setting: JSON.stringify({}) }, { secure: true, reconnect: true }).then(
            function (res) {
                //console.log(res.data.status)
                if (res.data.status) {
                    alertDispatch(action('LOAD_CONTENT', { content: lang.formatMessage({ id: "alert_7" }), show: 'block' }))
                } else {
                    alertDispatch(action('LOAD_CONTENT', { content: lang.formatMessage({ id: "alert_3" }), show: 'block' }))
                }

            })


    }


    const handleWindowResize = () => {
        if (window.innerWidth >= 900) {
            searchmoblile.value = true
        } else {
            searchmoblile.value = false
        }

    }



    useEffect(function () {
        window.addEventListener('resize', handleWindowResize);
        if (window.innerWidth >= 700) {
            searchmoblile.value = true
        } else {
            searchmoblile.value = false
        }
    }, []);


    const handleSearch = (e) => {
        if (search) {
        } else {
        }
    }

    const handleOpenSearch = (e) => {
        rootDispatch(adminslice.actions.setinf(false))
        //envDispatch({ type: 'INF', payload: false })
        if (search) {
            rootDispatch(adminslice.actions.setsearch(false))
            //envDispatch({ type: 'SEARCH', payload: false })
        } else {
            rootDispatch(adminslice.actions.setsearch(true))
            //envDispatch({ type: 'SEARCH', payload: true })
        }
    }

    return (
        <>


            <div className="DAT_Header">

                {(searchmoblile.value)
                    ? <div className="DAT_Header-menu" >
                        <button className="DAT_Header-menu-btn" id="DAT_menuaction" onClick={(event) => { getId(event) }}>
                            {/* <img src="/dat_icon/menu.png" alt="" style={{ height: "12px" }} /> */}
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" >
                                <line x1="3" y1="12" x2="21" y2="12"></line>
                                <line x1="3" y1="6" x2="21" y2="6"></line>
                                <line x1="3" y1="18" x2="21" y2="18">
                                </line>
                            </svg>
                        </button>
                    </div>
                    : <></>
                }



                <div className="DAT_Header-left">

                    <Link to="/" style={{ textDecoration: 'none' }}>
                        <div className="DAT_Header-left-logo" >
                            <img src={(logo.value === '') ? "/dat_icon/logo_DAT.png" : logo.value} alt="" style={{ height: "30px" }} />
                        </div>
                    </Link>


                </div>
                <div className="DAT_Header-center">

                    {/* {(searchmoblile.value)
                        ? <div className="DAT_Header-center-group">

                            <input type="text" id="DAT_searchdevice" placeholder="Tìm kiếm"></input>

                            <div className="DAT_Header-center-group-icon" onClick={(event) => { handleSearch(event) }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="11" cy="11" r="8"></circle>
                                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                </svg>
                            </div>


                        </div>
                        : <></>

                    } */}


                </div>
                <div className="DAT_Header-right">


                    <button className="DAT_Header-right-item"
                        id="notif"
                        onClick={(e) => { handeHead(e) }}
                    >
                        <ion-icon name="notifications-outline" ></ion-icon>
                        {(notifcount.value !== 0 && notifcount.value <= 10)
                            ? <span>{notifcount.value}</span>
                            : <></>
                        }

                        {(notifcount.value > 10)
                            ? <span>10+</span>
                            : <></>
                        }
                    </button >



                    {(currentID !== '' && (type === 'master' || type === 'admin'))
                        ?
                        <button className="DAT_Header-right-item" id="add_visual" onClick={(event) => { handleAdd(event) }}>
                            <ion-icon name="bag-add"></ion-icon>
                        </button >
                        : <></>
                    }


                    <button
                        className="DAT_Header-right-item"
                        id="user"
                        onClick={(e) => { handeHead(e) }}
                        style={{ backgroundColor: "rgba(159, 155, 155, 0.4)", overflow: "hidden" }}
                    >
                        <img src={avatar.value === '' ? "/dat_icon/user_manager.png" : avatar.value} alt="" />
                    </button>

                    {(searchmoblile.value)

                        ? <></>
                        :
                        <button className="DAT_Header-right-item" id="DAT_menuaction" onClick={(event) => { getId(event) }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="3" y1="12" x2="21" y2="12"></line>
                                <line x1="3" y1="6" x2="21" y2="6"></line>
                                <line x1="3" y1="18" x2="21" y2="18">
                                </line>
                            </svg>
                        </button>
                    }
                </div>

            </div>


            {(() => {
                switch (inf) {
                    case "user":
                        return (
                            <>
                                <div
                                    className="DAT_Acount"

                                >
                                    <div className="DAT_Acount_user">
                                        <div className="DAT_Acount_user_avatar">
                                            <img src={avatar.value === '' ? "/dat_icon/user_manager.png" : avatar.value} alt="" />
                                        </div>
                                        <div className="DAT_Acount_user_inf">
                                            <div className="DAT_Acount_user_inf-name">{username}</div>
                                            <div className="DAT_Acount_user_inf-mail">{mail}</div>
                                        </div>



                                    </div>
                                    <div className="DAT_Acount_line" ></div>
                                    <Link to="/Account" style={{ textDecoration: "none" }}>
                                        <div className="DAT_Acount_setting" >
                                            <p><ion-icon name="settings-outline"></ion-icon></p>
                                            <span>Tài khoản</span>
                                        </div>
                                    </Link>
                                    <div className="DAT_Acount_logout" onClick={logout}>
                                        <p><ion-icon name="log-out-outline"></ion-icon></p>
                                        <span>Đăng xuất</span>
                                    </div>
                                </div>

                            </>
                        )
                    case "notif":
                        return (
                            <>
                                <div
                                    className="DAT_Notification"
                                //style={(inf) ? { display: "block" } : { display: "none" }}
                                >
                                    {/* <Link to="/Notification" style={{ textDecoration: "none" }}> */}
                                    <div className="DAT_Notification_head">
                                        <ion-icon name="notifications-outline"></ion-icon>Thông báo
                                    </div>
                                    {/* </Link> */}
                                    <div className="DAT_Notification_content" >
                                        {notif.value.map((data, index) => {
                                            return (
                                                <div className="DAT_Notification_content_item" key={index} id={"MOUSE_" + data.id + "_" + data.type} onMouseEnter={e => handleModify(e, true)} onMouseLeave={e => handleModify(e, false)}>
                                                    <div className="DAT_Notification_content_item-group" id={"CLICK_" + data.id + "_" + data.type} onClick={e => handleModify(e)}>
                                                        <div className="DAT_Notification_content_item-group-icon" style={{ backgroundColor: (data.type === 'error') ? "rgb(255, 0, 0)" : "rgb(0, 180, 36)" }}>
                                                            {(data.type === 'error')
                                                                ? <ion-icon name="warning" />
                                                                : <ion-icon name="cloud-done-outline" />
                                                            }
                                                            {(data.status)
                                                                ? <span>Mới</span>
                                                                : <></>
                                                            }

                                                        </div>
                                                        <div className="DAT_Notification_content_item-group-data">
                                                            <div className="DAT_Notification_content_item-group-data-tit" >
                                                                <span style={{ color: "black" }}>{data.tit}:&nbsp;</span><span style={{ color: "gray" }}>{lang.formatMessage({ id: data.content })}</span>
                                                            </div>

                                                        </div>
                                                    </div>
                                                    <div className="DAT_Notification_content_item-time">{data.date} {data.time}</div>

                                                    {
                                                        (type === 'user')
                                                            ? <></>
                                                            : (notify === 'Notify_' + data.id)
                                                                ? <div className="DAT_Notification_content_item-edit" id={"Remove_" + data.id} onClick={e => handleDelete(e)}><ion-icon name="trash-outline"></ion-icon></div>
                                                                : <></>
                                                    }
                                                </div>

                                            )
                                        })}
                                    </div>
                                </div>
                            </>
                        )

                    case "sms":
                        return (
                            <>
                                <div
                                    className="DAT_Notification"

                                >
                                    {/* <Link to="/SMS" style={{ textDecoration: "none" }}> */}
                                    <div className="DAT_Notification_head" >
                                        <ion-icon name="mail-outline"></ion-icon>Trung Tâm SMS
                                    </div>
                                    {/* </Link> */}

                                    <div className="DAT_Notification_content" >
                                        {sms.map((data, index) => {

                                            return (
                                                <div className="DAT_Notification_content_item" key={index}>
                                                    <div className="DAT_Notification_content_item-group">
                                                        <div className="DAT_Notification_content_item-group-icon" style={{ backgroundColor: "rgb(255, 0, 0)" }}>
                                                            {(data.type === 'error')
                                                                ? <ion-icon name="cloud-done-outline" />
                                                                : <ion-icon name="warning" />
                                                            }
                                                        </div>
                                                        <div className="DAT_Notification_content_item-group-data">
                                                            <div className="DAT_Notification_content_item-group-data-tit" style={{ marginBottom: "5px" }}>
                                                                <span style={{ color: "black" }}>{data.tit}&nbsp;</span><span style={{ color: "gray" }}>{data.text}</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="DAT_Notification_content_item-time" >{data.time}</div>

                                                </div>
                                            )
                                        })}

                                    </div>

                                </div>
                            </>
                        )
                    default:
                        return <></>
                }
            })()}








            {(searchmoblile.value)
                ? <></>
                :
                <div
                    className="DAT_searchbar"
                    style={(search) ? { display: "block" } : { display: "none" }}
                >
                    <div className="DAT_searchbar-group">
                        <input type="text" placeholder="Tìm kiếm"></input>
                        <button onClick={(event) => { handleSearch(event) }}>
                            <ion-icon name="search-outline"></ion-icon>
                        </button>
                    </div>
                </div>

            }

        </>
    );

}

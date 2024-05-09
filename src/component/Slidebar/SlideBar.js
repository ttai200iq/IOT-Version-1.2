import React, { useState, useContext, useEffect } from "react";
import "./SlideBar.scss";
import { Link } from 'react-router-dom';
import { SettingContext } from "../Context/SettingContext";
import { ToolContext } from "../Context/ToolContext";
import { useDispatch, useSelector } from "react-redux";
import toolslice from "../Redux/toolslice";
import adminslice from "../Redux/adminslice";

export default function SlideBar(props) {
    const rootDispatch = useDispatch()
    const { toolDispatch } = useContext(ToolContext);
    const { currentID, settingDispatch } = useContext(SettingContext);

    const menu = useSelector((state) => state.admin.menu)
    const type = useSelector((state) => state.admin.type)
    const username = useSelector((state) => state.admin.username)
    // const lang = useIntl();
    const [status, setStatus] = useState(false);
    const [list, setlist] = useState('Home');
    const [tab, setTab] = useState('Home');
    const dataColor = { cur: { color: '#0061f2' }, pre: { color: 'rgb(85, 85, 85)' } };
    const data = {
        Home: { icon: <ion-icon name="home-outline" />, link: '/', li: (type === 'user') ? [] : [{ link: '/Auto', name: 'Tự Động Hóa' }, { link: '/Solar', name: 'Năng Lượng Mặt Trời' }, { link: '/Elev', name: 'Thang Máy' }, { link: '/UPS', name: 'UPS' }] },
        Log: { icon: <ion-icon name="document-text-outline"></ion-icon>, link: 'none', li: [{ link: '/Log', name: 'Cảnh Báo' }, { link: '/Report', name: 'Báo Cáo' }] },
        // Map: { icon: <ion-icon name="map-outline"></ion-icon>, link: '/Map',li:[] },
        Mess: { icon: <ion-icon name="mail-outline"></ion-icon>, link: 'none', li: [] },
        Notif: { icon: <ion-icon name="notifications-outline"></ion-icon>, link: 'none', li: [] },
        Setting: { icon: <ion-icon name="construct-outline"></ion-icon>, link: 'none', li: (type === 'admin' || type === 'master') ? [{ link: '/Error', name: 'Cài Đặt Lỗi' }, { link: '/Export', name: 'Cài đặt báo cáo' }, { link: '/Device', name: 'Kho Giao Diện' }, { link: '/Project', name: 'Dự Án' }, { link: '/User', name: 'Người Dùng' }, { link: '/Account', name: 'Tài Khoản' }, { link: '/Contact', name: 'Liên hệ' }] : (type === 'mainuser') ? [{ link: '/Error', name: 'Cài Đặt Lỗi' }, { link: '/Account', name: 'Tài Khoản' }, { link: '/Contact', name: 'Liên hệ' }] : [{ link: '/Account', name: 'Tài Khoản' }, { link: '/Contact', name: 'Liên hệ' }] },
        Inf: { icon: <ion-icon name="grid-outline"></ion-icon>, link: '/Datgroup', li: [] }

    }

    const getId = (e) => {
        const ID = e.currentTarget.id;
        //console.log(ID)
        setTab(ID)
        if (status) {
            if (list !== ID) {
                setlist(ID)
            } else {
                setlist('Default')
                setStatus(false)
            }
        } else {
            setlist(ID)
            setStatus(true)
        }
    }

    const handleload = (e) => {
        if (currentID !== list) {
            rootDispatch(toolslice.actions.setstatus(false))
            settingDispatch({ type: "RESET", payload: [] })
            toolDispatch({ type: "RESET_TOOL", payload: [] })
        }
    }
    const handleShadow = (e) => {
        rootDispatch(adminslice.actions.setmenu(false))
        rootDispatch(adminslice.actions.setinf("default"))
        rootDispatch(adminslice.actions.setsearch(false))
        //envDispatch({ type: 'MENU', payload: false })
        //envDispatch({ type: 'INF', payload: false })
        //envDispatch({ type: 'SEARCH', payload: false })
    }

    const handleException = (e) => {
        // console.log(e.currentTarget.id)
        let id = e.currentTarget.id
        if (id === 'Notif') {
            rootDispatch(adminslice.actions.setinf("notif"))
        }
        if (id === 'Mess') {
            rootDispatch(adminslice.actions.setinf("sms"))
        }
    }

    const Menu = (id, label) => {
        return (
            <div className="DAT_menu_content" id={id} onClick={(event) => { getId(event) }} >
                <div className="DAT_menu_content-icon" style={{ color: (tab === id) ? dataColor.cur.color : dataColor.pre.color }}>
                    {data[id].icon}
                </div>
                {(data[id].link !== 'none')
                    ? <Link to={data[id].link} style={{ textDecoration: 'none' }}>
                        <label style={{ color: (tab === id) ? dataColor.cur.color : dataColor.pre.color, fontWeight: "500", cursor: "pointer" }}>{label}</label>
                    </Link>
                    : <label style={{ color: (tab === id) ? dataColor.cur.color : dataColor.pre.color, fontWeight: "500", cursor: "pointer" }} id={id} onClick={(event) => { handleException(event) }}>{label}</label>
                }
                <div className="DAT_menu_content-arrow" style={{ color: "rgb(141, 139, 139)" }}>

                    {(data[id].li.length === 0)
                        ? <></>
                        : (list === id)
                            ? <ion-icon name="chevron-down-outline" />
                            : <ion-icon name="chevron-forward-outline" />

                    }
                </div>

            </div>
        )
    }

    const MenuLi = (id) => {
        return (
            <div className="DAT_menu_list">
                <div className="DAT_menu_list-accordion">

                    {data[id].li.map((data, index) => {
                        return (
                            (data.link !== "none")
                                ? <Link key={id + "_" + index} to={data.link} style={{ textDecoration: 'none' }} onClick={(e) => { handleload(e) }}>
                                    <label>{data.name}</label>
                                </Link>
                                : <label>{data.name}</label>
                        )
                    })}
                </div>
            </div>
        )
    }



    return (
        <>
            <div className="DAT_menu" style={(menu) ? { width: "240px" } : { width: "0px" }}>
                <div style={(menu) ? { display: "block" } : { display: "none" }}>

                    {Menu('Home', 'Trang Chủ')}
                    {(list === 'Home')
                        ? <>{MenuLi('Home')}</>
                        : <></>
                    }

                    {/* {Menu('Map', 'Vị Trí')} */}

                    {/* {Menu('Notif', 'Thông Báo')} */}
                    {/* {Menu('Mess', 'SMS')} */}

                    {Menu('Log', 'Báo Cáo')}
                    {(list === 'Log')
                        ? <>{MenuLi('Log')}</>
                        : <></>
                    }

                    {Menu('Setting', 'Cài Đặt')}
                    {(list === 'Setting')
                        ? <>{MenuLi('Setting')}</>
                        : <></>
                    }

                    {/* {Menu('Inf', 'DAT Group')} */}

                </div>

            </div>


            <div className="DAT_user" style={(menu) ? { width: "240px", padding: "0 12px" } : { width: "0px" }}>
                <div className="DAT_user-group" style={(menu) ? { display: "block" } : { display: "none" }}>
                    <div className="DAT_user-group-Tit">Đăng nhập bởi:</div>
                    <div className="DAT_user-group-ID">{username}</div>
                </div>
            </div>
            <div className="DAT_menu_shadow" id="DAT_shadow" style={(menu) ? { display: "block" } : { display: "none" }} onClick={(event) => { handleShadow(event) }}></div>
        </>
    );

}

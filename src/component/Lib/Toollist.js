import React, { useContext, useEffect, useLayoutEffect, useReducer, useRef, useState } from "react";
import "./Tool.scss"
// import Config from "./Config";
import { ToolContext } from "../Context/ToolContext";
import { SettingContext } from "../Context/SettingContext";
// import Calculate from "./Calculate";
import Interface from "./Interface";
import toolslice from "../Redux/toolslice";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import { host } from "../constant";
import { signal } from "@preact/signals-react";
import { PacmanLoader } from "react-spinners";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
import { FaFileExport } from "react-icons/fa6";
import { BiSolidMessageError } from "react-icons/bi";
import { SiPagespeedinsights } from "react-icons/si";
import { MdContactPhone } from "react-icons/md";
import { Link } from "react-router-dom";
import axios from "axios";
import { AlertContext } from "../Context/AlertContext";
import { useIntl } from "react-intl";
import { action } from "../Control/Action";
import { view } from "../../App";
import { useMobileOrientation } from 'react-device-detect';
import { IoPhoneLandscapeOutline } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";
const length = signal(0);
export const _tab = signal();

export default function Toollist(props) {

    const { name, config, control, toolDispatch } = useContext(ToolContext)
    const { lasttab, defaulttab, currentID, screen, settingDispatch } = useContext(SettingContext)
    const [tab, setTab] = useState(String(defaulttab))
    const [searchmoblile, setSearchmoblile] = useState(false)
    const rootDispatch = useDispatch()
    const { alertDispatch } = useContext(AlertContext);
    const lang = useIntl();
    const [statetab, setStatetab] = useState(false)
    const type = useSelector((state) => state.admin.type)
    //const user = useSelector((state) => state.admin.user)
    const { isLandscape } = useMobileOrientation()




    // useEffect(() => {


    //     if (window.innerWidth >= 700) {
    //         setSearchmoblile(true)
    //     } else {
    //         setSearchmoblile(false)
    //     }
    //     return (() => {
    //         socket_client.current.off("Server/data");
    //     })
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [])


    const handleWindowResize = () => {
        if (window.innerWidth >= 800) {
            setSearchmoblile(true)
        } else {
            setSearchmoblile(false)
        }
    }

    useEffect(function () {
        window.addEventListener('resize', handleWindowResize);
    }, []);



    useEffect(() => {
        length.value = Object.keys(name).length

        if (window.innerWidth >= 800) {
            setSearchmoblile(true)
        } else {
            setSearchmoblile(false)
        }

        setTab(String(defaulttab))
    }, [defaulttab, name])

    const handleTab = (e) => {
        const ID = e.currentTarget.id
        setTab(ID)
        _tab.value = ID
    }

    const handleTabMobile = (e) => {
        const ID = e.currentTarget.id
        _tab.value = ID
        setTab(ID)
        setStatetab(false)
    }


    const handleTabclose = () => {
        rootDispatch(toolslice.actions.setstatus(false))
        toolDispatch({ type: "RESET_TOOL", payload: [] })
        settingDispatch({ type: "REMOVE_CURRENTID", payload: '' })
    }

    const handleAdd = (event) => {
        //console.log(view.value)
        let tab = parseInt(lasttab) + 1
        let name = String("Màn hình " + tab)
        settingDispatch({ type: "ADD_SCREEN", payload: { deviceid: currentID, tab: tab, name: name, data: { id: '0', width: '500', data: [] }, setting: {} } })
        settingDispatch({ type: "LOAD_LASTTAB", payload: tab })

        axios.post(host.DEVICE + "/addTabMD", { id: currentID, tab: tab, name: name, groupid: view.value.id, data: JSON.stringify({ id: '0', width: '500', data: [] }), setting: JSON.stringify({}) }, { secure: true, reconnect: true }).then(
            function (res) {
                //console.log(res.data.status)
                if (res.data.status) {
                    alertDispatch(action('LOAD_CONTENT', { content: lang.formatMessage({ id: "alert_7" }), show: 'block' }))
                } else {
                    alertDispatch(action('LOAD_CONTENT', { content: lang.formatMessage({ id: "alert_3" }), show: 'block' }))
                }

            })


    }

    return (
        <>







            {(searchmoblile)

                ?
                (length.value > 5)
                    ?
                    <div className="DAT_Toollist_Tab_Mobile">


                        <button className="DAT_Toollist_Tab_Mobile_content" onClick={() => setStatetab(!statetab)} > <span> {name[tab]}</span>  {(statetab) ? <IoIosArrowDown /> : <IoIosArrowForward />} </button>
                        {(statetab)
                            ? <div className="DAT_Toollist_Tab_Mobile_list" >
                                {Object.keys(name).map((keyName, i) => {
                                    return (
                                        <div className="DAT_Toollist_Tab_Mobile_list_item" key={i} id={keyName} onClick={(e) => handleTabMobile(e)} >{i + 1}: {name[keyName]}</div>
                                    )
                                })}
                                {(type === 'master' || type === 'admin')
                                    ? <div className="DAT_Toollist_Tab_Mobile_list_item" onClick={() => handleAdd()} >Thêm màn hình</div>
                                    : <></>}
                            </div>
                            : <></>
                        }
                        <div className="DAT_Toollist_Tab-warn">
                            <Link to="/Log" style={{ textDecoration: "none" }} >
                                <div className="DAT_Toollist_Tab-warn-item"  ><BiSolidMessageError style={{ color: "red" }} /></div>
                            </Link>
                            <Link to="/Report" style={{ textDecoration: "none" }} >
                                <div className="DAT_Toollist_Tab-warn-item"  ><FaFileExport style={{ color: "green" }} /></div>
                            </Link>
                            <Link to="/Contact" style={{ textDecoration: "none" }} >
                                <div className="DAT_Toollist_Tab-warn-item"  ><MdContactPhone size={20} style={{ color: "blue" }} /></div>
                            </Link>
                        </div>
                        <div className="DAT_Toollist_Tab-close" onClick={handleTabclose}><IoMdClose size={20} /></div>


                    </div>
                    :
                    <div className="DAT_Toollist_Tab">
                        {Object.keys(name).map((keyName, i) => {
                            return (
                                (keyName === tab)
                                    ? <div key={i} className="DAT_Toollist_Tab_main">
                                        <p className="DAT_Toollist_Tab_main_left"></p>
                                        <span className="DAT_Toollist_Tab_main_content1" id={keyName} style={{ backgroundColor: "White", color: "black", borderRadius: "10px 10px 0 0" }} onClick={(e) => handleTab(e)}>{name[keyName]}</span>
                                        <p className="DAT_Toollist_Tab_main_right"></p>
                                    </div>
                                    : <span className="DAT_Toollist_Tab_main_content2" key={i} id={keyName} style={{ backgroundColor: "#dadada" }} onClick={(e) => handleTab(e)}><SiPagespeedinsights /></span>
                            )

                        })}
                        {(type === 'master' || type === 'admin')
                            ? <span className="DAT_Toollist_Tab_main_content2" style={{ backgroundColor: "#dadada" }} onClick={() => handleAdd()} >+</span>
                            : <></>}
                        <div className="DAT_Toollist_Tab-warn">
                            <Link to="/Log" style={{ textDecoration: "none" }} >
                                <div className="DAT_Toollist_Tab-warn-item"  ><BiSolidMessageError size={20} style={{ color: "red" }} /></div>
                            </Link>
                            <Link to="/Report" style={{ textDecoration: "none" }} >
                                <div className="DAT_Toollist_Tab-warn-item"  ><FaFileExport size={20} style={{ color: "green" }} /></div>
                            </Link>
                            <Link to="/Contact" style={{ textDecoration: "none" }} >
                                <div className="DAT_Toollist_Tab-warn-item"  ><MdContactPhone size={20} style={{ color: "blue" }} /></div>
                            </Link>
                        </div>

                        <div className="DAT_Toollist_Tab-close" onClick={handleTabclose}><IoMdClose size={20} /></div>
                    </div>
                :
                <div className="DAT_Toollist_Tab_Mobile">
                    <button className="DAT_Toollist_Tab_Mobile_content" onClick={() => setStatetab(!statetab)} > <span> {name[tab]}</span>  {(statetab) ? <IoIosArrowDown /> : <IoIosArrowForward />} </button>
                    {(statetab)
                        ? <div className="DAT_Toollist_Tab_Mobile_list" >
                            {Object.keys(name).map((keyName, i) => {
                                return (
                                    <div className="DAT_Toollist_Tab_Mobile_list_item" key={i} id={keyName} onClick={(e) => handleTabMobile(e)} >{i + 1}: {name[keyName]}</div>
                                )
                            })}
                            {(type === 'master' || type === 'admin')
                                ? <div className="DAT_Toollist_Tab_Mobile_list_item" onClick={() => handleAdd()} >Thêm màn hình</div>
                                : <></>}
                        </div>
                        : <></>
                    }
                    {/* <Link to="/Log" >
                        <button className="DAT_Toollist_Tab-warn" style={{ right: "320px" }} ><span>CẢNH BÁO</span></button>
                    </Link>
                    <Link to="/Report" >
                        <button className="DAT_Toollist_Tab-warn" style={{ right: "190px" }} ><span>BÁO CÁO</span></button>
                    </Link>
                    <button className="DAT_Toollist_Tab-warn" style={{ right: "60px" }} ><span>LIÊN HỆ</span></button> */}
                    <div className="DAT_Toollist_Tab-close" onClick={handleTabclose}><ion-icon name="close-outline"></ion-icon></div>


                </div>



            }


            <div className="DAT_Toollist_Content" style={{ padding: "10px" }}>


                {(config[tab] !== undefined)

                    ? (config[tab].stt)

                        ? <>
                            {/* <Config id={currentID} tab={tab} ></Config>
                            {(control[tab].stt)
                                ? <Calculate id={currentID} tab={tab} />
                                : <></>
                            } */}
                        </>
                        : <Interface id={currentID} tab={tab} />


                    : <div className="DAT_Toollist_Loading"><PacmanLoader color="#36d7b7" size={35} loading={true} /></div>


                }

            </div>

            {isLandscape
                ? <></>
                : <div className="DAT_Landscape" >

                    <div className="DAT_Landscape_tit">Embody</div>
                    <div className="DAT_Landscape_ver">Phiên bản: 3.0</div>
                    <div className="DAT_Landscape_note">Bạn vui lòng chuyển sang chế độ Landscape bằng cách xoay <span><IoPhoneLandscapeOutline size={25} color="Black" /></span> thiết bị của bạn</div>
                    <div className="DAT_Landscape_cancel" onClick={handleTabclose}><div >Thoát</div></div>

                </div>

            }




        </>
    )
}
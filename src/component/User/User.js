import React, { useContext, useEffect } from "react";
import "./User.scss"

import { useState } from "react";
import { Link } from "react-router-dom";
import Info from "./Info";
// import { useSelector } from "react-redux";
import Listuser, { data } from "./Listuser";
import { IoMdAdd } from "react-icons/io";
import { signal } from "@preact/signals-react";
import { isBrowser } from "react-device-detect";
import { HiOutlineUsers } from "react-icons/hi2";
import { CiSearch } from "react-icons/ci";

import Raisebox, { delstate } from "../Raisebox/RaiseboxConfirmDel";
import axios from "axios";
import { host } from "../constant";
import { AlertContext } from "../Context/AlertContext";
import { useIntl } from "react-intl";
export const editUser = signal(false)

export default function User(props) {
    // const [data, setData] = useState([]);
    const banner = "linear-gradient(140deg, #0061f2, #6900c7)"
    const inf = { code: 'Report', tit: 'Người dùng' }
    const [direct, SetDirect] = useState([{ id: 'home', text: 'Trang chủ' }, { id: 'list', text: inf.tit }])
    // const color = {
    //     cur: "blue",
    //     pre: "black"
    // }
    // const type = useSelector((state) => state.admin.type)
    // const [nav, setNav] = useState("info");
    // const [changefilter, setChangefilter] = useState(true)
    const [dataDel, setDataDel] = useState();
    const { alertDispatch } = useContext(AlertContext);
    const [filter, setFilter] = useState("");
    const dataLang = useIntl();

    const handleNav = () => {
        editUser.value = true
    };

    const handleDelete = () => {
        // console.log(dataDel)
        const arr = dataDel.split("_")

        var newData = data.value
        newData = newData.filter(data => data.name != arr[0] && data.name[1] != arr[1])
        data.value = [...newData]
        axios.post(host.DEVICE + "/removeAcount", { name: arr[0], mail: arr[1] }, { withCredentials: true }).then(
            function (res) {
                // console.log(res.data)
                if (res.data.status) {
                    alertDispatch({ type: 'LOAD_CONTENT', payload: { content: dataLang.formatMessage({ id: "alert_9" }), show: 'block' } })
                } else {
                    alertDispatch({ type: 'LOAD_CONTENT', payload: { content: dataLang.formatMessage({ id: "alert_3" }), show: 'block' } })
                }
            })
    };

    const setdata = (name, mail) => {
        setDataDel(`${name}_${mail}`)
    };

    const handleChangeFilter = (e) => {
        setFilter(e.currentTarget.value);
    };

    useEffect(() => {
        return () => {
            editUser.value = false
            delstate.value = false
        }
    }, []);

    return (
        <>
            {isBrowser
                ?
                <div className="DAT_User" style={{ backgroundImage: banner, backgroundPosition: "bottom", backgroundRepeat: "no-repeat", backgroundSize: "cover" }}>
                    <div className="DAT_User_Banner">
                        {/* <div className="DAT_UserTop-shadow" ></div> */}
                    </div>
                    <div className="DAT_User_Content">
                        <div className="DAT_User_Content_Direct" >
                            {direct.map((data, index) => {
                                return (
                                    (index === 0)
                                        ? <Link key={index} to="/" style={{ textDecoration: 'none', color: "white" }}>
                                            <span style={{ cursor: "pointer" }}> {data.text}</span>
                                        </Link>
                                        : <span key={index} id={data.id + "_DIR"} style={{ cursor: "pointer" }}> {' > ' + data.text}</span>

                                )
                            })}
                        </div>

                        {/* Header */}
                        <div className="DAT_User_Content_Tit">
                            <div className="DAT_User_Content_Tit-content">
                                <HiOutlineUsers size={30} color="white" />
                                <span className="DAT_User_Content_Tit-content-title">{inf.tit}</span>
                            </div>
                            <div className="DAT_User_Content_Tit_Filter">
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm"
                                    onChange={(e) => handleChangeFilter(e)}
                                />
                                <CiSearch color="gray" size={20} />
                            </div>
                            <button
                                className="DAT_User_Content_Tit_New"
                                onClick={(e) => {
                                    handleNav();
                                }}
                            >
                                <span>
                                    <IoMdAdd color="white" size={20} />
                                    &nbsp;
                                    Tạo mới
                                </span>
                            </button>
                        </div>

                        <div className="DAT_User_Content_Main">
                            <div className="DAT_User_Content_Main_Nav">
                                <div className="DAT_User_Content_Main_Nav_Item">
                                    Danh sách người dùng
                                </div>
                            </div>
                            {/* Content */}
                            <div className="DAT_User_Content_Main_New">
                                <Listuser
                                    username={props.username}
                                    setdata={setdata}
                                    filter={filter}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                :
                <div className="DAT_UserListDetail">
                    <div className="DAT_UserListDetail_HeadTit">
                        <HiOutlineUsers size={25} color="grey" />
                        <span >{inf.tit}</span>
                    </div>
                    <div className="DAT_UserListDetail_Content">
                        <div className="DAT_UserListDetail_Content_List">
                            <Listuser
                                username={props.username}
                                setdata={setdata}
                                filter={filter}
                            />
                        </div>
                    </div>

                </div >
            }

            <div className="DAT_PopupBG" style={{ height: editUser.value ? "100vh" : "0" }}>
                {editUser.value ? <Info username={props.username} /> : <></>}
            </div>

            <div className="DAT_PopupBG" style={{ height: delstate.value ? "100vh" : "0" }}>
                {delstate.value ? <Raisebox handleDelete={handleDelete} setdata={setdata} /> : <></>}
            </div>
        </>
    )
}
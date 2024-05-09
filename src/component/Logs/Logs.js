import React, { useEffect, useRef, useState } from "react";
import "./Logs.scss";
import { CSVLink } from "react-csv";
import DataTable from 'react-data-table-component';
import { Link } from "react-router-dom";
import { host } from "../constant";
import axios from "axios";
import moment from "moment-timezone";
import { Manager, io } from "socket.io-client";
import { effect, signal } from "@preact/signals-react";
import { useSelector } from "react-redux";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { isBrowser } from "react-device-detect";
import { IoCalendarOutline, IoClose, IoWarningOutline } from "react-icons/io5";
import { CiCalendarDate } from "react-icons/ci";
import styled from "styled-components";
import { CiSearch } from "react-icons/ci";
import { MdOutlineDelete } from "react-icons/md";
import { lowercasedata } from "../User/Listuser";

export const err = signal([])
export const errfilter = signal([])
export const state = signal(0)
export const time = signal('')
export const date = signal('')

export default function Logs(props) {

    const banner = "url('/banner/History_banner.png')"
    const icon = <ion-icon name="document-text-outline"></ion-icon>
    const inf = { code: 'SMS', tit: 'Cảnh báo' }
    const [direct, SetDirect] = useState([{ id: 'home', text: 'Trang chủ' }, { id: 'list', text: inf.tit }])
    const [detail, setDetail] = useState([]);
    const [errStt, setErrStt] = useState(false);
    const socket_client = useRef(io(host.DEVICE));
    const type = useSelector((state) => state.admin.type)
    const admin = useSelector((state) => state.admin.admin)
    const [startDate, setStartDate] = useState(new Date());
    const [changefilter, setChangefilter] = useState(true)
    const iconmobile = <IoWarningOutline color="gray" size={25} />

    useEffect(() => {
        var inp = document.getElementById('search')
        var inpdate = document.getElementById('date')
        if (state.value === 1) {
            // console.log(state.value, time.value, date.value)
            const [monthA, dayA, yearA] = date.value.split('/');
            var date_ = new Date(`${yearA}-${monthA}-${dayA}T${time.value}`).toISOString().split('T')[0]
            //console.log(date_)

            axios.post(host.DEVICE + "/getLogErr", { user: (type === 'user' || type === 'mainuser') ? admin : props.username, date: date.value }, { secure: true, reconnect: true })
                .then((res) => {
                    inpdate.value = date_
                    inp.value = time.value
                    err.value = res.data
                    errfilter.value = res.data.filter((data) => data.time == time.value)
                    // console.log(errfilter.value)
                    state.value = 2
                })
        }
    }, [state.value])

    useEffect(() => {
        //var Timezone = 'Asia/Ho_Chi_Minh';
        //var inp = document.getElementById('date')
        var inp = new Date().toISOString().split('T')[0]
        let current_date = moment(new Date()).format('MM/DD/YYYY_HH:mm:ss')
        var date = current_date.split('_')[0]


        // console.log(type, props.username)


        const user = (type === 'user' || type === 'mainuser') ? admin : props.username
        socket_client.current.on("Err/" + user, function (data) {
            // console.log(data)
            if (data.date === moment(inp.value).format('MM/DD/YYYY')) {
                err.value = [{ id: err.value.length + 1, ...data }, ...err.value]
                err.value = err.value.map((data, index) => ({ ...data, count: index + 1 }))
                errfilter.value = err.value
            }
        })

        axios.post(host.DEVICE + "/getLogErr", { user: (type === 'user' || type === 'mainuser') ? admin : props.username, date: date }, { secure: true, reconnect: true })
            .then((res) => {
                // console.log(res.data)
                err.value = res.data.map((data, index) => ({ ...data, count: index + 1 }))
                //state.value = 0
                if (state.value === 0) {
                    errfilter.value = err.value
                }
            })
        return (() => {
            socket_client.current.off("Err/" + (type === 'user' || type === 'mainuser') ? admin : props.username);
        })

    }, [])

    const handleDate = (date) => {
        // console.log(date)
        setStartDate(date)
        axios.post(host.DEVICE + "/getLogErr", { user: (type === 'user' || type === 'mainuser') ? admin : props.username, date: moment(date).format('MM/DD/YYYY') }, { secure: true, reconnect: true })
            .then((res) => {
                // console.log(res.data)
                err.value = res.data.map((data, index) => ({ ...data, count: index + 1 }))
                errfilter.value = err.value
            })
    }

    const handleErr = (e) => {
        axios.post(host.DEVICE + "/checkLogErr", { code: e.currentTarget.id, user: (type === 'user' || type === 'mainuser') ? admin : props.username }, { secure: true, reconnect: true })
            .then((res) => {
                //console.log(res.data)
                setDetail(res.data)
                setErrStt(true)
            })
    }

    const handleClose = () => {
        setErrStt(false)
    }

    const handleDelete = (e) => {
        // console.log(e.currentTarget.id)
        const arr = e.currentTarget.id.split("_");
        state.value = 0
        // axios.post(host.DEVICE + "/removeLogErr", { id: arr[0], time: arr[1] }, { secure: true, reconnect: true })
        //     .then((res) => {
        //         console.log(res.data)
        //         if (res.data.status) {
        //             err.value = err.value.filter((data) => !(data.id == arr[0]))
        //                 .map((data, index) => ({ ...data, count: index + 1 }))
        //             errfilter.value = err.value
        //             // console.log(err.value)
        //             // newData.map((data, index) => {
        //             //     return (data["id"] = index + 1);
        //             // });
        //             // console.log(newData);
        //         }
        //     })
    };

    const handleInput = (e) => {
        state.value = 0
        // console.log(e.target.value);
        const searchTerm = e.currentTarget.value.toLowerCase();
        if (searchTerm == "") {
            errfilter.value = err.value;
        } else {
            const newData = err.value.filter((row) => {
                return (
                    row.id === parseInt(searchTerm) ||
                    lowercasedata(row.deviceid).includes(searchTerm) ||
                    lowercasedata(row.code).includes(searchTerm) ||
                    lowercasedata(row.time).includes(searchTerm)
                );
            });
            errfilter.value = newData;
        }
    };

    const handleInputDate = (e) => {
        // console.log(e.target.value);

        axios.post(host.DEVICE + "/getLogErr", { user: (type === 'user' || type === 'mainuser') ? admin : props.username, date: moment(e.target.value).format('MM/DD/YYYY') }, { secure: true, reconnect: true })
            .then((res) => {
                // console.log(res.data)
                err.value = res.data.map((data, index) => ({ ...data, count: index + 1 }))
                errfilter.value = err.value
            })
    }

    const paginationComponentOptions = {
        rowsPerPageText: 'Số cột',
        rangeSeparatorText: 'đến',
        selectAllRowsItem: true,
        selectAllRowsItemText: 'tất cả',
    };

    const columns = [
        {
            name: "STT",
            selector: (row) => row.count,
            width: "80px",
            center: true,
            sortable: true,
        },
        {
            name: "Mã Lỗi",
            selector: (row) => <div id={row.code} onClick={(e) => handleErr(e)} style={{ cursor: "pointer", color: "blue" }} >{row.code}</div>,
            width: "100px",
            center: true,
            sortable: true
        },
        // {
        //     name: "Tên Lỗi",
        //     selector: (row) => row.name,
        // },
        {
            name: "Gateway",
            selector: (row) => row.deviceid,
        },

        {
            name: "Giờ",
            selector: row => row.time,
            center: true,
            width: "250px",
            sortable: true
        },
        // {
        //     name: "ID",
        //     selector: (row) => row.id,
        //     center: true,
        //     width: "70px",
        //     center: true,
        //     sortable: true
        // },
        {
            name: "",
            selector: (row) => (
                <div
                    style={{ cursor: "pointer", color: "red" }}
                    id={row.id + "_" + row.time}
                    onClick={(e) => handleDelete(e)}
                >
                    <MdOutlineDelete size={20} color="red" />
                </div>
            ),
            width: "70px",
            center: true,
        },
    ];

    const columns_user = [
        {
            name: "STT",
            selector: (row) => row.count,
            width: "80px",
            center: true,
            sortable: true,
        },
        {
            name: "Mã Lỗi",
            selector: (row) => <div id={row.code} onClick={(e) => handleErr(e)} style={{ cursor: "pointer", color: "blue" }} >{row.code}</div>,
            width: "100px",
            center: true,
            sortable: true
        },
        // {
        //     name: "Tên Lỗi",
        //     selector: (row) => row.name,
        // },
        {
            name: "Gateway",
            selector: (row) => row.deviceid,
        },

        {
            name: "Giờ",
            selector: row => row.time,
            center: true,
            width: "250px",
            sortable: true
        },
        // {
        //     name: "ID",
        //     selector: (row) => row.id,
        //     center: true,
        //     width: "70px",
        //     center: true,
        //     sortable: true
        // },
    ];

    const popup_state = {
        pre: { transform: "rotate(0deg)", transition: "0.5s", color: "white" },
        new: { transform: "rotate(90deg)", transition: "0.5s", color: "white" },
    };

    const handlePopup = (state) => {
        const popup = document.getElementById("Popup");
        popup.style.transform = popup_state[state].transform;
        popup.style.transition = popup_state[state].transition;
        popup.style.color = popup_state[state].color;
    };

    useEffect(() => {
        // console.log(errfilter.value)
    }, [])

    // Handle close when press ESC
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                setErrStt(false);
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            {isBrowser ?
                <div className="DAT_Log" >
                    <div className="DAT_Log_Banner" style={{ backgroundImage: banner, backgroundPosition: "bottom", backgroundRepeat: "no-repeat", backgroundSize: "cover" }}>
                        <div className="DAT_Log_Banner_Shadow" ></div>
                    </div>
                    <div className="DAT_Log_Content">
                        <div className="DAT_Log_Content_Direct" >
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
                        <div className="DAT_Log_Content_Tit">
                            <div className="DAT_Log_Content_Tit-icon">
                                {icon}
                            </div>
                            <div className="DAT_Log_Content_Tit-content" >{inf.tit}</div>
                        </div>

                        <div className="DAT_Log_Content_Main">
                            <div className="DAT_Log_Content_Main_Nav" >
                                {/* <div className="DAT_Log_Content_Main_Nav_Item">Danh sách lỗi</div> */}
                                <div className="DAT_Log_Content_Main_Nav_Search">
                                    <div className="DAT_Log_Content_Main_Nav_Search_Group">
                                        <DatePicker dateFormat="dd/MM/yyyy"
                                            selected={startDate}
                                            maxDate={new Date()}
                                            onChange={(date) => handleDate(date)} />
                                        <input
                                            id="search"
                                            type="text"
                                            placeholder="Tìm kiếm"
                                            onChange={(e) => handleInput(e)}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="DAT_Log_Content_Main_List">

                                <DataTable
                                    className="DAT_Table_Container"
                                    columns={(type === 'user') ? columns_user : columns}
                                    data={errfilter.value}
                                    pagination
                                    paginationComponentOptions={paginationComponentOptions}
                                    noDataComponent={
                                        <div style={{ margin: "auto", textAlign: "center", color: "red", padding: "20px" }}>
                                            <div>Danh sách trống</div>
                                        </div>
                                    }
                                />
                            </div>
                        </div>
                    </div>
                </div> :
                <div className="DAT_ListDetail">
                    <div className="DAT_ListDetail_HeadTit">
                        {iconmobile}
                        <span >{inf.tit}</span>
                    </div>
                    <div className="DAT_ListDetail_Content">
                        <div className="DAT_ListDetail_Content_Filterbar">
                            {changefilter ?
                                <input
                                    id="search"
                                    type="text"
                                    placeholder="Tìm kiếm"
                                    style={{ minWidth: "calc(100% - 45px)" }}
                                    onChange={(e) => handleInput(e)}
                                /> :

                                <input
                                    id="date"
                                    type="date"
                                    style={{ minWidth: "calc(100% - 45px)" }}
                                    defaultValue={moment(startDate).format('YYYY-MM-DD')}
                                    onChange={(e) => handleInputDate(e)}
                                />
                            }
                            <div className="DAT_ListDetail_Content_Filterbar_Date"
                                onClick={() => setChangefilter(!changefilter)}>
                                {changefilter ?
                                    <CiCalendarDate /> :
                                    <CiSearch />
                                }
                            </div>
                        </div>
                        <div className="DAT_ListDetail_Content_List">
                            {/* <div>Danh sách lỗi</div> */}
                            {errfilter.value.map((data, i) => {
                                return (
                                    <div key={i} className="DAT_ListDetail_Content_List_Item">
                                        {/* code,deviceid,time */}
                                        <div className="DAT_ListDetail_Content_List_Item_GroupInfo"
                                        >
                                            <div className="DAT_ListDetail_Content_List_Item_GroupInfo_Code" id={data.code} onClick={(e) => handleErr(e)}>
                                                CODE:{data.code}
                                            </div>
                                            <div className="DAT_ListDetail_Content_List_Item_GroupInfo_Info">
                                                <div className="DAT_ListDetail_Content_List_Item_GroupInfo_Info_Gateway">
                                                    {data.deviceid}
                                                </div>
                                                {/* <div className="DAT_ListDetail_Content_List_Item_Info_Time">
                                                    {data.time}
                                                </div> */}
                                            </div>
                                        </div>
                                        {/* <div className="DAT_ListDetail_Content_List_Item_Del"
                                            id={data.id + "_" + data.time}
                                            onClick={(e) => handleDelete(e)}
                                        >
                                            <MdOutlineDelete size={20} color="red" />
                                        </div> */}

                                        <div className="DAT_ListDetail_Content_List_Item_Bottom">
                                            <div className="DAT_ListDetail_Content_List_Item_Bottom_Time">
                                                {`${data.time} ${data.date}`}
                                            </div>
                                            <div className="DAT_ListDetail_Content_List_Item_Bottom_Del"
                                                id={data.id + "_" + data.time}
                                                onClick={(e) => handleDelete(e)}
                                                style={{ cursor: "pointer", color: "red" }}
                                            >
                                                <MdOutlineDelete size={20} color="red" />
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                </div >
            }

            <div className="DAT_PopupBG"
                style={{ height: errStt ? "100vh" : "0px" }}
            >
                {errStt
                    ?
                    <div className="DAT_viewErr-Inf">
                        <div className="DAT_viewErr-Inf_Head">
                            <div className="DAT_viewErr-Inf_Head_Left">Thông tin lỗi</div>
                            <div className="DAT_viewErr-Inf_Head_Right">
                                <div className="DAT_viewErr-Inf_Head_Right_Close"
                                    id="Popup"
                                    onMouseEnter={(e) => handlePopup("new")}
                                    onMouseLeave={(e) => handlePopup("pre")}
                                    onClick={(e) => handleClose(e)}
                                >
                                    <IoClose size={25} color="white" />
                                </div>
                            </div>
                        </div>

                        <div className="DAT_viewErr-Inf-Tit">{detail[0]?.name || "Không có dữ liệu"}</div>
                        <div style={{ padding: "16px" }}>
                            <div className="DAT_viewErr-Inf-Type">Loại: {detail[0]?.type || ""}</div>

                            <span>Nguyên nhân</span>
                            <div className="DAT_viewErr-Inf-Infor">
                                {detail[0]?.infor.map((data, index) => {
                                    return (
                                        <div key={index} style={{ color: "gray" }}>{data.text}</div>
                                    )
                                })
                                }
                            </div>

                            <span>Biện pháp</span>
                            <div className="DAT_viewErr-Inf-Solution">
                                {detail[0]?.solution.map((data, index) => {
                                    return (
                                        <div key={index} style={{ color: "gray" }}>{data.text}</div>
                                    )
                                })
                                }
                            </div>
                        </div>
                    </div>
                    : <></>
                }
            </div>
        </>

    );
}

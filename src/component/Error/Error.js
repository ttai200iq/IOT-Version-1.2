import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import "./Error.scss";
import { Link } from "react-router-dom";
import Register from "./Register";
import Listerr from "./Listerr";
import Reader from "./Reader";
import { signal } from "@preact/signals-react";
import axios from "axios";
import { host } from "../constant";
import { useIntl } from "react-intl";
import { AlertContext } from "../Context/AlertContext";
import { isBrowser } from "react-device-detect";
import { IoIosAddCircle, IoMdAdd } from "react-icons/io";
import { BiMessageAltError } from "react-icons/bi";
import { CiSearch } from "react-icons/ci";
import { IoClose, IoSaveOutline } from "react-icons/io5";

export const readstate = signal(false);

export const register = signal({
    data: [],
});

export const reader = signal({
    data: [],
});

export const list = signal([]);
export const deviceid = signal("");
export const i_ = signal(0);
const tab = signal("1");

export default function Error(props) {
    const banner = "linear-gradient(140deg, #0061f2, #6900c7)";
    const [filter, setFilter] = useState("");
    const inf = { code: "Error", tit: "Cài đặt lỗi" };
    const direct = [
        { id: "home", text: "Trang chủ" },
        { id: "list", text: inf.tit },
    ];
    const [readstate, setReadstate] = useState(false);
    const [popupState, setPopupState] = useState(false);
    const [popupType, setPopupType] = useState("");
    const dataLang = useIntl();
    const { alertDispatch } = useContext(AlertContext);
    // const [loading, setLoading] = useState(false);

    const color = {
        cur: "#0d6efd",
        pre: "grey",
    };

    useLayoutEffect(() => {
        // console.log(props.username);
        list.value = [];
        axios
            .post(
                host.DEVICE + "/getErrbyUser",
                { user: props.username, type: "Project" },
                { secure: true, reconnect: true }
            )
            .then((res) => {
                //console.log(res.data)

                var listp = res.data;

                axios
                    .post(
                        host.DEVICE + "/getErrbyUser",
                        { user: props.username, type: "None" },
                        { secure: true, reconnect: true }
                    )
                    .then((res) => {
                        //console.log(res.data)

                        list.value = [...listp, ...res.data];
                        list.value = list.value.map((data, index) => ({
                            ...data,
                            id: index + 1,
                        }));

                        // if(res.data[0] !== undefined){
                        //     i_.value = res.data[0].id
                        //     register.value = res.data[0].setting
                        // }
                    });

                // if(res.data[0] !== undefined){
                //     i_.value = res.data[0].id
                //     register.value = res.data[0].setting
                // }
            });

        axios
            .post(
                host.DEVICE + "/getInfErr",
                { user: props.username },
                { secure: true, reconnect: true }
            )
            .then((res) => {
                //console.log(res.data)

                reader.value = res.data.sort((a, b) => a.code - b.code);
                reader.value =
                    reader.value.map((data, index) => ({ ...data, id: index + 1 })) || [];

                //list.value = res.data.map((data, index) => ({ ...data, id: index + 1 })) || []
                // if(res.data[0] !== undefined){
                //     i_.value = res.data[0].id
                //     register.value = res.data[0].setting
                // }
            });
        // eslint-disable-next-line
    }, []);

    const [nav, setNav] = useState("errlist");
    const handleNav = (e) => {
        var id = e.currentTarget.id;
        setNav(id);
    };

    const popup_state = {
        pre: { transform: "rotate(0deg)", transition: "0.5s", color: "white" },
        new: { transform: "rotate(90deg)", transition: "0.5s", color: "white" },
    };

    const handlePopup = (state) => {
        const popup = document.getElementById("Popup_");
        popup.style.transform = popup_state[state].transform;
        popup.style.transition = popup_state[state].transition;
        popup.style.color = popup_state[state].color;
    };

    const handleAdd = (e) => {
        setPopupState(true);
        setPopupType(e.currentTarget.id);
    };

    const handleClosePopup = (e) => {
        setPopupState(false);
    };

    const handleAddRegister = (e) => {
        e.preventDefault();
        var err = document.getElementById("errcode");
        register.value = {
            ...register.value,
            data: [
                ...register.value.data,
                {
                    id: parseInt(register.value.data.length) + 1,
                    addrcode: err.value,
                    register: [
                        {
                            id: 1,
                            addr: "1-" + parseInt(register.value.data.length + 1),
                            val: 1,
                        },
                    ],
                },
            ],
        };
        setPopupState(false);
    };

    const handleUpdate = (e) => {
        // console.log(register.value);
        axios
            .post(
                host.DEVICE + "/updateErr",
                {
                    user: props.username,
                    deviceid: deviceid.value,
                    setting: JSON.stringify(register.value),
                },
                { secure: true, reconnect: true }
            )
            .then((res) => {
                //console.log(res.data)
                if (res.data.status) {
                    alertDispatch({
                        type: "LOAD_CONTENT",
                        payload: {
                            content: dataLang.formatMessage({ id: "alert_5" }),
                            show: "block",
                        },
                    });
                } else {
                    alertDispatch({
                        type: "LOAD_CONTENT",
                        payload: {
                            content: dataLang.formatMessage({ id: "alert_3" }),
                            show: "block",
                        },
                    });
                }
            });
    };

    const handleAddReader = (e) => {
        e.preventDefault();
        var err = document.getElementById("errid");

        var newData = reader.value.filter((data) => data.code == err.value);
        // console.log(newData)

        if (newData.length > 0) {
            // console.log("already exist!");
            alertDispatch({
                type: "LOAD_CONTENT",
                payload: {
                    content: dataLang.formatMessage({ id: "alert_41" }),
                    show: "block",
                },
            });
        } else {
            axios
                .post(
                    host.DEVICE + "/addInfErr",
                    {
                        code: err.value,
                        name: "Lỗi " + parseInt(reader.value.length + 1),
                        type: "Error",
                        infor: JSON.stringify([{ id: 1, text: "..." }]),
                        solution: JSON.stringify([{ id: 1, text: "..." }]),
                        user: props.username,
                    },
                    { secure: true, reconnect: true }
                )
                .then((res) => {
                    // console.log(res.data);
                    if (res.data.status) {
                        reader.value = [
                            ...reader.value,
                            {
                                id: parseInt(reader.value.length + 1),
                                code: err.value,
                                name: "Lỗi " + parseInt(reader.value.length + 1),
                                type: "Error",
                                infor: [{ id: 1, text: "..." }],
                                solution: [{ id: 1, text: "..." }],
                            },
                        ];
                        alertDispatch({
                            type: "LOAD_CONTENT",
                            payload: {
                                content: dataLang.formatMessage({ id: "alert_5" }),
                                show: "block",
                            },
                        });
                    } else {
                        alertDispatch({
                            type: "LOAD_CONTENT",
                            payload: {
                                content: dataLang.formatMessage({ id: "alert_3" }),
                                show: "block",
                            },
                        });
                    }
                });
            // console.log(reader.value)
        }

        setPopupState(false);
    };

    const handleFilter = (e) => {
        setFilter(e.currentTarget.value);
        // console.log(e.currentTarget.value)
    };

    useEffect(() => {
        // console.log(readstate);
    }, [readstate]);

    // Handle close when press ESC
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                handleClosePopup();
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
            {isBrowser ? (
                <div className="DAT_Err">
                    <div className="DAT_Err_Banner"
                        style={{
                            backgroundImage: banner,
                            backgroundPosition: "bottom",
                            backgroundRepeat: "no-repeat",
                            backgroundSize: "cover",
                        }}
                    >
                        {/* <div className="DAT_ErrTop-shadow" ></div> */}
                    </div>

                    <div className="DAT_Err_Content">
                        <div className="DAT_Err_Content_Direct">
                            {direct.map((data, index) => {
                                return index === 0 ? (
                                    <Link
                                        key={index}
                                        to="/"
                                        style={{ textDecoration: "none", color: "white" }}
                                    >
                                        <span style={{ cursor: "pointer" }}> {data.text}</span>
                                    </Link>
                                ) : (
                                    <span
                                        key={index}
                                        id={data.id + "_DIR"}
                                        style={{ cursor: "pointer" }}
                                    >
                                        {" "}
                                        {" > " + data.text}
                                    </span>
                                );
                            })}
                        </div>

                        <div className="DAT_Err_Content_Tit">
                            <div className="DAT_Err_Content_Tit-content">
                                <BiMessageAltError size={30} color="white" />
                                <span className="DAT_Err_Content_Tit-content-title">{inf.tit}</span>
                            </div>

                            <div className="DAT_Err_Content_Tit_Filter">
                                {(() => {
                                    switch (nav) {
                                        case "errlist":
                                            return (
                                                <>
                                                    <input
                                                        type="text"
                                                        placeholder="Tìm kiếm"
                                                        onChange={(e) => handleFilter(e)}
                                                    />
                                                    <CiSearch color="gray" size={20} />
                                                </>
                                            )
                                        case "register":
                                            return (
                                                <>
                                                    <input
                                                        type="text"
                                                        placeholder="Tìm địa chỉ"
                                                        onChange={(e) => handleFilter(e)}
                                                    />
                                                    <CiSearch color="gray" size={20} />
                                                </>
                                            );
                                        case "reader":
                                            return (
                                                <>
                                                    <input
                                                        type="text"
                                                        placeholder="Tìm mã lỗi"
                                                        onChange={(e) => handleFilter(e)}
                                                    />
                                                    <CiSearch color="gray" size={20} />
                                                </>
                                            );
                                        default:
                                            <></>;
                                    }
                                })()}
                            </div>

                            <div className="DAT_Err_Content_Tit_AddNew">
                                {(() => {
                                    switch (nav) {
                                        case "errlist":
                                            return (
                                                <>
                                                </>
                                            )
                                        case "register":
                                            return (
                                                // <>
                                                //     <form className="DAT_Err_Content_Tit_AddNew-Form"
                                                //         onSubmit={(e) => handleAddRegister(e)}>
                                                //         <input
                                                //             placeholder="Thêm địa chỉ"
                                                //             id="errcode"
                                                //             required
                                                //         ></input>
                                                //         <button>
                                                //             <IoMdAdd size={20} />
                                                //         </button>
                                                //     </form>

                                                <button className="DAT_Err_Content_Tit_AddNew-Form"
                                                    id="addr"
                                                    onClick={(e) => handleAdd(e)}
                                                >
                                                    <span>
                                                        <IoMdAdd color="white" size={20} />
                                                        &nbsp;
                                                        Thêm địa chỉ
                                                    </span>
                                                </button>
                                                // </>
                                            );
                                        case "reader":
                                            return (
                                                // <>
                                                //     <form className="DAT_Err_Content_Tit_AddNew-Form"
                                                //         onSubmit={(e) => handleAddReader(e)}>
                                                //         <input
                                                //             placeholder="Thêm mã lỗi"
                                                //             id="errid"
                                                //             required
                                                //         ></input>
                                                //         <button>
                                                //             <IoMdAdd size={20} />
                                                //         </button>
                                                //     </form>
                                                // </>

                                                <button className="DAT_Err_Content_Tit_AddNew-Form"
                                                    id="code"
                                                    onClick={(e) => handleAdd(e)}
                                                >
                                                    <span>
                                                        <IoMdAdd color="white" size={20} />
                                                        &nbsp;
                                                        Thêm mã lỗi
                                                    </span>
                                                </button>
                                            );
                                        default:
                                            <></>;
                                    }
                                })()}
                            </div>
                        </div>

                        <div className="DAT_Err_Content_Main">
                            <div className="DAT_Err_Content_Main_Nav">
                                <div className="DAT_Err_Content_Main_Nav_Item">
                                    <div
                                        className="DAT_Err_Content_Main_Nav_Item_Content"
                                        id="errlist"
                                        style={{ color: nav === "errlist" ? color.cur : color.pre }}
                                        onClick={(e) => {
                                            handleNav(e);
                                        }}
                                    >
                                        Danh sách
                                    </div>
                                    <div
                                        className="DAT_Err_Content_Main_Nav_Item_Content"
                                        id="register"
                                        style={{ color: nav === "register" ? color.cur : color.pre }}
                                        onClick={(e) => {
                                            handleNav(e);
                                        }}
                                    >
                                        Thanh ghi
                                    </div>
                                    <div
                                        className="DAT_Err_Content_Main_Nav_Item_Content"
                                        id="reader"
                                        style={{ color: nav === "reader" ? color.cur : color.pre }}
                                        onClick={(e) => {
                                            handleNav(e);
                                        }}
                                    >
                                        Thông tin
                                    </div>
                                </div>
                                {/* HEAD TITLE */}
                                {nav === "register" && deviceid.value !== "" ? (
                                    <div className="DAT_Err_Content_Main_Nav_Add" onClick={(e) => handleUpdate(e)}>
                                        <button
                                            className="DAT_Err_Content_Main_Nav_Add-Save" >
                                            <IoSaveOutline size={20} />
                                        </button>
                                        <span>Lưu</span>
                                    </div>
                                ) : (
                                    <></>
                                )}
                                {nav === "reader" ? (
                                    <></>
                                ) : (
                                    <></>
                                )}
                            </div>

                            {/* SWITCH  */}
                            <div className="DAT_Err_Content_Main_List">
                                {(() => {
                                    switch (nav) {
                                        case "errlist":
                                            return (
                                                <>
                                                    <Listerr username={props.username} filter={filter} />
                                                </>
                                            );
                                        case "register":
                                            return (
                                                <>
                                                    <Register username={props.username} filter={filter} />
                                                </>
                                            );
                                        case "reader":
                                            return (
                                                <>
                                                    <Reader username={props.username} filter={filter} />
                                                </>
                                            );
                                        default:
                                            <></>;
                                    }
                                })()}
                            </div>
                        </div>
                    </div>
                </div >
            ) : (
                <>
                    <div className="DAT_ViewMobile_Container">
                        <div className="DAT_ViewMobile_Container_Head">
                            <BiMessageAltError size={25} color="grey" />
                            <span>{inf.tit}</span>
                        </div>
                        <div className="DAT_ViewMobile_Container_Bar">
                            {/* backgroundColor: tab.value === '1' ? 'rgb(38, 143, 214)' : 'white', */}
                            <div
                                className="DAT_ViewMobile_Container_Bar_project"
                                onClick={() => {
                                    tab.value = "1";
                                }}
                            >
                                <div
                                    className="DAT_ViewMobile_Container_Bar_project_bg"
                                    style={{
                                        height: tab.value === "1" ? "140px" : "200px",
                                        transition: "0.5s",
                                    }}
                                ></div>
                                <div
                                    className="DAT_ViewMobile_Container_Bar_project_add"
                                    style={{
                                        height: tab.value === "1" ? "60px" : "0",
                                        transition: "0.5s",
                                    }}
                                >
                                    <span>Danh sách Gateway</span>
                                </div>
                            </div>
                            <div
                                className="DAT_ViewMobile_Container_Bar_device"
                                onClick={() => {
                                    tab.value = "2";
                                }}
                            >
                                <div
                                    className="DAT_ViewMobile_Container_Bar_device_bg"
                                    style={{
                                        height: tab.value === "2" ? "140px" : "200px",
                                        transition: "0.5s",
                                    }}
                                ></div>
                                <div
                                    className="DAT_ViewMobile_Container_Bar_device_add"
                                    style={{
                                        height: tab.value === "2" ? "60px" : "0",
                                        transition: "0.5s",
                                    }}
                                >
                                    <span>Thêm mã lỗi</span>
                                    <IoIosAddCircle size={30} color="gray" />
                                </div>
                            </div>
                        </div>
                        <div>
                            {tab.value === "1" ? (
                                <Listerr username={props.username} filter={filter} />
                            ) : (
                                <Reader username={props.username} filter={filter} />
                            )}
                        </div>
                    </div>
                </>
            )}

            <div className="DAT_PopupBG" style={{ display: popupState ? "block" : "none" }}>
                <form className="DAT_ErrPopup" onSubmit={(e) => popupType === "addr" ? handleAddRegister(e) : handleAddReader(e)}>
                    <div className="DAT_ErrPopup_Head">
                        <div className="DAT_ErrPopup_Head_Left">
                            {popupType === "addr" ? "Thêm địa chỉ" : "Thêm mã lỗi"}
                        </div>
                        <div className="DAT_ErrPopup_Head_Right">
                            <div className="DAT_ErrPopup_Head_Right_Close"
                                id="Popup_"
                                onMouseEnter={(e) => handlePopup("new")}
                                onMouseLeave={(e) => handlePopup("pre")}
                                onClick={(e) => handleClosePopup(e)}
                            >
                                <IoClose size={25} color="white" />
                            </div>
                        </div>
                    </div>

                    <div className="DAT_ErrPopup_Body">
                        {popupType === "addr"
                            ?
                            <>
                                <span>Thêm địa chỉ</span>
                                <input placeholder="Nhập địa chỉ" id="errcode" required />
                            </>
                            :
                            <>
                                <span>Thêm mã lỗi</span>
                                <input placeholder="Nhập mã lỗi" id="errid" required />
                            </>
                        }
                    </div>

                    <div className="DAT_ErrPopup_Foot">
                        <button>Xác nhận</button>
                    </div>
                </form>
            </div>
        </>
    );
}

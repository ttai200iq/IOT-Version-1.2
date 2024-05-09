import React, { useContext, useEffect, useRef, useState } from "react";
import "./User.scss";
import { useSelector } from "react-redux";
import axios from "axios";
import { host } from "../constant";
import { useIntl } from "react-intl";
import { AlertContext } from "../Context/AlertContext";
import { IoClose } from "react-icons/io5";
import { editUser } from "./User";
import { data } from "./Listuser";
import { isBrowser } from "react-device-detect";

export default function Info(props) {
    const type = useSelector((state) => state.admin.type)
    const user = useSelector((state) => state.admin.user)
    const userName = useRef("");
    const mail = useRef("");
    const pass = useRef("");
    const authpass = useRef("");
    const fullname = useRef("");
    const { alertDispatch } = useContext(AlertContext);
    const dataLang = useIntl();
    const [gettype, setGettype] = useState("");


    useEffect(() => {
        if (type === "master") {
            setGettype("admin");
        } else {
            setGettype("user");
        }
    }, []);

    const handleSave = (e) => {
        e.preventDefault();
        if (pass.current.value === authpass.current.value) {
            axios
                .post(
                    host.DEVICE + "/createAcount",
                    {
                        user: userName.current.value,
                        username: fullname.current.value,
                        mail: mail.current.value,
                        pass: authpass.current.value,
                        type: gettype,
                        admin: user,
                        manager: userName.current.value,
                    },
                    { withCredentials: true }
                )
                .then(function (res) {
                    // console.log(res.data);
                    if (res.data.status) {
                        alertDispatch({
                            type: "LOAD_CONTENT",
                            payload: {
                                content: dataLang.formatMessage({ id: "alert_12" }),
                                show: "block",
                            },
                        });
                        editUser.value = false;

                        axios.post(host.DEVICE + "/getAcount", { admin: user }, { withCredentials: true }).then(
                            function (res) {
                                var newData = res.data.map((data, index) => {
                                    data["id"] = index + 1;
                                    return data;
                                });
                                data.value = newData;
                            })

                    } else {
                        switch (res.data.number) {
                            case 1:
                                alertDispatch({
                                    type: "LOAD_CONTENT",
                                    payload: {
                                        content: dataLang.formatMessage({ id: "alert_10" }),
                                        show: "block",
                                    },
                                });
                                break;
                            case 2:
                                alertDispatch({
                                    type: "LOAD_CONTENT",
                                    payload: {
                                        content: dataLang.formatMessage({ id: "alert_11" }),
                                        show: "block",
                                    },
                                });
                                break;
                            default:
                                alertDispatch({
                                    type: "LOAD_CONTENT",
                                    payload: {
                                        content: dataLang.formatMessage({ id: "alert_3" }),
                                        show: "block",
                                    },
                                });
                                break;
                        }
                    }
                });
        } else {
            alertDispatch({
                type: "LOAD_CONTENT",
                payload: {
                    content: dataLang.formatMessage({ id: "alert_22" }),
                    show: "block",
                },
            });
        }
        //console.log(userName.current.value, mail.current.value, pass.current.value, authpass.current.value, fullname.current.value, id.current.value)
    };


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

    // Handle close when press ESC
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                editUser.value = false
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
            {isBrowser
                ?
                <div className="DAT_Info">
                    <form className="DAT_Info_Form" onSubmit={(e) => handleSave(e)}>
                        <div className="DAT_Info_Form_Head">
                            <div className="DAT_Info_Form_Head_Left">Thêm người dùng</div>
                            <div className="DAT_Info_Form_Head_Right">
                                <div className="DAT_Info_Form_Head_Right_Icon">
                                    <div
                                        id="Popup"
                                        onMouseEnter={(e) => handlePopup("new")}
                                        onMouseLeave={(e) => handlePopup("pre")}
                                        onClick={() => editUser.value = false}
                                    >
                                        <IoClose size={25} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="DAT_Info_Form_Body">
                            <div className="DAT_Info_Form_Body_Left">
                                <div className="DAT_Info_Form_Body_Left_Row" >
                                    <label>
                                        <span style={{ color: "red" }}>*</span>
                                        &nbsp;
                                        Tên
                                    </label>
                                    <div className="DAT_Info_Form_Body_Left_Row_Item">
                                        <div className="DAT_Info_Form_Body_Left_Row_Item_Input">
                                            <input type="text" placeholder="Nhập tên" ref={fullname} required />
                                        </div>
                                    </div>

                                    <label>
                                        <span style={{ color: "red" }}>*</span>
                                        &nbsp;
                                        Email
                                    </label>
                                    <div className="DAT_Info_Form_Body_Left_Row_Item">
                                        <div className="DAT_Info_Form_Body_Left_Row_Item_Input">
                                            <input type="email" placeholder="Nhập Email" ref={mail} required />
                                        </div>
                                    </div>
                                </div>

                                <div className="DAT_Info_Form_Body_Left_Row">
                                    <label>
                                        <span style={{ color: "red" }}>*</span>
                                        &nbsp;
                                        Tài khoản
                                    </label>
                                    <div className="DAT_Info_Form_Body_Left_Row_Item">
                                        <div className="DAT_Info_Form_Body_Left_Row_Item_Input">
                                            <input type="text" placeholder="Tài khoản" ref={userName} required />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="DAT_Info_Form_Body_Right">
                                <div className="DAT_Info_Form_Body_Right_Row">
                                    <label>
                                        <span style={{ color: "red" }}>*</span>
                                        &nbsp;
                                        Mật khẩu
                                    </label>
                                    <div className="DAT_Info_Form_Body_Right_Row_Item">
                                        <div className="DAT_Info_Form_Body_Right_Row_Item_Input">
                                            <input type="password" placeholder="Nhập mật khẩu" ref={pass} required />
                                        </div>
                                    </div>
                                </div>

                                <div className="DAT_Info_Form_Body_Right_Row">
                                    <label>
                                        <span style={{ color: "red" }}>*</span>
                                        &nbsp;
                                        Xác nhận mật khẩu
                                    </label>
                                    <div className="DAT_Info_Form_Body_Right_Row_Item">
                                        <div className="DAT_Info_Form_Body_Right_Row_Item_Input">
                                            <input type="password" placeholder="Nhập lại mật khẩu" ref={authpass} required />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="DAT_Info_Form_Foot">
                            <button className="DAT_Info_Form_Body_Row_Button" >
                                Xác nhận
                            </button>
                        </div>
                    </form>
                </div>
                :
                <form className="DAT_InfoMobile_Form" onSubmit={(e) => handleSave(e)}>
                    <div className="DAT_InfoMobile_Form_Head">
                        <div className="DAT_InfoMobile_Form_Head_Left">
                            <p>Thêm người dùng</p>
                        </div>

                        <div className="DAT_InfoMobile_Form_Head_Right">
                            <div className="DAT_InfoMobile_Form_Head_Right_Icon">
                                <div
                                    id="Popup"
                                    onMouseEnter={(e) => handlePopup("new")}
                                    onMouseLeave={(e) => handlePopup("pre")}
                                    onClick={() => editUser.value = false}
                                >
                                    <IoClose size={25} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="DAT_InfoMobile_Form_Body">
                        <div className="DAT_InfoMobile_Form_Body_Left">
                            <div className="DAT_InfoMobile_Form_Body_Left_Row" >
                                <label>
                                    <span style={{ color: "red" }}>*</span>
                                    &nbsp;
                                    Tên
                                </label>
                                <div className="DAT_InfoMobile_Form_Body_Left_Row_Item">
                                    <div className="DAT_InfoMobile_Form_Body_Left_Row_Item_Input">
                                        <input type="text" placeholder="Nhập tên" ref={fullname} required />
                                    </div>
                                </div>

                                <label>
                                    <span style={{ color: "red" }}>*</span>
                                    &nbsp;
                                    Email
                                </label>
                                <div className="DAT_InfoMobile_Form_Body_Left_Row_Item">
                                    <div className="DAT_InfoMobile_Form_Body_Left_Row_Item_Input">
                                        <input type="email" placeholder="Nhập Email" ref={mail} required />
                                    </div>
                                </div>
                            </div>

                            <div className="DAT_InfoMobile_Form_Body_Left_Row">
                                <label>
                                    <span style={{ color: "red" }}>*</span>
                                    &nbsp;
                                    Tài khoản
                                </label>
                                <div className="DAT_InfoMobile_Form_Body_Left_Row_Item">
                                    <div className="DAT_InfoMobile_Form_Body_Left_Row_Item_Input">
                                        <input type="text" placeholder="Tài khoản" ref={userName} required />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="DAT_InfoMobile_Form_Body_Right">
                            <div className="DAT_InfoMobile_Form_Body_Right_Row">
                                <label>
                                    <span style={{ color: "red" }}>*</span>
                                    &nbsp;
                                    Mật khẩu
                                </label>
                                <div className="DAT_InfoMobile_Form_Body_Right_Row_Item">
                                    <div className="DAT_InfoMobile_Form_Body_Right_Row_Item_Input">
                                        <input type="password" placeholder="Nhập mật khẩu" ref={pass} required />
                                    </div>
                                </div>
                            </div>

                            <div className="DAT_InfoMobile_Form_Body_Right_Row">
                                <label>
                                    <span style={{ color: "red" }}>*</span>
                                    &nbsp;
                                    Xác nhận mật khẩu
                                </label>
                                <div className="DAT_InfoMobile_Form_Body_Right_Row_Item">
                                    <div className="DAT_InfoMobile_Form_Body_Right_Row_Item_Input">
                                        <input type="password" placeholder="Nhập lại mật khẩu" ref={authpass} required />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="DAT_InfoMobile_Form_Foot">
                        <button className="DAT_InfoMobile_Form_Body_Row_Button" >
                            Xác nhận
                        </button>
                    </div>
                </form>
            }
        </>
    );
}

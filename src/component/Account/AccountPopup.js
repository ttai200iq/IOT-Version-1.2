import React, { useContext, useEffect, useRef, useState } from "react";
import "./Account.scss"

import { AlertContext } from "../Context/AlertContext";
import { useIntl } from "react-intl";
import axios from "axios";
import { host } from "../constant";
import { useSelector } from "react-redux";
import { IoClose } from "react-icons/io5";
// import { editPass } from "./Account";
import { LiaEyeSolid, LiaEyeSlashSolid } from "react-icons/lia";

export default function AccountPopup(props) {
    const mail = useRef("");
    const currentPass = useRef("");
    const newPass = useRef("");
    const confirmPass = useRef();
    const { alertDispatch } = useContext(AlertContext);
    const dataLang = useIntl();
    const user = useSelector((state) => state.admin.user)
    const username = useSelector((state) => state.admin.username)
    const email = useSelector((state) => state.admin.mail)
    const [confirmpass, setConfirmpass] = useState(true);
    const [oldpass, setOldpass] = useState(true);
    const [newpass, setNewpass] = useState(true);

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

    const handleSave = (e) => {
        e.preventDefault();

        switch (props.type) {
            case "name":
                console.log("name")
                break;
            case "phone":
                console.log("phone")
                break;
            case "addr":
                console.log("addr")
                break;
            case "mail":
                console.log("mail")
                break;
            case "password":
                if (newPass.current.value !== currentPass.current.value) {
                    if (newPass.current.value === confirmPass.current.value) {
                        // console.log(props.username)
                        axios.post(host.DEVICE + "/changePassword", { user: user, mail: mail.current.value, curpwd: currentPass.current.value, newpwd: confirmPass.current.value }, { withCredentials: true }).then(
                            function (res) {
                                // console.log(res.data)
                                if (res.data.status) {
                                    alertDispatch({ type: 'LOAD_CONTENT', payload: { content: dataLang.formatMessage({ id: "alert_24" }), show: 'block' } })
                                } else {
                                    switch (res.data.number) {
                                        case 1:
                                            alertDispatch({ type: 'LOAD_CONTENT', payload: { content: dataLang.formatMessage({ id: "alert_20" }), show: 'block' } })
                                            break
                                        case 2:
                                            alertDispatch({ type: 'LOAD_CONTENT', payload: { content: dataLang.formatMessage({ id: "alert_21" }), show: 'block' } })
                                            break
                                        default:
                                            alertDispatch({ type: 'LOAD_CONTENT', payload: { content: dataLang.formatMessage({ id: "alert_3" }), show: 'block' } })
                                            break

                                    }
                                }
                            })

                    } else {
                        alertDispatch({ type: 'LOAD_CONTENT', payload: { content: dataLang.formatMessage({ id: "alert_22" }), show: 'block' } })
                    }
                } else {
                    alertDispatch({ type: 'LOAD_CONTENT', payload: { content: dataLang.formatMessage({ id: "alert_23" }), show: 'block' } })
                }
                break;
            default:
                break;
        }
    };

    // Handle close when press ESC
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                props.handleClose();
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
            {(() => {
                switch (props.type) {
                    case "name":
                        return <div className="DAT_Security">
                            <form className="DAT_Security_Form" onSubmit={(e) => handleSave(e)}>
                                <div className="DAT_Security_Form_Head">
                                    <div className="DAT_Security_Form_Head_Left">Đổi tên</div>
                                    <div className="DAT_Security_Form_Head_Right">
                                        <div className="DAT_Security_Form_Head_Right_Icon"
                                            id="Popup"
                                            onMouseEnter={(e) => handlePopup("new")}
                                            onMouseLeave={(e) => handlePopup("pre")}
                                            onClick={() => props.handleClose()}
                                        >
                                            <IoClose size={25} color="white" />
                                        </div>
                                    </div>
                                </div>

                                <div className="DAT_Security_Form_Body">
                                    <div className="DAT_Security_Form_Body_Row">
                                        <label>
                                            Tên
                                        </label>
                                        <div className="DAT_Security_Form_Body_Row_Item">
                                            <div className="DAT_Security_Form_Body_Row_Item_Input">
                                                <input type="text" placeholder="Nhập tên" defaultValue={username} required />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="DAT_Security_Form_Foot">
                                    <button className="DAT_Security_Form_Body_Row_Button" >
                                        Xác nhận
                                    </button>
                                </div>
                            </form >
                        </div >
                    case "phone":
                        return <div className="DAT_Security">
                            <form className="DAT_Security_Form" onSubmit={(e) => handleSave(e)}>
                                <div className="DAT_Security_Form_Head">
                                    <div className="DAT_Security_Form_Head_Left">Đổi số điện thoại</div>
                                    <div className="DAT_Security_Form_Head_Right">
                                        <div className="DAT_Security_Form_Head_Right_Icon"
                                            id="Popup"
                                            onMouseEnter={(e) => handlePopup("new")}
                                            onMouseLeave={(e) => handlePopup("pre")}
                                            onClick={() => props.handleClose()}
                                        >
                                            <IoClose size={25} />
                                        </div>
                                    </div>
                                </div>

                                <div className="DAT_Security_Form_Body">
                                    <div className="DAT_Security_Form_Body_Row">
                                        <label>
                                            Số điện thoại
                                        </label>
                                        <div className="DAT_Security_Form_Body_Row_Item">
                                            <div className="DAT_Security_Form_Body_Row_Item_Input">
                                                <input type="text" placeholder="Nhập số điện thoại" required />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="DAT_Security_Form_Foot">
                                    <button className="DAT_Security_Form_Body_Row_Button" >
                                        Xác nhận
                                    </button>
                                </div>
                            </form >
                        </div >
                    case "addr":
                        return <div className="DAT_Security">
                            <form className="DAT_Security_Form" onSubmit={(e) => handleSave(e)}>
                                <div className="DAT_Security_Form_Head">
                                    <div className="DAT_Security_Form_Head_Left">Đổi địa chỉ</div>
                                    <div className="DAT_Security_Form_Head_Right">
                                        <div className="DAT_Security_Form_Head_Right_Icon"
                                            id="Popup"
                                            onMouseEnter={(e) => handlePopup("new")}
                                            onMouseLeave={(e) => handlePopup("pre")}
                                            onClick={() => props.handleClose()}
                                        >
                                            <IoClose size={25} />
                                        </div>
                                    </div>
                                </div>

                                <div className="DAT_Security_Form_Body">
                                    <div className="DAT_Security_Form_Body_Row">
                                        <label>
                                            Địa chỉ
                                        </label>
                                        <div className="DAT_Security_Form_Body_Row_Item">
                                            <div className="DAT_Security_Form_Body_Row_Item_Input">
                                                <input type="text" placeholder="Nhập địa chỉ" required />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="DAT_Security_Form_Foot">
                                    <button className="DAT_Security_Form_Body_Row_Button" >
                                        Xác nhận
                                    </button>
                                </div>
                            </form >
                        </div >
                    case "mail":
                        return <div className="DAT_Security">
                            <form className="DAT_Security_Form" onSubmit={(e) => handleSave(e)}>
                                <div className="DAT_Security_Form_Head">
                                    <div className="DAT_Security_Form_Head_Left">Đổi mail</div>
                                    <div className="DAT_Security_Form_Head_Right">
                                        <div className="DAT_Security_Form_Head_Right_Icon"
                                            id="Popup"
                                            onMouseEnter={(e) => handlePopup("new")}
                                            onMouseLeave={(e) => handlePopup("pre")}
                                            onClick={() => props.handleClose()}
                                        >
                                            <IoClose size={25} />
                                        </div>
                                    </div>
                                </div>

                                <div className="DAT_Security_Form_Body">
                                    <div className="DAT_Security_Form_Body_Row">
                                        <label>
                                            Mail
                                        </label>
                                        <div className="DAT_Security_Form_Body_Row_Item">
                                            <div className="DAT_Security_Form_Body_Row_Item_Input">
                                                <input type="email" placeholder="Nhập mail" defaultValue={email} required />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="DAT_Security_Form_Foot">
                                    <button className="DAT_Security_Form_Body_Row_Button" >
                                        Xác nhận
                                    </button>
                                </div>
                            </form >
                        </div >
                    case "password":
                        return <div className="DAT_Security">
                            <form className="DAT_Security_Form" onSubmit={(e) => handleSave(e)}>
                                <div className="DAT_Security_Form_Head">
                                    <div className="DAT_Security_Form_Head_Left">Đổi mật khẩu</div>
                                    <div className="DAT_Security_Form_Head_Right">
                                        <div className="DAT_Security_Form_Head_Right_Icon"
                                            id="Popup"
                                            onMouseEnter={(e) => handlePopup("new")}
                                            onMouseLeave={(e) => handlePopup("pre")}
                                            onClick={() => props.handleClose()}
                                        >
                                            <IoClose size={25} />
                                        </div>
                                    </div>
                                </div>

                                <div className="DAT_Security_Form_Body">
                                    <div className="DAT_Security_Form_Body_Row">
                                        <label>
                                            Email
                                        </label>
                                        <div className="DAT_Security_Form_Body_Row_Item">
                                            <div className="DAT_Security_Form_Body_Row_Item_Input">
                                                <input type="email" placeholder="Nhập Email" ref={mail} required />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="DAT_Security_Form_Body_Row">
                                        <label>
                                            Mật khẩu hiện tại
                                        </label>
                                        <div className="DAT_Security_Form_Body_Row_Item">
                                            <div className="DAT_Security_Form_Body_Row_Item_Input">
                                                <input type={oldpass === true ? "password" : "text"}
                                                    ref={currentPass}
                                                    placeholder="Mật Khẩu Hiện Tại" minLength={6}
                                                    required />
                                                <label onClick={() => setOldpass(!oldpass)}>
                                                    {oldpass === false ? (
                                                        <LiaEyeSolid size={20} />
                                                    ) : (
                                                        <LiaEyeSlashSolid size={20} />
                                                    )}
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="DAT_Security_Form_Body_Row">
                                        <label>
                                            Mật khẩu mới
                                        </label>
                                        <div className="DAT_Security_Form_Body_Row_Item">
                                            <div className="DAT_Security_Form_Body_Row_Item_Input">
                                                <input type={newpass === true ? "password" : "text"}
                                                    ref={newPass}
                                                    placeholder="Mật Khẩu Mới"
                                                    minLength={6} required />
                                                <label>
                                                    {newpass === false ? (
                                                        <LiaEyeSolid
                                                            size={20}
                                                            onClick={() => setNewpass(!newpass)}
                                                        />
                                                    ) : (
                                                        <LiaEyeSlashSolid
                                                            size={20}
                                                            onClick={() => setNewpass(!newpass)}
                                                        />
                                                    )}
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="DAT_Security_Form_Body_Row">
                                        <label>
                                            Xác nhận mật khẩu mới
                                        </label>
                                        <div className="DAT_Security_Form_Body_Row_Item">
                                            <div className="DAT_Security_Form_Body_Row_Item_Input">
                                                <input
                                                    type={confirmpass === true ? "password" : "text"}
                                                    ref={confirmPass}
                                                    placeholder="Nhập Lại Mật Khẩu Mới"
                                                    minLength={6} required />
                                                <label onClick={() => setConfirmpass(!confirmpass)}>
                                                    {confirmpass === false ? (
                                                        <LiaEyeSolid size={20} />
                                                    ) : (
                                                        <LiaEyeSlashSolid size={20} />
                                                    )}
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="DAT_Security_Form_Foot">
                                    <button className="DAT_Security_Form_Body_Row_Button" >
                                        Xác nhận
                                    </button>
                                </div>
                            </form >
                        </div >
                    default:
                        return <></>
                }
            })()}
        </>
    );
}
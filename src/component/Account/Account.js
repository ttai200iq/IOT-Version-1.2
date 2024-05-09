import React, { useEffect, useState } from "react";
import "./Account.scss"

import { Link } from "react-router-dom";
import AccountPopup from "./AccountPopup";
import Contact from "./AccountInfo";
import { signal } from "@preact/signals-react";
import { isBrowser } from "react-device-detect";
import { PiUserCircleLight } from "react-icons/pi";

export const editPass = signal(false)

export default function Acount(props) {
    const banner = "linear-gradient(140deg, #0061f2, #6900c7)"
    const inf = { code: 'Report', tit: 'Tài khoản' }
    const direct = [{ id: 'home', text: 'Trang chủ' }, { id: 'list', text: inf.tit }]
    const [popupState, setPopupState] = useState(false);
    const [popupType, setPopupType] = useState("");

    // const type = useSelector((state) => state.admin.type)

    // const color = {
    //     cur: "blue",
    //     pre: "black"
    // }

    // const [nav, setNav] = useState("contact");

    const handlePopup = () => {
        setPopupState(true);
    };

    const handleClosePopup = () => {
        setPopupState(false);
    };

    const handleType = (type) => {
        setPopupType(type);
    };

    // useEffect(() => {
    //     console.log(popupState)
    //     console.log(popupType)
    // }, [popupState, popupType])

    return (
        <>
            {isBrowser
                ?
                <div className="DAT_Account" >
                    <div className="DAT_Account_Banner" style={{ backgroundImage: banner, backgroundPosition: "bottom", backgroundRepeat: "no-repeat", backgroundSize: "cover" }}>
                        {/* <div className="DAT_AcountTop-shadow" ></div> */}
                    </div>

                    <div className="DAT_Account_Content">
                        <div className="DAT_Account_Content_Direct" >
                            {direct.map((data, index) => {
                                return (
                                    (index === 0)
                                        ? <Link key={index} to="/"
                                            style={{ textDecoration: 'none', color: "white", fontFamily: "Montserrat-SemiBold" }}
                                        >
                                            <span style={{ cursor: "pointer" }}> {data.text}</span>
                                        </Link>
                                        : <span key={index} id={data.id + "_DIR"} style={{ cursor: "pointer" }}> {' > ' + data.text}</span>
                                )
                            })}
                        </div>

                        <div className="DAT_Account_Content_Tit">
                            <div className="DAT_Account_Content_Tit-icon">
                                <PiUserCircleLight size={30} color="white" />
                            </div>
                            <div className="DAT_Account_Content_Tit-content" >{inf.tit}</div>
                        </div>

                        <div className="DAT_Account_Content_Main">
                            <div className="DAT_Account_Content_Main_New">
                                <Contact username={props.username} handlePopup={handlePopup} handleType={handleType} />
                            </div>
                        </div>
                    </div>

                    <div className="DAT_PopupBG" style={{ height: popupState ? "100vh" : "0" }}>
                        {popupState ? <AccountPopup username={props.username} handleClose={handleClosePopup} type={popupType} /> : <></>}
                    </div>
                </div>
                :
                <div className="DAT_AccountMobile">
                    <div className="DAT_AccountMobile_Head" >
                        <PiUserCircleLight size={25} color="gray" />
                        <span>{inf.tit}</span>
                    </div>

                    <div className="DAT_AccountMobile_Container">
                        <Contact username={props.username} handlePopup={handlePopup} handleType={handleType} />
                    </div>

                    <div className="DAT_PopupBG" style={{ height: popupState ? "100vh" : "0" }}>
                        {popupState ? <AccountPopup username={props.username} handleClose={handleClosePopup} type={popupType} /> : <></>}
                    </div>
                </div>
            }
        </>
    )
}
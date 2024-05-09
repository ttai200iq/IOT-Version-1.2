import React, { useEffect } from "react";
import "./Default.scss"
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { host } from "../constant";
import { effect, signal } from "@preact/signals-react";
import { pageDefault } from "../../App";
import { useSelector } from "react-redux";
import { list } from "../../App"

export default function Default(props) {




    const code = {
        AUTO: 'Tự động hóa',
        SOL: 'Năng lượng mặt trời',
        ELEV: 'Thang máy',
        UPS: 'UPS',
    }



    const handePage = (e) => {
        // console.log(e.currentTarget.id)
        const arr = e.currentTarget.id.split('_')
        //localStorage.setItem('pageDefault', JSON.stringify({ status: true, type: arr[0], id: arr[2], code: arr[1] }))
        //pageDefault.value = { status: true, type: arr[0], id: arr[2], code: arr[1] }
        // console.log(props.username)
        const setDefault = async () => {
            await axios.post(`${host.DEVICE}/setDefault`, { user: props.username, page: { status: true, type: arr[0], id: arr[2], code: arr[1], deviceid: 'none' } })
                .then(
                    function (res) {

                        // console.log(res.data)
                        if (res.data.status) {
                            pageDefault.value = { status: true, type: arr[0], id: arr[2], code: arr[1], deviceid: 'none' }
                        }
                    }
                )
        }

        setDefault();
    }


    return (
        <>
            <div className="DAT_Default" >
                <div className="DAT_Default_Content">
                    {(list.value.length > 0) ? <div className="DAT_Default_Content-Title"><ion-icon name="logo-windows"></ion-icon> <span>Trang mặc định</span></div> : <div className="DAT_Default_Content-Title"><ion-icon name="logo-windows"></ion-icon> <span>Thông báo</span></div>}
                    <div className="DAT_Default_Content-List">
                        {(list.value.length > 0)
                            ?
                            <>
                                {list.value.map((data, i) => {
                                    return <div className="DAT_Default_Content-List-Item" key={i} id={`${data.type}_${data.code}_${data.id}`} onClick={(e) => { handePage(e) }} > {i + 1}: <span style={{ color: 'blue' }}>{data.id}</span> - {code[data.code]}</div>
                                })}
                            </>
                            : <div className="DAT_Default_Content-List-NoItem" >Khoan đã! tài khoản của bạn chưa có dự án hoặc thiết bị nào, vui lòng lòng liên hệ đến quản trị viên!</div>
                        }

                    </div>
                </div>
            </div>

        </>
    )
}
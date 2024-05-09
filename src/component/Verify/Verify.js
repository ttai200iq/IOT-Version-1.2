import React, { useEffect, useState } from 'react';
import "./Verify.scss"
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { host } from '../constant';

function Verify(props) {
    const [searchParams, setSearchParams] = useSearchParams();
    const [notif, setNotif] = useState();

    useEffect(() => {
        var id = searchParams.get("id")
        if (id === null) {
            setNotif("Link Error!")
        } else {
            axios.get(host.AUTH + '/Verify?id=' + id, { secure: true, reconnect: true }).then(
                function (res) {
                    // console.log(res.data)
                    if (res.data.status) {
                        setNotif("Đổi mật khẩu thành công!")
                    } else {
                        if (res.data.no === 1) {
                            setNotif("Link này không còn hiệu lực, bạn vui lòng thực hiện lại!")
                        } else if (res.data.no === 2) {
                            setNotif("Email không đúng, bạn vui lòng liên hệ đến quản trị viên!")
                        } else {
                            setNotif("Khoan đã! mật khẩu nãy đã được dùng, vui lòng thực hiện lại.")
                        }
                    }
                })
        }
    }, [])


    return (
        <div className='DAT_Verify'>
            <div className='DAT_Verify_Content'>
                <div className='DAT_Verify_Content_Notif'>{notif}</div>
                <a href='/Login' className='DAT_Verify_Content_Back'>Đăng nhập</a>
            </div>
        </div>
    );
}

export default Verify;
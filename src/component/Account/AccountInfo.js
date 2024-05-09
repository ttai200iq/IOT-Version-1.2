import React, { useContext, useEffect, useState } from 'react';
import "./Account.scss"

import { avatar } from '../MenuTop/MenuTop';
import { host } from '../constant';
import { AlertContext } from '../Context/AlertContext';
import { action } from '../Control/Action';
import axios from 'axios';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import Resizer from "react-image-file-resizer";
import { isBrowser } from 'react-device-detect';
import { signal } from '@preact/signals-react';

export const editAccount = signal(false)

export default function Contact(props) {
    const dataLang = useIntl();
    const { alertDispatch } = useContext(AlertContext);
    const user = useSelector((state) => state.admin.user)
    const username = useSelector((state) => state.admin.username)
    const mail = useSelector((state) => state.admin.mail)
    const [contact, setContact] = useState({
        name: '',
        addr: '',
        phone: '',
    });

    useEffect(() => {
        // console.log(props.username)
        axios.post(host.DEVICE + "/getContact", { user: user }, { secure: true, reconnect: true })
            .then((res) => {
                // console.log(res.data)
                if (res.data.status) {
                    setContact({
                        name: res.data.data.name,
                        addr: res.data.data.addr,
                        phone: res.data.data.phone,
                    })
                }
            })

        // eslint-disable-next-line
    }, [])

    const resizeFilAvatar = (file) =>
        new Promise((resolve) => {
            Resizer.imageFileResizer(
                file,
                180,
                180,
                "PNG",
                100,
                0,
                (uri) => {
                    resolve(uri);
                },
                "file"
            );
        });

    const handleAvatar = async (e) => {
        var reader = new FileReader();
        // console.log("old size", e.target.files[0].size)
        if (e.target.files[0].size > 50000) {
            const image = await resizeFilAvatar(e.target.files[0]);
            // console.log(image.size)

            reader.readAsDataURL(image);

            reader.onload = () => {
                // setAllImage(reader.result)
                //console.log("base 64 new", reader.result)
                avatar.value = reader.result;
                axios.post(host.DEVICE + "/setAvatar", { user: user, img: avatar.value }, { credential: true }, { headers: { "Content-Type": "multipart/form-data" }, })
                    .then((res) => {
                        //console.log(res.data)
                        if (res.data.status) {
                            alertDispatch(action('LOAD_CONTENT', { content: dataLang.formatMessage({ id: "alert_5" }), show: 'block' }))
                        } else {
                            alertDispatch(action('LOAD_CONTENT', { content: dataLang.formatMessage({ id: "alert_3" }), show: 'block' }))
                        }
                    })
                // setSize(e.target.files[0].size);
            };
        } else {
            reader.readAsDataURL(e.target.files[0]);
            // console.log(e.target.files[0].size)
            reader.onload = () => {
                // setAllImage(reader.result)
                //console.log("base 64 new", String(reader.result))
                avatar.value = reader.result;
                axios.post(host.DEVICE + "/setAvatar", { user: user, img: avatar.value }, { credential: true }, { headers: { "Content-Type": "multipart/form-data" }, })
                    .then((res) => {
                        //console.log(res.data)
                        if (res.data.status) {
                            alertDispatch(action('LOAD_CONTENT', { content: dataLang.formatMessage({ id: "alert_5" }), show: 'block' }))
                        } else {
                            alertDispatch(action('LOAD_CONTENT', { content: dataLang.formatMessage({ id: "alert_3" }), show: 'block' }))
                        }
                    })
                // setSize(e.target.files[0].size);
            };
        }
    }

    return (
        <>
            {isBrowser
                ?
                <div className='DAT_AccountInfo' >
                    <div className='DAT_AccountInfo_Item'>
                        <div className='DAT_AccountInfo_Item_Content'>
                            <div className='DAT_AccountInfo_Item_Content_Tit'>
                                Ảnh đại diện:
                            </div>
                            <img src={avatar.value === '' ? '/dat_icon/user_manager.png' : avatar.value} alt="" />
                            <input accept="image/*" id="file_avatar" type="file" hidden onChange={e => handleAvatar(e)} />
                        </div>
                        <label htmlFor="file_avatar" className='DAT_AccountInfo_Item-add' >Thay đổi</label>
                    </div>

                    <div className='DAT_AccountInfo_Item'>
                        <div className='DAT_AccountInfo_Item_Content'>
                            <div className='DAT_AccountInfo_Item_Content_Tit'>
                                Tên:
                            </div>
                            <div className='DAT_AccountInfo_Item_Content_Label'>
                                {username}
                            </div>
                        </div>
                        <span onClick={() => { props.handlePopup(); props.handleType("name") }}>Thay đổi</span>
                    </div>

                    <div className='DAT_AccountInfo_Item'>
                        <div className='DAT_AccountInfo_Item_Content'>
                            <div className='DAT_AccountInfo_Item_Content_Tit'>
                                Số điện thoại:
                            </div>
                            <div className='DAT_AccountInfo_Item_Content_Label'>
                                __
                            </div>
                        </div>
                        <span onClick={() => { props.handlePopup(); props.handleType("phone") }}>Thay đổi</span>
                    </div>

                    <div className='DAT_AccountInfo_Item'>
                        <div className='DAT_AccountInfo_Item_Content'>
                            <div className='DAT_AccountInfo_Item_Content_Tit'>
                                Địa chỉ:
                            </div>
                            <div className='DAT_AccountInfo_Item_Content_Label'>
                                __
                            </div>
                        </div>
                        <span onClick={() => { props.handlePopup(); props.handleType("addr") }}>Thay đổi</span>
                    </div>

                    <div className='DAT_AccountInfo_Item'>
                        <div className='DAT_AccountInfo_Item_Content'>
                            <div className='DAT_AccountInfo_Item_Content_Tit'>
                                Mail:
                            </div>
                            <div className='DAT_AccountInfo_Item_Content_Label'>
                                {mail}
                            </div>
                        </div>
                        <span onClick={() => { props.handlePopup(); props.handleType("mail") }}>Thay đổi</span>
                    </div>

                    <div className='DAT_AccountInfo_Item'>
                        <div className='DAT_AccountInfo_Item_Content'>
                            <div className='DAT_AccountInfo_Item_Content_Tit'>
                                Mật khẩu:
                            </div>
                            <div className='DAT_AccountInfo_Item_Content_Label'>
                                ********
                            </div>
                        </div>
                        <span onClick={() => { props.handlePopup(); props.handleType("password") }}>Thay đổi</span>
                    </div>
                </div >
                :
                <div className='DAT_AccountInfo_Mobile'>
                    <div className='DAT_AccountInfo_Mobile_Item'>
                        <div className='DAT_AccountInfo_Mobile_Item_Content'>
                            <div className='DAT_AccountInfo_Mobile_Item_Content_Tit'>
                                Ảnh đại diện:
                            </div>
                            <div>
                                <img src={avatar.value === '' ? '/dat_icon/user_manager.png' : avatar.value} alt="" />
                                <input accept="image/*" id="file_avatar" type="file" hidden onChange={e => handleAvatar(e)} />
                            </div>
                        </div>
                        <label htmlFor="file_avatar" className='DAT_AccountInfo_Mobile_Item-add' >Thay đổi</label>
                    </div>

                    <div className='DAT_AccountInfo_Mobile_Item'>
                        <div className='DAT_AccountInfo_Mobile_Item_Content'>
                            <div className='DAT_AccountInfo_Mobile_Item_Content_Tit'>
                                Tên:
                            </div>
                            <div className='DAT_AccountInfo_Mobile_Item_Content_Label'>
                                {username}
                            </div>
                        </div>
                        <span onClick={() => { props.handlePopup(); props.handleType("name") }}>Thay đổi</span>
                    </div>

                    <div className='DAT_AccountInfo_Mobile_Item'>
                        <div className='DAT_AccountInfo_Mobile_Item_Content'>
                            <div className='DAT_AccountInfo_Mobile_Item_Content_Tit'>
                                Số điện thoại:
                            </div>
                            <div className='DAT_AccountInfo_Mobile_Item_Content_Label'>
                                __
                            </div>
                        </div>
                        <span onClick={() => { props.handlePopup(); props.handleType("phone") }}>Thay đổi</span>
                    </div>

                    <div className='DAT_AccountInfo_Mobile_Item'>
                        <div className='DAT_AccountInfo_Mobile_Item_Content'>
                            <div className='DAT_AccountInfo_Mobile_Item_Content_Tit'>
                                Địa chỉ:
                            </div>
                            <div className='DAT_AccountInfo_Mobile_Item_Content_Label'>
                                __
                            </div>
                        </div>
                        <span onClick={() => { props.handlePopup(); props.handleType("addr") }}>Thay đổi</span>
                    </div>

                    <div className='DAT_AccountInfo_Mobile_Item'>
                        <div className='DAT_AccountInfo_Mobile_Item_Content'>
                            <div className='DAT_AccountInfo_Mobile_Item_Content_Tit'>
                                Mail:
                            </div>
                            <div className='DAT_AccountInfo_Mobile_Item_Content_Label'>
                                {mail}
                            </div>
                        </div>
                        <span onClick={() => { props.handlePopup(); props.handleType("mail") }}>Thay đổi</span>
                    </div>

                    <div className='DAT_AccountInfo_Mobile_Item'>
                        <div className='DAT_AccountInfo_Mobile_Item_Content'>
                            <div className='DAT_AccountInfo_Mobile_Item_Content_Tit'>
                                Mật khẩu:
                            </div>
                            <div className='DAT_AccountInfo_Mobile_Item_Content_Label'>
                                ********
                            </div>
                        </div>
                        <span onClick={() => { props.handlePopup(); props.handleType("password") }}>Thay đổi</span>
                    </div>
                </div>
            }
        </>
    );
}

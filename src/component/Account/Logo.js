import React, { useContext } from 'react';
import './Account.scss';

import { RiImageAddLine } from "react-icons/ri";
import Resizer from "react-image-file-resizer";
import { host } from '../constant';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { logo } from '../MenuTop/MenuTop';
import { useIntl } from 'react-intl';
import { AlertContext } from '../Context/AlertContext';
import { action } from '../Control/Action';

export default function Logo(props) {
    const dataLang = useIntl();
    const { alertDispatch } = useContext(AlertContext);
    const user = useSelector((state) => state.admin.user)

    const resizeFile = (file) =>
        new Promise((resolve) => {
            Resizer.imageFileResizer(
                file,
                150,
                150,
                "PNG",
                100,
                0,
                (uri) => {
                    resolve(uri);
                },
                "file"
            );
        });

    const handdeLogo = async (e) => {
        var reader = new FileReader();
        //console.log("old size", e.target.files[0].size)

        if (e.target.files[0].size > 100000) {
            const image = await resizeFile(e.target.files[0]);
            //console.log(image.size)

            reader.readAsDataURL(image);

            reader.onload = () => {
                // setAllImage(reader.result)
                //console.log("base 64 new", reader.result)
                logo.value = reader.result;
                axios.post(host.DEVICE + "/setLogo", { user: user, img: logo.value }, { credential: true }, { headers: { "Content-Type": "multipart/form-data" }, })
                    .then((res) => {
                        // console.log(res.data)
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
                logo.value = reader.result;
                axios.post(host.DEVICE + "/setLogo", { user: user, img: logo.value }, { credential: true }, { headers: { "Content-Type": "multipart/form-data" }, })
                    .then((res) => {
                        // console.log(res.data)
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
        <div className='DAT_Logo'>
            <div className='DAT_Logo-img' >
                <img src={logo.value === '' ? '/dat_icon/logo_DAT.png' : logo.value} alt="" />
            </div>
            <label htmlFor="file" className='DAT_Logo-add' ><RiImageAddLine /></label>
            <input accept="image/*" id="file" type="file" style={{ visibility: "hidden" }} onChange={e => handdeLogo(e)} />
        </div>
    );
}

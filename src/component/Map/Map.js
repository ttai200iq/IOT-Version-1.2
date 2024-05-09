import React, { useEffect } from "react";
import "./Map.scss";
import { useState } from "react";
import { Link } from "react-router-dom";
import { host } from "../constant";
import axios from "axios";
import GoogleMap from "google-maps-react-markers";



const AnyReactComponent = ({ text }) => {
        return (
                <div className="DAT_marker" >
                        <div className="DAT_marker-bg" ></div>
                        <div className="DAT_marker-lb" >{text}</div>

                </div>
        )
}

export default function Map(props) {


        const banner = "url('/banner/Map_banner.png')"
        const icon = <ion-icon name="map-outline"></ion-icon>
        const inf = { code: 'Map', tit: 'Vị trí' }
        const [direct, SetDirect] = useState([{ id: 'home', text: 'Trang chủ' }, { id: 'list', text: inf.tit }])

        const [map, setMap] = useState([])
        //const address = "Ho Chi Minh";



        const defaultProps = {

                center: {
                        lat: 16.054083398111068,
                        lng: 108.20361013247235
                },
                zoom: 7.0
        };


        useEffect(() => {
                // setKey("AIzaSyAD27NSTSc_VBT4vj9fM4CQ6kdknoeZwX0");
                // geocode(RequestType.ADDRESS, address)
                //         .then((response) => {
                //                 console.log(response);
                //         })
                //         .catch((error) => {
                //                 console.error(error);
                //         });
                axios.post(host.DEVICE + "/getlistProject", { username: props.username, group: 'AUTO' }, { secure: true, reconnect: true }).then(
                        function (res) {
                                if (res.data.status) {

                                        // console.log("List project", res.data.data)
                                        setMap(res.data.data)

                                }

                        })
        }, [])

        const handleMap = (e) => {
                // console.log(e.target.value)

                axios.post(host.DEVICE + "/getlistProject", { username: props.username, group: e.target.value }, { secure: true, reconnect: true }).then(
                        function (res) {
                                if (res.data.status) {

                                        // console.log("List project", res.data.data)
                                        setMap(res.data.data)

                                } else {
                                        setMap([])
                                }

                        })

        }


        return (
                <>
                        <div className="DAT_Map">

                                <div className="DAT_Map_Banner" style={{ backgroundImage: banner, backgroundPosition: "center", backgroundRepeat: "no-repeat", backgroundSize: "cover" }}>
                                        <div className="DAT_Map_Banner_Shadow" ></div>
                                </div>
                                <div className="DAT_Map_Content">

                                        <div className="DAT_Map_Content_Direct" >
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
                                        <div className="DAT_Map_Content_Tit">
                                                <div className="DAT_Map_Content_Tit-icon">
                                                        {icon}
                                                </div>

                                                <div className="DAT_Map_Content_Tit-content">{inf.tit}</div>
                                        </div>
                                        <div className="DAT_Map_Content_Main">

                                                <div className="DAT_Map_Content_Main_Nav">
                                                        <div className="DAT_Map_Content_Main_Nav_Item">

                                                        </div>
                                                        <div className="DAT_Map_Content_Main_Nav_Option" onChange={e => handleMap(e)}>
                                                                <select>
                                                                        <option value="AUTO">Tự Động Hóa</option>
                                                                        <option value="ELEV">Thang Máy</option>
                                                                        <option value="SOL">Năng Lương Mặt Trời</option>
                                                                        <option value="UPS">UPS</option>
                                                                </select>
                                                        </div>

                                                </div>



                                                <div className="DAT_Map_Content_Main_Map">

                                                        <GoogleMap
                                                                apiKey={process.env.REACT_APP_GGKEY}

                                                                defaultCenter={defaultProps.center}
                                                                defaultZoom={defaultProps.zoom}
                                                        //onGoogleApiLoaded={onGoogleApiLoaded}


                                                        >



                                                                {map.map((data, index) => (
                                                                        <AnyReactComponent
                                                                                key={index}
                                                                                lat={parseFloat(data.lat)}
                                                                                lng={parseFloat(data.lng)}
                                                                                text={data.name}
                                                                                markerId={data.name}

                                                                        />
                                                                ))}

                                                        </GoogleMap>
                                                </div>
                                        </div>


                                </div>
                        </div>

                </>
        );

}


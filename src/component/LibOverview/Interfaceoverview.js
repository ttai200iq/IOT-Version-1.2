import React, { useContext, useEffect, useState } from "react";
import "./Tooloverview.scss"
import { OverviewContext } from "../Context/OverviewContext";
import Solview from "./Solview";
import Backgound from "./Background";
import Elevview from "./Elevview";
import Autoview from "./Autoview";
//import disableScroll from 'disable-scroll';
import { TransformWrapper, TransformComponent, useControls } from "react-zoom-pan-pinch";
import { useSelector } from "react-redux";
import { TbSettingsCog } from "react-icons/tb";
import Circle from "../Lib/Circle";
import LineChart from "../Lib/LineChart";
import Switch from "../Lib/Switch";
import SwitchToggle from "../Lib/SwitchToggle";
import Input from "../Lib/Input";
import Note from "../Lib/Note";
import Value from "../Lib/Value";
import Valuev2 from "../Lib/Valuev2";
import Dimmer from "../Lib/Dimmer";
import Elevroom from "../Lib/Elevroom";
import Status from "../Lib/Status";
import Arrow from "../Lib/Arrow";
import Led from "../Lib/Led";
import Icon from "../Lib/Icon";
import Timer from "../Lib/Timer";
import Gauge from "../Lib/Gauge";
import Tablepro from "../Lib/Tablepro";
import Picture from "../Lib/Picture";
import View32bit from "../Lib/View32bit";

export default function Interfaceoverview(props) {
    const type = useSelector((state) => state.admin.type)
    const { overview_config, overview_visual, overview_setting, overviewDispatch } = useContext(OverviewContext)
    const [dropdowm, setDropdown] = useState(false)
    //const [isZoomSVG, setIsZoomSVG] = useState(false)
    const [invt, setInvt] = useState({})
    const [zoom, setZoom] = useState(true)
    const ZoomState = () => {
        if (zoom) {
            setZoom(false)
        } else {
            setZoom(true)
        }
    }

    const visdata = (type, id, w, h) => {


        switch (type) {
            case 'circle':
                return <Circle id={id} data={invt} setting={overview_setting[id]} width={w} height={h} />
            case 'lineChart':
                return <LineChart id={id} data={invt} setting={overview_setting[id]} width={w} height={h} />
            case 'switch':
                return <Switch deviceid={overview_setting[id].deviceid} tab="0" id={id} data={invt} setting={overview_setting} width={w} height={h} />
            case 'switchtoggle':
                return <SwitchToggle deviceid={overview_setting[id].deviceid} tab="0" id={id} data={invt} setting={overview_setting} width={w} height={h} />
            case 'input':
                return <Input deviceid={overview_setting[id].deviceid} tab="0" id={id} data={invt} setting={overview_setting} width={w} height={h} />
            case 'text':
                return <Note id={id} data={invt} setting={overview_setting[id]} width={w} height={h} />
            case 'view':
                return <Value id={id} data={invt} setting={overview_setting[id]} width={w} height={h} />
            case 'view2':
                return <Valuev2 id={id} data={invt} setting={overview_setting[id]} width={w} height={h} />
            case 'slider':
                return <Dimmer deviceid={overview_setting[id].deviceid} tab="0" id={id} data={invt} setting={overview_setting} width={w} height={h} />
            case 'elev':
                return <Elevroom id={id} data={invt} setting={overview_setting[id]} width={w} height={h} />
            case 'status':
                return <Status id={id} data={invt} setting={overview_setting[id]} width={w} height={h} />
            case 'arrow':
                return <Arrow id={id} data={invt} setting={overview_setting[id]} width={w} height={h} />
            case 'led':
                return <Led id={id} data={invt} setting={overview_setting[id]} width={w} height={h} />
            case 'icon':
                return <Icon id={id} data={invt} setting={overview_setting[id]} width={w} height={h} />
            case 'timer':
                return <Timer id={id} data={invt} setting={overview_setting[id]} width={w} height={h} />
            case 'gauge':
                return <Gauge id={id} data={invt} setting={overview_setting[id]} width={w} height={h} />
            case 'tablepro':
                return <Tablepro id={id} data={invt} setting={overview_setting[id]} width={w} height={h} />
            case 'picture':
                return <Picture id={id} data={invt} setting={overview_setting[id]} width={w} height={h} />
            case 'view32bit':
                return <View32bit id={id} data={invt} setting={overview_setting[id]} width={w} height={h} />

            default:
                return <></>
        }


    }

    const Controls = () => {
        const { zoomIn, zoomOut, resetTransform } = useControls();
        return (
            <>
                {(zoom)
                    ? <>
                        <div className="DAT_zoom" style={{ bottom: "10px", right: "10px" }} onClick={() => ZoomState()}>
                            <ion-icon name="hand-left-outline"></ion-icon>
                        </div>

                    </>
                    : <>
                        <div className="DAT_zoom" style={{ bottom: "10px", right: "130px" }} onClick={() => resetTransform()}>
                            <ion-icon name="expand-outline"></ion-icon>
                        </div>
                        <div className="DAT_zoom" style={{ bottom: "10px", right: "90px" }} onClick={() => zoomIn()}>
                            <ion-icon name="add-outline"></ion-icon>
                        </div>
                        <div className="DAT_zoom" style={{ bottom: "10px", right: "50px" }} onClick={() => zoomOut()}>
                            <ion-icon name="remove-outline"></ion-icon>
                        </div>
                        <div className="DAT_zoom" style={{ bottom: "10px", right: "10px" }} onClick={() => ZoomState()}>
                            <ion-icon name="close-outline"></ion-icon>

                        </div>
                    </>

                }
            </>
        );
    };

    useEffect(() => {
        var card = document.getElementById("DAT_overview")
        var svgcontainner = document.getElementById("OVERVIEW_SVGCONTAINNER")
        var svgview = document.getElementById("OVERVIEW_SVGVIEW")
        if (window.innerWidth >= 1500) {
            svgview.style.transform = "scale(1)"
            svgview.style.width = '1500px'
        } else {
            svgview.style.transform = "scale(" + card.offsetWidth / 1500 + ")"
            svgview.style.width = svgcontainner.offsetWidth / (card.offsetWidth / 1500)
        }
        window.addEventListener('resize', handleWindowResize);

        return () => {
            window.removeEventListener('resize', handleWindowResize);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    //scale khi Thay đổi kích thước màn hình
    function handleWindowResize() {
        var card = document.getElementById("DAT_overview")
        var svgcontainner = document.getElementById("OVERVIEW_SVGCONTAINNER")
        var svgview = document.getElementById("OVERVIEW_SVGVIEW")
        if (overview_config === false) {


            if (window.innerWidth >= 1500) {
                svgview.style.transform = "scale(1)"
                svgview.style.width = '1500px'
            } else {
                svgview.style.transform = "scale(" + card.offsetWidth / 1500 + ")"
                svgview.style.width = svgcontainner.offsetWidth / (card.offsetWidth / 1500)
            }
        }
    }


    useEffect(() => {
        //console.log(props.invt)
        setInvt(props.invt)
    }, [props])

    //Vào trang cài dặt
    const handleConfig = (e) => {
        overviewDispatch({ type: "SET_CONFIG", payload: true })
    }


    return (
        <div className="DAT_TlOverview"
        // onMouseEnter={(e) => { disableScroll.on() }}
        // onMouseLeave={(e) => { disableScroll.off() }}

        >
            {/* {(type === 'master' || type === 'admin')
                ? <div className="DAT_TlOverviewMenu" style={{ top: "10px", right: "10px" }} onClick={(event) => { handleConfig(event) }}>
                    <TbSettingsCog size={20} />
                </div>
                : <></>
            } */}
            {/* <div className="DAT_TlOverview_Menu" style={(dropdowm) ? { display: "block" } : { display: "none", bottom: "10px", right: "10px" }}>
                <div className="DAT_TlOverview_Menu-content" onClick={(event) => { handleConfig(event) }}>Chỉnh sửa</div>
            </div> */}

            <div className="DAT_TlOverview_SVG" >
                <TransformWrapper
                    panning={{ disabled: zoom, excluded: ["input"] }}
                    wheel={{ disabled: zoom }}
                    pinch={{ disabled: zoom }}
                    doubleClick={{ disabled: zoom }}
                >
                    <Controls />
                    <div className="DAT_TlOverview_SVG-content" id="OVERVIEW_SVGCONTAINNER">
                        <TransformComponent >
                            <svg id="OVERVIEW_SVGVIEW" className="DAT_TlOverview_SVG-content-view">

                                {overview_visual.map((data, index) => (
                                    <foreignObject key={data.id} x={data.x} y={data.y} width={data.w} height={data.h}>
                                        {visdata(data.type, data.id, data.w, data.h)}
                                        {/* {(() => {
                                            switch (data.type) {
                                                case 'SOL':
                                                    return <Solview data={invt} deviceid={data.deviceid} id={data.id} setting={overview_setting[data.id]} />
                                                case 'ELEV':
                                                    return <Elevview data={invt} deviceid={data.deviceid} id={data.id} setting={overview_setting[data.id]} />
                                                case 'AUTO':
                                                    return <Autoview data={invt} deviceid={data.deviceid} id={data.id} setting={overview_setting[data.id]} />
                                                case 'picture':
                                                    return <Backgound id='1' />
                                                case 'picture2':
                                                    return <Backgound id='2' />
                                                case 'factory':
                                                    return <Backgound id='3' />
                                                case 'hanam':
                                                    return <Backgound id='4' />
                                                default:
                                                    return <></>

                                            }
                                        })()} */}
                                    </foreignObject>
                                ))}


                            </svg>
                        </TransformComponent>


                    </div>
                </TransformWrapper>
            </div>
        </div >
    )
}
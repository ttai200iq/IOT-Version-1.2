/* eslint eqeqeq: 0 */
import React, { useEffect, useState, useContext, useRef } from "react";
import "./Control.scss";
import axios from "axios";
import { host } from "../constant"
import DataTable from 'react-data-table-component';
import { SettingContext } from "../Context/SettingContext";
import Tooloverview from "../LibOverview/Tooloverview";
import { OverviewContext } from "../Context/OverviewContext";
import Toollist from "../Lib/Toollist";
import { ToolContext } from "../Context/ToolContext";
import { Link } from "react-router-dom";
import toolslice from "../Redux/toolslice";
import { useDispatch, useSelector } from "react-redux";
import { useIntl } from "react-intl";
import { AlertContext } from "../Context/AlertContext";
import adminslice from "../Redux/adminslice";
import { RequestType, geocode, setKey } from "react-geocode";
import { pageDefault } from "../../App";
import { signal } from "@preact/signals-react";
import { searchmoblile } from "../MenuTop/MenuTop";
import { IoIosAddCircle, IoIosArrowDown, IoIosArrowForward } from "react-icons/io";
import { view } from "../../App";
import { FaSolarPanel } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { LuFolderEdit } from "react-icons/lu";
import { BrowserView, MobileView, isBrowser, isMobile } from 'react-device-detect';
import { IoClose } from "react-icons/io5";
const tab = signal('1')
const mobiletab = signal(false);

export default function Sol(props) {

        const avatar = '/avatar/solar.jpg'
        const banner = "url('/banner/Solar_banner.png')"
        const icon = "/dat_icon/Solar_head.png"
        const inf = { code: 'SOL', tit: 'Năng lượng mặt trời' }
        const iconmobile = <FaSolarPanel color="gray" size={25} />

        const list = { 1: 'Dự án', 2: 'Thiết bị' }
        const color = { cur: '#6495ed', pre: 'gray' }
        const { alertDispatch } = useContext(AlertContext);
        const dataLang = useIntl();
        //const token = useSelector((state) => state.admin.token)
        const { toolDispatch } = useContext(ToolContext)
        const { overviewDispatch } = useContext(OverviewContext)
        const { whatdevice, currentID, listdevice, listdevice2, screen, settingDispatch } = useContext(SettingContext)
        //const [device, setDevice] = useState(false);
        const [statesol, setStatesol] = useState('list')
        const [project, setProject] = useState([])
        const [showproject, setShowproject] = useState([])
        const [direct, SetDirect] = useState([{ id: 'home', text: 'Trang chủ' }, { id: 'list', text: inf.tit }])
        const rootDispatch = useDispatch()
        const showdevice = useSelector((state) => state.tool.status)
        const type = useSelector((state) => state.admin.type)
        const admin = useSelector((state) => state.admin.admin)
        const [fix, setFix] = useState(false)
        const [code, setCode] = useState('')
        const [fixtype, setFixtype] = useState('')
        const pcompany = useRef('')
        const pname = useRef('')
        const paddr = useRef('')
        const dname = useRef('')
        const ddescription = useRef('')
        const lat = useRef('')
        const lng = useRef('')

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

        const handleInput = (e) => {

                // console.log(paddr.current.value)
                setKey(process.env.REACT_APP_GGKEY);
                geocode(RequestType.ADDRESS, paddr.current.value)
                        .then((response) => {
                                // console.log(response.results[0].geometry.location);

                                lat.current.value = response.results[0].geometry.location.lat
                                lng.current.value = response.results[0].geometry.location.lng


                        })
                        .catch((error) => {
                                // console.log(error);
                                alertDispatch({ type: 'LOAD_CONTENT', payload: { content: dataLang.formatMessage({ id: "alert_30" }), show: 'block' } })
                        });

        }

        const handleFix = (e) => {
                const id = e.currentTarget.id
                var arr = id.split("_")



                if (arr[2] === 'P') {
                        const index = project.findIndex(p => p.projectid == arr[0])
                        pcompany.current = project[index].company
                        pname.current = project[index].name
                        paddr.current = project[index].addr
                        lat.current = project[index].lat
                        lng.current = project[index].lng
                } else {
                        const index = listdevice2.findIndex(p => p.deviceid == arr[0])
                        dname.current = listdevice2[index].name
                        ddescription.current = listdevice2[index].description
                }
                setCode(arr[0])
                setFixtype(arr[1] + "_" + arr[2])
                setFix(true)

        }

        const handleSaveFix = (e) => {
                e.preventDefault()

                var newData
                if (fixtype === 'FIX_P') {
                        const index = project.findIndex(p => p.projectid == code)
                        //console.log(pcompany.current.value,pname.current.value,paddr.current.value)
                        newData = project
                        newData[index].name = pname.current.value
                        newData[index].company = pcompany.current.value
                        newData[index].addr = paddr.current.value
                        newData[index].lat = lat.current.value
                        newData[index].lng = lng.current.value
                        setProject(newData)

                        const updatelistProject = async () => {
                                await axios.post(host.DEVICE + "/updatelistProject", { id: code, name: pname.current.value, company: pcompany.current.value, addr: paddr.current.value, lat: lat.current.value, lng: lng.current.value }, { secure: true, reconnect: true }).then(
                                        function (res) {
                                                //console.log(res.data)
                                                if (res.data.status) {
                                                        alertDispatch({ type: 'LOAD_CONTENT', payload: { content: dataLang.formatMessage({ id: "alert_5" }), show: 'block' } })
                                                } else {
                                                        alertDispatch({ type: 'LOAD_CONTENT', payload: { content: dataLang.formatMessage({ id: "alert_3" }), show: 'block' } })
                                                }
                                        })
                        }

                        updatelistProject()

                }

                if (fixtype === 'FIX_D') {
                        const index = listdevice2.findIndex(p => p.deviceid == code)
                        newData = listdevice2
                        //console.log(newData)
                        newData[index].name = dname.current.value
                        newData[index].description = ddescription.current.value
                        settingDispatch({ type: "LOAD_LISTDEVICE2", payload: newData })

                        const updatelistDevice = async () => {

                                await axios.post(host.DEVICE + "/updatelistDevice", { id: code, name: dname.current.value, des: ddescription.current.value }, { secure: true, reconnect: true }).then(
                                        function (res) {
                                                // console.log(res.data)
                                                if (res.data.status) {
                                                        alertDispatch({ type: 'LOAD_CONTENT', payload: { content: dataLang.formatMessage({ id: "alert_5" }), show: 'block' } })
                                                } else {
                                                        alertDispatch({ type: 'LOAD_CONTENT', payload: { content: dataLang.formatMessage({ id: "alert_3" }), show: 'block' } })
                                                }
                                        })
                        }
                        updatelistDevice()

                }
                if (fixtype === 'DEL_P') {

                        newData = project.filter(d => d.projectid != code)
                        setProject(newData)
                        if (type === 'admin' || type === 'master') {
                                const removelistProject = async () => {
                                        await axios.post(host.DEVICE + "/removelistProject", { user: props.username, id: code }, { secure: true, reconnect: true }).then(
                                                function (res) {
                                                        // console.log(res.data)
                                                        if (res.data.status) {
                                                                alertDispatch({ type: 'LOAD_CONTENT', payload: { content: dataLang.formatMessage({ id: "alert_17" }), show: 'block' } })
                                                        } else {
                                                                alertDispatch({ type: 'LOAD_CONTENT', payload: { content: dataLang.formatMessage({ id: "alert_3" }), show: 'block' } })
                                                        }
                                                })
                                }
                                removelistProject();
                        } else {

                                const removelistProjectUser = async () => {
                                        await axios.post(host.DEVICE + "/removelistProjectUser", { user: props.username, id: code }, { secure: true, reconnect: true }).then(
                                                function (res) {
                                                        // console.log(res.data)
                                                        if (res.data.status) {
                                                                alertDispatch({ type: 'LOAD_CONTENT', payload: { content: dataLang.formatMessage({ id: "alert_17" }), show: 'block' } })
                                                        } else {
                                                                alertDispatch({ type: 'LOAD_CONTENT', payload: { content: dataLang.formatMessage({ id: "alert_3" }), show: 'block' } })
                                                        }
                                                })
                                }
                                removelistProjectUser();
                        }
                }

                if (fixtype === 'DEL_D') {

                        newData = listdevice2.filter(d => d.deviceid != code)
                        settingDispatch({ type: "LOAD_LISTDEVICE2", payload: newData })
                        if (type === 'admin' || type === 'master') {
                                const removelistDevice = async () => {
                                        await axios.post(host.DEVICE + "/removelistDevice", { user: props.username, id: code }, { secure: true, reconnect: true }).then(
                                                function (res) {
                                                        // console.log(res.data)
                                                        if (res.data.status) {
                                                                alertDispatch({ type: 'LOAD_CONTENT', payload: { content: dataLang.formatMessage({ id: "alert_16" }), show: 'block' } })
                                                        } else {
                                                                alertDispatch({ type: 'LOAD_CONTENT', payload: { content: dataLang.formatMessage({ id: "alert_3" }), show: 'block' } })
                                                        }
                                                })
                                }
                                removelistDevice();
                        } else {
                                const removelistDeviceUser = async () => {
                                        await axios.post(host.DEVICE + "/removelistDeviceUser", { user: props.username, id: code }, { secure: true, reconnect: true }).then(
                                                function (res) {
                                                        // console.log(res.data)
                                                        if (res.data.status) {
                                                                alertDispatch({ type: 'LOAD_CONTENT', payload: { content: dataLang.formatMessage({ id: "alert_16" }), show: 'block' } })
                                                        } else {
                                                                alertDispatch({ type: 'LOAD_CONTENT', payload: { content: dataLang.formatMessage({ id: "alert_3" }), show: 'block' } })
                                                        }
                                                })
                                }
                                removelistDeviceUser();
                        }
                }

                setFix(false)

        }

        const handleModify = (e, type) => {
                const id = e.currentTarget.id
                var arr = id.split("_")
                const mod = document.getElementById(arr[0] + "_Modify")
                mod.style.display = type
        }

        const paginationComponentOptions = {
                rowsPerPageText: 'Số hàng',
                rangeSeparatorText: 'đến',
                selectAllRowsItem: true,
                selectAllRowsItemText: 'tất cả',
        };

        const columnproject = [
                {
                        name: 'STT',
                        selector: row => (
                                <div className="DAT_Table_Stt">{row.id}</div>
                        ),
                        width: "80px",
                        center: true,
                },
                {
                        name: 'Tên dự án',
                        selector: (row) => (
                                <div className="DAT_Table" id={row.projectid + "_PROJECT"} onClick={(e) => { handleProject(e) }}>
                                        <img alt="" src={avatar} ></img>
                                        <label>{row.name}</label>
                                </div>
                        ),
                        minWidth: "250px",
                        style: {
                                justifyContent: "left",
                        }
                },
                {
                        name: 'Công ty',
                        selector: row => row.company,
                        minWidth: "250px",
                        style: {
                                justifyContent: "left",
                        }
                },
                {
                        name: 'Thông tin',
                        selector: row => row.addr,
                        minWidth: "300px",
                        style: {
                                justifyContent: "left",
                        }
                },
                {
                        name: 'Trạng thái',
                        selector: (row) => (
                                <div style={{ width: "100%" }}>
                                        {
                                                (row.status)
                                                        ? <img alt="" style={{ width: "30px" }} src="/lib/true_state.png"></img>
                                                        : <img alt="" style={{ width: "30px" }} src="/lib/warning_state.png"></img>
                                        }
                                </div>
                        ),
                        width: "140px",
                        center: true,

                },
                {
                        name: 'Tùy chỉnh',
                        selector: (row) => (
                                <>
                                        <div className="DAT_Table">
                                                <span className="DAT_Table-edit" id={row.projectid + "_MORE"} onMouseEnter={e => handleModify(e, 'block')} >...</span>
                                        </div>

                                        <div className="DAT_Modify" id={row.projectid + "_Modify"} style={{ display: "none" }} onMouseLeave={e => handleModify(e, 'none')}>
                                                <div className="DAT_Modify_fix" id={row.projectid + "_FIX_P"} onClick={(e) => handleFix(e)}>Chỉnh sửa</div>
                                                <div className="DAT_Modify_remove" id={row.projectid + "_DEL_P"} onClick={(e) => handleFix(e)}>Gỡ</div>
                                        </div>


                                </>
                        ),
                        width: "100px"
                },
        ];

        const columnproject_user = [
                {
                        name: 'STT',
                        selector: row => (
                                <div className="DAT_Table_Stt">{row.id}</div>
                        ),
                        width: "80px",
                        center: true,
                },
                {
                        name: 'Tên dự án',
                        selector: (row) => (
                                <div className="DAT_Table" id={row.projectid + "_PROJECT"} onClick={(e) => { handleProject(e) }}>
                                        <img alt="" src={avatar} ></img>
                                        <label>{row.name}</label>
                                </div>
                        ),
                        minwidth: "250px",
                        style: {
                                justifyContent: "left",
                        }
                },
                {
                        name: 'Công ty',
                        selector: row => row.company,
                        minWidth: "250px",
                        style: {
                                justifyContent: "left",
                        }
                },
                {
                        name: 'Thông tin',
                        selector: row => row.addr,
                        minwidth: "300px",
                        style: {
                                justifyContent: "left",
                        }
                },
                {
                        name: 'Trạng thái',
                        selector: (row) => (
                                <div style={{ width: "100%" }}>
                                        {
                                                (row.status)
                                                        ? <img alt="" style={{ width: "30px" }} src="/lib/true_state.png"></img>
                                                        : <img alt="" style={{ width: "30px" }} src="/lib/warning_state.png"></img>
                                        }
                                </div>
                        ),
                        width: "140px",
                        center: true,

                },
        ];

        const columns2 = [

                {
                        name: 'STT',
                        selector: row => row.id,
                        width: "80px",
                        center: true,
                },
                {
                        name: 'Tên Thiết bị',
                        selector: (row) => (
                                <div className="DAT_Table" id={row.deviceid + "_noP"} onClick={(e) => { handleDevice(e) }}>
                                        <img alt="" src={avatar} ></img>
                                        <label>{row.name}</label>
                                </div>
                        ),
                        minWidth: "250px",
                        style: {
                                justifyContent: "left",
                        }
                },
                {
                        name: 'Mô tả',
                        selector: row => row.description,
                        minWidth: "250px",
                        style: {
                                justifyContent: "left",
                        }
                },

                {
                        name: 'Kết nối',
                        selector: (row) => (
                                <div style={{ width: "100%" }}>
                                        {/* <Stt id={row.deviceid}></Stt> */}
                                        {(row.status)
                                                ? <img alt="" style={{ width: "25px" }} src="/lib/online_state.png"></img>
                                                : <img alt="" style={{ width: "25px" }} src="/lib/offline_state.png"></img>
                                        }
                                </div>
                        ),
                        width: "120px",
                        center: true,
                },
                {
                        name: 'gateway',
                        selector: (row) => (
                                <label id={row.deviceid + "_noP"} onClick={(e) => { handleDevice(e) }} style={{ cursor: "pointer", color: "#326ba8" }} >{row.deviceid}</label>
                        ),
                        width: "150px",
                        center: true,
                },
                {
                        name: 'Tùy chỉnh',
                        selector: (row) => (<>
                                <div className="DAT_Table">
                                        <span className="DAT_Table-edit" id={row.deviceid + "_MORE"} onMouseEnter={e => handleModify(e, 'block')} >...</span>
                                </div>


                                <div className="DAT_Modify" id={row.deviceid + "_Modify"} style={{ display: "none" }} onMouseLeave={e => handleModify(e, 'none')}>
                                        <div className="DAT_Modify_fix" id={row.deviceid + "_FIX_D"} onClick={(e) => handleFix(e)}>Chỉnh sửa</div>
                                        <div className="DAT_Modify_remove" id={row.deviceid + "_DEL_D"} onClick={(e) => handleFix(e)}>Gỡ</div>
                                </div>


                        </>
                        ),
                        width: "100px"
                },
        ];

        const columns2_user = [

                {
                        name: 'STT',
                        selector: row => row.id,
                        width: "80px",
                        center: true,
                },
                {
                        name: 'Tên Thiết bị',
                        selector: (row) => (
                                <div className="DAT_Table" id={row.deviceid + "_noP"} onClick={(e) => { handleDevice(e) }}>
                                        <img alt="" src={avatar} ></img>
                                        <label>{row.name}</label>
                                </div>
                        ),
                        minwidth: "250px",
                        style: {
                                justifyContent: "left",
                        }
                },
                {
                        name: 'Mô tả',
                        selector: row => row.description,
                        minWidth: "250px",
                        style: {
                                justifyContent: "left",
                        }
                },

                {
                        name: 'Kết nối',
                        selector: (row) => (
                                <div style={{ width: "100%" }}>
                                        {/* <Stt id={row.deviceid}></Stt> */}
                                        {(row.status)
                                                ? <img alt="" style={{ width: "25px" }} src="/lib/online_state.png"></img>
                                                : <img alt="" style={{ width: "25px" }} src="/lib/offline_state.png"></img>
                                        }
                                </div>
                        ),
                        width: "120px",
                        center: true,
                },
                {
                        name: 'gateway',
                        selector: (row) => (
                                <label id={row.deviceid + "_noP"} onClick={(e) => { handleDevice(e) }} style={{ cursor: "pointer", color: "#326ba8" }} >{row.deviceid}</label>
                        ),
                        width: "150px",
                        center: true,
                }
        ];

        const ExpandedComponent = ({ data }) => {
                const [list, setList] = useState([])
                useEffect(() => {
                        axios.post(host.DEVICE + "/getGroup", { deviceid: data.deviceid }, { secure: true, reconnect: true }).then(
                                res => {
                                        // console.log(res.data)
                                        setList(res.data)
                                }
                        )
                }, [])

                return (
                        <>
                                {list.map((data, i) => {
                                        return <div className="DAT_TableGroup" key={i}>
                                                <div className="DAT_TableGroup_ID">{data.groupid}</div>
                                                <div className="DAT_TableGroup_Name" id={`${data.deviceid}_${data.groupid}_${data.curtab}_Group`} onClick={(e) => { handleDeviceGroup(e) }}>{data.name}</div>
                                                <div className="DAT_TableGroup_Edit">...</div>
                                        </div>
                                })}
                        </>
                )
        };

        //Get  list device of no project & list project
        useEffect(() => {
                const getDevice = async () => {
                        await axios.post(host.DEVICE + "/getlistDevice", { username: props.username, group: inf.code }, { secure: true, reconnect: true }).then(
                                function (res) {
                                        if (res.data.status) {
                                                var data = res.data.data.map(({ ...item }, index) => ({
                                                        ...item,
                                                        id: index + 1
                                                }))
                                                //console.log("List device", data)
                                                settingDispatch({ type: "LOAD_LISTDEVICE2", payload: data })

                                        }
                                })
                }

                const getProject = async () => {

                        await axios.post(host.DEVICE + "/getlistProject", { username: props.username, group: inf.code }, { secure: true, reconnect: true }).then(
                                function (res) {
                                        if (res.data.status) {
                                                var data = res.data.data.map(({ ...item }, index) => ({
                                                        ...item,
                                                        id: index + 1
                                                }))
                                                //console.log("List project", data)
                                                setProject(data);
                                        }

                                })

                }


                getProject();
                getDevice();


                return (() => {
                        rootDispatch(toolslice.actions.setstatus(false))
                        settingDispatch({ type: "RESET", payload: [] })
                        overviewDispatch({ type: "RESET_TOOLOVERVIEW", payload: [] })
                        toolDispatch({ type: "RESET_TOOL", payload: [] })
                        // const interval_id = window.setInterval(function () { }, Number.MAX_SAFE_INTEGER);
                        // // Clear any timeout/interval up to that id
                        // for (let i = 1; i < interval_id; i++) {
                        //         window.clearInterval(i);
                        // }

                })


                // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [])

        //Get Monitor of Device in Project
        useEffect(() => {
                if (listdevice.length !== 0) {

                        if (whatdevice !== '') {
                                // view.value.type = 'single'
                                // view.value.id = 'G01'


                                const newarr = listdevice.filter(arr => arr.deviceid == whatdevice)
                                //console.log("Test", newarr)

                                if (view.value.type == 'single') {

                                        const getMonitor = async () => {
                                                rootDispatch(toolslice.actions.setstatus(true))
                                                await axios.get(host.DEVICE + "/getMonitorDevice/" + whatdevice, { secure: true }).then(
                                                        function (res) {
                                                                console.log("Screen data", res.data.data)
                                                                settingDispatch({ type: "LOAD_SCREEN", payload: { currentID: whatdevice, currentName: newarr[0].name, screen: res.data.data, sttdata: true } })

                                                                axios.get(host.DEVICE + "/getTabMD/" + whatdevice, { secure: true, reconnect: true }).then(
                                                                        function (res) {

                                                                                settingDispatch({ type: "LOAD_LASTTAB", payload: parseInt(res.data[0].tab) })
                                                                                settingDispatch({ type: "LOAD_DEFAULT", payload: parseInt(res.data[0].defaulttab) })

                                                                        })

                                                        })
                                                        .catch(err => {
                                                                rootDispatch(toolslice.actions.setstatus(false))
                                                        })
                                        }
                                        if (newarr[0]?.name !== undefined) {

                                                getMonitor();

                                        }
                                } else {
                                        const getMonitorDevice = async () => {
                                                rootDispatch(toolslice.actions.setstatus(true))
                                                await axios.post(host.DEVICE + "/getMonitorDeviceGroup", { id: whatdevice, groupid: view.value.id }, { secure: true, reconnect: true }).then(
                                                        function (res) {
                                                                console.log("Screen data", res.data.data)
                                                                settingDispatch({ type: "LOAD_SCREEN", payload: { currentID: whatdevice, currentName: newarr.name, screen: res.data.data, sttdata: true } })
                                                                settingDispatch({ type: "LOAD_DEFAULT", payload: view.value.tab })
                                                                axios.get(host.DEVICE + "/getTabMD/" + whatdevice, { secure: true, reconnect: true }).then(
                                                                        function (res) {
                                                                                settingDispatch({ type: "LOAD_LASTTAB", payload: parseInt(res.data[0].tab) })

                                                                        })

                                                        })
                                        }
                                        if (newarr[0]?.name !== undefined) {

                                                getMonitorDevice();

                                        }

                                }





                        }
                }
                //console.log("TEST",whatdevice, listdevice)
                return (() => {
                        settingDispatch({ type: "RESET_WHAT_DEVICE", payload: '' })
                })

                // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [whatdevice, listdevice])

        // useEffect(() => {
        //         if (listdevice.length !== 0) {

        //                 if (whatdevicegroup.value.id !== '') {
        //                         view.value.type = 'group'
        //                         view.value.id = whatdevicegroup.value.id


        //                         const newarr = listdevice.filter(arr => arr.deviceid == whatdevicegroup.value.id)
        //                         //console.log("Test", newarr)


        //                         const getMonitorDevice = async () => {
        //                                 rootDispatch(toolslice.actions.setstatus(true))
        //                                 await axios.post(host.DEVICE + "/getMonitorDeviceGroup",{id:whatdevicegroup.value.id, groupid:whatdevicegroup.value.groupid},{ secure: true, reconnect: true }).then(
        //                                         function (res) {
        //                                                 console.log("Screen data", res.data.data)
        //                                                 settingDispatch({ type: "LOAD_SCREEN", payload: { currentID: whatdevicegroup.value.id, currentName: newarr.name, screen: res.data.data, sttdata: true } })
        //                                                 settingDispatch({ type: "LOAD_DEFAULT", payload: whatdevicegroup.value.tab })
        //                                                 axios.get(host.DEVICE + "/getTabMD/" + whatdevicegroup.value.id, { secure: true, reconnect: true }).then(
        //                                                         function (res) {
        //                                                                 settingDispatch({ type: "LOAD_LASTTAB", payload: parseInt(res.data[0].tab) })

        //                                                         })

        //                                         })
        //                         }


        //                         if (newarr[0]?.name !== undefined) {

        //                                 getMonitorDevice();

        //                         }


        //                 }
        //         }
        //         //console.log("TEST",whatdevice, listdevice)
        //         return (() => {
        //                 whatdevicegroup.value = { id: '', groupid: '', tab: '' }
        //         })

        //         // eslint-disable-next-line react-hooks/exhaustive-deps
        // }, [whatdevicegroup.value, listdevice])

        //Show Monitor of Device

        useEffect(function () {
                const setScreen = async () => {
                        await axios.post(host.DEVICE + "/resetTabMD", { id: currentID, tab: 0 }, { secure: true, reconnect: true }).then(
                                function (res) {
                                        //console.log(res.data)
                                        settingDispatch({ type: "LOAD_LASTTAB", payload: 0 })
                                        settingDispatch({ type: "LOAD_DEFAULT", payload: 0 })
                                })
                }
                screen.map((data, index) => (
                        toolDispatch({ type: "LOAD_DEVICE", payload: { tab: data.tab, visual: data.data.data, setting: data.setting, name: data.name, lastid: data.data.id } })
                ))

                if (screen.length === 0) {
                        setScreen();
                }

                // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [screen])

        //Cross Page EndUser
        useEffect(() => {

                if (pageDefault.value.type == 'project') {
                        const p = project.filter(p => p.projectid == pageDefault.value.id)
                        if (p.length === 1) {
                                setStatesol('project')
                                settingDispatch({ type: "LOAD_STATE", payload: true })
                                setShowproject(p)
                                SetDirect([{ id: 'home', text: 'Trang chủ' }, { id: 'list', text: inf.tit }, { id: 'project', text: p[0].name }])
                                overviewDispatch({ type: "LOAD_DEVICE", payload: { id: p[0].data.id, visual: p[0].data.data, setting: p[0].setting, company: p[0].company, name: p[0].name } })
                                const getlistDeviceP = async () => {
                                        await axios.post(host.DEVICE + "/getlistDeviceP", { projectid: p[0].projectid }, { secure: true, reconnect: true }).then(
                                                function (res) {
                                                        if (res.data.status) {
                                                                //console.log("List device in project", res.data.data)
                                                                settingDispatch({ type: "LOAD_LISTDEVICE", payload: res.data.data })
                                                                var arr = ['0']
                                                                res.data.data.map((id, index) => {
                                                                        arr = [...arr, id.deviceid]
                                                                        return arr
                                                                })
                                                                overviewDispatch({ type: "SET_ID", payload: arr })

                                                        }

                                                })
                                }

                                getlistDeviceP();

                        }
                } else {

                }

        }, [pageDefault.value, project])

        //Get  list device of project
        const handleProject = (event) => {

                rootDispatch(adminslice.actions.setmenu(false))
                const ID = event.currentTarget.id;
                var arr = ID.split("_")

                setStatesol('project')
                settingDispatch({ type: "LOAD_STATE", payload: true })

                const p = project.filter(p => p.projectid == arr[0])
                setShowproject(p)
                SetDirect([{ id: 'home', text: 'Trang chủ' }, { id: 'list', text: inf.tit }, { id: 'project', text: p[0].name }])

                overviewDispatch({ type: "LOAD_DEVICE", payload: { id: p[0].data.id, visual: p[0].data.data, setting: p[0].setting, company: p[0].company, name: p[0].name } })

                const getlistDeviceP = async () => {

                        await axios.post(host.DEVICE + "/getlistDeviceP", { projectid: p[0].projectid }, { secure: true, reconnect: true }).then(
                                function (res) {
                                        if (res.data.status) {
                                                console.log("List device in project", res.data.data)
                                                settingDispatch({ type: "LOAD_LISTDEVICE", payload: res.data.data })
                                                var arr = ['0']
                                                res.data.data.map((id, index) => {
                                                        arr = [...arr, id.deviceid]
                                                        return arr
                                                })
                                                overviewDispatch({ type: "SET_ID", payload: arr })

                                        }

                                })
                }

                getlistDeviceP();

        }

        //Get Monitor of Device in BU
        const handleDevice = (event) => {
                rootDispatch(adminslice.actions.setmenu(false))
                const ID = event.currentTarget.id;
                var arr = ID.split("_")
                const newarr = listdevice2.filter(newarr => newarr.deviceid == arr[0])
                //setShowdevice(true)
                view.value.type = 'single'
                view.value.id = 'G01'


                const getMonitorDevice = async () => {
                        rootDispatch(toolslice.actions.setstatus(true))
                        await axios.get(host.DEVICE + "/getMonitorDevice/" + arr[0], { secure: true, reconnect: true }).then(
                                function (res) {
                                        console.log("Screen data", res.data.data)
                                        settingDispatch({ type: "LOAD_SCREEN", payload: { currentID: arr[0], currentName: newarr[0].name, screen: res.data.data, sttdata: true } })

                                        axios.get(host.DEVICE + "/getTabMD/" + arr[0], { secure: true, reconnect: true }).then(
                                                function (res) {
                                                        settingDispatch({ type: "LOAD_LASTTAB", payload: parseInt(res.data[0].tab) })
                                                        settingDispatch({ type: "LOAD_DEFAULT", payload: parseInt(res.data[0].defaulttab) })

                                                })

                                })
                }

                getMonitorDevice();
                // setDevice(true)
        }

        const handleDeviceGroup = (event) => {
                const ID = event.currentTarget.id;
                var arr = ID.split("_")
                const newarr = listdevice2.find(newarr => newarr.deviceid == arr[0])
                // console.log(newarr)
                // console.log(arr)
                view.value.type = 'group'
                view.value.id = arr[1]

                const getMonitorDevice = async () => {
                        rootDispatch(toolslice.actions.setstatus(true))
                        await axios.post(host.DEVICE + "/getMonitorDeviceGroup", { id: arr[0], groupid: arr[1] }, { secure: true, reconnect: true }).then(
                                function (res) {
                                        console.log("Screen data", res.data.data)
                                        settingDispatch({ type: "LOAD_SCREEN", payload: { currentID: arr[0], currentName: newarr.name, screen: res.data.data, sttdata: true } })
                                        settingDispatch({ type: "LOAD_DEFAULT", payload: parseInt(arr[2]) })
                                        axios.get(host.DEVICE + "/getTabMD/" + arr[0], { secure: true, reconnect: true }).then(
                                                function (res) {
                                                        settingDispatch({ type: "LOAD_LASTTAB", payload: parseInt(res.data[0].tab) })

                                                })

                                })
                }

                getMonitorDevice();


        }

        //Direction
        const handleDir = (event) => {

                const ID = event.currentTarget.id;
                var arr = ID.split("_")
                if (arr[0] !== 'device') {

                        if (arr[0] === 'project') {
                                setStatesol('project')
                                settingDispatch({ type: "LOAD_STATE", payload: true })
                                settingDispatch({ type: "REMOVE_CURRENTID", payload: '' })
                                SetDirect([{ id: 'home', text: 'Trang chủ' }, { id: 'list', text: inf.tit }, { id: 'project', text: showproject[0].name }])
                        }

                        if (arr[0] === 'list') {
                                setStatesol('list')
                                settingDispatch({ type: "LOAD_STATE", payload: false })
                                settingDispatch({ type: "REMOVE_CURRENTID", payload: '' })
                                SetDirect([{ id: 'home', text: 'Trang chủ' }, { id: 'list', text: inf.tit }])
                                settingDispatch({ type: "LOAD_LISTDEVICE", payload: [] })

                        }
                        toolDispatch({ type: "RESET_TOOL", payload: [] })
                }

        }

        const handleAddproject = (e) => {
                e.preventDefault()
                var p = document.getElementById('addproject')
                // console.log(p.value)
                if (type === 'admin' || type === 'master') {
                        const addlistProject = async () => {
                                await axios.post(host.DEVICE + "/addlistProject", { username: props.username, projectid: p.value, code: inf.code }, { secure: true, reconnect: true }).then(
                                        function (res) {
                                                // console.log(res.data)
                                                if (res.data.status) {
                                                        alertDispatch({ type: 'LOAD_CONTENT', payload: { content: dataLang.formatMessage({ id: "alert_43" }), show: 'block' } })
                                                        axios.post(host.DEVICE + "/getlistProject", { username: props.username, group: inf.code }, { secure: true, reconnect: true }).then(
                                                                function (res) {
                                                                        if (res.data.status) {
                                                                                var data = res.data.data.map(({ ...item }, index) => ({
                                                                                        ...item,
                                                                                        id: index + 1
                                                                                }))
                                                                                console.log("List project", data)
                                                                                setProject(data);
                                                                        }

                                                                })
                                                } else {
                                                        if (res.data.number === 1) {
                                                                alertDispatch({ type: 'LOAD_CONTENT', payload: { content: dataLang.formatMessage({ id: "alert_45" }), show: 'block' } })
                                                        } else if (res.data.number === 2) {
                                                                alertDispatch({ type: 'LOAD_CONTENT', payload: { content: dataLang.formatMessage({ id: "alert_44" }), show: 'block' } })
                                                        } else {
                                                                alertDispatch({ type: 'LOAD_CONTENT', payload: { content: dataLang.formatMessage({ id: "alert_3" }), show: 'block' } })
                                                        }
                                                }
                                        })
                        }
                        addlistProject()
                } else {
                        const addlistProjectbyUser = async () => {
                                await axios.post(host.DEVICE + "/addlistProjectbyUser", { admin: admin, username: props.username, projectid: p.value, code: inf.code }, { secure: true, reconnect: true }).then(
                                        function (res) {
                                                // console.log(res.data)
                                                if (res.data.status) {
                                                        alertDispatch({ type: 'LOAD_CONTENT', payload: { content: dataLang.formatMessage({ id: "alert_43" }), show: 'block' } })
                                                        axios.post(host.DEVICE + "/getlistProject", { username: props.username, group: inf.code }, { secure: true, reconnect: true }).then(
                                                                function (res) {
                                                                        if (res.data.status) {
                                                                                var data = res.data.data.map(({ ...item }, index) => ({
                                                                                        ...item,
                                                                                        id: index + 1
                                                                                }))
                                                                                console.log("List project", data)
                                                                                setProject(data);
                                                                        }

                                                                })
                                                } else {
                                                        if (res.data.number === 1) {
                                                                alertDispatch({ type: 'LOAD_CONTENT', payload: { content: dataLang.formatMessage({ id: "alert_45" }), show: 'block' } })
                                                        } else if (res.data.number === 2) {
                                                                alertDispatch({ type: 'LOAD_CONTENT', payload: { content: dataLang.formatMessage({ id: "alert_44" }), show: 'block' } })
                                                        } else {
                                                                alertDispatch({ type: 'LOAD_CONTENT', payload: { content: dataLang.formatMessage({ id: "alert_3" }), show: 'block' } })
                                                        }
                                                }
                                        })
                        }
                        addlistProjectbyUser()
                }

        }

        const handleAdddevice = (e) => {
                e.preventDefault()
                var d = document.getElementById('adddevice')
                // console.log(d.value)
                if (type === 'admin' || type === 'master') {
                        const addlistDevice = async () => {
                                await axios.post(host.DEVICE + "/addlistDevice", { username: props.username, deviceid: d.value, code: inf.code, projectid: 'NONE' }, { secure: true, reconnect: true }).then(
                                        function (res) {
                                                // console.log(res.data)
                                                if (res.data.status) {
                                                        alertDispatch({ type: 'LOAD_CONTENT', payload: { content: dataLang.formatMessage({ id: "alert_40" }), show: 'block' } })
                                                        axios.post(host.DEVICE + "/getlistDevice", { username: props.username, group: inf.code }, { secure: true, reconnect: true }).then(
                                                                function (res) {
                                                                        if (res.data.status) {
                                                                                var data = res.data.data.map(({ ...item }, index) => ({
                                                                                        ...item,
                                                                                        id: index + 1
                                                                                }))
                                                                                console.log("List device", data)
                                                                                settingDispatch({ type: "LOAD_LISTDEVICE2", payload: data })

                                                                        }
                                                                })
                                                } else {

                                                        if (res.data.number === 1) {
                                                                alertDispatch({ type: 'LOAD_CONTENT', payload: { content: dataLang.formatMessage({ id: "alert_50" }), show: 'block' } })
                                                        } else if (res.data.number === 2) {
                                                                alertDispatch({ type: 'LOAD_CONTENT', payload: { content: dataLang.formatMessage({ id: "alert_41" }), show: 'block' } })
                                                        } else {
                                                                alertDispatch({ type: 'LOAD_CONTENT', payload: { content: dataLang.formatMessage({ id: "alert_3" }), show: 'block' } })
                                                        }

                                                }
                                        })
                        }
                        addlistDevice()

                } else {
                        const addlistDevicebyUser = async () => {

                                await axios.post(host.DEVICE + "/addlistDevicebyUser", { admin: admin, username: props.username, deviceid: d.value, code: inf.code, projectid: 'NONE' }, { secure: true, reconnect: true }).then(
                                        function (res) {
                                                // console.log(res.data)
                                                if (res.data.status) {
                                                        alertDispatch({ type: 'LOAD_CONTENT', payload: { content: dataLang.formatMessage({ id: "alert_40" }), show: 'block' } })
                                                        axios.post(host.DEVICE + "/getlistDevice", { username: props.username, group: inf.code }, { secure: true, reconnect: true }).then(
                                                                function (res) {
                                                                        if (res.data.status) {
                                                                                var data = res.data.data.map(({ ...item }, index) => ({
                                                                                        ...item,
                                                                                        id: index + 1
                                                                                }))
                                                                                console.log("List device", data)
                                                                                settingDispatch({ type: "LOAD_LISTDEVICE2", payload: data })

                                                                        }
                                                                })
                                                } else {

                                                        if (res.data.number === 1) {
                                                                alertDispatch({ type: 'LOAD_CONTENT', payload: { content: dataLang.formatMessage({ id: "alert_46" }), show: 'block' } })
                                                        } else if (res.data.number === 2) {
                                                                alertDispatch({ type: 'LOAD_CONTENT', payload: { content: dataLang.formatMessage({ id: "alert_41" }), show: 'block' } })
                                                        } else {
                                                                alertDispatch({ type: 'LOAD_CONTENT', payload: { content: dataLang.formatMessage({ id: "alert_3" }), show: 'block' } })
                                                        }

                                                }
                                        })
                        }
                        addlistDevicebyUser()
                }
        }

        // Handle close when press ESC
        useEffect(() => {
                const handleKeyDown = (event) => {
                        if (event.key === "Escape") {
                                setFix(false);
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
                                ? <div className="DAT_View">
                                        <div className="DAT_View_Banner" style={{ backgroundImage: banner, backgroundPosition: "bottom", backgroundRepeat: "no-repeat", backgroundSize: "cover" }}>
                                                <div className="DAT_View_Banner_Shadow" ></div>
                                        </div>

                                        <div className="DAT_View_Content">
                                                <div className="DAT_View_Content_Direct" >
                                                        {direct.map((data, index) => {
                                                                return (
                                                                        (index === 0)
                                                                                ? <Link key={index} to="/" style={{ textDecoration: 'none', color: "white" }}>
                                                                                        <span style={{ cursor: "pointer" }}> {data.text}</span>
                                                                                </Link>
                                                                                : <span key={index} id={data.id + "_DIR"} style={{ cursor: "pointer" }} onClick={(e) => { handleDir(e) }}> {' > ' + data.text}</span>

                                                                )
                                                        })}
                                                </div>

                                                {(() => {
                                                        switch (statesol) {
                                                                case 'list':
                                                                        return (
                                                                                <div className="DAT_View_Content_Tit">
                                                                                        <img alt="" src={icon} ></img>
                                                                                        <div className="DAT_View_Content_Tit-content" >{inf.tit}</div>
                                                                                </div>
                                                                        )
                                                                case 'project':
                                                                        return (
                                                                                <div className="DAT_View_Content_Project">
                                                                                        <img alt="" className="DAT_View_Content_Project-avatar" src={avatar}></img>
                                                                                        <div className="DAT_View_Content_Project-tit">
                                                                                                <div className="DAT_View_Content_Project-tit" >{showproject[0].name}</div>
                                                                                        </div>
                                                                                </div>
                                                                        )
                                                                default:
                                                                        return <></>

                                                        }
                                                })()}

                                                {(() => {
                                                        switch (statesol) {
                                                                case 'list':
                                                                        return (
                                                                                <>
                                                                                        {/* {(project.length > 0)? */}

                                                                                        <div className="DAT_View_Content_Main" id="listContainer">
                                                                                                <div className="DAT_View_Content_Main_Nav" >
                                                                                                        {/* <div className="DAT_View_Content_Main_Nav_Item" id="project" onClick={() => { tab.value = 'project' }} style={{ color: (tab.value === 'project') ? color.cur : color.pre }} >Dự án</div>
                                                                                        <div className="DAT_View_Content_Main_Nav_Item" id="device" onClick={() => { tab.value = 'device' }} style={{ color: (tab.value === 'device') ? color.cur : color.pre }}>Thiết bị</div> */}

                                                                                                        {searchmoblile.value
                                                                                                                ?
                                                                                                                Object.keys(list).map((keyName, i) => {
                                                                                                                        return (
                                                                                                                                (keyName === tab.value)
                                                                                                                                        ? <div key={i} className="DAT_Model_Tab_main">
                                                                                                                                                <p className="DAT_Model_Tab_main_left"></p>
                                                                                                                                                <span className="DAT_Model_Tab_main_content1" id={keyName} style={{ backgroundColor: "White", color: "black", borderRadius: "10px 10px 0 0", paddingLeft: "20px" }} onClick={() => tab.value = keyName}>{list[keyName]}</span>
                                                                                                                                                <p className="DAT_Model_Tab_main_right"></p>
                                                                                                                                        </div>
                                                                                                                                        : <span className="DAT_Model_Tab_main_content2" key={i} id={keyName} style={{ backgroundColor: "#dadada" }} onClick={() => tab.value = keyName}>{list[keyName]}</span>
                                                                                                                        )
                                                                                                                })
                                                                                                                : <div className="DAT_ModelMobile_Tab">

                                                                                                                        <button className="DAT_ModelMobile_Tab_content" onClick={() => mobiletab.value = !mobiletab.value} > <span> {list[tab]}</span>  {(mobiletab.value) ? <IoIosArrowDown /> : <IoIosArrowForward />} </button>


                                                                                                                        {(mobiletab.value)

                                                                                                                                ? <div className="DAT_ModelMobile_Tab_list" >
                                                                                                                                        {Object.keys(list).map((keyName, i) => {

                                                                                                                                                return (

                                                                                                                                                        <div className="DAT_ModelMobile_Tab_list_item" key={i} id={keyName} onClick={() => tab.value = keyName} >{i + 1}: {list[keyName]}</div>

                                                                                                                                                )

                                                                                                                                        })}
                                                                                                                                </div>
                                                                                                                                : <></>
                                                                                                                        }

                                                                                                                </div>
                                                                                                        }

                                                                                                        {tab.value === '1'
                                                                                                                ? (type !== 'user')
                                                                                                                        ? <div className="DAT_View_Content_Main_Nav_Add" >
                                                                                                                                <form onSubmit={e => handleAddproject(e)}>
                                                                                                                                        <input placeholder="Nhập mã dự án" id="addproject" required></input>
                                                                                                                                        <button><ion-icon name="add-outline"></ion-icon></button>
                                                                                                                                </form>
                                                                                                                        </div>
                                                                                                                        : <></>

                                                                                                                : (type !== 'user')
                                                                                                                        ? <div className="DAT_View_Content_Main_Nav_Add">
                                                                                                                                <form onSubmit={e => handleAdddevice(e)}>
                                                                                                                                        <input placeholder="Nhập mã thiết bị" id="adddevice" required></input>
                                                                                                                                        <button><ion-icon name="add-outline"></ion-icon></button>
                                                                                                                                </form>
                                                                                                                        </div>
                                                                                                                        : <></>

                                                                                                        }


                                                                                                </div>

                                                                                                {tab.value === '1'
                                                                                                        ?
                                                                                                        <div className="DAT_View_Content_Main_List">

                                                                                                                <DataTable
                                                                                                                        className="DAT_Table_Container"
                                                                                                                        columns={(type === 'user') ? columnproject_user : columnproject}
                                                                                                                        data={project}
                                                                                                                        pagination
                                                                                                                        paginationComponentOptions={paginationComponentOptions}
                                                                                                                        noDataComponent={
                                                                                                                                <div style={{ margin: "auto", textAlign: "center", color: "red", padding: "20px" }}>
                                                                                                                                        <div>Danh sách trống </div>
                                                                                                                                        <div>Vui lòng thêm dự án</div>
                                                                                                                                </div>
                                                                                                                        }
                                                                                                                />
                                                                                                        </div>
                                                                                                        :
                                                                                                        <div className="DAT_View_Content_Main_List">

                                                                                                                <DataTable
                                                                                                                        className="DAT_Table_Container"
                                                                                                                        columns={(type === 'user') ? columns2_user : columns2}
                                                                                                                        data={listdevice2}
                                                                                                                        pagination
                                                                                                                        paginationComponentOptions={paginationComponentOptions}
                                                                                                                        expandableRows
                                                                                                                        expandableRowsComponent={ExpandedComponent}
                                                                                                                        noDataComponent={
                                                                                                                                <div style={{ margin: "auto", textAlign: "center", color: "red", padding: "20px" }}>
                                                                                                                                        <div>Danh sách trống </div>
                                                                                                                                        <div>Vui lòng thêm thiết bị</div>
                                                                                                                                </div>
                                                                                                                        }
                                                                                                                />
                                                                                                        </div>
                                                                                                }
                                                                                        </div>

                                                                                        {(showdevice)
                                                                                                ? <div className="DAT_View_Content_Device" >
                                                                                                        <div className="DAT_View_Content_Device-card" id="CARD">
                                                                                                                <Toollist ></Toollist>
                                                                                                        </div>
                                                                                                </div>
                                                                                                : <></>
                                                                                        }

                                                                                        <div className="DAT_PopupBG"
                                                                                                style={{ height: fix ? "100vh" : "0px", }}
                                                                                                onSubmit={(e) => handleSaveFix(e)}
                                                                                        >
                                                                                                {(fix)
                                                                                                        ?
                                                                                                        <form className="DAT_View_Content_Fix-group">
                                                                                                                {/* <div className="DAT_View_Content_Fix-group-code"><span>Mã:{code}</span> <span onClick={() => setFix(false)}><ion-icon name="close-outline"></ion-icon></span></div> */}
                                                                                                                <div className="DAT_View_Content_Fix-group_Head">
                                                                                                                        <div className="DAT_View_Content_Fix-group_Head_Left">Mã: {code}</div>
                                                                                                                        <div className="DAT_View_Content_Fix-group_Head_Right">
                                                                                                                                <div className="DAT_View_Content_Fix-group_Head_Right_Close"
                                                                                                                                        id="Popup"
                                                                                                                                        onMouseEnter={(e) => handlePopup("new")}
                                                                                                                                        onMouseLeave={(e) => handlePopup("pre")}
                                                                                                                                        onClick={() => { setFix(false) }}
                                                                                                                                >
                                                                                                                                        <IoClose size={25} color="white" />
                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                                </div>

                                                                                                                {(() => {
                                                                                                                        switch (fixtype) {
                                                                                                                                case 'FIX_P':
                                                                                                                                        return (
                                                                                                                                                <div className="DAT_View_Content_Fix-group_Body">
                                                                                                                                                        <div className="DAT_View_Content_Fix-group_Body_Row">
                                                                                                                                                                <label>Tên Dự Án</label>
                                                                                                                                                                <div className="DAT_View_Content_Fix-group_Body_Row_Input">
                                                                                                                                                                        <input type="text" minLength={6} defaultValue={pname.current} ref={pname} required />
                                                                                                                                                                </div>

                                                                                                                                                                <label>Tên Công Ty</label>
                                                                                                                                                                <div className="DAT_View_Content_Fix-group_Body_Row_Input">
                                                                                                                                                                        <input type="text" minLength={6} defaultValue={pcompany.current} ref={pcompany} required />
                                                                                                                                                                </div>

                                                                                                                                                                <label>Vị Trí</label>
                                                                                                                                                                <div className="DAT_View_Content_Fix-group_Body_Row_Input">
                                                                                                                                                                        <input type="text" minLength={6} defaultValue={paddr.current} ref={paddr} required />
                                                                                                                                                                </div>

                                                                                                                                                                <label>Vĩ độ(Nhấn vào vị trí sẽ tự động cập nhật)</label>
                                                                                                                                                                <div className="DAT_View_Content_Fix-group_Body_Row_Input">
                                                                                                                                                                        <input type="text" minLength={6} defaultValue={lat.current} ref={lat} id="lat" onClick={handleInput} required />
                                                                                                                                                                </div>

                                                                                                                                                                <label>Kinh độ(Nhấn vào vị trí sẽ tự động cập nhật)</label>
                                                                                                                                                                <div className="DAT_View_Content_Fix-group_Body_Row_Input">
                                                                                                                                                                        <input type="text" minLength={6} defaultValue={lng.current} ref={lng} id="lng" onClick={handleInput} required />
                                                                                                                                                                </div>
                                                                                                                                                        </div>
                                                                                                                                                </div>
                                                                                                                                        )
                                                                                                                                case 'FIX_D':
                                                                                                                                        return (
                                                                                                                                                <div className="DAT_View_Content_Fix-group_Body">
                                                                                                                                                        <div className="DAT_View_Content_Fix-group_Body_Row">
                                                                                                                                                                <label>Tên Thiết Bị</label>
                                                                                                                                                                <div className="DAT_View_Content_Fix-group_Body_Row_Input">
                                                                                                                                                                        <input type="text" minLength={6} defaultValue={dname.current} ref={dname} required />
                                                                                                                                                                </div>

                                                                                                                                                                <label>Mô Tả</label>
                                                                                                                                                                <div className="DAT_View_Content_Fix-group_Body_Row_Input">
                                                                                                                                                                        <input type="text" minLength={6} defaultValue={ddescription.current} ref={ddescription} required />
                                                                                                                                                                </div>
                                                                                                                                                        </div>
                                                                                                                                                </div>
                                                                                                                                        )
                                                                                                                                default:
                                                                                                                                        return (
                                                                                                                                                <div className="DAT_View_Content_Fix-group_Body">
                                                                                                                                                        <div className="DAT_View_Content_Fix-group_Body_Row"
                                                                                                                                                                style={{ color: "red" }}
                                                                                                                                                        >
                                                                                                                                                                {fixtype === "DEL_D" ? "Thiết bị" : "Dự án"}{" "}
                                                                                                                                                                này sẽ bị gỡ bỏ khỏi tài khoản của
                                                                                                                                                                bạn, bạn vẫn muốn gỡ ?
                                                                                                                                                        </div>
                                                                                                                                                </div>
                                                                                                                                        )

                                                                                                                        }
                                                                                                                })()}

                                                                                                                <div className="DAT_View_Content_Fix-group_Foot">
                                                                                                                        <button>Xác Nhận</button>
                                                                                                                </div>
                                                                                                        </form>

                                                                                                        : <></>
                                                                                                }
                                                                                        </div>
                                                                                </>
                                                                        )
                                                                case 'project':
                                                                        return (
                                                                                <>
                                                                                        {showproject.map((data, index) => (
                                                                                                <div key={index} className="DAT_View_Content_Overview" id="DAT_overview">

                                                                                                        <Tooloverview username={props.username} projectid={data.projectid} type={data.code} company={data.company} name={data.name} addr={data.addr} report={data.report} />

                                                                                                </div>
                                                                                        ))}

                                                                                        {(showdevice)
                                                                                                ? <div className="DAT_View_Content_Device" >
                                                                                                        <div className="DAT_View_Content_Device-card" id="CARD">
                                                                                                                <Toollist ></Toollist>
                                                                                                        </div>


                                                                                                </div>
                                                                                                : <></>
                                                                                        }




                                                                                </>

                                                                        )
                                                                default:
                                                                        return <></>
                                                        }
                                                })()}
                                        </div>
                                </div>
                                : <div className="DAT_Mobile">
                                        {/* <div className="DAT_Mobile_Banner" style={{ backgroundImage: banner, backgroundPosition: "bottom", backgroundRepeat: "no-repeat", backgroundSize: "cover" }}>
                                                <div className="DAT_Mobile_Banner_Shadow" ></div>
                                        </div> */}

                                        {(() => {
                                                switch (statesol) {
                                                        case 'list':
                                                                return (
                                                                        <>
                                                                                <div className="DAT_Mobile_Container">

                                                                                        {/* <div className="DAT_Mobile_Container_Search">
                                                                                                <input placeholder={tab.value === '1' ? "Nhập tên dự án" : "Nhập tên thiết bị"} ></input>
                                                                                                <button>+</button>
                                                                                        </div> */}
                                                                                        <div className="DAT_Mobile_Container_Head" >
                                                                                                {iconmobile}
                                                                                                <span >{inf.tit}</span>
                                                                                        </div>
                                                                                        <div className="DAT_Mobile_Container_Bar">
                                                                                                {/* backgroundColor: tab.value === '1' ? 'rgb(38, 143, 214)' : 'white', */}
                                                                                                <div className="DAT_Mobile_Container_Bar_project" onClick={() => { tab.value = '1' }}>
                                                                                                        <div className="DAT_Mobile_Container_Bar_project_bg" style={{ height: tab.value === '1' ? '140px' : '200px', transition: '0.5s' }} ></div>
                                                                                                        <div className="DAT_Mobile_Container_Bar_project_add" style={{ height: tab.value === '1' ? '60px' : '0', transition: '0.5s' }} ><span>Thêm dự án</span><IoIosAddCircle size={30} color="gray" /></div>
                                                                                                </div>
                                                                                                <div className="DAT_Mobile_Container_Bar_device" onClick={() => { tab.value = '2' }} >
                                                                                                        <div className="DAT_Mobile_Container_Bar_device_bg" style={{ height: tab.value === '2' ? '140px' : '200px', transition: '0.5s' }} ></div>
                                                                                                        <div className="DAT_Mobile_Container_Bar_device_add" style={{ height: tab.value === '2' ? '60px' : '0', transition: '0.5s' }}><span>Thêm thiết bị</span><IoIosAddCircle size={30} color="gray" /></div>
                                                                                                </div>
                                                                                        </div>
                                                                                        <div>
                                                                                                {tab.value === '1'
                                                                                                        ? <>
                                                                                                                {project.map((data, index) => (
                                                                                                                        <div key={index} className="DAT_Mobile_Container_Content">
                                                                                                                                <div className="DAT_Mobile_Container_Content_Top">
                                                                                                                                        <div className="DAT_Mobile_Container_Content_Top_left" id={data.projectid + "_PROJECT"} onClick={(e) => { handleProject(e) }} >
                                                                                                                                                <img alt="" src={avatar} ></img>
                                                                                                                                        </div>
                                                                                                                                        <div className="DAT_Mobile_Container_Content_Top_right" >
                                                                                                                                                <div className="DAT_Mobile_Container_Content_Top_right_tit" id={data.projectid + "_PROJECT"} onClick={(e) => { handleProject(e) }} >{data.name}</div>
                                                                                                                                                <div className="DAT_Mobile_Container_Content_Top_right_company">Công ty: {data.company}</div>
                                                                                                                                                <div className="DAT_Mobile_Container_Content_Top_right_state">Trạng thái: {data.status ? <img alt="" style={{ width: "13px" }} src="/lib/true_state.png"></img> : <img alt="" style={{ width: "13px" }} src="/lib/warning_state.png"></img>}</div>

                                                                                                                                        </div>
                                                                                                                                </div>
                                                                                                                                <div className="DAT_Mobile_Container_Content_Bottom" >
                                                                                                                                        <div className="DAT_Mobile_Container_Content_Bottom_addr">{data.addr}</div>
                                                                                                                                        <div className="DAT_Mobile_Container_Content_Bottom_edit" >
                                                                                                                                                <LuFolderEdit size={15} />
                                                                                                                                                <RiDeleteBin6Line size={15} />
                                                                                                                                        </div>
                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                                ))}
                                                                                                        </>
                                                                                                        : <>
                                                                                                                {listdevice2.map((data, index) => (
                                                                                                                        <div key={index} className="DAT_Mobile_Container_Content">
                                                                                                                                <div className="DAT_Mobile_Container_Content_Top">
                                                                                                                                        <div className="DAT_Mobile_Container_Content_Top_left" id={data.deviceid + "_noP"} onClick={(e) => { handleDevice(e) }}>
                                                                                                                                                <img alt="" src={avatar} ></img>
                                                                                                                                        </div>
                                                                                                                                        <div className="DAT_Mobile_Container_Content_Top_right" >
                                                                                                                                                <div className="DAT_Mobile_Container_Content_Top_right_tit">{data.name}</div>
                                                                                                                                                <div className="DAT_Mobile_Container_Content_Top_right_company">SN: {data.deviceid}</div>
                                                                                                                                                <div className="DAT_Mobile_Container_Content_Top_right_state">Trạng thái: {data.status ? <img alt="" style={{ width: "13px" }} src="/lib/true_state.png"></img> : <img alt="" style={{ width: "13px" }} src="/lib/warning_state.png"></img>}</div>

                                                                                                                                        </div>
                                                                                                                                </div>
                                                                                                                                <div className="DAT_Mobile_Container_Content_Bottom" >
                                                                                                                                        <div className="DAT_Mobile_Container_Content_Bottom_addr">{data.description}</div>
                                                                                                                                        <div className="DAT_Mobile_Container_Content_Bottom_edit" >
                                                                                                                                                <LuFolderEdit size={15} />
                                                                                                                                                <RiDeleteBin6Line size={15} />
                                                                                                                                        </div>
                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                                ))}

                                                                                                        </>}
                                                                                        </div>
                                                                                </div>

                                                                                {(showdevice)

                                                                                        ? <div className="DAT_Mobile_Device" >
                                                                                                <div className="DAT_Mobile_Device-card" id="CARD">
                                                                                                        <Toollist ></Toollist>
                                                                                                </div>
                                                                                        </div>
                                                                                        : <></>}
                                                                        </>




                                                                )

                                                        case 'project':
                                                                return (
                                                                        <>
                                                                                {showproject.map((data, index) => (
                                                                                        <div key={index} className="DAT_Mobile_Overview" id="DAT_overview">

                                                                                                <div className="DAT_Mobile_Overview_Head" >
                                                                                                        <img alt="" src={avatar} ></img>
                                                                                                        <div className="DAT_Mobile_Overview_Head_tit" >
                                                                                                                {direct.map((data, index) => {
                                                                                                                        return (
                                                                                                                                (index === 1) ? <div key={index} id={data.id + "_DIR"} style={{ cursor: "pointer" }} onClick={(e) => { handleDir(e) }} className="DAT_Mobile_Overview_Head_tit_bu" >{data.text}</div> : <React.Fragment key={index} ></React.Fragment>
                                                                                                                        )
                                                                                                                })}
                                                                                                                <div className="DAT_Mobile_Overview_Head_tit_name">{data.name}</div>

                                                                                                        </div>
                                                                                                </div>
                                                                                                <Tooloverview username={props.username} avatar={avatar} projectid={data.projectid} type={data.code} company={data.company} name={data.name} addr={data.addr} report={data.report} />

                                                                                        </div>
                                                                                ))}

                                                                                {(showdevice)
                                                                                        ? <div className="DAT_Mobile_Device" >
                                                                                                <div className="DAT_Mobile_Device-card" id="CARD">
                                                                                                        <Toollist ></Toollist>
                                                                                                </div>


                                                                                        </div>
                                                                                        : <></>
                                                                                }
                                                                        </>
                                                                )
                                                        default:
                                                                return <></>

                                                }
                                        })()}

                                </div>
                        }
                </>
        );
}


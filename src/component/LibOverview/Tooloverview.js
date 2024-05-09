import React, { useContext, useEffect, useLayoutEffect, useReducer, useState } from "react";
import "./Tooloverview.scss"
import axios from "axios";
import { action } from "../Control/Action";
//import { EnvContext } from "../Context/EnvContext";
import { SettingContext } from "../Context/SettingContext";
// import Calculateoverview from "./Calculateoverview";
// import Configoverview from "./Configoverview";
import Interfaceoverview from "./Interfaceoverview";
import { OverviewContext } from "../Context/OverviewContext";
import { isBrowser } from 'react-device-detect';
// import Reducer, { INITSTATE } from "./Reducer";
import DataTable from 'react-data-table-component';
// import {
//     Chart as ChartJS,
//     CategoryScale,
//     LinearScale,
//     PointElement,
//     LineElement,
//     Title,
//     Tooltip,
//     Legend,
//     Filler,
//     BarElement,
//     ArcElement,
// } from 'chart.js';


// import Chart from 'chart.js/auto';
// import zoomPlugin from "chartjs-plugin-zoom";


// import { Bar, Line, Doughnut } from 'react-chartjs-2';
import { useDispatch, useSelector } from "react-redux";
import { useRef } from "react";
import { host } from "../constant";
import { AlertContext } from "../Context/AlertContext";
import { useIntl } from "react-intl";
import { io } from "socket.io-client";
import adminslice from "../Redux/adminslice";
import moment from "moment-timezone";
import { effect, signal } from "@preact/signals-react";
import { IoIosAddCircle, IoIosArrowDown } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
import Default from "../Default/Default";
import { pageDefault, view } from "../../App";
import { socket } from '../../App'
import GoogleMap from "google-maps-react-markers";
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { searchmoblile } from "../MenuTop/MenuTop";
import { LuFolderEdit } from "react-icons/lu";
import { RiDeleteBin6Line } from "react-icons/ri";
// Chart.register(zoomPlugin);
import { useMobileOrientation } from 'react-device-detect';
import { IoPhoneLandscapeOutline } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";
const report = signal(0)
export const overview = signal(false)
export const whatdevicegroup = signal({ id: '', groupid: '', tab: '' })




export default function Tooloverview(props) {
    const { alertDispatch } = useContext(AlertContext);
    const dataLang = useIntl();
    const [online, setOnline] = useState(0)
    const [offline, setOffline] = useState(0)
    const { listdevice, settingDispatch } = useContext(SettingContext)
    const { overview_config, overview_control } = useContext(OverviewContext)
    const token = useSelector((state) => state.admin.token)
    //const socket_client = useRef(io(host.DEVICE));
    const [step, setStep] = useState(0)
    const rootDispatch = useDispatch()
    const { isLandscape } = useMobileOrientation()


    const defaultProps = {

        center: {
            lat: 16.054083398111068,
            lng: 108.20361013247235
        },
        zoom: 7.0
    };


    //const { token } = useContext(EnvContext);
    const intervalIDRef = useReducer(null);
    const [invt, setInvt] = useState(() => {
        var x = {}
        listdevice.map((data, index) => {

            return x[data.deviceid] = {}
        })
        return x
    })



    const [tab, setTab] = useState('1')
    const [date, setDate] = useState('')


    const [option, setOption] = useState({ status: false, which: 'none' })
    const type = useSelector((state) => state.admin.type)
    const options = {
        maintainAspectRatio: false,
        plugins: {
            zoom: {

                zoom: {

                    wheel: {
                        enabled: true
                    },
                    pinch: {
                        enabled: true
                    },
                    // drag: {
                    //     enabled: true
                    // },
                    mode: 'xy'

                }
            },

        },

    };
    const [reportState, setReportState] = useState(false)
    const [fix, setFix] = useState(false)
    const [code, setCode] = useState('')
    const [fixtype, setFixtype] = useState('')

    const dname = useRef('')
    const ddescription = useRef('')


    const list = { 1: 'Dashboard', 2: 'Thiết bị' }
    // const [startDate, setStartDate] = useState(new Date());
    const [statetab, setStatetab] = useState(false)

    const TriangleBar = (props) => {
        const { fill, x, y, width, height } = props;

        return (
            <rect
                x={x}
                y={y}
                width={width}
                height={height}
                fill={"rgb(4,143,255)"}
                rx="3"
                ry="3"
                opacity="1"
            ></rect>
        );
    };

    const paginationComponentOptions = {
        rowsPerPageText: 'Số hàng',
        rangeSeparatorText: 'đến',
        selectAllRowsItem: true,
        selectAllRowsItemText: 'tất cả',
    };


    useEffect(() => {
        const newOnline = listdevice.filter(list => list.status == 1)
        const newOffline = listdevice.filter(list => list.status == 0)
        setOnline(newOnline.length)
        setOffline(newOffline.length)

    }, [listdevice])


    const columns = [
        {
            name: 'Trạm',
            selector: row => row.id,
            width: "80px",
            center: true,
        },
        {
            name: 'Tên thiết bị',
            selector: (row) => (
                <label id={row.deviceid + "_ofP"} onClick={(e) => { handleDevice(e) }} style={{ cursor: "pointer", color: "#326ba8" }} >{row.name}</label>
            ),
            minWidth: "200px",
            style: {
                justifyContent: "left",
            }

        },
        {
            name: 'Mô tả',
            selector: row => row.description,
            minWidth: "200px",
            style: {
                justifyContent: "left",
            }
        },
        {
            name: 'Trạng thái',

            selector: (row) => (
                <div style={{ width: "100%" }}>
                    {(row.action)
                        ? <img alt="" style={{ width: "25px" }} src="/lib/true_state.png"></img>
                        : <img alt="" style={{ width: "25px" }} src="/lib/warning_state.png"></img>
                    }
                </div>
            ),
            width: "100px",
            center: true,

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
            width: "130px",
            center: true,
        },
        {
            name: 'gateway',
            selector: (row) => (
                <label id={row.deviceid + "_ofP"} onClick={(e) => { handleDevice(e) }} style={{ cursor: "pointer", color: "#326ba8" }} >{row.deviceid}</label>
            ),
            width: "150px"
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
    const columnsEndUser = [
        {
            name: 'Trạm',
            selector: row => row.id,
            width: "80px",
            center: true,
        },
        {
            name: 'Tên thiết bị',
            selector: (row) => (
                <label id={row.deviceid + "_ofP"} onClick={(e) => { handleDevice(e) }} style={{ cursor: "pointer", color: "#326ba8" }} >{row.name}</label>
            ),
            minWidth: "200px",

        },
        {
            name: 'Mô tả',
            selector: row => row.description,
            minWidth: "200px",
        },
        {
            name: 'Trạng thái',

            selector: (row) => (
                <div style={{ width: "100%" }}>
                    {(row.action)
                        ? <img alt="" style={{ width: "25px" }} src="/lib/true_state.png"></img>
                        : <img alt="" style={{ width: "25px" }} src="/lib/warning_state.png"></img>
                    }
                </div>
            ),
            width: "100px",
            center: true,

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
            width: "130px",
            center: true,
        },
        {
            name: 'gateway',
            selector: (row) => (
                <label id={row.deviceid + "_ofP"} onClick={(e) => { handleDevice(e) }} style={{ cursor: "pointer", color: "#326ba8" }} >{row.deviceid}</label>
            ),
            width: "150px"
        },
        {
            name: 'Tùy chỉnh',
            selector: (row) => (<>
                <div className="DAT_Table">
                    <span className="DAT_Table-edit" id={row.deviceid + "_MORE"} onMouseEnter={e => handleModify(e, 'block')} >...</span>

                </div>

                <div className="DAT_Modify" id={row.deviceid + "_Modify"} style={{ display: "none" }} onMouseLeave={e => handleModify(e, 'none')}>
                    <div className="DAT_Modify_fix" id={row.deviceid} onClick={(e) => handleDefault(e)}>Set default</div>
                </div>

            </>
            ),
            width: "100px"
        },
    ];

    const v = 'Dữ liệu tháng'

    const data = [
        {
            name: '1',
            [v]: 1.69,

        },
        {
            name: '2',
            [v]: 0,

        },
        {
            name: '3',
            [v]: 0,

        },
        {
            name: '4',
            [v]: 0,

        },
        {
            name: '5',
            [v]: 0,

        },
        {
            name: '6',
            [v]: 0,

        },
        {
            name: '7',
            [v]: 0,

        },
        {
            name: '8',
            [v]: 0,

        },
        {
            name: '9',
            [v]: 0,

        },
        {
            name: '10',
            [v]: 0,

        },
        {
            name: '11',
            [v]: 0,

        },
        {
            name: '12',
            [v]: 0,

        },
    ];

    // useEffect(() => {

    //     if(type === 'user' && pageDefault.value.status === true){
    //         console.log(pageDefault.value)
    //         if(pageDefault.value.deviceid !== 'none'){
    //             rootDispatch(adminslice.actions.setmenu(false))
    //             settingDispatch({ type: "WHAT_DEVICE", payload: pageDefault.value.deviceid })
    //         }
    //     }

    // },[])


    const handleDefault = (e) => {
        // console.log(props.username, e.currentTarget.id)
        pageDefault.value.deviceid = e.currentTarget.id
        const setDefault = async () => {
            await axios.post(host.DEVICE + "/setDefault", { user: props.username, page: pageDefault.value }, { secure: true, reconnect: true }).then(
                (res) => {
                    // console.log(res.data)
                }
            )
        }

        setDefault();
    }


    const handleFix = (e) => {
        const id = e.currentTarget.id
        var arr = id.split("_")



        const index = listdevice.findIndex(p => p.deviceid == arr[0])
        dname.current = listdevice[index].name
        ddescription.current = listdevice[index].description

        setCode(arr[0])
        setFixtype(arr[1] + "_" + arr[2])
        setFix(true)

    }

    const handleSaveFix = (e) => {
        e.preventDefault()




        if (fixtype === 'FIX_D') {
            const index = listdevice.findIndex(p => p.deviceid == code)
            var newData = listdevice
            // console.log(newData)
            newData[index].name = dname.current.value
            newData[index].description = ddescription.current.value
            settingDispatch({ type: "LOAD_LISTDEVICE", payload: newData })
            axios.post(host.DEVICE + "/updatelistDevice", { id: code, name: dname.current.value, des: ddescription.current.value }, { secure: true, reconnect: true }).then(
                function (res) {
                    // console.log(res.data)
                    if (res.data.status) {
                        alertDispatch({ type: 'LOAD_CONTENT', payload: { content: dataLang.formatMessage({ id: "alert_5" }), show: 'block' } })
                    } else {
                        alertDispatch({ type: 'LOAD_CONTENT', payload: { content: dataLang.formatMessage({ id: "alert_3" }), show: 'block' } })
                    }
                })
        }


        if (fixtype === 'DEL_D') {

            var newData = listdevice
            newData = newData.filter(d => d.deviceid != code)
            settingDispatch({ type: "LOAD_LISTDEVICE", payload: newData })
            axios.post(host.DEVICE + "/removelistDeviceP", { projectid: props.projectid, deviceid: code }, { secure: true, reconnect: true }).then(
                function (res) {
                    // console.log(res.data)
                    if (res.data.status) {
                        alertDispatch({ type: 'LOAD_CONTENT', payload: { content: dataLang.formatMessage({ id: "alert_16" }), show: 'block' } })
                    } else {
                        alertDispatch({ type: 'LOAD_CONTENT', payload: { content: dataLang.formatMessage({ id: "alert_3" }), show: 'block' } })
                    }
                })
        }

        setFix(false)
        // setFixtype('')
        // setCode('')
    }

    const handleModify = (e, type) => {
        const id = e.currentTarget.id
        var arr = id.split("_")
        const mod = document.getElementById(arr[0] + "_Modify")
        mod.style.display = type
    }



    const invtCloud = async (data, token) => {

        var reqData = {
            "data": data,
            "token": token
        };

        try {

            const response = await axios({
                url: host.ClOUD,
                method: "post",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                data: Object.keys(reqData).map(function (key) { return encodeURIComponent(key) + '=' + encodeURIComponent(reqData[key]) }).join('&'),
            });

            return response.data

        }

        catch (e) {
            return ({ ret: 1, msg: "cloud err" })
        }


    }

    useEffect(function () {

        report.value = props.report


        if (type === 'user') {
            setTab('2')
            if (pageDefault.value.status === true && listdevice.length > 0) {
                // console.log(pageDefault.value)
                //settingDispatch({ type: "RESET_WHAT_DEVICE", payload: '' })
                // if(pageDefault.value.deviceid !== 'none'){
                rootDispatch(adminslice.actions.setmenu(false))
                settingDispatch({ type: "WHAT_DEVICE", payload: pageDefault.value.deviceid })
                // }
            }
        } else {
            setTab('1')
        }

        let today = new Date();
        const day = ['CN', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7']
        var fulldate = day[today.getDay('en-US', { timeZone: 'Asia/Ho_Chi_Minh' })] + ' ' + today.toLocaleDateString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' })
        setDate(fulldate)


    }, [pageDefault.value, listdevice])





    const handleAdddeviceP = (e) => {
        e.preventDefault()
        var d = document.getElementById("adddeviceP")
        // console.log(props.username)
        axios.post(host.DEVICE + "/addlistDevice", { username: props.username, deviceid: d.value, code: props.type, projectid: props.projectid }, { secure: true, reconnect: true }).then(
            function (res) {
                // console.log(res.data)
                if (res.data.status) {
                    alertDispatch({ type: 'LOAD_CONTENT', payload: { content: dataLang.formatMessage({ id: "alert_40" }), show: 'block' } })
                    axios.post(host.DEVICE + "/getlistDeviceP", { projectid: props.projectid }, { secure: true, reconnect: true }).then(
                        function (res) {
                            if (res.data.status) {
                                console.log("List device in project", res.data.data)
                                settingDispatch({ type: "LOAD_LISTDEVICE", payload: res.data.data })
                                // var arr = ['0']
                                // res.data.data.map((id, index) => {
                                //         arr = [...arr, id.deviceid]
                                // })
                                // overviewDispatch({ type: "SET_ID", payload: arr })

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


    /// read data
    useEffect(() => {
        //console.log(listdevice)

        var loaddata = async (id) => {
            const res = await invtCloud('{"deviceCode":"' + id + '"}', token);
            if (res.ret === 0) {
                setInvt(pre => ({ ...pre, [id]: res.data }))
                setStep(1)
            } else {
                setInvt(pre => ({ ...pre, [id]: {} }))
            }

        };
        var socket_io = async (id) => {
            try {
                socket.value.on("Server/" + id, function (data) {
                    //var check =  listdevice.filter(d => d.deviceid === data.deviceid)
                    console.log("Tooloverview socket")
                    // if(check.length === 1){
                    Object.keys(data.data).map((keyName, i) => {
                        setInvt(pre => ({
                            ...pre,
                            [data.deviceid]: {
                                ...pre[data.deviceid],
                                [keyName]: data.data[keyName]
                            }
                        }))
                    })
                    // }

                })

                socket.value.on("Server/up/" + id, function (data) {

                    console.log("Tooloverview up")
                    Object.keys(data.data).map((keyName, i) => {
                        setInvt(pre => ({
                            ...pre,
                            [data.deviceid]: {
                                ...pre[data.deviceid],
                                enabled: '1'
                            }
                        }))
                    })


                })
                socket.value.on("Server/down/" + id, function (data) {

                    console.log("Tooloverview down")
                    Object.keys(data.data).map((keyName, i) => {
                        setInvt(pre => ({
                            ...pre,
                            [data.deviceid]: {
                                ...pre[data.deviceid],
                                enabled: '0'
                            }
                        }))
                    })



                })



            } catch (error) {
                console.log(error)
            }
        }

        if (step === 0) {
            listdevice.map((data, index) => {
                return loaddata(data.deviceid)
            })
        } else {
            if (overview.value) {
                // console.log(invt)
                listdevice.map((data, index) => {
                    //console.log("hello")
                    return socket_io(data.deviceid)
                })

            } else {
                listdevice.map((data, index) => {

                    socket.value.off("Server/" + data.deviceid)
                    socket.value.off("Server/up/" + data.deviceid)
                    socket.value.off("Server/down/" + data.deviceid)

                })
            }
        }

        return () => {

            listdevice.map((data, index) => {

                socket.value.off("Server/" + data.deviceid)
                socket.value.off("Server/up/" + data.deviceid)
                socket.value.off("Server/down/" + data.deviceid)

            })

        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [step, listdevice, overview.value])





    const handleTab = (e) => {
        const ID = e.currentTarget.id
        setTab(ID)
    }
    const handleTabMobile = (e) => {
        const ID = e.currentTarget.id
        setTab(ID)
        setStatetab(false)
    }


    const handleDevice = (event) => {
        rootDispatch(adminslice.actions.setmenu(false))
        const ID = event.currentTarget.id;
        var arr = ID.split("_")
        // console.log(arr)
        view.value.type = 'single'
        //view.value.id = 'G01'
        //view.value.tab = arr[2]
        settingDispatch({ type: "WHAT_DEVICE", payload: arr[0] })

    }

    const handleTabCheck = () => {
        overview.value = !overview.value


    }
    const handleDeviceGroup = (event) => {
        rootDispatch(adminslice.actions.setmenu(false))
        const arr = event.currentTarget.id.split("_")
        // console.log(arr)
        view.value.type = 'group'
        view.value.id = arr[1]
        view.value.tab = arr[2]
        settingDispatch({ type: "WHAT_DEVICE", payload: arr[0] })


        // const ID = event.currentTarget.id;
        // var arr = ID.split("_")
        // const newarr = listdevice2.find(newarr => newarr.deviceid == arr[0])
        // // console.log(newarr)
        // console.log(arr)
        // view.value.type = 'group'
        // view.value.id = arr[1]

        // const getMonitorDevice = async () => {
        //     rootDispatch(toolslice.actions.setstatus(true))
        //     await axios.post(host.DEVICE + "/getMonitorDeviceGroup", { id: arr[0], groupid: arr[1] }, { secure: true, reconnect: true }).then(
        //         function (res) {
        //             console.log("Screen data", res.data.data)
        //             settingDispatch({ type: "LOAD_SCREEN", payload: { currentID: arr[0], currentName: newarr.name, screen: res.data.data, sttdata: true } })
        //             settingDispatch({ type: "LOAD_DEFAULT", payload: parseInt(arr[2]) })
        //             axios.get(host.DEVICE + "/getTabMD/" + arr[0], { secure: true, reconnect: true }).then(
        //                 function (res) {
        //                     settingDispatch({ type: "LOAD_LASTTAB", payload: parseInt(res.data[0].tab) })

        //                 })

        //         })
        // }

        // getMonitorDevice();


    }




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


    return (
        <>
            <div className="DAT_ToolOverview">


                {isBrowser
                    ? <div className="DAT_ToolOverview_Nav">
                        <div className="DAT_ToolOverview_Nav_List" >
                            {Object.keys(list).map((keyName, i) => {
                                return (
                                    <div className="DAT_ToolOverview_Nav_List_Item" key={i} id={keyName} style={{ color: tab === keyName ? "white" : "gray", backgroundColor: tab === keyName ? "#6495ed" : "white" }} onClick={(e) => handleTab(e)} >{list[keyName]}</div>
                                )
                            })}
                        </div>


                    </div>
                    : <div className="DAT_ToolOverview_NavMobile">


                        <div className="DAT_ToolOverview_NavMobile_dashboard" id='1' onClick={(e) => handleTab(e)} >
                            <div className="DAT_ToolOverview_NavMobile_dashboard_bg" style={{ height: tab === '1' ? '140px' : '200px', transition: '0.5s' }} ></div>
                            <div className="DAT_ToolOverview_NavMobile_dashboard_add" style={{ height: tab === '1' ? '60px' : '0', transition: '0.5s' }} ><span>Dashboard</span></div>
                        </div>

                        <div className="DAT_ToolOverview_NavMobile_device" id='2' onClick={(e) => handleTab(e)} >
                            <div className="DAT_ToolOverview_NavMobile_device_bg" style={{ height: tab === '2' ? '140px' : '200px', transition: '0.5s' }} ></div>
                            <div className="DAT_ToolOverview_NavMobile_device_add" style={{ height: tab === '2' ? '60px' : '0', transition: '0.5s' }} ><span>Thêm thiết bị</span><IoIosAddCircle size={30} color="gray" /></div>
                        </div>




                    </div>}


                {(() => {
                    switch (tab) {
                        case '1':
                            return (<>
                                <div className="DAT_ToolOverview_Main">
                                    <div className="DAT_ToolOverview_Main_Data">
                                        <div className="DAT_ToolOverview_Main_Data_Head" >
                                            Tổng quan thiết bị
                                        </div>
                                        <div className="DAT_ToolOverview_Main_Data_Content" >
                                            <div className="DAT_ToolOverview_Main_Data_Content_Total">
                                                {listdevice.length}

                                            </div>
                                            <div className="DAT_ToolOverview_Main_Data_Content_Detail" onClick={(e) => { handleTabCheck(e) }} >Xem tổng quan</div>

                                        </div>
                                        <div className="DAT_ToolOverview_Main_Data_Group" >
                                            <div className="DAT_ToolOverview_Main_Data_Group_Item" style={{ backgroundColor: "rgb(255, 80, 80,0.3)" }}>
                                                <div className="DAT_ToolOverview_Main_Data_Group_Item_Tit">Online</div>
                                                <span>{online}</span>
                                            </div>
                                            <div className="DAT_ToolOverview_Main_Data_Group_Item" style={{ backgroundColor: "rgba(40, 65, 255, 0.3)" }}>
                                                <div className="DAT_ToolOverview_Main_Data_Group_Item_Tit">Offline</div>
                                                <span>{offline}</span>
                                            </div>
                                            <div className="DAT_ToolOverview_Main_Data_Group_Item" style={{ backgroundColor: "rgba(255, 223, 40, 0.5)" }}>
                                                <div className="DAT_ToolOverview_Main_Data_Group_Item_Tit">Đang lỗi</div>
                                                <span>0</span>
                                            </div>
                                            <div className="DAT_ToolOverview_Main_Data_Group_Item" style={{ backgroundColor: "rgba(58, 255, 40, 0.5)" }}>
                                                <div className="DAT_ToolOverview_Main_Data_Group_Item_Tit">Hết hạn</div>
                                                <span>0</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="DAT_ToolOverview_Main_Chart">
                                        <div className="DAT_ToolOverview_Main_Chart_Head" >
                                            Lịch sử
                                        </div>
                                        <div className='DAT_ToolOverview_Main_Chart_Group'>
                                            <div className='DAT_ToolOverview_Main_Chart_Group_Unit'>unit</div>
                                            <div className='DAT_ToolOverview_Main_Chart_Group_Label'>Dữ liệu theo năm: 1.69 MWh</div>
                                        </div>
                                        <div className='DAT_ToolOverview_Main_Chart_Content'>

                                            <ResponsiveContainer style={{ width: "100%", height: "100%", marginLeft: "-20px" }}>
                                                <BarChart width={150} height={200} data={data}>
                                                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                                    <YAxis axisLine={false} tickLine={false} />
                                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                                    <Tooltip />
                                                    <Legend />
                                                    <Bar shape={<TriangleBar />} dataKey={v} fill="#6495ed" barSize={15} legendType='circle' style={{ fill: "#6495ed" }} />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                    <div className="DAT_ToolOverview_Main_Inf">
                                        <div className="DAT_ToolOverview_Main_Inf_Head" >
                                            Thông tin dự án
                                        </div>
                                        <div className="DAT_Tooloverview_Main_Inf_Group" >
                                            <div className="DAT_ToolOverview_Main_Inf_Group_Item">
                                                <span >Công ty:</span><span>{props.company}</span>
                                            </div>
                                            <div className="DAT_ToolOverview_Main_Inf_Group_Item">
                                                <span >Địa chỉ:</span><span>{props.addr}</span>
                                            </div>
                                            <div className="DAT_ToolOverview_Main_Inf_Group_Item">
                                                <span>Trạng thái:</span><span>{props.status}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="DAT_ToolOverview_Main_Map">
                                        <div className="DAT_ToolOverview_Main_Map_Content">

                                            <GoogleMap
                                                apiKey={process.env.REACT_APP_GGKEY}
                                                defaultCenter={defaultProps.center}
                                                defaultZoom={defaultProps.zoom}
                                            //onGoogleApiLoaded={onGoogleApiLoaded}
                                            >
                                            </GoogleMap>
                                        </div>
                                    </div>
                                </div>
                            </>
                            )


                        case '2':
                            return <>
                                {isBrowser
                                    ? <div className="DAT_ToolOverview_List">

                                        {(type !== 'user' && tab === '2')
                                            ? <div className="DAT_ToolOverview_List_Head">
                                                <form onSubmit={e => handleAdddeviceP(e)}>
                                                    <input placeholder="Nhập mã thiết bị" id="adddeviceP" required></input>
                                                    <button><ion-icon name="add-outline"></ion-icon></button>
                                                </form>
                                            </div>
                                            : <></>
                                        }

                                        <div className="DAT_ToolOverview_List_Table">

                                            <DataTable
                                                className="DAT_Table_Container"
                                                columns={(type === 'user') ? columnsEndUser : columns}
                                                data={listdevice}
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
                                    </div>
                                    : <>
                                        {listdevice.map((data, index) => (
                                            <div key={index} className="DAT_ToolOverview_ListMobile">
                                                <div className="DAT_ToolOverview_ListMobile_Top">
                                                    <div className="DAT_ToolOverview_ListMobile_Top_left" id={data.deviceid + "_ofP"} onClick={(e) => { handleDevice(e) }} >
                                                        <img alt="" src={props.avatar}  ></img>
                                                    </div>
                                                    <div className="DAT_ToolOverview_ListMobile_Top_right" >
                                                        <div className="DAT_ToolOverview_ListMobile_Top_right_tit" id={data.deviceid + "_ofP"} onClick={(e) => { handleDevice(e) }} >{data.name}</div>
                                                        <div className="DAT_ToolOverview_ListMobile_Top_right_company">SN: {data.deviceid}</div>
                                                        <div className="DAT_ToolOverview_ListMobile_Top_right_state">Trạng thái: {data.status ? <img alt="" style={{ width: "13px" }} src="/lib/true_state.png"></img> : <img alt="" style={{ width: "13px" }} src="/lib/warning_state.png"></img>}</div>

                                                    </div>
                                                </div>
                                                <div className="DAT_ToolOverview_ListMobile_Bottom" >
                                                    <div className="DAT_ToolOverview_ListMobile_Bottom_addr">{data.description}</div>
                                                    <div className="DAT_ToolOverview_ListMobile_Bottom_edit" >
                                                        <LuFolderEdit size={15} />
                                                        <RiDeleteBin6Line size={15} />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </>
                                }
                            </>

                        default:
                            return <></>

                    }
                })()}





                {(overview.value)
                    ? <div className="DAT_ToolOverview_Overview">

                        <div className="DAT_ToolOverview_Overview_Container">
                            <div className="DAT_ToolOverview_Overview_Container_Head">
                                <div className="DAT_ToolOverview_Overview_Container_Head_Tit">
                                    Tổng Quan Hệ Thống
                                </div>
                                <div className="DAT_ToolOverview_Overview_Container_Head_Close" onClick={(e) => handleTabCheck(e)}>
                                    <ion-icon name="close-outline"></ion-icon>
                                </div>

                            </div>
                            <div className="DAT_ToolOverview_Overview_Container_Content" style={{ padding: "15px" }}>

                                {(overview_config)
                                    ? <>
                                        {/* <Configoverview id={props.projectid} type={props.type} invt={invt} />
                                        {(overview_control.stt)
                                            ? <Calculateoverview invt={invt} />
                                            : <></>
                                        } */}
                                    </>
                                    : <Interfaceoverview id={props.projectid} type={props.code} invt={invt} />
                                }
                            </div>
                        </div>
                        {isLandscape
                            ? <></>
                            : <div className="DAT_Landscape" >

                                <div className="DAT_Landscape_tit">Embody</div>
                                <div className="DAT_Landscape_ver">Phiên bản: 3.0</div>
                                <div className="DAT_Landscape_note">Bạn vui lòng chuyển sang chế độ Landscape bằng cách xoay <span><IoPhoneLandscapeOutline size={25} color="Black" /></span> thiết bị của bạn</div>
                                <div className="DAT_Landscape_cancel" onClick={(e) => handleTabCheck(e)}><div >Thoát</div></div>

                            </div>

                        }
                    </div>
                    : <></>
                }


            </div >
            <div className="DAT_FixOverview" style={{ height: fix ? "100vh" : "0px", transition: "0.5s" }}>
                {(fix)
                    ? <form className="DAT_FixOverview_Form" onSubmit={e => handleSaveFix(e)}>

                        <div className="DAT_FixOverview_Form-code"><span>Mã:{code}</span><span onClick={() => setFix(false)}><ion-icon name="close-outline"></ion-icon></span></div>


                        {(fixtype === 'FIX_D')
                            ? <>
                                <div className="DAT_FixOverview_Form-group" style={{ borderRadius: "5px 5px 0px 0px" }}>
                                    <div className="DAT_FixOverview_Form-group-tit">Tên Thiết Bị</div>
                                    <input type="text" minLength={10} defaultValue={dname.current} ref={dname} required></input>
                                </div>
                                <div className="DAT_FixOverview_Form-group">
                                    <div className="DAT_FixOverview_Form-group-tit">Mô Tả</div>
                                    <input type="text" minLength={10} defaultValue={ddescription.current} ref={ddescription} required></input>
                                </div>
                            </>
                            : <div className="DAT_FixOverview_Form-group" style={{ borderRadius: "5px 5px 0px 0px" }}>
                                <div className="DAT_FixOverview_Form-group-tit" style={{ color: "red" }}>Thiết bị này sẽ bị gỡ bỏ khỏi dự án này của bạn, bạn vẫn muốn gỡ?</div>
                            </div>
                        }



                        <div className="DAT_FixOverview_Form-group" style={{ borderRadius: "0 0 5px 5px" }}>
                            <button>Xác Nhận</button>
                        </div>



                    </form>

                    : <></>
                }
            </div>
        </>
    )
}
import React, { useContext, useEffect, useRef } from "react";
import "./Report.scss"
import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { host } from "../constant";
import fileDownload from "js-file-download";
import { AlertContext } from "../Context/AlertContext";
import { useIntl } from "react-intl";
import { action } from "../Alert/Action";
import { signal } from "@preact/signals-react";
import moment from "moment-timezone";
import { FaFileExcel } from "react-icons/fa";
import { format, eachDayOfInterval } from 'date-fns';
import { useSelector } from "react-redux";
import { isBrowser } from "react-device-detect";
import { AiOutlineControl } from "react-icons/ai";

const reportlist = signal([]);
const reportm = signal([]);
const day = signal(new Date().getDay());

export default function Report(props) {
    const type = useSelector((state) => state.admin.type)
    const banner = "url('/banner/Report_banner.png')"
    const icon = <ion-icon name="document-text-outline"></ion-icon>
    const iconmobile = <AiOutlineControl color="gray" size={25} />
    const inf = { code: 'Report', tit: 'Báo cáo' }
    const [direct, SetDirect] = useState([{ id: 'home', text: 'Trang chủ' }, { id: 'list', text: inf.tit }])

    const [custom, setCustom] = useState(true);

    const dataLang = useIntl();
    const { alertDispatch } = useContext(AlertContext);
    const [step, setStep] = useState('step3');
    const [file, setFile] = useState(null);
    const [report, setReport] = useState("Day");
    const [gateway, setGateway] = useState('');

    const machine = useRef();
    const date = useRef();
    const month = useRef();
    const type_time = useRef();
    const type_month = useRef();
    const from = useRef();
    const to = useRef();
    const datefrom = useRef();
    const dateto = useRef();
    const d = new Date();
    //let day = d.getDay()

    const time = [
        '00:00:00', '00:30:00', '01:00:00', '01:30:00',
        '02:00:00', '02:30:00', '03:00:00', '03:30:00',
        '04:00:00', '04:30:00', '05:00:00', '05:30:00',
        '06:00:00', '06:30:00', '07:00:00', '07:30:00',
        '08:00:00', '08:30:00', '09:00:00', '09:30:00',
        '10:00:00', '10:30:00', '11:00:00', '11:30:00',
        '12:00:00', '12:30:00', '13:00:00', '13:30:00',
        '14:00:00', '14:30:00', '15:00:00', '15:30:00',
        '16:00:00', '16:30:00', '17:00:00', '17:30:00',
        '18:00:00', '18:30:00', '19:00:00', '19:30:00',
        '20:00:00', '20:30:00', '21:00:00', '21:30:00',
        '22:00:00', '22:30:00', '23:00:00', '23:30:00',
        '23:59:00'
    ]

    const Low = [
        '00:00:00', '00:30:00', '01:00:00', '01:30:00',
        '02:00:00', '02:30:00', '03:00:00', '03:30:00',
        '04:00:00', '22:00:00', '22:30:00', '23:00:00',
        '23:30:00', '23:59:00'
    ]

    const Mid_Week = [
        '04:00:00', '04:30:00', '05:00:00', '05:30:00',
        '06:00:00', '06:30:00', '07:00:00', '07:30:00',
        '08:00:00', '08:30:00', '09:00:00', '09:30:00',
        '11:30:00', '12:00:00', '12:30:00', '13:00:00',
        '13:30:00', '14:00:00', '14:30:00', '15:00:00',
        '15:30:00', '16:00:00', '16:30:00', '17:00:00',
        '20:00:00', '20:30:00', '21:00:00', '21:30:00',
        '22:00:00'
    ]

    const Mid_Weekend = [
        '04:00:00', '04:30:00', '05:00:00', '05:30:00',
        '06:00:00', '06:30:00', '07:00:00', '07:30:00',
        '08:00:00', '08:30:00', '09:00:00', '09:30:00',
        '10:00:00', '10:30:00', '11:00:00', '11:30:00',
        '12:00:00', '12:30:00', '13:00:00', '13:30:00',
        '14:00:00', '14:30:00', '15:00:00', '15:30:00',
        '16:00:00', '16:30:00', '17:00:00', '17:30:00',
        '18:00:00', '18:30:00', '19:00:00', '19:30:00',
        '20:00:00', '20:30:00', '21:00:00', '21:30:00',
        '22:00:00'
    ]

    const High = [
        '09:30:00', '10:00:00', '10:30:00', '11:00:00',
        '11:30:00', '17:00:00', '17:30:00', '18:00:00',
        '18:30:00', '19:00:00', '19:30:00', '20:00:00',
    ]

    useEffect(() => {
        //console.log(props.username)
        reportlist.value = []
        axios.post(host.DEVICE + "/getErrbyUser", { user: props.username, type: "Project" }, { secure: true, reconnect: true })
            .then((res) => {
                //console.log(res.data)
                var listp = res.data
                axios.post(host.DEVICE + "/getErrbyUser", { user: props.username, type: "None" }, { secure: true, reconnect: true })
                    .then((res) => {
                        //console.log(res.data)
                        reportlist.value = [...listp, ...res.data]
                        reportlist.value = reportlist.value.map((data, index) => ({ ...data, id: index + 1 }))
                        // console.log(reportlist.value)
                        setGateway(reportlist.value[0].deviceid)
                    })
            })
    }, [props.username])

    useEffect(() => {
        //console.log(day)
        if (gateway !== undefined) {
            //console.log(gateway.current)
            axios.post(host.DEVICE + "/getReportTime", { id: gateway }, { secure: true, reconnect: true })
                .then((res) => {
                    // console.log(res.data)
                    reportm.value = res.data
                })
        }
    }, [gateway])

    const handleDrag = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setFile(e.dataTransfer.files[0]);
        setStep('step2');
    };

    const handleFileChange = (e) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
            setStep('step2');
        }
    };

    const handleFileUpload = (event) => {
        event.preventDefault();
        var formdata = new FormData();
        formdata.append("myfile", file);
        setStep('step3');
        //console.log(formdata.get("myfile"))
        axios.post(host.DEVICE + "/UploadProfile", formdata, { secure: true, reconnect: true }).then(
            (res) => {
                // console.log(res.data)
                if (res.data.status) {
                    setStep('step3');
                } else {
                    setStep('step1');
                    alertDispatch(action('LOAD_CONTENT', { content: dataLang.formatMessage({ id: "alert_3" }), show: 'block' }))
                }
            }
        )
    }

    const handleChange = (e) => {
        //console.log(e.target.id)
        switch (e.target.id) {
            case 'device':
                setGateway(e.target.value);
                break;
            default:
                //console.log(e.target.value)
                setReport(e.target.value);
                break;
        }
        //setReport(e.target.value);
    };

    const handleChangeDate = (e) => {
        // console.log(date.current.value)
        const x = new Date(date.current.value)
        day.value = x.getDay()
    }

    // const handleChangeTime = (e) => {
    //     if (e.target.value === "custom") {
    //         setCustom(true);
    //     } else {
    //         setCustom(false);
    //     }

    // }


    // const handleFileCheck = (event) => {
    //     axios.post(host.DEVICE + "/CheckProfile", { deviceid: gateway.current.value, date: moment(date.current.value).format('MM/DD/YYYY'), form: form.current.value }, { secure: true, reconnect: true }).then(
    //         (res) => {
    //             console.log(res.data)

    //             if (res.data.status) {
    //                 setCheck(true);
    //             } else {
    //                 alertDispatch(action('LOAD_CONTENT', { content: dataLang.formatMessage({ id: "alert_34" }), show: 'block' }))
    //             }

    //         }
    //     )

    // }

    // const handleFileDownload = (event) => {
    //     event.preventDefault();

    //     //console.log(form.current.value, moment(date.current.value).format('MM/DD/YYYY'), gateway.current.value)



    //     //console.log(fileInput.current.files[0].name)
    //     axios.post(host.DEVICE + "/DownloadProfile", { filename: file.name, deviceid: gateway.current.value, date: moment(date.current.value).format('MM/DD/YYYY'), form: form.current.value }, { responseType: 'blob' }, { secure: true, reconnect: true }).then(
    //         (res) => {
    //             console.log(res.data)
    //             if (res.data.type === 'application/json') {
    //                 alertDispatch(action('LOAD_CONTENT', { content: dataLang.formatMessage({ id: "alert_31" }), show: 'block' }))
    //                 setCheck(false);
    //             } else {
    //                 fileDownload(res.data, file.name)
    //                 setCheck(false);
    //             }
    //         }
    //     )
    // }

    const handleCustom = (e) => {
        if (e.target.value === "custom") {
            setCustom(true);
        } else {
            setCustom(false);
        }
    }

    const exportExcelDaily = (e) => {
        //console.log(gateway, report, machine.current.value, moment(date.current.value).format('MM/DD/YYYY'), type_time.current.value, from.current.value, to.current.value)
        if (reportm.value.length > 0) {
            var i = reportm.value.findIndex(d => d.code === machine.current.value);
            //console.log(reportm.value[i])
            // console.log(type_time.current.value)
            if (type_time.current.value === "custom") {
                if (Date.parse(`${moment(date.current.value).format('MM/DD/YYYY')} ${from.current.value}:00`) < new Date() && Date.parse(`${moment(date.current.value).format('MM/DD/YYYY')} ${to.current.value}:00`) < new Date()) {
                    if (Date.parse(`${moment(date.current.value).format('MM/DD/YYYY')} ${from.current.value}:00`) <= Date.parse(`${moment(date.current.value).format('MM/DD/YYYY')} ${to.current.value}:00`)) {
                        const newData = time.filter((item) => item >= from.current.value && item <= to.current.value)
                        //console.log(newData)
                        axios.post(host.DEVICE + "/ReportDaily", { deviceid: gateway, code: machine.current.value, name: reportm.value[i].name, register: reportm.value[i].register, date: moment(date.current.value).format('MM/DD/YYYY'), time: newData, type: type_time.current.value }, { responseType: 'blob' }, { secure: true, reconnect: true }).then(
                            (res) => {
                                // console.log(res.data)
                                if (res.data.type === 'application/json') {
                                    alertDispatch(action('LOAD_CONTENT', { content: dataLang.formatMessage({ id: "alert_31" }), show: 'block' }))
                                } else {
                                    fileDownload(res.data, `Daily_All_${reportm.value[i].name}_${moment(date.current.value).format('MMDDYYYY')}.xlsx`)
                                }
                            }
                        )
                    } else {
                        console.log("to > from")
                        alertDispatch(action('LOAD_CONTENT', { content: dataLang.formatMessage({ id: "alert_46" }), show: 'block' }))
                    }
                } else {
                    console.log("Please compare with current time")
                    alertDispatch(action('LOAD_CONTENT', { content: dataLang.formatMessage({ id: "alert_46" }), show: 'block' }))
                }
            }

            if (type_time.current.value === 'high') {
                //console.log("high", High)
                axios.post(host.DEVICE + "/ReportDaily", { deviceid: gateway, code: machine.current.value, name: reportm.value[i].name, register: reportm.value[i].register, date: moment(date.current.value).format('MM/DD/YYYY'), time: High, type: type_time.current.value }, { responseType: 'blob' }, { secure: true, reconnect: true }).then(
                    (res) => {
                        // console.log(res.data)
                        if (res.data.type === 'application/json') {
                            alertDispatch(action('LOAD_CONTENT', { content: dataLang.formatMessage({ id: "alert_31" }), show: 'block' }))

                        } else {
                            fileDownload(res.data, `Daily_High_${reportm.value[i].name}_${moment(date.current.value).format('MMDDYYYY')}.xlsx`)

                        }
                    }
                )
            }

            if (type_time.current.value === 'mid') {
                //console.log("high", Mid_Week, Mid_Weekend)
                axios.post(host.DEVICE + "/ReportDaily", { deviceid: gateway, code: machine.current.value, name: reportm.value[i].name, register: reportm.value[i].register, date: moment(date.current.value).format('MM/DD/YYYY'), time: (day.value === 0) ? Mid_Weekend : Mid_Week, type: (day.value === 0) ? "custom" : type_time.current.value }, { responseType: 'blob' }, { secure: true, reconnect: true }).then(
                    (res) => {
                        // console.log(res.data)
                        if (res.data.type === 'application/json') {
                            alertDispatch(action('LOAD_CONTENT', { content: dataLang.formatMessage({ id: "alert_31" }), show: 'block' }))

                        } else {
                            fileDownload(res.data, `Daily_Mid_${reportm.value[i].name}_${moment(date.current.value).format('MMDDYYYY')}.xlsx`)

                        }
                    }
                )
            }

            if (type_time.current.value === 'low') {
                //console.log("high", Low)
                axios.post(host.DEVICE + "/ReportDaily", { deviceid: gateway, code: machine.current.value, name: reportm.value[i].name, register: reportm.value[i].register, date: moment(date.current.value).format('MM/DD/YYYY'), time: Low, type: type_time.current.value }, { responseType: 'blob' }, { secure: true, reconnect: true }).then(
                    (res) => {
                        // console.log(res.data)
                        if (res.data.type === 'application/json') {
                            alertDispatch(action('LOAD_CONTENT', { content: dataLang.formatMessage({ id: "alert_31" }), show: 'block' }))

                        } else {
                            fileDownload(res.data, `Daily_Low_${reportm.value[i].name}_${moment(date.current.value).format('MMDDYYYY')}.xlsx`)

                        }
                    }
                )
            }

        } else {
            console.log("bạn không có máy nào")
            alertDispatch(action('LOAD_CONTENT', { content: dataLang.formatMessage({ id: "alert_31" }), show: 'block' }))
        }
    }

    const exportExcelMonth = (e) => {
        console.log(gateway, report, machine.current.value, moment(month.current.value).format('MM/YYYY'), type_month.current.value, datefrom.current.value, dateto.current.value)
        if (reportm.value.length > 0) {

            if (month.current.value !== "") {
                var i = reportm.value.findIndex(d => d.code === machine.current.value);
                // console.log(reportm.value[i])
                if (new Date(datefrom.current.value) <= new Date(dateto.current.value)) {
                    const dateList = eachDayOfInterval({ start: new Date(datefrom.current.value), end: new Date(dateto.current.value) }).map((date) =>
                        format(date, 'MM/dd/yyyy')
                    );

                    // console.log(dateList)

                    axios.post(host.DEVICE + "/ReportMonth", { deviceid: gateway, code: machine.current.value, name: reportm.value[i].name, register: reportm.value[i].registermonth, month: moment(month.current.value).format('MM/YYYY'), date: dateList, type: type_month.current.value }, { responseType: 'blob' }, { secure: true, reconnect: true }).then(
                        (res) => {
                            // console.log(res.data)
                            if (res.data.type === 'application/json') {
                                alertDispatch(action('LOAD_CONTENT', { content: dataLang.formatMessage({ id: "alert_31" }), show: 'block' }))

                            } else {
                                fileDownload(res.data, `Month_${reportm.value[i].name}_${moment(month.current.value).format('MMYYYY')}.xlsx`)

                            }
                        }
                    )
                } else {
                    alertDispatch(action('LOAD_CONTENT', { content: dataLang.formatMessage({ id: "alert_47" }), show: 'block' }))
                }

            } else {
                alertDispatch(action('LOAD_CONTENT', { content: dataLang.formatMessage({ id: "alert_48" }), show: 'block' }))
            }

        } else {
            console.log("bạn không có máy nào")
            alertDispatch(action('LOAD_CONTENT', { content: dataLang.formatMessage({ id: "alert_31" }), show: 'block' }))
        }
    }

    return (
        <>
            {isBrowser ?
                <div className="DAT_Report">
                    <div className="DAT_Report_Banner"
                        style={{
                            backgroundImage: banner,
                            backgroundPosition: "bottom",
                            backgroundRepeat: "no-repeat",
                            backgroundSize: "cover"
                        }}>
                        <div className="DAT_Report_Banner_Shadow" ></div>
                    </div>
                    <div className="DAT_Report_Content">
                        <div className="DAT_Report_Content_Direct" >
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

                        <div className="DAT_Report_Content_Tit">
                            <div className="DAT_Report_Content_Tit-icon">
                                {icon}
                            </div>
                            <div className="DAT_Report_Content_Tit-content" >Báo cáo</div>
                        </div>

                        <div className="DAT_Report_Content_Main">
                            <div className="DAT_Report_Content_Main_Nav">
                                <div className="DAT_Report_Content_Main_Nav_Item">Xuất báo cáo</div>
                            </div>

                            <div className="DAT_Report_Content_Main_Report">
                                <div className="DAT_Report_Content_Main_Report-Left">
                                    {type !== 'user'
                                        ? <>
                                            <div className="DAT_Report_Content_Main_Report-Left-Title" style={{ color: "#0d6efd" }}>
                                                Chọn Gateway
                                            </div>
                                            <select id="device" onChange={(e) => handleChange(e)}>
                                                {reportlist.value.map((data, index) => {
                                                    return (
                                                        <option key={index} value={data.deviceid}>{data.deviceid}</option>
                                                    )
                                                })}
                                            </select>
                                        </>
                                        : <></>
                                    }
                                    <div className="DAT_Report_Content_Main_Report-Left-Title" style={{ color: "#0d6efd" }}>
                                        Chọn loại báo cáo
                                    </div>
                                    <select id="report" onChange={(e) => handleChange(e)}>
                                        <option value={"Day"}>Báo cáo theo ngày</option>
                                        <option value={"Month"}>Báo cáo theo tháng</option>
                                    </select>
                                </div>

                                <div className="DAT_Report_Content_Main_Report-Right">
                                    {(() => {
                                        switch (report) {
                                            case "Month":
                                                return (
                                                    <>
                                                        <div id="Month">
                                                            <div
                                                                className="DAT_Report_Content_Main_Report-Right-Title"
                                                                style={{ color: "#0d6efd" }}
                                                            >
                                                                Báo cáo theo tháng
                                                            </div>
                                                            <div className="DAT_Report_Content_Main_Report-Right-Content">
                                                                <div className="DAT_Report_Content_Main_Report-Right-Content-Select">
                                                                    <span>Thiết bị</span>
                                                                    <select ref={machine}>
                                                                        {reportm.value.map((data, index) => {
                                                                            return (
                                                                                <option key={index} value={data.code}>{data.name}</option>
                                                                            )
                                                                        })}
                                                                    </select>
                                                                </div>

                                                                <div className="DAT_Report_Content_Main_Report-Right-Content-Date">
                                                                    <span>
                                                                        Tháng
                                                                    </span>
                                                                    <input type="month" defaultValue={moment(new Date()).format("YYYY-MM")} max={moment(new Date()).format("YYYY-MM")} ref={month} />
                                                                </div>
                                                                <div className="DAT_Report_Content_Main_Report-Right-Content-Date">
                                                                    <span>Từ</span>
                                                                    <input type="date" defaultValue={moment(new Date()).format("YYYY-MM-DD")} max={moment(new Date()).format("YYYY-MM-DD")} ref={datefrom} />
                                                                    <span>Đến</span>
                                                                    <input type="date" defaultValue={moment(new Date()).format("YYYY-MM-DD")} max={moment(new Date()).format("YYYY-MM-DD")} ref={dateto} />
                                                                </div>

                                                                <div className="DAT_Report_Content_Main_Report-Right-Content-Select">
                                                                    <span>
                                                                        Khung giờ
                                                                    </span>

                                                                    <select ref={type_month}>
                                                                        <option value="custom">Tất cả</option>
                                                                        <option value="high">Giờ cao điểm</option>
                                                                        <option value="mid">Giờ bình thường</option>
                                                                        <option value="low">Giờ thấp điểm</option>
                                                                    </select>


                                                                </div>



                                                                <div className="DAT_Report_Content_Main_Report-Right-Content-Button">
                                                                    <span style={{ color: "grey" }}>
                                                                        Xuất file tại đây -{">"}
                                                                    </span>
                                                                    <div className="DAT_Report_Content_Main_Report-Right-Content-Button-Icon" onClick={() => exportExcelMonth()} >
                                                                        <FaFileExcel size={24} style={{ color: "green" }} />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </>
                                                );
                                            case "Day":
                                                return (
                                                    <>
                                                        <div id="Day">
                                                            <div className="DAT_Report_Content_Main_Report-Right-Title"
                                                                style={{ color: "#035afc" }}
                                                            >
                                                                Báo cáo theo ngày
                                                            </div>
                                                            <div className="DAT_Report_Content_Main_Report-Right-Content">
                                                                <div className="DAT_Report_Content_Main_Report-Right-Content-Select">
                                                                    <span >
                                                                        Thiết bị
                                                                    </span>
                                                                    <select ref={machine} >
                                                                        {reportm.value.map((data, index) => {
                                                                            return (
                                                                                <option key={index} value={data.code}>{data.name}</option>
                                                                            )
                                                                        })}
                                                                    </select>
                                                                </div>

                                                                <div className="DAT_Report_Content_Main_Report-Right-Content-Date">
                                                                    <span>
                                                                        Ngày
                                                                    </span>
                                                                    <input type="date" defaultValue={moment(new Date()).format("YYYY-MM-DD")} max={moment(new Date()).format("YYYY-MM-DD")} ref={date} onChange={(e) => handleChangeDate(e)} />
                                                                </div>

                                                                <div className="DAT_Report_Content_Main_Report-Right-Content-Select">
                                                                    <span>
                                                                        Khung giờ
                                                                    </span>

                                                                    <select ref={type_time} onChange={(e) => handleCustom(e)}>
                                                                        <option value="custom" >Tùy chỉnh</option>
                                                                        <option value="high" style={{ display: day.value === 0 ? 'none' : 'block' }}>Giờ cao điểm</option>
                                                                        <option value="mid">Giờ bình thường</option>
                                                                        <option value="low">Giờ thấp điểm</option>
                                                                    </select>
                                                                </div>

                                                                {(custom)
                                                                    ? <div className="DAT_Report_Content_Main_Report-Right-Content-Date" >
                                                                        <span>Từ</span>
                                                                        <div className="DAT_Report_Content_Main_Report-Right-Content-Select">
                                                                            <select ref={from}>
                                                                                {time.map((item, index) => {
                                                                                    return <option key={index} value={item} >{item}</option>;
                                                                                })}
                                                                            </select>
                                                                        </div>
                                                                        <span>Đến</span>
                                                                        <div className="DAT_Report_Content_Main_Report-Right-Content-Select">
                                                                            <select ref={to}>
                                                                                {time.map((item, index) => {
                                                                                    return <option key={index} value={item}>{item}</option>;
                                                                                })}
                                                                            </select>
                                                                        </div>
                                                                    </div>
                                                                    : <></>
                                                                }

                                                                <div className="DAT_Report_Content_Main_Report-Right-Content-Button">
                                                                    <span style={{ color: "grey" }}>
                                                                        Xuất file tại đây -{">"}
                                                                    </span>
                                                                    <div className="DAT_Report_Content_Main_Report-Right-Content-Button-Icon" onClick={() => exportExcelDaily()} >
                                                                        <FaFileExcel size={24} style={{ color: "green" }} />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </>
                                                );
                                            default:
                                                return <></>;
                                        }
                                    })()}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                :
                //MOBILE VERSION
                <div className="DAT_ReportMobile">
                    <div className="DAT_ReportMobile_Head" >
                        {iconmobile}
                        <span>{inf.tit}</span>
                    </div>

                    <div className="DAT_ReportMobile_Container">
                        <div className="DAT_ReportMobile_Container_Main">
                            <div className="DAT_ReportMobile_Container_Main_Top">
                                {type !== 'user'
                                    ? <>
                                        <div className="DAT_ReportMobile_Container_Main_Top_Title" style={{ color: "#035afc" }}>
                                            -- Chọn Gateway --
                                        </div>
                                        <select id="device" onChange={(e) => handleChange(e)}>
                                            {reportlist.value.map((data, index) => {
                                                return (
                                                    <option key={index} value={data.deviceid}>{data.deviceid}</option>
                                                )
                                            })}
                                        </select>
                                    </>
                                    : <></>

                                }
                                <div className="DAT_ReportMobile_Container_Main_Top_Title" style={{ color: "#035afc" }}>
                                    -- Chọn loại báo cáo --
                                </div>
                                <select id="report" onChange={(e) => handleChange(e)}>
                                    <option value={"Day"}>Báo cáo theo ngày</option>
                                    <option value={"Month"}>Báo cáo theo tháng</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="DAT_ReportMobile_Container2 ">
                        <div className="DAT_ReportMobile_Container2_Main">
                            <div className="DAT_ReportMobile_Container2_Main_Below">
                                {(() => {
                                    switch (report) {
                                        case "Month":
                                            return (
                                                <>
                                                    <div id="Month">
                                                        <div
                                                            className="DAT_ReportMobile_Container2_Main_Below_Title"
                                                            style={{ color: "#035afc" }}
                                                        >
                                                            -- Báo cáo theo tháng --
                                                        </div>
                                                        <div className="DAT_ReportMobile_Container2_Main_Below_Content">
                                                            <div className="DAT_ReportMobile_Container2_Main_Below_Content_Device">
                                                                <span>Thiết bị:</span>
                                                                <select ref={machine}>
                                                                    {reportm.value.map((data, index) => {
                                                                        return (
                                                                            <option key={index} value={data.code}>{data.name}</option>
                                                                        )
                                                                    })}
                                                                </select>
                                                            </div>

                                                            <div className="DAT_ReportMobile_Container2_Main_Below_Content_Type">
                                                                <span>
                                                                    Khung giờ:
                                                                </span>
                                                                <select ref={type_month}>
                                                                    <option value="custom">Tất cả</option>
                                                                    <option value="high">Giờ cao điểm</option>
                                                                    <option value="mid">Giờ bình thường</option>
                                                                    <option value="low">Giờ thấp điểm</option>
                                                                </select>
                                                            </div>

                                                            <div className="DAT_ReportMobile_Container2_Main_Below_Content_Date">
                                                                <span>
                                                                    Tháng:
                                                                </span>
                                                                <input type="month" defaultValue={moment(new Date()).format("YYYY-MM")} max={moment(new Date()).format("YYYY-MM")} ref={month} />
                                                            </div>
                                                            <div className="DAT_ReportMobile_Container2_Main_Below_Content_Date">
                                                                <span>Từ:</span>
                                                                <input style={{ marginRight: "10px" }} type="date" defaultValue={moment(new Date()).format("YYYY-MM-DD")} max={moment(new Date()).format("YYYY-MM-DD")} ref={datefrom} />
                                                                &nbsp;
                                                                <span>Đến:</span>
                                                                <input type="date" defaultValue={moment(new Date()).format("YYYY-MM-DD")} max={moment(new Date()).format("YYYY-MM-DD")} ref={dateto} />
                                                            </div>

                                                        </div>
                                                        <div className="DAT_ReportMobile_Container2_Main_Below_Content_Export">
                                                            <div className="DAT_ReportMobile_Container2_Main_Below_Content_Export_Icon"
                                                                onClick={() => exportExcelDaily()} >
                                                                <span>
                                                                    Xuất File
                                                                </span>
                                                                &nbsp;
                                                                <FaFileExcel size={24} style={{ color: "white" }} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </>
                                            );
                                        case "Day":
                                            return (
                                                <>
                                                    <div id="Day">
                                                        <div
                                                            className="DAT_ReportMobile_Container2_Main_Below_Title"
                                                            style={{ color: "#035afc" }}
                                                        >
                                                            -- Báo cáo theo ngày --
                                                        </div>
                                                        <div className="DAT_ReportMobile_Container2_Main_Below_Content">
                                                            <div className="DAT_ReportMobile_Container2_Main_Below_Content_Device">
                                                                <span >
                                                                    Thiết bị:
                                                                </span>
                                                                <select ref={machine} >
                                                                    {reportm.value.map((data, index) => {
                                                                        return (
                                                                            <option key={index} value={data.code}>{data.name}</option>
                                                                        )
                                                                    })}
                                                                </select>
                                                            </div>

                                                            <div className="DAT_ReportMobile_Container2_Main_Below_Content_Type">
                                                                <span>
                                                                    Khung giờ:
                                                                </span>

                                                                <select ref={type_time} onChange={(e) => handleCustom(e)}>
                                                                    <option value="custom" >Tùy chỉnh</option>
                                                                    <option value="high" style={{ display: day.value === 0 ? 'none' : 'block' }}>Giờ cao điểm</option>
                                                                    <option value="mid">Giờ bình thường</option>
                                                                    <option value="low">Giờ thấp điểm</option>
                                                                </select>
                                                            </div>

                                                            <div className="DAT_ReportMobile_Container2_Main_Below_Content_Date">
                                                                <span>
                                                                    Ngày:
                                                                </span>
                                                                <input type="date"
                                                                    defaultValue={moment(new Date()).format("YYYY-MM-DD")}
                                                                    max={moment(new Date()).format("YYYY-MM-DD")}
                                                                    ref={date}
                                                                    onChange={(e) => handleChangeDate(e)} />
                                                            </div>

                                                            {(custom)
                                                                ? <div className="DAT_ReportMobile_Container2_Main_Below_Content_Around" >
                                                                    <span>Từ</span>
                                                                    <div className="DAT_ReportMobile_Container2_Main_Below_Content_Date_Select">
                                                                        <select ref={from}>
                                                                            {time.map((item, index) => {
                                                                                return <option key={index} value={item} >{item}</option>;
                                                                            })}
                                                                        </select>
                                                                    </div>
                                                                    <span>Đến</span>
                                                                    <div className="DAT_ReportMobile_Container2_Main_Below_Content_Date_Select">
                                                                        <select ref={to}>
                                                                            {time.map((item, index) => {
                                                                                return <option key={index} value={item}>{item}</option>;
                                                                            })}
                                                                        </select>
                                                                    </div>
                                                                </div>
                                                                : <></>
                                                            }
                                                            <div className="DAT_ReportMobile_Container2_Main_Below_Content_Export">
                                                                <div className="DAT_ReportMobile_Container2_Main_Below_Content_Export_Icon"
                                                                    onClick={() => exportExcelDaily()} >
                                                                    <span>
                                                                        Xuất File
                                                                    </span>
                                                                    &nbsp;
                                                                    <FaFileExcel size={24} style={{ color: "white" }} />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </>
                                            );
                                        default:
                                            return <></>;
                                    }
                                })()}
                            </div>
                        </div>
                    </div>
                </div>
            }
        </>
    )
}
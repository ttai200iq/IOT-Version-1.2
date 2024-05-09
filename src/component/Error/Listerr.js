import React, { useContext, useEffect, useState } from "react";
import "./Error.scss";
import DataTable from "react-data-table-component";
import { deviceid, list, readstate, register } from "./Error";
import axios from "axios";
import { host } from "../constant";
import { useIntl } from "react-intl";
import { AlertContext } from "../Context/AlertContext";
import { isBrowser } from "react-device-detect";
import Register from "./Register";
import { lowercasedata } from "../User/Listuser";

export default function Listerr(props) {
    const dataLang = useIntl();
    const { alertDispatch } = useContext(AlertContext);
    const [filter, setFilter] = useState([]);
    // const avatar = '/avatar/auto.jpg'

    const paginationComponentOptions = {
        rowsPerPageText: 'Số hàng',
        rangeSeparatorText: 'đến',
        selectAllRowsItem: true,
        selectAllRowsItemText: 'tất cả',
    };

    const col = [
        {
            name: "STT",
            selector: (row) => row.id,
            sortable: true,
            width: "80px",
            style: {
                justifyContent: "center",
            }
        },
        {
            name: "Gateway",
            selector: (row) => <div id={row.deviceid} style={{ cursor: "pointer", color: (deviceid.value == row.deviceid) ? "blue" : "black" }} onClick={(e) => handleDevice(e)}>{row.deviceid}</div>,
            sortable: true,
            style: {
                justifyContent: "left",
            }
        },
    ];


    const handleDevice = (e) => {
        deviceid.value = e.currentTarget.id
        register.value = { data: [] }
        axios.post(host.DEVICE + "/getErr", { id: e.currentTarget.id, user: props.username }, { secure: true, reconnect: true })
            .then((res) => {
                // console.log(res.data)
                if (res.data[0] != undefined) {
                    register.value = {
                        data: res.data[0].setting.data
                    }
                } else {
                    alertDispatch({ type: 'LOAD_CONTENT', payload: { content: dataLang.formatMessage({ id: "alert_33" }), show: 'block' } })
                }
            })
    }

    const handleCloseRead = () => {
        readstate.value = !readstate.value
    }

    useEffect(() => {
        const searchTerm = lowercasedata(props.filter);
        if (searchTerm == "") {
            setFilter(list.value)
        } else {
            return setFilter(list.value.filter((data) => data.deviceid.toLowerCase().includes(searchTerm)))
        }
    }, [props.filter, list.value])

    return (
        <>
            {isBrowser
                ?
                <div className="DAT_Listerr">
                    <DataTable
                        className="DAT_Table_Container"
                        columns={col}
                        data={filter}
                        pagination
                        paginationComponentOptions={paginationComponentOptions}
                        fixedHeader={true}
                        noDataComponent={
                            <div style={{ margin: "auto", textAlign: "center", color: "red", padding: "20px" }}>
                                <div>Danh sách trống</div>
                                <div>Thêm thiết bị để trải nghiệm tính năng này!</div>
                            </div>
                        }
                    />
                </div> :
                //MOBILE SECTION
                <>
                    {readstate.value === false ?
                        list.value.map((data, key) => (
                            <div key={key} className="DAT_ViewMobile_Container_Content">
                                <div className="DAT_ViewMobile_Container_Content_Top"
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between"
                                    }}>
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px" }}>
                                        <div className="DAT_ViewMobile_Container_Content_Top_left"
                                            style={{ color: "white" }}
                                        >
                                            {/* <img alt="" src={avatar} ></img> */}
                                            {data.id}
                                        </div>
                                        <div
                                            className="DAT_ViewMobile_Container_Content_Top_right"
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                            }}
                                        >
                                            <div className="DAT_ViewMobile_Container_Content_Top_right_tit"
                                                style={{
                                                    color: (deviceid.value == data.deviceid) ? "blue" : "black"
                                                }}
                                                id={data.deviceid}
                                                onClick={(e) => {
                                                    handleCloseRead();
                                                    // console.log(readstate);
                                                    handleDevice(e);
                                                    // console.log(document.getElementById("errcode"))
                                                }}
                                            >
                                                {data.deviceid}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )) :
                        <>
                            <Register username={props.username} handleCloseRead={handleCloseRead} filter={filter} />
                        </>}
                </>
            }
        </>
    );
}

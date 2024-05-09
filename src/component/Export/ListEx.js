import { useContext, useEffect, useState } from "react";
import { exp, reporttime, devicetime } from "./Export";
import DataTable from "react-data-table-component";
import axios from "axios";
import { host } from "../constant";
import { AlertContext } from "../Context/AlertContext";
import { useIntl } from "react-intl";
import { isBrowser } from "react-device-detect";
import { MdOutlineDelete } from "react-icons/md";
import { signal } from "@preact/signals-react";
import { lowercasedata } from "../User/Listuser";

export const configreport = signal(false);
export default function ListEx(props) {
    const dataLang = useIntl();
    const { alertDispatch } = useContext(AlertContext);
    const [filter, setFilter] = useState([]);

    const paginationComponentOptions = {
        rowsPerPageText: "Số hàng",
        rangeSeparatorText: "đến",
        selectAllRowsItem: true,
        selectAllRowsItemText: "tất cả",
    };

    const col = [
        {
            name: "STT",
            selector: (row) => row.id,
            sortable: true,
            width: "80px",
            center: true,
        },
        {
            name: "Gateway",
            selector: (row) => (
                <div
                    id={row.deviceid}
                    style={{
                        cursor: "pointer",
                        color: devicetime.value == row.deviceid ? "blue" : "black",
                    }}
                    onClick={(e) => handleDevice(e)}
                >
                    {row.deviceid}
                </div>
            ),
            style: {
                justifyContent: "left",
            },
        },
    ];

    const handleDevice = (e) => {
        devicetime.value = e.currentTarget.id;
        reporttime.value = [];
        axios
            .post(
                host.DEVICE + "/getReportTime",
                { id: e.currentTarget.id },
                { secure: true, reconnect: true }
            )
            .then((res) => {
                // console.log(res.data);
                if (res.data[0] != undefined) {
                    reporttime.value = res.data;
                    reporttime.value.map((data, i) => {
                        data.id = i + 1;
                    });
                } else {
                    alertDispatch({
                        type: "LOAD_CONTENT",
                        payload: {
                            content: dataLang.formatMessage({ id: "alert_33" }),
                            show: "block",
                        },
                    });
                }
            });
    };

    useEffect(() => {
        // console.log(props.username);
        exp.value = [];
        axios
            .post(
                host.DEVICE + "/getErrbyUser",
                { user: props.username, type: "Project" },
                { secure: true, reconnect: true }
            )
            .then((res) => {
                // console.log(res.data);
                var listp = res.data;

                axios
                    .post(
                        host.DEVICE + "/getErrbyUser",
                        { user: props.username, type: "None" },
                        { secure: true, reconnect: true }
                    )
                    .then((res) => {
                        // console.log(res.data);

                        exp.value = [...listp, ...res.data];
                        exp.value = exp.value.map((data, index) => ({
                            ...data,
                            id: index + 1,
                        }));

                        // if(res.data[0] !== undefined){
                        //     i_.value = res.data[0].id
                        //     register.value = res.data[0].setting
                        // }
                        // console.log(exp.value)
                        setFilter(exp.value);
                    });
            });
    }, []);

    const handleFilter = (e) => {
        const searchTerm = e.currentTarget.value.toLowerCase();
        if (searchTerm == "") {
            setFilter(exp.value)
        } else {
            const df = exp.value.filter((item) => {
                return (item.deviceid.toLowerCase().includes(searchTerm));
            })
            setFilter(df)
        }
    }

    useEffect(() => {
        const searchTerm = lowercasedata(props.filter);
        if (searchTerm == "") {
            setFilter(exp.value)
        } else {
            const df = exp.value.filter((item) => {
                return (item.deviceid.toLowerCase().includes(searchTerm))
            })
            setFilter(df)
        }
    }, [props.filter])

    return (
        <>
            {isBrowser ? (
                <DataTable
                    className="DAT_Table_Container"
                    columns={col}
                    data={filter}
                    pagination
                    paginationComponentOptions={paginationComponentOptions}
                    noDataComponent={
                        <div
                            style={{
                                margin: "auto",
                                textAlign: "center",
                                color: "red",
                                padding: "20px",
                            }}
                        >
                            <div>Danh sách trống</div>
                            <div>Thêm thiết bị để trải nghiệm tính năng này!</div>
                        </div>
                    }
                />
            ) : (
                // MOBILE SECTION
                <>
                    <div className="DAT_ListExportM">
                        <div className="DAT_FilterbarExport">
                            <input
                                id="search"
                                type="text"
                                placeholder="Tìm kiếm"
                                style={{ minWidth: "100%" }}
                                onChange={(e) => handleFilter(e)}
                            />
                        </div>
                        {filter.map((data, i) => {
                            return (
                                <div key={i} className="DAT_ListExportM_Container">
                                    <div className="DAT_ListExportM_Container_List">
                                        <div className="DAT_ListExportM_Container_List_Left">
                                            <div
                                                className="DAT_ListExportM_Container_List_Left_Item"
                                                id={data.id}
                                            >
                                                {data.id}
                                            </div>
                                        </div>

                                        <div className="DAT_ListExportM_Container_List_Right">
                                            <div className="DAT_ListExportM_Container_List_Right_Info">
                                                <div
                                                    className="DAT_ListExportM_Container_List_Right_Info_Name"
                                                    id={data.deviceid}
                                                    onClick={(e) => { handleDevice(e); configreport.value = !configreport.value; }}
                                                    style={{
                                                        cursor: "pointer",
                                                        color:
                                                            devicetime.value == data.deviceid
                                                                ? "rgb(0, 0, 255, 0.8)"
                                                                : "black",
                                                    }}
                                                >
                                                    {data.deviceid}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="DAT_ListExportM_Container_Bottom">
                                        <div className="DAT_ListExportM_Container_Bottom_Time">
                                            Lần cập nhật cuối: ...
                                        </div>
                                        <div className="DAT_ProjDetail_Container_Bottom_Del">
                                            <MdOutlineDelete
                                                size={20}
                                                color="red"
                                                id={data.name + "_" + data.mail}
                                            />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </>
            )}
        </>
    );
}

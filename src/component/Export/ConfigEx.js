import DataTable from "react-data-table-component";
import { devicetime, reporttime } from "./Export";
import { useContext, useEffect, useRef, useState } from "react";
import { IoClose } from "react-icons/io5";
import axios from "axios";
import { host } from "../constant";
import { CiEdit } from "react-icons/ci";
import { isBrowser } from "react-device-detect";
import ListEx, { configreport } from "./ListEx";
import "./Export.scss";
import { MdOutlineWifiTetheringErrorRounded } from "react-icons/md";
import { AlertContext } from "../Context/AlertContext";
import { action } from "../Control/Action";
import { useIntl } from "react-intl";
import { IoIosArrowBack } from "react-icons/io";
import { lowercasedata } from "../User/Listuser";

export default function ConfigEx(props) {
    const { alertDispatch } = useContext(AlertContext);
    const [report, setReport] = useState("");
    const [mcode, setMcode] = useState("0");
    const [config, setConfig] = useState({});
    const [state, setState] = useState(false);
    const [config_, setConfig_] = useState("");
    const dataLang = useIntl();

    const id = useRef();
    const name = useRef();
    const cal = useRef();
    const cal_bit_0 = useRef();
    const cal_bit_1 = useRef();

    const [nav, setNav] = useState("list");

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
            name: "Mã báo cáo",
            selector: (row) => row.code,
            center: true,
            width: "100px",
        },
        {
            name: "Tên",
            selector: (row) => row.name,
            minWidth: "200px",
        },

        {
            name: "Thanh ghi (Ngày)",
            selector: (row) => (
                <>
                    <div
                        style={{
                            // cursor: "pointer",
                            marginBottom: "10px",
                            marginTop: "10px",
                        }}
                    >
                        {row.register.map((item, index) => {
                            return (
                                <div className="DAT_ConfigExRegister" key={index}>
                                    <span>{item.id}</span>
                                    <span>{item.name}</span>
                                    {item.type === "word" ? (
                                        <span>{item.cal}</span>
                                    ) : (
                                        <>
                                            <span>{JSON.parse(item.cal)[0]} : {JSON.parse(item.cal)[1]}</span>
                                        </>
                                    )}
                                    <span>{item.type}</span>
                                    <span
                                        id={`${row.code}_${item.id}_Daily`}
                                        style={{ cursor: "pointer" }}
                                        onClick={(e) => handleConfig(e)}
                                    >
                                        <CiEdit />
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </>
            ),
            minWidth: "400px",
        },
        {
            name: "Thanh ghi (Tháng)",
            selector: (row) => (
                <>
                    <div
                        style={{
                            // cursor: "pointer",
                            marginBottom: "10px",
                            marginTop: "10px",
                        }}
                    >
                        {row.registermonth.map((item, index) => {
                            return (
                                <div className="DAT_ConfigExRegister" key={index}>
                                    <span>{item.id}</span>
                                    <span>{item.name}</span>
                                    {item.type === "word" ? (
                                        <span>{item.cal}</span>
                                    ) : (
                                        <>
                                            <span>{JSON.parse(item.cal)[0]}: {JSON.parse(item.cal)[1]}</span>
                                        </>
                                    )}
                                    <span>{item.type}</span>

                                    <span
                                        id={`${row.code}_${item.id}_Month`}
                                        style={{ cursor: "pointer" }}
                                        onClick={(e) => handleConfig(e)}
                                    >
                                        <CiEdit />
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </>
            ),
            minWidth: "400px",
        },
    ];

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

    const handleConfig = (e) => {
        // console.log(e.currentTarget.id);
        var arr = e.currentTarget.id.split("_");
        // console.log(arr);
        let newData = reporttime.value.find((item) => {
            return item.code == arr[0];
        });
        setReport(arr[2]);
        setMcode(arr[0]);
        if (arr[2] == "Daily") {
            newData = newData.register.find((item) => {
                return item.id == arr[1];
            });
            setConfig(newData);
        } else {
            newData = newData.registermonth.find((item) => {
                return item.id == arr[1];
            });
            setConfig(newData);
        }
        setState(!state);
        // console.log(newData);
    };

    const handleSave = (e) => {
        let register = {
            id: config.id,
            name: name.current.value,
            type: config.type,
            cal:
                config.type === "real"
                    ? `["${cal_bit_0.current.value}", "${cal_bit_1.current.value}"]`
                    : cal.current.value,
        };

        axios
            .post(
                host.DEVICE + "/updateReport",
                {
                    deviceid: devicetime.value,
                    code: mcode,
                    report: report,
                    register: register,
                },
                { secure: true, reconnect: true }
            )
            .then((res) => {
                // console.log(res.data);
                if (res.data.status) {
                    let i = reporttime.value.findIndex((item) => {
                        return item.code == mcode;
                    });
                    if (report == "Daily") {
                        let j = reporttime.value[i].register.findIndex((item) => {
                            return item.id == config.id;
                        });
                        reporttime.value[i].register[j] = register;
                    } else {
                        let j = reporttime.value[i].registermonth.findIndex((item) => {
                            return item.id == config.id;
                        });
                        reporttime.value[i].registermonth[j] = register;
                    }
                }
                if (res.data.status) {
                    alertDispatch(
                        action("LOAD_CONTENT", {
                            content: dataLang.formatMessage({ id: "alert_53" }),
                            show: "block",
                        })
                    );
                } else {
                    alertDispatch(
                        action("LOAD_CONTENT", {
                            content: dataLang.formatMessage({ id: "alert_54" }),
                            show: "block",
                        })
                    );
                }
                setState(!state);
            });
    };

    const handleNav = (e) => {
        var id = e.currentTarget.id;

        // console.log(id);
        setNav(id);
    };

    useEffect(() => {
        const searchTerm = lowercasedata(props.config);
        if (searchTerm == "") {
            setConfig_(reporttime.value);
        } else {
            const df = reporttime.value.filter((item) => {
                const filterName = lowercasedata(item.name).includes(searchTerm) ||
                    item.register.some(
                        (reg) => {
                            return (
                                lowercasedata(reg.cal).includes(searchTerm)) ||
                                lowercasedata(reg.id).includes(searchTerm) ||
                                lowercasedata(reg.name).includes(searchTerm)
                        }) ||
                    item.registermonth.some(
                        (reg) => {
                            return (
                                lowercasedata(reg.cal).includes(searchTerm)) ||
                                lowercasedata(reg.id).includes(searchTerm) ||
                                lowercasedata(reg.name).includes(searchTerm)
                        })
                    ;
                const filterCode = lowercasedata(item.code).includes(searchTerm)
                return (filterName || filterCode);
            });
            setConfig_(df);
        }


    }, [props.config])

    return (
        <>
            {isBrowser ? (
                <>
                    <DataTable
                        className="DAT_Table_Container"
                        columns={col}
                        data={config_}
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

                    {state ? (
                        <div className="DAT_PopupBG">
                            <div className="DAT_Config-Content">
                                <div className="DAT_Config-Content_Head">
                                    <div className="DAT_Config-Content_Head_Left">{mcode} {report}</div>
                                    <div className="DAT_Config-Content_Head_Right">
                                        <div className="DAT_Config-Content_Head_Right_Close"
                                            id="Popup"
                                            onMouseEnter={(e) => handlePopup("new")}
                                            onMouseLeave={(e) => handlePopup("pre")}
                                            onClick={() => setState(!state)}
                                        >
                                            <IoClose size={25} color="white" />
                                        </div>
                                    </div>
                                </div>

                                <div className="DAT_Config-Content_Body">
                                    <span>ID</span>
                                    <input type="text" defaultValue={config.id} ref={id} />
                                    <span>Tên</span>
                                    <input type="text" defaultValue={config.name} ref={name} />

                                    <div>
                                        <span>Loại: {config.type}</span>
                                    </div>
                                    {config.type === "word" ? (
                                        <>
                                            <span>Thanh ghi</span>
                                            <input type="text" defaultValue={config.cal} ref={cal} />
                                        </>
                                    ) : (
                                        <>
                                            <span>Thanh ghi Bit 0</span>
                                            <input
                                                type="text"
                                                defaultValue={JSON.parse(config.cal)[0]}
                                                ref={cal_bit_0}
                                            />
                                            <span>Thanh ghi Bit 1</span>
                                            <input
                                                type="text"
                                                defaultValue={JSON.parse(config.cal)[1]}
                                                ref={cal_bit_1}
                                            />
                                        </>
                                    )}
                                </div>

                                <div className="DAT_Config-Content_Foot">
                                    <button onClick={() => handleSave()}>
                                        Xác nhận
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <></>
                    )}
                </>
            ) : (
                //MOBILE
                <>
                    <div className="DAT_Export_Content_Main_List">
                        <div
                            className="DAT_Export_Content_Main_List_Head"
                            onClick={() => configreport.value = !configreport.value}
                        >
                            <IoIosArrowBack />
                            Báo cáo
                        </div>

                        {reporttime.value.length == 0 ? (
                            <div className="DAT_Export_Content_Main_List_Null">
                                <div className="DAT_Export_Content_Main_List_Null_Content">
                                    <div>Danh sách trống</div>
                                    <div>Thêm thiết bị để trải nghiệm tính năng này!</div>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="DAT_ConfigMobile>">
                                    <div className="DAT_ConfigMobile_Container">
                                        {reporttime.value.map((item, index) => {
                                            return (
                                                <div
                                                    className="DAT_ConfigMobile_Container_List"
                                                    key={index}
                                                >
                                                    <div className="DAT_ConfigMobile_Container_List_Left">
                                                        <div className="DAT_ConfigMobile_Container_List_Left_Item">
                                                            {item.id}. &nbsp;
                                                            {item.code}
                                                        </div>
                                                    </div>

                                                    {/* Daily */}
                                                    <div className="DAT_ConfigMobile_Container_List_Right">
                                                        <div className="DAT_ConfigMobile_Container_List_Right_Container">
                                                            <div className="DAT_ConfigMobile_Container_List_Right_Header">
                                                                <span>Thanh ghi ( ngày ) :</span>
                                                            </div>

                                                            {item.register.map((day, i) => {
                                                                // console.log(item.code)
                                                                return (
                                                                    <div
                                                                        className="DAT_ConfigMobile_Container_List_Right_Item1"
                                                                        key={i}
                                                                        onClick={(e) => handleConfig(e)}
                                                                        id={`${item.code}_${day.id}_${day.type}`}
                                                                    >
                                                                        {day.name}
                                                                        <span
                                                                            id={`${item.code}_${day.id}_Daily`}
                                                                            style={{ cursor: "pointer" }}
                                                                            onClick={(e) => handleConfig(e)}
                                                                        >
                                                                            <CiEdit size={18} />
                                                                        </span>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>

                                                        {/* Monthly */}
                                                        <div className="DAT_ConfigMobile_Container_List_Right_Container">
                                                            <div className="DAT_ConfigMobile_Container_List_Right_Header">
                                                                Thanh ghi ( tháng ) :
                                                            </div>
                                                            {item.registermonth.map((month, i) => {
                                                                return (
                                                                    <div
                                                                        className="DAT_ConfigMobile_Container_List_Right_Item2"
                                                                        key={i}
                                                                        onClick={(e) => handleConfig(e)}
                                                                        id={`${item.code}_${month.id}_${month.type}`}
                                                                    >
                                                                        {month.name}
                                                                        <span
                                                                            id={`${item.code}_${month.id}_Month`}
                                                                            style={{ cursor: "pointer" }}
                                                                            onClick={(e) => handleConfig(e)}
                                                                        >
                                                                            <CiEdit size={18} />
                                                                        </span>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                    {state ? (
                        <div className="DAT_ConfigMobilePopup">
                            <div className="DAT_ConfigMobilePopup_Form">
                                <div className="DAT_ConfigMobilePopup_Form_Head">
                                    <div className="DAT_ConfigMobilePopup_Form_Head_Left">
                                        <span> Thông tin cấu hình </span>
                                    </div>
                                    <div className="DAT_ConfigMobilePopup_Form_Head_Right">
                                        <div className="DAT_ConfigMobilePopup_Form_Head_Right_Close">
                                            <span
                                                style={{
                                                    width: "30px",
                                                    height: "30px",
                                                    borderRadius: "50%",
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    backgroundColor: "red",
                                                }}
                                                onClick={() => setState(!state)}
                                            >
                                                <IoClose size={20} color="white" />
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div
                                    className="DAT_ConfigMobilePopup_Form_Row"
                                    style={{ borderRadius: "5px 5px 0 0" }}
                                >
                                    <div className="DAT_ConfigMobilePopup_Form_Row_Item">
                                        <div className="DAT_ConfigMobilePopup_Form_Row_Item_Label">
                                            ID
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="ID"
                                            defaultValue={config.id}
                                            ref={id}
                                            required
                                        />
                                    </div>

                                    <div className="DAT_ConfigMobilePopup_Form_Row_Item">
                                        <div className="DAT_ConfigMobilePopup_Form_Row_Item_Label">
                                            Tên
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Nhập tên"
                                            defaultValue={config.name}
                                            ref={name}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="DAT_ConfigMobilePopup_Form_Row">
                                    <div className="DAT_ConfigMobilePopup_Form_Row_Item">
                                        <div className="DAT_ConfigMobilePopup_Form_Row_Item_Label">
                                            {" "}
                                            Loại:
                                        </div>
                                        <input
                                            disabled
                                            placeholder={config.type}
                                            style={{
                                                textTransform: "capitalize",
                                                marginBottom: "25px",
                                            }}
                                        />
                                        {config.type === "word" ? (
                                            <>
                                                <span>Thanh ghi</span>
                                                <input
                                                    type="text"
                                                    defaultValue={config.cal}
                                                    ref={cal}
                                                />
                                            </>
                                        ) : (
                                            <>
                                                <div className="DAT_ConfigMobilePopup_Form_Row_Item_Label">
                                                    Thanh ghi Bit 0
                                                </div>
                                                <input
                                                    type="text"
                                                    defaultValue={JSON.parse(config.cal)[0]}
                                                    ref={cal_bit_0}
                                                />
                                                <div className="DAT_ConfigMobilePopup_Form_Row_Item_Label">
                                                    Thanh ghi Bit 1
                                                </div>
                                                <input
                                                    type="text"
                                                    defaultValue={JSON.parse(config.cal)[1]}
                                                    ref={cal_bit_1}
                                                />
                                            </>
                                        )}
                                    </div>
                                </div>
                                <div
                                    className="DAT_ConfigMobilePopup_Form_Row"
                                    style={{ borderRadius: "0 0 5px 5px" }}
                                >
                                    <button
                                        className="DAT_ConfigMobilePopup_Form_Row_Button"
                                        onClick={() => handleSave()}
                                    >
                                        <ion-icon name="save-outline"></ion-icon> Lưu
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <></>
                    )}
                </>
            )}
        </>
    );
}

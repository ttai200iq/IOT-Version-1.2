import React, { useContext, useEffect, useState } from "react";
import "./Error.scss";
import DataTable from "react-data-table-component";
import { deviceid, register } from "./Error";
import axios from "axios";
import { host } from "../constant";
import { useIntl } from "react-intl";
import { AlertContext } from "../Context/AlertContext";
import { isBrowser } from "react-device-detect";
import { IoIosArrowBack } from "react-icons/io";
import { IoClose, IoSaveOutline } from "react-icons/io5";

export default function Register(props) {
    const dataLang = useIntl();
    const { alertDispatch } = useContext(AlertContext);
    const [config, setConfig] = useState(false);
    const [tit, setTit] = useState("");
    const [filter, setFilter] = useState([]);

    const [positon, setPosition] = useState({ col: "", row: 0 });

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
            name: "Địa Chỉ Mã Lỗi",
            selector: (row) => (
                <>
                    <div
                    // id={"addrcode_" + row.id}
                    // onClick={(e) => handleChange(e)}
                    // style={{ cursor: "pointer" }}
                    >
                        {row.addrcode}
                    </div>
                </>
            ),
            center: true,
        },
        {
            name: "Cấu hình",
            selector: (row) => (
                <>
                    <div
                        style={{
                            // cursor: "pointer",
                            marginBottom: "10px",
                            marginTop: "10px",
                        }}
                    >
                        {row.register.map((data, i) => {
                            return i === row.register.length - 1 ? (
                                <div
                                    key={i}
                                    style={{
                                        // cursor: "pointer",
                                        display: "flex",
                                        alignItems: "center",
                                    }}
                                >
                                    <div
                                        style={{
                                            width: "100px",
                                        }}
                                        id={"register" + "_" + row.id + "_" + parseInt(i + 1)}
                                    >
                                        {data.addr} : {data.val}
                                    </div>
                                    <span
                                        id={"edit_" + row.id + "_" + parseInt(i + 1)}
                                        onClick={(e) => handleEditItem(e)}
                                        style={{
                                            cursor: "pointer",
                                            color: "green",
                                            marginRight: "10px",
                                        }}
                                    >
                                        <ion-icon name="create-outline"></ion-icon>
                                    </span>
                                    <span
                                        id={"delete_" + row.id + "_" + parseInt(i + 1)}
                                        onClick={(e) => handleDeleteItem(e)}
                                        style={{ cursor: "pointer", color: "red", marginRight: "10px" }}
                                    >
                                        <ion-icon name="trash-outline"></ion-icon>
                                    </span>
                                    <span
                                        id={"add_" + row.id}
                                        onClick={(e) => handleAddItem(e)}
                                        style={{ cursor: "pointer", color: "red" }}
                                    >
                                        <ion-icon name="add-circle-outline"></ion-icon>
                                    </span>
                                </div>
                            ) : (
                                <div
                                    key={i}
                                    style={{
                                        // cursor: "pointer",
                                        display: "flex",
                                        alignItems: "center",
                                    }}
                                >
                                    <div
                                        style={{ width: "100px" }}
                                        id={"register" + "_" + row.id + "_" + parseInt(i + 1)}
                                    >
                                        {data.addr} : {data.val}
                                    </div>
                                    <span
                                        id={"edit_" + row.id + "_" + parseInt(i + 1)}
                                        onClick={(e) => handleEditItem(e)}
                                        style={{ cursor: "pointer", color: "green", marginRight: "10px" }}
                                    >
                                        <ion-icon name="create-outline"></ion-icon>
                                    </span>
                                    <span
                                        id={"delete_" + row.id + "_" + parseInt(i + 1)}
                                        onClick={(e) => handleDeleteItem(e)}
                                        style={{ cursor: "pointer", color: "red", marginRight: "10px" }}
                                    >
                                        <ion-icon name="trash-outline"></ion-icon>
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </>
            ),
            center: true,
        },
        {
            name: "",
            selector: (row) => (
                <>
                    <div
                        id={row.id}
                        onClick={(e) => handleDelete(e)}
                        style={{ cursor: "pointer", color: "red" }}
                    >
                        Xóa
                    </div>
                </>
            ),
            width: "100px",
            center: true,
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

    // const handleChange = (e) => {
    //     setConfig(true);
    //     const arr = e.currentTarget.id.split("_");
    //     setPosition({ col: arr[0], row: parseInt(arr[1]) });
    //     setTit("Địa chỉ mã lỗi");
    //     var d = register.value.data.filter((data) => data.id == arr[1]);
    //     document.getElementById("configvalue").value = d[0][arr[0]]

    // };

    const handleSave = (e) => {
        e.preventDefault();

        var cf = document.getElementById("configvalue");
        //console.log(positon, cf.value)

        switch (positon.col) {
            case "addrcode":
                register.value = {
                    ...register.value,
                    data: register.value.data.map((obj) => {
                        if (obj.id === positon.row) {
                            return { ...obj, [positon.col]: cf.value };
                        }
                        return obj;
                    }),
                };
                break;
            case "data":
                var newData = register.value;
                const i = newData.data.findIndex((data) => data.id == positon.row);
                const r = newData.data[i].register.findIndex(
                    (data) => data.id == positon.item
                );

                newData.data[i].register[r].addr = cf.value.split(":")[0];
                newData.data[i].register[r].val = cf.value.split(":")[1];

                //console.log(newData)
                register.value = {
                    ...newData,
                };
                break;
            default:
                break;
        }

        setConfig(false);
    };

    const handleDelete = (e) => {
        register.value = {
            ...register.value,
            data: register.value.data
                .filter((newData) => newData.id != e.currentTarget.id)
                .map((data, index) => ({ ...data, id: index + 1 })),
        };
    };

    const handleAddItem = (e) => {
        //console.log(e.currentTarget.id)
        const arr = e.currentTarget.id.split("_");
        const newData = register.value;
        const i = newData.data.findIndex((data) => data.id == arr[1]);
        newData.data[i].register = [
            ...newData.data[i].register,
            {
                id: parseInt(newData.data[i].register.length) + 1,
                addr:
                    parseInt(newData.data[i].register.length + 1) +
                    "-" +
                    newData.data[i].id,
                val: "1",
            },
        ];
        // console.log(newData.data[i].register);
        register.value = {
            ...newData,
        };
    };

    const handleEditItem = (e) => {
        //console.log(e.currentTarget.id)
        const arr = e.currentTarget.id.split("_");
        const i = register.value.data.findIndex((data) => data.id == arr[1]);
        const r = register.value.data[i].register.find((data) => data.id == arr[2]);
        setConfig(true);
        document.getElementById("configvalue").value = r.addr + ":" + r.val;
        setPosition({ col: "data", row: arr[1], item: arr[2] });
        setTit("Cấu hình");
    };

    const handleDeleteItem = (e) => {
        // console.log(e.currentTarget.id);
        const arr = e.currentTarget.id.split("_");
        const newData = register.value;
        const i = newData.data.findIndex((data) => data.id == arr[1]);

        // console.log(newData.data[i].register);
        if (newData.data[i].register.length > 1) {
            newData.data[i].register = newData.data[i].register
                .filter((data) => data.id != arr[2])
                .map((data, index) => {
                    return { ...data, id: index + 1 };
                });

            register.value = {
                ...newData,
            };
        }
    };

    const handleClose = (e) => {
        setConfig(false);
    };

    const handleUpdate = (e) => {
        // console.log(register.value);
        axios
            .post(
                host.DEVICE + "/updateErr",
                {
                    user: props.username,
                    deviceid: deviceid.value,
                    setting: JSON.stringify(register.value),
                },
                { secure: true, reconnect: true }
            )
            .then((res) => {
                //console.log(res.data)
                if (res.data.status) {
                    alertDispatch({
                        type: "LOAD_CONTENT",
                        payload: {
                            content: dataLang.formatMessage({ id: "alert_5" }),
                            show: "block",
                        },
                    });
                } else {
                    alertDispatch({
                        type: "LOAD_CONTENT",
                        payload: {
                            content: dataLang.formatMessage({ id: "alert_3" }),
                            show: "block",
                        },
                    });
                }
            });
    };

    const handleAddRegister = (e) => {
        e.preventDefault();
        var err = document.getElementById("errcode");
        register.value = {
            ...register.value,
            data: [
                ...register.value.data,
                {
                    id: parseInt(register.value.data.length) + 1,
                    addrcode: err.value,
                    register: [
                        {
                            id: 1,
                            addr: "1-" + parseInt(register.value.data.length + 1),
                            val: 1,
                        },
                    ],
                },
            ],
        };
    };

    useEffect(() => {
        const searchTerm = props.filter;
        if (searchTerm == "") {
            setFilter(register.value.data);
        } else {
            const df = register.value.data.filter((item) => {
                return (item.addrcode).includes(searchTerm);
            })
            setFilter(df);
        }
        //eslint-disable-next-line
    }, [props.filter, register.value.data])

    // Handle close when press ESC
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                handleClose();
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
            {isBrowser ? (
                <>
                    <div className="DAT_Register">
                        <DataTable
                            className="DAT_Table_Container"
                            columns={col}
                            data={filter}
                            pagination
                            paginationComponentOptions={paginationComponentOptions}
                            fixedHeader={true}
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
                    </div>
                </>
            ) : (
                <>
                    <div className="DAT_ViewMobile_Container_Add">
                        <form
                            className="DAT_ViewMobile_Container_Add_Form"
                            onSubmit={(e) => handleAddRegister(e)}
                        >
                            <input placeholder="Nhập địa chỉ mới"
                                id="errcode" required></input>
                            <button>
                                <ion-icon name="add-outline"></ion-icon>
                            </button>
                        </form>
                        <button
                            className="DAT_ViewMobile_Container_Add-Save"
                            onClick={(e) => handleUpdate(e)}
                        >
                            <IoSaveOutline size={20} />
                        </button>
                    </div>
                    <div className="DAT_Read">
                        <div
                            className="DAT_Read_Head"
                            onClick={() => props.handleCloseRead()}
                        >
                            <IoIosArrowBack />
                            Thanh ghi
                        </div>

                        <div className="DAT_Read_Body">
                            {register.value.data.map((row, index) => {
                                return (
                                    <div key={index} className="DAT_ViewMobile_Container_Content">
                                        <div
                                            className="DAT_ViewMobile_Container_Content_Top"
                                            style={{
                                                display: "flex",
                                                // alignItems: "center",
                                                // justifyContent: "space-between"
                                            }}
                                        >
                                            <div className="DAT_ViewMobile_Container_Content_Top_left">
                                                {row.addrcode}
                                            </div>
                                            <div
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "space-between",
                                                    gap: "10px",
                                                }}
                                            >
                                                <div className="DAT_ViewMobile_Container_Content_Top_right">
                                                    <div className="DAT_ViewMobile_Container_Content_Top_right_content">
                                                        <div className="DAT_ViewMobile_Container_Content_Top_right_content_title">
                                                            {/* Tên mã lỗi : */}
                                                            {/* {row.name} */}
                                                        </div>

                                                        {/* Nguyen nhan */}
                                                        <div className="DAT_ViewMobile_Container_Content_Top_right_content_inforTitle">
                                                            Cấu hình :
                                                        </div>
                                                        {row.register.map((infor, i) =>
                                                            i === row.register.length - 1 ? (
                                                                <div
                                                                    key={i}
                                                                    className="DAT_ViewMobile_Container_Content_Top_right_content_infor"
                                                                >
                                                                    <span>{`${infor.addr}: ${infor.val}`}</span>
                                                                    <div className="DAT_ViewMobile_Container_Content_Top_right_content_infor_function">
                                                                        <span
                                                                            id={
                                                                                "edit_" + row.id + "_" + parseInt(i + 1)
                                                                            }
                                                                            onClick={(e) => handleEditItem(e)}
                                                                            style={{
                                                                                color: "green",
                                                                                marginRight: "10px",
                                                                            }}
                                                                        >
                                                                            <ion-icon name="create-outline"></ion-icon>
                                                                        </span>
                                                                        <span
                                                                            id={
                                                                                "delete_" +
                                                                                row.id +
                                                                                "_" +
                                                                                parseInt(i + 1)
                                                                            }
                                                                            onClick={(e) => handleDeleteItem(e)}
                                                                            style={{
                                                                                color: "red",
                                                                                marginRight: "10px",
                                                                            }}
                                                                        >
                                                                            <ion-icon name="trash-outline"></ion-icon>
                                                                        </span>
                                                                        <span
                                                                            id={"add_" + row.id}
                                                                            onClick={(e) => handleAddItem(e)}
                                                                            style={{ color: "red" }}
                                                                        >
                                                                            <ion-icon name="add-circle-outline"></ion-icon>
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <div
                                                                    key={i}
                                                                    className="DAT_ViewMobile_Container_Content_Top_right_content_infor"
                                                                >
                                                                    <span>{`${infor.addr}: ${infor.val}`}</span>
                                                                    <div className="DAT_ViewMobile_Container_Content_Top_right_content_infor_function">
                                                                        <span
                                                                            id={
                                                                                "edit_" + row.id + "_" + parseInt(i + 1)
                                                                            }
                                                                            onClick={(e) => handleEditItem(e)}
                                                                            style={{
                                                                                color: "green",
                                                                                marginRight: "10px",
                                                                            }}
                                                                        >
                                                                            <ion-icon name="create-outline"></ion-icon>
                                                                        </span>
                                                                        <span
                                                                            id={
                                                                                "delete_" +
                                                                                row.id +
                                                                                "_" +
                                                                                parseInt(i + 1)
                                                                            }
                                                                            onClick={(e) => handleDeleteItem(e)}
                                                                            style={{
                                                                                color: "red",
                                                                                marginRight: "10px",
                                                                            }}
                                                                        >
                                                                            <ion-icon name="trash-outline"></ion-icon>
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            )
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </>
            )}

            <div className="DAT_PopupBG"
                style={{ display: config ? "block" : "none" }}
            >
                <form className="DAT_Register_Config-Group" onSubmit={(e) => handleSave(e)}>
                    <div className="DAT_Register_Config-Group_Head">
                        <div className="DAT_Register_Config-Group_Head_Left">Thay đổi</div>
                        <div className="DAT_Register_Config-Group_Head_Right">
                            <div className="DAT_Register_Config-Group_Head_Right_Close"
                                id="Popup"
                                onMouseEnter={(e) => handlePopup("new")}
                                onMouseLeave={(e) => handlePopup("pre")}
                                onClick={(e) => handleClose(e)}
                            >
                                <IoClose size={25} color="white" />
                            </div>
                        </div>
                    </div>

                    <div className="DAT_Register_Config-Group_Body">
                        <span>{tit}</span>
                        <input type="text" id="configvalue" required />
                    </div>

                    <div className="DAT_Register_Config-Group_Foot">
                        <button>
                            Xác nhận
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}

import React, { useContext, useEffect, useRef, useState } from "react";
import "./Storage.scss";

import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { host } from "../constant";
import { useIntl } from "react-intl";
import { AlertContext } from "../Context/AlertContext";
import DataTable from "react-data-table-component";
import { isBrowser } from "react-device-detect";
import { MdOutlineDashboard, MdOutlineDelete } from "react-icons/md";
import { lowercasedata } from "../User/Listuser";
import { IoClose } from "react-icons/io5";
import { CiSearch } from "react-icons/ci";
import { IoMdAdd } from "react-icons/io";
import Raisebox, { delstate } from "../Raisebox/RaiseboxConfirmDel";

export default function Storage(props) {
    const banner = "linear-gradient(140deg, #0061f2, #6900c7)";
    const inf = { code: 'Device', tit: 'Kho giao diện' };
    const [direct, SetDirect] = useState([{ id: 'home', text: 'Trang chủ' }, { id: 'list', text: inf.tit }]);
    const manager = useSelector((state) => state.admin.manager);
    const [data, setData] = useState([]);
    const dataLang = useIntl();
    const { alertDispatch } = useContext(AlertContext);
    const [fix, setFix] = useState(false);
    const [filter, setFilter] = useState([]);
    const [dataDel, setDataDel] = useState();

    const name = useRef();
    const id = useRef();

    const paginationComponentOptions = {
        rowsPerPageText: 'Số hàng',
        rangeSeparatorText: 'đến',
        selectAllRowsItem: true,
        selectAllRowsItemText: 'tất cả',
    };

    const head = [
        {
            name: "STT",
            selector: (row) => row.ids,
            sortable: true,
            width: "75px",
            center: true,
        },
        {
            name: "Tên giao diện",
            selector: (row) => <div id={row.id} onClick={(e) => handleFix(e)} style={{ cursor: "pointer" }}>{row.name} </div>,
            style: {
                justifyContent: "left",
            }
        },
        {
            name: "",
            selector: (row) => {
                return (
                    <div
                        style={{ cursor: "pointer", color: "red" }}
                        id={row.name + "_" + row.mail}
                        onClick={(e) => {
                            delstate.value = true;
                            setdata(row.id)
                        }}
                    >
                        <MdOutlineDelete size={20} color="red" />
                    </div>
                )
            },
            width: "70px",
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

    const setdata = (id) => {
        setDataDel(`${id}`)
    };

    const handleDelete = (e) => {
        // console.log(dataDel);
        var newData = data;
        newData = newData.filter(data => data.id != dataDel);
        setData(newData);
        setFilter(newData);
        axios.post(host.DEVICE + "/removeStore", { id: dataDel, user: manager }, { withCredentials: true }).then(
            function (res) {
                // console.log(res.data)
                if (res.data.status) {
                    alertDispatch({ type: 'LOAD_CONTENT', payload: { content: dataLang.formatMessage({ id: "alert_27" }), show: 'block' } })
                } else {
                    alertDispatch({ type: 'LOAD_CONTENT', payload: { content: dataLang.formatMessage({ id: "alert_3" }), show: 'block' } })
                }
            })
    };

    const handleFix = (e) => {
        var newdata = data.find(item => item.id == e.target.id);
        //console.log(newdata)
        name.current = newdata.name
        id.current = newdata.id
        setFix(true)
    };

    const handleSaveFix = (e) => {
        e.preventDefault()
        var newdata = [...data]
        // console.log(name.current.value, id.current)
        newdata = newdata.map(item => {
            if (item.id == id.current) {
                return { ...item, ...{ name: name.current.value } };
            }
            return item;
        });
        setData(newdata)

        axios.post(host.DEVICE + "/updateStore", { name: name.current.value, id: id.current, user: manager }, { withCredentials: true }).then(
            function (res) {
                // console.log(res.data)
                if (res.data.status) {
                    alertDispatch({ type: 'LOAD_CONTENT', payload: { content: dataLang.formatMessage({ id: "alert_5" }), show: 'block' } })
                } else {
                    alertDispatch({ type: 'LOAD_CONTENT', payload: { content: dataLang.formatMessage({ id: "alert_3" }), show: 'block' } })
                }
            })
        setFix(false);
    };

    const handleFilter = (e) => {
        const searchTerm = e.currentTarget.value.toLowerCase();
        if (searchTerm == "") {
            setFilter(data)
        } else {
            const df = data.filter((item) => {
                return (lowercasedata(item.name).includes(searchTerm));
            })
            setFilter(df)
        }
    };

    useEffect(() => {
        axios.post(host.DEVICE + "/getStore", { user: manager }, { withCredentials: true }).then(
            function (res) {
                var newData = res.data;
                newData.map((data, index) => {
                    return (data["ids"] = index + 1);
                });
                setData(newData);
                setFilter(newData);
            })
    }, []);

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
            {isBrowser ?
                <div className="DAT_Storage">
                    {/* Banner */}
                    <div className="DAT_Storage_Banner" style={{ backgroundImage: banner, backgroundPosition: "bottom", backgroundRepeat: "no-repeat", backgroundSize: "cover" }}>
                        {/* <div className="DAT_StorageTop-shadow" ></div> */}
                    </div>

                    {/* Profile Detail */}
                    <div className="DAT_Storage_Content">
                        <div className="DAT_Storage_Content_Direct" >
                            {direct.map((data, index) => {
                                return (
                                    (index === 0)
                                        ? <Link key={index} to="/" style={{ textDecoration: 'none', color: "white", fontFamily: "Montserrat-SemiBold" }}>
                                            <span style={{ cursor: "pointer" }}> {data.text}</span>
                                        </Link>
                                        : <span key={index} id={data.id + "_DIR"} style={{ cursor: "pointer" }}> {' > ' + data.text}</span>
                                )
                            })}
                        </div>

                        <div className="DAT_Storage_Content_Tit">
                            <div className="DAT_Storage_Content_Tit-content">
                                <MdOutlineDashboard size={30} color="white" />
                                <span className="DAT_Storage_Content_Tit-content-title" >{inf.tit}</span>
                            </div>

                            <div className="DAT_Storage_Content_Tit_Filter">
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm"
                                    onChange={(e) => { handleFilter(e) }}
                                />
                                <CiSearch color="gray" size={20} />
                            </div>

                            <div className="DAT_Storage_Content_Tit_Blank">
                            </div>
                        </div>

                        <div className="DAT_Storage_Content_Main">
                            <div className="DAT_Storage_Content_Main_Nav">
                                <div className="DAT_Storage_Content_Main_Nav_Item">
                                    Danh sách giao diện
                                </div>
                            </div>

                            <div className="DAT_Storage_Content_Main_List">
                                <DataTable
                                    className="DAT_Table_Container"
                                    columns={head}
                                    data={filter}
                                    pagination
                                    paginationComponentOptions={paginationComponentOptions}
                                    noDataComponent={
                                        <div style={{ margin: "auto", textAlign: "center", color: "red", padding: "20px" }}>
                                            <div>Chưa có giao diện trong kho</div>
                                        </div>
                                    }
                                />
                            </div>
                        </div>
                    </div>
                </div>
                :
                <>
                    <div className="DAT_StorageMobile">
                        <div className="DAT_StorageMobile_Tit" >
                            <MdOutlineDashboard size={25} color="grey" />
                            <span>{inf.tit}</span>
                        </div>
                    </div>

                    <div className="DAT_StorageMobile_Content">
                        <div className="DAT_FilterbarStorage">
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
                                <div key={i} className="DAT_StorageMobile_Content_Container">
                                    <div className="DAT_StorageMobile_Content_Container_List">
                                        <div className="DAT_ListExportM_Container_List_Left">

                                            <div className="DAT_StorageMobile_Content_Container_List_Left_Item"
                                                id={data.type}
                                            >
                                                {data.ids}
                                            </div>
                                        </div>

                                        <div className="DAT_StorageMobile_Content_Container_List_Info">
                                            <div className="DAT_StorageMobile_Content_Container_List_Info_Name"
                                                id={data.id}
                                                onClick={(e) => handleFix(e)}
                                            >
                                                {data.name}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="DAT_StorageMobile_Content_Container_Bottom">
                                        <div className="DAT_StorageMobile_Content_Container_Bottom_Time">
                                            Ngày tạo : ...
                                        </div>
                                        <div className="DAT_StorageMobile_Content_Container_Bottom_Del">
                                            {data.type !== 'master' ?
                                                <MdOutlineDelete
                                                    size={20}
                                                    color="red"
                                                    id={data.name + "_" + data.mail}
                                                    onClick={(e) => handleDelete(e)} /> : <></>}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </>
            }

            <div className="DAT_PopupBG"
                style={{ height: fix ? "100vh" : "0px" }}
            >
                {(fix)
                    ?
                    <div className="DAT_StorageFix" >
                        <form className="DAT_StorageFix-group" onSubmit={e => handleSaveFix(e)}>
                            <div className="DAT_StorageFix-group_Head">
                                <div className="DAT_StorageFix-group_Head_Left">Chỉnh sửa</div>
                                <div className="DAT_StorageFix-group_Head_Right">
                                    <div className="DAT_StorageFix-group_Head_Right_Close"
                                        id="Popup"
                                        onMouseEnter={(e) => handlePopup("new")}
                                        onMouseLeave={(e) => handlePopup("pre")}
                                        onClick={() => setFix(false)}
                                    >
                                        <IoClose size={25} color="white" />
                                    </div>
                                </div>
                            </div>

                            <div className="DAT_StorageFix-group_Body">
                                <div className="DAT_StorageFix-group_Body_Row">
                                    <label>Tên giao diện</label>
                                    <div className="DAT_StorageFix-group_Body_Row_Input">
                                        <input type="text" minLength={6} defaultValue={name.current} ref={name} required />
                                    </div>
                                </div>
                            </div>

                            <div className="DAT_StorageFix-group_Foot">
                                <button>Xác nhận</button>
                            </div>
                        </form>
                    </div>
                    : <></>
                }
            </div>

            <div className="DAT_PopupBG" style={{ height: delstate.value ? "100vh" : "0" }}>
                {delstate.value ? <Raisebox handleDelete={handleDelete} /> : <></>}
            </div>
        </>
    )

}
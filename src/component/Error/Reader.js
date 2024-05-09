import React, { useContext, useEffect, useState } from "react";
import "./Error.scss";
import DataTable from "react-data-table-component";
import { reader } from "./Error";
import axios from "axios";
import { host } from "../constant";
import { useIntl } from "react-intl";
import { AlertContext } from "../Context/AlertContext";
import { isBrowser } from "react-device-detect";
import { IoIosAddCircle } from "react-icons/io";
import { lowercasedata } from "../User/Listuser";
import { BeatLoader } from 'react-spinners';
import { IoClose } from "react-icons/io5";

export default function Reader(props) {
  const dataLang = useIntl();
  const { alertDispatch } = useContext(AlertContext);
  const [config, setConfig] = useState(false);
  const [tit, setTit] = useState("");
  const [filter, setFilter] = useState([]);
  const [positon, setPosition] = useState({ col: "", row: 0 });
  const [dataRead, setDataRead] = useState(reader.value);
  const [loading, setLoading] = useState(true);
  // const [result, setResult] = useState([]);

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
      center: true,
    },
    {
      name: "Mã Lỗi",
      selector: (row) => row.code,
      sortable: true,
      width: "100px",
      center: true,
    },
    {
      name: "Tên Lỗi",
      selector: (row) => (
        <>
          <div
            id={"name_" + row.code}
            onClick={(e) => handleChange(e)}
            style={{ cursor: "pointer" }}
          >
            {row.name}
          </div>
        </>
      ),
      sortable: true,
      minWidth: "250px",
      style: {
        justifyContent: "left",
      }

    },
    {
      name: "Loại Lỗi",
      selector: (row) => (
        <>
          <div
            id={"type_" + row.code}
            onClick={(e) => handleChange(e)}
            style={{ cursor: "pointer" }}
          >
            {row.type}
          </div>
        </>
      ),
      width: "100px",
      center: true,
    },
    {
      name: "Nguyên Nhân",
      selector: (row) => (
        <>
          <div
          // style={{ cursor: "pointer" }}
          >
            {row.infor.map((data, i) => {
              return (
                (i === row.infor.length - 1)
                  ? <div key={i}
                    style={{ display: "flex", alignItems: "center" }}>
                    <span id={"text_infor" + "_" + row.id + "_" + parseInt(i + 1)}
                      style={{ width: "200px", marginRight: "10px", textAlign: "justify", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      - {data.text}
                    </span>
                    <span id={"edit_infor_" + row.code + "_" + parseInt(i + 1)} onClick={(e) => handleEditItem(e)}
                      style={{ cursor: "pointer", color: "green", marginRight: "10px" }}>
                      <ion-icon name="create-outline"></ion-icon>
                    </span>
                    <span id={"delete_infor_" + row.code + "_" + parseInt(i + 1)} onClick={(e) => handleDeleteItem(e)}
                      style={{ cursor: "pointer", color: "red", marginRight: "10px" }}>
                      <ion-icon name="trash-outline"></ion-icon>
                    </span>
                    <span id={"add_infor_" + row.code} onClick={(e) => handleAddItem(e)}
                      style={{ cursor: "pointer", color: "red" }}><ion-icon name="add-circle-outline"></ion-icon>
                    </span>
                  </div>
                  : <div key={i} style={{ cursor: "pointer", display: "flex", alignItems: "center" }}>
                    <span id={"text_infor" + "_" + row.id + "_" + parseInt(i + 1)}
                      style={{ width: "200px", marginRight: "10px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      - {data.text}
                    </span>
                    <span id={"edit_infor_" + row.code + "_" + parseInt(i + 1)} onClick={(e) => handleEditItem(e)}
                      style={{ cursor: "pointer", color: "green", marginRight: "10px" }}>
                      <ion-icon name="create-outline"></ion-icon>
                    </span>
                    <span id={"delete_infor_" + row.code + "_" + parseInt(i + 1)} onClick={(e) => handleDeleteItem(e)}
                      style={{ cursor: "pointer", color: "red", marginRight: "10px" }}>
                      <ion-icon name="trash-outline"></ion-icon>
                    </span>
                  </div>
              )
            })}
          </div>
        </>
      ),
      minWidth: "300px",
      style: {
        justifyContent: "left",
      }
    },
    {
      name: "Biện Pháp",
      selector: (row) => (
        <>
          <div >
            {row.solution.map((data, i) => {
              return (
                (i === row.solution.length - 1)
                  ? <div key={i} style={{ display: "flex", alignItems: "center" }}>
                    <span id={"text_solution_" + "_" + row.code + "_" + parseInt(i + 1)}
                      style={{ width: "200px", marginRight: "10px", textAlign: "justify", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      - {data.text}
                    </span>
                    <span id={"edit_solution_" + row.code + "_" + parseInt(i + 1)} onClick={(e) => handleEditItem(e)}
                      style={{ cursor: "pointer", color: "green", marginRight: "10px" }}
                    >
                      <ion-icon name="create-outline"></ion-icon>
                    </span>
                    <span id={"delete_solution_" + row.code + "_" + parseInt(i + 1)} onClick={(e) => handleDeleteItem(e)}
                      style={{ cursor: "pointer", color: "red", marginRight: "10px" }}>
                      <ion-icon name="trash-outline"></ion-icon>
                    </span>
                    <span id={"add_solution_" + row.code} onClick={(e) => handleAddItem(e)}
                      style={{ cursor: "pointer", color: "red" }}><ion-icon name="add-circle-outline"></ion-icon>
                    </span>
                  </div>
                  : <div key={i} style={{ display: "flex", alignItems: "center" }}>
                    <span id={"text_solution_" + "_" + row.code + "_" + parseInt(i + 1)}
                      style={{ width: "200px", marginRight: "10px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      - {data.text}
                    </span>
                    <span id={"edit_solution_" + row.code + "_" + parseInt(i + 1)} onClick={(e) => handleEditItem(e)}
                      style={{ cursor: "pointer", color: "green", marginRight: "10px" }}>
                      <ion-icon name="create-outline"></ion-icon>
                    </span>
                    <span id={"delete_solution_" + row.code + "_" + parseInt(i + 1)} onClick={(e) => handleDeleteItem(e)}
                      style={{ cursor: "pointer", color: "red", marginRight: "10px" }}>
                      <ion-icon name="trash-outline"></ion-icon>
                    </span>
                  </div>
              )
            })}
          </div>
        </>
      ),
      minWidth: "300px",
      style: {
        justifyContent: "left",
      }
    },
    {
      name: "",
      selector: (row) => (
        <>
          <div
            id={row.code}
            onClick={(e) => handleDelete(e)}
            style={{ cursor: "pointer", color: "red" }}
          >
            Xóa
          </div>
        </>
      ),
      width: "70px",
      center: true,
    },
    {
      name: "",
      selector: (row) => (
        <>
          <div
            id={row.code}
            onClick={(e) => handleSaveNew(e)}
            style={{ cursor: "pointer", color: "blue" }}
          >
            Lưu
          </div>
        </>
      ),
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

  const handleChange = (e) => {
    setConfig(true);
    const arr = e.currentTarget.id.split("_");
    setPosition({ col: arr[0], code: arr[1] });
    switch (arr[0]) {
      case "code":
        setTit("Mã lỗi");
        break;
      case "name":
        setTit("Tên lỗi");
        break;
      case "type":
        setTit("Loại");
        break;
      default:
        setTit("Unknown");
        break;
    }

    var d = reader.value.find((data) => data.code == arr[1]);
    document.getElementById("configvalue").value = d[arr[0]]
  };

  const handleSave = (e) => {
    e.preventDefault();
    var cf = document.getElementById("configvalue")
    //console.log(positon, cf.value)

    switch (positon.col) {
      case "infor":
        var newData = reader.value
        const i = newData.findIndex((data) => data.code == positon.code)
        const r = newData[i].infor.findIndex((data) => data.id == positon.item)
        newData[i].infor[r].text = cf.value
        reader.value = [
          ...newData
        ]

        break;
      case "solution":
        var newData = reader.value
        const i2 = newData.findIndex((data) => data.code == positon.code)
        const r2 = newData[i2].solution.findIndex((data) => data.id == positon.item)
        newData[i2].solution[r2].text = cf.value
        reader.value = [
          ...newData
        ]
        break;
      default:
        var newData = reader.value
        const i3 = newData.findIndex((data) => data.code == positon.code)

        newData[i3][positon.col] = cf.value
        reader.value = [
          ...newData
        ]

        break
    }
    setConfig(false);
  };

  const handleDelete = (e) => {

    var code = e.currentTarget.id

    //reader.value = reader.value.filter((newData) => newData.code != e.currentTarget.id).map((data, index) => ({ ...data, id: (index + 1) }))
    axios.post(host.DEVICE + "/removeInfErr", { code: code, user: props.username }, { secure: true, reconnect: true }).then(
      (res) => {

        // console.log(res.data)
        if (res.data.status) {
          alertDispatch({ type: 'LOAD_CONTENT', payload: { content: dataLang.formatMessage({ id: "alert_5" }), show: 'block' } })
          reader.value = reader.value.filter((newData) => newData.code != code).map((data, index) => ({ ...data, id: (index + 1) }))
        } else {
          alertDispatch({ type: 'LOAD_CONTENT', payload: { content: dataLang.formatMessage({ id: "alert_3" }), show: 'block' } })
        }
      }
    )

  };

  const handleSaveNew = (e) => {

    var doc = reader.value.find((data) => data.code == e.currentTarget.id)
    //console.log(doc)


    axios.post(host.DEVICE + "/updateInfErr", { code: doc.code, name: doc.name, type: doc.type, infor: JSON.stringify(doc.infor), solution: JSON.stringify(doc.solution), user: props.username }, { secure: true, reconnect: true }).then(
      (res) => {

        // console.log(res.data)
        if (res.data.status) {
          alertDispatch({ type: 'LOAD_CONTENT', payload: { content: dataLang.formatMessage({ id: "alert_5" }), show: 'block' } })
        } else {
          alertDispatch({ type: 'LOAD_CONTENT', payload: { content: dataLang.formatMessage({ id: "alert_3" }), show: 'block' } })
        }
      }
    )
  };

  const handleAddItem = (e) => {
    //console.log(e.currentTarget.id)
    const arr = e.currentTarget.id.split("_")
    const newData = reader.value
    const i = newData.findIndex((data) => data.code == arr[2])
    //console.log(i)

    newData[i][arr[1]] = [
      ...newData[i][arr[1]],
      { id: parseInt(newData[i][arr[1]].length) + 1, text: "..." }
    ]
    reader.value = [
      ...newData
    ]
  };

  const handleEditItem = (e) => {
    //console.log(e.currentTarget.id)
    const arr = e.currentTarget.id.split("_")
    const i = reader.value.findIndex((data) => data.code == arr[2])
    const r = reader.value[i][arr[1]].find((data) => data.id == arr[3])
    //console.log(i, r)
    setConfig(true)
    document.getElementById("configvalue").value = r.text
    setPosition({ col: arr[1], code: arr[2], item: arr[3] })
    setTit((arr[1] === "infor") ? "Nguyên nhân" : "Biên pháp");
  }

  const handleDeleteItem = (e) => {
    // console.log(e.currentTarget.id)
    const arr = e.currentTarget.id.split("_")
    const newData = reader.value
    const i = newData.findIndex((data) => data.code == arr[2])

    // console.log(newData[i].data)
    if (newData[i][arr[1]].length > 1) {

      newData[i][arr[1]] = newData[i][arr[1]].filter((data) => data.id != arr[3]).map((data, index) => {
        return { ...data, id: index + 1 }
      })
      reader.value = [
        ...newData
      ]
    }

  }

  const handleClose = (e) => {
    setConfig(false);
  };

  const handleAddReader = (e) => {
    e.preventDefault();
    var err = document.getElementById("errid");

    var newData = reader.value.filter((data) => data.code == err.value);
    //console.log(newData)

    if (newData.length > 0) {
      // console.log("already exist!");
      alertDispatch({
        type: "LOAD_CONTENT",
        payload: {
          content: dataLang.formatMessage({ id: "alert_41" }),
          show: "block",
        },
      });
    } else {
      axios
        .post(
          host.DEVICE + "/addInfErr",
          {
            code: err.value,
            name: "Lỗi " + parseInt(reader.value.length + 1),
            type: "Error",
            infor: JSON.stringify([{ id: 1, text: "..." }]),
            solution: JSON.stringify([{ id: 1, text: "..." }]),
            user: props.username,
          },
          { secure: true, reconnect: true }
        )
        .then((res) => {
          // console.log(res.data);
          if (res.data.status) {
            reader.value = [
              ...reader.value,
              {
                id: parseInt(reader.value.length + 1),
                code: err.value,
                name: "Lỗi " + parseInt(reader.value.length + 1),
                type: "Error",
                infor: [{ id: 1, text: "..." }],
                solution: [{ id: 1, text: "..." }],
              },
            ];
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
    }
  };

  const handleFilter = (e) => {
    const input = lowercasedata(e.target.value)
    if (input === "") {
      setDataRead(reader.value)
    } else {
      setDataRead(reader.value.filter((data) => lowercasedata(data.name).includes(input)))
    }
  }

  useEffect(() => {
    setDataRead(reader.value)
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }, [])

  useEffect(() => {
    const searchTerm = lowercasedata(props.filter);
    if (searchTerm == "") {
      setFilter(reader.value);
    } else {
      const df = reader.value.filter((item) => {
        const filterName = item.code && lowercasedata(item.name).includes(searchTerm) ||
          item.infor.some(
            (reg) => {
              return (
                lowercasedata(reg.text).includes(searchTerm))
            }) ||
          item.solution.some(
            (reg) => {
              return (
                lowercasedata(reg.text).includes(searchTerm))
            })
          ;
        const filterID = item.code && lowercasedata(item.name).includes(searchTerm)
        return (filterName || filterID);
      });
      setFilter(df);
    }
  }, [props.filter])

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
      {isBrowser ?
        <div className="DAT_Reader">
          <DataTable
            className="DAT_Table_Container"
            columns={col}
            data={filter}
            pagination
            paginationComponentOptions={paginationComponentOptions}
            fixedHeader={true}
            noDataComponent={
              <div style={{ margin: "auto", textAlign: "center", color: "red", padding: "20px" }}>
                <div>Bạn vui lòng thêm thông tin sự cố!</div>
              </div>
            }
          />
        </div>
        :
        <>
          <div className="DAT_ViewMobile_Container_Add" style={{ width: "100%" }}>
            <form className="DAT_ViewMobile_Container_Add_Form" onSubmit={(e) => handleAddReader(e)}>
              <input
                placeholder="Nhập mã lỗi"
                id="errcode"
                onChange={(e) => { handleFilter(e) }}
                required
              ></input>
              <IoIosAddCircle size={30} color="#0d6efd" style={{ cursor: "pointer" }} />
            </form>
          </div>

          {loading
            ? <div className="DAT_ViewMobile_Container_Loading">
              <BeatLoader color="blue" size={10} />
              <span style={{ color: "blue" }}>
                Đang tải
              </span>
            </div>
            : <>
              <div className="DAT_Read">
                <div className="DAT_Read_Body">
                  {dataRead.map((row, index) => (
                    <div key={index} className="DAT_ViewMobile_Container_Content">
                      <div className="DAT_ViewMobile_Container_Content_Top"
                        style={{
                          display: "flex",
                          gap: "20px",
                          borderBottom: "1px solid #e0e0e0",
                        }}>
                        <div className="DAT_ViewMobile_Container_Content_Top_left" >
                          {row.type}
                        </div>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px" }}>
                          <div
                            className="DAT_ViewMobile_Container_Content_Top_right">
                            <div className="DAT_ViewMobile_Container_Content_Top_right_content">
                              <div className="DAT_ViewMobile_Container_Content_Top_right_content_title">
                                {row.name}
                              </div>

                              <div className="DAT_ViewMobile_Container_Content_Top_right_content_inforTitle">
                                Nguyên nhân :
                              </div>
                              {row.infor.map((infor, i) => (
                                (i === row.infor.length - 1) ?
                                  <div key={i} className="DAT_ViewMobile_Container_Content_Top_right_content_infor">
                                    <span>{infor.text}</span>
                                    <div className="DAT_ViewMobile_Container_Content_Top_right_content_infor_function">
                                      <span onClick={(e) => handleEditItem(e)}
                                        id={"edit_infor_" + row.code + "_" + parseInt(i + 1)}
                                        style={{ color: "green", marginRight: "20px" }}>
                                        <ion-icon name="create-outline"></ion-icon>
                                      </span>
                                      <span onClick={(e) => handleDeleteItem(e)}
                                        id={"delete_infor_" + row.code + "_" + parseInt(i + 1)}
                                        style={{ color: "red", marginRight: "20px" }}>
                                        <ion-icon name="trash-outline"></ion-icon>
                                      </span>
                                      <span onClick={(e) => handleAddItem(e)}
                                        id={"add_infor_" + row.code}
                                        style={{ color: "#0d6efd" }}>
                                        <ion-icon name="add-circle-outline"></ion-icon>
                                      </span>
                                    </div>
                                  </div>
                                  :
                                  <div key={i} className="DAT_ViewMobile_Container_Content_Top_right_content_infor">
                                    <span>{infor.text}</span>
                                    <div className="DAT_ViewMobile_Container_Content_Top_right_content_infor_function">
                                      <span onClick={(e) => handleEditItem(e)}
                                        id={"edit_infor_" + row.code + "_" + parseInt(i + 1)}
                                        style={{ color: "green", marginRight: "20px" }}>
                                        <ion-icon name="create-outline"></ion-icon>
                                      </span>
                                      <span onClick={(e) => handleDeleteItem(e)}
                                        id={"delete_infor_" + row.code + "_" + parseInt(i + 1)}
                                        style={{ color: "red", marginRight: "20px" }}>
                                        <ion-icon name="trash-outline"></ion-icon>
                                      </span>
                                    </div>
                                  </div>
                              ))}

                              <div className="DAT_ViewMobile_Container_Content_Top_right_content_inforTitle">
                                Biển pháp :
                              </div>
                              {row.solution.map((solu, i) => (
                                (i === row.solution.length - 1) ?
                                  <div key={i} className="DAT_ViewMobile_Container_Content_Top_right_content_infor">
                                    <span>{solu.text}</span>
                                    <div className="DAT_ViewMobile_Container_Content_Top_right_content_infor_function">
                                      <span onClick={(e) => handleEditItem(e)}
                                        id={"edit_solution_" + row.code + "_" + parseInt(i + 1)}
                                        style={{ color: "green", marginRight: "20px" }}>
                                        <ion-icon name="create-outline"></ion-icon>
                                      </span>
                                      <span onClick={(e) => handleDeleteItem(e)}
                                        id={"delete_solution_" + row.code + "_" + parseInt(i + 1)}
                                        style={{ color: "red", marginRight: "20px" }}>
                                        <ion-icon name="trash-outline"></ion-icon>
                                      </span>
                                      <span onClick={(e) => handleAddItem(e)}
                                        id={"add_solution_" + row.code}
                                        style={{ color: "#0d6efd" }}>
                                        <ion-icon name="add-circle-outline"></ion-icon>
                                      </span>
                                    </div>
                                  </div>
                                  :
                                  <div key={i} className="DAT_ViewMobile_Container_Content_Top_right_content_infor">
                                    <span>{solu.text}</span>
                                    <div className="DAT_ViewMobile_Container_Content_Top_right_content_infor_function">
                                      <span onClick={(e) => handleEditItem(e)}
                                        id={"edit_solution_" + row.code + "_" + parseInt(i + 1)}
                                        style={{ color: "green", marginRight: "20px" }}>
                                        <ion-icon name="create-outline"></ion-icon>
                                      </span>
                                      <span onClick={(e) => handleDeleteItem(e)}
                                        id={"delete_solution_" + row.code + "_" + parseInt(i + 1)}
                                        style={{ color: "red", marginRight: "20px" }}>
                                        <ion-icon name="trash-outline"></ion-icon>
                                      </span>
                                    </div>
                                  </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="DAT_ViewMobile_Container_Content_Bottom"
                        style={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}
                      >
                        <span
                          id={row.code}
                          onClick={(e) => handleSaveNew(e)}>
                          <ion-icon name="save"></ion-icon>
                        </span>
                        <span
                          id={row.code}
                          onClick={(e) => handleDelete(e)}
                        >
                          <ion-icon name="trash-outline" style={{ marginLeft: "20px" }}></ion-icon>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div >
            </>
          }
        </>
      }

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

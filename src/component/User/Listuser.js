import React, { useContext, useEffect } from "react";
import "./User.scss";
import DataTable from "react-data-table-component";
import { useState } from "react";
import axios from "axios";
import { host } from "../constant";
import { useDispatch, useSelector } from "react-redux";
import { useIntl } from "react-intl";
import { AlertContext } from "../Context/AlertContext";
import adminslice from "../Redux/adminslice";
import { signal } from "@preact/signals-react";
import { isBrowser } from "react-device-detect";
import { MdOutlineDelete } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import { editUser } from "./User";
import { delstate } from "../Raisebox/RaiseboxConfirmDel";

const projectadmin = signal([]);
const deviceadmin = signal([]);
const enduser = signal('');
const role = signal({});

export const data = signal([]);
// export const delstate = signal(false)
export const lowercasedata = (str) => {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
};

export default function Listuser(props) {
  const dataLang = useIntl();
  const { alertDispatch } = useContext(AlertContext);
  const user = useSelector((state) => state.admin.user)
  const manager = useSelector((state) => state.admin.manager)
  const type = useSelector((state) => state.admin.type)
  const [modify, setModify] = useState(false)
  // const [data, setData] = useState([]);
  const [filter, setFilter] = useState([]);

  const rootDispatch = useDispatch()

  const paginationComponentOptions = {
    rowsPerPageText: 'Số hàng',
    rangeSeparatorText: 'đến',
    selectAllRowsItem: true,
    selectAllRowsItemText: 'tất cả',
  };

  const head_master = [
    {
      name: "STT",
      selector: (row) => row.id,
      sortable: true,
      width: "80px",
      center: true,
    },
    {
      name: "Tên tài khoản",
      selector: (row) => <div
        onClick={() => handleSetManager(row.name, user)}
        style={{ color: (row.name === manager) ? "red" : "black", cursor: "pointer" }}>
        {row.name}
      </div>,
      width: "150px",
      style: {
        justifyContent: "left",
      }
    },
    {
      name: "Email",
      selector: (row) => row.mail,
      width: "300px",
      style: {
        justifyContent: "left",
      }
    },
    {
      name: "Tên",
      selector: (row) => row.username,
      style: {
        justifyContent: "left",
      }
    },
    {
      name: "",
      selector: (row) => {
        return (

          (row.type !== 'master')
            ? <div
              id={row.name + "_" + row.mail}
              onClick={() => {
                delstate.value = true;
                props.setdata(row.name, row.mail);
              }}
              style={{ cursor: "pointer", color: "red" }}
            >
              <MdOutlineDelete size={20} color="red" />
            </div>
            : <></>
        )
      },
      width: "70px",
      center: true,
    },
  ];

  const head = [
    {
      name: "STT",
      selector: (row) => row.id,
      sortable: true,
      width: "80px",
      center: true,
    },
    {
      name: "Tên tài khoản",
      selector: (row) => row.name,
      width: "150px"
    },
    {
      name: "Email",
      selector: (row) => row.mail,
      width: "300px"
    },
    {
      name: "Tên",
      selector: (row) => row.username,
    },
    {
      name: "Dữ liệu",
      selector: (row) => <div id={row.name}
        onClick={(e) => handleModify(e)}
        style={{ cursor: "pointer", color: "green" }}>
        <ion-icon name="create-outline"></ion-icon>
      </div>,
      width: "80px",
      center: true,
    },
    {
      name: "",
      selector: (row) => {
        return (
          (row.type !== 'master')
            ? <div
              id={row.name + "_" + row.mail}
              onClick={() => {
                delstate.value = true;
                props.setdata(row.name, row.mail);
              }}
              style={{ cursor: "pointer", color: "red" }}
            >
              <MdOutlineDelete size={20} color="red" />
            </div>
            : <></>
        )
      },
      width: "70px",
      center: true,
    },
  ];

  const handleSetManager = (manager, name) => {

    if (type === 'master') {
      rootDispatch(adminslice.actions.setmanager(manager))
    }

    axios.post(host.DEVICE + "/setManagerAcount", { manager: manager, name: name }, { withCredentials: true }).then(
      function (res) {
        // console.log(res.data)
        if (res.data.status) {

          alertDispatch({ type: 'LOAD_CONTENT', payload: { content: dataLang.formatMessage({ id: "alert_5" }), show: 'block' } })
        } else {
          alertDispatch({ type: 'LOAD_CONTENT', payload: { content: dataLang.formatMessage({ id: "alert_3" }), show: 'block' } })
        }

      })

  };

  const handleFix = (type, status, id, code) => {
    if (type === 'device') {
      if (status === 'false') {
        axios.post(host.DEVICE + "/addlistDeviceUser", { username: enduser.value, deviceid: id, code: code }, { withCredentials: true }).then(
          function (res) {
            // console.log(res.data)
            if (res.data.status) {
              deviceadmin.value = deviceadmin.value.map((item, i) => {
                if (item.deviceid == id) {

                  axios.post(host.DEVICE + "/setStateErrDevice", { user: enduser.value, id: item.deviceid, state: 'true' }, { withCredentials: true }).then(
                    function (res) {
                      // console.log(res.data)
                    }
                  )

                  return { ...item, status: 'true' };
                }
                return item;
              });
              alertDispatch({ type: 'LOAD_CONTENT', payload: { content: dataLang.formatMessage({ id: "alert_5" }), show: 'block' } })
            } else {
              alertDispatch({ type: 'LOAD_CONTENT', payload: { content: dataLang.formatMessage({ id: "alert_3" }), show: 'block' } })
            }
          })
      } else {

        axios.post(host.DEVICE + "/removelistDeviceUser", { user: enduser.value, id: id }, { withCredentials: true }).then(
          function (res) {
            // console.log(res.data)
            if (res.data.status) {
              deviceadmin.value = deviceadmin.value.map((item, i) => {
                if (item.deviceid == id) {

                  axios.post(host.DEVICE + "/setStateErrDevice", { user: enduser.value, id: item.deviceid, state: 'false' }, { withCredentials: true }).then(
                    function (res) {
                      // console.log(res.data)
                    }
                  )
                  return { ...item, status: 'false' };
                }
                return item;
              });
              alertDispatch({ type: 'LOAD_CONTENT', payload: { content: dataLang.formatMessage({ id: "alert_5" }), show: 'block' } })
            } else {
              alertDispatch({ type: 'LOAD_CONTENT', payload: { content: dataLang.formatMessage({ id: "alert_3" }), show: 'block' } })
            }
          })
      }
    }


    if (type === 'project') {
      if (status === 'false') {
        axios.post(host.DEVICE + "/addlistProjectUser", { username: enduser.value, projectid: id, code: code }, { withCredentials: true }).then(
          function (res) {
            // console.log(res.data)
            if (res.data.status) {
              projectadmin.value = projectadmin.value.map((item, i) => {
                if (item.projectid == id) {
                  axios.post(host.DEVICE + "/setStateErrProject", { user: enduser.value, id: item.projectid, state: 'true' }, { withCredentials: true }).then(
                    function (res) {
                      // console.log(res.data)
                    }
                  )
                  return { ...item, status: 'true' };
                }
                return item;
              });
              alertDispatch({ type: 'LOAD_CONTENT', payload: { content: dataLang.formatMessage({ id: "alert_5" }), show: 'block' } })
            } else {
              alertDispatch({ type: 'LOAD_CONTENT', payload: { content: dataLang.formatMessage({ id: "alert_3" }), show: 'block' } })
            }
          })
      } else {
        axios.post(host.DEVICE + "/removelistProjectUser", { user: enduser.value, id: id }, { withCredentials: true }).then(
          function (res) {
            // console.log(res.data)
            if (res.data.status) {
              projectadmin.value = projectadmin.value.map((item, i) => {
                if (item.projectid == id) {
                  axios.post(host.DEVICE + "/setStateErrProject", { user: enduser.value, id: item.projectid, state: 'false' }, { withCredentials: true }).then(
                    function (res) {
                      // console.log(res.data)
                    }
                  )
                  return { ...item, status: 'false' };
                }
                return item;
              });
              alertDispatch({ type: 'LOAD_CONTENT', payload: { content: dataLang.formatMessage({ id: "alert_5" }), show: 'block' } })
            } else {
              alertDispatch({ type: 'LOAD_CONTENT', payload: { content: dataLang.formatMessage({ id: "alert_3" }), show: 'block' } })
            }
          })
      }
    }
  };

  const handleModify = (e) => {
    enduser.value = e.currentTarget.id
    axios.post(host.DEVICE + "/getProjectAdmin", { user: e.currentTarget.id, role: 'user' }, { withCredentials: true }).then(
      function (res) {
        //console.log("user Project", res.data)
        const updatedArray = projectadmin.value.map(item => {
          if (res.data.some(obj => obj.projectid == item.projectid)) {
            return { ...item, status: 'true' };
          } else {
            return { ...item, status: 'false' };
          }
          //return item;
        })

        projectadmin.value = updatedArray

      })

    axios.post(host.DEVICE + "/getDeviceAdmin", { user: e.currentTarget.id, role: 'user' }, { withCredentials: true }).then(
      function (res) {
        //console.log("user Device", res.data)

        const updatedArray = deviceadmin.value.map(item => {
          if (res.data.some(obj => obj.deviceid == item.deviceid)) {
            return { ...item, status: 'true' };
          } else {
            return { ...item, status: 'false' };
          }
          //return item;
        });

        deviceadmin.value = updatedArray

      })
    setModify(true)
  };

  const handleDelete = (e) => {
    // console.log(e.target.id);
    const arr = e.target.id.split("_")

    var newData = data.value
    newData = newData.filter(data => data.name != arr[0] && data.name[1] != arr[1])
    data.value = [...newData]
    setFilter(newData)
    axios.post(host.DEVICE + "/removeAcount", { name: arr[0], mail: arr[1] }, { withCredentials: true }).then(
      function (res) {
        // console.log(res.data)
        if (res.data.status) {
          alertDispatch({ type: 'LOAD_CONTENT', payload: { content: dataLang.formatMessage({ id: "alert_9" }), show: 'block' } })
        } else {
          alertDispatch({ type: 'LOAD_CONTENT', payload: { content: dataLang.formatMessage({ id: "alert_3" }), show: 'block' } })
        }
      })

  };

  const handleRole = (type, name) => {

    axios.post(host.DEVICE + "/setTypeAcount", { name: name, type: type }, { withCredentials: true }).then(
      function (res) {
        // console.log(res.data)
        if (res.data.status) {
          role.value[name] = type
          alertDispatch({ type: 'LOAD_CONTENT', payload: { content: dataLang.formatMessage({ id: "alert_5" }), show: 'block' } })
        } else {
          alertDispatch({ type: 'LOAD_CONTENT', payload: { content: dataLang.formatMessage({ id: "alert_3" }), show: 'block' } })
        }
      })
  };

  const handleNav = (e) => {
    editUser.value = true;
    // console.log(editUser.value)
  };

  const handleFilter = (e) => {
    const searchTerm = lowercasedata(e.currentTarget.value);
    if (searchTerm == "") {
      setFilter(data.value)
    } else {
      const df = data.value.filter((item) => {
        const filterName = item.name && lowercasedata(item.name).includes(searchTerm);
        const filterEmail = item.email && lowercasedata(item.email).toLowerCase().includes(searchTerm);
        const filterUsername = item.username && lowercasedata(item.username).toLowerCase().includes(searchTerm);

        return (filterName || filterEmail || filterUsername);
      })
      setFilter(df)
    }
  };

  useEffect(() => {
    axios.post(host.DEVICE + "/getAcount", { admin: user }, { withCredentials: true }).then(
      function (res) {
        var newData = res.data.map((data, index) => {
          data["id"] = index + 1;
          return data;
        });
        // console.log(newData);
        // setData(newData);
        data.value = newData;
        setFilter(data.value);
      })


    axios.post(host.DEVICE + "/getProjectAdmin", { user: user, role: 'admin' }, { withCredentials: true }).then(
      function (res) {
        // console.log("admin Project", res.data)
        projectadmin.value = []
        res.data.map((item, i) => {
          projectadmin.value = [...projectadmin.value, { projectid: item.projectid, code: item.code, status: 'false' }]
        })

      })
    axios.post(host.DEVICE + "/getDeviceAdmin", { user: user, role: 'admin' }, { withCredentials: true }).then(
      function (res) {
        // console.log("admin Device", res.data)
        deviceadmin.value = []
        res.data.map((item, i) => {
          deviceadmin.value = [...deviceadmin.value, { deviceid: item.deviceid, code: item.code, status: 'false' }]
        })

      })
  }, []);

  useEffect(() => {
    const searchTerm = lowercasedata(props.filter);
    if (searchTerm == "") {
      setFilter(data.value)
    } else {
      const df = data.value.filter((item) => {
        const filterName = item.name && lowercasedata(item.name).includes(searchTerm);
        const filterEmail = item.email && lowercasedata(item.email).toLowerCase().includes(searchTerm);
        const filterUsername = item.username && lowercasedata(item.username).toLowerCase().includes(searchTerm);

        return (filterName || filterEmail || filterUsername);
      })
      setFilter(df)
    }
  }, [props.filter]);

  useEffect(() => {
    setFilter(data.value)
  }, [data.value]);

  return (
    <>
      {isBrowser
        ?
        <div className="DAT_UserList">
          <DataTable
            className="DAT_Table_Container"
            columns={(type === 'master') ? head_master : head}
            data={filter}
            pagination
            paginationComponentOptions={paginationComponentOptions}
            noDataComponent={
              <div style={{ margin: "auto", textAlign: "center", color: "red", padding: "20px" }}>
                <div>
                  Danh sách người dùng trống !
                </div>
              </div>
            }
          />
        </div>
        :
        <>
          <div className="DAT_FilterbarUser">
            <input
              id="search"
              type="text"
              placeholder="Tìm kiếm"
              style={{ minWidth: "calc(100% - 45px)" }}
              onChange={(e) => handleFilter(e)}
            />
            <div className="DAT_FilterbarUser_Date"
              onClick={(e) => handleNav(e)}>
              <IoMdAdd size={18} />
            </div>
          </div>

          {filter.map((data, i) => {
            return (
              <div key={i} className="DAT_ListDetail_Content_List_Item">
                <div className="DAT_ListDetail_Content_List_Item_GroupInfo"
                >
                  <div className="DAT_ListDetail_Content_List_Item_GroupInfo_Code"
                    id={data.type}
                  // onClick={(e) => handleErr(e)}
                  >
                    {data.type.toUpperCase()}
                  </div>
                  <div className="DAT_ListDetail_Content_List_Item_GroupInfo_Info">
                    {type === 'master' ?
                      <div className="DAT_ListDetail_Content_List_Item_GroupInfo_Info_Gateway"
                        onClick={() => handleSetManager(data.name, user)}
                        style={{
                          color: (data.name === manager)
                            ? "red" : "black",
                          cursor: "pointer"
                        }}
                      >
                        {data.name}
                      </div> :
                      <div className="DAT_ListDetail_Content_List_Item_GroupInfo_Info_Gateway">
                        {data.username}
                        {/* {data.mail} */}
                      </div>
                    }
                    <div className="DAT_ListDetail_Content_List_Item_GroupInfo_Info_Detail"
                      style={{ color: "gray", fontSize: "12px" }}
                    >
                      {data.username}
                      {/* {data.mail} */}
                    </div>
                  </div>
                </div>

                <div className="DAT_ListDetail_Content_List_Item_Bottom">
                  <div className="DAT_ListDetail_Content_List_Item_Bottom_Time"
                    style={{ color: "gray", fontSize: "12px" }}
                  >
                    {/* {`${data.username}`} */}
                    {`${data.mail}`}
                  </div>
                  <div className="DAT_ListDetail_Content_List_Item_Bottom_Del" >
                    {data.type !== 'master' ?
                      <MdOutlineDelete
                        size={20}
                        color="red"
                        id={data.name + "_" + data.mail}
                        onClick={() => {
                          delstate.value = !delstate.value;
                          props.setdata(data.name, data.mail);
                        }}
                      /> : <></>}
                  </div>

                </div>
              </div>
            )
          })}
        </>
      }

      <div className="DAT_ModifyUserList" style={{ height: (modify) ? "100vh" : "0px", transition: "0.5s" }} >
        {(modify)
          ?
          <div className="DAT_ModifyUserList-Group">

            <div className="DAT_ModifyUserList-Group-head"  >
              <span>Tài khoản: <p style={{ color: "green" }}>{enduser.value}</p></span>
              <span onClick={() => setModify(false)} >
                <ion-icon name="close-outline"></ion-icon>
              </span>
            </div>
            <div className="DAT_ModifyUserList-Group-eurole"  >
              <div onClick={() => handleRole("mainuser", enduser.value)} style={{ color: (role.value[enduser.value] === 'mainuser') ? "green" : "black", cursor: "pointer" }}>Quản trị viên</div>
              <div onClick={() => handleRole("user", enduser.value)} style={{ color: (role.value[enduser.value] === 'user') ? "green" : "black", cursor: "pointer" }}>Người dùng cuối</div>
            </div>
            <div className="DAT_ModifyUserList-Group-euproject">
              <div className="DAT_ModifyUserList-Group-euproject-title">Dự án</div>
              {projectadmin.value.map((item, index) => (
                <div className="DAT_ModifyUserList-Group-euproject-item" key={index}>
                  <span>{item.projectid}</span>
                  <span>{item.code}</span>
                  <span onClick={() => handleFix("project", item.status, item.projectid, item.code)} style={{ color: (item.status === 'true') ? "green" : "red", display: "flex", justifyContent: "flex-end", cursor: "pointer" }}>{item.status}</span>

                </div>
              ))
              }

            </div>
            <div className="DAT_ModifyUserList-Group-eudevice">
              <div className="DAT_ModifyUserList-Group-eudevice-title"> Gateway</div>
              {deviceadmin.value.map((item, index) => (
                <div className="DAT_ModifyUserList-Group-eudevice-item" key={index}>
                  <span>{item.deviceid}</span>
                  <span >{item.code}</span>
                  <span onClick={() => handleFix("device", item.status, item.deviceid, item.code)} style={{ color: (item.status === 'true') ? "green" : "red", display: "flex", justifyContent: "flex-end", cursor: "pointer" }}>{item.status}</span>
                </div>
              ))
              }
            </div>

          </div>

          : <></>
        }
      </div>
    </>
  );
}
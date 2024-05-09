import React, { useContext, useEffect } from "react";
import "./Project.scss";
import DataTable from "react-data-table-component";
import { useState } from "react";
import axios from "axios";
import { host } from "../constant";
import { useSelector } from "react-redux";
import { useIntl } from "react-intl";
import { AlertContext } from "../Context/AlertContext";
import { isBrowser } from "react-device-detect";
import { MdOutlineDelete } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import { editProject } from "./Project";
import { lowercasedata } from "../User/Listuser";
import Raisebox, { delstate } from "../Raisebox/RaiseboxConfirmDel";

export default function Listproject(props) {
  const dataLang = useIntl();
  const { alertDispatch } = useContext(AlertContext);
  // const user = useSelector((state) => state.admin.user)
  const manager = useSelector((state) => state.admin.manager)
  // const type = useSelector((state) => state.admin.type)
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState([]);
  const [dataDel, setDataDel] = useState();
  // const rootDispatch = useDispatch()

  const paginationComponentOptions = {
    rowsPerPageText: 'Số hàng',
    rangeSeparatorText: 'đến',
    selectAllRowsItem: true,
    selectAllRowsItemText: 'tất cả',
  };

  const head = [
    {
      name: "STT",
      selector: (row) => row.id,
      sortable: true,
      width: "75px",
      center: true,
    },
    {
      name: "ID",
      selector: (row) => row.projectid,
      width: "100px"
    },
    {
      name: "Tên Dự án",
      selector: (row) => row.name,
      style: {
        justifyContent: "left",
      }
    },

    {
      name: "Công ty",
      selector: (row) => row.company,
      style: {
        justifyContent: "left",
      }

    },

    {
      name: "Thông tin",
      selector: (row) => row.addr,
      sortable: true,
      width: "400px",
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
            id={row.projectid}
            onClick={(e) => {
              delstate.value = true;
              setdata(row.projectid)
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

  const handleNav = (e) => {
    editProject.value = true
  };

  const setdata = (projectid) => {
    setDataDel(`${projectid}`)
  };

  const handleDelete = (e) => {
    // console.log(dataDel);
    var newData = data
    newData = newData.filter(data => data.projectid != dataDel)
    setData(newData)
    setFilter(newData)
    axios.post(host.DEVICE + "/deletelistProject", { projectid: dataDel }, { withCredentials: true }).then(
      function (res) {
        // console.log(res.data)
        if (res.data.status) {
          alertDispatch({ type: 'LOAD_CONTENT', payload: { content: dataLang.formatMessage({ id: "alert_18" }), show: 'block' } })
        } else {
          alertDispatch({ type: 'LOAD_CONTENT', payload: { content: dataLang.formatMessage({ id: "alert_3" }), show: 'block' } })
        }
      })

  };

  const handleFilter = (e) => {
    const searchTerm = lowercasedata(e.currentTarget.value);
    if (searchTerm == "") {
      setFilter(data)
    } else {
      const df = data.filter((item) => {
        const filterName = item.name && lowercasedata(item.name).includes(searchTerm);
        const filterAddress = item.addr && lowercasedata(item.addr).toLowerCase().includes(searchTerm);
        const filterCompany = item.company && lowercasedata(item.company).toLowerCase().includes(searchTerm);

        return (filterName || filterAddress || filterCompany);
      })
      setFilter(df)
    }
  }

  useEffect(() => {
    axios.post(host.DEVICE + "/getProject", { user: manager }, { withCredentials: true }).then(
      function (res) {
        // console.log(res.data)
        var newData = res.data;
        newData.map((data, index) => {
          return (data["id"] = index + 1);
        });
        // console.log(newData);
        setData(newData);
        setFilter(newData);
      })
  }, []);

  useEffect(() => {
    return () => {
      editProject.value = false
      delstate.value = false
    }
  }, [])

  useEffect(() => {
    const searchTerm = lowercasedata(props.filter);
    if (searchTerm == "") {
      setFilter(data)
    } else {
      const df = data.filter((item) => {
        const filterName = lowercasedata(item.name).includes(searchTerm);
        const filterAddress = lowercasedata(item.addr).toLowerCase().includes(searchTerm);
        const filterCompany = lowercasedata(item.company).toLowerCase().includes(searchTerm);

        return (filterName || filterAddress || filterCompany);
      })
      setFilter(df)
    }
  }, [props.filter])

  return (
    <>
      {isBrowser
        ?
        <div className="DAT_UserList">
          <DataTable
            className="DAT_Table_Container"
            columns={head}
            data={filter}
            pagination
            paginationComponentOptions={paginationComponentOptions}
            noDataComponent={
              <div style={{ margin: "auto", textAlign: "center", color: "red", padding: "20px" }}>
                <div>Danh sách trống</div>
                <div>Vui lòng tạo dự án</div>
              </div>
            }
          />
        </div>
        :
        // MOBILE SECTION
        <>
          <div className="DAT_FilterbarProject">
            <input
              id="search"
              type="text"
              placeholder="Tìm kiếm"
              style={{ minWidth: "calc(100% - 45px)" }}
              onChange={(e) => { handleFilter(e) }}
            />
            <div className="DAT_FilterbarProject_Date"
              onClick={() => handleNav()}>
              <IoMdAdd size={18} />
            </div>
          </div>
          {filter.map((data, i) => {
            return (
              <div key={i} className="DAT_ProjDetail_Container">
                <div className="DAT_ProjDetail_Container_List">
                  <div className="DAT_ProjDetail_Container_List_Left">
                    <div className="DAT_ProjDetail_Container_List_Left_Item"
                      id={data.type}
                    >
                      {data.id}
                    </div>
                  </div>

                  <div className="DAT_ProjDetail_Container_List_Right">
                    <div className="DAT_ProjDetail_Container_List_Right_Info">
                      <div className="DAT_ProjDetail_Container_List_Right_Info_Name"
                        id={data.id}
                      >
                        {data.name}
                      </div>
                    </div>

                    <div className="DAT_ProjDetail_Container_List_Right_Small">
                      <div className="DAT_ProjDetail_Container_List_Right_Small_Company"
                        id={data.id}
                      >
                        {data.company}
                      </div>
                    </div>

                    <div className="DAT_ProjDetail_Container_List_Right_Small">
                      <div className="DAT_ProjDetail_Container_List_Right_Small_Address"
                        id={data.id}
                      >
                        {data.addr}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="DAT_ProjDetail_Container_Bottom">
                  <div className="DAT_ProjDetail_Container_Bottom_Time">
                    Lần cập nhật cuối: ...
                  </div>
                  <div className="DAT_ProjDetail_Container_Bottom_Del">
                    {data.type !== 'master' ?
                      <MdOutlineDelete
                        size={20}
                        color="red"
                        id={data.projectid}
                        onClick={(e) => handleDelete(e)}
                      /> : <></>}
                  </div>
                </div>
              </div>
            )
          })}
        </>
      }

      <div className="DAT_PopupBG" style={{ height: delstate.value ? "100vh" : "0" }}>
        {delstate.value ? <Raisebox handleDelete={handleDelete} /> : <></>}
      </div>
    </>
  );
}
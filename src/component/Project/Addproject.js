import React, { useContext, useEffect, useState } from "react";
import "./Project.scss";
import { useRef } from "react";
import axios from "axios";
import { host } from "../constant";
import { useIntl } from "react-intl";
import { AlertContext } from "../Context/AlertContext";
import { setKey, geocode, RequestType } from "react-geocode";
import { IoClose } from "react-icons/io5";
import { editProject } from "./Project";

export default function AddProject(props) {
  const dataLang = useIntl();
  const { alertDispatch } = useContext(AlertContext);
  const ProjectAddid = useRef();
  const name = useRef();
  const company = useRef();
  const info = useRef();
  const long = useRef();
  const lat = useRef();
  const bu = useRef('AUTO');
  const [state, setState] = useState(true)

  const ProjectAdd = ['Old', 'New']

  const BU = ['AUTO', 'ELEV', 'SOL', 'UPS']

  const handleProjectAdd = (e) => {
    //console.log(e.currentTarget.value)
    if (e.currentTarget.value === 'Old') {
      setState(false)
    } else {
      setState(true)
    }


  };

  const handleInput = (e) => {
    // console.log(info.current.value)
    setKey(process.env.REACT_APP_GGKEY);
    geocode(RequestType.ADDRESS, info.current.value)
      .then((response) => {
        // console.log(response.results[0].geometry.location);

        var long_ = document.getElementById("long")
        var lat_ = document.getElementById("lat")
        lat_.value = response.results[0].geometry.location.lat
        long_.value = response.results[0].geometry.location.lng

        lat.current.value = response.results[0].geometry.location.lat
        long.current.value = response.results[0].geometry.location.lng
      })
      .catch((error) => {
        alertDispatch({ type: 'LOAD_CONTENT', payload: { content: dataLang.formatMessage({ id: "alert_30" }), show: 'block' } })
        // console.log(error);
      });

  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (state) {
      // console.log(ProjectAddid.current.value, name.current.value, company.current.value, info.current.value, long.current.value, lat.current.value)
      axios.post(host.DEVICE + "/createlistProject", { user: props.username, projectid: ProjectAddid.current.value, name: name.current.value, company: company.current.value, addr: info.current.value, lat: lat.current.value, lng: long.current.value }, { secure: true, reconnect: true }).then(
        function (res) {
          // console.log(res.data)
          if (res.data.status) {
            editProject.value = false
            alertDispatch({ type: 'LOAD_CONTENT', payload: { content: dataLang.formatMessage({ id: "alert_37" }), show: 'block' } })
          } else {
            if (res.data.number === 1) {
              alertDispatch({ type: 'LOAD_CONTENT', payload: { content: dataLang.formatMessage({ id: "alert_38" }), show: 'block' } })
            } else {
              alertDispatch({ type: 'LOAD_CONTENT', payload: { content: dataLang.formatMessage({ id: "alert_3" }), show: 'block' } })
            }
          }
        })
    } else {
      // console.log(ProjectAddid.current.value, bu.current.value)
      axios.post(host.DEVICE + "/addlistProject", { username: props.username, projectid: ProjectAddid.current.value, code: bu.current.value }, { secure: true, reconnect: true }).then(
        function (res) {
          // console.log(res.data)
          if (res.data.status) {
            alertDispatch({ type: 'LOAD_CONTENT', payload: { content: dataLang.formatMessage({ id: "alert_43" }), show: 'block' } })
          } else {
            if (res.data.number === 1) {
              alertDispatch({ type: 'LOAD_CONTENT', payload: { content: dataLang.formatMessage({ id: "alert_45" }), show: 'block' } })
            } else if (res.data.number === 2) {
              alertDispatch({ type: 'LOAD_CONTENT', payload: { content: dataLang.formatMessage({ id: "alert_44" }), show: 'block' } })
            } else {
              alertDispatch({ type: 'LOAD_CONTENT', payload: { content: dataLang.formatMessage({ id: "alert_3" }), show: 'block' } })
            }
          }
        })

    }


  };

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

  // Handle close when press ESC
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        editProject.value = false
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="DAT_ProjectAdd">
      <form className="DAT_ProjectAdd_Form" onSubmit={(e) => handleSubmit(e)}>
        <div className="DAT_ProjectAdd_Form_Head">
          <div className="DAT_ProjectAdd_Form_Head_Left">
            <p>Thêm dự án</p>
          </div>

          <div className="DAT_ProjectAdd_Form_Head_Right">
            <div className="DAT_ProjectAdd_Form_Head_Right_Icon">
              <div
                id="Popup"
                onMouseEnter={(e) => handlePopup("new")}
                onMouseLeave={(e) => handlePopup("pre")}
                onClick={() => editProject.value = false}
              >
                <IoClose size={25} />
              </div>
            </div>
          </div>
        </div>

        <div className="DAT_ProjectAdd_Form_Body">
          <div className="DAT_ProjectAdd_Form_Body_Left">
            <div className="DAT_ProjectAdd_Form_Body_Left_Row" >
              <label style={{ color: "red" }}>* </label>
              &nbsp;
              <label> Mã dự án</label>
              <div className="DAT_ProjectAdd_Form_Body_Left_Row_Item">
                <div className="DAT_ProjectAdd_Form_Body_Left_Row_Item_Input">
                  <input type="text" ref={ProjectAddid} required />
                </div>
              </div>

              {(state)
                ?
                <>
                  <div className="DAT_ProjectAdd_Form_Body_Left_Row">
                    <label style={{ color: "red" }}>* </label>
                    &nbsp;
                    <label> Tên dự án</label>
                    <div className="DAT_ProjectAdd_Form_Body_Left_Row_Item">
                      <div className="DAT_ProjectAdd_Form_Body_Left_Row_Item_Input">
                        <input type="text" ref={name} required />
                      </div>
                    </div>

                    <label style={{ color: "red" }}>* </label>
                    &nbsp;
                    <label> Công ty</label>
                    <div className="DAT_ProjectAdd_Form_Body_Left_Row_Item">
                      <div className="DAT_ProjectAdd_Form_Body_Left_Row_Item_Input">
                        <input type="text" ref={company} required />
                      </div>
                    </div>
                  </div>

                  <div className="DAT_ProjectAdd_Form_Body_Left_Row">
                    <label style={{ color: "red" }}>* </label>
                    &nbsp;
                    <label>
                      Vị trí
                    </label>
                    <div className="DAT_ProjectAdd_Form_Body_Left_Row_Item">
                      <div className="DAT_ProjectAdd_Form_Body_Left_Row_Item_Input">
                        <input type="text" ref={info} required />
                      </div>
                    </div>
                  </div>

                  <div className="DAT_ProjectAdd_Form_Body_Left_Row">
                    <label>
                      Vĩ độ
                    </label>
                    <div className="DAT_ProjectAdd_Form_Body_Left_Row_Item">
                      <div className="DAT_ProjectAdd_Form_Body_Left_Row_Item_Input">
                        <input type="text" id="lat" ref={lat} onClick={(e) => handleInput(e)} required />
                      </div>
                    </div>

                    <label>
                      Kinh độ
                    </label>
                    <div className="DAT_ProjectAdd_Form_Body_Left_Row_Item">
                      <div className="DAT_ProjectAdd_Form_Body_Left_Row_Item_Input">
                        <input type="text" id="long" ref={long} onClick={(e) => handleInput(e)} required />
                      </div>
                    </div>
                  </div>
                </>
                :
                <div className="DAT_ProjectAdd_Form_Body_Left_Row">
                  <label>
                    Mã BU
                  </label>
                  <div className="DAT_ProjectAdd_Form_Body_Left_Row_Item">
                    <div className="DAT_ProjectAdd_Form_Body_Left_Row_Item_Input">
                      <select ref={bu}>
                        {BU.map((data, index) => {
                          return (
                            <option key={index} value={data}>
                              {data}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
        <div className="DAT_ProjectAdd_Form_Foot">
          <button className="DAT_ProjectAdd_Form_Foot_Button" >
            Xác nhận
          </button>
        </div>
      </form>

    </div>

  );
}
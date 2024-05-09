import React from "react";
import "./Raisebox.scss";
import { IoClose } from "react-icons/io5";
// import { delstate } from "../User/Listuser";
import { signal } from "@preact/signals-react";

export const delstate = signal(false);

export default function Raisebox(props) {
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

    return (
        <div className="DAT_Raisebox">
            <div className="DAT_Raisebox_Box">
                <div className="DAT_Raisebox_Box_Title">
                    <div className="DAT_Raisebox_Box_Title_Text">Xóa</div>
                    <div className="DAT_Raisebox_Box_Title_Close"
                        id="Popup"
                        onMouseEnter={(e) => handlePopup("new")}
                        onMouseLeave={(e) => handlePopup("pre")}
                        onClick={() => { delstate.value = false }}
                    >
                        <IoClose size={25} />
                    </div>
                </div>

                <div className="DAT_Raisebox_Box_Content">Bạn có chắc muốn xóa ?</div>

                <div className="DAT_Raisebox_Box_Button">
                    <div className="DAT_Raisebox_Box_Button_Confirm"
                        onClick={() => {
                            delstate.value = false;
                            props.handleDelete();
                        }}
                    >
                        Xác nhận
                    </div>
                </div>
            </div>
        </div>
    );
}

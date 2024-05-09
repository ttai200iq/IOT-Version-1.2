import React, { useRef } from "react";
import "./Account.scss"

export default function Language() {
    const language = useRef("");

    const handleLanguage = () => {
        // console.log("language:", language.current.value);
    };

    return (
        <div className="DAT_Language">
            <div className="DAT_Language_Main">
                {/* Content */}
                <div className="DAT_Language_Main_Content">
                    {/* Profile Detail */}
                    <div className="DAT_Language_Main_Content_Detail">
                        <div className="DAT_Language_Main_Content_Detail_Title">
                            Ngôn Ngữ
                        </div>

                        <div className="DAT_Language_Main_Content_Detail_Content">
                            <div className="DAT_Language_Main_Content_Detail_Content_Form">
                                <div className="DAT_Language_Main_Content_Detail_Content_Form_Row">
                                    <div className="DAT_Language_Main_Content_Detail_Content_Form_Row_Item">
                                        <div className="DAT_Language_Main_Content_Detail_Content_Form_Row_Item_Label"> Chọn Ngôn Ngữ</div>
                                        <select onChange={() => handleLanguage()} ref={language}>
                                            <option value="Vietnamese">Vietnamese</option>
                                            <option value="English">English</option>
                                            <option value="Chinese">Chinese</option>
                                        </select>
                                    </div>
                                </div>

                                <button className="DAT_Language_Main_Content_Detail_Content_Form_Button">
                                    Lưu thay đổi
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
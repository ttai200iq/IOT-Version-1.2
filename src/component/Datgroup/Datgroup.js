import React, { useState } from "react";
import "./Datgroup.scss"
import { Link } from "react-router-dom";

export default function Datgroup() {
    const banner = "linear-gradient(140deg, #0061f2, #6900c7)"
    const icon = <ion-icon name="grid-outline"></ion-icon>
    const inf = { code: 'Datgroup', tit: 'DAT Group' }
    const [direct, SetDirect] = useState([{ id: 'home', text: 'Trang Chủ' }, { id: 'list', text: inf.tit }])
    return (
        <>
            <div className="DAT_viewTop" style={{ backgroundImage: banner, backgroundPosition: "bottom", backgroundRepeat: "no-repeat", backgroundSize: "cover" }}>
                {/* <div className="DAT_viewTop-shadow" ></div> */}
                <div className="DAT_viewTop-direct" >
                    {direct.map((data, index) => {
                        return (
                            (index === 0)
                                ? <Link key={index} to="/" style={{ textDecoration: 'none', color: "white" }}>
                                    <span style={{ cursor: "pointer" }}> {data.text}</span>
                                </Link>
                                : <span key={index} id={data.id + "_DIR"} style={{ cursor: "pointer" }}> {' > ' + data.text}</span>

                        )
                    })}
                </div>
                <div className="DAT_viewTop-tit">
                    <div className="DAT_viewTop-tit-icon">
                        {icon}
                    </div>
                    <div className="DAT_viewTop-tit-content" >DAT Group</div>
                </div>
            </div>
            <div className="DAT_viewContent">

            </div>

        </>
    )
}
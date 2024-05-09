/* eslint no-eval: 0 */
/* eslint no-unused-vars: "off"*/
import React, { useEffect, useState } from "react"
import "./Tooloverview.scss";





export default function Solview(props) {
    const [data, setData] = useState(props.data)
    const [setting, setSetting] = useState(props.setting)


    useEffect(function () {
        setData(props.data)
    }, [props.data])

    useEffect(function () {
        setSetting(props.setting)
    }, [props.setting])


    const handlegetnum = (numstring) => {
        try {
            var x = eval(numstring)
            return parseFloat(x).toFixed(2);
        } catch (e) {
            return 0;
        }
    }





    return (
        <div className="DAT_solarlight"  >
            <div className="DAT_solarlight_containner">
                <div className="DAT_solarlight_containner-content">{setting.name}</div>
                <div className="DAT_solarlight_containner-content">
                    Kết nối:
                    {(setting.data[parseInt(handlegetnum(setting.status))] !== undefined)
                        ? <div  style={{ color: setting.data[parseInt(handlegetnum(setting.status))].color, textAlign: "left", fontWeight: "500", fontSize: "18" }}>{setting.data[parseInt(handlegetnum(setting.status))].text}</div>
                        : <div  style={{ color: 'yellow', textAlign: "left", fontWeight: "500", fontSize: "18" }}> ERR</div>
                    }

                </div>
                <div className="DAT_solarlight_containner-content">Điện áp battery: {handlegetnum(setting.vol)} V</div>
                <div className="DAT_solarlight_containner-content">
                    Chế độ hoạt động:
                    {(setting.data2[parseInt(handlegetnum(setting.status2))] !== undefined)
                        ? <div  style={{ color: setting.data2[parseInt(handlegetnum(setting.status2))].color, textAlign: "left", fontWeight: "500", fontSize: "18" }}>{setting.data2[parseInt(handlegetnum(setting.status2))].text}</div>
                        : <div  style={{ color: 'yellow', textAlign: "left", fontWeight: "500", fontSize: "18" }}> ERR</div>
                    }

                </div>

            </div>
        </div>
    )
}
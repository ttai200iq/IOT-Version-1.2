/* eslint no-eval: 0 */
/* eslint  no-unused-vars: 0 */
import React, { useEffect, useState } from "react"
import "./Tooloverview.scss";





export default function Autoview(props) {
    const [data, setData] = useState(props.data)
    const [setting, setSetting] = useState(props.setting)


    useEffect(function () {
        setData(props.data)
    }, [props.data])

    useEffect(function () {
        setSetting(props.setting)
    }, [props.setting])


    const handlegetnum = (numstring,where) => {
        try {
            var x 
            switch (setting[where]) {
                case '10':
                    x = parseFloat(eval(numstring)).toFixed(1);
                    break;
                case '16':
                    var n = eval(numstring)
                    if (n < 0) {
                        n = 0xFFFFFFFF + n + 1;
                       } 
                    x = parseInt(n, 10).toString(16);
                    break
                default:
                    var b =  setting.base.split("_")
                    const numberToConvert = eval(numstring);
                    const numberOfBits = 16; // 32-bits binary
                    const arrBitwise = [0]; // save the resulting bitwise
            
                    for (let i = 0; i < numberOfBits; i++) {
                        let mask = 1;
            
                        const bit = numberToConvert & (mask << i); // And bitwise with left shift
            
                        if (bit === 0) {
                            arrBitwise[i] = 0;
                        } else {
                            arrBitwise[i] = 1;
                        }
                    }
            
                    const binary = arrBitwise.reverse().join("");
                    
                    x = binary[15 - b[1]]
                    //console.log(binary,x)
                    break;

            }


            

            return x
        } catch (e) {
            return 0;
        }
    }




    return (
        <div className="DAT_auto"  >
            <div className="DAT_auto_img"></div>
            <div className="DAT_auto_containner">
                <div className="DAT_auto_containner-content">{setting.name}</div>
                <div className="DAT_auto_containner-content">
                    Kết nối:
                    {(setting.data[parseInt(handlegetnum(setting.status,'statusbase'))] !== undefined)
                        ? <div  style={{ color: setting.data[parseInt(handlegetnum(setting.status,'statusbase'))].color, textAlign: "left", fontWeight: "500", fontSize: "18" }}>{setting.data[parseInt(handlegetnum(setting.status,'statusbase'))].text}</div>
                        : <div  style={{ color: 'yellow', textAlign: "left", fontWeight: "500", fontSize: "18" }}> ERR</div>
                    }

                </div>
                <div className="DAT_auto_containner-content">Áp suất hồi tiếp: {handlegetnum(setting.data1,'data1base')}</div>
                <div className="DAT_auto_containner-content">Góc mở van: {handlegetnum(setting.data2,'data2base')}</div>
               

            </div>
        </div>
    )
}
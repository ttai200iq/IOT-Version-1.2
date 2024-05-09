import React, { useEffect, useReducer} from "react";
import { useContext } from "react";
import { AlertContext } from "../Context/AlertContext";
import "./Alert.scss";
import {action} from "./Action" 


export default function Alert(props){
    const {content,show,alertDispatch} = useContext(AlertContext)
    const intervalIDRef = useReducer(null);
    // const getId =(e)=>{
    //     alertDispatch(action('HIDE_CONTENT',{show:'none'})) 
    // }

    useEffect(()=>{
            //console.log(show)
            var i = 0
            var startTimer = () => {
                
                intervalIDRef.current = setInterval(async () => {
                        i +=1
                        if(i === 1){
                            alertDispatch(action('HIDE_CONTENT',{show:'none'})) 
                        }
                }, 1000);
            };
            var stopTimer = () => {
                clearInterval(intervalIDRef.current);
                intervalIDRef.current = null;
            };
        
            if (show === 'block') {
                
                startTimer();
            }else{
                stopTimer()
            }
          
            return () => {
    
                clearInterval(intervalIDRef.current);
                intervalIDRef.current = null;
    
            }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[show])

    return(
        <div className="DAT_Alert" style={{display:show}}>
                <div className="DAT_Alert_Content">
                    <label >{content}</label>
                </div>
        </div>
    )
}
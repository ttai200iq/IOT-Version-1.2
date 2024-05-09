import { createContext, useReducer } from "react";
//import Logger from "../Logger";
import AlertReducer,{INITIAL_STATE} from "./AlertReducer";

export const AlertContext = createContext(INITIAL_STATE);


export const AlertContextProvider =({children})=>{
    const [state, alertDispatch] = useReducer(AlertReducer, INITIAL_STATE);

    return (
        <AlertContext.Provider value = {{
                content: state.content,
                show: state.show,
                alertDispatch
            }}
        >
            {children}
        </AlertContext.Provider>
    )

}
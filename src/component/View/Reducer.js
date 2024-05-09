export const INITSTATE ={
    sensor: [], 
    otaver:""  
};



 const Reducer =(state,action)=>{

    switch(action.type){
        case 'LOAD_DEVICE':
                    return{   
                        ...state,    
                        sensor: action.payload.sensor,
                        otaver: action.payload.otaver,
                    }       
        case 'LOAD_DEVICE_FB':
                        return{   
                            ...state,    
                            sensor: [...state.sensor,action.payload.sensor]
                        }
        case 'ADD_DEVICE':
                    return{   
                        ...state,    
                        sensor: [...state.sensor,action.payload] //keep old array and push a new array
                    }
         case 'REMOVE_DEVICE':

                    var newsensor = [...state.sensor] //coppy old array
                    newsensor =  newsensor.filter(newsensor => newsensor.data.sensorid !== action.payload) //delete 1 item by id
                    return{   
                        ...state,    
                        sensor:newsensor
                    }
        default:
                    throw new Error('invalid type');
        }
    
}


export default Reducer
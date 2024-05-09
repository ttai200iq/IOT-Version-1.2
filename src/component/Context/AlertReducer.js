
const INITIAL_STATE ={
    content: '',
    show:'none',
};

const SettingReducer = (state,action) =>{

    switch(action.type){

                case "LOAD_CONTENT":
                    return{
                        ...state,
                        content: action.payload.content,
                        show: action.payload.show

                    };

                case "HIDE_CONTENT":
                        return{
                            ...state,
                            show: action.payload.show
                        };

                    
            default:
                throw new Error('Invalid action');  
    }


}

export  {INITIAL_STATE}
export default SettingReducer;
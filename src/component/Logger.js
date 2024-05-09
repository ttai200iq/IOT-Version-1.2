function Logger(Reducer) {
    return (prevState, action) => {
        console.group(action.type);
        //console.log('Prev state:', prevState);
        //console.log('Action: ',action);
        const newState = Reducer(prevState, action);
        // console.log('state',newState);
        console.groupEnd();
        return newState;

    }

}

export default Logger;
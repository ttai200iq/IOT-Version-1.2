import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';

function useAxios(url, method, payload) {
    const [data, setData] = useState(null);
    const [error, setError] = useState("");
    const [loaded, setLoaded] = useState(false);


    useEffect(() => {
        (async () => {
            try {
                const response = await axios.request({
                    data: payload,
                    method,
                    url,
                });

                setData(response.data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoaded(true);
            }
        })();
    }, []);

    return { data, error, loaded };
}

export default useAxios;
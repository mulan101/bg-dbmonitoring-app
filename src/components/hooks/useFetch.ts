import { useEffect, useState } from "react";

export function useFetchList(url: string) {

    const [data, setData] = useState([]);

    useEffect(() => {
        fetch(url)
            .then(res => {
                return res.json()
            })
            .then(data => {
                setData(data)
            });
    }, [url]);

    return data
}

export function useFetch(url: string, key: string) {
    const [data, setData] = useState(Object);
    useEffect(() => {
        if(key) {
            fetch(url)
                .then(res => {
                    return res.json()
                })
                .then(data => {
                    setData(data)
                });
        }
    }, [url, key]);

    return data
}

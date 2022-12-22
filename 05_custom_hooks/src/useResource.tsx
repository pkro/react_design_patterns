import {useEffect, useState} from "react";
import {userType} from "./UserInfo";
import axios from "axios";

export const useResource = (resourceUrl: string) => {
    const [data, setData] = useState<userType | undefined>(undefined);
    useEffect(()=>{
        (async ()=>{
            const response = await axios.get(resourceUrl);
            setData(response.data);
        })();
    }, []);

    return data;
}

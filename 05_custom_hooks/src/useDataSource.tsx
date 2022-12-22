import {useEffect, useState} from "react";
import {userType} from "./UserInfo";
import axios from "axios";

export const useDataSource = (getResource: () => any) => {
    const [data, setData] = useState<userType | undefined>(undefined);
    useEffect(() => {
        (async () => {
            const result = await getResource();
            setData(result);
        })();
    }, [getResource]);

    return data;
};

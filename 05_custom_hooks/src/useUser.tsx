import {useEffect, useState} from "react";
import {userType} from "./UserInfo";
import axios from "axios";

export const useUser = (userId: number | string) => {
    const [user, setUser] = useState<userType | undefined>(undefined);
    useEffect(()=>{
        (async ()=>{
            const response = await axios.get(`/users/${userId}`);
            setUser(response.data);
        })();
    }, []);

    return user;
}

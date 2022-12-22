import {useEffect, useState} from "react";
import {userType} from "./UserInfo";
import axios from "axios";

export const useCurrentUser = () => {
    const [user, setUser] = useState<userType | null>(null);
    useEffect(()=>{
        (async ()=>{
            const response = await axios.get(`/current-user}`)
            setUser(response.data);
        })();
    }, []);

    return user;
}

import React, {ReactNode, useEffect, useState} from "react";
import {UserInfoProps, userType} from "./UserInfo";
import axios from "axios";

export const withUser = (Component: React.ComponentType<UserInfoProps>, userId: string | number) => {
    return (props: UserInfoProps) => {
        const [user, setUser] = useState<userType | null>(null);
        useEffect(()=>{
            (async ()=>{
                const response = await axios.get(`/users/${userId}`)
                setUser(response.data);
            })();
        }, [])

        return <>{user && <Component {...props} user={user} />}</>
    }
}

import React, {useEffect, useState} from "react";
import {UserInfoProps, userType} from "./UserInfo";
import axios from "axios";

export const withEditableUser = (Component: React.ComponentType<any>, userId: string | number) => {
    return (props: any) => {
        const [originalUser, setOriginalUser] = useState<userType | null>(null);
        const [user, setUser] = useState<userType | null>(null);

        useEffect(() => {
            (async () => {
                const response = await axios.get(`/users/${userId}`);
                setOriginalUser(response.data);
                setUser(response.data);
            })();
        }, []);

        const onChangeUser = (changes: Partial<userType>) => {
            if (user) {
                setUser({
                    ...user,
                    ...changes
                });
            }
        };

        const onSaveUser = async () => {
            const response = await axios.post(`/users/${userId}`, {user});
            setOriginalUser(response.data);
            setUser(response.data);
        };

        const onResetUser = () => setUser(originalUser);

        return <>{originalUser && <Component
            {...props}
            user={user}
            onSaveUser={onSaveUser}
            onChangeUser={onChangeUser}
            onResetUser={onResetUser}
        />}</>;
    };
};

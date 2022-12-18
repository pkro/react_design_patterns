import React, {ReactNode, useEffect, useState} from 'react';
import {userType} from "./UserInfo";
import axios from "axios";

export type ChildrenPropsType = {
    user: userType | null;
}

type UserLoaderPropsType = {
    children: ReactNode;
    userId: string;
};

export const UserLoader = ({userId, children}: UserLoaderPropsType) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                const response = await axios.get(`http://localhost:8080/users/${userId}`);
                const currentUser = response.data;
                setUser(currentUser);
            } catch (e) {
                console.log(e);
            }
        })();
    }, [userId]);

    return (<>
        {React.Children.map(children, child => {
            if (React.isValidElement(child)) {
                return React.cloneElement(child as React.ReactElement<ChildrenPropsType>, {user});
                // or just return React.cloneElement(child as React.ReactElement<any>, {user});
            }
            return child;
        })}
    </>);
};

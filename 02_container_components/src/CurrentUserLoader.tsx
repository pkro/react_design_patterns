import React, {ReactNode, useEffect, useState} from 'react';
import {userType} from "./UserInfo";
import axios from "axios";

export type ChildrenPropsType = {
    user: userType | null;
}

type CurrentUserLoaderPropsType = {
    children: ReactNode;
};

export const CurrentUserLoader = ({children}: CurrentUserLoaderPropsType) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                const response = await axios.get('http://localhost:8080/current-user');
                const currentUser = response.data;
                console.log(currentUser);
                setUser(currentUser);
            } catch (e) {
                console.log(e);
            }
        })();
    }, []);
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

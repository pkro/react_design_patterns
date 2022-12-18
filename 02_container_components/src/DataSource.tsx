import React, {ReactNode, useEffect, useState} from 'react';
import {userType} from "./UserInfo";
import axios from "axios";

export type ChildrenPropsType = unknown;

type ResourceLoaderPropsType = {
    children: ReactNode;
    getDataFunction: () => any
    resourceName: string;
};

export const DataSource = ({getDataFunction, resourceName, children}: ResourceLoaderPropsType) => {
    const [state, setState] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                const data = await getDataFunction();
                setState(data);
            } catch (e) {
                console.log(e);
            }
        })();
    }, [getDataFunction]);
    return (<>
        {React.Children.map(children, child => {
            if (React.isValidElement(child)) {
                return React.cloneElement(child as React.ReactElement<ChildrenPropsType>, {[resourceName]: state});
            }
            return child;
        })}
    </>);
};

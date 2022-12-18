import React, {ReactNode, useEffect, useState} from 'react';
import {userType} from "./UserInfo";
import axios from "axios";

export type ChildrenPropsType = unknown;

type ResourceLoaderPropsType = {
    children: ReactNode;
    resourceUrl: string;
    resourceName: string;
};

export const ResourceLoader = ({resourceUrl, resourceName, children}: ResourceLoaderPropsType) => {
    const [state, setState] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                const response = await axios.get(resourceUrl);
                setState(response.data);
            } catch (e) {
                console.log(e);
            }
        })();
    }, [resourceUrl]);
    return (<>
        {React.Children.map(children, child => {
            if (React.isValidElement(child)) {
                return React.cloneElement(child as React.ReactElement<ChildrenPropsType>, {[resourceName]: state});
            }
            return child;
        })}
    </>);
};

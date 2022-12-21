import React, {useEffect, useState} from "react";
import {UserInfoProps, userType} from "./UserInfo";
import axios from "axios";

export const withEditableResource = (Component: React.ComponentType<any>, resourcePath: string, resourceName: string) => {
    return (props: any) => {
        const [originalData, setOriginalData] = useState<object | null>(null);
        const [data, setData] = useState<object | null>(null);

        useEffect(() => {
            (async () => {
                const response = await axios.get(resourcePath);
                setOriginalData(response.data);
                setData(response.data);
            })();
        }, []);

        const onChange = (changes: object) => {
            if (data) {
                setData({
                    ...data,
                    ...changes
                });
            }
        };

        const onSave = async () => {
            const response = await axios.post(resourcePath, {[resourceName]: data});
            setOriginalData(response.data);
            setData(response.data);
        };

        const onReset = () => setData(originalData);

        // instead of making it necessary for the components that need to be wrapped
        // to use generic prop names ("data", "onSave" etc.) we want them to be able
        // to use their own props such as "user", "onSaveUser" etc.
        // that will also allow to wrap a component that has multiple editable resources
        // such as user and product in multiple HOCS, e.g.
        // withEditableResource(withEditableResource(UserAndProductForm, "/user/123", "user"), "/product/345", "product");

        // this still needs the components follow the pattern "onSave"+resourceName etc.
        const resourceProps = {
            [resourceName]: data,
            [`onSave${resourceName[0].toUpperCase() + resourceName.slice(1)}`]: onSave,
            [`onChange${resourceName[0].toUpperCase() + resourceName.slice(1)}`]: onChange,
            [`onReset${resourceName[0].toUpperCase() + resourceName.slice(1)}`]: onReset,
        }
        return <>{originalData && <Component
            {...props}
            {...resourceProps}
        />}</>;
    };
};

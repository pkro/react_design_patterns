import React from "react";

export const printProps = (WrappedComponent: React.ComponentType) => {
    return (props: any) => {
        console.log(props);
        return <WrappedComponent {...props} />
    }
}

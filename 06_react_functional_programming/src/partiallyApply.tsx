import React from 'react';

type PartiallyApplyPropsType = {
    Component: React.ComponentType<any>,
    partialProps: any
};

export const partiallyApply = (Component: React.ComponentType<any>, partialProps: object) => {
    return (props: any) => {
        return <Component {...partialProps} {...props} />
    }
};

export const Button = ({size, color, text, ...props}: {size: string, color: string, text: string}) => {
    return (
        <button style={{
            padding: size === 'large' ? 32 : 8,
            fontSize: size === 'large' ? 32 : 16,
            backgroundColor: color
        }}
                {...props}>
            {text}
        </button>
    );
};

export const DangerButton = partiallyApply(Button, {color: 'red'});
export const BigSuccessButton = partiallyApply(Button, {color: 'green', size: 'large'});

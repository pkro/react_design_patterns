import React from 'react';

export type ChildrenPropsType = {
    onNext: (stepData: object)=>void;
}

type ControlledOnboardingFlowPropsType = {
    children: React.ReactNode;
    currentIndex: number;
    onNext: (stepData: object)=>void;
    onFinish: (data: unknown) => void;
};

export const ControlledOnboardingFlow = ({ onFinish, currentIndex, onNext, children }: ControlledOnboardingFlowPropsType) => {
    // this allows us to sequentially step through the children provided by the parent component
    const childComponents = React.Children.toArray(children);
    const currentChild = childComponents[currentIndex];

    if (React.isValidElement(currentChild)) {
        return React.cloneElement(currentChild as React.ReactElement<ChildrenPropsType>, {onNext});
    }
    return <></>;
};

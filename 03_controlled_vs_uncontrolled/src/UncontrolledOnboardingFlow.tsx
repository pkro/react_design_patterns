import React, {useState} from 'react';

export type ChildrenPropsType = {
    goToNext: (stepData: Object)=>void;
}

type UncontrolledOnboardingFlowPropsType = {
    children: React.ReactNode;
    onFinish: (data: unknown) => void;
};

export const UncontrolledOnboardingFlow = ({ onFinish, children }: UncontrolledOnboardingFlowPropsType) => {
    const [onBoardingData, setOnboardingData] = useState({});
    const [currentIndex, setCurrentIndex] = useState(0);

    // this allows us to sequentially step through the children provided by the parent component
    const childComponents = React.Children.toArray(children);
    const currentChild = childComponents[currentIndex];

    const goToNext = (stepData: Object) => {
        const nextIndex = currentIndex+1;
        const updatedData = {
            ...onBoardingData,
            ...stepData
        };

        if(nextIndex < childComponents.length) {
            setCurrentIndex(nextIndex);
        } else {
            onFinish(updatedData);
        }

        setOnboardingData(updatedData);

    };

    if (React.isValidElement(currentChild)) {
        return React.cloneElement(currentChild as React.ReactElement<ChildrenPropsType>, {goToNext});
    }
    return <></>;
};

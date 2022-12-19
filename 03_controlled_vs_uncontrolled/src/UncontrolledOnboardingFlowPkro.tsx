import React, {useState} from 'react';

type UncontrolledOnboardingFlowPropsType = {
    children: React.ReactNode;
    onFinish: () => void;
};

export const UncontrolledOnboardingFlowPkro = ({onFinish, children}: UncontrolledOnboardingFlowPropsType) => {
    const [onBoardingData, setOnboardingData] = useState({});
    const [currentIndex, setCurrentIndex] = useState(0);

    // this allows us to sequentially step through the children provided by the parent component
    const childComponents = React.Children.toArray(children);
    const currentChild = childComponents[currentIndex];

    const hasPrevious = currentIndex > 0;
    const hasNext = currentIndex < childComponents.length-1;

    return (<>
        {currentChild}
        {hasPrevious && <button onClick={()=>setCurrentIndex(currentIndex-1)}>Previous</button>}
        {hasNext && <button onClick={()=>setCurrentIndex(currentIndex+1)}>Next</button>}
        {!hasNext && <button onClick={()=>onFinish()}>Send</button>}
    </>);
};

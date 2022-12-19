import {useRef, useState} from "react";
import {ControlledOnboardingFlow} from "./ControlledOnboardingFlow";

const Step1 = ({onNext}: { onNext?: (stepData: Object) => void }) => {
    const ref = useRef<HTMLInputElement>(null);
    return (<>
        <h1>Step 1</h1>
        <input type={'text'} placeholder={'name'} ref={ref}/>
        <button onClick={() => onNext!({name: ref.current?.value})}>Next</button>
    </>);
};

const Step2 = ({onNext}: { onNext?: (stepData: Object) => void }) => {
    const ref = useRef<HTMLInputElement>(null);

    return (<>
        <h1>Step 2</h1>
        <input type={'text'} placeholder={'age'} ref={ref}/>
        <button onClick={() => onNext!({age: ref.current?.value})}>Next</button>
    </>);
};

const Step3 = ({onNext}: { onNext?: (stepData: Object) => void }) => {
    const ref = useRef<HTMLInputElement>(null);

    return (<>
        <h1>Step 3</h1>
        <input type={'text'} placeholder={'hair color'} ref={ref}/>
        <button onClick={() => onNext!({hairColor: ref.current?.value})}>Next</button>
    </>);
};

const DiscountMessage = ({onNext}: { onNext?: (stepData: Object) => void }) => {
    return (<>
        <h1>You qualify for senior discount!</h1>
        <button onClick={() => onNext!({})}>Next</button>
    </>);
};

function App() {
    const [onBoardingData, setOnboardingData] = useState({});
    const [currentIndex, setCurrentIndex] = useState(0);

    const onNext = (stepData: Object) => {
        setOnboardingData({
            ...onBoardingData,
            ...stepData
        });
        setCurrentIndex(currentIndex + 1);
    };

    return (
        <>
            <ControlledOnboardingFlow
                currentIndex={currentIndex}
                onNext={onNext}
                onFinish={(cdata: unknown) => {
                    console.log(cdata);
                    window.alert('onboarding complete');
                }}>
                <Step1/>
                <Step2/>
                {(onBoardingData as {} & { age: number }).age! > 65 && <DiscountMessage/>}
                <Step3/>
            </ControlledOnboardingFlow>
        </>
    );
}

export default App;

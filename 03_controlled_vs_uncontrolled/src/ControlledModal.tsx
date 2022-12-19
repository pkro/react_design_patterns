import {useState} from 'react';
import styled from "styled-components";

type ModalPropsType = {
    shouldShow: boolean;
    setShouldShow: (b: boolean) => void;
    children: React.ReactNode;
};

export const ControlledModal = ({shouldShow, setShouldShow, children}: ModalPropsType) => {
    const ModalBackground = styled.div`
    position: fixed;
    z-index: 1;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgba(0, 0, 0, 0.5);
    `;

    const ModalBody = styled.div`
    background-color: white;
    margin: 10% auto;
    padding: 20px;
    width: 50%;
    `;

    return (<>
        {shouldShow &&
            <ModalBackground onClick={() => setShouldShow(false)}>
                <ModalBody onClick={e => e.stopPropagation()}>
                    <button type={'button'} onClick={() => setShouldShow(false)}>hide</button>
                    {children}
                </ModalBody>
            </ModalBackground>}
    </>);
};

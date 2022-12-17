import React, {useState} from 'react';
import styled from "styled-components";

type ModalPropsType = { children: React.ReactNode };

export const Modal = ({children}: ModalPropsType) => {

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
    const [shouldShow, setShouldShow] = useState(false);
    return (<>
        <button type={'button'} onClick={() => setShouldShow(true)}>show</button>
        {shouldShow &&
            <ModalBackground onClick={() => setShouldShow(false)}>
                <ModalBody onClick={e => e.stopPropagation()}>
                    <button type={'button'} onClick={() => setShouldShow(false)}>hide</button>
                    {children}
                </ModalBody>
            </ModalBackground>}
    </>);
};

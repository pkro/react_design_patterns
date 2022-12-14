import React from "react";
import styled from 'styled-components';

const Container = styled.div`
    display: flex;
`;

const Pane = styled.div<{ weight: number }>`
    flex: ${props => props.weight};
`;

export const SplitScreen = ({
                                children,
                                leftWeight = 1,
                                rightWeight = 1,
                            }: { children: [React.ReactNode, React.ReactNode], leftWeight?: number, rightWeight?: number }) => {
    const [left, right] = children;
    return (
        <Container>
            <Pane weight={leftWeight}>
                {left}
            </Pane>
            <Pane weight={rightWeight}>
                {right}
            </Pane>
        </Container>);
};

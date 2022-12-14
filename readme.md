# Follow along of the course by Shaun Wassel on linkedin learning

Code repo: https://github.com/LinkedInLearning/react-design-patterns-2895130.git

<!-- START doctoc -->
<!-- END doctoc -->

## Layout components

Components that deal primarily with arranging other components on the page, e.g. split screens, lists and items, modals.

### Split screen components

#### Passing jsx as props

Basic split screen component (use of `styled-components` is unrelated):

    export const SplitScreen = ({
                                    left: Left,
                                    right: Right,
                                }: { left: React.ElementType, right: React.ElementType }) => {
        return (
            <Container>
                <Pane>
                    <Left/>
                </Pane>
                <Pane>
                    <Right/>
                </Pane>
            </Container>);
    };

Usage:

    const LeftComponent = () => {
        return <p style={{background: 'green'}}>Left</p>
    }
    
    const RightComponent = () => {
        return <p style={{background: 'blue'}}>Right</p>
    }
    
    function App() {
      return (
        <div className="App">
          <SplitScreen left={LeftComponent} right={RightComponent} />
        </div>
      );
    }

Typescript Gotcha: only react components can be passed that way, e.g. `left={<div>Hi</div>}` wouldn't work.

Solution:

    //...
    export const SplitScreen = ({
                                    left: Left,
                                    right: Right,
                                }: { left: React.ReactNode, right: React.ReactNode }) => {
        return (
            <Container>
                <Pane>
                    {Left}
                </Pane>
                <Pane>
                    {Right}
                </Pane>
            </Container>);
    };

Usage:

    //...
    function App() {
      return (
        <div className="App">
          <SplitScreen left={<LeftComponent />} right={<RightComponent/>} />
        </div>
      );
    }

#### Passing jsx as `children`

To make it easier to pass props to the components passed to `SplitScreen`, we can pass them as children.

This example also illustrates `styled-components` with typed props and how to type the `children` prop, including how many elements it expects to be passed as children (here: 2):

SplitScreen.tsx:

    //...
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

Usage:

    <SplitScreen leftWeight={1} rightWeight={3}>
      <LeftComponent someprop={1}/>
      <RightComponent />
    </SplitScreen>

### Lists and items

## Container components

## Controlled and uncontrolled components

## Higher order components

## Custom hooks patterns

## Functional programming in react




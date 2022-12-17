# Follow along of the course by Shaun Wassel on linkedin learning

Code repo: https://github.com/LinkedInLearning/react-design-patterns-2895130.git

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**

- [Side notes](#side-notes)
  - [Converting the course files to typescript](#converting-the-course-files-to-typescript)
  - [Good replacement for `fc` live template in IntelliJ](#good-replacement-for-fc-live-template-in-intellij)
- [Layout components](#layout-components)
  - [Split screen components](#split-screen-components)
    - [Passing jsx as props](#passing-jsx-as-props)
    - [Passing jsx as `children`](#passing-jsx-as-children)
  - [Lists and items](#lists-and-items)
  - [Modal components](#modal-components)
- [Container components](#container-components)
- [Controlled and uncontrolled components](#controlled-and-uncontrolled-components)
- [Higher order components](#higher-order-components)
- [Custom hooks patterns](#custom-hooks-patterns)
- [Functional programming in react](#functional-programming-in-react)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Side notes

### Converting the course files to typescript

```bash
npm install --save typescript @types/node @types/react @types/react-dom @types/jest
npm i --save-dev @types/react@latest @types/react-dom@latest @types/styled-components
# if needed
npm i --save styled-components @types/styled-components
```

Also rename `App.js` and other existing JSX files to e.g. `App.tsx`.

### Good replacement for `fc` live template in IntelliJ

Settings -> Editor -> Live templates -> TSReact

```typescript jsx
import React from 'react';

type $FILE_NAME$PropsType = {

};

export const $FILE_NAME$ = ({}: $FILE_NAME$PropsType) => {
  
  return (<>$END$</>);
};
```


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

To display lists of different types of items, e.g. `SmallPersonListItem`, `LargePersonListItem`, `ProductListItem` etc. we would create components like `SmallPersonList`, `ProductList` etc.

To have only one component for the list, we can make a component that gets passed in all the necessary information to display a list of the passed items:

SmallPersonListItem.tsx (example of one of the many possible items)

    import React from 'react';
    import {people} from "../App";
    
    type SmallPersonListItemPropsType = { person: typeof people[0] };
    
    const SmallPersonListItem = ({person: {name, age, hairColor, hobbies}}: SmallPersonListItemPropsType) => {
    
        return (<p>{name}, {age} years old</p>);
    };
    
    export default SmallPersonListItem;

The generic list component `RegularList.tsx`:

    type RegularListPropsType = { 
        items: unknown[],
        itemPropName: string,
        itemComponent: React.ElementType };
    
    export const RegularList = ({
                             items,        // e.g. the people array defined in App.tsx
                             itemPropName, // e.g. "person" as that's the prop name in the *PersonListItem.tsx files
                             itemComponent: ItemComponent // e.g. SmallPersonListItem
                         }: RegularListPropsType) => {
    
        return (<>
            {items.map((item, i) => (
                <ItemComponent
                    /*index shouldn't be used, maybe better would be a property that is known to exist in all
                    * possible item lists, such as key={item.id} */
                    key={i}
                    /*when passing e.g. "person" as resourceName, this changes to "person={item}"*/
                    {...{[itemPropName]: item}}
                />
            ))}
        </>);
    };
    

Usage:

    <h1>Persons small</h1>
    <RegularList items={people} itemPropName={'person'} itemComponent={SmallPersonListItem}/>
    <h1>Persons large</h1>
    <RegularList items={products} itemPropName={'product'} itemComponent={LargeProductListItem}/>

### Modal components

Just a basic modal component without using portals:

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


## Container components

= Components that take care of loading and managing data for their child components. This makes components more reusable and testable as the data can be passed as props to the display components, so the display components don't need to know where the data comes from (dumb components).

## Controlled and uncontrolled components

## Higher order components

## Custom hooks patterns

## Functional programming in react




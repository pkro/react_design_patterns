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
  - [CurrentUserLoader](#currentuserloader)
  - [UserLoader](#userloader)
  - [ResourceLoader: generic loader for any type of resource](#resourceloader-generic-loader-for-any-type-of-resource)
  - [DataSource component](#datasource-component)
  - [Loading data from localStorage](#loading-data-from-localstorage)
- [Controlled and uncontrolled components](#controlled-and-uncontrolled-components)
  - [Side note: useRef vs createRef](#side-note-useref-vs-createref)
  - [Uncontrolled form example](#uncontrolled-form-example)
  - [Controlled form example](#controlled-form-example)
  - [Controlled modals](#controlled-modals)
  - [Uncontrolled onboarding flows](#uncontrolled-onboarding-flows)
  - [Controlled onboarding flow](#controlled-onboarding-flow)
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

Also rename `App.tsx` and other existing JSX files to e.g. `App.tsx`.

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

### CurrentUserLoader

Basic example of a container component that loads the current user and passes it to its child components (there is still a typescript problem: `user` in `UserInfo` must be defined as optional OR passed a dummy object in `App.tsx` because otherwise ts complains that a prop is missing in `App.tsx`):

UserInfo.tsx (presentational component that just shows user info):

    // ...
    type UserInfoProps = {
        user?: userType;
    }
    
    export function UserInfo ({ user }: UserInfoProps) {
        const { name, age, hairColor, hobbies } = user || {};
        console.log(user);
        return user ? (
            <>
            <h3>{name}</h3>
            { /* ... */ }
            </>
        ) : <p>Loading...</p>;
    }

CurrentUserLoader.tsx (container component that loads the user and passes it as a prop to its child components):

    export type ChildrenPropsType = {
        user: userType | null;
    }
    
    type CurrentUserLoaderPropsType = {
        children: ReactNode;
    };

    export const CurrentUserLoader = ({children}: CurrentUserLoaderPropsType) => {
        const [user, setUser] = useState(null);
    
        useEffect(() => {
            (async () => {
                try {
                    const response = await axios.get('http://localhost:8080/current-user');
                    const currentUser = response.data;
                    setUser(currentUser);
                } catch (e) {
                    console.log(e);
                }
            })();
        }, []);
        return (<>
            {React.Children.map(children, child => {
                if (React.isValidElement(child)) {
                    return React.cloneElement(child as React.ReactElement<ChildrenPropsType>, {user});
                    // or just return React.cloneElement(child as React.ReactElement<any>, {user});
                }
                return child;
            })}
        </>);
    };


Usage:

    <CurrentUserLoader>
        <UserInfo />
    </CurrentUserLoader>

### UserLoader

Generic user loader by id:

    // ...
    type UserLoaderPropsType = {
        children: ReactNode;
        userId: string;
    };
    
    export const UserLoader = ({userId, children}: UserLoaderPropsType) => {
        const [user, setUser] = useState(null);
    
        useEffect(() => {
            (async () => {
                try {
                    const response = await axios.get(`http://localhost:8080/users/${userId}`);
    // ...

Usage:

    <UserLoader userId={'1234'}>
        <UserInfo/>
    </UserLoader>

### ResourceLoader: generic loader for any type of resource

Load any resource with a generic loader; 
    
    export type ChildrenPropsType = unknown; // must be a better way
    
    type ResourceLoaderPropsType = {
        children: ReactNode;
        resourceUrl: string;
        resourceName: string;
    };
    
    export const ResourceLoader = ({resourceUrl, resourceName, children}: ResourceLoaderPropsType) => {
        const [state, setState] = useState(null);
    
        useEffect(() => {
            (async () => {
                try {
                    const response = await axios.get(resourceUrl);
                    setState(response.data);
                } catch (e) {
                    console.log(e);
                }
            })();
        }, [resourceUrl]);
        return (<>
            {React.Children.map(children, child => {
                if (React.isValidElement(child)) {
                    return React.cloneElement(child as React.ReactElement<ChildrenPropsType>, {[resourceName]: state});
                }
                return child;
            })}
        </>);
    };

Usage:

    <ResourceLoader resourceUrl={'/users/3456'} resourceName={'user'}>
        <UserInfo/>
    </ResourceLoader>
    <ResourceLoader resourceUrl={'/products/1234'} resourceName={'product'}>
        <ProductInfo/>
    </ResourceLoader>

The problem with this component is that the parent component has to know about resource urls etc.

### DataSource component

We can further abstract out the data loading part by passing a data loader function instead of an url. This way the knowledge about actual urls etc. can be extracted to its own api file.

DataSource.tsx:

    // ...
    export type ChildrenPropsType = unknown;
    
    type ResourceLoaderPropsType = {
        children: ReactNode;
        getDataFunction: () => Promise<any>
        resourceName: string;
    };

    export const DataSource = ({getDataFunction, resourceName, children}: ResourceLoaderPropsType) => {
        const [state, setState] = useState(null);
    
        useEffect(() => {
            (async () => {
                try {
                    const data = await getDataFunction();
                    setState(data);
    // ...

Usage:
    
    // ...
    const getServerData = (url: string) => (id: string) => {
        return async () => {
            const response = await axios.get(`${url}/${id}`);
            return response.data;
        }
    }
    
    const getUser = getServerData('/users');
    const getProduct = getServerData('/products');
    
    function App() {
        return (
            <>
                <DataSource getDataFunction={getUser('1234')} resourceName={'user'}>
                    <UserInfo/>
                </DataSource>
    // ...

### Loading data from localStorage

The above function could also be used to load data from localStorage:

    // ...
    const getLocalStorageData = (key: string) => {
        return localStorage.getItem(key);
    }
    
    const Text = ( {message}: {message?: string}) => <h1>{message}</h1>;
    
    function App() {
        return (
            <>
                <DataSource getDataFunction={()=>getLocalStorageData('test123')} resourceName={'message'}>
                    <Text />
                </DataSource>
    // ...

## Controlled and uncontrolled components

Note: the form examples are react basics, the meat of this section is in the onboarding flow section.

- **Uncontrolled**: the component keeps track for all its internal state and "releases" data only when some event occurs, e.g. the form submit event
- **Controlled**: all state and state management functions are passed as props from the parent component 

Usually controlled components make code more reusable and easier to test.

### Side note: useRef vs createRef

>A ref is a plain JS object { current: <some value> }.
> 
>React.createRef() is a factory returning a ref { current: null } - no magic involved.
> 
>useRef(initValue) also returns a ref { current: initValue } akin to React.createRef(). Besides, it memoizes this ref to be persistent across multiple renders in a function component.
[source](https://stackoverflow.com/questions/54620698/whats-the-difference-between-useref-and-createref)

    function useRef(value) {
      const [ref] = useState(createRef(value));
      return ref;
    }

[source](https://old.reddit.com/r/reactjs/comments/a2pt15/when_would_you_use_reactcreateref_vs_reactuseref/eb17vz5/)

In short, 
- `createRef` creates a new ref on every call, useRef memoizes it.
- `useRef` should be used in functional components unless memoization is not desired

### Uncontrolled form example

UncontrolledForm.tsx

    import React, {createRef, FormEvent} from 'react';
    
    type UncontrolledFormPropsType = {};
    
    export const UncontrolledForm = ({}: UncontrolledFormPropsType) => {
        const nameInput = createRef<HTMLInputElement>();
        const ageInput = createRef<HTMLInputElement>();
        const hairColorInput = createRef<HTMLInputElement>();
    
    
        const handleSubmit = (e: FormEvent) => {
            e.preventDefault();
            const name = nameInput.current?.value;
            const age = ageInput.current?.value;
            const hairColor = hairColorInput.current?.value;
            // ... do stuff with these values
        }
    
        return (<form onSubmit={handleSubmit}>
            <input ref={nameInput} name={"name"} type={"text"} placeholder={"Name"} />
            <input ref={ageInput} name={"age"} type={"text"} placeholder={"Age"} />
            <input ref={hairColorInput} name={"hairColor"} type={"text"} placeholder={"Hair color"} />
    
            <input type={"submit"} placeholder={"Submit"} />
        </form>);
    };


Usage:

    <UncontrolledForm />

### Controlled form example

Note: the form itself is not controlled in the sense of the definition but the input fields are.
If the form itself were controlled, the values and setter functions would be manged in the parent component and passed in as props to the ControlledForm component.

ControlledForm.tsx

    export const ControlledForm = ({}: UncontrolledFormPropsType) => {
        const [name, setName] = useState('');
        const [age, setAge] = useState('');
        const [hairColor, setHairColor] = useState('');
    
        const [error, setError] = useState('');
    
        useEffect(()=> {
            setError(name.length < 3 ? 'Name must be at least 3 characters' : '');
        }, [name]);
    
        const handleSubmit = (e: FormEvent) => {
            e.preventDefault();
        }
        return (<form onSubmit={handleSubmit}>
            {error && <div>{error}</div>}
            <input value={name}
                   onChange={e=>setName(e.target.value)}
                   name={"name"} type={"text"} placeholder={"Name"} />
            <input value={age}
                   onChange={e=>setAge(e.target.value)}
                   name={"age"} type={"text"} placeholder={"Age"} />
            <input value={hairColor}
                   onChange={e=>setHairColor(e.target.value)}
                   name={"hairColor"} type={"text"} placeholder={"Hair color"} />
    
            <input type={"submit"} placeholder={"Submit"} />
        </form>);
    };

### Controlled modals

The modal example from [Modal components](#Modal_components) is an uncontrolled component in the sense that is controls the opened status by itself by providing a button to toggle the state.

The problem is that parent components have no control about what the modal is doing (we can't provide a different mechanism / button to control if the modal is opened).

Controlled modal example:

    // ...
    type ModalPropsType = {
        shouldShow: boolean;
        setShouldShow: (b: boolean) => void;
        children: React.ReactNode;
    };
    
    export const ControlledModal = ({shouldShow, setShouldShow, children}: ModalPropsType) => {
        // ...
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

Usage:

    <button onClick={() => setShowModal(!showModal)} type={'button'}>show / hide modal</button>
    <ControlledModal shouldShow={showModal} setShouldShow={setShowModal}>
        <h1>Modal content</h1>
    </ControlledModal>

### Uncontrolled onboarding flows

Onboarding flow: showing basic steps in an onboarding process sequentially.

For a first draft version with back / forward buttons see `UncontrolledOnboardingFlowPkro`.

import React, {useState} from 'react';

export type ChildrenPropsType = {
goToNext: (stepData: Object)=>void;
}

type UncontrolledOnboardingFlowPropsType = {
children: React.ReactNode;
onFinish: (data: unknown) => void;
};

UncontrolledOnboardingFlow.tsx

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

Usage:

    const Step1 = ({goToNext}: { goToNext?: (stepData: Object) => void }) => {
        const ref = useRef<HTMLInputElement>(null);
        return (<>
            <h1>Step 1</h1>
            <input type={'text'} placeholder={'name'} ref={ref} />
            <button onClick={()=>goToNext!({name: ref.current?.value})}>Next</button>
        </>);
    };
    
    const Step2 = ({goToNext}: { goToNext?: (stepData: Object) => void }) => {
        const ref = useRef<HTMLInputElement>(null);
    
        return (<>
            <h1>Step 2</h1>
            <input type={'text'} placeholder={'hair color'} ref={ref} />
            <button onClick={()=>goToNext!({hairColor: ref.current?.value})}>Next</button>
        </>);
    };
    
    const Step3 = ({goToNext}: { goToNext?: (stepData: Object) => void }) => {
        const ref = useRef<HTMLInputElement>(null);
    
        return (<>
            <h1>Step 3</h1>
            <input type={'text'} placeholder={'age'} ref={ref} />
            <button onClick={()=>goToNext!({age: ref.current?.value})}>Next</button>
        </>);
    };
    
    function App() {
        return (
            <>
                <UncontrolledOnboardingFlow onFinish={(cdata: unknown) =>{console.log(cdata); window.alert('onboarding comploete');}}>
                    <Step1 />
                    <Step2 />
                    <Step3 />
                </UncontrolledOnboardingFlow>
            </>
        );
    }

### Controlled onboarding flow

ControlledOnboardingFlow.tsx

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

The controlled flow allows for making steps optional based on the data of previous steps:

    // ...
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
        // ... same-ish
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

## Higher order components

- A component (which is just a function) that returns another component instead of JSX
- Can share complex behavior between multiple components
- Can add extra functionality to existing components

Normal component:

`const SomeComponent = ()=><h1>Hey!</h1>`

`const HOCComponent = () => () => <h1>Hey!</h1>`



## Custom hooks patterns

## Functional programming in react




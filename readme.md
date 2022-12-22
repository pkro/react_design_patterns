# Follow along of the course by Shaun Wassel on linkedin learning

Code repo: https://github.com/LinkedInLearning/react-design-patterns-2895130.git

All code is converted to typescript.

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

[Useful link for typescript HOCs](https://react-typescript-cheatsheet.netlify.app/docs/hoc/full_example/)


### Printing props wiht HOCs

Basic HOC to print the props of a component to the console:

printProps.tsx

    export const printProps = (WrappedComponent: React.ComponentType) => {
        return (props: any) => {
            console.log(props);
            return <WrappedComponent {...props} />
        }
    }

Usage:

    const UserInfoWrapped = printProps(UserInfo);
    function App() {
        return (
            <UserInfoWrapped user={{
                id: '1234',
                name: 'John Does',
                age: 54,
                hairColor: 'brown',
                hobbies: ['swimming', 'bicycling', 'video games'],
            }} />
        );
    }

### Loading data with HOCs

Works similar to container components:

withUser.tsx

    // ...
    import {UserInfoProps, userType} from "./UserInfo";
    
    export const withUser = (Component: React.ComponentType<UserInfoProps>, userId: string | number) => {
        return (props: UserInfoProps) => {
            const [user, setUser] = useState<userType | null>(null);
            useEffect(()=>{
                (async ()=>{
                    const response = await axios.get(`/users/${userId}`)
                    setUser(response.data);
                })();
            }, [])
    
            return <>{user && <Component {...props} user={user} />}</>
        }
    }

Usage:

    const UserInfoWithLoader = withUser(UserInfo, 1234);
    // ...
    <UserInfoWithLoader />

### Modifying (server) data with HOCs

The following HOC allows *any* component that might need to make changes to a user to get the relevant functions / data.

A HOC to provide basic user loading and one CRUD function (update) and rollback changes functionality:

    export const withEditableUser = (Component: React.ComponentType<any>, userId: string | number) => {
        return (props: any) => {
            const [originalUser, setOriginalUser] = useState<userType | null>(null);
            const [user, setUser] = useState<userType | null>(null);
    
            useEffect(() => {
                (async () => {
                    const response = await axios.get(`/users/${userId}`);
                    setOriginalUser(response.data);
                    setUser(response.data);
                })();
            }, []);
    
            const onChangeUser = (changes: Partial<userType>) => {
                if (user) {
                    setUser({
                        ...user,
                        ...changes
                    });
                }
            };
    
            const onSaveUser = async () => {
                const response = await axios.post(`/users/${userId}`, {user});
                setOriginalUser(response.data);
                setUser(response.data);
            };
    
            const onResetUser = () => setUser(originalUser);
    
            return <>{originalUser && <Component
                {...props}
                user={user}
                onSaveUser={onSaveUser}
                onChangeUser={onChangeUser}
                onResetUser={onResetUser}
            />}</>;
        };
    };

Usage see next section

### Creating forms with HOCs

Usage of above HOC wrapper:

    export type UserInfoFormPropsType = {
        user: userType,
        onChangeUser: (u: Partial<userType>) => void,
        onSaveUser: () => void,
        onResetUser: () => void
    };
    
    // we export the component pre-wrapped instead of doing it later
    // though this takes away the advantage of having a testable component that we can pass
    // mocked data / functions, doesn't it?
    export const UserInfoForm = withEditableUser(
        ({user, onChangeUser, onSaveUser, onResetUser}: UserInfoFormPropsType) => {
            const {name, age, hairColor} = user || {};
    
            return user ? (<>
                <label>Name:
                    <input value={name} onChange={e => onChangeUser({name: e.target.value})}/>
                </label>
                <label>Age:
                    <input type="number" value={age} onChange={e => onChangeUser({age: Number(e.target.value)})}/>
                </label>
                <label>Hair color:
                    <input value={hairColor} onChange={e => onChangeUser({hairColor: e.target.value})}/>
                </label>
    
                <button onClick={onResetUser}>Reset</button>
                <button onClick={onSaveUser}>Save changes</button>
            </>) : <p>Loading...</p>;
        }, "1234"
    );

### HOC improvements

Like with container components, we can generalize this for *any* kind of data, not just `user`.

Todo: use typescript generics instead of "any" for the resource type, e.g. `React.ComponentType<T>`; I don't know where / how to make these changes yet.

    export const withEditableResource = (Component: React.ComponentType<any>, resourcePath: string, resourceName: string) => {
        return (props: any) => {
            const [originalData, setOriginalData] = useState<object | null>(null);
            const [data, setData] = useState<object | null>(null);
    
            useEffect(() => {
                (async () => {
                    const response = await axios.get(resourcePath);
                    setOriginalData(response.data);
                    setData(response.data);
                })();
            }, []);
    
            const onChange = (changes: object) => {
                if (data) {
                    setData({
                        ...data,
                        ...changes
                    });
                }
            };
    
            const onSave = async () => {
                const response = await axios.post(resourcePath, {[resourceName]: data});
                setOriginalData(response.data);
                setData(response.data);
            };
    
            const onReset = () => setData(originalData);
    
            // instead of making it necessary for the components that need to be wrapped
            // to use generic prop names ("data", "onSave" etc.) we want them to be able
            // to use their own props such as "user", "onSaveUser" etc.
            // that will also allow to wrap a component that has multiple editable resources
            // such as user and product in multiple HOCS, e.g.
            // withEditableResource(withEditableResource(UserAndProductForm, "/user/123", "user"), "/product/345", "product");
    
            // this still needs the components follow the pattern "onSave"+resourceName etc.
            const resourceProps = {
                [resourceName]: data,
                [`onSave${resourceName[0].toUpperCase() + resourceName.slice(1)}`]: onSave,
                [`onChange${resourceName[0].toUpperCase() + resourceName.slice(1)}`]: onChange,
                [`onReset${resourceName[0].toUpperCase() + resourceName.slice(1)}`]: onReset,
            }
            return <>{originalData && <Component
                {...props}
                {...resourceProps}
            />}</>;
        };
    };

Usage:

    export const UserInfoForm = withEditableResource(
        ({user, onChangeUser, onSaveUser, onResetUser}: UserInfoFormPropsType) => {
            // all the same as before
        }, "/users/1234", "user"
    );

## Custom hooks patterns

Self defined hooks that usually combine the functionality of other hooks, e.g.

    export const useCurrentUser = () => {
        const [user, setUser] = useState<userType | null>(null);
        useEffect(()=>{
            (async ()=>{
                const response = await axios.get(`/current-user}`)
                setUser(response.data);
            })();
        }, []);
    
        return user;
    }

Usage:

    const products = useProducts();

Custom hooks *must* start with "use".

They're used to share complex behaviour between multiple components just as containers and HOCs.

### useUser

Basic user loader:

useUser.tsx

    export const useUser = (userId: number | string) => {
        const [user, setUser] = useState<userType | undefined>(undefined);
        useEffect(()=>{
            (async ()=>{
                const response = await axios.get(`/users/${userId}`);
                setUser(response.data);
            })();
        }, []);
    
        return user;
    }

UserInfo.tsx

    // ...
    export type UserInfoProps = {
        userId: string | number;
    }
    
    export function UserInfo ({ userId }: UserInfoProps) {
        const user = useUser(userId);
        const { name, age, hairColor, hobbies } = user || {};
    // ...

App.tsx

    <UserInfo userId={"2345"}/>

### useResource

Same generalization, just with less typescript shennanigans to use different kind of resources, e.g. products or users.

useResource.tsx

    export const useResource = (resourceUrl: string) => {
        const [data, setData] = useState<userType | undefined>(undefined);
        useEffect(()=>{
            (async ()=>{
                const response = await axios.get(resourceUrl);
                setData(response.data);
            })();
        }, []);
    
        return data;
    }

UserInfo.tsx
    
    // ... no change
    //const user = useUser(userId);
    const user = useResource(`/users/${userId}`);
    // ... no change

### useDataSource

Same as before, just passing the whole data getter function instead of the URL. This makes it possible to get data from any resource, not just a REST server (e.g. localStorage).

    export const useDataSource = (getResource: () => any) => {
        const [data, setData] = useState<userType | undefined>(undefined);
        useEffect(() => {
            (async () => {
                const result = await getResource();
                setData(result);
            })();
        }, [getResource]);
    
        return data;
    };

UserInfo.tsx

    // ...
    const serverResource = (resourceUrl: string) => async () => {
        const response = await axios.get(resourceUrl);
        return response.data;
    }
    
    export function UserInfo ({ userId }: UserInfoProps) {
        //const user = useUser(userId);
        //const user = useResource(`/users/${userId}`);
        const user = useDataSource(serverResource(`/users/${userId}`));
    // ...

## Functional programming in react

Minimize mutation and state changes and keep functions independent of external data. Functions are first-class (can be passed / returned)

Applications in React: 

- Controlled components
- Function components (as opposed to class components)
- HOCs (return other functions)
- The following 3 sections
- 
### Recoursive components

Components that refer to themselves inside of the components body.

Example: display a nested object of any depth as a list of lists:

RecursiveComponent.tsx

    type RecursiveComponentPropsType = {
        data: any
    };
    
    const isObject = (x: unknown) => typeof x === 'object' && x !== null;
    
    export const RecursiveComponent = ({data}: RecursiveComponentPropsType) => {
        if (!isObject(data)) {
            return (<li>{data}</li>);
        }
    
        const pairs = Object.entries(data);
    
        return (<>
                {pairs.map(([key, val]) => {
                    return (<li>
                        {key}:
                        <ul>
                            <RecursiveComponent data={val}/>
                        </ul>
                    </li>)
                    })
                }
            </>
        );
    };

App.tsx

    const nestedObject = {
        a: 1,
        b: {
            b1: 4,
            b2: {
                b23: 'Hello',
            },
            b3: {
                b31: {
                    message: 'Hi',
                },
                b32: {
                    message: 'Hi',
                }
            }
        },
        c: {
            c1: 2,
            c2: 3,
        }
    }
    
    function App() {
        return (
            <RecursiveComponent data={nestedObject} />
        );
    }

### Component composition

Basically just creating components that use other components with pre-specified props:

    export const Button = ({size, color, text, ...props}: {size: string, color: string, text: string}) => {
        return (
            <button style={{
                padding: size === 'large' ? 32 : 8,
                fontSize: size === 'large' ? 32 : 16,
                backgroundColor: color
            }}
                    {...props}>
                {text}
            </button>
        );
    };
    
    export const DangerButton = ({text, ...props}: {text: string}) => <Button color={'red'} size={'large'} text={text} />

Usage

    <DangerButton text={"Danger!!!"} />

### Partially applied components

As a next step, we can make a function that pre-applies props and returns a component where only the remaining props must be specified (though all can be specified and overwrite the pre-applied ones):

partiallyApply.tsx

    export const partiallyApply = (Component: React.ComponentType<any>, partialProps: object) => {
        return (props: any) => {
            return <Component {...partialProps} {...props} />
        }
    };
    
    export const Button = ({size, color, text, ...props}: {size: string, color: string, text: string}) => {
        return (
            <button style={{
                padding: size === 'large' ? 32 : 8,
                fontSize: size === 'large' ? 32 : 16,
                backgroundColor: color
            }}
                    {...props}>
                {text}
            </button>
        );
    };
    
    export const DangerButton = partiallyApply(Button, {color: 'red'});
    export const BigSuccessButton = partiallyApply(Button, {color: 'green', size: 'large'});


Usage 

    <DangerButton text={'Oh no!'}/>
    <BigSuccessButton text={'Oh yes!'}/>

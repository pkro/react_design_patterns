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

import React, {createRef, FormEvent, useEffect, useState} from 'react';

type UncontrolledFormPropsType = {};

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

import React from 'react';
import {people} from "../App";

type SmallPersonListItemPropsType = { person: typeof people[0] };

const SmallPersonListItem = ({person: {name, age, hairColor, hobbies}}: SmallPersonListItemPropsType) => {

    return (<p>{name}, {age} years old</p>);
};

export default SmallPersonListItem;

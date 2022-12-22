import React from 'react';
import {people} from "../App";

type LargeProductListItemPropsType = {person: typeof people[0]};

const LargeProductListItem = ({person: {name, age, hairColor, hobbies}}: LargeProductListItemPropsType) => {
    return (<>
        <h3>{name}</h3>
        <p>Age: {age} years</p>
        <p>Hair color: {hairColor}</p>
        <h3>Hobbies:</h3>
        <ul>
            {hobbies.map(hobby=><li key={hobby}>{hobby}</li>)}
        </ul>
    </>);
};

export default LargeProductListItem;

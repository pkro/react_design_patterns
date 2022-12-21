import React from 'react';
import {withEditableUser} from "./withEditableUser";
import {userType} from "./UserInfo";

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




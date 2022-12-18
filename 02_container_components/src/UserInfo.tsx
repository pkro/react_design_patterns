import {ChildrenPropsType} from "./CurrentUserLoader";
import {ReactNode} from "react";

const exampleUser = {
    name: 'John Doe',
    age: 54,
    hairColor: 'brown',
    hobbies: ['swimming', 'bicycling', 'video games'],
}

export type userType = typeof exampleUser;
type UserInfoProps = {
	// is there away to make this required?
	// as I'm using typescript and the prop is "injected" in CurrentUserLoader
	// typescript complains otherwise in App.tsx that user is missing
	user?: userType;
}

export function UserInfo ({ user }: UserInfoProps) {
	const { name, age, hairColor, hobbies } = user || {};
	console.log(user);
	return user ? (
		<>
		<h3>{name}</h3>
		<p>Age: {age} years</p>
		<p>Hair Color: {hairColor}</p>
		<h3>Hobbies:</h3>
		<ul>
			{hobbies?.map(hobby => <li key={hobby}>{hobby}</li>)}
		</ul>
		</>
	) : <p>Loading...</p>;
}

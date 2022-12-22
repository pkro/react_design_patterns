import {useUser} from "./useUser";
import {useResource} from "./useResource";
import axios from "axios";
import {useDataSource} from "./useDataSource";

const exampleUser = {
	id: '1234',
	name: 'John Does',
	age: 54,
	hairColor: 'brown',
	hobbies: ['swimming', 'bicycling', 'video games'],
}

export type userType = typeof exampleUser;

export type UserInfoProps = {
	userId: string | number;
}

const serverResource = (resourceUrl: string) => async () => {
	const response = await axios.get(resourceUrl);
	return response.data;
}

export function UserInfo ({ userId }: UserInfoProps) {
	//const user = useUser(userId);
	//const user = useResource(`/users/${userId}`);
	const user = useDataSource(serverResource(`/users/${userId}`));

	const { name, age, hairColor, hobbies } = user || {};
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

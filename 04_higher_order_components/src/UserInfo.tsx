const exampleUser = {
	id: '1234',
	name: 'John Does',
	age: 54,
	hairColor: 'brown',
	hobbies: ['swimming', 'bicycling', 'video games'],
}

export type userType = typeof exampleUser;

export type UserInfoProps = {
	user?: userType;
}

export function UserInfo ({ user }: UserInfoProps) {
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

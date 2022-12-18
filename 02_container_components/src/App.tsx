import {CurrentUserLoader} from "./CurrentUserLoader";
import {UserInfo} from "./UserInfo";
import {UserLoader} from "./UserLoader";
import {ResourceLoader} from "./ResourceLoader";
import {ProductInfo} from "./ProductInfo";
import {DataSource} from "./DataSource";
import axios from "axios";

const getServerData = (url: string) => (id: string) => {
    return async () => {
        const response = await axios.get(`${url}/${id}`);
        return response.data;
    }
}

const getUser = getServerData('/users');
const getProduct = getServerData('/products');

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
            <DataSource getDataFunction={getUser('1234')} resourceName={'user'}>
                <UserInfo/>
            </DataSource>
            <UserLoader userId={'1234'}>
                <UserInfo/>
            </UserLoader>
            <UserLoader userId={'2345'}>
                <UserInfo/>
            </UserLoader>
            <ResourceLoader resourceUrl={'/users/3456'} resourceName={'user'}>
                <UserInfo/>
            </ResourceLoader>
            <ResourceLoader resourceUrl={'/products/1234'} resourceName={'product'}>
                <ProductInfo/>
            </ResourceLoader>
        </>
    );
}

export default App;

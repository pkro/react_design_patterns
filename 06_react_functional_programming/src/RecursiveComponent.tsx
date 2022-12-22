import React from 'react';

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

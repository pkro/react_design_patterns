import React from 'react';

type RegularListPropsType = {
    items: unknown[],
    itemPropName: string,
    itemComponent: React.ElementType };

export const RegularList = ({
                         items,        // e.g. the people array defined in App.tsx
                         itemPropName, // e.g. "person" as that's the prop name in the *PersonListItem.tsx files
                         itemComponent: ItemComponent // e.g. SmallPersonListItem
                     }: RegularListPropsType) => {

    return (<>
        {items.map((item, i) => (
            <ItemComponent
                /*index shouldn't be used, maybe better would be a property that is known to exist in all
                * possible item lists, such as key={item.id} */
                key={i}
                /*when passing e.g. "person" as resourceName, this changes to "person={item}"*/
                {...{[itemPropName]: item}}
            />
        ))}
    </>);
};


# [dd-elements](https://github.com/pavloDeshko/dd-elements)

> D3-style alternative to JSX for React.js

## append(fragment)

Appends already created elements to every element in collection.

### Parameters

| Name     | Types      | Description                         |
| -------- | ---------- | ----------------------------------- |
| fragment | Collection | Collection of elements to be added. |

### Returns


Collection which contains added elements.

## child(type, datum)

Appends exactly one child to every element in collection.

### Parameters

| Name  | Types       | Description                                                                              |
| ----- | ----------- | ---------------------------------------------------------------------------------------- |
| type  | ElementType | Element type. Can be tag string or React component.                                      |
| datum | any         | Datum to be assigned to created element. If not specified will share its parent's datum. |

### Returns


Collection which contains added elements.

## children(type, data, keys)

Appends one child for every element in data array to each element in collection. Elements will be passed to React as a list, so every should have a unique "key" prop.

### Parameters

| Name | Types                     | Description                                                                                         |
| ---- | ------------------------- | --------------------------------------------------------------------------------------------------- |
| type | ElementType               | Element type. Can be tag string or React component.                                                 |
| data | Array.&lt;any&gt;, number | Requiered array with datums for every element. Alternatively can be number of elements to be added. |
| keys | Callback                  | Optional function which will return value of special prop "key" for each element.                   |

### Returns


Collection which contains added elements.

## classed(classNames, on)

Sets className prop of all elements in collection.

### Parameters

| Name       | Types   | Description                                    |
| ---------- | ------- | ---------------------------------------------- |
| classNames | string  | String of class names splitted by ' '.         |
| on         | boolean | Should speciefied classed be removed or added. |

### Returns


Same collection.

## Collection(type, datum)

Use to create a collection with root element for your component.

### Parameters

| Name  | Types       | Description                                         |
| ----- | ----------- | --------------------------------------------------- |
| type  | ElementType | Element type. Can be tag string or React component. |
| datum | any         | Optional datum to be assigned to created element.   |

### Returns


Collection that contains created root element.

## datum(datum)

Assigns datum to every element in collection.

### Parameters

| Name  | Types | Description                                                                                                                                                              |
| ----- | ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| datum | any   | Can be specified as value or function.If value is specified as function, it will be called with element's(or its parent's) datum and current index inside a collection. |

### Returns


Same collection.

## e(type, datum)

Shortcut (alias to new Collection()) function to create Collection with single root element.

### Parameters

| Name  | Types       | Description                                         |
| ----- | ----------- | --------------------------------------------------- |
| type  | ElementType | Element type. Can be tag string or React component. |
| datum | any         | Optional datum to be assigned to created element.   |

### Returns


Collection that contains created root element.

## keys(value)

Shortcut to assigns special key prop to elements in selection.

### Parameters

| Name  | Types                    | Description                                            |
| ----- | ------------------------ | ------------------------------------------------------ |
| value | string, number, Callback | Should be specified as function to maintain uniquness. |

### Returns


Same collection.

## parents()

Use to go "up" the tree when chaining.



### Returns


Collection that contains parent elements.

## prop(key, value)

Sets prop or attribute to all elements in collection.

### Parameters

| Name  | Types                    | Description                            |
| ----- | ------------------------ | -------------------------------------- |
| key   | string                   | String key.                            |
| value | string, number, Callback | Can be specified as value or function. |

### Returns


Same collection.

## props(props)

Assings props or attributes to all elements in collection.

### Parameters

| Name  | Types  | Description                                                                      |
| ----- | ------ | -------------------------------------------------------------------------------- |
| props | Object | Object containing key:value pairs. Values can be specified as value or function. |

### Returns


Same collection.

## text(value)

Appends text to all elements in collection.

### Parameters

| Name  | Types  | Description                                          |
| ----- | ------ | ---------------------------------------------------- |
| value | string | String value. Can be specified as value or function. |

### Returns


Same collection.

## toReact()

Converts the whole tree to which selected elements belong to valid React elements.To be called before returning in functional component or render function.



### Returns


React Elements tree.

## up()

Alias to parents(). Use to go "up" the tree when chaining.



### Returns


Collection that contains parent elements.

## withData(cb)

Lets you return collection in functional component without calling toReact() method.

### Parameters

| Name | Types    | Description                                      |
| ---- | -------- | ------------------------------------------------ |
| cb   | Callback | Functional component which returns a Collection. |

### Returns


Wrapped component.

Documentation generated with [doxdox](https://github.com/docsbydoxdox/doxdox)

Generated on Fri Mar 29 2024 15:53:11 GMT+0200 (Eastern European Standard Time)

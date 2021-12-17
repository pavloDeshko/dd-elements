# [dd-elements](https://github.com/pavloDeshko/dd-elements) *0.1.0*

> D3-style alternative to JSX for React.js


### lib/index.js


#### withData(cb) 

Lets you return collection in functional component without calling toReact().




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| cb | `Callback`  | Functional component which returns a Collection. | &nbsp; |




##### Returns


-  Wrapped component.



#### Collection(type[, datum&#x3D;null]) 

Use to create a collection with root element for your component.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| type | `ElementType`  | Element type. Can be tag string or React component. | &nbsp; |
| datum&#x3D;null | `any`  | Optional datum to be assigned to created element. | *Optional* |




##### Returns


-  Collection that contains created root element.



#### Collection.children(type, data, keys) 

Appends one child for every element in data array to each element in collection. Elements will be passed to React as a list, so every should have a unique "key" prop.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| type | `ElementType`  | Element type. Can be tag string or React component. | &nbsp; |
| data | `Array.<any>` `number`  | Requiered array with datums for every element. Alternatively can be number of elements to be added. | &nbsp; |
| keys | `Callback`  | Optional function which will return value of special prop "key" for each element. | &nbsp; |




##### Returns


-  Collection which contains added elements.



#### Collection.append(fragment) 

Appends already created elements to every element in collection.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| fragment | `Collection`  | Collection of elements to be added. | &nbsp; |




##### Returns


-  Collection which contains added elements.



#### Collection.parents() 

Use to go "up" the tree when chaining.






##### Returns


-  Collection that contains parent elements.



#### Collection.up() 

Alias to parents(). Use to go "up" the tree when chaining.






##### Returns


-  Collection that contains parent elements.



#### Collection.datum(datum) 

Assigns datum to every element in collection.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| datum | `any`  | Can be specified as value or function. If value is specified as function, it will be called with element's(or its parent's) datum and current index inside a collection. | &nbsp; |




##### Returns


-  Same collection.



#### Collection.prop(key, value) 

Sets prop or attribute to all elements in collection.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| key | `string`  | String key. | &nbsp; |
| value | `string` `number` `Callback`  | Can be specified as value or function. | &nbsp; |




##### Returns


-  Same collection.



#### Collection.keys(value) 

Shortcut to assigns special key prop to elements in selection.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| value | `string` `number` `Callback`  | Should be specified as function to maintain uniquness. | &nbsp; |




##### Returns


-  Same collection.



#### Collection.props(props) 

Assings props or attributes to all elements in collection.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| props | `Object`  | Object containing key:value pairs. Values can be specified as value or function. | &nbsp; |




##### Returns


-  Same collection.



#### Collection.classed(classNames, on) 

Sets className prop of all elements in collection.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| classNames | `string`  | String of class names splitted by ' '. | &nbsp; |
| on | `boolean`  | Should speciefied classed be removed or added. | &nbsp; |




##### Returns


-  Same collection.



#### Collection.text(value) 

Appends text to all elements in collection.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| value | `string`  | String value. Can be specified as value or function. | &nbsp; |




##### Returns


-  Same collection.



#### Collection.toReact() 

Converts the whole tree to which selected elements belong to valid React elements.
To be called before returning in functional component or render function.






##### Returns


-  React Elements tree.




*Documentation generated with [doxdox](https://github.com/neogeek/doxdox).*

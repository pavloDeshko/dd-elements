# Data-driven Elements [![Build Status](https://travis-ci.com/pavloDeshko/dd-elements.svg?branch=master)](https://travis-ci.com/pavloDeshko/dd-elements) 
A d3-style alternative to JSX for writing React elements. Tiny (less then 2kb), zero runtime dependencies.

```
npm i dd-elements
```

```
yarn add dd-elements
```

If you're not familiar with [d3](https://github.com/d3/d3 "d3") workflow there're two core ideas to grasp:
- DOM tree is constructed via Collection interface. Various chaining methods can be used to add children and specify their attributes. 
- Every element has a bit of data (called "datum") assigned to itself. It can be accessed via a callback, which will recieve datum as argument. 

Basic usage:
```javascript
import e from "dd-elements"

function yourReactComponent(props){
  let container = e("div")        //Get container element of given type.
      .classed("container primary")              //Assign classes,
      .prop("id","_id_")                         //attributes or props
  
  /*Now cool stuff*/
  container                                      //Add child for every element in an Array.
    .children("span",props.arr)                  //Pass a callback to access every child's
	  .prop("key", d=>d.id)                        //datum (respective array element).
	  .classed( d=>d.type+"_class" )               //And specify attrs based on their datums.
	  .text( d=>d.content )                        //As well as add text content
  
  return container.toReact()	                   //Convert to valid React Elements.
}
```
Note that type can be React Component:
```javascript
import {Card, Button} from "myComponents.js"
/*...*/
e(Card)
  .child(Button)
    .prop("text","Push me!")
```
Fucntional components can be wrapped, so Collection can be returned directly, without call to toReact():
```javascript
import e, {withData} from "dd-elements"
const MyWrappedComponent = withData(props=>{
  return e('div')
    .classed('container')
	//etc
})
```
Complete API can be found [here](https://github.com/pavloDeshko/dd-elements/blob/master/API.md).

If your are looking for a way to use D3 with React do have a look [here](https://github.com/Olical/react-faux-dom).
### MIT

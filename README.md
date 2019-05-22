[![Build Status](https://travis-ci.com/pavloDeshko/dd-elements.svg?branch=master)](https://travis-ci.com/pavloDeshko/dd-elements)

A d3-style alternative to JSX to write React elements.

# UNDER DEVELOPMENT #

To install:
```javascript
npm i dd-elements --save
```
Basic usage:
```javascript
const e = require("dd-elements").e  //e() alais element()
function yourReactComponent(props){
  let container =   e("div")        //Get container element of given type.
      .classed("container primary") //Assign classes,
      .style("float","left")        //styles
      .attr("id","_id_")            //and attributes.
  
  /*Now cool stuff*/
  container                         //Add child for every element in an Array.
  	.append("span",props.arr)       //Pass a callback to access every child's
	  .attr("key",d=>d.id)          //datum (respective array element).
	  .classed(d=>d.type+"_class")  //And specify attrs based on their datums.
	                                
  
  return container.all()	        //Convert to valid React Elements.
}
```
Note that any type can be React Component:
```javascript
const [Card,Button] = require("./components.js")
/*...*/
e(Card)
  .append(Button)
    .prop("text","Push me!")
```
Complete API can be found [here](https://github.com/pavloDeshko/dd-elements/blob/master/API.md).

If your are looking for a way to use D3 with React do have a look at https://github.com/Olical/react-faux-dom .
### MIT

## dd-elements API

#### element(type[,datum])
  Returns selection containing element of specified type. Optionaly binds datum to returned element.
#### e()
  Alias to element()
  
#### selection.parents()
  Returns selection of elements' parents.
#### selection.merge(other)
  Returns new selection resulted from merging two selections.
#### selection.filter(filter)
  Filters elements in selection. Filter must be specified as function, which will be called with element's current datum, current index and selection containing current element.
#### selection.other()
  If called on a selection, which resulted from selection.filter() call, retuns selection containing filtered out elements.
#### selection.sort(compare)
  Sorts and reinserts elements into their parent elements according to compare function, whish should return zero, positive or negative value when called with element's a datum, b datum, a selection, b selection. Compare defaults to ascending of datums. Returns new selection. Note that order of elements in original selecion may differ from new positions.
#### selection.size()
  Return number of elements in selection.

#### selection.child(type[, datum])
  Append exactly one element of specified type to every element in selection and binds its datum. Type can be either string or React Component. If datum is not specified element will share its parent's datum. Note that type cannot be specified as function - any function will be treated as React Element.
#### selection.children(type, data)
  Appends data.length number of elements of specified type and bind corresponding data to them. If selection contains multiple elements, data could be specified as function, which will be called for every parent element with it's datum, current index and selection containing element.
  If called with no arguments returns selection of elements' children.
#### selecion.append(type[, data])
  Acts as selecion.children() if passed an array (or function which returns array) as data. Otherwise acts like selecion.child()
  As other sumilar methods returns selection of newly appended elements.
#### selection.datum(value)
  Manualy binds or rebinds datums of selected elements. If value is specified as function, it will be called with element's current datum, current index and selection containing current element.

#### selection.type([value])
  Returns type of first element in selection or changes it's type.
#### selection.attr(name[,value])
  Sets atribute or prop to selected elements. If value is specified as function, it will be called with element's datum, current index and selection containing element. If value is not specified returns atribute value of the first element in selection.
#### selection.prop(name,value)
  Alias to selection.attr(). Semanticly should be used with React Elements.
#### selection.props(props)
  Sets multiple props (attributes) specified as key:value pairs in props object.
#### selection.classed(names,value=true)
  Sets className prop of an element. Value can be specified as function.
#### seloction.isClassed(names
  Returns true if first element in selection belongs to all specified classes, false othewise.
#### selection.style(name,value)
  Adds inline style pair to an element. Value can be specified as function.
#### selection.text(value)
  Adds escaped text after last child of each selected element.
#### selection.all()
  Converts the whole tree to which selected elements belong to valid React elements.
  
#### wrap(function, passElement=false)
  Wraps functional component or render function, so selection can be returned without all() call. If passElement is true, then element() function is passed to callback function as second argument for convenience.
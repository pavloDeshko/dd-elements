A d3 style alternative to JSX to write React elements.

UNDER DEVELOPMENT

e(type)
  Returns selection containing element of specified type.

selection.parent()
  Returns selection of first element's parent.
selection.children()
  Returns selection of elements' children.
selection.merge(other)
  Returns new selection resulted from merging.
selection.filter(filter)
  Filters elements in selection. Filter must be specified as function which will be called with element's current datum, current index and selection containing current element as this.
selection.other()
  If called on a selection which resulted from selection.filter() call, retuns selection containing filtered out elements.
selection.sort(compare)
  Sorts and reinserts elements into their parent elements according to compare function, whish should return zero, positive or negative value when called with element a datum, b datum, a selection, b selection. Compare defaults to ascending of datums. 

selection.append(type)
  Append exectly one element of specified type to every element in selection. Type can be either string or React Component. Element will share it's parent's datum. Type can be specified as function.
selection.append(type, data)
  Appends data.length number of elements of specified type and bind correspondind data to them. If selection contains multiple elements, data should be specified as function, which will be called for every parent element with it's datum, current index and selection containing element as this.
selecion.child(type,[data])
  Alias to selecion.append(). Semanticly should be used on React elements to add elements to props.children.
selection.datum(value)
  Manualy binds or rebinds datums of selected elements. If value is specified as function, it will be called with element's current datum, current index and selection containing current element as this.


selection.type(value)
  Returns type of first element in selection or changes it's type.
selection.attr(name,value)
  Sets atribute or prop to selected elements. If value is specified as function, it will be called with element's datum, current index and selection containing element as this. If value is not specified returns atribute value of the first element in selection.
selection.prop(name,value)
  Alias to selection.attr(). Semanticly should be used with React Elements.
selection.classed(names,value=true)
  Sets className prop of an element. Value can be specified as function. If value is not specified returns true if first element in selection belongs to all specified classes, false othewise.
selection.style(name,value)
  Adds inline style pair to an element. Value can be specified as function.

selection.all()
  Converts the whole tree to which selected elements belong to valid React elements.
import {createElement, ElementType, ReactNode, ReactElement, FunctionComponent} from 'react'

type NotFunction = {apply?:never, bind?:never} & Object
type AnyCollection = Collection<unknown,unknown,AnyCollection>
type Callback<ValueT, DatumT>= (datum :DatumT, index :number)=>ValueT
type Evaluate<ValueT, DatumT> = ValueT | Callback<ValueT, DatumT>

/**
 * Class representing the collection of elements.
 */
class Collection<CurrentPropsT, CurrentDatumT, OriginT extends AnyCollection = AnyCollection>{
  private elements :Array<Draft>
  private origin :OriginT 
  private evaluate<ValueT extends NotFunction>(value :Evaluate<ValueT, CurrentDatumT>, datum:any, i :number):ValueT{
    if(typeof value == 'function'){
      return value(datum, i)
    }else{
      return value
    }
  }

  /**
   * Use to create a collection with root element for your component.
   * @param type Element type. Can be tag string or React component. 
   * @param [datum=null] Optional datum to be assigned to created element.
   * @return Collection that contains created root element.
   */
  constructor(type? :ElementType<CurrentPropsT>, datum :(CurrentDatumT | null) = null){
    this.elements = type !== undefined ? [new Draft(type, datum, null)] : []
    this.origin = new Collection() as OriginT //TODO should we save user from himself?
  }

  /**
   * Isn't supposed to be called directly, use new Collection() or append().
   */
   private static create<PropsT, DatumT, OriginT extends AnyCollection>(elements :Array<Draft>, origin :OriginT){
    const that = new this<PropsT, DatumT, OriginT>()
    that.elements = elements
    that.origin = origin
    return that
  }


  /* Children methods */
  /**
   * Appends exactly one child to every element in collection.
   * @param type Element type. Can be tag string or React component.
   * @param [datum=null] Datum to be assigned to created element. If not specified will share its parent's datum.
   * @returns Collection which contains added elements.
   */
  public child<PropsT, DatumT>(//TODO maybe should return parent elements?
    type :ElementType<PropsT>, 
    datum? :Evaluate<DatumT,CurrentDatumT>
  ):Collection<PropsT, DatumT extends undefined ? CurrentDatumT : DatumT, this>{
    const addedElements :Array<Draft> = []
    this.elements.forEach((parent,i)=>{
      const child = new Draft(type, datum !== undefined ? this.evaluate(datum, parent.datum, i) : parent.datum, parent)
      addedElements.push(child)
      parent.children.push(child)
    })
    return Collection.create(addedElements, this)//TODO check if it works..
  }
  
  /**
   * Appends one child for every element in data array to each element in collection.
   * @param type Element type. Can be tag string or React component. 
   * @param data Requiered array with datums for every element. Alternatively can be number of elements to be added.
   * @returns Collection which contains added elements.
   */
  public children<PropsT, DatumT>(
    type :ElementType<PropsT>, 
    data :(Array<Evaluate<DatumT,CurrentDatumT>>) | number
  ):Collection<PropsT, DatumT, this>{
    const addedElements :Array<Draft> = []
    this.elements.forEach((parent,i)=>{
      if(typeof data == 'number'){
        data = [...Array(data)].map(()=>parent.datum)
      }
      const children = data.map(datum=>new Draft(type, this.evaluate(datum, parent.datum, i), parent))
      addedElements.concat(children)
      parent.children.concat(children)
    })
    return Collection.create(addedElements, this)
  }
  
  /**
   * Appends already created elements to every element in collection.
   * @param fragment Collection of elements to be added.
   * @returns Collection which contains added elements.
   */
  public append<PropsT, DatumT>(fragment :Collection<PropsT,DatumT>):Collection<PropsT, DatumT, this>{
    const addedElements :Array<Draft> = []
    this.elements.forEach((parent,i)=>{
      fragment.elements.forEach(e=>{
        e.parent = parent
      })
      addedElements.concat(fragment.elements)
      parent.children.concat(fragment.elements)
    })
    return Collection.create(addedElements, this)
  }
  
  /**
   * Use to go "up" the tree when chaining.
   * @returns Collection that contains parent elements.
   */
  public parents():OriginT{
    return this.origin
  }
  /**
   * Alias to parents(). Use to go "up" the tree when chaining.
   * @returns Collection that contains parent elements.
   */
  public up = this.parents

  /**
   * Assigns datum to every element in collection.
   * @param datum Can be specified as value or function.
   * If value is specified as function, it will be called with element's(or its parent's) datum and current index inside a collection.
   * @returns Same collection.
   */
  public datum<DatumT>(datum: Evaluate<DatumT,CurrentDatumT>):Collection<CurrentPropsT, DatumT, OriginT>{
    this.elements.forEach((e,i)=>{//TODO modifying?..
      e.datum = this.evaluate(datum, e.parent && e.parent.datum, i)
    })
    return this as Collection<CurrentPropsT,DatumT,OriginT> 
  }


  /* Props methods */
  /**
   * Sets prop or attribute to all elements in collection.
   * @param key String key.
   * @param value Can be specified as value or function. 
   * @returns Same collection.
   */
  public prop<Key extends keyof CurrentPropsT>(key :Key, value :Evaluate<CurrentPropsT[Key], CurrentDatumT>){
    this.elements.forEach((e,i)=>{
      e.props[key] = this.evaluate(value, e.datum, i)
    })
    return this
  }
  
  /**
   * Assings props or attributes to all elements in collection.
   * @param props Object containing key:value pairs. Values can be specified as value or function. 
   * @returns Same collection.
   */
  public props(props :Partial<{[K in keyof CurrentPropsT]:Evaluate<CurrentPropsT[K],CurrentDatumT>}>){
    this.elements.forEach((e,i)=>{
      (Object.keys(props) as Array<keyof CurrentPropsT>).forEach((k)=>{
        const value = this.evaluate(e.props[k], e.datum, i)
          e.props[k] = value !== undefined ? value : e.props[k]
      })
    })
    return this
  }

  /**
   * Sets className prop of all elements in collection.
   * @param classNames String of class names splitted by ' '. 
   * @param on Should speciefied classed be removed or added.
   * @returns Same collection.
   */
  public classed(classNames :string, on :Evaluate<boolean,CurrentDatumT>){//TODO add array support
    const newNames = classNames.split(' ')
    this.elements.forEach((e,i)=>{
      on = this.evaluate(on, e.datum, i)
      const names = e.props.className.split(' ')
      newNames.forEach(name=>{
        const index = names.indexOf(name)
        index > -1 ? 
          !on && names.splice(index,1) : 
          on && names.push(name)
      })
      e.props.className = names.join(' ')
    })
    return this
  }
  
  /**
   * Appends text to all elements in collection.
   * @param value String value. Can be specified as value or function. 
   * @returns Same collection.
   */
  public text(value :Evaluate<string, CurrentDatumT>){
    this.elements.forEach((e,i)=>{
      e.children.push(this.evaluate(value, e.datum, i))
    })
    return this
  }

  /* React methods */
  /**
   * Converts the whole tree to which selected elements belong to valid React elements. 
   * To be called before returning in functional component or render function.
   * @returns React Elements tree.
   */
  public toReact():ReactElement{
    const findRoot = (d :Draft):Draft=>d.parent === null ? d : findRoot(d)
    const _toReact = (e:Draft):ReactElement => createElement(
      e.type, 
      this.props, 
      e.children.map((e):ReactNode => typeof e === 'string' ?  e : _toReact(e))
    )
    return this.elements[0] ? _toReact(findRoot(this.elements[0])) : createElement(()=>null)
  }
}

/**
 * Class representing element yet not converted to react. Not meant to be used directly, use child(), children() or append() instead.
 */
class Draft{
  type :ElementType
  datum :any
  props :any = {className:''}
  children :Array<Draft | string> = []
  parent :Draft|null
  constructor(type:ElementType, datum :any = null, parent :Draft|null){
    this.type = type
    this.datum = datum
    this.parent = parent
  }
}

/**
 * Lets you return collection in functional component without calling toReact().
 * @param cb Functional component which returns a Collection.
 * @returns Wrapped component.
 */
export const withData = <PropsT>(cb :(props :PropsT)=>AnyCollection):FunctionComponent<PropsT>=>{
  return props => cb(props).toReact()
}
export default Collection

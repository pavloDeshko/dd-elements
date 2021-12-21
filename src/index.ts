import {createElement, ElementType, ReactNode, ReactElement, FunctionComponent, Key as ReactKey} from 'react'

type NotFunction = {apply?:never, bind?:never} & Object
type AnyCollection = Collection<unknown,unknown,AnyCollection>
type AnyProps = {[key:string]: Object | null | undefined}
type Callback<ValueT, DatumT>= (datum :DatumT, index :number)=>ValueT
type Evaluate<ValueT, DatumT> = ValueT | Callback<ValueT, DatumT>
type Child = Draft | string

/**
 * Shortcut (alias to new Collection()) function to create Collection with single root element.
 * @param {ElementType} type Element type. Can be tag string or React component. 
 * @param {any} [datum=null] Optional datum to be assigned to created element.
 * @return Collection that contains created root element.
 */
const e = <PropsT = AnyProps, DatumT = null>(type :ElementType<PropsT>, datum? :DatumT) => new Collection<PropsT,DatumT>(type,datum)
export default e

/**
 * Lets you return collection in functional component without calling toReact() method.
 * @param {Callback} cb Functional component which returns a Collection.
 * @returns Wrapped component.
 */
 export const withData = <PropsT>(cb :(props :PropsT)=>AnyCollection):FunctionComponent<PropsT>=>{
  return props => cb(props).toReact()
}

/**
 * Class representing the collection of elements.
 */
 export class Collection<CurrentPropsT = AnyProps, CurrentDatumT = null, OriginT extends AnyCollection = AnyCollection>{
  private elements :Array<Draft>
  private origin :OriginT | null
  private evaluate<ValueT extends NotFunction>(value :Evaluate<ValueT, CurrentDatumT>, datum:any, i :number):ValueT{
    if(typeof value == 'function'){
      return value(datum, i)
    }else{
      return value
    }
  }

  /**
   * Use to create a collection with root element for your component.
   * @param {ElementType} type Element type. Can be tag string or React component. 
   * @param {any} [datum=null] Optional datum to be assigned to created element.
   * @return Collection that contains created root element.
   */
  constructor(type? :ElementType<CurrentPropsT>, datum :(CurrentDatumT | null) = null){
    this.elements = type !== undefined ? [new Draft(type, datum, null)] : []
    this.origin = null
  }

  /*
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
   * @param {ElementType} type Element type. Can be tag string or React component.
   * @param {any} [datum=null] Datum to be assigned to created element. If not specified will share its parent's datum.
   * @returns Collection which contains added elements.
   */
  public child<PropsT = AnyProps, DatumT = CurrentDatumT>(
    type :ElementType<PropsT>, 
    datum? :Evaluate<DatumT,CurrentDatumT>
  ):Collection<PropsT, DatumT, this>{
    const addedElements :Array<Draft> = []
    this.elements.forEach((parent,i)=>{
      const child = new Draft(type, datum !== undefined ? this.evaluate(datum, parent.datum, i) : parent.datum, parent)
      addedElements.push(child)
      parent.children.push(child)
    })
    return Collection.create(addedElements, this)
  }
  
  /**
   * Appends one child for every element in data array to each element in collection. Elements will be passed to React as a list, so every should have a unique "key" prop.
   * @param {ElementType} type Element type. Can be tag string or React component. 
   * @param {any[] | number} data Requiered array with datums for every element. Alternatively can be number of elements to be added.
   * @param {Callback} keys Optional function which will return value of special prop "key" for each element.
   * @returns Collection which contains added elements.
   */
  public children<PropsT = AnyProps, DatumT = CurrentDatumT>(
    type :ElementType<PropsT>, 
    data :(Array<Evaluate<DatumT,CurrentDatumT>>) | number,
    keys : Callback<ReactKey,DatumT> = (_,i)=>i
  ):Collection<PropsT, DatumT, this>{
    let addedElements :Array<Draft> = []
    this.elements.forEach((parent,i)=>{
      if(typeof data == 'number'){
        data = [...Array(data)].map(()=>parent.datum)
      }
      const children = data.map(datum=>new Draft(type, this.evaluate(datum, parent.datum, i), parent))
/*       children.forEach((child,i)=>{
        child.props['key'] = keys !== undefined ? this.evaluate(keys, child.datum,i) : i//TODO should you do that
      }) */
      addedElements = addedElements.concat(children)
      parent.children = parent.children.concat([children])
    })
    return Collection.create<PropsT, DatumT, this>(addedElements, this).keys(keys)
  }
  
  /**
   * Appends already created elements to every element in collection.
   * @param {Collection} fragment Collection of elements to be added.
   * @returns Collection which contains added elements.
   */
  public append<PropsT, DatumT>(fragment :Collection<PropsT,DatumT>):Collection<PropsT, DatumT, this>{
    let addedElements :Array<Draft> = []
    this.elements.forEach((parent,i)=>{
      fragment.elements.forEach(e=>{
        e.parent = parent
      })
      addedElements = addedElements.concat(fragment.elements)
      parent.children = parent.children.concat(fragment.elements)
    })
    return Collection.create(addedElements, this)
  }
  
  /**
   * Use to go "up" the tree when chaining.
   * @returns Collection that contains parent elements.
   */
  public parents():OriginT{
    return this.origin || new Collection() as OriginT
  }
  /**
   * Alias to parents(). Use to go "up" the tree when chaining.
   * @returns Collection that contains parent elements.
   */
  public up(){
    return this.parents()
  }

  /**
   * Assigns datum to every element in collection.
   * @param {any} datum Can be specified as value or function.
   * If value is specified as function, it will be called with element's(or its parent's) datum and current index inside a collection.
   * @returns Same collection.
   */
  public datum<DatumT>(datum: Evaluate<DatumT,CurrentDatumT>):Collection<CurrentPropsT, DatumT, OriginT>{
    this.elements.forEach((e,i)=>{
      e.datum = this.evaluate(datum, e.parent && e.parent.datum, i)
    })
    return this as Collection<CurrentPropsT,DatumT,OriginT>//TODO create new collection?
  }


  /* Props methods */
  /**
   * Sets prop or attribute to all elements in collection.
   * @param {string} key String key.
   * @param {string | number | Callback} value Can be specified as value or function. 
   * @returns Same collection.
   */
  public prop<Key extends keyof CurrentPropsT>(key :Key, value :Evaluate<CurrentPropsT[Key], CurrentDatumT>){
    this.elements.forEach((e,i)=>{
      e.props[key] = this.evaluate(value, e.datum, i)
    })
    return this
  }

  /**
   * Shortcut to assigns special key prop to elements in selection.
   * @param {string | number | Callback} value Should be specified as function to maintain uniquness.
   * @returns Same collection.
   */
  public keys(value :Evaluate<ReactKey, CurrentDatumT>){
    this.elements.forEach((e,i)=>{
      e.props['key'] = this.evaluate(value, e.datum, i)
    })
    return this
  }
  
  /**
   * Assings props or attributes to all elements in collection.
   * @param {Object} props Object containing key:value pairs. Values can be specified as value or function. 
   * @returns Same collection.
   */
  public props(props :Partial<{[K in keyof CurrentPropsT]:Evaluate<CurrentPropsT[K],CurrentDatumT>}>){
    this.elements.forEach((e,i)=>{
      const evaled :any = {};
      (Object.keys(props) as Array<keyof CurrentPropsT>).forEach((k)=>{
        evaled[k] = this.evaluate(props[k]!, e.datum, i)
      })
      e.props = {...e.props, ...evaled}
    })
    return this
  }

  /**
   * Sets className prop of all elements in collection.
   * @param {string} classNames String of class names splitted by ' '. 
   * @param {boolean} on Should speciefied classed be removed or added.
   * @returns Same collection.
   */
  public classed(classNames :string, on :Evaluate<boolean,CurrentDatumT> = true){//TODO add array support
    const newNames = classNames.split(' ')
    this.elements.forEach((e,i)=>{
      on = this.evaluate(on, e.datum, i)
      const names = e.props.className ? e.props.className.split(' ') : []
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
   * @param {string} value String value. Can be specified as value or function. 
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

    const findRoot = (d :Draft):Draft=>d.parent === null ? d : findRoot(d.parent)
    const _toReact = (e:Draft):ReactElement => createElement(
      e.type, 
      e.props, 
      ...e.children.map((child):ReactNode =>{
        if(typeof child === 'string'){
          return child
        }else if(child instanceof Draft){
          return _toReact(child)
        }else{
          return child.map(li=>typeof li === 'string' ? li : _toReact(li))
        }
      })
    )
    return this.elements[0] ? _toReact(findRoot(this.elements[0])) : createElement('')
  }
}

/*
 * Class representing element yet not converted to react. Not meant to be used directly, use child(), children() or append() instead.
 */
class Draft{
  props :any = {}
  children :Array<Child | Child[]> = []
  constructor(
    public type:ElementType, 
    public datum :any = null, 
    public parent :Draft|null
  ){}
}

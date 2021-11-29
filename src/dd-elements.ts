import { createElement, ElementType, ReactNode, ReactElement, FunctionComponent} from 'react'

type NotFunction = {apply?:never, bind?:never} & Object
type AnyCollection = Collection<any,any,any>
type Callback<ValueT, DatumT>= (datum :DatumT, index :number)=>ValueT
type Evaluate<ValueT, DatumT> = ValueT | Callback<ValueT, DatumT>

class Collection<CurrentPropsT, CurrentDatumT, OriginT extends AnyCollection = AnyCollection>{
  private elements :Array<Draft>
  private origin :OriginT
  private evaluate<ValueT extends NotFunction>(value :Evaluate<ValueT, CurrentDatumT>, i :number):ValueT{
    if(typeof value == 'function'){
      return value(this.elements[i]!.datum, i)
    }else{
      return value
    }
  }
  constructor(elements :Array<Draft>, parent? :OriginT){//TODO effectivly private constructor?..
    this.elements = elements || []
    this.origin = parent || new Collection([]) as OriginT
  }

  /* Children methods */
  public child<PropsT, DatumT>(
    type :ElementType<PropsT>, 
    datum? :Evaluate<DatumT,CurrentDatumT>
  ):Collection<PropsT, DatumT extends undefined ? CurrentDatumT : DatumT, this>{
    const addedElements :Array<Draft> = []
    this.elements.forEach((parent,i)=>{
      const child = new Draft(type, datum !== undefined ? this.evaluate(datum, i) : parent.datum, parent)
      addedElements.push(child)
      parent.children.push(child)
    })
    return new Collection(addedElements, this)//TODO check if it works..
  }

  public children<PropsT, DatumT>(
    type :ElementType<PropsT>, 
    data :(Array<Evaluate<DatumT,CurrentDatumT>>) | number
  ):Collection<PropsT, DatumT, this>{
    const addedElements :Array<Draft> = []
    this.elements.forEach((parent,i)=>{
      if(typeof data == 'number'){
        data = [...Array(data)].map(()=>parent.datum)
      }
      const children = data.map(datum=>new Draft(type, this.evaluate(datum,i), parent))
      addedElements.concat(children)
      parent.children.concat(children)
    })
    return new Collection(addedElements, this)
  }

  public append<PropsT, DatumT>(fragment :Collection<PropsT,DatumT>):Collection<PropsT, DatumT, this>{
    const addedElements :Array<Draft> = []
    this.elements.forEach((parent,i)=>{
      fragment.elements.forEach(e=>{
        e.parent = parent
      })
      addedElements.concat(fragment.elements)
      parent.children.concat(fragment.elements)
    })
    return new Collection(addedElements, this)
  }

  public up():OriginT{
    return this.origin
  }

  public datum<DatumT>(datum: Evaluate<DatumT,CurrentDatumT>){
    this.elements.forEach((e,i)=>{//TODO modifying?..
      e.datum = this.evaluate(datum,i)
    })
    return new Collection<CurrentPropsT, DatumT, this>(this.elements, this)//TODO no need to create new collection?
  }


  /* Props methods */
  public prop<Key extends keyof CurrentPropsT>(key :Key, value :Evaluate<CurrentPropsT[Key], CurrentDatumT>){
    this.elements.forEach((e,i)=>{
      e.props[key] = this.evaluate(value,i)
    })
    return this
  }

  public props(props :Partial<{[K in keyof CurrentPropsT]:Evaluate<CurrentPropsT[K],CurrentDatumT>}>){
    this.elements.forEach((e,i)=>{
      (Object.keys(props) as Array<keyof CurrentPropsT>).forEach((k)=>{
        const value = this.evaluate(e.props[k],i)
          e.props[k] = value !== undefined ? value : e.props[k]
      })
    })
    return this
  }

  public classed(classNames :string, on :Evaluate<boolean,CurrentDatumT>){//TODO add array support
    const newNames = classNames.split(' ')
    this.elements.forEach((e,i)=>{
      on = this.evaluate(on,i)
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

  public text(value :Evaluate<string, CurrentDatumT>){
    this.elements.forEach((e,i)=>{
      e.children.push(this.evaluate(value,i))
    })
    return this
  }

  /* React methods */
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

class Draft{
  type :ElementType
  datum :any
  props :any = {className:''}
  children :Array<Draft | string> = []
  parent :Draft|null
  constructor(type:ElementType, datum :any = null, parent :Draft|null = null){
    this.type = type
    this.datum = datum
    this.parent = null
  }
}

const getElement = <PropsT, DatumT>(type :ElementType<PropsT>, datum :(DatumT | null) = null)=>{
  const root = new Draft(type, datum, null)
  new Collection<PropsT,DatumT>([root])
}

export const withDD = <PropsT>(cb :(props :PropsT)=>AnyCollection):FunctionComponent<PropsT>=>{
  return props => cb(props).toReact()
}

export default getElement
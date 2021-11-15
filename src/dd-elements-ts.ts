import { types } from '@babel/core'
import {createElement, ElementType} from 'react'

class Draft{
  type :ElementType
  datum :any = null
  props :any = {className:''}
  children :Array<Draft | string> = []
  constructor(type:ElementType, datum? :any){
    this.type = type
    this.datum = datum ? datum : this.datum
  }
}

class Collection<CurrentPropsT, CurrentDatumT>{
  private elements :Array<Draft>
  //private root :Draft
  constructor(elements? :Array<Draft>){//TODO effectivly private constructor?..
    this.elements = elements || []
    //type && this.elements.push(new Draft(type))
  }
  /* Helper methods */
/*   private modify(cb: (element:Draft)=>Draft|Array<Draft>){
    const result = new Collection()
    result.elements = this.elements.map(cb).flat()
    return result
  } */
/*   private getOffspring(elements :Draft[]){
    const result = new Collection()
    result.elements = elements
    return result
  } */

  /* Children methods */
  public child<PropsT, DatumT>(type :ElementType<PropsT>, datum? :DatumT){
    const addedElements :Array<Draft> = []
    this.elements.forEach(parent=>{
      const child = new Draft(type, datum || parent.datum)
      addedElements.push(child)
      parent.children.push(child)
    })
    return new Collection<PropsT,DatumT extends undefined ? CurrentDatumT : DatumT>(addedElements)//TODO if it works..
  }
  public children<PropsT, DatumT>(type :ElementType<PropsT>, data :Array<DatumT>){
    const addedElements :Array<Draft> = []
    this.elements.forEach(parent=>{
      const children = data.map(datum=>new Draft(type,datum))
      addedElements.concat(children)
      parent.children.concat(children)
    })
    return new Collection<PropsT, DatumT>(addedElements)
  }
  public datum<DatumT>(datum:DatumT){
    this.elements.forEach(e=>{//TODO modifying?..
      e.datum = datum
    })
    return new Collection<CurrentPropsT, DatumT>(this.elements)//TODO no need to create new collection?
  }


  /* Props methods */
  public prop<Key extends keyof CurrentPropsT>(key :Key, value :CurrentPropsT[Key]){
    this.elements.forEach(e=>{
      e.props[key] = value
    })
    return this
  }
  public props(props :Partial<CurrentPropsT>){
    this.elements.forEach(e=>{
      e.props = {...e.props, ...props}
    })
    return this
  }
  public classed(classNames :string, on :boolean){//TODO add array support
    const newNames = classNames.split(' ')
    this.elements.forEach(e=>{
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
  public text(value :string){
    this.elements.forEach(e=>{
      e.children.push(value)
    })
    return this
  }

  /* React methods */
  public toReact(){
    
  }
}
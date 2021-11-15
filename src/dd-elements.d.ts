import  {ReactNode, ElementType} from "react"

type Evl<ValueT, DatumT> =  ValueT | Callback<ValueT, DatumT>
type Callback<ValueT, DatumT> = (datum :DatumT, index :number, element :Collection<DatumT, unknown, unknown>)=>ValueT// DOTO do we need this element param?

declare class Collection<DatumT, ParentT, PropsT>{
    merge<NewDatumT, NewParentT, NewPropsT>(collection: Collection<NewDatumT, NewParentT, NewPropsT>): Collection<DatumT | NewDatumT, ParentT | NewParentT, PropsT | NewPropsT>//TODO parent union is wrong?
    sort(comp?: Callback<boolean, DatumT>):this
    filter(cb: Callback<boolean, DatumT>):this
    other(): this //TODO  Test if works
    parents(): ParentT
    size(): number

    ////////////
    child<NewPropsT>(type:ElementType<NewPropsT>):Collection<DatumT, this, NewPropsT>
    child<NewDatumT, NewPropsT>(type: ElementType<NewPropsT>, datum: Evl<NewDatumT, DatumT>): Collection<NewDatumT, this, NewPropsT>

    children():this//TODO wrong
    children<NewDatumT, NewPropsT>(type: ElementType<NewPropsT>, data: Evl<Array<NewDatumT>, DatumT>): Collection<NewDatumT, this, NewPropsT>
    
    append<NewPropsT>(type: ElementType<NewPropsT>):Collection<DatumT, this, NewPropsT>
    append<NewDatumT, NewPropsT>(type: ElementType<NewPropsT>, datum: Evl<NewDatumT, DatumT>): Collection<NewDatumT, this, NewPropsT>
    append<NewDatumT, NewPropsT>(type: ElementType<NewPropsT>, data: Evl<Array<NewDatumT>, DatumT>): Collection<NewDatumT, this, NewPropsT>

    datum(): DatumT
    datum<NewDatumT>(value: Evl<NewDatumT, DatumT>): Collection<NewDatumT, ParentT, PropsT>

    ////////////
    type():ElementType
    type<NewPropsT>(type: Evl<ElementType<NewPropsT>, DatumT>): Collection<DatumT,ParentT,NewPropsT>

    attr(name: string): string // TODO or wider type?
    attr(name: string, value: Evl<string, DatumT>):this

    prop<Key extends keyof PropsT>(name: keyof PropsT): PropsT[Key]
    prop<Key extends keyof PropsT>(name: Key, value: Evl<PropsT[Key], DatumT>):this
    props(propsObject: Partial<{[Key in keyof PropsT]:Evl<PropsT[Key], DatumT>}>):this
    

    classed(classNames: Evl<string, DatumT>, value?: Evl<boolean, DatumT>):this
    isClassed(classNames: string): boolean
    style(name: string, value: Evl<string, DatumT>):this
    text(value: Evl<string, DatumT>):this

    ////////////
    all(): ReactNode;
}

export function wrap<PropsT>(render: (props :PropsT, e? :typeof element)=>Selection, passElement?:boolean): (props: PropsT) => ReactNode//TODO check

export function element<NewPropsT>(type: ElementType<NewPropsT>): Collection<null, null, NewPropsT>
export function element<NewDatumT, NewPropsT>(type: ElementType<NewPropsT>, data: NewDatumT): Collection<NewDatumT, null, NewPropsT>//TODO check 
export { element as e }

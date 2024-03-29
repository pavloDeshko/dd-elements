import { ElementType, ReactElement, FunctionComponent, Key as ReactKey } from 'react';
declare type NotFunction = {
    apply?: never;
    bind?: never;
} & Object | null | unknown;
declare type AnyCollection = Collection<unknown, unknown, AnyCollection>;
declare type AnyProps = {
    [key: string]: Object | null | undefined;
};
declare type Callback<ValueT, DatumT> = (datum: DatumT, index: number) => ValueT;
declare type Evaluatable<ValueT, DatumT> = ValueT | Callback<ValueT, DatumT>;
/**
 * Shortcut (alias to new Collection()) function to create Collection with single root element.
 * @param {ElementType} type Element type. Can be tag string or React component.
 * @param {any} [datum=null] Optional datum to be assigned to created element.
 * @return Collection that contains created root element.
 */
declare const e: <PropsT = AnyProps, DatumT = null>(type: ElementType<PropsT>, datum?: DatumT | undefined) => Collection<PropsT, DatumT, AnyCollection>;
export default e;
/**
 * Lets you return collection in functional component without calling toReact() method.
 * @param {Callback} cb Functional component which returns a Collection.
 * @returns Wrapped component.
 */
export declare const withData: <PropsT>(cb: (props: PropsT) => AnyCollection) => FunctionComponent<PropsT>;
/**
 * Class representing the collection of elements.
 */
export declare class Collection<CurrentPropsT = AnyProps, CurrentDatumT extends NotFunction = null, OriginT extends AnyCollection = AnyCollection> {
    private elements;
    private origin;
    private evaluate;
    /**
     * Use to create a collection with root element for your component.
     * @param {ElementType} type Element type. Can be tag string or React component.
     * @param {any} [datum=null] Optional datum to be assigned to created element.
     * @return Collection that contains created root element.
     */
    constructor(type?: ElementType<CurrentPropsT>, datum?: (CurrentDatumT | null));
    private static create;
    /**
     * Appends exactly one child to every element in collection.
     * @param {ElementType} type Element type. Can be tag string or React component.
     * @param {any} [datum=null] Datum to be assigned to created element. If not specified will share its parent's datum.
     * @returns Collection which contains added elements.
     */
    child<PropsT = AnyProps, DatumT = CurrentDatumT>(type: ElementType<PropsT>, datum?: Evaluatable<DatumT, CurrentDatumT>): Collection<PropsT, DatumT, this>;
    /**
     * Appends one child for every element in data array to each element in collection. Elements will be passed to React as a list, so every should have a unique "key" prop.
     * @param {ElementType} type Element type. Can be tag string or React component.
     * @param {any[] | number} data Requiered array with datums for every element. Alternatively can be number of elements to be added.
     * @param {Callback} keys Optional function which will return value of special prop "key" for each element.
     * @returns Collection which contains added elements.
     */
    children<PropsT = AnyProps, DatumT = CurrentDatumT>(type: ElementType<PropsT>, data: (Array<Evaluatable<DatumT, CurrentDatumT>>) | number, keys?: Callback<ReactKey, DatumT>): Collection<PropsT, DatumT, this>;
    /**
     * Appends already created elements to every element in collection.
     * @param {Collection} fragment Collection of elements to be added.
     * @returns Collection which contains added elements.
     */
    append<PropsT, DatumT>(fragment: Collection<PropsT, DatumT>): Collection<PropsT, DatumT, this>;
    /**
     * Use to go "up" the tree when chaining.
     * @returns Collection that contains parent elements.
     */
    parents(): OriginT;
    /**
     * Alias to parents(). Use to go "up" the tree when chaining.
     * @returns Collection that contains parent elements.
     */
    up(): OriginT;
    /**
     * Assigns datum to every element in collection.
     * @param {any} datum Can be specified as value or function.
     * If value is specified as function, it will be called with element's(or its parent's) datum and current index inside a collection.
     * @returns Same collection.
     */
    datum<DatumT>(datum: Evaluatable<DatumT, CurrentDatumT>): Collection<CurrentPropsT, DatumT, OriginT>;
    /**
     * Sets prop or attribute to all elements in collection.
     * @param {string} key String key.
     * @param {string | number | Callback} value Can be specified as value or function.
     * @returns Same collection.
     */
    prop<Key extends keyof CurrentPropsT>(key: Key, value: Evaluatable<CurrentPropsT[Key], CurrentDatumT>): this;
    /**
     * Shortcut to assigns special key prop to elements in selection.
     * @param {string | number | Callback} value Should be specified as function to maintain uniquness.
     * @returns Same collection.
     */
    keys(value: Evaluatable<ReactKey, CurrentDatumT>): this;
    /**
     * Assings props or attributes to all elements in collection.
     * @param {Object} props Object containing key:value pairs. Values can be specified as value or function.
     * @returns Same collection.
     */
    props(props: Partial<{
        [K in keyof CurrentPropsT]: Evaluatable<CurrentPropsT[K], CurrentDatumT>;
    }>): this;
    /**
     * Sets className prop of all elements in collection.
     * @param {string} classNames String of class names splitted by ' '.
     * @param {boolean} on Should speciefied classed be removed or added.
     * @returns Same collection.
     */
    classed(classNames: string, on?: Evaluatable<boolean, CurrentDatumT>): this;
    /**
     * Appends text to all elements in collection.
     * @param {string} value String value. Can be specified as value or function.
     * @returns Same collection.
     */
    text(value: Evaluatable<string, CurrentDatumT>): this;
    /**
     * Converts the whole tree to which selected elements belong to valid React elements.
     * To be called before returning in functional component or render function.
     * @returns React Elements tree.
     */
    toReact(): ReactElement;
}
//# sourceMappingURL=index.d.ts.map
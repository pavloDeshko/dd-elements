import Renderer, {ReactTestInstance} from "react-test-renderer"
import {createElement, ReactElement} from "react"

import Collection, {withData} from './lib/index'

const render = (el :ReactElement):ReactTestInstance=>{
  return Renderer.create(el).root
}

test.skip('playground', ()=>{
  const col = new Collection()
  expect(col.up).toBe(col.child)
  const result = render(new Collection('div')
    .children('div',[11,12,13])
    .prop('key',d=>d)
    .toReact()
  )
})

test('setup',()=>{
  expect(true).toBeTruthy()
  expect([Collection,withData]).toBeDefined()
})

describe('new Collection()',()=>{
  test('empty',()=>{
    const root = render(new Collection().toReact())
    expect(root.type).toBe('')
    expect(root.children.length).toBe(0)
  })
  test('div',()=>{
    const root = render(new Collection('div').toReact())
    expect(root.type).toBe('div')
  })
  test('component',()=>{
    const Comp = (props:{a:number})=>null
    const root = render(new Collection(Comp).toReact())
    expect(root.type).toBe(Comp)
  })
  test('with datum and prop',()=>{//PROP
    const root = render(new Collection('div',42)
      .prop('fromDatum',(d)=>d) 
      .toReact()
    )
    expect(root.props['fromDatum']).toBe(42)
  })
})

describe('appends',()=>{
  test('child',()=>{
    const root = render(new Collection('div')
      .child('div')
      .prop('fromDatum', d=>d)
      .toReact()
    )//TODO defaults?
    expect((root.children[0] as ReactTestInstance).type).toBe('div')
    expect((root.children[0] as ReactTestInstance).props['fromDatum']).toBe(null)
  })
  test('child with datum',()=>{
    const Comp = (props:{fromDatum:number})=>null
    const root = render(new Collection('div')
      .child(Comp,42)
      .prop('fromDatum', d=>d)
      .toReact()
    )
    expect((root.children[0] as ReactTestInstance).props['fromDatum']).toBe(42)
  })
  test('children by number',()=>{
    const root = render(new Collection('div').children('div', 10).toReact())
    expect(root.children.length).toBe(10)
  })
  test('children by data',()=>{
    const root = render(new Collection('div')
      .children('div', [1,2,3,4,5])
      .prop('fromDatum', d=>d)
      .toReact()
    )
    expect(root.children.length).toBe(5)
    expect((root.children[4] as ReactTestInstance).props['fromDatum']).toBe(5)
  })
  test('childern with keys', ()=>{
    const result =  new Collection('div')
      .children('span',[1,2,3],d=>d+10)
      .toReact()
      //expect(result.props.children[0].props['key']).toEqual(11) //How to acsess special key prop? TODO
  })
  test('append',()=>{
    const root = new Collection('div').classed('class')
    const children = new Collection('div').children('span',12)
    
    const result = render(root.append(children).toReact())
    expect(result.props.className).toContain('class')
    expect(result.children.length).toEqual(12)
  })
  test('up',()=>{
    const collection = new Collection()
    const result = new Collection('div')
      .child('span')
      .up()
      .prop('prop',42)
      .toReact()

    const root = render(result)
    expect(root.props['prop']).toBe(42)
    expect(collection.up).toBe(collection.parents)
  })
  test('up on root', ()=>{//TODO
    const empty = render(new Collection('div').up().toReact())
    expect(empty.type).toBe('')
  })
})

describe('datum assign',()=>{
  test('manual datum', ()=>{
    const result = render(new Collection('div')
      .datum(42)
      .prop('fromDatum',d=>d)
      .toReact()
    )
    expect(result.props['fromDatum']).toEqual(42)
  })
  test('inherit', ()=>{
    const result = render(new Collection('div',42)
      .child('div')
      .children('div',10)
      .prop('fromDatum', d=>d)
      .toReact()
    )
    expect(((result.children[0] as ReactTestInstance).children[5] as ReactTestInstance).props['fromDatum']).toBe(42)
  })
})

describe('props',()=>{
  test('prop',()=>{
    const result = render(new Collection('div','fortyTwo')
      .prop('prop',42)
      .prop('fromDatum',(d:string)=>d)
      .toReact()
    )
    expect(result.props['prop']).toBe(42)
    expect(result.props['fromDatum']).toBe('fortyTwo')
  })
  test('props',()=>{
    const result = render(new Collection('div',42)
      .props({a:1, b:2, fromDatum:d=>d})
      .toReact())
    expect(result.props).toMatchObject({a:1, b:2, fromDatum:42})
  })
  test('classed',()=>{
    const result = render(new Collection('div',true)
      .classed('class1 class2', true)
      .classed('class1')
      .classed('class3 class1')
      .classed('class2', (d:boolean)=>!d)
      .toReact()
    ).props.className

    expect(result.match(/class1/g).length).toBe(1)
    expect(result).toContain('class3')
    expect(result).not.toContain('class2')

  })
  test('text',()=>{
    const result = render(new Collection('div', 'fromDatum')
      .text('foobar')
      .text((d:string)=>d)
      .toReact()
    )
    expect(result.children[0]).toBe('foobar')
    expect(result.children[1]).toBe('fromDatum')
  })
})

describe('hoc',()=>{
  test('valid',()=>{
    const Comp = withData(()=>{
      const result = new Collection('div')
      return result //TODO
    })
    const result = render(createElement(Comp))
    expect(result.type).toBe(Comp)
  })
})


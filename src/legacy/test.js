const dde = require("./dd-elements.js" )
const e = dde.element
const create = require('react-test-renderer').create
const render = function(el){return create(el).root}
const {isValidElement, createElement} = require('react')


test("Smoke test", ()=>{
  expect(e).toBeDefined()
})

test('Element',()=>{
	expect(e).toBe(dde.element)
	
	let div = e('div').all()
	let comp = e(TestComponent).all()
	let nonValid = e('span')
	
	expect(isValidElement(div)).toBe(true)
	expect(render(div).type).toBe('div')
	expect(isValidElement(comp)).toBe(true)
	expect(render(comp).type).toBe(TestComponent)
	expect(isValidElement(nonValid)).toBe(false)
})


describe('Appends',()=>{
	test('Child',()=>{
		let div = e('div')
		div.child('div')
		  .child('span')
			.prop('datum',d=>d)
		div.child(TestComponent)
		
		let result = render(div.all())
		
		expect(result.children.length).toBe(2)
		expect(result.children[0].type).toBe('div')
		expect(result.children[1].type).toBe(TestComponent)
		expect(result.children[0].children.length).toBe(1)
		expect(result.children[0].children[0].type).toBe('span')
	})

	test('Children',()=>{ 
		let result = render(
		         e('div')
		        .children('span',[11,12,13])
			    .prop('datum',d=>d)
			    .all()
		)
		expect(4)
		expect(result.children.length).toBe(3)
		expect(result.children.map(ch=>ch.props['datum'])).toMatchObject([11,12,13])
	})
	
	test('Append() alias',()=>{
	    let div = e('div')
		div.append('div','datum')
		  .prop('datum',d=>d)
		div.append('span', [1,2,3])
		  .prop('datum',d=>d)
		div.append('input', ()=>[11,12])
		
		let result = render(div.all())
		expect(result.children.length).toBe(6)
		expect(result.children[0].props['datum']).toBe('datum')
	})
	
    test('Invalid data',()=>{
		expect(()=>e('div').children('span',42)).toThrow()
	})
	
	test('Multiple groups bind',()=>{
		let result = render(e('div')
		  .children('div',[1,2,3])
			.children('span',(d,i)=>[i*10+1,i*10+2,i*10+3])
			  .prop('datum',d=>d)
			  .all()
		)
		expect(3)
		expect(result.children[2].children.map(span=>span.props['datum'])).toMatchObject([21,22,23])
	})
    
	test('Empty data array and empty selection all()',()=>{
		let result = render(e('div').children('span',[]).all())
		expect(result.children.length).toBe(0)
	})
})

describe('Datum operations',()=>{
	test('Datum change',()=>{
		let d = {a:1,b:2}
		let div = e('div')
		div.datum(d)
		  .prop('datum',d=>d)
		  .child('span')//should be changed
			 .datum('changed_datum')
			 .prop('datum',d=>d)
		div.child('span')//should be selected from parent's
			   .datum(d=>d['a'])
			   .prop('datum',d=>d)
		div.child('span')//should inherit
			   .prop('datum',d=>d)
			   
		let result = render(div.all())
		
		expect(result.props['datum']).toMatchObject(d)
		expect(result.children[0].props['datum']).toBe('changed_datum')
		expect(result.children[1].props['datum']).toBe(d['a'])
		expect(result.children[2].props['datum']).toMatchObject(d)
	})
	
	
	test('Element() datum, and datum value',()=>{
		expect(e('div','datum').datum()).toBe('datum')
	})
})

describe('Modifying',()=>{
	extendExpect()
	test('Modify elements',()=>{
		let div = e('div')
		let spans =  div.children('span',new Array(3))
		
		modify(div)
		modify(spans)
		
		let result = render(div.all())
		expect(4)
		expect(result).toBeModified()
		result.children.forEach(ch=>expect(ch).toBeModified())
	})

	test('Modified with datum',()=>{
		let root_datum = 'root_datum'
		let nodes_datum = ['a','b','c']
		
		let div = e('div')
		  .datum(root_datum)
		let spans =  div.children('span', nodes_datum)
		
		modifyWithDatum(div)
		modifyWithDatum(spans)
		
		let result = render(div.all())
		expect(4)
		expect(result).toBeModifiedWithDatum(root_datum,0)
		result.children.forEach((ch,i)=>expect(ch).toBeModifiedWithDatum(nodes_datum[i],i))

	})

	test('Change type', ()=>{
	  let div = e('div')
	  let spans =  div.children('span',[1,2,3])
	  div.type('span')
	  spans.type('div')
	  expect(div.type()).toBe('span')
	  
	  let result = render(div.all())
	  expect(4)
	  expect(result.type).toBe('span')
	  result.children.forEach(ch=>expect(ch.type).toBe('div'))
	})
    
	test('Tag vs Component equality',()=>{
		let div = e('div')
		modify(div.child('span'))
		modify(div.child(TestComponent))
		
	    let props = render(div.all()).children.map(ch=>ch.props)
		expect(props[0]).toEqual(props[1])
    })
	
	test('Text',()=>{
		
		let div = e('div')
		  div.child('span')
		  div.text('foo')
		  div.child('span')
		  div.text('bar')
		let result = render(div.all())
		expect(result.children[1]).toBe('foo')
		expect(result.children[3]).toBe('bar')
	})
})

describe('Selection operations',()=>{
	test('Size',()=>{
		let div = e('div')
		expect(div.size()).toBe(1)
	    expect(div.children('span',[1,2,3]).size()).toBe(3)
	})
	
	test('Parent and children',()=>{
	   let div = e('div')
       div.text('bla')
	   let spans =  div.children('span',[1,2,3])
	   expect(div.children().size()).toBe(3)
	   expect(spans.parents().type()).toBe('div')
	})

	test('Filter, Other and Merge',()=>{
	   let div = e('div')
	   let spans =  div.children('span',[1,2,3])
	   
	   let filtered = spans.filter((d,i)=>d>=2)
	   let other = filtered.other()
	   
	   expect(filtered.size()).toBe(2)
	   expect(other.size()).toBe(1)
	   expect(other.merge(filtered).size()).toBe(3)
	})

	test('Sort',()=>{
	   let spans =  e('div')
		 .children('span',[2,1,3])
		 .attr('datum',d=>d)
		 .attr('i',(_,i)=>i)
		 
	   expect(spans.sort().datum()).toBe(1)
	   
	   let tt = spans.sort((a,b)=> a<b?1:a>b?-1:0 )
	   expect(tt.datum()).toBe(3)
	   
	   let result = render(spans.all())
	   expect(result.children.map(ch=>ch.props.datum)).toMatchObject([3,2,1])
	   expect(result.children.map(ch=>ch.props.i)).toMatchObject([2,0,1])
	})
})

test('Wrapper',()=>{
	let component = jest.fn(props=>props.e?props.e('div') : e('div'))
	let wrapped = dde.wrap(component)
	let withKey = dde.wrap(component,'e')
	
	expect(isValidElement(wrapped({a:1,b:2}))).toBe(true)
	expect(component.mock.calls[0][0]).toMatchObject({a:1,b:2})
	
/* 	expect(isValidElement(withKey({a:1,b:2}))).toBe(true)
	expect(component.mock.calls[1][0]).toMatchObject({a:1,b:2,e:expect.any(Function)}) */
})
 
//utils

function TestComponent(props){
	return createElement('div',{},props.children)
}

function modifyWithDatum(selection){
	selection
	  .attr('datum', d=>d)
	  .prop('height', (_,i)=>i)
      .classed(d=>'class_'+d)
	  .style('width',d=>'style_'+d)
	return selection
}

function modify(selection){
	selection
	  .attr('attribute', 'bla')
	  .attr('attribute', 'element_attr')
	  .attr('mod', (_,__,that)=>that.attr('attribute')+'_mod')
	  .attr('a','link')
	
	  .attr('disabled',true)
	  .attr('checked',true)
	  .attr('checked',false)
	
	  .prop('prop','element_prop')
	  
	  .props({one:1,two:2,three:()=>3})
	  
	  .classed('class1 class2', true)
	  .classed('class1')
	  .classed('class3 class1')
	  .classed('class2',false)
	
	  .style('color','Red')
	  .style('color','Blue')
      .style('float','left')
	return selection
}

function extendExpect(){
	expect.extend({
	  toBeModified:function (el){
		  try{
			var props = el.props
			
			expect(props).toMatchObject({
				attribute:'element_attr',
				mod:'element_attr_mod',
				a:'link',
				disabled:true,
				prop:'element_prop',
				one:1,two:2,three:3
			})
			expect(props.checked).toBeFalsy(),
			
			expect(props.style).toMatchObject({
				color:'Blue',
				float:'left'
			})
			
			expect(props.className.match(/class1/g).length).toBe(1) 
			expect(props.className).toContain('class3')
			expect(props.className).not.toContain('class2')
			
			return {pass:true, message:()=>'All attributes match'}
		  }catch(e){
			return {pass:false, message:()=>e.message}
		  }
	 },
	 toBeModifiedWithDatum:function (el,datum,i){
	  try{
		expect(el.props.datum).toBe(datum)
		expect(el.props.height).toBe(i)
		expect(el.props.className).toContain('class_'+datum)
		expect(el.props.style.width).toBe('style_'+datum)
		
		return {pass:true, message:()=>'All attributes match'}
	  }catch(e){
		return {pass:false, message:()=>e.message}
	  }
	}

	})
}

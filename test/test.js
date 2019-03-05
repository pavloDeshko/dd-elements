const e = require("../index.js" ).element
const render = require('react-test-renderer').create
const {isValidElement, createElement} = require('react')


test("Smoke test", ()=>{
  expect(e).toBeDefined()
})

test('e() elements',()=>{
	let div = e('div').all()
	let comp = e(TestComponent).all()
	let nonValid = e('span')
	
	expect(isValidElement(div)).toBe(true)
	expect(render(div).type).toBe('div')
	expect(isValidElement(comp)).toBe(true)
	expect(render(comp).type).toBe(TestComponent)
	expect(isValidElement(nonValid)).toBe(false)
})

test('Tag vs Component equality',()=>{
	let div = modify(e('div').append('span',new Array(3)))
	let comp = modify(e(TestComponent).append('span',new Array(3)))
	
	let result = [render(div.all()),render(comp.all())].forEach(r=>{delete r.type})
	expect(result[1]).toEqual(result[2])
})

expect.extend({toBeModified:function (el){
  try{
	var props = el.props
	
	expect(props).toMatchObject({
		key:'element_key',
		a:'link',
		disabled:true,
		prop:'element_prop'
	})
	expect(props.checked).toBeFalsy(),
	
	expect(props.style).toMatchObject({
		color:'Blue',
		float:'left'
	})
	
	expect(props.className.match(/class1/g).length).toBe(1) 
	expect(props.className).toContain('class3')
	expect(props.className).not.toContain('class2')
	
	return {pass:true, message:'All attributes match'}
  }catch(e){
	return {pass:false, message:e.message}
  }
 },
 toBeModifiedWithDatum:function (el,datum,i){
  try{
	expect(el.props.datum).toBe(datum)
	expect(el.props.height).toBe(i)
	expect(el.props.className).toContain('class_'+datum)
	expect(el.props.style.width).toBe('style_'+d)
	expect(el.props.key_mod).toBe('element_key_mod')
	return {pass:true, message:'All attributes match'}
  }catch(e){
	return {pass:false, message:e.message}
  }
}

})

test('Modify elements',()=>{
	let div = e('div')
	let spans =  div.append('span',new Array(3))
	
	modify(div)
	modify(spans)
	
	let result = render(div.all())
	expect(result).toBeModified()
	result.children.forEach(ch=>expect(ch).toBeModified())
})

test('Modified with datum',()=>{
	let root_datum = 'root_datum'
	let nodes_datum = ['a','b','c']
	
	let div = e('div')
      .datum(root_datum)
	let spans =  div.append('span', nodes_datum)
	
	modifyWithDatum(div)
	modifyWithDatum(spans)
	
	let result = render(div.all())
	expect(result).toBeModifiedWithDatum(root_datum,0)
	result.children.forEach((ch,i)=>expect(ch).toBeModifiedWithDatum(nodes_datum[i],i))

})

test('Change type', ()=>{
  let div = e('div')
  let spans =  div.append('span',new Array(3))
  
  div.type('span')
  spans.type('div')
  expect(div.type()).toBe('span')
  
  let result = render(div.all())
  expect(result.type).toBe('span')
  result.children.forEach(ch=>expect(ch.type).toBe('div'))
})

//uses datum()
test('Append single',()=>{
	let div = e('div')
	div.datum(111)
	div.append('div')
	  .append('span')
	    .prop('datum',d=>d)
	div.append(TestComponent)
	
	let result = render(div.all())
	
	expect(result.children.length).toBe(2)
	expect(result.children[0].type).toBe('div')
	expect(result.children[1].type).toBe(TestComponent)
	expect(result.children[0].children.length).toBe(1)
	expect(result.children[0].children[0].type).toBe('span')
	expect(result.children[0].children[0].props[datum]).toBe(111)
	
})

test('Append with bind',()=>{
	let result = render(
	  e('div')
	  .append('span',[11,12,13])
		  .prop('datum',d=>d)
		  .all()
    )
	expect(result.children.length).toBe(3)
	expect(result.children.map(ch=>ch.props[datum])).toMatchObject([11,12,13])
})

test('Multiple groups bind',()=>{
	let result = render(e('div')
	  .append('div',new Array(3))
	    .append('span',(d,i)=>[i*10+1,i*10+2,i*10+3])
		  .prop('datum',d=>d)
		  .all()
    )
    expect(result.children[2].children.map(span=>span.props[datum])).toMatchObject([21,22,23])
})

//uses parent(), append()
test ('Datum change',()=>{
	let result = render(
		e('div')
		 .datum({a:1,b:2})
		 .prop(datum,d=>d)
		 .append('span')
		   .datum(111)
		   .prop(datum,d=>d)
		 .parent()
		 .append('span')
		   .datum(d=>d[a])
		   .prop(datum,d=>d)
		 .append('span')
		   .prop(datum,d=>d)
		   .all()
	)
	expect(result.children[0].props[datum]).toBe(111)
	expect(result.children[1].props[datum]).toBe(1)
	expect(result.children[2].props[datum]).toMatchObject({a:1,b:2})
})


test('Parent and children',()=>{
   let div = e('div')
   let spans =  div.append('span',[1,2,3])
   
   expect(div.children().length()).toBe(3)
   expect(div.children().parent().length()).toBe(1)
   expect(spans.parent().type()).toBe('div')
})

test('Filter and Merge',()=>{
   let div = e('div')
   let spans =  div.append('span',[1,2,3])
   
   let filtered = spans.filter((d,i)=>d>=2)
   let other = filtered.other()
   
   expect(filtered.length()).toBe(2)
   expect(other.length()).toBe(1)
   expect(other.merge(filtered).length()).toBe(3)
})

test('Sort',()=>{
   let spans =  e('div')
     .append('span',[2,1,3])
	 .attr('datum',d=>d)
	 .attr('i',_,i=>i)
	 
   spans.sort()
   expect(spans.datum()).toBe(1)
   
   spans.sort((a,b)=> a<b?1:a>b?-1:0 )
   expect(spans.datum()).toBe(3)
   
   let result = render(spans.all())
   expect(result.children.map(ch=>props.datum)).toMatchObject([3,2,1])
   expect(result.children.map(ch=>props.i)).toMatchObject([2,0,1])
})
 
function TestComponent(props){
	return createElement('div',{},props.children)
}
function modifyWithDatum(selection){
	selection.attr('datum', d=>d)
	  .prop('height', (_,i)=>i)
      .classed(d=>'class_'+d)
	  .style('width',d=>'style_'+d)
      .attr('key_mod',function(){return this.attr('key')+'_mod'})
}

function modify(selection){
	selection.attr('key', 'bla')
	  .attr('key', 'element_key')
	  .attr('a','link')
	
	  .attr('disabled',true)
	  .attr('checked',true)
	  .attr('checked',false)
	
	  .prop('prop','element_prop')
	
	  .classed('class1 class2', true)
	  .classed('class1')
	  .classed('class3 class1')
	  .classed('class2',false)
	
	  .style('color','Red')
	  .style('color','Blue')
      .style('float','left')
}


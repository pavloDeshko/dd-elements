module.exports = {element, e: element, wrap}
createElement = require('react').createElement

function element(type, data){
	let elem = draft(type)
	let selection = new Selection([elem],elem)
	if(data) selection.datum(data)
	return selection
}

class Selection {
	constructor(elems,root,other){
		this.elems = elems || []
		this.root = root
		this.otherElems = other || []
	}
	offspring(elems){
		return new Selection(elems,this.root)
	}
	evl(value,elem,i){
		return typeof value == 'function' ? value(elem.datum,i,this.offspring([elem])) : value
    }
	parent(){
		return this.offspring([this.elems[0].parent])
	}
	size(){
		return this.elems.length
	}
	merge(sel){
		return this.offspring(this.elems.concat(sel.elems))
	}
	sort(comp){
		this.elems.slice().sort(comp ? (a,b)=>comp(
		    a.datum,b.datum,this.offspring([a]),this.offspring([b])
		  ) : (a,b)=>{
			if(a.datum>b.datum) return 1
			else if (a.datum<b.datum) return -1
			else return 0
		})
	}
	filter(cb){
		let result = []
		let other = []
		this.elems.forEach((el,i)=>{
			if( cb(el.datum,i,this.offspring([el])) ) result.push(el) 
		    else other.push(el)
		})
	    return new Selection(result, this.root, other)
	}
	other(){
		return this.offspring(this.otherElems)
	}
	all(){
		return toReact(this.root)
	}
	child(type, datum){
		return this._append(type,datum,false)
	}
	children(type, data){
		if (arguments.length == 0) return this.offspring(this.elems.reduce(
		  (result,el)=>result.concat(el.children)
		,[]))
		return this._append(type,data,true)
	}
	append(type,data){
		return this._append(type,data,undefined)
	}
	_append(type, data, mult){
		let result = []
		this.elems.forEach((el,i)=>{
			let locData = this.evl(data,el,i)
			if(mult && !Array.isArray(locData)) throw new Error('Second argument to selection.children() must be an array')
			else if (mult === false) locData = [locData]
		    else if (mult === undefined && !Array.isArray(locData)) locData = [locData]
			
			locData.forEach(datum=>{
				let newDraft = draft(type, el)
		        newDraft.datum = datum ? this.evl(datum,el,i) : el.datum
		        el.children.push(newDraft)
	  	        result.push(newDraft)
			})
		})
		return this.offspring(result)
	}
	datum(value){
		if(value===undefined) return this.elems[0] ? this.elems[0].datum : undefined
		this.elems.forEach((el,i)=>{
			el.datum = this.evl(value,el,i)
		})
		return this
	}
	
	type(value){
		if(value===undefined) return this.elems[0] ? this.elems[0].type : undefined
		this.elems.forEach((el,i)=>el.type=this.evl(value,el,i))
	    return this
	}
	attr(name, value){
	  if(value===undefined) return this.elems[0] ? this.elems[0].props[name] : undefined
	  this.elems.forEach((el,i)=>el.props[name]=this.evl(value,el,i))
	  return this
	}
	prop(){
		return this.attr(...arguments)
	}
	classed(string, value = true){
		this.elems.forEach((el,i)=>{
		  let names = this.evl(string,el,i).split(' ')
		  let classes = el.props.className.split(' ')
		  names.forEach(name=>{
			  let locValue = this.evl(value,el,i)
			  let ii = classes.indexOf(name)
			  if(ii == -1 && locValue) classes.push(name)
			  if(ii != -1 && !locValue) classes.splice(ii,1)
		  })
	      el.props.className=classes.join(' ')
		})
		return this
	}
	isClassed(names){
		if (this.elem.length==0) return false
		let result = true
		this.elems[0].props.className.split(' ')
		names.split(' ').forEach(value=>{if(!classes.includes(value))result=false})
		return result
	}
	style(name,value){
		if(value===undefined) return this.elems[0] ? this.elems[0].props.style[name] : undefined
		this.elems.forEach((el,i)=>el.props.style[name]=this.evl(value,el,i))
		return this
	}
}


function draft(type,parent){
	return {
		type,
		props:{style:{},className:''},
		children:[],
        parent: (parent || null),
        datum:null		
	}
}
function toReact(draft){
	if(!draft) return undefined
	return createElement(draft.type, draft.props, draft.children.map(toReact))
}

function wrap(cb, key){
	return function(props){
		return cb(key ? Object.assign({},props || {},{[key]:element}) : props).all()
	}
}


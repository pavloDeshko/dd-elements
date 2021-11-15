module.exports = {element, e: element, wrap}
const createElement = require('react').createElement

function element(type, data){
	let elem = draft(type)
	let selection = new Collection([elem],elem)
	if(data) selection.datum(data)
	return selection
}

class Collection {
	constructor(elems,root,other){
		this._elems = elems || []
		this._root = root
		this._parents = []
		elems.forEach(el=>this._parents.includes(el.parent)?'_':this._parents.push(el.parent))
		this._otherElems = other || []
	}
	_offspring(elems){
		return new Collection(elems,this._root)
	}
	_evl(value,elem,i){
		return typeof value == 'function' ? value(elem.datum,i,this._offspring([elem])) : value
  }
	parents(){
		return this._offspring(this._parents)
	}
	size(){
		return this._elems.length
	}
	merge(sel){
		return this._offspring(combine(this._elems,sel._elems))
	}
	sort(comp){
		let groups = new Array(this._parents.length).fill([])
		let indexes = new Array(this._parents.length).fill([])
		let sorted = []
		
		this._elems.forEach(el=>{
			let y = this._parents.indexOf(el.parent)
			groups[y].push(el)// O2 on parents!
			indexes[y].push(el.parent.children.indexOf(el))
		})
		
		indexes.forEach(group=>group.sort())
		
		groups.forEach((group,i)=>{
			sorted[i] = group.slice().sort(comp ? 
			  (a,b)=>comp(a.datum,b.datum,this._offspring([a]),this._offspring([b])) 
			  :(a,b)=>{
			    if(a.datum>b.datum) return 1
			    else if (a.datum<b.datum) return -1
			    else return 0
		      }
			)
		})
		
		sorted.forEach((group,i)=>{
			group.forEach((el,ii)=>{
				let pos = indexes[i][ii]
				this._parents[i].children[pos] = el
			})
		})
		return this._offspring([].concat(...sorted))
	}
	filter(cb){
		let result = []
		let other = []
		this._elems.forEach((el,i)=>{
			if( cb(el.datum,i,this._offspring([el])) ) result.push(el) 
		    else other.push(el)
		})
	    return new Collection(result, this._root, other)
	}
	other(){
		return this._offspring(this._otherElems)
	}
	all(){
		return toReact(this._root)
	}
	child(type, datum){
		return this._append(type,datum,false)
	}
	children(type, data){
		if (arguments.length == 0) return this._offspring(this._elems.reduce(
		  (result,el)=>result.concat(el.children.filter(child=>(typeof child) != 'string'))//filtering text (non-draft) nodes
		,[]))
		return this._append(type,data,true)
	}
	append(type,data){
		return this._append(type,data,undefined)
	}
	_append(type, data, mult){//TODO remove error
		let result = []
		this._elems.forEach((el,i)=>{
			let locData = this._evl(data,el,i)
			if(mult && !Array.isArray(locData)) throw new Error('Second argument to selection.children() must be an array')
			else if (mult === false) locData = [locData]
		    else if (mult === undefined && !Array.isArray(locData)) locData = [locData]
			
			locData.forEach(datum=>{
				let newDraft = draft(type, el)
		        newDraft.datum = datum ? this._evl(datum,el,i) : el.datum
		        el.children.push(newDraft)
	  	        result.push(newDraft)
			})
		})
		return this._offspring(result)
	}
	datum(value){
		if(value===undefined) return this._elems[0] ? this._elems[0].datum : undefined
		this._elems.forEach((el,i)=>{
			el.datum = this._evl(value,el,i)
		})
		return this
	}
	
	type(value){
		if(value===undefined) return this._elems[0] ? this._elems[0].type : undefined
		this._elems.forEach((el,i)=>el.type=this._evl(value,el,i))
	    return this
	}
	attr(name, value){
	  if(value===undefined) return this._elems[0] ? this._elems[0].props[name] : undefined
	  this._elems.forEach((el,i)=>el.props[name]=this._evl(value,el,i))
	  return this
	}
	prop(){
		return this.attr(...arguments)
	}
	props(props){
		for(let key in props){
			this.attr(key,props[key])
		}
		return this
	}
	classed(string, value = true){
		this._elems.forEach((el,i)=>{
		  let names = this._evl(string,el,i).split(' ')
		  let classes = el.props.className.split(' ')
		  names.forEach(name=>{
			  let locValue = this._evl(value,el,i)
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
		this._elems[0].props.className.split(' ')
		names.split(' ').forEach(value=>{if(!classes.includes(value))result=false})
		return result
	}
	style(name,value){
		if(value===undefined) return this._elems[0] ? this._elems[0].props.style[name] : undefined
		this._elems.forEach((el,i)=>el.props.style[name]=this._evl(value,el,i))
		return this
	}
	text(value){
		this._elems.forEach((el,i)=>el.children.push(this._evl(value,el,i)))
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
	if(typeof draft == 'string') return draft
	return createElement(draft.type, draft.props, draft.children.map(toReact))
}

function combine(ar1,ar2){
	let result = ar1.slice()
	ar2.forEach(el=>ar1.includes(el)? null : result.push(el))
	return result
}

function wrap(cb, passElement){
	return function(props){
		return cb(props, passElement ? element : undefined).all()
	}
}



var OPERATORS=['+','-','*','/']
// Array addition code


function compute_arrays(x, y, operator) {
	new_l = [];
	for(i=0; i<x.length; i++) {
		val = undefined
		if (operator=="+") { val = x[i]+y[i]; }
		if (operator=="-") { val = x[i]-y[i]; }
		if (operator=="*") { val = x[i]*y[i]; }
		if (operator=="/") { val = x[i]/y[i]; }
		new_l.push(val)
	}
	return new_l
}

function vector_add(x, y) { return compute_arrays(x,y,'+') }
function vector_subtract(x, y) { return compute_arrays(x,y,'-') }
function vector_divide(x, y) { return compute_arrays(x,y,'/') }
function vector_multiply(x, y) { return compute_arrays(x,y,'*') }

function make_vec(x) {
  return {
		valueOf: function() {
			r=Array(x)
			console.log(r)
			return r;
		}
	};
}


function parse_parens(txt) {
		var a = [], r = [];
	//var txt = "(((a-b)+(f-g))/month)/(c+d)";
	for(var i=0; i < txt.length; i++){
			if(txt.charAt(i) == '('){
					a.push(i);
			}
			if(txt.charAt(i) == ')'){
					r.push(txt.substring(a.pop()+1,i));
			}
	}

	return r;
}



function tokenize(str) {
	return str.replace(/[^\w\s]/g, function ($1) { return ' ' + $1 + ' ';}).replace(/[ ]+/g, ' ').split(' ');
	// return str.replace("/(?=\S*['-])([a-zA-Z'-]+)/")
	// return str.replace(/[^\s-]+-?)
}


function get_terms_from_formula(formula,operators=OPERATORS) {
	var terms=[];

	toks=tokenize(formula);
	console.log('toks',toks);

	toks.forEach(function(tok){
		// if(allLetter(tok)) {
		if (!operators.includes(tok)) {
			terms.push(tok)
		}
	});

	return terms;
}

function parse_formula(formula,vecs,suffix='',operators=OPERATORS) {

	formula = '('+formula+')'
	console.log('FORMULA:',formula)

	var VAL=undefined;
	var operator_now = undefined;

	group2vec={}
	paren_groups = parse_parens(formula)

	paren_groups_done_sofar=[]
	paren_groups.forEach(function(pgroup) {
		console.log('paren_group',pgroup)

		paren_groups_done_sofar.forEach(function(pgroup_sofar) {
			pgroup=pgroup.replace(pgroup_sofar,"").replace('()','').replace('( )','').trim()
		});
		paren_groups_done_sofar.push(pgroup)
		console.log('paren_group2',pgroup)
		pgroup_words = tokenize(pgroup);
		console.log('paren_words2',pgroup_words)


		console.log(pgroup,pgroup_words);
			pgroup_words.forEach(function(pgword,pgword_i) {
			pgword=pgword.trim();

			console.log('pgword',pgword)
			console.log('pgword_suffix',pgword+suffix)
			console.log('operator_now',operator_now)
			console.log('VAL',VAL)
			console.log('')

			if(pgword==undefined | pgword=="") {
				//
			} else if(operators.includes(pgword)) {
				operator_now=pgword.trim()
			} else if(pgword+suffix in vecs) {
				val=vecs[pgword+suffix];
				if (VAL==undefined){
					VAL=val;
				} else if(operators.includes(operator_now)) {
					// console.log('op:',operator_now,val,VAL)
					VAL = compute_arrays(VAL,val,operator_now);
					// console.log('= ',VAL);
					operator_now=undefined;
				}
			}
		});
	});

	return VAL;
}

function clear_viz() {
			$("#data_view").html("");
			$('#linegraph_spaces').html("");
			$('#linegraph').html("");
			$('#slopegraph').html("");
			$('#spaces_custom_viz').html("");
}


function cache_vars() {
	var words = $('#analyze_word').val().replace(' ','');
	var x_vec_str = $('#x_vec_custom_str').val();
	var y_vec_str = $('#y_vec_custom_str').val();
	var x_vec = $('#x_vec').val();
	var y_vec = $('#y_vec').val();

	localStorage.setItem('words',words);
	localStorage.setItem('x_vec_str',x_vec_str);
	localStorage.setItem('y_vec_str',y_vec_str);
	localStorage.setItem('x_vec',x_vec);
	localStorage.setItem('y_vec',y_vec);
}





function get_self_url(starter='/word/') {
	cmd2keys={
		'spaces':['points'],
		'custom':['points','x_vec_str','x_vec','y_vec_str','y_vec'],
		'ranks':[]
	}

	// starter=window.location.href.split('?')[0];

	cache_vars();

	url_server='http://'+window.location.href.split('/')[2].replace(/\/+$/, "")

	<!-- url_server='http://cambridgekeydata.org' -->
	url = starter
	url += get_word()
	cmd=get_cmd()
	console.log('view!',word,cmd);
	url+='?view='+cmd



	var words = $('#analyze_word').val().replace(' ','');
	var x_vec_str = $('#x_vec_str').val();
	var y_vec_str = $('#y_vec_str').val();
	var x_vec = $('#x_vec').val();
	var y_vec = $('#y_vec').val();

	console.log(words,x_vec_str,y_vec_str,x_vec,y_vec,'!!!!!!!');

	var params={} //'view':cmd}
	if(cmd == 'custom') {
		if (Boolean(x_vec_str)) { params['x_vec_str']=x_vec_str } else if (Boolean(x_vec)) { params['x_vec']=x_vec }
		if (Boolean(y_vec_str)) { params['y_vec_str']=y_vec_str } else if (Boolean(y_vec)) { params['y_vec']=y_vec }
	} else {
		params={}
	}

	if(cmd == 'custom' | cmd == 'spaces') {
		params['points']=localStorage.getItem('points')
	}

	console.log('params!!',params);
	let u = new URLSearchParams(params).toString();

	if(u){ url+='&'+u; }

	//alert(url);
	//url=url.replace(starter+"/",starter);
	URL = url_server + url;
	URL_prefix_split = URL.split('://')
	url2 = URL_prefix_split[0] + '://' + (URL_prefix_split[1].replace('//','/'))
	//alert(url2);
	return url2;
}


function split_words(_words) {
	try {
		_words_l0 = _words.split(',')
	} catch(TypeError) {
		return [];
	}
	_words_l = []
	for(wii=0; wii<_words_l0.length; wii++) {
		_words_l.push(_words_l0[wii].trim());
	}
	// console.log('split_words',_words,_words_l);
	return _words_l;
}

function desc_neighb(_word,_period) {
	$.getJSON('/static/data/db/neighborhoods/COHA_30yr/'+_word+'.json', function(json) {
		//_period=_period.toString() + '-' + (parseInt(_period) + 30).toString()
		////console.log(json);
		////console.log(_period, json[_period] );
		for (pwi=0; pwi<json.length; pwi++) {
			period=json[pwi][0];
			pwords=json[pwi][1];

			pstr1 = pwords.slice(0,5).join(", ")
			pstr2 = pwords.slice(5,10).join(", ")
			pstr3 = pwords.slice(10,15).join(", ")

			if (period.startsWith(_period.toString())) {
				////console.log(period,_period,pwords);
				//return pwords;

				d3v4.selectAll('.neighb_window').remove();

				svg.append("text")
						.attr("transform",
									"translate(" + ((width/2) - 200) + " ," +
																 (height + margin.top - 25 ) + ")")
						.style("text-anchor", "left")
						.attr('class','neighb_window')
						.style('text-align', 'left')
						.attr('fill',color)
						.text(pstr3);

				svg.append("text")
						.attr("transform",
									"translate(" + ((width/2) - 200) + " ," +
																 (height + margin.top - 50 ) + ")")
						.style("text-anchor", "left")
						.attr('class','neighb_window')
						.style('text-align', 'left')
						.attr('fill',color)
						.text(pstr2);

						svg.append("text")
								.attr("transform",
											"translate(" + ((width/2) - 200) + " ," +
																		 (height + margin.top - 75 ) + ")")
								.style("text-anchor", "left")
								.attr('class','neighb_window')
								.style('text-align', 'left')
								.attr('fill',color)
								.text(pstr1);

						svg.append("text")
								.attr("transform",
											"translate(" + ((width/2) - 200) + " ," +
																		 (height + margin.top - 100 ) + ")")
								.style("text-anchor", "left")
								.attr('class','neighb_window')
								.text(_word +"("+period+")")
								.style('text-align', 'left')
								.attr('fill',color)
								.attr('style','font-weight: bold;');
			}
		}
	});
}

function average_vecs(WordVecs) {
	WordVecAvgs=[];
	for(col_i=0;col_i<WordVecs[0].length;col_i++) {
		ColScores=[]
		 for(row_i=0;row_i<WordVecs.length;row_i++) {
			 ColScores.push(WordVecs[row_i][col_i]);
		 }
		ColMean = nj.array(ColScores).mean();
		WordVecAvgs.push(ColMean);
	 }
	return WordVecAvgs;
}

function get_spacetype() { res=localStorage.getItem('points'); if(res){return res;}else{return 'average';} }

function get_word() {
	current_word_form_in_input_bar = $('#analyze_word').val().replace(' ','');
	localStorage.setItem('words',current_word_form_in_input_bar);
	return current_word_form_in_input_bar;
}

function use_all_periods() { return (get_spacetype()!='average') }

function set_to_averages() {
	localStorage.setItem('points','average');
	analyze_word(view=get_cmd(), points='average');
}

function set_to_movements() {
	localStorage.setItem('points','movement');
	analyze_word(view=get_cmd(), points='movement');
}




function expand_words(word,k=2) {
	word = $('#analyze_word').val().replace(' ','');
 words = word.split(',');
 var new_words = [];
 for (i=0; i<words.length; i++) {

	 word=words[i].trim()
	$.getJSON("/static/data/db/neighborhoods/COHA_30yr/"+word+".json", function(data) {
		console.log('data',data);
		neighb = data[data.length-1][1];
		console.log('neighb',neighb);
		//neighb_words = neighb.split(', ')
		k_sofar=0;

				for (nwi = 0; nwi<neighb.length; nwi++) {
					if (k_sofar >= k) { break; }

					nw=neighb[nwi].split(" (")[0].replace("+","");

					if ((words.includes(nw) == false) & (new_words.includes(nw) == false)) {
						console.log('!',nw);
						new_words.push(nw);

						word_str = $('#analyze_word').val().replace(' ','');
						if (word_str) { word_str += ","+nw; } else { word_str=nw; }
						$('#analyze_word').val(word_str);

						k_sofar+=1;
					}
				}

		});
	}
	//$('#analyze_word').enter();


}


function get_desc(word=undefined,do_ranks=false) {
	// $("#data_view").html("<div id='command_bar'>"+cmd_bar+"</div><div id='word_bar'>");

	if (do_ranks!=false) {
		if (word==undefined) { var word=get_word(); }
		words=split_words(word)
		for(w_i=0; w_i<words.length; w_i++) {
			describe_word(words[w_i].trim());
		}
		// $("#data_view").html($("#data_view").html() + "</div>");
	}
}



	function get_ranks(words,clear=true,redirect=true,origin_id=false,popup=false) {

		if (popup ==true) {
			var clear=false;
			var redirect=false;
		} else {
			var clear = true;
			var redirect=true;
		}
		console.log('redirect',redirect);
		console.log('popup',popup);


		// if (redirect==true) { window.history.pushState({state: "dummyState"}, "Title", "/ranks/"+words.replace('#','')); }

		// $('#analyze_word').val(words);

		if (clear==true) { clear_viz(); get_desc(words,do_ranks=true); }




		if (popup == true) {
				// html = ''


				$.magnificPopup.open({
			    items: {
			      src: $('<div class="popup-fullscreen" id="ranks-popup"></div>'),
			      type: 'inline'
			  },
				showCloseBtn: true,
				closeBtnInside: true,


				callbacks: {
			  open: function() {
					// console.log('called back!', $('#ranks-popup').html());
					$('#slopegraph').html("")

					console.log(words);
					try {
						words = words.split(',');
					} catch(TypeError) {
						words = words
					}
					for(w_i=0; w_i<words.length; w_i++) { console.log('cback',words[w_i]); make_slopegraph(words[w_i].trim(),silent=false); }


					// $('#ranks-popup').html("");
					$('#ranks-popup').html('<div>' + $('#slopegraph').html() + '</div>');

					console.log('called back!', $('#ranks-popup').html(),  'slopegraph:', $('#slopegraph').html());

					$('#slopegraph').hide();

			    // $('#slopegraph').appendTo('.ranks-popup');
					// $('#slopegraph').show();
			    // console.log(item); // Do whatever you want with "item" object
			  }
			}
		});


	} else {

		words = words.split(',')
		for(w_i=0; w_i<words.length; w_i++) { make_slopegraph(words[w_i].trim(),silent=false); }
	}
}




function get_cmd() {
	return localStorage.getItem('view');
}

function resize_spaces(width) {
	$('#spaces_width').val(width);
	$('#spaces_height').val(width);
	//$('#analyze_word').enter();
	// console.log('resizing...', get_cmd(), width);
	analyze_word(); //$('#analyze_word').val(), view=get_cmd() );


}




		function get_spaces(words = undefined,clear=true,redirect=true,all_periods=undefined) {
			if (words==undefined) { var words=get_word(); }
			if (clear==true) { clear_viz();  get_desc(words,do_ranks=false); }

			$('#linegraph_spaces').html("<div id='linegraph_spaces' style='margin-top: 50px;'>"+spaces_header_html+"<div class='spaces' id='spaces_Panel1'></div> <div class='spaces' id='spaces_Panel2'></div> <div class='spaces' id='spaces_Panel3'></div> <div class='spaces' id='spaces_Panel4'></div>");

			all_periods = use_all_periods()

			make_linegraph_spaces(words,
			y_col = "Tangible (MT) <> Intangible (MT)",
			x_col = "Negative (HGI) <> Positive (HGI)",
			div_id="Panel1", x_min=-4, x_max=4,y_min=-4,y_max=4,y_mid=0,x_mid=0,
			sp_title="Abstraction vs. judgment",
			 y_col_name = "<< Concrete | Abstract >>",
			 x_col_name = "<< Negative | Positive >>",all_periods=all_periods);

			make_linegraph_spaces(words,y_col = "Weak (HGI) <> Strong (HGI)",x_col = 'Submit (HGI) <> Power (HGI)', div_id="Panel4", x_min=-4, x_max=4,y_min=-4, y_max=4,y_mid=0,x_mid=0,sp_title="Charles Osgood's semantic dimensions",y_col_name='<< Vulnerable | Powerful >>',x_col_name='<< Submission | Domination >>',all_periods=all_periods);

			make_linegraph_spaces(words,y_col = "Objective (Abs-Cluster) <> Subjective (Abs-Cluster)", x_col = "Passive (HGI) <> Active (HGI)",div_id="Panel2", x_min=-4, x_max=4,y_min=-4, y_max=4,y_mid=0,x_mid=0, sp_title="Objectivity vs. passivity",y_col_name='<< Objective | Subjective >>',x_col_name="<< Passive | Active >>",all_periods=all_periods);

			make_linegraph_spaces(words,y_col = 'Object (VG2) <> Human (VG2)', x_col = "Female (HGI) <> Male (HGI)",div_id="Panel3", x_min=-4, x_max=4,y_min=-4, y_max=4,y_mid=0,x_mid=0, sp_title="Animacy vs. gender",y_col_name = '<< Thing | Person >>',x_col_name='<< Female | Male >>',all_periods=all_periods);

		}



function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

function get_corpus(corpus) {
	$.magnificPopup.open({
  	type: 'ajax',
		items: { src: '/corpus_coha' },
		showCloseBtn: true,
		closeBtnInside: true
	});
}

function close_popups() {
	$.magnificPopup.close();
}

function show_cmd_bar(word, cmd=undefined) {

	if(cmd==undefined){cmd=get_cmd();}

	cmd_bar = "<h3><b>View</b>: <a href='#' onclick='analyze_word(view=\"ranks\")'>Ranks</a> | ";
	cmd_bar += "<a href='#' onclick='analyze_word(view=\"spaces\")'>Key Spaces</a>";
	cmd_bar += ' | <a href="#" onclick="analyze_word(view=\'custom\')">Create space</a>';
	cmd_bar += ' | <a href="#" onclick="expand_words(\''+word+'\')">Expand words</a>';
	cmd_bar +='</h3>'

	if (cmd != 'ranks') {
		cmd_bar += '<div id="space_area">';
		cmd_bar += '<h3>Semantic space</h3>'
		cmd_bar +='<h4><b>Toggle:</b> '
		cmd_bar += "<a href='#' onclick='set_to_movements()'>Movements</a> | <a href='#' onclick='set_to_averages()'>Averages</a>"
		cmd_bar +='</h4>'
		cmd_bar += '<h4><b>Size</b>: '
		cmd_bar += '<a href="#" onclick="resize_spaces(600)">Small</a>'
		cmd_bar += ' | <a href="#" onclick="resize_spaces(900)">Medium</a>'
		cmd_bar += ' | <a href="#" onclick="resize_spaces(1200)">Large</a>'
		cmd_bar+='</h4></div>'
	}

	$('#command_bar').html(cmd_bar);
}





function analyze_word(view = undefined, points='average') {
	// get word input
	$('#analyze_word').val($('#analyze_word').val().replace(' ',''))
	word = get_word();
	console.log('analyze_word',word,view,points);





	//

	clear_viz();
	points = get_spacetype();

	//console.log('points',points);

	$.magnificPopup.close();
	if (view==undefined | view=="") { view = get_cmd(); }

	// if (word==undefined) { var word=get_word(); }
	console.log('word::::',word);

	show_cmd_bar(word,view);




	words = word.split(',');








	if (view==undefined) { var view=get_cmd(); }
		all_periods = use_all_periods()
		if (view == "spaces") {
			$('#custom_spaces').hide();
			$('#custom_opts_table').hide();
			localStorage.setItem('view','spaces')
			get_spaces(word, all_periods=all_periods);

		} else if (view == "ranks") {
			localStorage.setItem('view','ranks')
			$('#custom_opts_table').hide();
			$('#custom_spaces').hide();
			get_ranks(word,popup=false);

		} else if (view == "custom") {
			localStorage.setItem('view','custom')
			$('#custom_opts_table').show();
			$('#custom_spaces').show();
			custom_spaces(word,all_periods=all_periods);

		} else {
			localStorage.setItem('view','spaces')
			$('#custom_opts_table').hide();
			$('#custom_spaces').hide();
			get_spaces(word,all_periods=all_periods)
	  }

		cache_vars();
		var url=get_self_url();
		console.log('URL??',url);
		window.history.pushState({state: "dummyState"}, "Title", url);
		$('#footer').html('<hr/><small>[Cite: <a href="'+url+'" target="_blank">'+url+'</a></small>]')

}

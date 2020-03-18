
// size_html = '<div id="space_area">';
// size_html += '<h3>Semantic space</h3>'
// size_html +='<h4><b>Toggle:</b> '
// size_html += "<a href='#' onclick='set_to_movements()'>Movements</a> | <a href='#' onclick='set_to_averages()'>Averages</a>"
// size_html +='</h4>'
// size_html += '<h4><b>Size</b>: '
// size_html += '<a href="#" onclick="resize_spaces(600)">Small</a>'
// size_html += ' | <a href="#" onclick="resize_spaces(900)">Medium</a>'
// size_html += ' | <a href="#" onclick="resize_spaces(1200)">Large</a>'
// size_html+='</h4></div>'

size_html=''






var spaces_header_html = size_html;

var IFN_DIR = "/static/data/db/spaces/COHA/"

function make_linegraph_spaces(word, y_col = "Tangible (MT) <> Intangible (MT)", x_col = "Vice (HGI) <> Virtue (HGI)",
                                     div_id="spaces",x_min=-0.55, x_max=0.55, y_min=-0.55, y_max=0.55, y_mid=0,x_mid=0,sp_title="Abstraction vs. judgment",
                                     y_col_name = "", x_col_name = "",all_periods=undefined, orig_width=600, orig_height=600,
                                     attached_data = undefined,ifn_dir=IFN_DIR,words=undefined) {
	//$('#linegraph_spaces').html($('#linegraph_spaces').html() + "<div id=\"my_dataviz_"+div_id+"\"></div>");
// $('#my_dataviz').html("");
// console.log('attached data1 :',attached_data);


$('#progressbar').html("")
var bar = new ProgressBar.Circle(progressbar, {
  color: '#aaa',
  // This has to be the same size as the maximum width to
  // prevent clipping
  strokeWidth: 6,
  trailWidth: 1,
  // easing: 'easeInOut',
  duration: 0,
  text: {
    autoStyleContainer: false
  },
  from: { color: '#aaa', width: 1 },
  to: { color: '#333', width: 4 },
  // Set default step function for all animate calls
  step: function(state, circle) {
    circle.path.setAttribute('stroke', state.color);
    circle.path.setAttribute('stroke-width', state.width);

    var value = Math.round(circle.value() * 100);
    if (value === 0) {
      circle.setText('');
    } else {
      circle.setText(value+'%');
    }

  }
});
// bar.text.style.fontFamily = '"Raleway", Helvetica, sans-serif';
bar.text.style.fontSize = '1rem';
bar.animate(0.0);



console.log('midmax',[y_min,y_mid,y_max],[x_min,x_mid,x_max]);


$('#spaces_'+div_id).html( $('#spaces_'+div_id).html() + '<h3>' +sp_title + '</h3>\n');


var colors = ["#1b9e77","#d95f02","#7570b3","#e7298a","#66a61e","#e6ab02","#a6761d","#666666",
              "#1b9e77","#d95f02","#7570b3","#e7298a","#66a61e","#e6ab02","#a6761d","#666666",
              "#1b9e77","#d95f02","#7570b3","#e7298a","#66a61e","#e6ab02","#a6761d","#666666",
              "#1b9e77","#d95f02","#7570b3","#e7298a","#66a61e","#e6ab02","#a6761d","#666666",
              "#1b9e77","#d95f02","#7570b3","#e7298a","#66a61e","#e6ab02","#a6761d","#666666",
              "#1b9e77","#d95f02","#7570b3","#e7298a","#66a61e","#e6ab02","#a6761d","#666666",
              "#1b9e77","#d95f02","#7570b3","#e7298a","#66a61e","#e6ab02","#a6761d","#666666",
              "#1b9e77","#d95f02","#7570b3","#e7298a","#66a61e","#e6ab02","#a6761d","#666666",
              "#1b9e77","#d95f02","#7570b3","#e7298a","#66a61e","#e6ab02","#a6761d","#666666",
              "#1b9e77","#d95f02","#7570b3","#e7298a","#66a61e","#e6ab02","#a6761d","#666666",
              "#1b9e77","#d95f02","#7570b3","#e7298a","#66a61e","#e6ab02","#a6761d","#666666",
              "#1b9e77","#d95f02","#7570b3","#e7298a","#66a61e","#e6ab02","#a6761d","#666666",
              "#1b9e77","#d95f02","#7570b3","#e7298a","#66a61e","#e6ab02","#a6761d","#666666",
              "#1b9e77","#d95f02","#7570b3","#e7298a","#66a61e","#e6ab02","#a6761d","#666666",
              "#1b9e77","#d95f02","#7570b3","#e7298a","#66a61e","#e6ab02","#a6761d","#666666"];

  // set the dimensions and margins of the graph
  // // console.log('weee',$('#spaces_width').val());
  var margin = {top: 0, right: 0, bottom: 30, left: 0},

      width = parseInt($('#spaces_width').val()) - margin.left - margin.right,
      height = parseInt($('#spaces_height').val()) - margin.top - margin.bottom;
      // var width = orig_height;
      // var height = orig_width;
  // append the svg object to the body of the page
  var svg = d3v4.select("#spaces_"+div_id)
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");
  //Read the data

  var x = d3v4.scaleLinear()
    //.domain(d3v4.extent(data, function(d) { return d.date; }))
    .domain([x_min, x_max])
    .range([ 0, width ]);

  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3v4.axisBottom(x))
    .call(d3v4.axisTop(x));

  // Add Y axis
  var y = d3v4.scaleLinear()
    .domain( [y_min, y_max])
    .range([ height, 0 ]);

  svg.append("g")
    .call(d3v4.axisLeft(y));

    svg.append("g")
      .call(d3v4.axisRight(y));


              svg.append("line")
            .style("stroke", "black")
            .attr("x1", 0)
          .attr("y1", y(y_mid))
          .attr("x2", width)
          .attr("y2", y(y_mid));

          svg.append("line")
        .style("stroke", "black")
        .attr("x1", x(x_mid))
        .attr("y1", 0)
        .attr("x2", x(x_mid))
        .attr("y2", height);


function do_word(svg,word,color,w_i,x_col,y_col,x_min,x_max,y_min,y_max,all_periods=undefined,ifn_dir=IFN_DIR,attached_data=undefined) {
  // console.log('do_words(',word,color,w_i,attached_data,')');
  // console.log('do_word_all_periods',all_periods)

var successCallback =     //
  // function(d,i) {
  //
  //   // When reading the csv, I must format variables:
  //     // // console.log(d, '-->', d[0]);
  //     // d=d[0];
  //     od = { date : parseFloat(d[x_col]), value :parseFloat(d[y_col]), period:d['date'], color:color, word:word };
  //     // console.log('!',od);
  //     // // console.log('1',d[0]);
  //     // return d[0];
  //     return od;
  //
  //   },
  //   //Now I can use this dataset:
function(data) {
      d=data;


      // clean data
      for(di=0;di<data.length;di++) { data[di]['date']=parseFloat(data[di][x_col]); data[di]['value']=parseFloat(data[di][y_col]); data[di]['color']=color }

      // console.log('have',data);

      // console.log('DATA:',x_col,y_col,data);
      // if (data['value']==undefined) { return undefined; }

      data_length = data.length;
      // console.log('data_length',data_length);

        // text label for the x axis
        svg.append("text")
            .attr("transform",
                  "translate(" + (width/2) + " ," +
                                 (height + margin.top + 20) + ")")
            .style("text-anchor", "middle")
            .text(function() { if(x_col_name != "") { return x_col_name; } else { return x_col; } })
						.attr('fill','black')
            .on('click',function() { describe_field(x_col) });

        // text label for the y axis
        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left + 5)
            .attr("x",0 - (height / 2))
						.attr('fill','black')
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text(function() { if(y_col_name != "") { return y_col_name; } else { return y_col; } })
            .on('click',function() { describe_field(y_col) });

            // function get_arrow(w=30,h=30,fill="black") {
            triangleScale = d3v4.scaleLinear().domain([0,data_length]).range([2,1]);
            for (ti=0; ti<data_length; ti++) {
            svg.append("svg:defs").append("svg:marker")
                .attr("id", 'triangle_'+word+'_'+(ti+1).toString())
                .attr("refX", 6)
                .attr("refY", 6)
                .attr("markerWidth", 30)
                .attr("markerHeight", 30)
                .attr("markerUnits","userSpaceOnUse")
                .attr("orient", "auto")
                .append("path")
                .attr("d", "M 0 0 12 6 0 12 3 6")
                .style("fill", data[ti].color);
              }


      var lineScale = d3v4.scaleLinear()
        .domain([0, 1])
        .range([7, 1]);

        var lineScaleCircle = d3v4.scaleLinear()
          .domain([0, 1])
          .range([10, 3]);


      for (di=0; di<=data.length; di++) {
        dat1=d[di];
        dat2=d[di+1];

// // console.log('w_i',di,w_i,colors[w_i],color)
        if (dat1!= undefined & dat2!=undefined) {
          //// console.log(dat1.date, dat1.value, dat2.date, dat2.value);

        svg.append('line')
        .style("stroke", dat1.color)
        .style("stroke-width", lineScale((di+1)/d.length))
        .attr("x1", x(dat1.date))
        .attr("y1", y(dat1.value))
        .attr("x2", x(dat2.date))
        .attr("y2", y(dat2.value))
        .attr('class','line line_'+dat1.word);
        // .attr("marker-end", "url(#triangle_"+dat1.word+"_"+(di+1).toString()+")");

        //// console.log("triangle_"+dat1.word+"_"+(di+1).toString())

        // .enter().append("polygon")
        // point_str=x(dat1.date).toString()+','+y(dat1.value).toString() + ' ' + x(dat2.date).toString()+','+y(dat2.value).toString();
        // //// console.log(point_str)

        // svg.append('polygon').attr("points",point_str);
        }

      }

      // Add the points

      function desc_neighb(_word,_period) {
        // $('')
        $.getJSON('/static/data/db/neighborhoods/COHA_30yr/'+_word+'.json', function(json) {
          //_period=_period.toString() + '-' + (parseInt(_period) + 30).toString()
          ////// console.log(json);
          ////// console.log(_period, json[_period] );

          $('#progressbar').html("")
          var bar = new ProgressBar.Circle(progressbar, {
            color: '#aaa',
            // This has to be the same size as the maximum width to
            // prevent clipping
            strokeWidth: 6,
            trailWidth: 1,
            // easing: 'easeInOut',
            duration: 0,
            text: {
              autoStyleContainer: false
            },
            from: { color: '#aaa', width: 1 },
            to: { color: '#333', width: 4 },
            // Set default step function for all animate calls
            step: function(state, circle) {
              circle.path.setAttribute('stroke', state.color);
              circle.path.setAttribute('stroke-width', state.width);

              var value = Math.round(circle.value() * 100);
              if (value === 0) {
                circle.setText('');
              } else {
                circle.setText(value+'%');
              }

            }
          });
          // bar.text.style.fontFamily = '"Raleway", Helvetica, sans-serif';
          bar.text.style.fontSize = '1rem';
          bar.animate(0.0);



          for (pwi=0; pwi<json.length; pwi++) {
            bar.animate((pwi+1)/json.length);
            period=json[pwi][0];
            pwords=json[pwi][1];

            pstr1 = pwords.slice(0,5).join(", ")
            pstr2 = pwords.slice(5,10).join(", ")
            pstr3 = pwords.slice(10,15).join(", ")

            if (period.startsWith(_period.toString())) {
              ////// console.log(period,_period,pwords);
              //return pwords;

              d3v4.selectAll('.neighb_window').remove();

              svg.append("text")
                  .attr("transform",
                  "translate(" + 25 + " ," +
                                       (height + margin.top - 25 ) + ")")
                  .style("text-anchor", "left")
                  .attr('class','neighb_window')
                  .style('text-align', 'left')
                  .attr('fill',color)
                  .text(pstr3);

              svg.append("text")
                  .attr("transform",
                  "translate(" + 25 + " ," +
                                       (height + margin.top - 50 ) + ")")
                  .style("text-anchor", "left")
                  .attr('class','neighb_window')
                  .style('text-align', 'left')
                  .attr('fill',color)
                  .text(pstr2);

                  svg.append("text")
                      .attr("transform",
                      "translate(" + 25 + " ," +
                                           (height + margin.top - 75 ) + ")")
                      .style("text-anchor", "left")
                      .attr('class','neighb_window')
                      .style('text-align', 'left')
                      .attr('fill',color)
                      .text(pstr1);

                  svg.append("text")
                      .attr("transform",
                            // "translate(" + ((width/2)) + " ," +
                            "translate(" + 25 + " ," +
                                           (height + margin.top - 100 ) + ")")
                      .style("text-anchor", "left")
                      .attr('class','neighb_window')
                      .text(_word +" ("+period+")")
                      .style('text-align', 'left')
                      .attr('fill',color)
                      .attr('style','font-weight: bold;');
            }
          }
        });
      }

      svg
        .append("g")
        .selectAll("dot")
        .data(d)
        .enter()
        .append("circle")
          // .attr("marker-end", "url(#triangle)")
          .attr("cx", function(d) { return x(d.date) } )
          .attr("cy", function(d) { return y(d.value) } )
          // .attr("r", function(d,i) { return (data_length - i) + 2) * 1.111; } )
          .attr("r", 5) //function(d,i) { return lineScaleCircle((i+1)/data.length); })  //function(d,i) { return 3.5; } )
          // .attr("r", 5)
          .attr("stroke",color)
          .attr('stroke-width',0.5)
          .attr("fill","transparent")
          .attr('class','dot dot_'+word+' '+'dot')
          .on('mouseover', function (d, i) {
                _period=d.period;
                _word=word;
                res=desc_neighb(_word,_period);

                spaces_highlight_line(_word);
              })
              .on('mouseout', function(d,i) {
                spaces_unhighlight_lines();
              })
              .on('click', function(d,i) {
                word=word;
                get_ranks(word,clear=false,redirect=false,origin_id=false,popup=true);
                //window.open('/ranks/'+word, '_blank');
            });

        function spaces_highlight_line(word) {
          // d3.select("svg").selectAll("*:not(.b_class)");
          d3v4.selectAll('.line').transition().style('opacity', 0.25);
          d3v4.selectAll('.dot').transition().style('opacity', 0.25);
          d3v4.selectAll('.word_label').transition().style('opacity', 0.25);
          d3v4.selectAll('.word_legend').transition().style('opacity', 0.25);
          // $('.word_label').style('opacity',0);


          d3v4.selectAll('.dot_' + word).transition().style('opacity', 1);
          d3v4.selectAll('.word_label_'+word).transition().style('opacity', 1);
          d3v4.selectAll('.word_legend_'+word).transition().style('opacity', 1);
          d3v4.selectAll('.line_'+word).transition().style('opacity', 1);
          // d3v4.selectAll('.line_' + word).transition().style('opacity', 1);
        }

        function spaces_unhighlight_lines() {
          d3v4.selectAll('.line').transition().style('opacity', 1);
          d3v4.selectAll('.dot').transition().style('opacity', 1);
          d3v4.selectAll('.word_label').transition().style('opacity', 1);
          d3v4.selectAll('.word_legend').transition().style('opacity', 1);

        }

      svg.append("g")
      .selectAll("dot")
      .data(d)
      .enter()
      .append("text")
        .attr("x", function(d) { return x(d.date)+5; })
        .attr("y", function(d) { return y(d.value)-5; })
        .text(word)
        .attr('class','word_label word_label_'+word)
        .on('mouseover', function (d, i) {
            if (all_periods==false) { res=desc_neighb(word,'_total'); }
            spaces_highlight_line(word);
        })
        .on('mouseout', function(d,i) {
          spaces_unhighlight_lines();
        })
        .on('click', function(d,i) {
          // get_ranks(d.word);
          //window.open('/ranks/'+d.word, '_blank');
          get_ranks(word,clear=false,redirect=false,origin_id=false,popup=true);
      })
        .attr('fill',function() {
          if (all_periods!=false) { return 'black'; } else { return color; }
        })
        .attr('style',function(d,i) {
          if (i==(d.length-1) || i==0) {
            return "#linegraph_d"+word;
          } else {
            return "display:none;";
          }  })
        .attr("font-size", "11px");

        svg.append("g")
        .selectAll("dot")
        .data(words)
        .enter()
        .append("text")
        .attr("x", x(x_max)-50)
        .attr("y", function(_d,_i) { return y(y_max) + (_i * 10) + 25 ; } )
        .attr('class',function (d, i) { return 'word_legend word_legend_'+word; })
        .text(function(_d,_i) { return _d; })
        .on('mouseover', function (d, i) {
            // hover to highlight line
            word=d;
            //// console.log(word);

            if (all_periods==false) { res=desc_neighb(word,'_total'); }
            spaces_highlight_line(word);})
          .on('mouseout', function(d,i) {
            spaces_unhighlight_lines();
          })
          .on('click', function(d,i) {
            word=d;
            //window.open('/ranks/'+word, '_blank');
            get_ranks(word,clear=false,redirect=false,origin_id=false,popup=true);
          })
          .attr('fill',function(_d,_i) { return colors[_i]; })
          .attr("font-size", "13px")
          .attr('style',function(d,i){ if (w_i!=0) { return "display: none;" } else { return ""; } })
          .attr("font-weight","bold");

  }

var errorCallback = function(error){
    console.error('err!',error);
}



// // console.log('attached data3:',attached_data);



  if (attached_data != undefined) {

    promise = new Promise(function(resolve, reject) {
      var w_attached_data = [];
      for (adi=0; adi<attached_data.length;adi++) {
        if(attached_data[adi].word == w) {
          w_attached_data.push(attached_data[adi]);
        }
      }

      // average ?
      if (all_periods==false) {
        var wdata_ld=[];
        // console.log('all_periods!!!',all_periods)
        wdx = {'word':w, 'period':'_total'}
        dim_words_l.forEach(function(dw) {
          dim_words_col = [];
          w_attached_data.forEach(function(wdat){ dim_words_col.push(wdat[dw]) });
          dim_words_col_avg = nj.array(dim_words_col).mean();
          wdx[dw]=dim_words_col_avg
        });
        // console.log('wdx',wdx);
        wdata_ld.push(wdx)
      w_attached_data = wdata_ld
      }



      // console.log('wdata2',w_attached_data)

      // console.log('resolve',resolve);  // console.log('resolve',reject); // console.log('attached_data4',w_attached_data);
      return resolve(w_attached_data);
    });

  } else {

    //promise = d3v5.csv(ifn) //.then(function(data) {return data; });

    // // console.log('check_',all_periods,ifn_dir,word);
    // if (all_periods != false) { ifn = ifn_dir + word + ".csv"; } else { ifn = ifn_dir + word + "._total.csv"; }
    // // console.log('queing up:',ifn,'...')

    promise = new Promise(function(resolve, reject) {
      all_periods=use_all_periods();
      if (all_periods != false) { ifn = ifn_dir + word + ".csv"; } else { ifn = ifn_dir + word + "._total.csv"; }
      // // console.log('queing up:',all_periods,ifn,'...')
      // $('#feedback').html(all_periods,ifn);
      return resolve(d3v5.csv(ifn));
    });

  }

  // console.log('promise',promise)
  promise.then(successCallback,errorCallback);


} // end of do_word




if (words == undefined) { words = split_words(word); }
// console.log(words);


// After do_word, part of make_linegraph
// words=words_l;

//all_periods = (localStorage.getItem('points')!='average');
// console.log('all_periods!?',all_periods);



if (words.length > 10 & all_periods==undefined) { all_periods = false; }
for(_wi = 0; _wi<words.length; _wi++) {
  w=words[_wi]
  color=colors[_wi];

  do_word(svg,
          word=w,
          color=colors[_wi],
          w_i=_wi,
          x_col=x_col,
          y_col=y_col,
          x_min=x_min,
          x_max=x_max,
          y_miny=y_min,
          y_max=y_max,
          all_periods=all_periods,
          ifn_dir=ifn_dir,
          attached_data=attached_data);
}
bar.animate((_wi)/words.length);


} // end of make_linegraph

// make_linegraph('abandonment');

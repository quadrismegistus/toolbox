// *****************************************
//  reusable multiple slopegraph chart
// *****************************************


max_rank = 25;

(function() {
    'use strict';

    d3.eesur.slopegraph_v2 = function module() {

        // input vars for getter setters
        var w = 300, // width of the set
            h = 800,
            margin = {top: 40, bottom: 40, left: 80, right: 80},
            gutter = 50,
            strokeColour = 'black',
            // key data values (in order)
            keyValues = [],
            // key value (used for ref/titles)
            keyName = '',
            format = d3.format(''),
            sets;

        var dispatch = d3.dispatch('_hover');

        var svg, yScale;

        function exports(_selection) {
            _selection.each(function(data) {

                var allValues = [],
                    maxValue;

                // format/clean data
                data.forEach(function(d) {
                    _.times(keyValues.length, function (n) {
											  if (d[keyValues[n]]==undefined) { d[keyValues[n]] = max_rank; }
                        d[keyValues[n]] = +d[keyValues[n]];
												if (d[keyValues[n]]<max_rank) {
                        	allValues.push(d[keyValues[n]]);
												}
                    });
                });

                // create max value so scale is consistent
                maxValue = _.max(allValues);
                // adapt the size against number of sets
                w = w * keyValues.length;
                // have reference for number of sets
                sets = keyValues.length -1;
                // use same scale for both sides
                yScale = d3.scale.linear()
                    .domain([maxValue, 0])
                    .range([h - margin.top, margin.bottom]);

                // clean start
                d3.select(this).select('svg').remove();

                svg = d3.select(this).append('svg')
                    .attr({
                        width: w,
                        height: h
                    });

                render(data, 0);
            });
        }

        // recursive function to apply each set
        // then the start and end labels (as only needed once)
        function render (data, n) {
            if (n < keyValues.length-1 ) {
                lines(data, n);
                middleLabels(data, n);
                return render(data, n+1);
            } else {
                startLabels(data);
                endLabels(data);
                return n;
            }
        }

        // render connecting lines
        function lines(data, n) {
					// console.log(n,data);

            var lines = svg.selectAll('.s-line-' + n)
                .data(data);

            lines.enter().append('line');

            lines.attr({
                x1: function () {
                    if (n === 0) {
                        return margin.left;
                    } else {
                        return ((w / sets) * n) + margin.left/2;
                    }
                },
                y1: function(d) { return yScale(d[keyValues[n]]); },
                x2: function () {
                    if (n === sets-1) {
                         return w - margin.right;
                    } else {
                        return ((w / sets) * (n+1)) - gutter;
                    }
                },
                y2: function(d) { return yScale(d[keyValues[n+1]]); },
                stroke: strokeColour,
                'stroke-width': 1,
                class: function (d, i) { return 'elm s-line-' + n + ' sel-' + i; }
            })
            .on('mouseover', dispatch._hover)
						.on("mouseout",function(){
  							// console.log('gone!');
								// resetSelection();
								d3.selectAll('.elm').transition().style('opacity', 1);
				        d3.selectAll('.navAlt').transition().style('opacity', 1);
						});

            // lines.exit().remove();
        }

        // middle labels in-between sets
        function middleLabels(data, n) {

            if (n !== sets-1) {
                var middleLabels = svg.selectAll('.m-labels-' + n)
                    .data(data);

                middleLabels.enter().append('text')
                    .attr({
                        class: function (d, i) { return 'labels m-labels-' + n + ' elm ' + 'sel-' + i; },
                        x: ((w / sets) * (n+1)) + 15 + 25,
                        y: function(d) { return yScale(d[keyValues[n+1]]) + 4; },
                    })

                    .text(function (d) {
                        // return format(d[keyValues[n+1]]);
												return d[keyName] + ' ' + format(d[keyValues[n+1]]);
                    })
                    .style('text-anchor','end')
                    .on('mouseover', dispatch._hover)
										.on("mouseout",function(){
				  							// console.log('gone!');
												// resetSelection();
												d3.selectAll('.elm').transition().style('opacity', 1);
								        d3.selectAll('.navAlt').transition().style('opacity', 1);
										})
										.on('click',function(d) {
											//console.log('clicky');
											// make_slopegraph(d[keyName]);
                      analyze_word(d[keyName]);
										});

                // title
                svg.append('text')
                    .attr({
                        class: 's-title',
                        x: ((w / sets) * (n+1))  + 15 + 25 + 10,
                        y: margin.top/2
                    })
                    .text(keyValues[n+1] + ' ↓')
                    .style('text-anchor','end');
            }
        }

        // start labels applied left of chart sets
        function startLabels(data) {

            var startLabels = svg.selectAll('.l-labels')
                .data(data);

            startLabels.enter().append('text')
                .attr({
                    class: function (d, i) { return 'labels l-labels elm ' + 'sel-' + i; },
                    x: margin.left - 3,
                    y: function(d) { return yScale(d[keyValues[0]]) + 4; }
                })
                .text(function (d) {
                    return d[keyName] + ' ' + format(d[keyValues[0]]);
                })
                .style('text-anchor','end')
                .on('mouseover', dispatch._hover)
								.on("mouseout",function(){
		  							// console.log('gone!');
										// resetSelection();
										d3.selectAll('.elm').transition().style('opacity', 1);
						        d3.selectAll('.navAlt').transition().style('opacity', 1);
								})
								.on('click',function(d) {
									//console.log('clicky');
									//make_slopegraph(d[keyName]);
                  analyze_word(d[keyName]);
								});

            // title
            svg.append('text')
                .attr({
                    class: 's-title',
                    x: margin.left - 3,
                    y: margin.top/2
                })
                .text(keyValues[0] + ' ↓')
                .style('text-anchor','end');
        }

        // end labels applied right of chart sets
        function endLabels(data) {

            var i = keyValues.length-1;

            var endLabels = svg.selectAll('r.labels')
                    .data(data);

            endLabels.enter().append('text')
                .attr({
                    class: function (d, i) { return 'labels r-labels elm ' + 'sel-' + i; },
                    x: w - margin.right + 3,
                    y: function(d) { return yScale(d[keyValues[i]]) + 4; },
                })
                .text(function (d) {
                    return d[keyName] + ' ' + format(d[keyValues[i]]);
                })
                .style('text-anchor','start')
                .on('mouseover', dispatch._hover)
								.on("mouseout",function(){
		  							// console.log('gone!');
										// resetSelection();
										d3.selectAll('.elm').transition().style('opacity', 1);
						        d3.selectAll('.navAlt').transition().style('opacity', 1);
								})
								.on('click',function(d) {
									//console.log('clicky');
									// make_slopegraph(d[keyName]);
                  analyze_word(d[keyName]);
								});

            // title
            svg.append('text')
                .attr({
                    class: 's-title',
                    x: w - margin.right + 3,
                    y: margin.top/2
                })
                .text('↓ ' + keyValues[i])
                .style('text-anchor','start');
        }

        // getter/setters for overrides
        exports.w = function(value) {
            if (!arguments.length) return w;
            w = value;
            return this;
        };
        exports.h = function(value) {
            if (!arguments.length) return h;
            h = value;
            return this;
        };
        exports.margin = function(value) {
            if (!arguments.length) return margin;
            margin = value;
            return this;
        };
        exports.gutter = function(value) {
            if (!arguments.length) return gutter;
            gutter = value;
            return this;
        };
        exports.format = function(value) {
            if (!arguments.length) return format;
            format = value;
            return this;
        };
        exports.strokeColour = function(value) {
            if (!arguments.length) return strokeColour;
            strokeColour = value;
            return this;
        };
        exports.keyValues = function(value) {
            if (!arguments.length) return keyValues;
            keyValues = value;
            return this;
        };
        exports.keyName = function(value) {
            if (!arguments.length) return keyName;
            keyName = value;
            return this;
        };

        d3.rebind(exports, dispatch, 'on');
        return exports;

    };

}())

var dashboard3 = (function () {

    "use strict";

    // Currently selected dashboard values
    var chart1,
        chart2,
        chart3,
        chart4,
        selectedYear = 2010,
        selectedCountry = "USA",
        selectedMedalType = "Gold";

    /* Functions to create the individual charts involved in the dashboard */

    function createSummaryChart(selector, dataset) {

        var data = {
                "xScale": "ordinal",
                "yScale": "linear",
                "main": dataset
            },

            options = {
                "axisPaddingLeft": 0,
                "paddingLeft": 20,
                "paddingRight": 0,
                "axisPaddingRight": 0,
                "axisPaddingTop": 5,
                "yMin": 9,
                "yMax": 40,
                "interpolation": "linear",
                "click": yearSelectionHandler
            },

            legend = d3.select(selector).append("svg")
                .attr("class", "legend")
                .selectAll("g")
                .data(dataset)
                .enter()
                .append("g")
                .attr("transform", function (d, i) {
                    return "translate(" + (64 + (i * 84)) + ", 0)";
                });

        legend.append("rect")
            .attr("width", 18)
            .attr("height", 18)
            .attr("class", function (d, i) {
                return 'color' + i;
            });

        legend.append("text")
            .attr("x", 24)
            .attr("y", 9)
            .attr("dy", ".35em")
            .text(function (d, i) {
                return dataset[i].country;
            });

        return new xChart('line-dotted', data, selector + " .graph", options);
    }

    function createCountryBreakdownChart(selector, dataset) {

        var data = {
                "xScale": "ordinal",
                "yScale": "linear",
                "type": "bar",
                "main": dataset
            },

            options = {
                "axisPaddingLeft": 0,
                "axisPaddingTop": 5,
                "paddingLeft": 20,
                "yMin": 8,
                "yMax": 40,
                "click": countrySelectionHandler
            };

        return new xChart('bar', data, selector + " .graph", options);

    }


    function createMedalBreakdownChart(selector, dataset) {
        var width = 490,
            height = 260,
            radius = Math.min(width, height) / 2,

            color = d3.scale.category10(),

            pie = d3.layout.pie()
                .value(function (d) {
                    return d.total;
                })
                .sort(null),

            arc = d3.svg.arc()
                .innerRadius(radius - 80)
                .outerRadius(radius - 20),

            svg = d3.select(selector + " .graph").append("svg")
                .attr("width", width)
                .attr("height", height)
                .append("g")
                .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")"),

            path = svg.datum(dataset).selectAll("path")
                .data(pie)
                .enter().append("path")
                .attr("fill", function (d, i) {
                    return color(i);
                })
                .attr("d", arc)
                .each(function (d) {
                    this._selected = d;
                })  // store the initial angles
                .on("click", medalTypeSelectionHandler),

            legend = d3.select(selector).append("svg")
                .attr("class", "legend")
                .attr("width", radius * 2)
                .attr("height", radius * 2)
                .selectAll("g")
                .data(color.domain().slice().reverse())
                .enter().append("g")
                .attr("transform", function (d, i) {
                    return "translate(" + (120 + i * 100) + ", 0)";
                });

        legend.append("rect")
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", color);

        legend.append("text")
            .attr("x", 24)
            .attr("y", 9)
            .attr("dy", ".35em")
            .text(function (d) {
                return dataset[d].type + ' (' + dataset[d].total + ')';
            });

        function change(dataset) {
            svg.datum(dataset);
            path = path.data(pie); // compute the new angles
            path.transition().duration(500).attrTween("d", arcTween); // redraw the arcs
            legend.select('text').text(function (d) {
                return dataset[d].type + ' (' + dataset[d].total + ')';
            });
        }

        function arcTween(a) {
            var i = d3.interpolate(this._selected, a);
            this._selected = i(0);
            return function (t) {
                return arc(i(t));
            };
        }

        return {
            change: change
        };

    }

    function createCountryBreakdownForMedalTypeChart(selector, dataset) {

        var data = {
            "xScale": "ordinal",
            "yScale": "linear",
            "type": "bar",
            "main": dataset
        };

        var options = {
            "axisPaddingLeft": 0,
            "axisPaddingTop": 5,
            "paddingLeft": 20,
            "yMin": 0,
            "yMax": 20
        };

        return new xChart('bar', data, selector + " .graph", options);

    }

    /* Data selection handlers */

    function yearSelectionHandler(d, i) {
        selectedYear = d.x;
        var data = {
            "xScale": "ordinal",
            "yScale": "linear",
            "type": "bar",
            "main": getCountryBreakdownForYear(selectedYear)
        };
        $('#chart2>.title').html('Total Medals by Country in ' + selectedYear);
        chart2.setData(data);
    }

    function countrySelectionHandler(d, i) {
        selectedCountry = d.x;
        $('#chart3>.title').html(selectedCountry + ' Medals in ' + selectedYear);
        chart3.change(getMedalsForCountry(selectedCountry));
    }

    function medalTypeSelectionHandler(d) {
        selectedMedalType = d.data.type;
        var data = {
            "xScale": "ordinal",
            "yScale": "linear",
            "type": "bar",
            "main": getCountryBreakdownForMedalType(selectedMedalType, selectedYear)
        };
        $('#chart4>.title').html(selectedMedalType + ' Medals in ' + selectedYear);
        chart4.setData(data);
    }

    /* Functions to transform/format the data as required by specific charts */

    function getCountryBreakdownForYear(year) {
        var result = [];
        for (var i = 0; i < results[year].length; i++) {
            result.push({x: results[year][i].Country, y: results[year][i].Total});
        }
        return [
            {
                "className": ".medals",
                "data": result
            }
        ]
    }

    function getCountryBreakdownForMedalType(medalType, year) {
        var result = [];
        for (var i = 0; i < results[year].length; i++) {
            result.push({x: results[year][i].Country, y: results[year][i][medalType]});
        }
        return [
            {
                "className": ".medals",
                "data": result
            }
        ]
    }

    function getMedalsForCountry(country) {
        var countries = results[selectedYear];
        for (var i = 0; i < countries.length; i++) {
            if (countries[i].Country === country) {
                return [
                    {"type": "Gold", "total": countries[i].Gold },
                    {"type": "Silver", "total": countries[i].Silver},
                    {"type": "Bronze", "total": countries[i].Bronze}
                ];
            }
        }
    }

    /* Render the dashboard */

    function render() {

        var html =
            '<div id="chart1" class="chart">' +
                '<div class="title">Top 5 Medal Countries</div>' +
                '<div class="graph"></div>' +
                '</div>' +

                '<div id="chart2" class="chart">' +
                '<div class="title">Total Medals by Country in 2010</div>' +
                '<div class="graph"></div>' +
                '</div>' +

                '<div id="chart3" class="chart">' +
                '<div class="title">USA Medals in 2010</div>' +
                '<div class="graph"></div>' +
                '</div>' +

                '<div id="chart4" class="chart">' +
                '<div class="title">Gold Medals in 2010</div>' +
                '<div class="graph"></div>' +
                '</div>';

        $("#content").html(html);

        chart1 = createSummaryChart('#chart1', summary);
        chart2 = createCountryBreakdownChart('#chart2', getCountryBreakdownForYear(selectedYear));
        chart3 = createMedalBreakdownChart('#chart3', getMedalsForCountry(selectedCountry));
        chart4 = createCountryBreakdownForMedalTypeChart('#chart4', getCountryBreakdownForMedalType(selectedMedalType, selectedYear));
    }

    return {
        render: render
    }

}());
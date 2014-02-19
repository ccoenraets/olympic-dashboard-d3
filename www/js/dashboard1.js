var dashboard1 = (function () {

    "use strict";

    // Currently selected dashboard values
    var chart1,
        chart2,
        selectedYear = 2010;

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
                "yMax": 40
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

    /* Render the dashboard */

    function render() {

        var html =
            '<div id="chart1" class="chart chart2">' +
                '<div class="title">Top 5 Medal Countries</div>' +
                '<div class="graph"></div>' +
                '</div>' +

                '<div id="chart2" class="chart chart2">' +
                '<div class="title">Total Medals by Country in 2010</div>' +
                '<div class="graph"></div>' +
                '</div>';

        $("#content").html(html);

        chart1 = createSummaryChart('#chart1', summary);
        chart2 = createCountryBreakdownChart('#chart2', getCountryBreakdownForYear(selectedYear));
    }

    return {
        render: render
    }

}());
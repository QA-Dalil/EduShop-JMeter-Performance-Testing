/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8964285714285715, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "03 - Price High to Low"], "isController": false}, {"data": [1.0, 500, 1500, "02.2 - Get Products"], "isController": false}, {"data": [1.0, 500, 1500, "02 - Load Home Page"], "isController": true}, {"data": [1.0, 500, 1500, "05.1.2 - Get Product Reviews"], "isController": false}, {"data": [1.0, 500, 1500, "03 - Price Low to High"], "isController": false}, {"data": [1.0, 500, 1500, "08.1 - Open Checkout Page"], "isController": false}, {"data": [1.0, 500, 1500, "05.1.1 - Get Product Details"], "isController": false}, {"data": [0.85, 500, 1500, "06.1.3 - Add to Wishlist"], "isController": false}, {"data": [1.0, 500, 1500, "06.2.2 - Quick Add to Cart"], "isController": false}, {"data": [0.5, 500, 1500, "08.2 - Place Order"], "isController": false}, {"data": [1.0, 500, 1500, "03 - Name"], "isController": false}, {"data": [0.2, 500, 1500, "01 - Register New Customer"], "isController": false}, {"data": [1.0, 500, 1500, "09 - Logout"], "isController": false}, {"data": [1.0, 500, 1500, "02.1 - Get Categories"], "isController": false}, {"data": [1.0, 500, 1500, "03 - Newest"], "isController": false}, {"data": [1.0, 500, 1500, "06.2.1 - Search Products"], "isController": false}, {"data": [1.0, 500, 1500, "07 - View Cart"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 130, 0, 0.0, 317.9, 25, 2584, 94.0, 1286.900000000001, 1801.999999999999, 2464.3399999999992, 10.946446615021893, 11.914539433521389, 9.784455651103066], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["03 - Price High to Low", 2, 0, 0.0, 77.0, 37, 117, 77.0, 117.0, 117.0, 117.0, 2.0491803278688527, 3.0257428278688527, 1.9871445952868854], "isController": false}, {"data": ["02.2 - Get Products", 10, 0, 0.0, 94.3, 47, 118, 105.0, 117.5, 118.0, 118.0, 1.2575452716297786, 5.6626379369969815, 1.2010539801307847], "isController": false}, {"data": ["02 - Load Home Page", 10, 0, 0.0, 150.39999999999998, 85, 184, 162.0, 183.8, 184.0, 184.0, 1.2482836100362003, 9.621779818374735, 2.322246364373986], "isController": true}, {"data": ["05.1.2 - Get Product Reviews", 10, 0, 0.0, 52.8, 25, 100, 51.0, 97.5, 100.0, 100.0, 1.2627857052658165, 0.19731026644778382, 1.1540184208864757], "isController": false}, {"data": ["03 - Price Low to High", 3, 0, 0.0, 81.66666666666667, 38, 108, 99.0, 108.0, 108.0, 108.0, 0.4575263077626963, 0.6687152089370139, 0.4484413127192313], "isController": false}, {"data": ["08.1 - Open Checkout Page", 10, 0, 0.0, 64.0, 29, 105, 54.0, 103.80000000000001, 105.0, 105.0, 1.4524328249818446, 0.5608319716775599, 1.309175290486565], "isController": false}, {"data": ["05.1.1 - Get Product Details", 10, 0, 0.0, 63.7, 31, 132, 52.0, 128.70000000000002, 132.0, 132.0, 1.2588116817724069, 0.642928231998993, 1.1417815332326284], "isController": false}, {"data": ["06.1.3 - Add to Wishlist", 10, 0, 0.0, 520.2, 155, 1304, 279.0, 1283.3000000000002, 1304.0, 1304.0, 1.24595066035385, 0.48304923062546723, 1.155667907425866], "isController": false}, {"data": ["06.2.2 - Quick Add to Cart", 10, 0, 0.0, 315.59999999999997, 168, 453, 295.0, 450.8, 453.0, 453.0, 1.1814744801512287, 0.45620606391776936, 1.139476754489603], "isController": false}, {"data": ["08.2 - Place Order", 10, 0, 0.0, 1060.7, 230, 2584, 512.5, 2545.4, 2584.0, 2584.0, 1.424095699230988, 0.9888008224152662, 1.4513537809740813], "isController": false}, {"data": ["03 - Name", 3, 0, 0.0, 151.0, 89, 242, 122.0, 242.0, 242.0, 242.0, 0.44431279620853076, 0.6874409897067536, 0.43100655361374407], "isController": false}, {"data": ["01 - Register New Customer", 10, 0, 0.0, 1567.5, 1036, 1918, 1651.5, 1914.7, 1918.0, 1918.0, 1.027643613194944, 1.1496762922618435, 0.3921905508169767], "isController": false}, {"data": ["09 - Logout", 10, 0, 0.0, 113.80000000000001, 66, 167, 113.0, 165.9, 167.0, 167.0, 2.1767522855898997, 0.4187697268175881, 2.019447921201567], "isController": false}, {"data": ["02.1 - Get Categories", 10, 0, 0.0, 56.099999999999994, 28, 76, 55.5, 75.5, 76.0, 76.0, 1.2656625743576764, 4.056547430704974, 1.145770709403873], "isController": false}, {"data": ["03 - Newest", 2, 0, 0.0, 54.5, 34, 75, 54.5, 75.0, 75.0, 75.0, 0.3051571559353067, 0.5162937232987488, 0.2977070300579798], "isController": false}, {"data": ["06.2.1 - Search Products", 10, 0, 0.0, 69.7, 38, 100, 74.0, 98.7, 100.0, 100.0, 1.180498170227836, 0.8107855108605831, 1.111328355566049], "isController": false}, {"data": ["07 - View Cart", 10, 0, 0.0, 58.20000000000001, 27, 123, 46.0, 120.4, 123.0, 123.0, 1.4349261013057828, 0.5540720512268618, 1.2933953042043334], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 130, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

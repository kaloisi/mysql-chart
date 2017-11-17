google.charts.load('current', {packages: ['corechart', 'bar']});
google.charts.setOnLoadCallback(graphInit);


function graphInit() {
    // my custom options
    options = typeof options === 'undefined' ? {} : options;

    // google chart options
    chart_options = typeof chart_options === 'undefined' ? {} : chart_options;

    // set default properties
    if ( ! chart_options.chartArea ) {
      chart_options.chartArea = {top: 100, left: 100, right:100, width:'90%'};
    }
    chart_options.legend = {position: 'bottom', textStyle: {fontSize: 14}}

    var data = new google.visualization.DataTable();
    data.addColumn('string', 'X');
    var colCount = 0; // start with 1 for X

    var rows = new Array();
    var index = new Array(); // series name -> column number

    var extract = function(s,x,y) {
       var sid = index[s];
       if ( ! sid ) {
         colCount = colCount + 1;
         sid = colCount;
         index[s] = sid;
         data.addColumn('number',s);
         //console.log("Adding Column " + s + " at " + colCount );
       }
       var row = rows[x];
       if ( !row ) {
         row = new Array();
         rows[x] = row;
         row[0] = x;
       }

       row[sid] = Number(y);
       //console.log(" series="+ s + " x=" + x + " y=" + y );
    };


    if ( options.x_as_rank ) {
      var ranks = {};

      extractData( function(s,x,y) {
         var rank = ranks[s];
         if ( ! rank ) {
            rank = 1;
         }
         ranks[s] = rank + 1;
         // console.log(" series="+ s + " x=" + rank + " y=" + y );
         return extract(s,""+rank,y);
      });
    } else {
      extractData( extract );
    }

    console.log(rows);

    for(var row in rows) {
        var r = rows[row];

        while( r.length <= colCount ) {
          r[r.length] = undefined;
        }

        if ( options.convert_to_percent ) {
          var total = 0;

          for(var i=1;i<r.length;i++) {
            if ( r[i] ) {
              total = total + r[i];
            } else {
              r[i] = 0;
            }
          }

          if ( total ) {
            for(var i=1;i<r.length;i++) {
                r[i] = r[i] * 100 / total;
            }
          }

          console.log("Total = " +  total );
        }

        console.log("AddRow : " + rows[row] );
        data.addRow( rows[row] );
    }


    chart_options.height = 1000;

    var chart;

    if ( options.type && options.type == 'bar' ) {
      chart = new google.visualization.BarChart(
                 document.getElementById('chart_div')
               );
    } else if ( options.type && options.type == 'column' ) {
      chart = new google.visualization.ColumnChart(
                document.getElementById('chart_div')
                          );
    } else if ( options.type && options.type == 'pie' ) {
       chart = new google.visualization.PieChart(
                document.getElementById('chart_div')
              );
    } else if ( options.type && options.type == 'area' ) {
      chart = new google.visualization.AreaChart(
                 document.getElementById('chart_div')
               );
    } else {
      chart = new google.visualization.LineChart(
              document.getElementById('chart_div')
            );
    }

    chart.draw(data, chart_options );
}


function extractData(callback) {
  var div = document.getElementById('data');
  var table = div.getElementsByTagName("table")[0];
  //console.log( table );
  var tbody = table.getElementsByTagName("tbody")[0];
  //console.log( tbody );
  var trs = tbody.getElementsByTagName("tr");

  //console.log( trs.length );
  for(var i=0;i<trs.length;i++) {
     var tr = trs[i];
     //console.log( tr );

     var tds = tr.getElementsByTagName("td");
     if ( ! tds || tds.length == 0  )
        continue;

     //console.log( tds );
     var series = tds[0].innerHTML;
     var x = tds[1].innerHTML;
     var y = tds[2].innerHTML;

     callback(series,x,y);
  }
}

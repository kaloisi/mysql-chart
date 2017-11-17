#!/bin/bash


JS_CODE="<script src='../graph.js'></script>"
if [ "$1" == "-ng" ]
then
    GRAPH_JS=`cat graph.js`
    JS_CODE="<script> $GRAPH_JS </script>"
    shift
fi


CONTENT=`cat $1 | grep -v '^#' `
JS_OPTIONS=`cat $1 | grep '^#' | sed 's/.*#//'`


FILE="target/$1.$2.html"
echo "Generating $FILE"

cat<<HEADER > $FILE
  <html>
  <title>$1</title>
  <script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>
  <script>
      $JS_OPTIONS
  </script>

  $JS_CODE

  <body>

  <div id="chart_div"></div>

  <div id='data'>
HEADER


cat $1 | grep -v '^#' | mysql $MSQL_ARGS -html >> $FILE

cat<<FOOTER >> $FILE
  </div>
  <pre>
  $CONTENT
  </pre>
  </html>
FOOTER



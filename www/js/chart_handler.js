var date_arr;
var value_arr;
function getStatistic(type,month){
    db.transaction(function(tx){
    var query_cmd = 'SELECT Count(value) AS COUNT, Min(value) AS MIN , Max(value) AS MAX , Avg(value) AS AVERAGE FROM Record ' + 
        'WHERE type = ' + '\'' + type + '\'' 
        + ' AND created_time >= ' + 'date(\'2017-0'+ month +'-01\') and created_time <=' + 'date(\'2017-0'+ month +'-31\')'  ;
        tx.executeSql(query_cmd,[],statHelper);
    },errorCB)
}
function statHelper(tx,results){
    var len = results.rows.length;
    var tblText = '';
    for (var i = 0; i < len; i++) {
        tblText += '<tr>' + '<td><center>' + results.rows.item(i).COUNT + '</center></td>' +
                            '<td><center>' + results.rows.item(i).MIN + '</center></td>' +
                            '<td><center>' + results.rows.item(i).MAX + '</center></td>' +
                            '<td><center>' + results.rows.item(i).AVERAGE + '</center></td>' +
                    '</tr>';
    }
    console.log('Stat :'+len);
    console.log(tblText);
    document.getElementById("statistic_data").innerHTML =tblText;
}
function getValueSet(type,month){
    db.transaction(function(tx){
        var query_cmd = 'SELECT * FROM Record ' + 'WHERE type = ' + '\'' + type + '\'' 
        + ' AND created_time >= ' + 'date(\'2017-0'+ month +'-01\') and created_time <=' + 'date(\'2017-0'+ month +'-31\')'  ;
        tx.executeSql(query_cmd,[],valueHelper);
    },errorCB)
}

function valueHelper(tx,results){
    var len = results.rows.length;
    console.log(len);
    date_arr = new Array();
    value_arr = new Array();
    for (var i = 0; i < len; i++) {
        date_arr.push((results.rows.item(i).created_time).substring(5,10));
        value_arr.push(results.rows.item(i).value);
    }
    var data = {
        labels: date_arr,
        series: [value_arr], 
    };
    var chart = new Chartist.Line('#show_result', data);
    // Let's put a sequence number aside so we can use it in the event callbacks
    var seq = 0,
    delays = 80,
    durations = 500;

    // Once the chart is fully created we reset the sequence
    chart.on('created', function() {
    seq = 0;
    });

    // On each drawn element by Chartist we use the Chartist.Svg API to trigger SMIL animations
    chart.on('draw', function(data) {
    seq++;

    if(data.type === 'line') {
        // If the drawn element is a line we do a simple opacity fade in. This could also be achieved using CSS3 animations.
        data.element.animate({
        opacity: {
            // The delay when we like to start the animation
            begin: seq * delays + 1000,
            // Duration of the animation
            dur: durations,
            // The value where the animation should start
            from: 0,
            // The value where it should end
            to: 1
        }
        });
    } else if(data.type === 'label' && data.axis === 'x') {
        data.element.animate({
        y: {
            begin: seq * delays,
            dur: durations,
            from: data.y + 100,
            to: data.y,
            // We can specify an easing function from Chartist.Svg.Easing
            easing: 'easeOutQuart'
        }
        });
    } else if(data.type === 'label' && data.axis === 'y') {
        data.element.animate({
        x: {
            begin: seq * delays,
            dur: durations,
            from: data.x - 100,
            to: data.x,
            easing: 'easeOutQuart'
        }
        });
    } else if(data.type === 'point') {
        data.element.animate({
        x1: {
            begin: seq * delays,
            dur: durations,
            from: data.x - 10,
            to: data.x,
            easing: 'easeOutQuart'
        },
        x2: {
            begin: seq * delays,
            dur: durations,
            from: data.x - 10,
            to: data.x,
            easing: 'easeOutQuart'
        },
        opacity: {
            begin: seq * delays,
            dur: durations,
            from: 0,
            to: 1,
            easing: 'easeOutQuart'
        }
        });
    } else if(data.type === 'grid') {
        // Using data.axis we get x or y which we can use to construct our animation definition objects
        var pos1Animation = {
        begin: seq * delays,
        dur: durations,
        from: data[data.axis.units.pos + '1'] - 30,
        to: data[data.axis.units.pos + '1'],
        easing: 'easeOutQuart'
        };

        var pos2Animation = {
        begin: seq * delays,
        dur: durations,
        from: data[data.axis.units.pos + '2'] - 100,
        to: data[data.axis.units.pos + '2'],
        easing: 'easeOutQuart'
        };

        var animations = {};
        animations[data.axis.units.pos + '1'] = pos1Animation;
        animations[data.axis.units.pos + '2'] = pos2Animation;
        animations['opacity'] = {
        begin: seq * delays,
        dur: durations,
        from: 0,
        to: 1,
        easing: 'easeOutQuart'
        };

        data.element.animate(animations);
    }
    });

    // For the sake of the example we update the chart every time it's created with a delay of 10 seconds
    chart.on('created', function() {
    if(window.__exampleAnimateTimeout) {
        clearTimeout(window.__exampleAnimateTimeout);
        window.__exampleAnimateTimeout = null;
    }
    //window.__exampleAnimateTimeout = setTimeout(chart.update.bind(chart), 12000);
    });

}

// function getDataObject(type,month){
//     var result = getValueSet(type,month);
    
    
//     console.log(data)
//     return data;
// }
function createGraph(){
    var type = document.getElementById('type_option').value;
    var month = document.getElementById('month_option').value;
    getStatistic(type,month);
    getValueSet(type,month);
    
    
}



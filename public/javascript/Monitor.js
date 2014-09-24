

function onVisibility(visibleFn, hiddenFn) {
    var hidden = "hidden";

    // Standards:
    if (hidden in document)
        document.addEventListener("visibilitychange", onchange);
    else if ((hidden = "mozHidden") in document)
        document.addEventListener("mozvisibilitychange", onchange);
    else if ((hidden = "webkitHidden") in document)
        document.addEventListener("webkitvisibilitychange", onchange);
    else if ((hidden = "msHidden") in document)
        document.addEventListener("msvisibilitychange", onchange);
    // IE 9 and lower:
    else if ('onfocusin' in document)
        document.onfocusin = document.onfocusout = onchange;
    // All others:
    else
        window.onpageshow = window.onpagehide
            = window.onfocus = window.onblur = onchange;

    function onchange (evt) {
        var evtMap = {
            focus : true,
            focusin : true,
            pageshow : true,
            blur : false,
            focusout : false,
            pagehide : false
        };

        evt = evt || window.event;
        if (evt.type in evtMap) {
            evtMap[evt.type] ? visibleFn() : hiddenFn();
        } else {
            this[hidden] ? hiddenFn() : visibleFn();
        }
    }
};



$(document).ready(function() {
    // TODO change this to a list so the user can see multiple data sources
    var eventName = 'temperature'; //mockData
    var chart = null;
    var socket = io();

    console.log('Initializing socket...');
    socket.on('init-' + eventName, function(datas) {
        var labels = []
        var temps = [];

        console.log('Socket initialized. Heard from server. Loading chart...');
        for (var i = 0; i < datas.length; i++) {
            var data = datas[i];

            var date = new Date(data.time);
            var label = date.getHours() + ':'+date.getMinutes() + ':' + date.getSeconds();
            labels.push(label);
            temps.push(data.temp);
        }
        //
        // Chart.defaults.global = {
        //     scaleOverride : false,
        //     // Number - The number of steps in a hard coded scale
        //     scaleSteps: 10,
        //     // Number - The value jump in the hard coded scale
        //     scaleStepWidth: 5,
        //     // Number - The scale starting value
        //     scaleStartValue: 50,
        //
        // };
        var chatConfig = {
            labels : labels,
            datasets : [{
                label : "Temperature",
                fillColor : "rgba(220,220,220,0.2)",
                strokeColor : "rgba(220,220,220,1)",
                pointColor : "rgba(220,220,220,1)",
                pointStrokeColor : "#fff",
                pointHighlightFill : "#fff",
                pointHighlightStroke : "rgba(220,220,220,1)",
                data : temps
            }]
        };

        var chartEl = document.getElementById("myChart");
        chartEl.width = document.body.offsetWidth - 150;
        var ctx = chartEl.getContext("2d");
        chart = new Chart(ctx).Line(chatConfig, {});
        console.log('Chart loaded. Listening for data...');
    });

    socket.on(eventName, function(msg) {
        if (chart) {
            if (chart.datasets[0].points.length >= 20) {
                chart.removeData();
            }
            var date = new Date(msg.time);
            var label = date.getHours() + ':'+date.getMinutes() + ':' + date.getSeconds();
            //console.log('Received data: ' + label + ' : ' + msg.temp);
            chart.addData([msg.temp], label);
        } else {
            //console.log('Chart is not initialized');
        }

    });

    // TODO The chart seems to get backed up when the tab isn't focused.
    // Probably because the animation loop stops for that tab. I bet if I stop
    // adding when the tab is hidden, performance will be mush better. When it
    // becomes visible again, I should just send an event to the server to get
    // the last 20.
    onVisibility(function() {
        console.log('now visible')
    }, function() {
        console.log('now hidden')
    });

});

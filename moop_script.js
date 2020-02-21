var place_response = document.querySelector('.response-place')
var closemodal = document.querySelector('#closemodal')

google.charts.load('current', {
    'packages': ['corechart']
});

closemodal.addEventListener('click', AddResponsePlace())

function AddResponsePlace() {
    if (!place_response.classList.contains('response-place')) {
        place_response.classList.add('response-place')
    }
}

function myFunction() {
    document.getElementById("xminHolder").innerHTML = "";
    document.getElementById("xmaxHolder").innerHTML = "";
    var n_value = document.getElementById("n").value;
    for (let i = 1; i <= n_value; i++) {
        document.getElementById("xminHolder").innerHTML += `
        <div class="col-xs-3">
            <input class="form-control col-xs-3" type="number" id="x_min_${i}" name="x_min_1" value="-10">
        </div>
        `;
        document.getElementById("xmaxHolder").innerHTML += `
        <div class="col-xs-3">
            <input class="form-control" type="number" id="x_max_${i}" name="x_max_1" value="10">
        </div>
        `;
    }
}

function sendRequest() {

    showloader();
    AddResponsePlace();

    let resultElement = document.getElementById('response');
    let errorElement = document.getElementById('error');
    //resultElement.innerHTML = null;
    //errorElement.innerHTML = null;

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "https://ii51sclb36.execute-api.us-east-1.amazonaws.com/default/Moop");
    xhr.setRequestHeader('Content-Type', 'application/json');

    const n_value = parseInt(document.getElementById('n').value);
    const n_samples = parseInt(document.getElementById('ns').value);
    const function_value1 = document.getElementById('func1').value;
    const function_value2 = document.getElementById('func2').value;
    const n_max_value = parseInt(document.getElementById('n_max').value);
    const eps_value = parseFloat(document.getElementById('eps').value);

    let x_min_value = [];
    let x_max_value = [];
    for (let i = 1; i <= n_value; i++) {
        if (document.getElementById('x_min_' + i).value) {
            x_min_value.push(parseFloat(document.getElementById('x_min_' + i).value));
        }

        if (document.getElementById('x_max_' + i).value) {
            x_max_value.push(parseFloat(document.getElementById('x_max_' + i).value));
        }
    }

    xhr.send(JSON.stringify({
        n: n_value,
        n_samples: n_samples,
        function_1: function_value1,
        function_2: function_value2,
        x_min: x_min_value,
        x_max: x_max_value,
        n_max: n_max_value,
        eps: eps_value
    }));

    xhr.onload = async function() {

        var data = await JSON.parse(this.responseText);
        // resultElement.innerHTML =  "Stop criterion: " + JSON.stringify(data["message"]) + "<br>" + "x* = " + JSON.stringify(data["x"])  + "<br>" + "f(x*) = " + JSON.stringify(data["fx"]) ;
        //resultElement.innerHTML = JSON.stringify(data["x"]);

        console.log(this.responseText)
        console.log(data)

        try {
            //colocar o try antes de usar os dados!!
            var line_x = data.fx[0]
            var line_y = data.fx[1]

            var entrada_grafico = [];
            entrada_grafico.push(['x', ''])

            for (let i in line_x) {
                let x = []
                x.push(line_x[i])
                x.push(line_y[i])
                entrada_grafico.push(x)
            }

            console.log(line_x)
            console.log(line_y)

            var grafico = google.visualization.arrayToDataTable(entrada_grafico);

            var options = {
                title: 'Pareto front',
                hAxis: {
                    title: 'f' + '1'.sub() + '(x)'
                },
                vAxis: {
                    title: 'f' + '2'.sub() + '(x)'
                },
                legend: 'none',
                width: 740,
                height: 400
            };

            var chart = new google.visualization.ScatterChart(document.getElementById('response_plot'));

            chart.draw(grafico, options);

            place_response.classList.remove("response-place")
            showloader();
            callback()

        } catch (e) {

            let errobody = document.querySelector('.modal-body')
            errobody.innerHTML = 'There was a rendering error'
                //Modal irá aparecer sem necessidade de um botão
            showloader();
            $(document).ready(function(e) {
                jQuery('#myModal').modal();
            });
            console.log(e);
        }
    }
    xhr.onerror = function(e) {
        let errobody = document.querySelector('.modal-body')

        errobody.innerHTML = 'There was an unexpected error'
            //Modal irá aparecer sem necessidade de um botão
        showloader();
        $(document).ready(function(e) {
            jQuery('#myModal').modal();
        });

        console.log("Ooops, não funcionou: ", e)
    }
}

function callback() {
    let a = document.getElementById('solve');
    window.location.href = '#test';
}

function showloader() {
    let a = document.getElementById('solve');

    if (a.innerHTML == 'Solve') {
        a.innerHTML = `
    <div class="d-flex justify-content-center">
        <div class="spinner-border" role="status">
            <span class="sr-only">Loading...</span>
        </div>
    </div>
    `
    } else {
        a.innerHTML = 'Solve'
    }
}
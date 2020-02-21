var place_response = document.querySelector('.response-place')
var closemodal = document.querySelector('#closemodal')

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

    AddResponsePlace();

    let resultElement = document.getElementById('response');
    let errorElement = document.getElementById('error');
    resultElement.innerHTML = null;
    errorElement.innerHTML = null;

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

        try {
            var trace3 = {
                x: data["fx"][0],
                y: data["fx"][1],
                mode: 'markers'
            };
            var layout = {
                title: 'Pareto front',
                xaxis: {
                    title: 'f' + '1'.sub() + '(x)'
                },
                yaxis: {
                    title: 'f' + '2'.sub() + '(x)'
                },
            };
            var data_plot = [trace3];
            //libera espaço para a resposta seja exibida (tem que liberar antes de enviar os dados para a div)
            place_response.classList.remove("response-place")
            Plotly.newPlot('response_plot', data_plot, layout)

        } catch (e) {

            let errobody = document.querySelector('.modal-body')
            errobody.innerHTML = 'There was a rendering error'
                //Modal irá aparecer sem necessidade de um botão
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
        $(document).ready(function(e) {
            jQuery('#myModal').modal();
        });

        console.log("Ooops, não funcionou: ", e)
    }
}
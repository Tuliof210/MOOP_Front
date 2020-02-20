var place_reponse = document.querySelector('.response-place')

function myFunction() {
    document.getElementById("xminHolder").innerHTML = "";
    document.getElementById("xmaxHolder").innerHTML = "";
    var n_value = document.getElementById("n").value;
    for (let i = 1; i <= n_value; i++) {
        document.getElementById("xminHolder").innerHTML += `
        <div class="col-xs-3">
            <input class="form-control col-xs-3" type="number" id="x_min_${i}" name="x_min_1" value="-10" min="-9999" max="9999">
        </div>
        `;
        document.getElementById("xmaxHolder").innerHTML += `
        <div class="col-xs-3">
            <input class="form-control" type="number" id="x_max_${i}" name="x_max_1" value="10" min="-9999" max="9999">
        </div>
        `;
    }
}

function sendRequest() {

    //reseta o espaço da resposta
    place_reponse.classList.add("response-place");

    let resultElement = document.getElementById('response');
    let errorElement = document.getElementById('error');
    resultElement.innerHTML = null;
    errorElement.innerHTML = null;

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "https://ii51sclb36.execute-api.us-east-1.amazonaws.com/default/Moop");
    xhr.setRequestHeader('Content-Type', 'application/json');
    try {
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
        console.log('oioioi');

        xhr.onload = function() {
            console.log("Response")
            console.log(this.responseText);
            var data = JSON.parse(this.responseText);
            console.log(data);
            // resultElement.innerHTML =  "Stop criterion: " + JSON.stringify(data["message"]) + "<br>" + "x* = " + JSON.stringify(data["x"])  + "<br>" + "f(x*) = " + JSON.stringify(data["fx"]) ;
            //resultElement.innerHTML = JSON.stringify(data["x"]);



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
            Plotly.newPlot('response_plot', data_plot, layout);

            //libera espaço para a resposta seja exibida
            place_reponse.classList.remove("response-place");
        }
        xhr.onerror = function(e) {
            let errobody = document.querySelector('main')
            errobody.innerHTML += `
                <div class="modal fade" id="exampleModalLong" tabindex="-1" role="dialog" aria-labelledby="exampleModalLongTitle" aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLongTitle">Modal title</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        ...
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary">Save changes</button>
                    </div>
                    </div>
                </div>
                </div>
            `

            console.log("Ooops, não funcionou: ", e)
            errorElement.innerHTML = "Não funcionou";
        }
    } catch (e) {
        let errobody = document.querySelector('main')
        errobody.innerHTML += `
            <div class="modal fade" id="exampleModalLong" tabindex="-1" role="dialog" aria-labelledby="exampleModalLongTitle" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLongTitle">Modal title</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    ...
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary">Save changes</button>
                </div>
                </div>
            </div>
            </div>
        `
        console.log('Deu merda', e);
    }
}
const form = document.querySelector("form");
const stateName = document.querySelector("#stateName");
const cases = document.querySelector("#cases");
const discharged = document.querySelector("#discharged");
const cdeaths = document.querySelector("#cdeaths");
const statesContainer = document.querySelector("#statesContainer");
const totalDeaths = document.querySelector("#deaths");
const totalCases = document.getElementById("total");

document.addEventListener('DOMContentLoaded', function(){
    (async ()=>{
        const data = await fetchData();
        setInitialData(data);
        listenSubmit(data);
    })()
    
})

async function fetchData(){
    const bufferData = await fetch('https://api.rootnet.in/covid19-in/stats/latest');
    const jsonData = await bufferData.json();
    
    return jsonData;
}

function setInitialData(data){
    totalCases.innerHTML = (data.data.summary.total).toLocaleString('en-IN');
    totalDeaths.innerHTML = (data.data.summary.deaths).toLocaleString('en-IN');
    statesContainer.innerHTML = ''
    data.data.regional.forEach((region, idx)=>{
        statesContainer.innerHTML += `
             <div class="col-md-6 col-xl-3">
                    <div class="card mt-5 shadow rounded rounded-3 p-3 pb-5 text-center h-100 d-flex justify-content-between">
                        <h2 id="stateName">${region.loc}</h2>
                        <div>
                             <div class="d-flex gap-1">
                                <p class="m-0">Confirmed : </p>
                                <p class="m-0" id="cases">${(region.confirmedCasesIndian).toLocaleString('en-IN')}</p>
                            </div>
                            <div class="d-flex gap-1">
                                <p class="m-0">Discharged : </p>
                                <p class="m-0" id="discharged">${(region.discharged).toLocaleString('en-IN')}</p>
                            </div>
                            <div class="d-flex gap-1">
                                <p class="m-0">Deaths : </p>
                                <p class="m-0" id="cdeaths">${(region.deaths).toLocaleString('en-IN')}</p>
                            </div>
                        </div>
                    </div>
                </div>
        `
    })
}

function listenSubmit(data){
    form.addEventListener('submit', function(e){
        e.preventDefault();
        const input = document.querySelector("#stateInput");
        if (!input.value){
            fireError("Please Enter state name");
            return;
        }
        const stateData = data.data.regional.filter(state => state.loc.toLowerCase() === input.value.toLowerCase());
        if(stateData.length === 0){
            fireError("Please enter a valid state name");
            return;
        }
        document.querySelector(".search-output-container").classList.remove("opacity-0")
        stateName.innerHTML = stateData[0].loc;
        cases.innerHTML = (stateData[0].confirmedCasesIndian).toLocaleString('en-IN');
        discharged.innerHTML = (stateData[0].discharged).toLocaleString('en-IN');
        cdeaths.innerHTML = (stateData[0].deaths).toLocaleString('en-IN');
        input.value = '';
    })
}

function fireError(message){
    Swal.fire({
        icon: "error",
        title: "Oops...",
        text: message,
    });
}
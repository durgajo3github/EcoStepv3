
document.getElementById('getusers').addEventListener('click', getUsers);

function getUsers(){
    fetch('http://localhost:8080/carbonfootprint')
    // to be used in place of sample.json http://local host:8080/carbon footprint
    .then((response) => response.json())
    .then((data) => {
        let output= '';
        let divRowOpen = `<div class="row">`;
        let divRowClose = `</div>`;        
        data.forEach(function (user){
            output+= `            
                <div class="four col-md-3">
                    <div class="counter-box colored"> <i class="fa fa-refresh fa-spin fa-3x fa-fw"></i> <span id ='food' class="counter" data-target="60000">${user.carbonFootprint}</span> 
                        <p>${user.category}</p>
                    </div>
                </div>          
            `;
        });
        output = divRowOpen + output + divRowClose;
        
        document.getElementById('output').innerHTML = output;
      
    })
}

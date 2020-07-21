document.getElementById('getusers').addEventListener('click', getUsers);

function getUsers(){
    fetch('http://localhost:8080/carbonfootprint')
    .then((response) => response.json())
    .then((data) => {
        let output= '';
                let divRowOpen = ` 
        <h5 class="heading4 mb-2">Carbon foot based on your last 3 months transaction</h5>
        <div class="row">
        `;
        let divRowClose = `
        </div>                
        `;        
        data.forEach(function (user){                      
            
            if(user.carbonFootprint>0) {
                output+= `            
                <div class="four col-md-3">
                    <div class="counter-box colored"> <h4 class="h4 heading4">${user.category}</h4> 
                    <i class="fa fa-refresh fa-spin fa-3x fa-fw"></i> 
                        <span id ='food' class="counter" data-target="60000">${user.carbonFootprint}</span>
                            <div class="anchortrans">
                                <a href="#" onclick= "javascript:getTransaction('${user.category}')">${user.transactions} Transaction</a>
                            </div>
                    </div>
                </div>          
            `;                            
            } else {
                output+= `            
                <div class="four col-md-3">
                    <div class="counter-box coloredneg"> 
                    <h4 class="h4 heading4">${user.category}</h4> 
                     <i class="fa fa-refresh fa-spin fa-3x fa-fw"></i> 
                        <span id ='food' class="counter" data-target="60000">${user.carbonFootprint}</span>
                            <div class="anchortrans">
                                <a href="#" onclick= "javascript:getTransaction('${user.category}')">${user.transactions} Transaction</a>
                            </div>           
                    </div>
                </div>          
            `;            
            }
        });
        
        output = divRowOpen + output + divRowClose;
        console.log (output);
        document.getElementById('output').innerHTML = output;
      
    })
}

function getTransaction(category){
    fetch('http://localhost:8080/transactions/' + category)
    .then((respList) => respList.json())
    .then((data1) => {
        let transList= '';
        let tableRowOpen = `                
        <h2 class="heading4 mb-2">Transaction List</h2> 
        <table class="content-table">
            <thead>
                <tr>
                    <th>Transaction Date</th>
                    <th>Amount</th>
                    <th>Transaction info</th>
                </tr>
            </thead>
            <tbody>
            `;
        let tableRowClose = `                   
         </tbody>
        </table>
        `;        
        data1.forEach(function (trans){                    
            transList+=`
            <tr>
            <td>${trans.BookingDateTime}</td>
            <td>${trans.Amount.Amount}</td>
            <td>${trans.TransactionInformation}</td>
        </tr>
            `;
        });
        
        transList = tableRowOpen + transList + tableRowClose;
        console.log (transList);
        document.getElementById('outtable').innerHTML = transList;
      
    })
}

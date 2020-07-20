// document.getElementById('getjson').addEventListener('click', getJson);
document.getElementById('getusers').addEventListener('click', getUsers);
const counters =document.querySelectorAll('.counter');
const food =document.getElementById('food');
const transport =document.getElementById('transport');
const home =document.getElementById('home');
console.log(food.textContent);
console.log(transport.textContent);
console.log(home.textContent);


// function getJson()
// {
//     // fetch ('json.txt')
//     // .then(function(response){
//     //     //console.log(response.text());
//     //     //console.log(response);
//     //     return response.text();
//     // })
//     // .then(function(data){
//     //     console.log(data);
//     // })

//     fetch('json.txt')
//     .then((response) => response.text())
//     .then((data) => {
//         document.getElementById('output').innerHTML = data
//     })
//     .catch((error) =>console.log (error))    
// }

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
        //document.getElementById('output').innerHTML = divRowOpen;
        document.getElementById('output').innerHTML = output;
        //document.getElementById('output').innerHTML = divRowClose;
    })
}
// For Counter function
// $(document).ready(function() {

//     $('.counter').each(function () {
//     $(this).prop('Counter',0).animate({
//     Counter: $(this).text()
//     }, {
//     duration: 4000,
//     easing: 'swing',
//     step: function (now) {
//     $(this).text(Math.ceil(now));
//     }
//     });
//     });
    
//     });
// For Counter function with text content
// const counters =document.querySelectorAll('.counter');
// const speed = 400;
// counters.forEach(counter =>{
//     const updateCount = () => {
//         const target = counter.getAttribute('data-target');
//         console.log(counter.textContent);        
//         // get the value in span
//         const count = +counter.innerText;
//         //do the increment
//         const inc= target/speed;
        
//         if(count<target) {
//             counter.innerText = count++;
//             setTimeout(updateCount,1);

//         } else{
//             count.innerText = target;
//         }

//     }
//     updateCount();
// });




// counters.forEach(counter =>{
//     const updateCount = () => {
//         const target = counter.getAttribute('data-target');
//         console.log(counter.textContent);        
//         // get the value in span
//         const count = +counter.innerText;
//         //do the increment
//         const inc= target/speed;
        
//         if(count<target) {
//             counter.innerText = count+ inc;
//             setTimeout(updateCount,1);

//         } else{
//             count.innerText = target;
//         }

//     }
//     updateCount();
// });

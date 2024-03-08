function toggleSearchView(){
    var search_content = document.getElementById("search_content")
    if (search_content.style.display != "none"){
        updateRequirements();
        search_content.style.display = "none";
        document.getElementById("search_elements").style.display = "block";
    }
    else{
        search_content.style.display = "block";
        document.getElementById("search_elements").style.display = "none";
    }
}

function updateRequirements(){
    var reqDiv = document.getElementById("search_elements");
    reqDiv.innerHTML = "";
    var checks = ["productId", "name_check", "email_check", "mobile_check", "date_check", "date_check"]
    var values = ["product", "name", "email", "mobile", "start", "end"];
    for (var i=0; i<checks.length; i++){
        if(document.getElementById(checks[i]).checked){
            var span = document.createElement("span");
            span.classList.add("rounded-span");
            span.innerHTML = values[i] + ": " + document.getElementById(values[i]).value;
            reqDiv.appendChild(span);
            // if(checks[i] === "orderId") break;
        }
    }
}


async function fetchOrderInfo(){
    var checks = ["productId", "name_check", "email_check", "mobile_check", "date_check", "date_check"]
    var values = ["product", "name", "email", "mobile", "start", "end"];
    var request = {};
    for (var i=0; i<checks.length; i++){
        if(document.getElementById(checks[i]).checked){
            request[values[i]] = document.getElementById(values[i]).value;
            // if(checks[i] === "orderId") break;
        }
        else{
            request[values[i]] = null;
        }
    }
    var url = "/cashier/order_query"
    var response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify(request)
    });
    if (!response.ok){
        throw new Error("Something happened in database");
    }
    else 
        return response.json();
}


async function updateSearchResult(){
    var table = document.getElementById("result_table");
    var tbody = table.querySelector("tbody");
    tbody.innerHTML = '';
    
    console.log(" Updating search result");
    results = [];
    results = await fetchOrderInfo();
    results.forEach( order => {
        var row = tbody.insertRow();
        for (var i=0; i<order.length; i++){
            var cell = row.insertCell(i);
            cell.textContent = order[i];
        }
    });
}


async function fetchSingleOrder(order_id){
    var url = `/cashier/get_single_order`;
    var respone = await fetch(url, {
        method: "POST",
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({order_id})
    });
    if (!respone.ok){
        throw new Error("Database crashed I think");
    }
    return respone.json();
}


function updateCustomerPopup(customer){
    var valueList = document.getElementById("customer_value_list");
    valueList.innerHTML = '';
    var li1 = document.createElement('li');
    var li2 = document.createElement('li');
    var li3 = document.createElement('li');
    li1.textContent = customer.name;
    li2.textContent = customer.mail;
    li3.textContent = customer.mobile;
    valueList.appendChild(li1);
    valueList.appendChild(li2);
    valueList.appendChild(li3);
}


function updateOrderPopup(order){
    var valueList = document.getElementById("order_value_list");
    valueList.innerHTML = '';
    var li1 = document.createElement('li');
    var li2 = document.createElement('li');
    var li3 = document.createElement('li');
    li1.textContent = order.id;
    li2.textContent = order.date;
    li3.textContent = order.time;
    valueList.appendChild(li1);
    valueList.appendChild(li2);
    valueList.appendChild(li3);
}


async function getProductData(productId){
    var queryURL = `/cashier/findProduct/${productId}`;
    var productName = "", price;
    return fetch(queryURL).then(res => {
        if(!res.ok){
            throw new Error("Something went wrong");
        }
        return res.json();
    }).then(product => {
        productName = product.productName[0];
        price = product.productName[1];
        return {productName};
    });
}


async function upddateProductTable(products){
    var table = document.getElementById("products_table");
    var tbody = table.querySelector("tbody");
    var tfoot = table.querySelector("tfoot");
    tbody.innerHTML = '';
    tfoot.innerHTML = '';
    var sum = 0.00;
    var idx = 0;
    for(var product of products){
        var row = tbody.insertRow();   var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1); var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3); var cell5 = row.insertCell(4);
        // var {productName} = await getProductData(product.id);
        productName = product.name;
        cell1.textContent = idx+1; idx++;
        cell2.textContent = productName; cell3.textContent = product.price;
        cell4.textContent = product.quantity;
        cell5.textContent = parseInt(cell4.textContent) * parseFloat(product.price);
        sum = sum + parseFloat(cell5.textContent);
    }
    var row = tfoot.insertRow();
    var cell1 = row.insertCell(0);  var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);  var cell4 = row.insertCell(3);
    var cell5 = row.insertCell(4);
    cell4.textContent = "Total:"
    cell5.textContent = sum;
}


async function populatePopup(order_id){
    var info = await fetchSingleOrder(order_id);
    console.log("Got order: ");
    console.log(info);
    console.log("Order info?", info.order);
    updateOrderPopup(info.order);
    updateCustomerPopup(info.customer);
    await upddateProductTable(info.products);
}


document.getElementById("result_table").addEventListener("click", async(event)=>{
    console.log("clicked");
    if(event.target.tagName === "TD"){
        var row = event.target.parentNode;
        // var cell = event.target.cell[0].innerHTML;
        var cells = row.querySelectorAll("td");
        cells.forEach(cell=>{
            console.log(cell.textContent);
        })
        var cell = row.querySelector("td");
    }
    await populatePopup(cell.textContent);
    document.getElementById("popupContainer").style.display = "block";
})


function closePopup(){
    document.getElementById("popupContainer").style.display = "none";
}
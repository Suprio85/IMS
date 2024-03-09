// const { response } = require("../../app");

function addProduct() {
  var products = document.getElementById('products');
  var productDiv = document.createElement('div');
  productDiv.classList.add("product");
  productDiv.innerHTML = `
      <label for="productId">Product ID/Name:</label>
      <input type="text" class="productId" name="productId" required>
      <label for="quantity">Quantity:</label>
      <input type="number" class="quantity" name="quantity" required min="0">
      <button class="remove-product" id="remove" onclick="removeProduct(this)">Remove</button>
      <br>
      <br>
  `;
  products.appendChild(productDiv);
}

function removeProduct(button) {
  var productDiv = button.parentNode;
  productDiv.parentNode.removeChild(productDiv);
}


// function updateCustomerPopup(name, mail, number){
//   var cust_popup = document.getElementById("customerPopup");
//   var innerHTML = `
//             <span>Customer Name: </span>${name}<br>
//             <span>Customer Email: </span>${mail}<br>
//             <span>Customer Name: </span>${number}<br>
//   `;
//   cust_popup.innerHTML = innerHTML;
// }


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
    // console.log(productName);
    // console.log(product);
    return {productName, price};
  });
  // console.log("Am I here ?");
  // return {productName, price};
}


function updateCustomerPopup(name, mail, number){
  var valueList = document.getElementById("customer_value_list");
  valueList.innerHTML = '';
  var li1 = document.createElement('li');
  var li2 = document.createElement('li');
  var li3 = document.createElement('li');
  li1.textContent = name;
  li2.textContent = mail;
  li3.textContent = number;
  valueList.appendChild(li1);
  valueList.appendChild(li2);
  valueList.appendChild(li3);
}

async function flushPurchaseInfo(info){
  var url = "/cashier/record-purchase";
  return fetch(url, {
    method: 'POST',
    headers: { 'Content-type': 'application/json' },
    body: JSON.stringify(info)
  }).then( res => {
    if (!res.ok){
      throw new Error("Something happened in database");
    }
    return res.json();
  }).then(result => {
    if (result.success) return true;
    else return false;
  })
}

function createPurchaseRecord(){
  var name = document.getElementById("customer_name").value;
  var mail = document.getElementById("customer_mail").value;
  var number = document.getElementById("customer_mobile").value;
  var customer = {"name": name, "mail": mail, "number": number};

  var products = document.querySelectorAll(".product");
  var productInfo = [];
  products.forEach(product => {
    var pid = product.querySelector(".productId").value;
    var q = product.querySelector(".quantity").value;
    var p = {"id": parseInt(pid), "quantity": parseInt(q)};
    productInfo.push(p);
    // productInfo.
  })
  var info = {"customer": customer, "products": productInfo};
  // var info = productInfo;
  return info;
}

async function upddateProductTable(){
  var table = document.getElementById("products_table");
  var tbody = table.querySelector("tbody");
  var tfoot = table.querySelector("tfoot");
  tbody.innerHTML = '';
  tfoot.innerHTML = '';
  var products = document.querySelectorAll(".product");
  var sum = 0.00;
  var idx = 0;
  for(var product of products){
    var row = tbody.insertRow();   var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1); var cell3 = row.insertCell(2);
    var cell4 = row.insertCell(3); var cell5 = row.insertCell(4);
    var info = await getProductData(product.querySelector(".productId").value);
    console.log("What is going on here");
    console.log(info);
    cell1.textContent = idx+1; idx++;
    cell2.textContent = info.productName; cell3.textContent = info.price;
    cell4.textContent = product.querySelector(".quantity").value;
    cell5.textContent = parseInt(cell4.textContent) * parseFloat(info.price);
    sum = sum + parseFloat(cell5.textContent);
  }
  var row = tfoot.insertRow();
  var cell1 = row.insertCell(0);  var cell2 = row.insertCell(1);
  var cell3 = row.insertCell(2);  var cell4 = row.insertCell(3);
  var cell5 = row.insertCell(4);
  cell4.textContent = "Total:"
  cell5.textContent = sum;
}



document.getElementById("cash_memo").addEventListener("submit", async function(event){
  event.preventDefault();
  var name = document.getElementById("customer_name").value;
  var mail = document.getElementById("customer_mail").value;
  var number = document.getElementById("customer_mobile").value;
  console.log(name);

  // var products = document.querySelectorAll(".product");
  // products.forEach((product)=>{
  //   var pid = product.querySelector(".productId").value;
  //   var pq = product.querySelector(".quantity").value;
  //   console.log(pid, pq);
  // })

  updateCustomerPopup(name, mail, number);
  await upddateProductTable();
  var popup = document.getElementById("popupContainer");
  popup.style.display = 'block';
})


function closePopup(){
  var popup = document.getElementById("popupContainer");
  popup.style.display = 'none';
}

async function confirmPurchase(){
  // document.getElementById("cash_memo").submit();
  var info = createPurchaseRecord();
  var successful = await flushPurchaseInfo(info);
  if (successful) console.log("Purchess successfully recorded");
  else console.log("Purchase is not recorded");
  var mssg = document.getElementById("completion").getElementsByTagName("span")[0];
  if (successful){
    // var mssg = document.getElementById("completion").getElementsByTagName("span")[0];
    mssg.innerHTML = "Successful";
    mssg.style.color = "green";
    document.getElementById("failed_back_button").disabled = true;
    document.getElementById("general_popup_content").style.display = 'none';
    document.getElementById("completion").style.display = 'block';
  }
  else{
    mssg.innerHTML = "Unsuccessful";
    mssg.style.color = "red";
    document.getElementById("failed_back_button").disabled = false;
    document.getElementById("general_popup_content").style.display = 'none';
    document.getElementById("completion").style.display = 'block';
  }
}


function backToReciept(){
  document.getElementById("popupContainer").style.display = 'none';
  document.getElementById("general_popup_content").style.display = 'block';
  document.getElementById("completion").style.display = 'none';
}

function forwarding(){
  console.log("Going to new page");
  // fetch("/cashier/cash-memo");
  window.location.href = "/cashier/cash_memo";
}





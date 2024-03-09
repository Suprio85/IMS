let productId;


async function toggleAllocateButtons() {
    var allocateButtons = document.getElementsByClassName("allot-btn");
    // Toggle the display property of each "Allot Product" button
    for (var i = 0; i < allocateButtons.length; i++) {
        allocateButtons[i].style.display =
            allocateButtons[i].style.display === "block" ? "none" : "block";
    }
    try {
        const response = await fetch("/zsm/makeold", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Message from server:", data.message);
        alert(data.message); // You can use alert or update the UI as needed
    } catch (error) {
        console.error("Error fetching message:", error);
    }
}



document.addEventListener("DOMContentLoaded", function () {
    // Function to open the pop-up
    function openPopup(productId) {
        document.getElementById("popup").style.display = "block";
    }

    // Attach the openPopup function to each product's button
    let buttons = document.querySelectorAll(".update-btn");
    buttons.forEach(function (button) {
        button.addEventListener("click", function () {
            // Retrieve the Product ID from the button's data-product_id attribute
            productId = button.getAttribute("data-productid");
            console.log(productId);
            document.getElementById("allot_product_button").setAttribute("data-productid", productId);

            openPopup(productId);
        });
    });

    // Attach the closePopup function to the close button
    document.getElementById("closePopup").addEventListener("click", closePopup);
});



function showGraphFromInfo() {
    const selectedShopId = document.getElementById("shopId").value;
    console.log("in submit form: ");
    console.log(selectedShopId);
    console.log(productId);
    const selectedStartMonth =
        document.getElementById("startMonth").value;
    const selectedEndMonth = document.getElementById("endMonth").value;

    const requestData = {
        shopId: selectedShopId,
        productID: productId,
        startMonth: selectedStartMonth,
        endMonth: selectedEndMonth,
    };

    fetch("/rsm/fetch-sale-over-time", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
    })
        .then((response) => response.json())
        .then((data) => {
            console.log("Response from server:", data);

            const messageContainer =
                document.getElementById("messageContainer");
            if (data.success) {
                messageContainer.innerHTML = `<p>${data.message}</p>`;
                console.log("before chart");
                console.log("Data for line chart:", data.dataForLineChart);
                createLineChart(data.dataForLineChart, data.labelsForLineChart);
            } else {
                messageContainer.innerHTML = `<p>Error: ${data.message}</p>`;
            }
        })
        .catch((error) => {
            console.log("Error:", error);
        });
}




function getRandomColor() {
    var letters = "0123456789ABCDEF";
    var color = "#";
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}



function createLineChart(dataForLineChart, labelsForLineChart) {
    console.log("Data for line chart:", dataForLineChart);

    const canvas = document.getElementById("lineChart");
    const ctx = canvas.getContext("2d");
    if (window.lineChartInstance) {
        window.lineChartInstance.destroy();
    }
    window.lineChartInstance = new Chart(ctx, {
        type: "line",
        data: {
            labels: labelsForLineChart,
            datasets: [
                {
                    label: "Line Chart",
                    data: dataForLineChart,
                    borderColor: getRandomColor(),
                    borderWidth: 4,
                    fill: false,
                },
            ],
        },
    });
}




function closePopup() {
    if (window.lineChartInstance) window.lineChartInstance.destroy();
    document.getElementById("popup").style.display = "none";
    document.getElementById("shopId").value = "";
}




// let allotButtons = document.querySelectorAll(".allot-btn");
// allotButtons.forEach(function (button) {
//     button.addEventListener("click", function () {
//         productId = button.getAttribute("data-productid");
//         console.log(productId);

//         openAllotPopup(productId);
//     });
// });


function openAllotementPopup(){
    console.log(productId);
    let pid = document.getElementById("allot_product_button").getAttribute("data-productid");
    const selectedShopId = document.getElementById("shopId").value;
    let shopSelector = document.getElementById("allotShopId");
    shopSelector.value = selectedShopId;
    shopSelector.disabled = true;
    
    openAllotPopup(pid, selectedShopId);
}



document.getElementById("closeAllotPopup").addEventListener("click", closeAllotPopup);




async function openAllotPopup(productId, shop_id) {
    try {
        const response = await fetch("/rsm/total-alloted-product", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({productId, shop_id}),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        // Update the total quantity in the modal
        document.getElementById("totalQuantity").textContent = data.totalQuantity;
        document.getElementById("productid").textContent = "Product ID: " + productId;
        
        document.getElementById("rec_rangeL").textContent = Math.floor(data.r_amount * 0.7);
        document.getElementById("rec_rangeR").textContent = Math.ceil(data.r_amount * 1.2);
        document.getElementById("recommendation").textContent ="Recommended:    "+ data.r_amount;
        document.getElementById("requestedAmount").textContent ="Requested:    "+ data.req_amount;

        document.getElementById("productQuantity").setAttribute("aria-valuemax", data.totalQuantity);

        // // Display the Allot Product modal
        document.getElementById("allotProductPopup").style.display = "block";
        var allocateButtons = document.getElementsByClassName("allot-btn");
        for (var i = 0; i < allocateButtons.length; i++) {
            allocateButtons[i].style.display = "block";
        }
    } catch (error) {
        console.error("Error fetching total quantity:", error);
    }
}



function closeAllotPopup() {
    document.getElementById("allotProductPopup").style.display = "none";
    document.getElementById("allotShopId").value = "";
    document.getElementById("productQuantity").value = "";

    var allocateButtons =
        document.getElementsByClassName("allot-product-btn");
    for (var i = 0; i < allocateButtons.length; i++) {
        allocateButtons[i].style.display = "none";
    }
}




async function submitAllotForm() {
    const selectedAllotShopId = document.getElementById("allotShopId").value;
    const enteredQuantity = parseInt(document.getElementById("productQuantity").value);
    const totalQuantity = parseInt(document.getElementById("totalQuantity").textContent);
    const lrange = parseInt(document.getElementById("rec_rangeL").textContent);
    const rrange = parseInt(document.getElementById("rec_rangeR").textContent);

    const errorMessageElement = document.getElementById("errorMessage");
    errorMessageElement.textContent = "";

    if (enteredQuantity > totalQuantity) {
        errorMessageElement.textContent =
            "Entered quantity exceeds total quantity!";
    } else if(enteredQuantity <= lrange && lrange <= totalQuantity){
        errorMessageElement.textContent =
            "Entered quantity can't bw Lower than recommended range";
    } else if(enteredQuantity >= rrange){
        errorMessageElement.textContent =
            "Entered quantity can't bw Higher than recommended range";
    } else if (enteredQuantity <= 0) {
        errorMessageElement.textContent =
            "Entered quantity should be greater than 0!";
    } else if (!selectedAllotShopId) {
        errorMessageElement.textContent = "Please select a shop!";
    } else if (!enteredQuantity) {
        errorMessageElement.textContent = "Please enter a quantity!";
    } else {
        console.log(
            "Allotting product with ID:", productId,
            "to Shop ID:", selectedAllotShopId,
            "with quantity:", enteredQuantity
        );

        const formData = {
            productId: productId,
            shopId: selectedAllotShopId,
            quantity: enteredQuantity,
        };

        await fetch("/rsm/allot-product-to-shop", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        })
            .then((response) => response.json())
            .then((data) => {
                // Handle the response from the backend if needed
                console.log("Backend response:", data);
                alert(data.message);
            })
            .catch((error) => {
                console.error("Error sending data to the backend:", error);
            });

        document.getElementById("allotProductPopup").style.display = "none";
    }
}
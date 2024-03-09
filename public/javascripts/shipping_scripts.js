
function openReviewPage(button){
    console.log(button.getAttribute("data-requestId"));
    let requestId = button.getAttribute("data-requestId");
    window.location.href = "/rsm/process-request?requestId=" + encodeURIComponent(requestId);
}


function goBack(){
    window.history.back();
}


async function supplyShipment(button){
    let ship_id = button.getAttribute("data-shipmentId");
    let req_id = button.getAttribute("data-reqId")
    console.log(ship_id, req_id);
    let respone = await fetch('/rsm/supply-shipment', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({shipment_id: ship_id})
    });
    if (!respone.ok){
        throw new Error("Something happened in backend");
    }
    else{
        let res = await respone.json();
        console.log("Something happened ?");
        alert(res.message);
    }
    // window.location.href = "process-request?requestId="+encodeURIComponent(req_id);
    location.reload();
}


async function createNewShipment(button){
    let request_id = button.getAttribute("data-reqId");
    let inventory_id = button.getAttribute("data-inventoryId");
    console.log({request_id, inventory_id});
    
    let respone = await fetch('/rsm/create-new-shipment', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({request_id, inventory_id})
    });
    if (!respone.ok){
        throw new Error("Something happened in backend");
    }
    else{
        let res = await respone.json();
        console.log("Something happened ?");
        alert(res.message);
    }
    location.reload();
}

async function closeShipmentRequest(button){
    let request_id = button.getAttribute("data-req_id");
    let respone = await fetch('/rsm/close-shipment-request', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({request_id})
    });
    if (!respone.ok){
        throw new Error("Something happened in backend");
    }
    else{
        let res = await respone.json();
        location.reload();
        alert(res.message);
    }
}


async function completeShipmentRequest(button){
    let request_id = button.getAttribute("data-req_id");
    
    let respone = await fetch('/rsm/complete-shipment-request', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({request_id})
    });
    if (!respone.ok){
        throw new Error("Something happened in backend");
    }
    else{
        let res = await respone.json();
        location.reload();
        alert(res.message);
    }

}
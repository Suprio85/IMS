
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
        body: JSON.stringify({req_id: ship_id})
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
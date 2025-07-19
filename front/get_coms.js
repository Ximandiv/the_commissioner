document.addEventListener("DOMContentLoaded", async function(){
    await pollCommissions();
    setInterval(pollCommissions, 5 * 60 * 1000)
});

export async function pollCommissions(){
    try{
        await getCommissionList();
    } catch (error){
        console.error(error);
    }
}

async function getCommissionList(){
    const tableContent = document.querySelector("table tbody");
    const commissionList = await getFromAPI();

    tableContent.replaceChildren();
    commissionList.forEach(coms => {
        const tr = document.createElement("tr");
        const idData = document.createElement("td");
        const nameData =document.createElement("td");
        const addressData = document.createElement("td");
        const deadlineData = document.createElement("td");
        const statusData = document.createElement("td");
        const actionsData = document.createElement("td");

        idData.textContent = coms.id;
        nameData.textContent = coms.name;
        addressData.textContent = coms.deliveryAddress;
        deadlineData.textContent = coms.deadlineAt;
        statusData.textContent = coms.status;

        const actions = document.createElement("div");
        actions.classList.add("actions");

        const buttonDetails = document.createElement("button");
        const buttonDelete = document.createElement("button");
        buttonDetails.textContent = "Detalles";
        buttonDelete.textContent = "Eliminar";
        buttonDetails.classList.add("ver-com");
        buttonDelete.classList.add("elim-com");
        buttonDetails.setAttribute("type", "button");
        buttonDelete.setAttribute("type", "button");

        actions.append(buttonDetails, buttonDelete);

        actionsData.appendChild(actions);

        tr.append(idData,
                    nameData,
                    addressData,
                    deadlineData,
                    statusData,
                    actionsData
        );

        tableContent.appendChild(tr);
    });
}

async function getFromAPI(){
    const response = await fetch('https://localhost:7117/Commission', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if(!response.ok){
        throw new Error(`HTTP error during creation! status: ${response.status}`);
    }

    console.log("Yay you got commissions");

    return response.json();
}
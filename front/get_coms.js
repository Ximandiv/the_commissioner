import { deleteCommission } from './delete_com.js';

let currentPage = 1;
let totalPages = 1;
document.addEventListener("DOMContentLoaded", async function(){
    await pollCommissions(currentPage);

    document.getElementById("prevPage").addEventListener("click", async () => {
        if (currentPage > 1) {
            currentPage--;
            await pollCommissions(currentPage);
        }
    });
    document.getElementById("nextPage").addEventListener("click", async () => {
        if(currentPage >= totalPages){
            currentPage = totalPages;
            return;
        }
        currentPage++;
        await pollCommissions(currentPage);
    });
});

export async function pollCommissions(currentPage){
    try{
        await getCommissionList(currentPage);
        document.getElementById("pageInfo").textContent = `Página ${currentPage} de ${totalPages}`;
    } catch (error){
        console.error(error);
    }
}

async function getCommissionList(currentPage){
    const pageSize = 6;
    const tableContent = document.querySelector("table tbody");
    const commissionList = await getFromAPI(currentPage, pageSize);
    console.log(commissionList);
    totalPages = commissionList.totalPages;

    tableContent.replaceChildren();
    let commissionNumber = (currentPage - 1) * pageSize + 1;
    commissionList.items.forEach(coms => {
        const tr = document.createElement("tr");
        const idData = document.createElement("td");
        const nameData = document.createElement("td");
        const addressData = document.createElement("td");
        const deadlineData = document.createElement("td");
        const statusData = document.createElement("td");
        const createdData = document.createElement("td");
        const updatedData = document.createElement("td");
        const actionsData = document.createElement("td");

        const deadlineDate = new Date(coms.deadlineAt);
        const createdDate = new Date(coms.createdAt);
        const updatedDate = new Date(coms.updatedAt);

        const deadlineDateCleaned = `${deadlineDate.getMonth() + 1}/${deadlineDate.getDate()}/${deadlineDate.getFullYear()}`;
        const createdDateCleaned = `${createdDate.getMonth() + 1}/${createdDate.getDate()}/${createdDate.getFullYear()}`;
        const updatedDateCleaned = `${updatedDate.getMonth() + 1}/${updatedDate.getDate()}/${updatedDate.getFullYear()}`;

        idData.textContent = commissionNumber;
        nameData.textContent = coms.name;
        addressData.textContent = coms.deliveryAddress;
        deadlineData.textContent = deadlineDateCleaned;
        statusData.textContent = coms.status;
        createdData.textContent = createdDateCleaned;
        updatedData.textContent = updatedDateCleaned;

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
                    createdData,
                    updatedData,
                    actionsData
        );

        tableContent.appendChild(tr);

        buttonDelete.addEventListener("click", async function(){
            await deleteCommission(coms.id, tr);
            await pollCommissions(currentPage);
        });
        commissionNumber++;
    });
}

async function getFromAPI(currentPage, pageSize){
    const response = await fetch(`https://localhost:7117/Commission?pageNumber=${currentPage}&pageSize=${pageSize}`, {
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
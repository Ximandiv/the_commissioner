import { CommissionTable } from './table.js';

let currentPage = 1;
let totalPages = 1;

export async function pollCommissions(currentPage, tableContent){
    try{
        await getCommissionList(currentPage, tableContent);
        document.getElementById("pageInfo").textContent = `Página ${currentPage} de ${totalPages}`;
    } catch (error){
        console.error(error);
    }
}

document.addEventListener("DOMContentLoaded", async function(){
    const tableContent = new CommissionTable();
    await pollCommissions(currentPage, tableContent);

    document.getElementById("prevPage").addEventListener("click", async () => {
        if (currentPage > 1) {
            currentPage--;
            await pollCommissions(currentPage, tableContent);
        }
    });
    document.getElementById("nextPage").addEventListener("click", async () => {
        if(currentPage >= totalPages){
            currentPage = totalPages;
            return;
        }
        currentPage++;
        await pollCommissions(currentPage, tableContent);
    });
});

async function getCommissionList(currentPage, tableContent){
    const pageSize = 3;
    const commissionList = await getFromAPI(currentPage, pageSize);
    totalPages = commissionList.totalPages;

    tableContent.clearData();
    let commissionNumber = (currentPage - 1) * pageSize + 1;
    commissionList.items.forEach(coms => {
        tableContent.addData(coms, commissionNumber, currentPage);

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

    return response.json();
}
import { CommissionTable } from './table.js';

let currentPage = 1;
let totalPages = 1;

export async function pollCommissions(currentPage = 1){
    const tableContent = new CommissionTable();
    try{
        await getCommissionList(currentPage, tableContent);

        // Changes the 'page x out of y' text
        document.getElementById("pageInfo").textContent = `Página ${currentPage} de ${totalPages}`;
    } catch (error){
        console.error(error);
    }
}

document.addEventListener("DOMContentLoaded", async function(){
    await pollCommissions(currentPage);

    // If clicking previous page btn validates then goes back if ok
    document.getElementById("prevPage").addEventListener("click", async () => {
        if (currentPage > 1) {
            currentPage--;
            await pollCommissions(currentPage);
        }
    });

    // If clicking next page btn validates then goes to next if ok
    document.getElementById("nextPage").addEventListener("click", async () => {
        if(currentPage >= totalPages){
            currentPage = totalPages;
            return;
        }
        currentPage++;
        await pollCommissions(currentPage);
    });
});

async function getCommissionList(currentPage, tableContent){
    tableContent.clearData();

    const pageSize = 3;
    const commissionList = await getFromAPI(currentPage, pageSize);
    if(!commissionList)
        return;

    totalPages = commissionList.totalPages;

    // Formula that calculates the # of item that represents according to page and page size
    let commissionNumber = (currentPage - 1) * pageSize + 1;

    commissionList.items.forEach(coms => {
        tableContent.addData(coms, commissionNumber, currentPage);

        commissionNumber++;
    });
}

async function getFromAPI(currentPage, pageSize){
    try{
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
    } catch(error){
        console.error(error);
        return false;
    }
}
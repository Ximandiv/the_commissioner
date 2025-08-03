import { TableData } from './tableData.js';

export class CommissionTable{
    constructor(){
        this.tableBody = document.querySelector("table tbody");
    }

    clearData(){
        this.tableBody.replaceChildren();
    }

    addData(coms, commissionNumber, currentPage){
        const tableData = new TableData(coms, commissionNumber, currentPage);

        this.tableBody.appendChild(tableData.row);
    }
}
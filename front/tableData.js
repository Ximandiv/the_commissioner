import { deleteCommission } from "./delete_com.js";
import { pollCommissions } from "./get_coms.js";

export class TableData{
    constructor(coms, commissionNumber, currentPage){
        this.row = document.createElement("tr");

        const idData = document.createElement("td");
        const clientNameData = document.createElement("td");
        const nameData = document.createElement("td");
        const addressData = document.createElement("td");
        const priceData = document.createElement("td");
        const currencyData = document.createElement("td");
        const deadlineData = document.createElement("td");
        const statusData = document.createElement("td");
        const createdData = document.createElement("td");
        const updatedData = document.createElement("td");
        const actionsData = document.createElement("td");

        const deadlineDateRaw = new Date(coms.deadlineAt);
        const createdDateRaw = new Date(coms.createdAt);
        const updatedDateRaw = new Date(coms.updatedAt);

        const deadlineDate = this.#cleanDate(deadlineDateRaw);
        const createdDate = this.#cleanDate(createdDateRaw);
        const updatedDate = this.#cleanDate(updatedDateRaw)

        idData.textContent = commissionNumber;
        clientNameData.textContent = coms.clientName;
        nameData.textContent = coms.name;
        addressData.textContent = coms.deliveryAddress;
        priceData.textContent = `$${coms.price}`;
        currencyData.textContent = coms.currency;
        deadlineData.textContent = deadlineDate;
        statusData.textContent = coms.status;
        createdData.textContent = createdDate;
        updatedData.textContent = updatedDate;

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

        this.row.append(idData,
                        clientNameData,
                        nameData,
                        addressData,
                        priceData,
                        currencyData,
                        deadlineData,
                        statusData,
                        createdData,
                        updatedData,
                        actionsData
        );

        buttonDelete.addEventListener("click", async function(){
            await deleteCommission(coms.id);
            await pollCommissions(currentPage);
        });
    }

    #cleanDate(date){
        return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    }
}
import { deleteCommission } from "./delete_com.js";
import { pollCommissions } from "./get_coms.js";

export class TableData{
    constructor(coms, commissionNumber, currentPage){
        this.row = document.createElement("tr");

        const idData = document.createElement("td");
        const clientNameData = document.createElement("td");
        const nameData = document.createElement("td");
        const priceData = document.createElement("td");
        const deadlineData = document.createElement("td");
        const statusData = document.createElement("td");
        const actionsData = document.createElement("td");

        const deadlineDateRaw = new Date(coms.deadlineAt);

        const deadlineDate = this.#cleanDate(deadlineDateRaw);

        idData.textContent = commissionNumber;
        clientNameData.textContent = coms.clientName;
        nameData.textContent = coms.name;
        priceData.textContent = `${coms.currency} $${coms.price}`;
        deadlineData.textContent = deadlineDate;
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

        this.row.append(idData,
                        clientNameData,
                        nameData,
                        priceData,
                        deadlineData,
                        statusData,
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
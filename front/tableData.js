import { deleteCommission } from "./delete_com.js";
import { CommissionDetails } from "./details_com.js";
import { pollCommissions } from "./get_coms.js";
import { ModalPopup } from "./modal.js";

export class TableData{
    constructor(coms, commissionNumber, currentPage){
        this.row = document.createElement("tr");

        this.commissionDetails = new CommissionDetails(coms);

        this.detailModal = new ModalPopup();
        this.detailModal.appendContent(this.commissionDetails.container);
        document.body.append(this.detailModal.modal);

        const idData = document.createElement("td");
        const clientNameData = document.createElement("td");
        const nameData = document.createElement("td");
        const priceData = document.createElement("td");
        const deadlineData = document.createElement("td");
        const statusData = document.createElement("td");
        const statusContainer = document.createElement("div");
        const actionsData = document.createElement("td");

        const deadlineDate = this.#cleanDate(coms.deadlineAt);

        idData.textContent = commissionNumber;
        clientNameData.textContent = coms.clientName;
        nameData.textContent = coms.name;
        priceData.textContent = `${coms.currency} $${coms.price}`;
        deadlineData.textContent = deadlineDate;
        statusContainer.textContent = coms.status;

        statusContainer.classList.add("status");
        if(coms.status === "Creado")
            statusContainer.classList.add("created");
        else if(coms.status === "En Progreso")
            statusContainer.classList.add("progress");
        else if(coms.status === "Completado")
            statusContainer.classList.add("complete");
        else if(coms.status === "Cancelado")
            statusContainer.classList.add("canceled");
        else if(coms.status === "Fallido")
            statusContainer.classList.add("failed");
        else if(coms.status === "En Espera")
            statusContainer.classList.add("hold");
        else if(coms.status === "Atrasado")
            statusContainer.classList.add("late");

        statusData.append(statusContainer);

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
        buttonDetails.addEventListener("click", () => {
            this.detailModal.display();
        });
    }

    #cleanDate(dateString){
        const datePart = dateString.split('T')[0];
        const [year, month, day] = datePart.split('-');
        return `${parseInt(month)}/${parseInt(day)}/${year}`;
    }
}
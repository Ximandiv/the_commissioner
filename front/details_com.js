export class CommissionDetails{
    constructor(coms){
        this.container = document.createElement("div");
        this.container.classList.add("commission-details-container");

        this.productName = document.createElement("h2");
        this.productName.textContent = coms.name;
        this.productName.classList.add("commission-title");

        this.clientName = document.createElement("h3");
        this.clientName.textContent = `Para ${coms.clientName}`;
        this.clientName.classList.add("commission-client");

        this.deliveryAddress = document.createElement("p");
        this.deliveryAddress.textContent = `Dirección de Entrega en ${coms.deliveryAddress}`;
        this.deliveryAddress.classList.add("commission-delivery");

        this.price = document.createElement("p");
        this.price.textContent = `Precio de $${coms.price}`;
        this.price.classList.add("commission-price");

        this.currency = document.createElement("p");
        this.currency.textContent = `Precio en moneda ${coms.currency}`;
        this.currency.classList.add("commission-currency");

        this.status = document.createElement("p");
        this.status.textContent = `Estado en ${coms.status}`;
        this.status.classList.add("commission-status");

        const deadlineDate = this.#cleanDate(coms.deadlineAt);
        this.deadline = document.createElement("p");
        this.deadline.textContent = `Fecha de Entrega en ${deadlineDate}`;
        this.deadline.classList.add("commission-deadline");

        // Convert to just month, day, year
        const createdDate = new Date(coms.createdAt);
        this.created = document.createElement("p");
        this.created.textContent = `Comisión creada en ${createdDate.toLocaleDateString()}`; // "8/7/2025" (US format)
        this.created.classList.add("commission-created");

        const updatedDate = new Date(coms.updatedAt);
        this.updated = document.createElement("p");
        this.updated.textContent = `Última actualización en ${updatedDate.toLocaleDateString()}`; // "8/7/2025" (US format)
        this.updated.classList.add("commission-updated");

        this.container.append(this.productName,
                            this.clientName,
                            this.deliveryAddress,
                            this.price,
                            this.currency,
                            this.status,
                            this.deadline,
                            this.created,
                            this.updated
        );
    }

    #cleanDate(dateString){
        const datePart = dateString.split('T')[0];
        const [year, month, day] = datePart.split('-');
        return `${parseInt(month)}/${parseInt(day)}/${year}`;
    }

    #switchToInput(coms){
        this.statusDropdown = this.#createStatusDropdown(coms);
    }

    #createStatusDropdown(coms){
        const statusDropdown = document.createElement("select");
        statusDropdown.name = "status";
        statusDropdown.id = "status";

        const createdStatus = document.createElement("option");
        createdStatus.value = "Creado";
        createdStatus.textContent = "Creado";

        const progressStatus = document.createElement("option");
        progressStatus.value = "En Progreso";
        progressStatus.textContent = "En Progreso";

        const completedStatus = document.createElement("option");
        completedStatus.value = "Completado";
        completedStatus.textContent = "Completado";

        const canceledStatus = document.createElement("option");
        canceledStatus.value = "Canceledo";
        canceledStatus.textContent = "Canceledo";

        const failedStatus = document.createElement("option");
        failedStatus.value = "Fallido";
        failedStatus.textContent = "Fallido";

        const holdStatus = document.createElement("option");
        holdStatus.value = "En Espera";
        holdStatus.textContent = "En Espera";

        const lateStatus = document.createElement("option");
        lateStatus.value = "Atrasado";
        lateStatus.textContent = "Atrasado";

        if(coms.status === "Creado")
            createdStatus.selected = true;
        else if(coms.status === "En Progreso")
            progressStatus.selected = true;
        else if(coms.status === "Completado")
            completedStatus.selected = true;
        else if(coms.status === "Cancelado")
            canceledStatus.selected = true;
        else if(coms.status === "Fallido")
            failedStatus.selected = true;
        else if(coms.status === "En Espera")
            holdStatus.selected = true;
        else if(coms.status === "Atrasado")
            lateStatus.selected = true;

        statusDropdown.append(createdStatus,
                            progressStatus,
                            completedStatus,
                            canceledStatus,
                            failedStatus,
                            holdStatus,
                            lateStatus
        );

        return statusDropdown;
    }
}
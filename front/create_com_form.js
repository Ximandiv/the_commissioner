export class CreateForm{
    constructor(){
        this.content = document.createElement("div");
        this.content.id = "create-div";

        const title = document.createElement("h3");
        title.textContent = "Crear Comisión";

        const form = document.createElement("form");
        form.id = "create-form";

        const labelName = document.createElement("label");
        labelName.htmlFor = "name";
        labelName.textContent = "Nombre";

        const inputName = document.createElement("input");
        inputName.type = "text";
        inputName.name = "name";
        inputName.id = "name";
        inputName.placeholder = "Dibujo Realista...";

        const errorName = document.createElement("span");
        errorName.id = "name-errors";
        errorName.style.color = "red";

        const labelAddress = document.createElement("label");
        labelAddress.htmlFor = "address";
        labelAddress.textContent = "Dirección Entrega";

        const inputAddress = document.createElement("input");
        inputAddress.type = "text";
        inputAddress.name = "address";
        inputAddress.id = "address";
        inputAddress.placeholder = "Por la placita de flores en...";

        const errorAddress = document.createElement("span");
        errorAddress.id = "address-errors";
        errorAddress.style.color = "red";

        const labelDeadline = document.createElement("label");
        labelDeadline.htmlFor = "deadline";
        labelDeadline.textContent = "Fecha Entrega";

        const inputDeadline = document.createElement("input");
        inputDeadline.type = "date";
        inputDeadline.name = "deadline";
        inputDeadline.id = "deadline";

        const errorDeadline = document.createElement("span");
        errorDeadline.id = "date-errors";
        errorDeadline.style.color = "red";

        const submitBtn = document.createElement("button");
        submitBtn.type = "submit";
        submitBtn.textContent = "Confirmar";

        form.append(labelName, inputName, errorName,
                    labelAddress, inputAddress, errorAddress,
                    labelDeadline, inputDeadline, errorDeadline,
                    submitBtn
        );

        this.content.append(title, form);
    }
}
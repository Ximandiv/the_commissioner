import { sendCreateToAPI } from "./create_com.js";

export class CreateForm{
    #inputName; #errorName; 
    #inputAddress; #errorAddress; 
    #inputDeadline; #errorDeadline;
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

        this.#inputName = document.createElement("input");
        this.#inputName.type = "text";
        this.#inputName.name = "name";
        this.#inputName.id = "name";
        this.#inputName.placeholder = "Dibujo Realista...";

        this.#errorName = document.createElement("span");
        this.#errorName.id = "name-errors";
        this.#errorName.style.color = "red";

        const labelAddress = document.createElement("label");
        labelAddress.htmlFor = "address";
        labelAddress.textContent = "Dirección Entrega";

        this.#inputAddress = document.createElement("input");
        this.#inputAddress.type = "text";
        this.#inputAddress.name = "address";
        this.#inputAddress.id = "address";
        this.#inputAddress.placeholder = "Por la placita de flores en...";

        this.#errorAddress = document.createElement("span");
        this.#errorAddress.id = "address-errors";
        this.#errorAddress.style.color = "red";

        const labelDeadline = document.createElement("label");
        labelDeadline.htmlFor = "deadline";
        labelDeadline.textContent = "Fecha Entrega";

        this.#inputDeadline = document.createElement("input");
        this.#inputDeadline.type = "date";
        this.#inputDeadline.name = "deadline";
        this.#inputDeadline.id = "deadline";

        this.#errorDeadline = document.createElement("span");
        this.#errorDeadline.id = "date-errors";
        this.#errorDeadline.style.color = "red";

        const submitBtn = document.createElement("button");
        submitBtn.type = "submit";
        submitBtn.textContent = "Confirmar";

        form.append(labelName, this.#inputName, this.#errorName,
                    labelAddress, this.#inputAddress, this.#errorAddress,
                    labelDeadline, this.#inputDeadline, this.#errorDeadline,
                    submitBtn
        );

        this.content.append(title, form);

        form.addEventListener("submit", async (e) => await this.#validateData(e));
    }

    async #validateData(e){
        e.preventDefault();

        this.#errorName.textContent = "";
        this.#errorDeadline.textContent = "";
        this.#errorAddress.textContent = "";

        const comNameValue = this.#inputName.value.trim();
        const comDateValue = this.#inputDeadline.value;
        const comAddressValue = this.#inputAddress.value;
        let errorsFound = false;

        if(comNameValue.length >= 100 || comNameValue.length === 0){
            this.#errorName.textContent = "Nombre no puede ser igual o mayor a 100 caracteres ni estar vacio";
            errorsFound = true;
        }

        if(comAddressValue.length >= 60 || comAddressValue.length === 0){
            this.#errorAddress.textContent = "Direccion no puede ser vacia o ser mayor o igual a 60 caracteres";
            errorsFound = true;
        }

        if(!comDateValue){
            this.#errorDeadline.textContent = "Fecha no puede ser vacia";
            errorsFound = true;
        }

        const [year, month, day] = comDateValue.split('-');
        const selectedDate = new Date(year, month - 1, day);
        const today = new Date();
        
        selectedDate.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);

        if (selectedDate <= today) {
            if(dateError.textContent.length === 0){
                this.#errorDeadline.textContent = "Fecha no puede ser hoy o en el pasado";
            }else{
                this.#errorDeadline += " y no puede ser hoy o en el pasado";
            }
            errorsFound = true;
        }

        if(errorsFound === true){
            return;
        }
        
        await sendCreateToAPI(comNameValue, comAddressValue, comDateValue);
    }
}
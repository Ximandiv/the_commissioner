import { sendCreateToAPI } from "./create_com.js";

export class CreateForm{
    #inputName; #errorName; 
    #inputClientName; #errorClientName;
    #inputAddress; #errorAddress; 
    #inputPrice; #errorPrice;
    #inputCurrency; #errorCurrency;
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
        this.#inputName.required = true;

        this.#errorName = document.createElement("span");
        this.#errorName.id = "name-errors";
        this.#errorName.style.color = "red";

        const labelClientName = document.createElement("label");
        labelClientName.htmlFor = "client-name";
        labelClientName.textContent = "Cliente";

        this.#inputClientName = document.createElement("input");
        this.#inputClientName.type = "text";
        this.#inputClientName.name = "client-name";
        this.#inputClientName.id = "client-name";
        this.#inputClientName.placeholder = "Pepito G...";
        this.#inputClientName.required = true;

        this.#errorClientName = document.createElement("span");
        this.#errorClientName.id = "client-name-errors";
        this.#errorClientName.style.color = "red";

        const labelAddress = document.createElement("label");
        labelAddress.htmlFor = "address";
        labelAddress.textContent = "Dirección Entrega";

        this.#inputAddress = document.createElement("input");
        this.#inputAddress.type = "text";
        this.#inputAddress.name = "address";
        this.#inputAddress.id = "address";
        this.#inputAddress.placeholder = "Por la placita de flores en...";
        this.#inputAddress.required = true;

        this.#errorAddress = document.createElement("span");
        this.#errorAddress.id = "address-errors";
        this.#errorAddress.style.color = "red";

        const labelPrice = document.createElement("label");
        labelPrice.htmlFor = "price";
        labelPrice.textContent = "Precio";

        this.#inputPrice = document.createElement("input");
        this.#inputPrice.type = "number";
        this.#inputPrice.step = "0.01"
        this.#inputPrice.min = "0";
        this.#inputPrice.name = "price";
        this.#inputPrice.id = "price";
        this.#inputPrice.placeholder = "0.00";
        this.#inputPrice.required = true;

        this.#errorPrice = document.createElement("span");
        this.#errorPrice.id = "price-errors";
        this.#errorPrice.style.color = "red";

        const labelCurrency = document.createElement("label");
        labelCurrency.htmlFor = "currency";
        labelCurrency.textContent = "Moneda";

        this.#inputCurrency = document.createElement("input");
        this.#inputCurrency.type = "text";
        this.#inputCurrency.name = "currency";
        this.#inputCurrency.id = "currency";
        this.#inputCurrency.required = true;

        this.#errorCurrency = document.createElement("span");
        this.#errorCurrency.id = "currency-errors";
        this.#errorCurrency.style.color = "red";

        const labelDeadline = document.createElement("label");
        labelDeadline.htmlFor = "deadline";
        labelDeadline.textContent = "Fecha Entrega";

        this.#inputDeadline = document.createElement("input");
        this.#inputDeadline.type = "date";
        this.#inputDeadline.name = "deadline";
        this.#inputDeadline.id = "deadline";
        this.#inputDeadline.required = true;

        this.#errorDeadline = document.createElement("span");
        this.#errorDeadline.id = "date-errors";
        this.#errorDeadline.style.color = "red";

        const submitBtn = document.createElement("button");
        submitBtn.type = "submit";
        submitBtn.textContent = "Confirmar";

        form.append(labelClientName, this.#inputClientName, this.#errorClientName,
                    labelName, this.#inputName, this.#errorName,
                    labelAddress, this.#inputAddress, this.#errorAddress,
                    labelPrice, this.#inputPrice, this.#errorPrice,
                    labelCurrency, this.#inputCurrency, this.#errorCurrency,
                    labelDeadline, this.#inputDeadline, this.#errorDeadline,
                    submitBtn
        );

        this.content.append(title, form);

        form.addEventListener("submit", async (e) => await this.#validateData(e));
    }

    async #validateData(e){
        e.preventDefault();

        this.#errorClientName.textContent = "";
        this.#errorName.textContent = "";
        this.#errorAddress.textContent = "";
        this.#errorDeadline.textContent = "";
        this.#errorPrice.textContent = "";
        this.#errorCurrency.textContent = "";

        const comClientNameValue = this.#inputClientName.value.trim();
        const comNameValue = this.#inputName.value.trim();
        const comAddressValue = this.#inputAddress.value.trim();
        const comPriceValue = this.#inputPrice.value;
        const comCurrencyValue = this.#inputCurrency.value.trim().toUpperCase();
        const comDateValue = this.#inputDeadline.value;

        let errorsFound = false;
        if(comClientNameValue.length >= 50 || comClientNameValue.length === 0){
            this.#errorClientName.textContent = "Nombre de cliente no puede ser igual o mayor a 50 ni estar vacio";
            errorsFound = true;
        }

        if(comNameValue.length >= 100 || comNameValue.length === 0){
            this.#errorName.textContent = "Nombre no puede ser igual o mayor a 100 caracteres ni estar vacio";
            errorsFound = true;
        }

        if(comAddressValue.length >= 60 || comAddressValue.length === 0){
            this.#errorAddress.textContent = "Direccion no puede ser vacia o ser mayor o igual a 60 caracteres";
            errorsFound = true;
        }

        if(!comPriceValue || comPriceValue < 0){
            this.#errorPrice.textContent = "Precio no puede ser menor que 0 ni estar vacio";
            errorsFound = true;
        }

        if(comCurrencyValue.length <= 0 || comCurrencyValue.length > 3){
            this.#errorCurrency.textContent = "Moneda no puede ser mayor de 3 letras ni vacio (Ej. correcto USD, COP)";
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
        
        await sendCreateToAPI(comClientNameValue,
                                comNameValue,
                                comAddressValue,
                                comPriceValue,
                                comCurrencyValue,
                                comDateValue);
    }
}
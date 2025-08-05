import { pollCommissions } from './get_coms.js';
import { ModalPopup } from './modal.js';
import { CreateForm } from './create_com_form.js';

document.addEventListener("DOMContentLoaded", async () => {
    const modalPopup = new ModalPopup();
    modalPopup.modal.id = "myModal";

    const createFormModel = new CreateForm();
    modalPopup.appendContent(createFormModel.content);

    document.body.append(modalPopup.modal);

    // Gets the button to create
    const openBtn = document.getElementById('create');

    // Gets the modal button to close
    const closeBtn = modalPopup.modal.querySelector(".close");

    const form = createFormModel.content.querySelector("#create-form");
    const nameError = form.querySelector("#name-errors");
    const dateError = form.querySelector("#date-errors");
    const addressError = form.querySelector("#address-errors");

    const comName = form.querySelector("#name");
    const comDate = form.querySelector("#deadline");
    const comAddress = form.querySelector("#address");

    const confirmCreation = form.querySelector("button");

    openBtn.onclick = function() {
        modalPopup.display();
    }

    closeBtn.onclick = function() {
        modalPopup.close();
    }

    window.onclick = function(event) {
        if (event.target === modalPopup.modal) {
            modalPopup.close();
        }
    }

    confirmCreation.onclick = async function(event) {
        event.preventDefault();

        nameError.textContent = "";
        dateError.textContent = "";
        addressError.textContent = "";

        const comNameValue = comName.value.trim();
        const comDateValue = comDate.value;
        const comAddressValue = comAddress.value;
        let errorsFound = false;

        if(comNameValue.length >= 100 || comNameValue.length === 0){
            nameError.textContent = "Nombre no puede ser igual o mayor a 100 caracteres ni estar vacio";
            errorsFound = true;
        }

        if(comAddressValue.length >= 60 || comAddressValue.length === 0){
            addressError.textContent = "Direccion no puede ser vacia o ser mayor o igual a 60 caracteres";
            errorsFound = true;
        }

        if(!comDateValue){
            dateError.textContent = "Fecha no puede ser vacia";
            errorsFound = true;
        }

        const [year, month, day] = comDateValue.split('-');
        const selectedDate = new Date(year, month - 1, day);
        const today = new Date();
        
        selectedDate.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);

        if (selectedDate <= today) {
            if(dateError.textContent.length === 0){
                dateError.textContent = "Fecha no puede ser hoy o en el pasado";
            }else{
                dateError.textContent += " y no puede ser hoy o en el pasado";
            }
            errorsFound = true;
        }

        if(errorsFound === true){
            return;
        }

        await sendToAPI(comNameValue, comDateValue, comAddressValue);

        await pollCommissions();

        modalPopup.style.display = 'none';
    }

    async function sendToAPI(name, deadline, address) {
        const payload = {
            name: name,
            deliveryAddress: address,
            deadlineAt: deadline
        };
        
        const response = await fetch('https://localhost:7117/Commission', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if(!response.ok){
            throw new Error(`HTTP error during creation! status: ${response.status}`);
        }

        console.log("Yay! you created a commission");
    }
});
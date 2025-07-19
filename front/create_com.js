import { pollCommissions } from './get_coms.js';

document.addEventListener("DOMContentLoaded", async () => {
    const modal = document.getElementById('myModal');

    const openBtn = document.getElementById('create');

    const closeBtn = document.getElementsByClassName('close')[0];

    const creationForm = modal.querySelector(".modal-content #create-form");
    const nameError = creationForm.querySelector("#name-errors");
    const dateError = creationForm.querySelector("#date-errors");
    const addressError = creationForm.querySelector("#address-errors");

    const comName = creationForm.querySelector("#name");
    const comDate = creationForm.querySelector("#deadline");
    const comAddress = creationForm.querySelector("#address");

    const confirmCreation = creationForm.querySelector("button");

    openBtn.onclick = function() {
        modal.style.display = 'block';
    }

    closeBtn.onclick = function() {
        modal.style.display = 'none';
    }

    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
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

        modal.style.display = 'none';
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
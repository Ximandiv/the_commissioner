import { pollCommissions } from './get_coms.js';
import { ModalPopup } from './modal.js';
import { CreateForm } from './create_com_form.js';

const modalPopup = new ModalPopup();
document.addEventListener("DOMContentLoaded", async () => {
    const createFormModel = new CreateForm();
    modalPopup.appendContent(createFormModel.content);

    document.body.append(modalPopup.modal);

    // Gets the button to create to open modal popup
    const createBtn = document.getElementById('create');
    createBtn.onclick = function() {
        modalPopup.display();
    }
});

export async function sendCreateToAPI(name, address, deadline) {
    const payload = {
        name: name,
        deliveryAddress: address,
        deadlineAt: deadline,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
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

    await pollCommissions();

    modalPopup.hide();
}
export class ModalPopup{
    constructor(){
        this.modal = document.createElement("div");
        this.modal.classList.add("modal");
        this.modal.style.display = "none";

        this.content = document.createElement("div");
        this.content.classList.add("modal-content");

        const closeButton = document.createElement("span");
        closeButton.textContent = "×";
        closeButton.classList.add("close");

        this.content.append(closeButton);
        this.modal.append(this.content);
    }

    display(){
        this.modal.style.display = "block";
    }

    close(){
        this.modal.style.display = "none";
    }

    appendContent(data){
        this.content.append(data);
    }
}
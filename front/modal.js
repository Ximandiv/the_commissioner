export class ModalPopup{
    #content;
    constructor(){
        this.modal = document.createElement("div");
        this.modal.classList.add("modal");
        this.modal.style.display = "none";

        this.#content = document.createElement("div");
        this.#content.classList.add("modal-content");

        const closeBtn = document.createElement("span");
        closeBtn.textContent = "×";
        closeBtn.classList.add("close");

        this.#content.append(closeBtn);
        this.modal.append(this.#content);

        window.onclick = (event) => {
            if (event.target.classList.contains("modal")) {
                this.hide();
            }
        }

        closeBtn.onclick = () => this.hide();
    }

    display(){
        this.modal.style.display = "block";
    }

    hide(){
        this.modal.style.display = "none";
    }

    appendContent(data){
        this.#content.append(data);
    }
}
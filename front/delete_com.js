document.addEventListener("DOMContentLoaded", function() {
    const tbody = document.querySelector("tbody");

    tbody.addEventListener("click", function(event){
        if(event.target.classList.contains("elim-com")){
            const tr = event.target.closest("tr");
            tr.remove();
        }
    });
});
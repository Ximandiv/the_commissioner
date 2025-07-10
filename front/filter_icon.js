document.addEventListener("DOMContentLoaded", function() {
    const button = document.querySelector(".filter-icon");

    const filterButtons = document.querySelectorAll(".filter-actions button");
    const filterActions = document.querySelector(".filter-actions");

    button.addEventListener("click", function(){
        button.classList.toggle("filter-hover");
        button.classList.toggle("filter-active");

        if(filterActions.classList.contains('filter-actions-visible')){
            filterButtons.forEach(btn => {btn.disabled = true});
            filterActions.classList.toggle("filter-actions-hide")
            setTimeout(() => {
                filterActions.classList.toggle("filter-actions-hidden");
                filterActions.classList.toggle("filter-actions-hide")
                filterActions.classList.toggle("filter-actions-visible");
            }, 300);
        }
        else{
            filterButtons.forEach(btn => {btn.disabled = false});
            filterActions.classList.toggle("filter-actions-hidden");
            filterActions.classList.toggle("filter-actions-visible");
        }
    });
});
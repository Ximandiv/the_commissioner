document.addEventListener("DOMContentLoaded", function() {
    const nav = document.querySelector("nav");
    const header = document.querySelector("header");
    const menu_header = header.querySelector(".hamburger_menu button");
    const menu_nav = nav.querySelector(".logo button");

    menu_header.addEventListener("click",function(event){
        event.preventDefault();

        nav.classList.remove("salida");
        nav.classList.toggle("visible");
    });

    menu_nav.addEventListener("click", function(event){
        event.preventDefault();

        nav.classList.toggle("salida")

        setTimeout(() => {
            nav.classList.remove("visible");
            nav.classList.remove("salida");
        }, 300);
    });
});

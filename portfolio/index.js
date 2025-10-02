
document.addEventListener("DOMContentLoaded", function(){
    const burger = document.querySelector(".header__burger");
    const nav = document.querySelector(".nav__small_screens");
    const navList = document.querySelector(".nav__small_screens_list");
    const navItems = navList.querySelectorAll(".nav__small_screens_item");
    
    function openCloseMenu(){
        
        document.body.classList.toggle("no-scroll");
        nav.classList.toggle("nav__small_screens_active");
        burger.classList.toggle('header__burger--active');
    }
    
    if (burger) {
        burger.addEventListener("click", openCloseMenu);
    }

    if (navItems) {
        navItems.forEach(item => {
            const link = item.querySelector(".nav__small_screens_link");
            link.addEventListener("click", openCloseMenu);
        });
    }
    window.addEventListener("resize", () => {
        if (window.innerWidth > 768) {
            document.body.classList.remove("no-scroll");
            nav.classList.remove("nav__small_screens_active");
            burger.classList.remove('header__burger--active');
        }
    });
})
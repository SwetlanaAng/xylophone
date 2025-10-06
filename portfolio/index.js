
document.addEventListener("DOMContentLoaded", onDOMContentLoaded) 
const mediaQueryList = window.matchMedia("(hover: hover) and (pointer: fine)");
    
function handleModeChange() { onDOMContentLoaded();}
mediaQueryList.addListener(handleModeChange);

handleModeChange();
function onDOMContentLoaded() {
    const htmlElement = document.querySelector('html');
    const burger = document.querySelector(".header__burger");
    const nav = document.querySelector(".nav__small_screens");
    const navList = document.querySelector(".nav__small_screens_list");
    const navItems = navList.querySelectorAll(".nav__small_screens_item");
    const buttonScroll = document.querySelector(".hero__stats-scroll");
    const portfolioSlider = document.querySelector(".portfolio__viewport");
    const portfolioTrack = document.querySelector(".portfolio__track");
    const faqHeaders = document.querySelectorAll(".faq__header");
    const faqId = sessionStorage.getItem("faq-id")? sessionStorage.getItem("faq-id") : 'faq-1';
    const faqDefailtItem = document.querySelector(`#${faqId}`);
    const modalCross = document.querySelector(".modal__cross");
    const modalBg = document.querySelector(".modal-bg");
    const pricingButtons = document.querySelectorAll(".pricing__button");

    function closeModal() {
        modalBg.classList.remove("modal-bg--active");
        htmlElement.classList.remove("no-scroll");
    }
    pricingButtons.forEach(button => {
        button.addEventListener("click", () => {
            htmlElement.classList.add("no-scroll");
            const modalTop = htmlElement.scrollTop;
            modalBg.style.top = `${modalTop}px`;
            modalBg.classList.add("modal-bg--active");
            
        });
    });
    modalCross.addEventListener("click", closeModal);
    modalBg.addEventListener("click", (e) => {
        if (e.target === modalBg) {
            closeModal();
        }
    });
            
    faqDefailtItem.parentElement.classList.add("faq__item--active");
    faqDefailtItem.nextElementSibling.classList.add("faq__content--active");
    

    function openCloseMenu(e){
        e.stopImmediatePropagation();
        htmlElement.classList.toggle("no-scroll");
        nav.classList.toggle("nav__small_screens_active");
        burger.classList.toggle('header__burger--active');
    }
    function isTouchDevice() {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
    }

    let mode = isTouchDevice() ? 'touch' : 'mouse';
    let currentTranslateX = 0;
    let sliderInterval = null;
    
    function initSlider() {

        const currentTransform = portfolioTrack.style.transform;

        let savedTranslateX = 0;
        if (currentTransform.includes('calc(-50%')) {
            const match = currentTransform.match(/calc\(-50% ([+-]) (-?\d+(?:\.\d+)?)px\)/);
            if (match) {
                const sign = match[1] === '+' ? 1 : -1;
                const value = parseFloat(match[2]);
                savedTranslateX = sign * value;
            }
        }
        if (savedTranslateX !== 0) {
            currentTranslateX = savedTranslateX;
        }
        
        const bounds = getSliderBounds();
        currentTranslateX = Math.max(bounds.minTranslate, Math.min(bounds.maxTranslate, currentTranslateX));
        portfolioTrack.style.transform = `translateX(calc(-50% + ${currentTranslateX}px))`;
    }
    
    function getSliderBounds() {
        const trackWidth = portfolioTrack.scrollWidth;
        const viewportWidth = portfolioSlider.offsetWidth;
        const margin = 20;
        const maxTranslateLeft = -((trackWidth-viewportWidth)/2  + margin);
        const maxTranslateRight = (trackWidth-viewportWidth)/2  + margin;
        
        return { 
            minTranslate: maxTranslateLeft,
            maxTranslate: maxTranslateRight
        };
    }
    
    function startSliderAnimation(direction) {
        if (sliderInterval) {
            clearInterval(sliderInterval);
            sliderInterval = null;
        }
       
        portfolioTrack.style.transition = 'none';
        
        sliderInterval = setInterval(() => {
            const bounds = getSliderBounds();
            const speed = 3;
            
            currentTranslateX += direction * speed;
            
            if (currentTranslateX < bounds.minTranslate) {
                currentTranslateX = bounds.minTranslate;
                stopSliderAnimation();
                return;
            }
            if (currentTranslateX > bounds.maxTranslate) {
                currentTranslateX = bounds.maxTranslate;
                stopSliderAnimation();
                return;
            }
            
            
            portfolioTrack.style.transform = `translateX(calc(-50% + ${currentTranslateX}px))`;
            
        }, 16);
    }
    
    function stopSliderAnimation() {
        if (sliderInterval) {
            clearInterval(sliderInterval);
            sliderInterval = null;
            portfolioTrack.style.transition = 'transform 0.3s ease';
        }
    }
    
        portfolioSlider.addEventListener('mousemove', function(event) {
            if (mode === 'mouse') {
                const rect = portfolioSlider.getBoundingClientRect();
                const mouseX = event.clientX - rect.left;
                const sliderWidth = rect.width;
                const activeZone = sliderWidth * 0.3;
                
                if (mouseX < activeZone) {
                    portfolioSlider.style.cursor = 'url("./images/arrow-left.png") 16 16, auto';
                    startSliderAnimation(1);
                }
                else if (mouseX > sliderWidth - activeZone) {
                    portfolioSlider.style.cursor = 'url("./images/arrow-right.png") 16 16, auto';
                    startSliderAnimation(-1);
                } else {
                    portfolioSlider.style.cursor = 'auto';
                    stopSliderAnimation();
                }
            }
        });

        portfolioSlider.addEventListener('mouseleave', function() {
            stopSliderAnimation();
        });

    
        let startX = 0;
        let startY = 0;
        let isDragging = false;
        let startTranslateX = 0;
        let swipeDirection = null;
        
        portfolioSlider.addEventListener('touchstart', function(event) {
            startX = event.touches[0].clientX;
            startY = event.touches[0].clientY;
            startTranslateX = currentTranslateX;
            isDragging = true;
            swipeDirection = null;
            portfolioTrack.style.transition = 'none';
        }, { passive: false });
        
        portfolioSlider.addEventListener('touchmove', function(event) {
            if (mode === 'touch') {
                if (!isDragging) return;
            
                const currentX = event.touches[0].clientX;
                const currentY = event.touches[0].clientY;
                const offsetX = currentX - startX;
                const offsetY = currentY - startY;
                
                if (swipeDirection === null) {
                    if (Math.abs(offsetX) > 10 || Math.abs(offsetY) > 10) {
                        swipeDirection = Math.abs(offsetX) > Math.abs(offsetY) ? 'horizontal' : 'vertical';
                    }
                }
                
                if (swipeDirection === 'horizontal') {
                    if (event.cancelable) {
                        event.preventDefault();
                    }
                    
                    const bounds = getSliderBounds();
                    let newTranslateX = startTranslateX + offsetX;
                    
                    if (newTranslateX < bounds.minTranslate) {
                        newTranslateX = bounds.minTranslate;
                    }
                    if (newTranslateX > bounds.maxTranslate) {
                        newTranslateX = bounds.maxTranslate;
                    }
                    
                    currentTranslateX = newTranslateX;
                    portfolioTrack.style.transform = `translateX(calc(-50% + ${currentTranslateX}px))`;
                }
            }
        }, { passive: false });
        
        portfolioSlider.addEventListener('touchend', function() {
            isDragging = false;
            swipeDirection = null;
            portfolioTrack.style.transition = 'transform 0.3s ease';
        });
    
    if (portfolioTrack && portfolioSlider) {
        initSlider();
    } else {
        setTimeout(initSlider, 100);
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

    if (buttonScroll) {
        buttonScroll.addEventListener("click", () => {
            window.scrollTo({
                top: document.querySelector("#about").offsetTop,
                behavior: "smooth"
            })
        });
    }
    window.addEventListener("resize", () => {
        closeModal();
        mode = isTouchDevice() ? 'touch' : 'mouse';
        setTimeout(initSlider, 100);
        if (window.innerWidth > 768) {
            htmlElement.classList.remove("no-scroll");
            nav.classList.remove("nav__small_screens_active");
            burger.classList.remove('header__burger--active');
        }
    });
    function faqHandler(event) {
        const question = event.currentTarget;
        sessionStorage.setItem("faq-id", question.id);
        const answer = question.nextElementSibling;
        const parent = question.parentElement;

        const otherItems = parent.parentElement.querySelectorAll(".faq__item");
        otherItems.forEach(item => {
            item.classList.remove("faq__item--active");
            item.querySelector(".faq__content").classList.remove("faq__content--active");
        });
        parent.classList.add("faq__item--active");
        answer.classList.add("faq__content--active");
    }
    if (faqHeaders) {
        faqHeaders.forEach(header => {
            header.addEventListener("click", faqHandler);
        });
    }

}
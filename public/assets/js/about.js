// Fade-in animation when scrolling
const elements = document.querySelectorAll(".choose-card, .vm-card, .h-card");

const showOnScroll = () => {
    elements.forEach((el) => {
        let position = el.getBoundingClientRect().top;
        let windowHeight = window.innerHeight;

        if (position < windowHeight - 100) {
            el.style.opacity = "1";
            el.style.transform = "translateY(0)";
        }
    });
};

elements.forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(20px)";
    el.style.transition = "0.6s";
});

window.addEventListener("scroll", showOnScroll);
showOnScroll();


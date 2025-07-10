let lastScrollY = 0

function navbarScroll(navbar: HTMLElement) {
    if (!navbar) return

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY

        if (currentScrollY > lastScrollY && currentScrollY > 50) {
            navbar.style.transform = 'translateY(-100%)'
        }
        else {
            navbar.style.transform = 'translateY(0)'
        }
        lastScrollY = currentScrollY
    })
}
export { navbarScroll }
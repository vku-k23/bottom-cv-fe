let lastScrollY = 0

function navbarScroll(navbar: HTMLElement) {
    if (!navbar) return

    const mobileBreakpoint = 640

    function handleScroll() {
        const currentScrollY = window.scrollY
        if (window.innerWidth < mobileBreakpoint) {
            navbar.style.transform = 'translateY(0)'
            return;
        }
        if (currentScrollY > lastScrollY && currentScrollY > 50) {
            navbar.style.transform = 'translateY(-100%)'
        }
        else {
            navbar.style.transform = 'translateY(0)'
        }
        lastScrollY = currentScrollY
    }   
    window.addEventListener('scroll', handleScroll)
    window.addEventListener('resize', handleScroll)

    return () => {
    window.removeEventListener('scroll', handleScroll)
    window.removeEventListener('resize', handleScroll)
    };
}
function SetUpScroll(navbar: HTMLElement) {
    if (!navbar) return
    return navbarScroll(navbar)
}
export { navbarScroll, SetUpScroll }
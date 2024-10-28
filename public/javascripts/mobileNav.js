 //not yet checks for small screen
const windowWidth = window.innerWidth
// if(windowWidth < 741){
    const mobileNav = document.createElement('nav')
    const mobileBtn = document.createElement('button')
    const header = document.querySelector('header')
    const icon = document.createElement('i')
    icon.classList.add('lnr','lnr-menu')
    mobileBtn.classList.add('mobile-dropdown-toggle')
    mobileNav.classList.add('mobile-nav')
    mobileBtn.appendChild(icon)
    const body = document.querySelector('body')
    body.appendChild(mobileNav)
    header.prepend(mobileBtn)
    document.onclick = function(event){
        let target = event.target
        if (target.tagName != 'BUTTON') return
        mobileBtn.classList.toggle('menu-active')
        icon.classList.toggle('lnr-menu')
        icon.classList.toggle('lnr-cross')
    }
// }
//not yet checks for small screen
// const windowWidth = window.innerWidth
// if(windowWidth < 741){
(function(){
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

    const ul = document.createElement('ul')
    ul.setAttribute('id','ul-dropdown')
    ul.style.display = 'none'
    const findlinks = Array.from(document.querySelectorAll('ul.sidebar-nav > li'))
    findlinks.forEach(elem=>{
        const node = elem.cloneNode(true)
        node.classList='dropdown-li'
        ul.appendChild(node)
    })
    
    mobileNav.appendChild(ul)

    const pageNameArr = window.location.pathname.split('/')
    const pageName = pageNameArr[pageNameArr.length-1]
    const pages = Array.from(document.querySelectorAll('#ul-dropdown > li a'))
    
    pages.forEach(elem=>{
        const len = elem.href.split('/')
        
        if(len[len.length-1] == pageName){
            elem.classList = 'underline'
        }
    })    


    mobileBtn.addEventListener('click',(event)=>{
        event.preventDefault()
        if(ul.classList.contains('menu-active')){
            ul.setAttribute('class','menu-inactive')
            setTimeout(()=>{
                ul.style.display = 'none'
            },500)
        }else{
            ul.setAttribute('class','menu-active')
            ul.style.display = 'block'
        }

        icon.classList.toggle('lnr-menu')
        icon.classList.toggle('lnr-cross')
    })
    
    })()
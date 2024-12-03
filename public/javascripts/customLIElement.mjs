class customLI extends HTMLLIElement{
    
    constructor(){
        super()
        this.classList.add('animated')
        this.anchor = document.createElement('a')
        this.anchor.textContent = ''
        this.anchor.href = '#'
        this.appendChild(this.anchor)
        
    }
    
    get doHref(){
        return this.anchor.href
    }

    set textContent(value){
        this.anchor.textContent = value
    }

    set doHref(link){
        this.anchor.href = link != null ? link : ""
    }
}

customElements.define('custom-li',customLI, {extends: 'li'})

export default customLI
import './customLIElement.mjs'
(function(){
    fetch('/getuser')
    .then(res=>res.json())
    .then(jsrsp=>{
        function whichElem(){
            const my_profile = jsrsp.role > -1? customizeElem('/user','My profile') : null            

            const log_out = my_profile != null? customizeElem('/logout','Sign out'): null

            const sign_in = customizeElem('/login','Sign in')

            return my_profile == null? [sign_in] : [my_profile, log_out]
        }

        function customizeElem(href,text){
            const elem = document.createElement('li',{is: 'custom-li'})
            elem.doHref = href
            elem.textContent = text
            return elem
        }
        
        const sidebar = document.querySelector('ul.sidebar-nav')

        const elements = whichElem()

        Array.prototype.forEach.call(elements,(elem)=>{
            sidebar.appendChild(elem)
        })

        requestAnimationFrame(()=>{
            setTimeout(()=>{
                Array.prototype.forEach.call(sidebar.children,(li)=>{
                    li.classList.add( 'active')
                })    
            },10)
        })
        
    }).catch(err=>console.log(err))
}
)()
// userItems()
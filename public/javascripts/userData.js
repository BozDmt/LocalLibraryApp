import './customLIElement.mjs'
(function(){
    fetch('/getuser')
    .then(res=>res.json())
    .then(role=>{
        if(!role)
            return
        else{

            const templateItem = document.querySelector('ul.sidebar-nav li:first-child')
            const sidebar = document.querySelector('ul.sidebar-nav')
            
            const paths = ['/login','/logout','/user','http://www.ps3xploit.me']
            for(let i = 0; i < 4; i++){
                const newLI = document.createElement('li',{is:'custom-li'})
                newLI.doHref = paths[i]
                newLI.textContent = 'TESTING'
                if(i == 3) newLI.textContent = 'ps3 Exploit'
                sidebar.appendChild(newLI)
            }

            if(role == 1){
                // 'USER'
            }else if(role == 2){
                // 'ADMIN'    
            }
            
            Object.entries(role).forEach(entry=>{
                // console.log(entry[1]== 'false'?'no user found':'user found')
                if(entry[1] == 'false'){
                    console.log('no user found')
                    return
                }
            })
            
        }

    }).catch(err=>console.log(err))
}
)()
// userItems()
const doc = document.getElementsByClassName('Item')
const radios = document.getElementsByTagName('input')
const btn = document.getElementById('filterbtn')
const section = document.querySelector('section')
const bookContainer = document.querySelectorAll('.Container')

section.addEventListener('click', (event) => {
    if(event.target.tagName == 'INPUT'){
        let j = 0
        for(let i = 0; i < radios.length; i++){
            if(radios[i].checked === true){
                j++
            }
        }

        if(event.target.defaultChecked == true){
            event.target.defaultChecked = false
            event.target.checked = false    
            j--
        }else if(event.target.defaultChecked == false){
            event.target.defaultChecked = true
            event.target.checked = true
        }

        if(j == radios.length || j == 0){
            btn.disabled = true
        }else{
            btn.disabled = false
        }
    }
})

btn.addEventListener('click',()=>{
    for(let i = 0; i < doc.length; i++){
        for(const genre of doc[i].getAttribute('name').split('"')){
                switch(genre){
                    case '65f09fbb286d37f512aac98b':{
                        if(radios[0].checked){
                            doc[i].classList.add('visible')
                        }else{
                            doc[i].classList.remove('visible')
                        }
                        break
                    }
                    case '65f09fbb286d37f512aac98a':{
                        if(radios[2].checked){
                            doc[i].classList.add('visible')
                        }else{
                            doc[i].classList.remove('visible')
                        }
                        break
                    }
                    case '65f09fbb286d37f512aac98c':{
                        if(radios[1].checked){
                            doc[i].classList.add('visible')
                        }else{
                            doc[i].classList.remove('visible')
                        }
                        break
                    }
                    case '65f1f8e60592381652208db6':{
                        if(radios[3].checked){
                            doc[i].classList.add('visible')
                        }else{
                            doc[i].classList.remove('visible')
                        }
                        break
                    }
                    case '65facb41f7de2fa5a9f34728':{
                        if(radios[4].checked){
                            doc[i].classList.add('visible')
                        }else{
                            doc[i].classList.remove('visible')
                        }
                        break
                    }
                    default:{
                        // const a = 1
                    }
                }
            }    
        }
    })
    
function showItems(collection,opt){
    if(opt == 1)
        for(let i = 0; i < collection.length; i++){
            collection.classList.add('hide')
        }
    else{
        for(let i = 0; i < collection.length; i++){
            collection.classList.remove('hide')
        }
    }
}
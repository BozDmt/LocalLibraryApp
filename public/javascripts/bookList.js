(function(){
    const doc = document.getElementsByClassName('item')
    const radios = document.getElementsByTagName('input')
    const btn = document.getElementById('filterbtn')
    const section = document.querySelector('section')
    const bookContainer = document.querySelectorAll('.container')
    const pageUrl = window.location.toString().split('=')//.reduce()
    const book_details_card = document.querySelector('.book_details')

    fetch('/catalog/genres/ids')
    .then((result)=>{
        try{
            return result.json()
        }
        catch(e){
            console.error(`first catch block: ${e}`)
        }
    })
    .then((data)=>{    
        // console.log( `the data value is: ${data}` )
        if(!data) return
        const genre_ids = []

        data.forEach((key)=>{
            genre_ids.push(key._id)
        })

        section.addEventListener('click', (event) => {
            if(event.target.tagName == 'INPUT'){
                let j = 0
                Array.prototype.forEach.call(radios,(radio)=>{
                    if(radio.checked === true){
                        j++
                        // console.log('logic working')
                    }
                })
        
                if(event.target.defaultChecked == true){
                    event.target.defaultChecked = false
                    event.target.checked = false    
                    j--
                }else if(event.target.defaultChecked == false){
                    event.target.defaultChecked = true
                    event.target.checked = true
                }
        
                if(j === radios.length || j === 0){
                    btn.setAttribute('disabled','')
                }else{
                    if(btn.getAttribute('disabled') !== null)
                        btn.removeAttribute('disabled')
                }
            }
        })
        
        btn.addEventListener('click',()=>{
            for(let i = 0; i < doc.length; i++){
                for(const genre in genre_ids){
                        if(doc[i])
                        if(radios[0].checked){
                            doc[i].classList.add('visible')
                        }else{
                            doc[i].classList.remove('visible')
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
    })
    .catch((e)=>{console.error(`second catch block: ${e}`)})
    })()
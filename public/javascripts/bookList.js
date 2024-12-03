(function(){
    const doc = document.getElementsByClassName('item')
    const radios = document.getElementsByTagName('input')
    const btn = document.getElementById('filterbtn')
    const section = document.querySelector('section')
    const bookContainer = document.querySelectorAll('.container')
    const pageUrl = window.location.toString().split('=')//.reduce()

    Promise.all([fetch('/catalog/genres/ids'),fetch('catalog/books/')])
    .then((result)=>result.json())
    .then((data)=>{
        
        const genre_ids = []
        
        
        data[0].entries().forEach(([key,val]) => {
            genre_ids.push(val._id)
        })

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
    .catch((e)=>{console.error(e)})
    })()
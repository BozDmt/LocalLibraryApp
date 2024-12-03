(function(){
    const dialog = document.querySelectorAll('#myDialog')
    const details = document.querySelectorAll('#myDetails')
    const appearAnim = [
        {opacity: 0},
        {opacity: 1}
    ]
    document.addEventListener('click',(event)=>{
        if(event.target.tagName==='SUMMARY'){
            Array.prototype.forEach.call(dialog,(d)=>{
                d.open = !d.open
                d.animate(appearAnim,{duration: 250})    
            })
            Array.prototype.forEach.call(details,(dt)=>{
                dt.classList.toggle('details-overlay')
            })
            // dialog.open = !dialog.open
            // dialog.animate(appearAnim,{duration: 250})
            // details.classList.toggle('details-overlay')
        }
    })
})()
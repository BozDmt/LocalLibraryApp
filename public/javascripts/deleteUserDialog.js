(function(){
    const dialog = document.getElementById('myDialog')
    const details = document.getElementById('myDetails')
    const appearAnim = [
        {opacity: 0},
        {opacity: 1}
    ]
    document.addEventListener('click',(event)=>{
        if(event .target.tagName==='SUMMARY'){
            dialog.open = !dialog.open
            dialog.animate(appearAnim,{duration: 250})
            details.classList.toggle('details-overlay')
        }
    })
})()

(function(){
    const book_details_card = document.querySelector('.book_details')
    
    requestAnimationFrame(anim)
    let start1
    
    function anim(timestamp){
        if(start1 === undefined) start1 = document.timeline.currentTime
    
        const elapsed = timestamp - start1
        
        if(elapsed > 10){
            book_details_card.classList.add('grow')
            return
        }
        requestAnimationFrame(anim)
    }
})()
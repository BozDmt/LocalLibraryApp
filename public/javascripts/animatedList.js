
(function (){
    const lis = document.querySelectorAll('.styled-list li') 
    // == null ? 
    //     document.querySelectorAll('.styled-list li') : document.querySelectorAll('.styled-list-bookinstance li')
    
    const litems = Array.from(lis)

    litems.forEach(element => {
        element.classList.add('lianactive')
    })
})()
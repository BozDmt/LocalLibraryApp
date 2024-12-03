
// function animateNav(){
// const navbar = document.querySelectorAll('.sidebar-nav li')

// const navArray = Array.from(navbar)

// navArray.forEach(li =>{
//     li.classList.add('active')
// })
// }
// animateNav()

// if(!window.navbar){
//     const navbar = document.querySelectorAll('.sidebar-nav li')
//     window.navbar = navbar // storing variables in the window object
// }
// const navArray = Array.from(navbar)   

// navArray.forEach(li =>{
//     li.classList.add('active')
// })

(function(){
  const navbar = document.querySelectorAll('.sidebar-nav li')

  Array.prototype.forEach.call(navbar, li =>{
      li.classList.add('active')
  })  
})()//IIFE - immediately invoked FUNCTION EXPRESSION
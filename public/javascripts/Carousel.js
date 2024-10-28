import fs from 'fs'
import path from 'path'
const list = document.querySelector('.carousel')
fs.readdir('../authorPics',(err,files)=>{
    for(i in threeNums){
        const img = document.createElement('img')
        img.setAttribute('src',files[i])
        list.appendChild(img)
    }
})
function getUrls(){
    
    console.log(rand)
}

getUrls()

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}


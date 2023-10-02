var categari = document.querySelectorAll(".categari");

categari.forEach(function(val , index){
    val.addEventListener("click",function(){
        gsap.to(".circle",{
            rotate: index*90
        })
    })
})
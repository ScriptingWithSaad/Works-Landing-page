// gsap loading is enabled

function loading() {


    var tl = gsap.timeline()

    tl.to("#yellow-1", {
        y: "-100vh",
        delay: 0.3,
        duration: 0.7,
        ease: "expo.out",
    });

    tl.from("#yellow-2", {
        y: "100vh",
        delay: 0.5,
        duration: 0.7,
        ease: "expo.out",
    }, "text-color-change")

    tl.to(".loader h1", {
        delay: 0.6,
        duration: 0.7,
        color: "black"
    }, "text-color-change")

    tl.to(".loader", {
        opacity: 0
    })
    tl.to(".loader", {
        display: "none"
    })

}

loading()




// locomotive

const scroll = new LocomotiveScroll({
    el: document.querySelector('#main'),
    smooth: true
});



// page-1 to page-2

document.querySelector(".page-1-down-arrow").addEventListener("click", function () {
    scroll.scrollTo(560)
})



// page-2 to page-3

document.querySelector(".page-2-down-arrow").addEventListener("click", function () {
    scroll.scrollTo(1120)
})



// page-3 to TOP effect

document.querySelector(".footer-arrow").addEventListener("click", function () {
    scroll.scrollTo(0);
})




// page 2 hover effect

var page_2_elem = document.querySelectorAll(".page-2-elem")

var page_2 = document.querySelector(".page-2")
page_2_elem.forEach(function (elem) {
    // console.log(elem)
    elem.addEventListener("mouseenter", function () {
        // console.log("hello")
        var bg_img = elem.getAttribute("set-img")
        page_2.style.backgroundImage = `url(${bg_img})`
    })
})


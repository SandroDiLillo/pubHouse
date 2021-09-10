const backdrop = document.querySelector('.backdrop');
const sideDrawer = document.querySelector('.mobile-nav');
const menuToggle = document.querySelector('#side-menu-toggle');
const isTouchDevice = () => {
  return window.matchMedia("(pointer: coarse)").matches
}

function backdropClickHandler() {
  backdrop.style.display = 'none';
  sideDrawer.classList.remove('open');
}

function menuToggleClickHandler() {
  backdrop.style.display = 'block';
  sideDrawer.classList.add('open');
}

backdrop.addEventListener('click', backdropClickHandler);
menuToggle.addEventListener('click', menuToggleClickHandler);





// // console.log(cardAuthor)
// function deleteHref(){
//   cardAuthor.setAttribute('href', "#")
// }

//   cardAuthor.addEventListener("touch", deleteHref()) 
//   console.log('è uno smatphone')
// } else {
//   console.log('è un pc')

// }

const cardAuthors = document.querySelectorAll('.card__author');



function isInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)

    );
}



function startup() {
  
  if (isTouchDevice() === true) {
    // console.log(isTouchDevice())
    // console.log(cardAuthors)
    // console.log(cardOverlay)
    // console.log(cardHeader)
    document.addEventListener("scroll", hoverize)
  }
}
document.addEventListener("DOMContentLoaded", startup);
const hoverize = () => {
  cardAuthors.forEach(card => {
   
    let cardOverlay = card.parentNode.querySelector('.card__overlay')
    let cardHeader = card.parentNode.querySelector('.card__header')
    // console.log(cardHeader)
    if(isInViewport(card)) {
      cardHeader.style.transform = "translateY(0)" 
      cardOverlay.style.transform = "translateY(0)"
      
    }  else {
      cardHeader.style.transform = "translateY(-100%)" 
      cardOverlay.style.transform = "translateY(100%)"
    }
  
  })
   
 
}


// 





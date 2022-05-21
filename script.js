'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const section2 = document.querySelector('#section--2');
const section3 = document.querySelector('#section--3');
const nav = document.querySelector('.nav');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const buttonUp = document.querySelector('.up-button');

///////////////////////////////////////
// função para criar um observer
const createObserver = function(element, callbackFunc, options) {
  new IntersectionObserver(callbackFunc, options).observe(element);
}


///////////////////////////////////////
// Alerta ao sair da página de formulário

let modalOpen = false;

window.addEventListener('beforeunload', function(e) {
  const formularioPreenchido = Array.from(document.querySelectorAll('.modal__form input')).some(input => input.value);
  if(formularioPreenchido && modalOpen) {
    e.preventDefault();
    e.returnValue = "";
  }
})

///////////////////////////////////////
// Botão de subir
const hideButton = function(entries, observer) {
  const [entry] = entries;
  if(!entry.isIntersecting) return;
  buttonUp.style.transform = `translateX(${45}px)`;
  observer.unobserve(header)
  createObserver(section2, showButton);
}
const showButton = function(entries, observer) {

  const [entry] = entries;
  if(!entry.isIntersecting) return;
  buttonUp.style.transform = `translateX(${-65}px)`;
  
  observer.unobserve(section2)
  createObserver(header, hideButton);
}

buttonUp.addEventListener('click', function(e){
  header.scrollIntoView({ behavior: 'smooth'});
})


createObserver(section2, showButton);

///////////////////////////////////////
// Modal window

const openModal = function (e) {
  e.preventDefault();
  modal.style.transform = "translate(-50%, -50%)";
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
  modalOpen = true;
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
  modal.style.transform = "translate(-50%, -100%)";
  modalOpen = false;
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});


///////////////////////////////////////
// Button scrolling
btnScrollTo.addEventListener('click', function (e) {
  const s1coords = section1.getBoundingClientRect();
  console.log(s1coords);

  console.log(e.target.getBoundingClientRect());

  console.log('Current scroll (X/Y)', window.pageXOffset, window.pageYOffset);

  console.log(
    'height/width viewport',
    document.documentElement.clientHeight,
    document.documentElement.clientWidth
  );

  // Scrolling
  // window.scrollTo(
  //   s1coords.left + window.pageXOffset,
  //   s1coords.top + window.pageYOffset
  // );

  // window.scrollTo({
  //   left: s1coords.left + window.pageXOffset,
  //   top: s1coords.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });

  section1.scrollIntoView({ behavior: 'smooth' });
});

///////////////////////////////////////
// Page navigation

// document.querySelectorAll('.nav__link').forEach(function (el) {
//   el.addEventListener('click', function (e) {
//     e.preventDefault();
//     const id = this.getAttribute('href');
//     console.log(id);
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   });
// });

// 1. Add event listener to common parent element
// 2. Determine what element originated the event

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();

  // Matching strategy
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

///////////////////////////////////////
// Tabbed component
let currentTab = 0;
let tabInterval;

const changeTabInterval = function () {
   changeTab(tabs[currentTab])
   currentTab++; 
   if (currentTab === tabs.length) currentTab = 0; 
}


const changeTab = function(el) {
  // Remove active classes
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));
  
   // Activate tab
   el.classList.add('operations__tab--active');
   
   // Activate content area
   document.querySelector(`.operations__content--${el.dataset.tab}`).classList.add('operations__content--active');
}

tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');
  
  // Guard clause
  if (!clicked) return;
  clearInterval(tabInterval);
  changeTab(clicked);
});

const setIntervalTab = function(entries, observer) {

  const [entry] = entries;
  if (!entry.isIntersecting) return;
  tabInterval = setInterval(changeTabInterval, 2500);
  observer.unobserve(section2)
}


createObserver(section2, setIntervalTab, {root: null, threshold: 0.15});

///////////////////////////////////////
// Menu fade animation
const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

// Passing "argument" into handler
nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));


///////////////////////////////////////
// Sticky navigation: Intersection Observer API

const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;

const changeStyle = function(transSecond, height)
{
        nav.style.transform = `translateY(${height}px)`;
        nav.style.transition = `transform ${transSecond}s`;
        nav.style.marginTop = `-${height}px`;
}

const stickyNav = function (entries) {
  const [entry] = entries;
  if (!entry.isIntersecting)  {
    changeStyle(0.5, navHeight);
    nav.classList.add('sticky');
  }
  else{
    changeStyle(0, 0);
    nav.classList.remove('sticky');
  }
};


createObserver(header, stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
})


///////////////////////////////////////
// Reveal sections
const allSections = document.querySelectorAll('.section');

// const revealSection = function (entries, observer) {
//   const [entry] = entries)
//   if (!entry.isIntersecting) return;
//   entry.target.classList.remove('section--hidden');
//   observer.unobserve(entry.target);
// };

const revealSection = function (entries, observer) {
  const [entry] = entries;
  // console.log(entry, entry.target.getBoundingClientRect().y)
  if (entry.isIntersecting && entry.target.getBoundingClientRect().y > 0) entry.target.classList.remove('section--hidden');
  else if (!entry.isIntersecting && entry.target.getBoundingClientRect().y > 0) entry.target.classList.add('section--hidden');
};

allSections.forEach(function (section) {
  createObserver(section, revealSection, {
  root: null,
  threshold: 0.15,
  })
  //section.classList.add('section--hidden');
});


///////////////////////////////////////
// Lazy loading images
const imgTargets = document.querySelectorAll('img[data-src]');

const loadImg = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  // Replace src with data-src
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};


imgTargets.forEach(img => createObserver(img, loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '300px',
}));



///////////////////////////////////////
// Slider

let sliderInterval;

const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  let curSlide = 0;
  const maxSlide = slides.length;

  // Functions
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activateDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => {
        const porcentagemSlide = 100 * (i - slide);

        if(porcentagemSlide === 0) s.classList.remove('hidden')
        else s.classList.add('hidden')

        s.style.transform = `translateX(${porcentagemSlide}%)`;
      }
    );
  };


  //Next slide
  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }
    goToSlide(curSlide);
    activateDot(curSlide);
  };
  
  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const clearSlider = function(e) {
    if(e.target === btnRight || e.target === btnLeft || e.target.classList.contains('dots__dot')){
      clearInterval(sliderInterval);
      section3.removeEventListener('click', clearSlider);
    }
  }
  const setIntervalSlider = function(entries, observer) {
    const [entry] = entries;
    if (!entry.isIntersecting) return;
    //console.log(entry)
    sliderInterval = setInterval(nextSlide, 5000);
    observer.unobserve(section3)
  }


  const init = function () {
    goToSlide(0);
    createDots();
    activateDot(0);
  };
  init();


  //Event handlers
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);
  section3.addEventListener('click', clearSlider);

  createObserver(section3, setIntervalSlider, {root: null, threshold: 0.15})


  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') prevSlide();
    e.key === 'ArrowRight' && nextSlide();
  });

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      curSlide = Number(slide);
      goToSlide(slide);
      activateDot(slide);
    }
  });
};

slider();




document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    const cardsBlock = document.getElementById('cards'),
        filter = document.getElementById('filter-list'),
        filterShow = document.querySelector('.filter-show__block'),
        closeFilter = document.querySelector('.close-filter'),
        main = document.querySelector('.main'),
        body = document.querySelector('body'),
        testScreen = document.querySelector('.test-screen'),
        blockImages = document.querySelector('.force-overflow');

    const preload = document.createElement('div');
    preload.classList.add('preloader');
    preload.innerHTML = '<div class="preloader__row">' +
        '<div class="preloader__item"></div>' +
        '<div class="preloader__item"></div>' +
        '</div>';
    body.prepend(preload);

    let objData;
  
    const renderCards = (data) => {
        cardsBlock.textContent = '';

        const getValue = (value) => {
            if (value) {
                return value;
            } else {
                return '-';
            }
        };

        data.forEach((element, i) => {
        
            if (element.photo.slice(-1) === '/') {
                element.photo = element.photo.substring(0, element.photo.length-1);
            }
                   
            const block = document.createElement('div');
            const divText = document.createElement('div');
            divText.className = 'card-item__text';
            
            block.className = 'card-item';
            block.setAttribute('data-num' , ++i);
            block.innerHTML = `
                <div class="card-item__image">
                    <img src="${element.photo}" alt="">
                </div>`;
            divText.innerHTML = `
                
                    <p class = "name"><strong>${getValue(element.name)}</strong></p>
                    <p class = "real-name"><strong>real name</strong>: ${getValue(element.realName)}</p>
                    <p class = "real-name"><strong>status</strong>: ${getValue(element.status)}</p>
               `;
            block.append(divText);                   
           
            if (element.movies) {
                const divMoves = document.createElement('div');
                divMoves.className = 'card-movies';
                divMoves.innerHTML = `<strong>movies: </strong>`;
                element.movies.forEach((item) => {  
                    const span = document.createElement('span');
                    span.textContent = item;
                    divMoves.append(span);
                });
                divText.append(divMoves);
            }      

            cardsBlock.append(block);
        });

        const divNum = document.querySelectorAll('.card-item');
        const cnt = 6; 
        const cntPage = Math.ceil(divNum.length / cnt); 
        const paginator = document.querySelector(".paginator");
        let page = '';
        for (let i = 0; i < cntPage; i++) {
            page += "<span data-page=" + i * cnt + "  id=\"page" + (i + 1) + "\">" + (i + 1) + "</span>";
        }        
        paginator.innerHTML = `<p>Страницы:</p> ${page}`;
        const countBlock = paginator.querySelectorAll('span');        
        if (countBlock.length === 1) {
            paginator.style.display = 'none';
        } else {
            paginator.style.display = 'block'; 
        }
        for (let i = 0; i < divNum.length; i++) {
            if (i < cnt) {
                divNum[i].style.display = "block";
            }
        }
        
        let mainPage = document.getElementById("page1");        
        mainPage.classList.add("paginator_active");
        
        paginator.addEventListener('click', function(event) {
            const target = event.target;
            const id = target.id;

            if (target.tagName.toLowerCase() !== "span") {
                return;
            }
         
            const dataPage = +target.dataset.page;
            mainPage.classList.remove("paginator_active");
            mainPage = document.getElementById(id);
            mainPage.classList.add("paginator_active");
        
            let j = 0;
            for (let i = 0; i < divNum.length; i++) {
                const dataNum = divNum[i].dataset.num;
                if (dataNum <= dataPage || dataNum >= dataPage) {
                    divNum[i].style.display = "none";
                }            
            }
            for (let i = dataPage; i < divNum.length; i++) {
                if (j >= cnt) {
                    break;
                }
                divNum[i].style.display = "block";
                j++;
            }
        });
    };
    
    const renderFilter = (data) => {
        const obj = [];
        data.forEach((element) => {
            if (element.movies) {
                element.movies.forEach((item) => {
                    if(!obj.includes(item)) {
                        const li = document.createElement('li');
                        li.className = 'filter-item';
                        li.innerHTML = `<span>${item}</span>`;
                        filter.append(li);
                        obj.push(item);
                    }
                });
            }
        });
    };

    const filtered = (value, data) => {
        let filteredObj = [];
        data.forEach((element) => {
            if (element.movies) {
                element.movies.forEach((item) => {
                    if (value === item) {
                        filteredObj.push(element);
                    }                   
                });
            }            
        });
        renderCards(filteredObj);
    }; 

    const renderImages = (data) => {
        blockImages.textContent = '';
        data.forEach((element) => {
            if (element.photo.slice(-1) === '/') {
                element.photo = element.photo.substring(0, element.photo.length-1);
            }

            const block = document.createElement('div');
            block.className = 'block-image';
            block.innerHTML = `<img src="${element.photo}" alt="">`;
            blockImages.append(block);
        });
    };

    fetch('./dbHeroes.json')
        .then((response) => {
            if(response.status !== 200) {
                throw new Error('status network not 200');
            }
            preload.remove();
            return(response.text());                
        })
        .then((data) => {
            objData =JSON.parse(data); 
            renderCards(objData);  
            renderFilter(objData);  
            filter.addEventListener('click', (event) => {
                filter.classList.remove('show');
                filterShow.classList.remove('active');
                if (event.target.closest('.filter-item')) {
                    filterShow.innerHTML = `Sort by movies: <span>${event.target.textContent}</span> 
                    <div class="clear-filter">×</div>`;
                    filtered(event.target.textContent, objData);    
                }
            });            
            renderImages(objData);            
        })
        .catch((error) => console.error(error));    
    
    filterShow.addEventListener('click' , (event) => {
        event.preventDefault();
        filter.classList.add('show');
        event.target.classList.add('active');
    });

    closeFilter.addEventListener('click', (event) => {
        event.preventDefault();
        filter.classList.remove('show');
        filterShow.classList.remove('active');
    });

    main.addEventListener('click' , (event) => {
        if (event.target.closest('.clear-filter')) {
            filter.classList.remove('show');
            filterShow.innerHTML = 'Sort by movies'; 
            renderCards(objData); 
        }    
        if (event.target.closest('.testing')) {
            event.preventDefault();
            testScreen.classList.add('show');
            body.style.overflow = 'hidden';
            filter.classList.remove('show');
            filterShow.classList.remove('active');
        }        
    });

    const btnResutl = document.getElementById('btnResutl');
    const resultFild = document.getElementById('resultFild');
    const weakly = `Вы немного знаете о Marvel =(
        Но ведь это можно исправить! Начинайте смотреть фильмы и читать комиксы прямо сейчас=)`;
    const average = `Недурно!
        Вы много знаете о Marvel! Но можете узнать еще больше=)`;
    const strong = `Отлично! Вы знате о Marvel, пожалуй больше, чем самMarvel =)`;
       
    btnResutl.addEventListener('click', function(){
        let resultedInputs = document.querySelectorAll("input[type='radio']:checked");
        if (resultedInputs.length !== 7) { 
            resultFild.textContent = 'Сначала ответьте на все вопросы!';
            btnResutl.classList.add('blocked');
        }
        else {
            resultFild.textContent = '';
            btnResutl.classList.remove('blocked');
            let result = 0;
            Array.prototype.map.call(resultedInputs, (e)=>{
                result += parseInt(e.dataset.value);
            });

            const questionBlock = document.querySelector('.scroll-block');
            questionBlock.classList.add('hidden');
            const block = document.querySelector('.first-screen__text');
            if (result < 4) {
                resultFild.innerHTML = `<strong>Вы набрали ${result} баллов!
                ${weakly}</strong>`;
            } else if (result >= 4 || result < 7) {
                resultFild.innerHTML = `<strong>Вы набрали ${result} баллов!
                ${average}</strong>`; 
            } else if (result === 7){
                resultFild.innerHTML = `<strong>Вы набрали ${result} баллов!
                ${strong}</strong>`;
            }
            const resultatBlock = document.querySelector('.resultat-block ');
            resultatBlock.classList.add('active');
        }
    });

    testScreen.addEventListener('click', (event) => {
        if (event.target.closest('.close-test')) {
            testScreen.classList.remove('show');
            body.style.overflow = 'auto';
        }
    });

    const testing = () => {
        const modal = document.createElement('div');
        modal.classList.add('modal');
        modal.innerHTML = `
            <div class="modal-content">
                <span class="modal-close">×</span>
                <h2>Почему именно Marvel....</h2>
                <p>Думала я, выполняя это задание... Наверное, думала я, вы много знаете о нем.. а я нет.. </p>
                <p>А хотите проверить свои знания, пройдя небольшой тест? </p>
                <a href="#" class="btn testing">Пройти тест</a>
            </div>
        `;
        body.append(modal);
        modal.addEventListener('click', (event) => {
            if (event.target.closest('.modal-close')) {
                modal.classList.remove('modal');
                body.style.overflow = 'auto';
                modal.classList.add('modal-hidden');
            }
            if (event.target.closest('.testing')) {
                event.preventDefault();
                testScreen.classList.add('show');
                body.style.overflow = 'hidden';
                modal.classList.add('modal-hidden');
                filter.classList.remove('show');
            }
        });
    };      
    setTimeout(testing, 3000);
});
$(document).ready(function () {

  music = new Audio('sounds/music.mp3');

  let sounds = [1, 2, 3, 4, 5].map(i => new Audio(`sounds/clickSound${i}.mp3`));

  let point = 0;
  const tryAgainBtn = $('.try-again-button');
  const grid = $('#grid');
  const gridChild = $('#grid div');
  const clock = $('.clock');
  const score = $('.score');
  const scoreBlock = $('.score-block');
  const timeBlock = $('.time-block');
  const buttonStart = $('.start-button');
  const finishScore = $('.finish-score');

  let wrongNumber;

  //Запуск игры по нажатию на 'start'
  buttonStart.click(function () {
    grid.css({'display': 'grid'});
    let time = performance.now(); //Получаем начальное время
    buttonStart.fadeOut(150);
    setTimeout(function () {
      music.play();
      getCircle();
      scoreBlock.show();
      timeBlock.show();
      setInterval(getTime, 1000); //Обновление времени каждую секунду
    }, 150);

    function getCircle() {
      let amountOfCircle = getRandomNumber(3, 6, -1);
      let randomArray = getRandomArray(amountOfCircle, wrongNumber);
      console.log(randomArray);
      wrongNumber = randomArray[randomArray.length - 1];

      for (let i = 1; i <= amountOfCircle; i++) {
        gridChild.eq(randomArray[i - 1]).css({'visibility':'visible', 'opacity':'1', //Появление кружков
          'padding-top':'12px', 'background-color': `rgb( 
             ${getRandomNumber(0, 200)},
             ${getRandomNumber(0, 200)},
             ${getRandomNumber(0, 200)})`
          })
          .text(i)
          .attr('id', `circleNumber${i}`);

        if (i === amountOfCircle) {
          gridChild.eq(randomArray[i - 1]).addClass('circle lastCircle'); //Последний кружок из группы получает
        }                                                                 //класс lastCircle
        else {
          gridChild.eq(randomArray[i - 1]).addClass('circle');
        }
      }
      if ($('.lastCircle').hasClass('circle')) {
        clickCircle();
      }
    }

    function clickCircle() {
      let circle = $('.circle');
      circle.each(function () {
        let circleNumber;
        $(this).click(function () {
          let id = ($(this).attr('id'));       //Получаем номер из
          let number = id[id.length - 1];      // класса кружочка

          for (let i = 1; i <= number; i++) {      //Обрабатываем кружочек,
            circleNumber = $(`#circleNumber${i}`); //по которому нажали и все предшествующие

            if (i == number) {
              circleNumber.text('\u2713').css({'padding-top':'6px'});
            } else {
              circleNumber
                .text('\u274c')
                .css({'background-color': '#ff3333', 'padding-top':'6px'});
            }

            circleNumber.animate({'opacity': '0', 'visiblity': 'hidden'}, 300) //Скрываем кружочки
              .removeClass('circle')
              .removeAttr('id');

            if (!$('.lastCircle').hasClass('circle')) {   //Если последний кружочек уже был обработан
              $('.lastCircle').removeClass('lastCircle'); //то удаляем класс и генерируем новый набор кружков
              getCircle();
            }
          }
          point += 1;
          score.text(point);
          getSound();
        });
      })
    }

    function getRandomArray(amount, wrongNumber) {
      let arrayOfRandomUniqueNumber = [];
      let randomNumber;
      arrayOfRandomUniqueNumber[0] = getRandomNumber(0, 59, wrongNumber);
      for (let i = 1; i < amount;) {
        randomNumber = getRandomNumber(0, 59, wrongNumber);
        if (arrayOfRandomUniqueNumber.indexOf(randomNumber) !== -1) {
          continue;
        }
        arrayOfRandomUniqueNumber[i] = randomNumber;
        i++;
      }
      return arrayOfRandomUniqueNumber;
    }

    function getRandomNumber(min, max, wrongNumber) {
      let randomNumber = Math.round((Math.random() * (max - min) + min));
      while(randomNumber === wrongNumber) {
        randomNumber = Math.round((Math.random() * (max - min) + min));
      }
      return randomNumber;
    }

    function getSound() {
      sounds[getRandomNumber(0, 4)].play();
    }

    function getTime() {
        clock.text(Math.round((performance.now() - time) / 1000));
        if (parseInt(clock.text()) >= 30) {
          timeIsOver();
      }
    }
    
    function timeIsOver() {
      grid.fadeOut();
      timeBlock.fadeOut();
      scoreBlock.fadeOut();

      setTimeout(function() {
        finishScore.fadeIn().text(`Time is over!\nYour score: ${point}`);
      }, 1500);

      setTimeout(function() {
        tryAgainBtn.fadeIn();
      }, 4500);

      tryAgainBtn.click(function() {
        location.reload();
      });
    }
  });
});
// 'use strict';

var activeIndex = 0;
var limit = 0;
var disabled = false;
// var $stage = undefined;
// var $controls = undefined;
var canvas = false;

var SPIN_FORWARD_CLASS = 'js-spin-fwd';
var SPIN_BACKWARD_CLASS = 'js-spin-bwd';
var DISABLE_TRANSITIONS_CLASS = 'js-transitions-disabled';
var SPIN_DUR = 1000;

var appendControls = function appendControls() {
    for (var i = 0; i < limit; i++) {
        $('.carousel__control').append('<a href="#" data-index="' + i + '"></a>');
    }
    var height = $('.carousel__control').children().last().outerHeight();

    $('.carousel__control').css('height', 30 + limit * height);
    $controls = $('.carousel__control').children();
    $controls.eq(activeIndex).addClass('active');
};

var setIndexes = function setIndexes() {
    $('.spinner').children().each(function (i, el) {
        $(el).attr('data-index', i);
        limit++;
    });
};

var duplicateSpinner = function duplicateSpinner() {
    var $el = $('.spinner').parent();
    var html = $('.spinner').parent().html();
    $el.append(html);
    $('.spinner').last().addClass('spinner--right');
    $('.spinner--right').removeClass('spinner--left');
};

var paintFaces = function paintFaces() {
    $('.spinner__face').each(function (i, el) {
        var $el = $(el);
        var color = $(el).attr('data-bg');
        $el.children().css('backgroundImage', 'url(' + getBase64PixelByColor(color) + ')');
    });
};

var getBase64PixelByColor = function getBase64PixelByColor(hex) {
    if (!canvas) {
        canvas = document.createElement('canvas');
        canvas.height = 1;
        canvas.width = 1;
    }
    if (canvas.getContext) {
        var ctx = canvas.getContext('2d');
        ctx.fillStyle = hex;
        ctx.fillRect(0, 0, 1, 1);
        return canvas.toDataURL();
    }
    return false;
};

var prepareDom = function prepareDom() {
    setIndexes();
    paintFaces();
    duplicateSpinner();
    appendControls();
};

var spin = function spin() {
    var inc = arguments.length <= 0 || arguments[0] === undefined ? 1 : arguments[0];

    if (disabled) return;
    if (!inc) return;
    activeIndex += inc;
    disabled = true;

    if (activeIndex >= limit) {
        activeIndex = 0;
    }

    if (activeIndex < 0) {
        activeIndex = limit - 1;
    }

    var $activeEls = $('.spinner__face.js-active');
    var $nextEls = $('.spinner__face[data-index=' + activeIndex + ']');
    $nextEls.addClass('js-next');

    if (inc > 0) {
        $stage.addClass(SPIN_FORWARD_CLASS);
    } else {
        $stage.addClass(SPIN_BACKWARD_CLASS);
    }

    $controls.removeClass('active');
    $controls.eq(activeIndex).addClass('active');

    setTimeout(function () {
        spinCallback(inc);
    }, SPIN_DUR, inc);
};

var spinCallback = function spinCallback(inc) {

    $('.js-active').removeClass('js-active');
    $('.js-next').removeClass('js-next').addClass('js-active');
    $stage.addClass(DISABLE_TRANSITIONS_CLASS).removeClass(SPIN_FORWARD_CLASS).removeClass(SPIN_BACKWARD_CLASS);

    $('.js-active').each(function (i, el) {
        var $el = $(el);
        $el.prependTo($el.parent());
    });
    setTimeout(function () {
        $stage.removeClass(DISABLE_TRANSITIONS_CLASS);
        disabled = false;
    }, 100);
};

var attachListeners = function attachListeners() {

    document.onkeyup = function (e) {
        switch (e.keyCode) {
            case 38:
                spin(-1);
                break;
            case 40:
                spin(1);
                break;
        }
    };

    $controls.on('click', function (e) {
        e.preventDefault();
        if (disabled) return;
        var $el = $(e.target);
        var toIndex = parseInt($el.attr('data-index'), 10);
        spin(toIndex - activeIndex);
    });
};

var assignEls = function assignEls() {
    $stage = $('.carousel__stage');
};

var init = function init() {
    assignEls();
    prepareDom();
    attachListeners();
};

$(function () {
    init();
});

$('.clickr').click(function(){
  $('#nav ul').slideToggle(300);
});

/* Demo purposes only */
$(".hover").mouseleave(
  function () {
    $(this).removeClass("hover");
  }
);

$(document).ready(function() {

	(function ($) {
		$('.tab ul.tabs').addClass('active').find('> li:eq(0)').addClass('current');

		$('.tab ul.tabs li a').click(function (g) {
			var tab = $(this).closest('.tab'),
				index = $(this).closest('li').index();

			tab.find('ul.tabs > li').removeClass('current');
			$(this).closest('li').addClass('current');

			tab.find('.tab_content').find('div.tabs_item').not('div.tabs_item:eq(' + index + ')').slideUp();
			tab.find('.tab_content').find('div.tabs_item:eq(' + index + ')').slideDown();

			g.preventDefault();
		} );
	})(jQuery);

});


window.onload = function () {

  var questionArea = document.getElementsByClassName('questions')[0],
      answerArea   = document.getElementsByClassName('answers')[0],
      checker      = document.getElementsByClassName('checker')[0],
      current      = 0,

     // An object that holds all the questions + possible answers.
     // In the array --> last digit gives the right answer position
      allQuestions = {
        '	You have a 10-page report due in a month. When do you start working on it?' : ['Several weeks before it is due.', 'The night before it is due.', 'I don\'t do it at all', 0],

        'How often do you find yourself doing homework while watching television?' : ['Most of time', 'Never' , 'Sometimes', 1],

        '	It is Wednesday and the deadline for a rather important assignment is Friday, but you\'re just not "in the zone". What do you do?' : ['I wait until I find myself in the mood.', 'I break it up into smaller steps and start working.', 'I figure that I\'m just not going to get in the groove, and try again tomorrow', 1]
      };

  function loadQuestion(curr) {
  // This function loads all the question into the questionArea
  // It grabs the current question based on the 'current'-variable

    var question = Object.keys(allQuestions)[curr];

    questionArea.innerHTML = '';
    questionArea.innerHTML = question;
  }

  function loadAnswers(curr) {
  // This function loads all the possible answers of the given question
  // It grabs the needed answer-array with the help of the current-variable
  // Every answer is added with an 'onclick'-function

    var answers = allQuestions[Object.keys(allQuestions)[curr]];

    answerArea.innerHTML = '';

    for (var i = 0; i < answers.length -1; i += 1) {
      var createDiv = document.createElement('div'),
          text = document.createTextNode(answers[i]);

      createDiv.appendChild(text);
      createDiv.addEventListener("click", checkAnswer(i, answers));


      answerArea.appendChild(createDiv);
    }
  }

  function checkAnswer(i, arr) {
    // This is the function that will run, when clicked on one of the answers
    // Check if givenAnswer is sams as the correct one
    // After this, check if it's the last question:
    // If it is: empty the answerArea and let them know it's done.

    return function () {
      var givenAnswer = i,
          correctAnswer = arr[arr.length-1];

      if (givenAnswer === correctAnswer) {
        addChecker(true);
      } else {
        addChecker(false);
      }

      if (current < Object.keys(allQuestions).length -1) {
        current += 1;

        loadQuestion(current);
        loadAnswers(current);
      } else {
        questionArea.innerHTML = 'Done';
        answerArea.innerHTML = '';
      }

    };
  }

  function addChecker(bool) {
  // This function adds a div element to the page
  // Used to see if it was correct or false

    var createDiv = document.createElement('div'),
        txt       = document.createTextNode(current + 1);

    createDiv.appendChild(txt);

    if (bool) {

      createDiv.className += 'correct';
      checker.appendChild(createDiv);
    } else {
      createDiv.className += 'false';
      checker.appendChild(createDiv);
    }
  }


  // Start the quiz right away
  loadQuestion(current);
  loadAnswers(current);

};

document.getElementById('button-blue').addEventListener('click',function(){alert(" Submitted! Thank you for your comment!");});

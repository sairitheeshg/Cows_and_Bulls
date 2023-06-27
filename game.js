let attempts = 10;
let attempt = 0;
let answer = "";
let digits = 0;
let num = 0;
let win = 0;

let success = $(".alert-success");
let failure = $(".alert-warning");
let prompt = $(".digits");
let myChoice = $("#validation-choice");
let myInput = $("#validationInput");
let progressBar = $(".life");
let validate = $(".validate-button");
let submit = $(".submit-button");


myChoice.on("change", function () {
    digits = Number(this.value);
    myChoice.slideUp("fast");
    $(".play").slideDown();
    progressBar.slideDown();
    updateProgressBar();
    prompt.text("Try to guess the " + digits + " digit number, you have " + attempts + " attempts");
    validate.slideDown();
    submit.slideDown();

    startGame(digits);
    $("#validation-choice option").prop("selected", function () {
        return this.defaultSelected;
    });
})

function startGame(n) {
    answer = "";
    while (answer.length < n) {
        let randomDigit = getRandomNumber();
        if (!answer.includes(randomDigit)) {
            answer += String(randomDigit);
        }
    }
    myInput.attr("placeholder", n + " digit number");
}

function getRandomNumber() {
    //from 1 to 9
    return String(1 + Math.floor(Math.random() * 9));
}

//Adding Event Listeners to buttons
//so buttons are validate,restart and i have to take the user input value

validate.click(function () {

    if (checkInput() == false) {
        bounce(myInput);
        prompt.text("Please enter valid input");
        myInput.addClass("is-invalid")
    } else {
        myInput.removeClass("is-invalid");
        myInput.addClass("is-valid");
        num = String(myInput.val());
        validate_input(num);
    }
});


submit.click(function () {
    restartGame();
});


function validate_input(num) {
    if (attempts === 0) failAnimation();
    if (num === answer) {
        won();
    }
    else {
        giveFeedback();
        updateProgressBar();
    }
};


function checkInput() {
    num = String(myInput.val());
    if ($.isNumeric(num) && num.length <= digits) return true;
    else return false;
}

function giveFeedback() {
    cows = getCows(num);
    bulls = getBulls(num);
    if (cows >= bulls) {
        cows = cows - bulls;
    }
    attempt++;
    attempts--;
    prompt.text(cows + " cows and " + bulls + " bulls");
    bounce(prompt);
}

function getCows(num) {
    cows = 0;
    num = String(num);
    ans = String(answer);
    // let numDigits = countDigits(num);
    let ansDigits = countDigits(ans)
    for (i = 0; i < num.length; i++) {
        let currDigit = Number(num[i]);
        if (ansDigits[currDigit] != 0) {
            cows++;
            ansDigits[currDigit]--;
        }
    }
    return cows;

}

function countDigits(num) {
    num = String(num)
    let arr = new Array(10).fill(0);

    for (i = 0; i < num.length; i++) {
        let currDigit = Number(num[i]);
        arr[currDigit]++;
    }
    return arr;
}

function getBulls(num) {
    bulls = 0;
    num = String(num);
    ans = String(answer);
    for (i = 0; i < num.length; i++) {
        if (num[i] == ans[i]) {
            bulls++;
        }
    }
    return bulls;
}

function updateProgressBar() {
    progressValue = attempts * 10;
    progressBar.css('width', progressValue + "%");
    progressBar.attr('aria-valuenow', progressValue);
    if (attempts <= 4)
        progressBar.addClass("bg-danger");
}

setInterval(function () {
    if (attempts <= 4)
        progressBar.fadeToggle(1000);
}, 1000);


function bounce(thing) {
    let interval = 100;
    let distance = 20;
    let damping = 0.8;
    let times = 6;

    for (i = 0; i < times + 1; i++) {
        //everytime the vertical distance magnitude should decrease and eventually near to zero
        let amt = Math.pow(-1, i) * distance / (i * damping);
        thing.animate({
            top: amt
        }, 100);
    }
    thing.animate({
        top: 0
    }, interval);
}

function failAnimation() {
    win = -1;
    bounce($(".progress"));
    $(".progress").fadeOut();
    prompt.slideUp();
    failure.slideDown();
    validate.slideUp();

    failure.text("You gave your best , " + answer + " was the answer");
}

function won() {
    win = 1;
    prompt.text("You are amazing !")
    success.slideDown();
    validate.slideUp();
    failure.slideUp();
}

function restartGame() {
    $(".progress").fadeIn();
    attempt = 0;
    attempts = 10;
    myChoice.slideDown("fast");
    myInput.slideUp();
    validate.slideUp();
    if (win === 1) {
        success.slideUp("fast");
        prompt.slideDown();
    }
    if (win === -1) {
        failure.slideUp("fast");
        prompt.slideDown();
    }
    win = 0;
    submit.slideUp();
    prompt.text("No. of Digits");
    progressBar.removeClass("bg-danger");
}
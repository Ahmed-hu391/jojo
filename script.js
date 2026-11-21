// =====================================
// إعدادات الموقع
// =====================================

// اكتبي رسالتك هنا بين العلامتين
const letterMessage = `
اكتبي رسالتك هنا يا أحمد...

كل سنة وإنتِ طيبة يا جني ❤️
`;

// ضعي رابط Spotify Embed الخاص بالأغنية هنا
const spotifyLink = "https://open.spotify.com/embed/track/PUT_YOUR_TRACK_ID_HERE";


// =====================================
// عناصر الموقع
// =====================================

const screens = {
    quiz: document.getElementById("quizScreen"),
    success: document.getElementById("successScreen"),
    envelope: document.getElementById("envelopeScreen"),
    message: document.getElementById("messageScreen"),
    ending: document.getElementById("endingScreen")
};

const questionCounter = document.getElementById("questionCounter");
const progressPercent = document.getElementById("progressPercent");
const progressFill = document.getElementById("progressFill");
const attemptsText = document.getElementById("attemptsText");

let attempts = {
    1: 0,
    2: 0,
    3: 0
};

let questionSolved = {
    1: false,
    2: false,
    3: false
};


// =====================================
// تغيير الشاشات
// =====================================

function showScreen(screenName) {
    Object.values(screens).forEach(screen => {
        screen.classList.remove("active");
    });

    const target = screens[screenName];

    // إعادة تشغيل الأنيميشن عند فتح الشاشة
    void target.offsetWidth;
    target.classList.add("active");
}


// =====================================
// تحديث شريط التقدم
// =====================================

function updateProgress(number) {
    const percentages = {
        1: 33.33,
        2: 66.66,
        3: 100
    };

    questionCounter.textContent = `السؤال ${number} من 3`;
    progressPercent.textContent = `${Math.round(percentages[number])}%`;
    progressFill.style.width = `${percentages[number]}%`;
}


// =====================================
// الانتقال بين الأسئلة
// =====================================

function showQuestion(number) {
    document.querySelectorAll(".question-step").forEach(step => {
        step.classList.remove("active");
    });

    const nextQuestion = document.getElementById(`question${number}`);
    void nextQuestion.offsetWidth;
    nextQuestion.classList.add("active");

    updateProgress(number);

    attemptsText.textContent = "قدامك محاولتين لكل سؤال";
}


// =====================================
// تنسيق الأرقام العربية والإنجليزية
// =====================================

function normalizeNumbers(value) {
    const arabicNumbers = "٠١٢٣٤٥٦٧٨٩";
    const persianNumbers = "۰۱۲۳۴۵۶۷۸۹";

    return value
        .replace(/[٠-٩]/g, digit => arabicNumbers.indexOf(digit))
        .replace(/[۰-۹]/g, digit => persianNumbers.indexOf(digit))
        .replace(/\s/g, "");
}


// =====================================
// السؤال الأول: اليوم والشهر
// =====================================

const birthDay = document.getElementById("birthDay");
const birthMonth = document.getElementById("birthMonth");
const dateFeedback = document.getElementById("dateFeedback");
const dateButton = document.getElementById("dateButton");

[birthDay, birthMonth].forEach(input => {
    input.addEventListener("input", () => {
        input.value = normalizeNumbers(input.value).replace(/\D/g, "").slice(0, 2);
    });
});

birthDay.addEventListener("input", () => {
    if (birthDay.value.length === 2) {
        birthMonth.focus();
    }
});

function checkDate() {
    const day = normalizeNumbers(birthDay.value).padStart(2, "0");
    const month = normalizeNumbers(birthMonth.value).padStart(2, "0");

    if (!day || !month) {
        dateFeedback.textContent = "اكتبي اليوم والشهر الأول ♡";
        dateFeedback.className = "feedback error";
        return;
    }

    attempts[1]++;

    if (day === "01" && month === "12") {
        questionSolved[1] = true;

        dateFeedback.textContent = "إجابة صحيحة! ✦";
        dateFeedback.className = "feedback success";

        dateButton.disabled = true;

        setTimeout(() => {
            showQuestion(2);
        }, 1100);

    } else {
        const remaining = 2 - attempts[1];

        if (remaining > 0) {
            dateFeedback.textContent = "مش دي الإجابة، جربي مرة كمان ♡";
            dateFeedback.className = "feedback error";
        } else {
            dateFeedback.textContent = "خلصت المحاولتين، مش هينفع نكمل كده!";
            dateFeedback.className = "feedback error";
            dateButton.disabled = true;
        }
    }
}

dateButton.addEventListener("click", checkDate);


// =====================================
// السؤال الثاني والثالث
// =====================================

function handleOptionClick(button) {
    const questionNumber = Number(button.dataset.question);
    const answer = button.dataset.answer;

    if (questionSolved[questionNumber]) return;
    if (attempts[questionNumber] >= 2) return;

    const questionElement = document.getElementById(`question${questionNumber}`);
    const options = questionElement.querySelectorAll(".option");
    const feedback = document.getElementById(`feedback${questionNumber}`);
    const nextButton = document.getElementById(`next${questionNumber}`);

    attempts[questionNumber]++;

    // إظهار علامة الصح بجانب الإجابة الصحيحة
    options.forEach(option => {
        if (option.dataset.answer === "correct") {
            option.classList.add("correct");
            option.querySelector(".option-mark").textContent = "✓";
        }
    });

    if (answer === "correct") {
        questionSolved[questionNumber] = true;

        button.classList.add("correct");
        button.querySelector(".option-mark").textContent = "✓";

        feedback.textContent = "برافو! إجابة صحيحة ♡";
        feedback.className = "feedback success";

        options.forEach(option => {
            option.disabled = true;
        });

        nextButton.disabled = false;

    } else {
        button.classList.add("wrong");
        button.querySelector(".option-mark").textContent = "✕";

        const remaining = 2 - attempts[questionNumber];

        if (remaining > 0) {
            feedback.textContent = "مش دي الإجابة، جربي تاني ♡";
            feedback.className = "feedback error";

            // بعد لحظة نرجع الاختيارات للمحاولة الثانية
            setTimeout(() => {
                options.forEach(option => {
                    if (option.dataset.answer === "wrong") {
                        option.classList.remove("wrong");
                        option.querySelector(".option-mark").textContent = "";
                        option.disabled = false;
                    }
                });

                // تظل علامة الصح ظاهرة بجانب الإجابة الصحيحة
                options.forEach(option => {
                    if (option.dataset.answer === "correct") {
                        option.classList.remove("correct");
                        option.querySelector(".option-mark").textContent = "";
                    }
                });
            }, 1100);

        } else {
            feedback.textContent = "خلصت المحاولتين، للأسف مش هنقدر نكمل.";
            feedback.className = "feedback error";

            options.forEach(option => {
                option.disabled = true;
            });
        }
    }
}

document.querySelectorAll(".option").forEach(button => {
    button.addEventListener("click", () => {
        handleOptionClick(button);
    });
});


// =====================================
// الانتقال بعد الإجابة الصحيحة
// =====================================

document.getElementById("next2").addEventListener("click", () => {
    if (!questionSolved[2]) return;
    showQuestion(3);
});

document.getElementById("next3").addEventListener("click", () => {
    if (!questionSolved[3]) return;

    // ظهور شاشة YOU FOUND YOUR WAY
    showScreen("success");
});


// =====================================
// زر ابدئي
// =====================================

document.getElementById("startButton").addEventListener("click", () => {
    showScreen("envelope");
});


// =====================================
// فتح الظرف
// =====================================

const envelopeButton = document.getElementById("envelopeButton");
const envelope = document.querySelector(".envelope");
const tapHint = document.getElementById("tapHint");

let envelopeOpened = false;

envelopeButton.addEventListener("click", () => {
    if (envelopeOpened) return;

    envelopeOpened = true;
    envelope.classList.add("open");
    tapHint.textContent = "الرسالة ليكي وحدك ♡";

    setTimeout(() => {
        showScreen("message");
        startMessage();
    }, 1600);
});


// =====================================
// ظهور الرسالة
// =====================================

function startMessage() {
    const messageBody = document.getElementById("messageBody");

    messageBody.textContent = letterMessage.trim();

    const spotifyFrame = document.getElementById("spotifyFrame");

    if (spotifyLink && !spotifyLink.includes("PUT_YOUR_TRACK_ID_HERE")) {
        spotifyFrame.src = spotifyLink;
    }
}


// =====================================
// زر قرأت
// =====================================

document.getElementById("readButton").addEventListener("click", () => {
    showScreen("ending");
    createPetals(22);
});


// =====================================
// بتلات متحركة
// =====================================

function createPetals(count) {
    const petalsContainer = document.getElementById("petals");
    const symbols = ["✿", "❀", "♡", "✧"];

    for (let i = 0; i < count; i++) {
        const petal = document.createElement("span");

        petal.className = "petal";
        petal.textContent = symbols[Math.floor(Math.random() * symbols.length)];

        petal.style.left = `${Math.random() * 100}%`;
        petal.style.fontSize = `${12 + Math.random() * 14}px`;
        petal.style.animationDuration = `${6 + Math.random() * 8}s`;
        petal.style.animationDelay = `${Math.random() * 3}s`;

        petalsContainer.appendChild(petal);

        setTimeout(() => {
            petal.remove();
        }, 16000);
    }
}

// بتلات خفيفة في الخلفية
setInterval(() => {
    const petalsContainer = document.getElementById("petals");
    const petal = document.createElement("span");
    const symbols = ["✿", "❀"];

    petal.className = "petal";
    petal.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    petal.style.left = `${Math.random() * 100}%`;
    petal.style.fontSize = `${10 + Math.random() * 9}px`;
    petal.style.animationDuration = `${9 + Math.random() * 6}s`;

    petalsContainer.appendChild(petal);

    setTimeout(() => petal.remove(), 16000);
}, 1700);
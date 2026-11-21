// ======================================
// 1. إعدادات الموقع
// ======================================

// اكتبي رسالتك هنا
const letterMessage = `
اكتبي رسالتك هنا يا أحمد...

كل سنة وإنتِ طيبة يا جني ❤️

أتمنى تكون سنتك الجديدة مليانة فرحة ونجاح وأيام حلوة.
`;

// رابط أغنية Spotify Embed
const spotifyLink =
  "https://open.spotify.com/embed/track/PUT_YOUR_TRACK_ID_HERE";


// ======================================
// 2. عناصر الصفحات
// ======================================

const screens = {
  quiz: document.getElementById("quizScreen"),
  success: document.getElementById("successScreen"),
  music: document.getElementById("musicScreen"),
  envelope: document.getElementById("envelopeScreen"),
  message: document.getElementById("messageScreen"),
  ending: document.getElementById("endingScreen")
};


// ======================================
// 3. إعداد توقيت ظهور الكلام
// ======================================

function prepareReveal(screen) {
  const elements = screen.querySelectorAll(".reveal-item");

  elements.forEach((element, index) => {
    const delay = Math.min(index * 0.13, 1.3);
    element.style.setProperty("--delay", `${delay}s`);
  });
}


// تجهيز الصفحة الأولى
prepareReveal(screens.quiz);


// ======================================
// 4. الانتقال بين الصفحات
// ======================================

function showScreen(name) {
  const currentScreen = document.querySelector(".screen.active");

  if (currentScreen) {
    currentScreen.classList.add("leaving");

    setTimeout(() => {
      currentScreen.classList.remove("active", "leaving");
    }, 420);
  }

  const nextScreen = screens[name];

  prepareReveal(nextScreen);

  // إعادة تشغيل الأنيميشن
  nextScreen.classList.remove("active");
  void nextScreen.offsetWidth;

  setTimeout(() => {
    nextScreen.classList.add("active");
  }, 180);

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}


// ======================================
// 5. بيانات الأسئلة
// ======================================

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

let lockedQuestions = {
  1: false,
  2: false,
  3: false
};


// ======================================
// 6. شريط التقدم
// ======================================

const questionCounter =
  document.getElementById("questionCounter");

const progressPercent =
  document.getElementById("progressPercent");

const progressFill =
  document.getElementById("progressFill");

function updateProgress(number) {
  const percentages = {
    1: 33.33,
    2: 66.66,
    3: 100
  };

  questionCounter.textContent = `السؤال ${number} من 3`;
  progressPercent.textContent =
    `${Math.round(percentages[number])}%`;

  progressFill.style.width = `${percentages[number]}%`;
}


// ======================================
// 7. عرض السؤال
// ======================================

function showQuestion(number) {
  document.querySelectorAll(".question-step").forEach(step => {
    step.classList.remove("active");
  });

  const question = document.getElementById(`question${number}`);

  void question.offsetWidth;
  question.classList.add("active");

  updateProgress(number);
}


// ======================================
// 8. تحويل الأرقام
// ======================================

function normalizeNumbers(value) {
  const arabicNumbers = "٠١٢٣٤٥٦٧٨٩";
  const persianNumbers = "۰۱۲۳۴۵۶۷۸۹";

  return value
    .replace(/[٠-٩]/g, digit => arabicNumbers.indexOf(digit))
    .replace(/[۰-۹]/g, digit => persianNumbers.indexOf(digit))
    .replace(/\s/g, "");
}


// ======================================
// 9. السؤال الأول: التاريخ
// ======================================

const birthDay = document.getElementById("birthDay");
const birthMonth = document.getElementById("birthMonth");
const dateFeedback = document.getElementById("dateFeedback");
const dateButton = document.getElementById("dateButton");

[birthDay, birthMonth].forEach(input => {
  input.addEventListener("input", () => {
    input.value = normalizeNumbers(input.value)
      .replace(/\D/g, "")
      .slice(0, 2);
  });
});

birthDay.addEventListener("input", () => {
  if (birthDay.value.length === 2) {
    birthMonth.focus();
  }
});

dateButton.addEventListener("click", () => {
  if (lockedQuestions[1]) return;

  const day = normalizeNumbers(birthDay.value).padStart(2, "0");
  const month = normalizeNumbers(birthMonth.value).padStart(2, "0");

  if (!birthDay.value || !birthMonth.value) {
    dateFeedback.textContent = "اكتبي اليوم والشهر الأول ♡";
    dateFeedback.className = "feedback error";
    return;
  }

  attempts[1]++;

  if (day === "01" && month === "12") {
    questionSolved[1] = true;
    lockedQuestions[1] = true;

    dateFeedback.textContent = "إجابة صحيحة! ✦";
    dateFeedback.className = "feedback success";

    dateButton.disabled = true;

    setTimeout(() => {
      showQuestion(2);
    }, 1000);

  } else {
    const remaining = 2 - attempts[1];

    if (remaining > 0) {
      dateFeedback.textContent = "مش دي الإجابة، جربي مرة كمان ♡";
      dateFeedback.className = "feedback error";
    } else {
      lockedQuestions[1] = true;

      dateFeedback.textContent = "خلصت المحاولتين!";
      dateFeedback.className = "feedback error";

      dateButton.disabled = true;
    }
  }
});


// ======================================
// 10. السؤال الثاني والثالث
// ======================================

function handleOptionClick(button) {
  const number = Number(button.dataset.question);
  const answer = button.dataset.answer;

  if (lockedQuestions[number]) return;

  const questionElement =
    document.getElementById(`question${number}`);

  const options =
    questionElement.querySelectorAll(".option");

  const feedback =
    document.getElementById(`feedback${number}`);

  const nextButton =
    document.getElementById(`next${number}`);

  attempts[number]++;

  if (answer === "correct") {
    questionSolved[number] = true;
    lockedQuestions[number] = true;

    options.forEach(option => {
      option.disabled = true;

      if (option.dataset.answer === "correct") {
        option.classList.add("correct");
        option.querySelector(".option-mark").textContent = "✓";
      }
    });

    feedback.textContent = "برافو! إجابة صحيحة ♡";
    feedback.className = "feedback success";

    nextButton.disabled = false;

  } else {
    button.classList.add("wrong");
    button.querySelector(".option-mark").textContent = "✕";

    const remaining = 2 - attempts[number];

    if (remaining > 0) {
      feedback.textContent = "مش دي الإجابة، جربي مرة كمان ♡";
      feedback.className = "feedback error";

      // نظهر علامة الإجابة الصحيحة مؤقتًا
      options.forEach(option => {
        if (option.dataset.answer === "correct") {
          option.classList.add("correct");
          option.querySelector(".option-mark").textContent = "✓";
        }
      });

      setTimeout(() => {
        if (lockedQuestions[number]) return;

        // إعادة الاختيارات للمحاولة الثانية
        options.forEach(option => {
          option.classList.remove("wrong", "correct");
          option.querySelector(".option-mark").textContent = "";
          option.disabled = false;
        });

        button.disabled = false;

      }, 1000);

    } else {
      lockedQuestions[number] = true;

      feedback.textContent = "خلصت المحاولتين!";
      feedback.className = "feedback error";

      options.forEach(option => {
        option.disabled = true;

        if (option.dataset.answer === "correct") {
          option.classList.add("correct");
          option.querySelector(".option-mark").textContent = "✓";
        }
      });
    }
  }
}


document.querySelectorAll(".option").forEach(button => {
  button.addEventListener("click", () => {
    handleOptionClick(button);
  });
});


// ======================================
// 11. الانتقال بين الأسئلة
// ======================================

document.getElementById("next2").addEventListener("click", () => {
  if (!questionSolved[2]) return;

  showQuestion(3);
});

document.getElementById("next3").addEventListener("click", () => {
  if (!questionSolved[3]) return;

  showScreen("success");
});


// ======================================
// 12. صفحة الترحيب
// ======================================

document.getElementById("startButton").addEventListener("click", () => {
  showScreen("music");
});


// ======================================
// 13. إعداد مشغل Spotify
// ======================================

const musicPagePlayer =
  document.getElementById("musicPagePlayer");

const messagePlayerArea =
  document.getElementById("miniPlayerFrame");

if (
  spotifyLink &&
  !spotifyLink.includes("PUT_YOUR_TRACK_ID_HERE")
) {
  musicPagePlayer.src = spotifyLink;
}


// ======================================
// 14. الانتقال من الأغنية للرسالة
// ======================================

document.getElementById("musicContinue").addEventListener("click", () => {

  // ننقل نفس مشغل Spotify إلى الصفحة التالية
  // حتى لا نبدأ مشغلًا جديدًا من الصفر
  if (musicPagePlayer && messagePlayerArea) {
    messagePlayerArea.appendChild(musicPagePlayer);

    musicPagePlayer.style.width = "100%";
    musicPagePlayer.style.display = "block";
    musicPagePlayer.setAttribute("height", "80");
  }

  showScreen("envelope");
});


// ======================================
// 15. فتح الظرف
// ======================================

const envelopeButton =
  document.getElementById("envelopeButton");

const envelope =
  document.getElementById("envelope");

const tapHint =
  document.getElementById("tapHint");

let envelopeOpened = false;

envelopeButton.addEventListener("click", () => {
  if (envelopeOpened) return;

  envelopeOpened = true;

  envelope.classList.add("open");

  tapHint.textContent = "الرسالة ليكي وحدك ♡";

  setTimeout(() => {
    showScreen("message");
    startMessage();
  }, 1500);
});


// ======================================
// 16. كتابة الرسالة
// ======================================

function startMessage() {
  const messageBody =
    document.getElementById("messageBody");

  messageBody.textContent = letterMessage.trim();

  // إظهار مشغل الأغنية الصغير
  document.getElementById("miniMusic").classList.remove("hidden");
}


// ======================================
// 17. إخفاء وإظهار مشغل الأغنية
// ======================================

const miniMusic =
  document.getElementById("miniMusic");

const closeMiniMusic =
  document.getElementById("closeMiniMusic");

const showMiniMusic =
  document.getElementById("showMiniMusic");

closeMiniMusic.addEventListener("click", () => {
  miniMusic.classList.add("hidden");
  showMiniMusic.classList.add("visible");
});

showMiniMusic.addEventListener("click", () => {
  miniMusic.classList.remove("hidden");
  showMiniMusic.classList.remove("visible");
});


// ======================================
// 18. نهاية الرسالة
// ======================================

document.getElementById("readButton").addEventListener("click", () => {
  showScreen("ending");
  createPetals(24);
});


// ======================================
// 19. البتلات
// ======================================

function createPetals(count) {
  const container = document.getElementById("petals");
  const symbols = ["✿", "❀", "♡", "✧"];

  for (let i = 0; i < count; i++) {
    const petal = document.createElement("span");

    petal.className = "petal";
    petal.textContent =
      symbols[Math.floor(Math.random() * symbols.length)];

    petal.style.left = `${Math.random() * 100}%`;
    petal.style.fontSize = `${12 + Math.random() * 14}px`;
    petal.style.animationDuration = `${6 + Math.random() * 8}s`;
    petal.style.animationDelay = `${Math.random() * 3}s`;

    container.appendChild(petal);

    setTimeout(() => {
      petal.remove();
    }, 16000);
  }
}


// بتلات خفيفة في الخلفية
setInterval(() => {
  const container = document.getElementById("petals");
  const petal = document.createElement("span");

  const symbols = ["✿", "❀"];

  petal.className = "petal";
  petal.textContent =
    symbols[Math.floor(Math.random() * symbols.length)];

  petal.style.left = `${Math.random() * 100}%`;
  petal.style.fontSize = `${10 + Math.random() * 9}px`;
  petal.style.animationDuration = `${9 + Math.random() * 6}s`;

  container.appendChild(petal);

  setTimeout(() => {
    petal.remove();
  }, 16000);

}, 2200);

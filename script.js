
/* ======================================
   1. إعدادات الموقع
====================================== */

const letterMessage = `
كل سنة وإنتِ طيبة يا جني، ويا رب تكون سنة حلوة عليكي، مليانة فرحة وتحققي فيها كل حاجة نفسك فيها، وتفضلي دايمًا مبسوطة.

بصراحة أنا مش عارف أقول إيه، لأن فيه كلام كتير جوايا ونفسي أقولهولك، بس يمكن النهارده أحسن فرصة إني أعبّر عن جزء منه.

أنا بقالي 3 سنين بحبك، 3 سنين فيهم حاجات كتير اتغيرت، لكن إحساسي ناحيتك متغيرش بالعكس دا كان كل يوم حبي ليكي بيزيد ويمكن إنتِ متعرفيش قد إيه وجودك حتى من بعيد، فارق معايا، وقد إيه إنتِ ليكي مكانة خاصة عندي.

أنا مش عايز حبي ليكي يكون مجرد كلام، أنا نفسي في يوم أكون شخص ناجح وقادر يتحمل المسؤولية، وأجيلك من الباب وأطلبك بالحلال. دي أمنية بتمنى ربنا يحققها، وإنتِ واحدة من الأهداف اللي نفسي أوصلها، ولو فيها خير لينا ربنا يجمعنا على خير.

وعايزك تعرفي إن هفضل احبك حتي لو مفيش بينا تواصل، وهفضل أحبك من بعيد لحد لما اجي اخبط علي باب بيتك وحتى لو ربنا ما كتبش إنك تكوني من نصيبي هتفضلي إنسانة ليها مكانة خاصة عندي.

أنا مش مستني منك أي حاجة، ولا عايز منك أي حاجة دلوقتي أنا بس حبيت تكوني عارفة اللي جوايا.

يمكن مش عارف الأيام مخبية إيه ولا ربنا كاتب لنا إيه، بس اللي أعرفه إني بتمنالك كل الخير، وبدعيلك تكوني أسعد واحدة وتوصلي لكل أحلامك.

وفي يوم ميلادك، أتمنى من قلبي إن كل أيامك الجاية تكون أحلى، وإن الضحكة متفارقش وشك أبدًا.

وكل سنة وإنتِ طيبة يا جني أو ياجنجونتي.

وياريت متوريش الموقع دا لحد من صحابك.
`;

const spotifyLink =
  "https://open.spotify.com/embed/track/4CoY8ObNGh8Ses7kzGiTfm";

const SUPABASE_URL =
  "https://tyykouygbwwnqjeucwkz.supabase.co";

const SUPABASE_KEY =
  "sb_publishable_to7wgEX5xqoHhl1V-0Fq6Q__6761fNH";

let supabaseClient = null;

if (window.supabase) {
  supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
  );
}


/* ======================================
   2. عناصر الصفحات
====================================== */

const screens = {
  quiz: document.getElementById("quizScreen"),
  success: document.getElementById("successScreen"),
  music: document.getElementById("musicScreen"),
  envelope: document.getElementById("envelopeScreen"),
  message: document.getElementById("messageScreen"),
  ending: document.getElementById("endingScreen")
};


/* ======================================
   3. ظهور العناصر
====================================== */

function prepareReveal(screen) {
  if (!screen) return;

  const elements = screen.querySelectorAll(".reveal-item");

  elements.forEach((element, index) => {
    const delay = Math.min(index * 0.13, 1.3);
    element.style.setProperty("--delay", `${delay}s`);
  });
}

prepareReveal(screens.quiz);


/* ======================================
   4. الانتقال بين الصفحات
====================================== */

let changingScreen = false;

function showScreen(name) {
  if (changingScreen) return;

  const nextScreen = screens[name];

  if (!nextScreen) return;

  const currentScreen = document.querySelector(".screen.active");

  if (currentScreen === nextScreen) return;

  changingScreen = true;

  if (currentScreen) {
    currentScreen.classList.add("leaving");

    setTimeout(() => {
      currentScreen.classList.remove("active", "leaving");
    }, 420);
  }

  prepareReveal(nextScreen);

  nextScreen.classList.remove("active");
  void nextScreen.offsetWidth;

  setTimeout(() => {
    nextScreen.classList.add("active");
    changingScreen = false;
  }, currentScreen ? 180 : 0);

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}


/* ======================================
   5. بيانات الأسئلة
====================================== */

const attempts = {
  1: 0,
  2: 0,
  3: 0
};

const questionSolved = {
  1: false,
  2: false,
  3: false
};

const lockedQuestions = {
  1: false,
  2: false,
  3: false
};


/* ======================================
   6. شريط التقدم
====================================== */

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

  progressFill.style.width =
    `${percentages[number]}%`;
}


/* ======================================
   7. عرض السؤال
====================================== */

function showQuestion(number) {
  document.querySelectorAll(".question-step").forEach(step => {
    step.classList.remove("active");
  });

  const question =
    document.getElementById(`question${number}`);

  if (!question) return;

  void question.offsetWidth;

  question.classList.add("active");

  updateProgress(number);
}


/* ======================================
   8. تحويل الأرقام
====================================== */

function normalizeNumbers(value) {
  const arabicNumbers = "٠١٢٣٤٥٦٧٨٩";
  const persianNumbers = "۰۱۲۳۴۵۶۷۸۹";

  return value
    .replace(/[٠-٩]/g, digit => arabicNumbers.indexOf(digit))
    .replace(/[۰-۹]/g, digit => persianNumbers.indexOf(digit))
    .replace(/\s/g, "");
}


/* ======================================
   9. السؤال الأول: تاريخ الميلاد
====================================== */

const birthDay =
  document.getElementById("birthDay");

const birthMonth =
  document.getElementById("birthMonth");

const dateFeedback =
  document.getElementById("dateFeedback");

const dateButton =
  document.getElementById("dateButton");

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
    if (attempts[1] < 2) {
      dateFeedback.textContent =
        "مش دي الإجابة، جربي مرة كمان ♡";
    } else {
      lockedQuestions[1] = true;

      dateFeedback.textContent =
        "خلصت المحاولتين!";

      dateButton.disabled = true;
    }

    dateFeedback.className = "feedback error";
  }
});


/* ======================================
   10. السؤال الثاني والثالث
====================================== */

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
    button.disabled = true;

    const remaining = 2 - attempts[number];

    if (remaining > 0) {
      feedback.textContent =
        "مش دي الإجابة، جربي مرة كمان ♡";

      feedback.className = "feedback error";

      options.forEach(option => {
        if (option.dataset.answer === "correct") {
          option.classList.add("correct");
          option.querySelector(".option-mark").textContent = "✓";
        }
      });

      setTimeout(() => {
        if (lockedQuestions[number]) return;

        options.forEach(option => {
          option.classList.remove("wrong", "correct");
          option.querySelector(".option-mark").textContent = "";
          option.disabled = false;
        });

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


/* ======================================
   11. الانتقال بين الأسئلة
====================================== */

document.getElementById("next2").addEventListener("click", () => {
  if (questionSolved[2]) {
    showQuestion(3);
  }
});

document.getElementById("next3").addEventListener("click", () => {
  if (questionSolved[3]) {
    showScreen("success");
  }
});


/* ======================================
   12. صفحة الترحيب
====================================== */

document.getElementById("startButton").addEventListener("click", () => {
  showScreen("music");
});


/* ======================================
   13. إعداد Spotify
====================================== */

const musicPagePlayer =
  document.getElementById("musicPagePlayer");

const miniPlayerFrame =
  document.getElementById("miniPlayerFrame");

if (musicPagePlayer) {
  musicPagePlayer.src = spotifyLink;
}


/* ======================================
   14. نقل مشغل Spotify
====================================== */

document.getElementById("musicContinue").addEventListener("click", () => {
  if (musicPagePlayer && miniPlayerFrame) {
    miniPlayerFrame.appendChild(musicPagePlayer);

    musicPagePlayer.style.width = "100%";
    musicPagePlayer.style.display = "block";

    musicPagePlayer.setAttribute("height", "80");
  }

  showScreen("envelope");
});


/* ======================================
   15. فتح الظرف
====================================== */

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


/* ======================================
   16. عرض الرسالة
====================================== */

const miniMusic =
  document.getElementById("miniMusic");

function startMessage() {
  const messageBody =
    document.getElementById("messageBody");

  messageBody.textContent =
    letterMessage.trim();

  miniMusic.classList.remove("hidden");
}


/* ======================================
   17. إخفاء وإظهار المشغل
====================================== */

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


/* ======================================
   18. سحب المشغل بالماوس واللمس
====================================== */

(function makePlayerDraggable() {
  const player =
    document.getElementById("miniMusic");

  const header =
    player.querySelector(".mini-music-header");

  let dragging = false;

  let startX = 0;
  let startY = 0;

  let originalLeft = 0;
  let originalTop = 0;

  header.addEventListener("pointerdown", event => {
    if (event.target.closest("button")) return;

    dragging = true;

    const rect = player.getBoundingClientRect();

    startX = event.clientX;
    startY = event.clientY;

    originalLeft = rect.left;
    originalTop = rect.top;

    player.style.left = `${rect.left}px`;
    player.style.top = `${rect.top}px`;

    player.style.right = "auto";
    player.style.bottom = "auto";

    player.classList.add("dragging");

    header.setPointerCapture(event.pointerId);
  });

  header.addEventListener("pointermove", event => {
    if (!dragging) return;

    const dx = event.clientX - startX;
    const dy = event.clientY - startY;

    const maxLeft =
      window.innerWidth - player.offsetWidth;

    const maxTop =
      window.innerHeight - player.offsetHeight;

    const newLeft = Math.max(
      0,
      Math.min(maxLeft, originalLeft + dx)
    );

    const newTop = Math.max(
      0,
      Math.min(maxTop, originalTop + dy)
    );

    player.style.left = `${newLeft}px`;
    player.style.top = `${newTop}px`;
  });

  function stopDragging() {
    dragging = false;
    player.classList.remove("dragging");
  }

  header.addEventListener("pointerup", stopDragging);
  header.addEventListener("pointercancel", stopDragging);

  window.addEventListener("resize", () => {
    if (player.classList.contains("hidden")) return;

    const rect = player.getBoundingClientRect();

    const left = Math.max(
      0,
      Math.min(window.innerWidth - player.offsetWidth, rect.left)
    );

    const top = Math.max(
      0,
      Math.min(window.innerHeight - player.offsetHeight, rect.top)
    );

    player.style.left = `${left}px`;
    player.style.top = `${top}px`;
  });
})();


/* ======================================
   19. إرسال رد جني إلى Supabase
====================================== */

const jojoReply =
  document.getElementById("jojoReply");

const sendReply =
  document.getElementById("sendReply");

const replyFeedback =
  document.getElementById("replyFeedback");

sendReply.addEventListener("click", async () => {
  const reply = jojoReply.value.trim();

  if (!reply) {
    replyFeedback.textContent =
      "اكتبي ردك الأول ♡";

    replyFeedback.className =
      "reply-feedback error";

    return;
  }

  if (reply.length > 2000) {
    replyFeedback.textContent =
      "الرد طويل جدًا.";

    replyFeedback.className =
      "reply-feedback error";

    return;
  }

  if (!supabaseClient) {
    replyFeedback.textContent =
      "حصلت مشكلة في الاتصال، جربي تاني.";

    replyFeedback.className =
      "reply-feedback error";

    return;
  }

  sendReply.disabled = true;
  sendReply.textContent = "جاري إرسال ردك...";

  try {
    const { error } = await supabaseClient
      .from("jojo_replies")
      .insert({ reply });

    if (error) {
      throw error;
    }

    replyFeedback.textContent =
      "وصل ردك بنجاح، شكرًا ليكي ♡";

    replyFeedback.className =
      "reply-feedback success";

    jojoReply.value = "";
    jojoReply.disabled = true;

    sendReply.textContent = "تم إرسال الرد ♡";

  } catch (error) {
    console.error("Reply error:", error);

    replyFeedback.textContent =
      "مقدرتش أبعت الرد دلوقتي. حاولي مرة تانية.";

    replyFeedback.className =
      "reply-feedback error";

    sendReply.disabled = false;
    sendReply.textContent = "إرسال الرد ♡";
  }
});


/* ======================================
   20. نهاية الرسالة
====================================== */

document.getElementById("readButton").addEventListener("click", () => {
  showScreen("ending");
  createPetals(24);
});


/* ======================================
   21. البتلات
====================================== */

function createPetals(count) {
  const container =
    document.getElementById("petals");

  const symbols = ["✿", "❀", "♡", "✧"];

  for (let i = 0; i < count; i++) {
    const petal = document.createElement("span");

    petal.className = "petal";

    petal.textContent =
      symbols[Math.floor(Math.random() * symbols.length)];

    petal.style.left = `${Math.random() * 100}%`;

    petal.style.fontSize =
      `${12 + Math.random() * 14}px`;

    petal.style.animationDuration =
      `${6 + Math.random() * 8}s`;

    petal.style.animationDelay =
      `${Math.random() * 3}s`;

    container.appendChild(petal);

    setTimeout(() => {
      petal.remove();
    }, 16000);
  }
}


/* ======================================
   22. بتلات الخلفية
====================================== */

setInterval(() => {
  const container =
    document.getElementById("petals");

  const petal = document.createElement("span");

  const symbols = ["✿", "❀"];

  petal.className = "petal";

  petal.textContent =
    symbols[Math.floor(Math.random() * symbols.length)];

  petal.style.left = `${Math.random() * 100}%`;

  petal.style.fontSize =
    `${10 + Math.random() * 9}px`;

  petal.style.animationDuration =
    `${9 + Math.random() * 6}s`;

  container.appendChild(petal);

  setTimeout(() => {
    petal.remove();
  }, 16000);

}, 2200);


/* ======================================
   إعداد Supabase
====================================== */

const SUPABASE_URL =
  "https://tyykouygbwwnqjeucwkz.supabase.co";

const SUPABASE_KEY =
  "sb_publishable_to7wgEX5xqoHhl1V-0Fq6Q__6761fNH";

const db = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);


/* ======================================
   عناصر الصفحة
====================================== */

const loginCard =
  document.getElementById("loginCard");

const dashboard =
  document.getElementById("dashboard");

const loginForm =
  document.getElementById("loginForm");

const loginButton =
  document.getElementById("loginButton");

const loginMessage =
  document.getElementById("loginMessage");

const repliesMessage =
  document.getElementById("repliesMessage");

const repliesList =
  document.getElementById("repliesList");

const replyCount =
  document.getElementById("replyCount");


/* ======================================
   تسجيل الدخول
====================================== */

loginForm.addEventListener("submit", async event => {
  event.preventDefault();

  loginButton.disabled = true;
  loginButton.textContent = "جاري تسجيل الدخول...";

  loginMessage.textContent = "";

  const email =
    document.getElementById("email").value.trim();

  const password =
    document.getElementById("password").value;

  try {
    const { error } = await db.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      throw error;
    }

    await showDashboard();

  } catch (error) {
    console.error("Login error:", error);

    loginMessage.textContent =
      "بيانات الدخول غير صحيحة أو حصل خطأ في الاتصال.";

  } finally {
    loginButton.disabled = false;
    loginButton.textContent = "تسجيل الدخول";
  }
});


/* ======================================
   فتح لوحة الإدارة
====================================== */

async function showDashboard() {
  const { data, error } = await db.auth.getSession();

  if (error || !data.session) {
    loginCard.classList.remove("hidden");
    dashboard.classList.add("hidden");
    return;
  }

  loginCard.classList.add("hidden");
  dashboard.classList.remove("hidden");

  await loadReplies();
}


/* ======================================
   تحميل الردود
====================================== */

async function loadReplies() {
  repliesMessage.textContent = "جاري تحميل الردود...";
  repliesList.replaceChildren();

  replyCount.textContent = "";

  const { data, error } = await db
    .from("jojo_replies")
    .select("id, reply, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Replies error:", error);

    repliesMessage.textContent =
      "مش قادرين نحمل الردود. تأكد من صلاحيات قاعدة البيانات.";

    return;
  }

  if (!data || data.length === 0) {
    repliesMessage.textContent = "لسه مفيش ردود.";
    return;
  }

  repliesMessage.textContent = "";

  replyCount.textContent =
    `عدد الردود: ${data.length}`;

  data.forEach(item => {
    const card = document.createElement("article");

    card.className = "reply";

    const content = document.createElement("p");

    // استخدام textContent يمنع تفسير الرد كـ HTML
    content.textContent = item.reply;

    const date = document.createElement("time");

    date.textContent = new Date(
      item.created_at
    ).toLocaleString("ar-EG");

    card.appendChild(content);
    card.appendChild(date);

    repliesList.appendChild(card);
  });
}


/* ======================================
   تسجيل الخروج
====================================== */

document.getElementById("logoutButton").addEventListener("click", async () => {
  const { error } = await db.auth.signOut();

  if (error) {
    console.error("Logout error:", error);
  }

  dashboard.classList.add("hidden");
  loginCard.classList.remove("hidden");

  repliesList.replaceChildren();

  repliesMessage.textContent = "";
  replyCount.textContent = "";

  loginForm.reset();
});


/* ======================================
   التحقق من الجلسة عند فتح الصفحة
====================================== */

showDashboard();

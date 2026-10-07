/* =========================================================
   MUSTAFA DIGITAL ACADEMY
   72-DAY COMPUTER APPLICATIONS COURSE
   Dynamic JSON Course Engine
   ========================================================= */

"use strict";


/* =========================================================
   1. GLOBAL VARIABLES
   ========================================================= */

let courseData = null;

let days = [];

let completedDays = [];

let countdownInterval = null;

const STORAGE_KEY = "mustafa_digital_academy_progress";

const JSON_FILE = "pc.json";


/* =========================================================
   2. DOM ELEMENTS
   ========================================================= */

const loadingElement =
  document.getElementById("loading");

const errorElement =
  document.getElementById("errorMessage");

const errorTextElement =
  document.getElementById("errorText");

const daysContainer =
  document.getElementById("daysContainer");

const progressText =
  document.getElementById("progressText");

const progressFill =
  document.getElementById("progressFill");

const statusText =
  document.getElementById("statusText");

const totalDaysElement =
  document.getElementById("totalDays");

const courseTitleElement =
  document.getElementById("courseTitle");

const courseDescriptionElement =
  document.getElementById("courseDescription");

const academyNameElement =
  document.getElementById("academyName");

const currentYearElement =
  document.getElementById("currentYear");

const lessonModal =
  document.getElementById("lessonModal");

const lessonContent =
  document.getElementById("lessonContent");


/* =========================================================
   3. INITIALIZE WEBSITE
   ========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  initializeCourse
);


async function initializeCourse() {

  setCurrentYear();

  loadSavedProgress();

  try {

    await loadCourseData();

    prepareCourse();

    renderDays();

    updateProgress();

    startCountdown();

  } catch (error) {

    console.error(
      "Course initialization error:",
      error
    );

    showError(
      "Course data load nahi ho saka. " +
      "Please check karo ke pc.json same folder mein hai."
    );

  }

}


/* =========================================================
   4. CURRENT YEAR
   ========================================================= */

function setCurrentYear() {

  if (!currentYearElement) {
    return;
  }

  currentYearElement.textContent =
    new Date().getFullYear();

}


/* =========================================================
   5. LOAD JSON
   ========================================================= */

async function loadCourseData() {

  const response =
    await fetch(JSON_FILE, {
      cache: "no-cache"
    });

  if (!response.ok) {

    throw new Error(
      `HTTP Error: ${response.status}`
    );

  }

  courseData =
    await response.json();

}


/* =========================================================
   6. PREPARE COURSE
   ========================================================= */

function prepareCourse() {

  if (!courseData) {
    throw new Error("Course data missing.");
  }

  days =
    Array.isArray(courseData.days)
      ? courseData.days
      : [];

  /*
     Agar pc.json mein 72 Days nahi hain,
     system automatically 72 basic Days
     create karega.
  */

  if (days.length === 0) {

    days =
      createDefault72Days();

  }

  /*
     Agar kuch Days missing hon aur totalDays
     72 ho to remaining Days create kar do.
  */

  const requiredDays =
    courseData.course?.totalDays || 72;

  if (days.length < requiredDays) {

    const existingNumbers =
      new Set(
        days.map(day => Number(day.day))
      );

    for (
      let i = 1;
      i <= requiredDays;
      i++
    ) {

      if (!existingNumbers.has(i)) {

        days.push(
          createDefaultDay(i)
        );

      }

    }

  }

  /*
     Day number ke according sorting
  */

  days.sort(
    (a, b) =>
      Number(a.day) -
      Number(b.day)
  );

  /*
     Total days update
  */

  if (totalDaysElement) {

    totalDaysElement.textContent =
      requiredDays;

  }

  /*
     Course title
  */

  if (
    courseTitleElement &&
    courseData.course?.title
  ) {

    courseTitleElement.textContent =
      courseData.course.title;

  }

  /*
     Academy name
  */

  if (
    academyNameElement &&
    courseData.course?.academyName
  ) {

    academyNameElement.textContent =
      courseData.course.academyName;

  }

  /*
     Description
  */

  if (
    courseDescriptionElement &&
    courseData.course?.description
  ) {

    courseDescriptionElement.textContent =
      courseData.course.description;

  }

}


/* =========================================================
   7. DEFAULT 72 DAYS
   ========================================================= */

function createDefault72Days() {

  const defaultDays = [];

  for (
    let dayNumber = 1;
    dayNumber <= 72;
    dayNumber++
  ) {

    defaultDays.push(
      createDefaultDay(dayNumber)
    );

  }

  return defaultDays;

}


/* =========================================================
   8. DEFAULT DAY
   ========================================================= */

function createDefaultDay(dayNumber) {

  const week =
    Math.ceil(dayNumber / 6);

  return {

    day: dayNumber,

    title:
      `Computer Course - Day ${dayNumber}`,

    week: week,

    duration: 120,

    unlockAfterPrevious:
      dayNumber === 1
        ? 0
        : 1440,

    topics: [
      "Computer Practical Training",
      "Daily Lesson",
      "Practical Exercise"
    ],

    practical: [
      "Teacher demonstration",
      "Student practical practice",
      "Independent task"
    ],

    studentTask:
      `Complete the practical task for Day ${dayNumber}.`,

    learningOutcome:
      "Student ko practical computer skill develop karni hai.",

    teacherGuide: [
      "Lesson explain karo.",
      "Practical demonstrate karo.",
      "Student se practical karwao.",
      "Student ka work check karo."
    ],

    homework:
      "Aaj ke practical ko dobara practice karo.",

    assessment: {
      enabled: false,
      passingMarks: 60
    }

  };

}


/* =========================================================
   9. LOCAL STORAGE
   ========================================================= */

function loadSavedProgress() {

  try {

    const saved =
      localStorage.getItem(
        STORAGE_KEY
      );

    if (!saved) {

      completedDays = [];

      return;

    }

    const parsed =
      JSON.parse(saved);

    if (
      Array.isArray(parsed)
    ) {

      completedDays =
        parsed
          .map(Number)
          .filter(
            number =>
              Number.isInteger(number) &&
              number >= 1 &&
              number <= 72
          );

    }

  } catch (error) {

    console.error(
      "Progress load error:",
      error
    );

    completedDays = [];

  }

}


/* =========================================================
   10. SAVE PROGRESS
   ========================================================= */

function saveProgress() {

  try {

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(
        completedDays
      )
    );

  } catch (error) {

    console.error(
      "Progress save error:",
      error
    );

  }

}


/* =========================================================
   11. CHECK DAY COMPLETED
   ========================================================= */

function isDayCompleted(dayNumber) {

  return completedDays.includes(
    Number(dayNumber)
  );

}


/* =========================================================
   12. GET NEXT DAY
   ========================================================= */

function getNextDay() {

  for (
    let i = 1;
    i <= 72;
    i++
  ) {

    if (
      !isDayCompleted(i)
    ) {

      return i;

    }

  }

  return 72;

}


/* =========================================================
   13. DAY STATUS
   ========================================================= */

function getDayStatus(day) {

  const dayNumber =
    Number(day.day);

  /*
     Day already completed
  */

  if (
    isDayCompleted(dayNumber)
  ) {

    return {
      status: "completed",
      label: "✓ Completed"
    };

  }


  /*
     Day 1 automatically available
  */

  if (
    dayNumber === 1
  ) {

    return {
      status: "available",
      label: "▶ Available"
    };

  }


  /*
     Previous Day complete hona zaroori
  */

  if (
    !isDayCompleted(
      dayNumber - 1
    )
  ) {

    return {
      status: "locked",
      label: "🔒 Locked"
    };

  }


  /*
     Previous Day completion time
  */

  const completionTime =
    getCompletionTime(
      dayNumber - 1
    );

  /*
     Agar completion time available nahi
     to available kar do.
  */

  if (!completionTime) {

    return {
      status: "available",
      label: "▶ Available"
    };

  }


  /*
     JSON se delay
  */

  const delayMinutes =
    Number(
      day.unlockAfterPrevious
    ) || 1440;


  const unlockTime =
    completionTime +
    (
      delayMinutes *
      60 *
      1000
    );


  /*
     Unlock time aa gaya
  */

  if (
    Date.now() >= unlockTime
  ) {

    return {
      status: "available",
      label: "▶ Available"
    };

  }


  /*
     Still locked
  */

  return {
    status: "locked",
    label: "🔒 Locked",
    unlockTime:
      unlockTime
  };

}


/* =========================================================
   14. COMPLETION TIMES
   ========================================================= */

/*
   Important:

   Old simple progress array ko maintain karne ke liye
   completion timestamps separate localStorage mein
   save kiye ja rahe hain.
*/

const COMPLETION_KEY =
  "mustafa_course_completion_times";


function getCompletionTimes() {

  try {

    const data =
      localStorage.getItem(
        COMPLETION_KEY
      );

    if (!data) {
      return {};
    }

    return JSON.parse(data);

  } catch {

    return {};

  }

}


function saveCompletionTimes(data) {

  try {

    localStorage.setItem(
      COMPLETION_KEY,
      JSON.stringify(data)
    );

  } catch (error) {

    console.error(
      "Completion time save error:",
      error
    );

  }

}


function getCompletionTime(dayNumber) {

  const times =
    getCompletionTimes();

  return times[dayNumber]
    ? Number(times[dayNumber])
    : null;

}


/* =========================================================
   15. COMPLETE DAY
   ========================================================= */

function completeDay(dayNumber) {

  dayNumber =
    Number(dayNumber);


  /*
     Invalid Day
  */

  if (
    !Number.isInteger(dayNumber) ||
    dayNumber < 1 ||
    dayNumber > 72
  ) {

    return;

  }


  /*
     Day already completed
  */

  if (
    isDayCompleted(dayNumber)
  ) {

    return;

  }


  /*
     Check whether Day is actually available
  */

  const day =
    days.find(
      item =>
        Number(item.day) ===
        dayNumber
    );

  if (!day) {
    return;
  }


  const status =
    getDayStatus(day);


  if (
    status.status !== "available"
  ) {

    alert(
      "Ye Day abhi available nahi hai."
    );

    return;

  }


  /*
     Add completion
  */

  completedDays.push(
    dayNumber
  );

  completedDays =
    [...new Set(completedDays)]
      .sort(
        (a, b) => a - b
      );


  /*
     Save completion timestamp
  */

  const times =
    getCompletionTimes();

  times[dayNumber] =
    Date.now();

  saveCompletionTimes(times);

  saveProgress();


  /*
     Close lesson
  */

  closeLesson();


  /*
     Re-render
  */

  renderDays();

  updateProgress();

  startCountdown();


  /*
     Find next Day
  */

  const nextDay =
    dayNumber + 1;


  if (
    nextDay <= 72
  ) {

    setTimeout(
      () => {

        alert(
          `Day ${dayNumber} complete! ` +
          `Day ${nextDay} ka lesson required time ke baad unlock hoga.`
        );

      },
      150
    );

  } else {

    setTimeout(
      () => {

        alert(
          "🎉 Congratulations! " +
          "Aap ne 72 Days complete kar liye hain."
        );

      },
      150
    );

  }

}


/* =========================================================
   16. RENDER ALL DAYS
   ========================================================= */

function renderDays() {

  if (!daysContainer) {
    return;
  }

  daysContainer.innerHTML = "";

  /*
     Hide loading
  */

  if (loadingElement) {
    loadingElement.style.display = "none";
  }

  /*
     Hide error
  */

  if (errorElement) {
    errorElement.style.display = "none";
  }


  /*
     Generate every Day
  */

  days.forEach(
    day => {

      const card =
        createDayCard(day);

      daysContainer.appendChild(
        card
      );

    }
  );

}


/* =========================================================
   17. CREATE DAY CARD
   ========================================================= */

function createDayCard(day) {

  const dayNumber =
    Number(day.day);

  const status =
    getDayStatus(day);


  const card =
    document.createElement("article");

  card.className =
    `day-card ${status.status}`;


  /*
     Day Header
  */

  const header =
    document.createElement("div");

  header.className =
    "day-card-header";


  /*
     Number
  */

  const number =
    document.createElement("div");

  number.className =
    "day-number";

  number.textContent =
    dayNumber;


  /*
     Status
  */

  const badge =
    document.createElement("span");

  badge.className =
    `day-status status-${status.status}`;

  badge.textContent =
    status.label;


  header.appendChild(number);

  header.appendChild(badge);


  /*
     Week
  */

  const week =
    document.createElement("div");

  week.className =
    "week";

  week.textContent =
    `Week ${day.week || Math.ceil(dayNumber / 6)}`;


  /*
     Title
  */

  const title =
    document.createElement("h3");

  title.textContent =
    day.title ||
    `Day ${dayNumber}`;


  /*
     Description
  */

  const description =
    document.createElement("p");

  description.className =
    "day-card-description";

  description.textContent =
    day.learningOutcome ||
    "Practical computer lesson";


  /*
     Topics
  */

  const topics =
    document.createElement("ul");

  topics.className =
    "day-topics";


  const topicList =
    Array.isArray(day.topics)
      ? day.topics
      : [];


  topicList
    .slice(0, 4)
    .forEach(
      topic => {

        const li =
          document.createElement("li");

        li.textContent =
          topic;

        topics.appendChild(li);

      }
    );


  /*
     Button
  */

  const button =
    document.createElement("button");

  button.className =
    `day-button ${status.status}`;


  /*
     COMPLETED
  */

  if (
    status.status === "completed"
  ) {

    button.innerHTML =
      "✓ Review Lesson";

    button.onclick =
      () => openLesson(dayNumber);

  }


  /*
     AVAILABLE
  */

  else if (
    status.status === "available"
  ) {

    button.innerHTML =
      "▶ Start Lesson";

    button.onclick =
      () => openLesson(dayNumber);

  }


  /*
     LOCKED
  */

  else {

    button.innerHTML =
      "🔒 Locked";

    button.disabled =
      true;

  }


  /*
     Add elements
  */

  card.appendChild(header);

  card.appendChild(week);

  card.appendChild(title);

  card.appendChild(description);

  if (
    topicList.length > 0
  ) {

    card.appendChild(topics);

  }

  card.appendChild(button);


  /*
     Countdown
  */

  if (
    status.status === "locked" &&
    status.unlockTime
  ) {

    const countdown =
      document.createElement("div");

    countdown.className =
      "unlock-countdown";

    countdown.dataset.unlockTime =
      status.unlockTime;

    countdown.innerHTML =
      `⏳ Unlocking in <strong>calculating...</strong>`;

    card.appendChild(
      countdown
    );

  }


  return card;

}


/* =========================================================
   18. OPEN LESSON
   ========================================================= */

function openLesson(dayNumber) {

  const day =
    days.find(
      item =>
        Number(item.day) ===
        Number(dayNumber)
    );


  if (!day) {
    return;
  }


  const status =
    getDayStatus(day);


  /*
     Locked Day cannot open
  */

  if (
    status.status === "locked"
  ) {

    alert(
      "Ye lesson abhi locked hai."
    );

    return;

  }


  if (!lessonModal || !lessonContent) {
    return;
  }


  lessonContent.innerHTML =
    buildLessonHTML(day);


  lessonModal.classList.add(
    "active"
  );

  lessonModal.setAttribute(
    "aria-hidden",
    "false"
  );


  document.body.style.overflow =
    "hidden";

}


/* =========================================================
   19. BUILD LESSON HTML
   ========================================================= */

function buildLessonHTML(day) {

  const dayNumber =
    Number(day.day);


  const completed =
    isDayCompleted(dayNumber);


  const topics =
    Array.isArray(day.topics)
      ? day.topics
      : [];


  const practical =
    Array.isArray(day.practical)
      ? day.practical
      : [];


  const teacherGuide =
    Array.isArray(day.teacherGuide)
      ? day.teacherGuide
      : [];


  const topicsHTML =
    createListHTML(topics);


  const practicalHTML =
    createListHTML(practical);


  const teacherHTML =
    createListHTML(
      teacherGuide
    );


  const homeworkHTML =
    day.homework
      ? escapeHTML(day.homework)
      : "Aaj ke lesson ki practice dobara karo.";


  return `

    <div class="lesson-header">

      <span class="lesson-day">
        Day ${dayNumber}
      </span>

      <h2>
        ${escapeHTML(
          day.title ||
          `Day ${dayNumber}`
        )}
      </h2>

      <p>
        Week ${
          day.week ||
          Math.ceil(dayNumber / 6)
        }
        •
        ${
          day.duration ||
          120
        } Minutes
      </p>

    </div>


    <section class="lesson-section">

      <h3>
        🎯 Learning Objective
      </h3>

      <p>
        ${
          escapeHTML(
            day.learningOutcome ||
            "Is lesson ka practical skill complete karo."
          )
        }
      </p>

    </section>


    <section class="lesson-section">

      <h3>
        📚 What You Will Learn
      </h3>

      <ul>
        ${topicsHTML}
      </ul>

    </section>


    <section class="lesson-section practical-box">

      <h3>
        💻 Practical
      </h3>

      <ol>
        ${practicalHTML}
      </ol>

    </section>


    <section class="lesson-section teacher-guide">

      <h3>
        👨‍🏫 Teacher Guide
      </h3>

      <ol>
        ${teacherHTML}
      </ol>

    </section>


    <section class="lesson-section student-task">

      <h3>
        📝 Student Task
      </h3>

      <p>
        ${
          escapeHTML(
            day.studentTask ||
            "Aaj ka practical independently complete karo."
          )
        }
      </p>

    </section>


    <section class="lesson-section">

      <h3>
        🏠 Homework
      </h3>

      <p>
        ${homeworkHTML}
      </p>

    </section>


    ${
      completed

      ?

      `
      <div class="student-task">

        <h3>
          ✓ Day Completed
        </h3>

        <p>
          Ye Day successfully complete ho chuka hai.
        </p>

      </div>
      `

      :

      `
      <button
        class="complete-lesson"
        onclick="completeDay(${dayNumber})">

        ✓ Mark Day ${dayNumber} as Complete

      </button>
      `
    }

  `;

}


/* =========================================================
   20. CREATE LIST HTML
   ========================================================= */

function createListHTML(items) {

  if (
    !Array.isArray(items) ||
    items.length === 0
  ) {

    return `
      <li>
        Practical lesson available hai.
      </li>
    `;

  }


  return items
    .map(
      item =>
        `<li>${escapeHTML(item)}</li>`
    )
    .join("");

}


/* =========================================================
   21. ESCAPE HTML
   ========================================================= */

function escapeHTML(value) {

  if (
    value === null ||
    value === undefined
  ) {

    return "";

  }


  return String(value)
    .replace(
      /&/g,
      "&amp;"
    )
    .replace(
      /</g,
      "&lt;"
    )
    .replace(
      />/g,
      "&gt;"
    )
    .replace(
      /"/g,
      "&quot;"
    )
    .replace(
      /'/g,
      "&#039;"
    );

}


/* =========================================================
   22. CLOSE LESSON
   ========================================================= */

function closeLesson() {

  if (!lessonModal) {
    return;
  }

  lessonModal.classList.remove(
    "active"
  );

  lessonModal.setAttribute(
    "aria-hidden",
    "true"
  );

  document.body.style.overflow =
    "";

}


/* =========================================================
   23. ESC KEY CLOSE MODAL
   ========================================================= */

document.addEventListener(
  "keydown",
  event => {

    if (
      event.key === "Escape"
    ) {

      closeLesson();

    }

  }
);


/* =========================================================
   24. UPDATE PROGRESS
   ========================================================= */

function updateProgress() {

  const total =
    courseData?.course?.totalDays ||
    72;

  const completed =
    completedDays.length;


  const percentage =
    total > 0
      ? Math.round(
          (completed / total) *
          100
        )
      : 0;


  if (progressText) {

    progressText.textContent =
      `${completed} / ${total} Days Completed`;

  }


  if (progressFill) {

    progressFill.style.width =
      `${percentage}%`;

  }


  if (statusText) {

    if (
      completed >= total
    ) {

      statusText.textContent =
        "🎉 Course Completed";

    } else {

      const nextDay =
        getNextDay();

      statusText.textContent =
        `Day ${nextDay}`;

    }

  }

}


/* =========================================================
   25. COUNTDOWN SYSTEM
   ========================================================= */

function startCountdown() {

  if (countdownInterval) {

    clearInterval(
      countdownInterval
    );

  }


  updateCountdowns();


  countdownInterval =
    setInterval(
      () => {

        updateCountdowns();

      },
      1000
    );

}


/* =========================================================
   26. UPDATE COUNTDOWNS
   ========================================================= */

function updateCountdowns() {

  const countdownElements =
    document.querySelectorAll(
      ".unlock-countdown"
    );


  let shouldRender =
    false;


  countdownElements.forEach(
    element => {

      const unlockTime =
        Number(
          element.dataset.unlockTime
        );


      if (
        !unlockTime
      ) {
        return;
      }


      const remaining =
        unlockTime -
        Date.now();


      /*
         Unlock ho gaya
      */

      if (
        remaining <= 0
      ) {

        shouldRender =
          true;

        return;

      }


      element.innerHTML =
        `⏳ Unlocking in <strong>${formatTime(
          remaining
        )}</strong>`;

    }
  );


  /*
     Agar koi Day unlock hua,
     cards re-render karo.
  */

  if (shouldRender) {

    renderDays();

    updateProgress();

  }

}


/* =========================================================
   27. FORMAT COUNTDOWN
   ========================================================= */

function formatTime(milliseconds) {

  let totalSeconds =
    Math.floor(
      milliseconds / 1000
    );


  const days =
    Math.floor(
      totalSeconds /
      86400
    );

  totalSeconds %=
    86400;


  const hours =
    Math.floor(
      totalSeconds /
      3600
    );

  totalSeconds %=
    3600;


  const minutes =
    Math.floor(
      totalSeconds /
      60
    );

  const seconds =
    totalSeconds %
    60;


  const parts = [];


  if (days > 0) {

    parts.push(
      `${days}d`
    );

  }


  parts.push(
    `${String(hours).padStart(2, "0")}h`
  );


  parts.push(
    `${String(minutes).padStart(2, "0")}m`
  );


  parts.push(
    `${String(seconds).padStart(2, "0")}s`
  );


  return parts.join(" ");

}


/* =========================================================
   28. SHOW ERROR
   ========================================================= */

function showError(message) {

  if (loadingElement) {

    loadingElement.style.display =
      "none";

  }


  if (daysContainer) {

    daysContainer.innerHTML =
      "";

  }


  if (errorElement) {

    errorElement.style.display =
      "block";

  }


  if (errorTextElement) {

    errorTextElement.textContent =
      message;

  }

}


/* =========================================================
   29. PUBLIC FUNCTIONS
   ========================================================= */

/*
   HTML onclick attributes ke liye
   functions globally available rakhna.
*/

window.openLesson =
  openLesson;

window.closeLesson =
  closeLesson;

window.completeDay =
  completeDay;


/* =========================================================
   END
   ========================================================= */

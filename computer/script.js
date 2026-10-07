"use strict";

/*
=========================================================
MUSTAFA DIGITAL ACADEMY
72-DAY COMPUTER APPLICATIONS COURSE
GitHub Pages Safe Version
=========================================================
*/

const JSON_URL = new URL("./pc.json", document.baseURI).href;

const PROGRESS_KEY =
  "mustafa_digital_academy_progress";

const COMPLETION_KEY =
  "mustafa_course_completion_times";


let courseData = null;
let days = [];
let completedDays = [];
let countdownInterval = null;


/*
=========================================================
DOM
=========================================================
*/

const $ = (id) =>
  document.getElementById(id);

const loading =
  $("loading");

const errorBox =
  $("errorMessage");

const errorText =
  $("errorText");

const retryButton =
  $("retryButton");

const daysContainer =
  $("daysContainer");

const progressText =
  $("progressText");

const progressFill =
  $("progressFill");

const statusText =
  $("statusText");

const totalDaysElement =
  $("totalDays");

const courseTitle =
  $("courseTitle");

const courseDescription =
  $("courseDescription");

const academyName =
  $("academyName");

const currentYear =
  $("currentYear");

const lessonModal =
  $("lessonModal");

const lessonContent =
  $("lessonContent");

const modalClose =
  $("modalClose");

const modalOverlay =
  $("modalOverlay");


/*
=========================================================
INITIALIZE
=========================================================
*/

document.addEventListener(
  "DOMContentLoaded",
  initialize
);


async function initialize() {

  if (currentYear) {
    currentYear.textContent =
      new Date().getFullYear();
  }

  loadProgress();

  if (retryButton) {
    retryButton.addEventListener(
      "click",
      () => location.reload()
    );
  }

  if (modalClose) {
    modalClose.addEventListener(
      "click",
      closeLesson
    );
  }

  if (modalOverlay) {
    modalOverlay.addEventListener(
      "click",
      closeLesson
    );
  }

  document.addEventListener(
    "keydown",
    event => {

      if (event.key === "Escape") {
        closeLesson();
      }

    }
  );


  try {

    await loadCourse();

    prepareCourse();

    renderDays();

    updateProgress();

    startCountdown();

  } catch (error) {

    console.error(
      "COURSE ERROR:",
      error
    );

    showError(
      `Course data load nahi ho saka.

URL:
${JSON_URL}

Error:
${error.message}`
    );

  }

}


/*
=========================================================
LOAD JSON
=========================================================
*/

async function loadCourse() {

  /*
     IMPORTANT:
     new URL() ensures pc.json is loaded
     from the same /computer/ directory.
  */

  const response =
    await fetch(
      JSON_URL,
      {
        method: "GET",
        cache: "no-store"
      }
    );


  if (!response.ok) {

    throw new Error(
      `HTTP ${response.status}`
    );

  }


  const contentType =
    response.headers.get(
      "content-type"
    ) || "";


  const text =
    await response.text();


  if (!text.trim()) {

    throw new Error(
      "pc.json empty hai."
    );

  }


  try {

    courseData =
      JSON.parse(text);

  } catch (error) {

    console.error(
      "Invalid JSON:",
      text.substring(0, 300)
    );

    throw new Error(
      "pc.json valid JSON nahi hai."
    );

  }


  if (
    !courseData ||
    typeof courseData !== "object"
  ) {

    throw new Error(
      "pc.json ka structure invalid hai."
    );

  }

}


/*
=========================================================
PREPARE COURSE
=========================================================
*/

function prepareCourse() {

  const course =
    courseData.course || {};

  const requiredDays =
    Number(
      course.totalDays
    ) || 72;


  days =
    Array.isArray(
      courseData.days
    )
      ? courseData.days
      : [];


  /*
     Missing days automatically create
  */

  const existing =
    new Set(
      days.map(
        day => Number(day.day)
      )
    );


  for (
    let i = 1;
    i <= requiredDays;
    i++
  ) {

    if (!existing.has(i)) {

      days.push(
        createDefaultDay(i)
      );

    }

  }


  days =
    days
      .sort(
        (a, b) =>
          Number(a.day) -
          Number(b.day)
      )
      .slice(
        0,
        requiredDays
      );


  if (totalDaysElement) {
    totalDaysElement.textContent =
      requiredDays;
  }


  if (
    academyName &&
    course.academyName
  ) {

    academyName.textContent =
      course.academyName;

  }


  if (
    courseTitle &&
    course.title
  ) {

    courseTitle.textContent =
      course.title;

  }


  if (
    courseDescription &&
    course.description
  ) {

    courseDescription.textContent =
      course.description;

  }

}


/*
=========================================================
DEFAULT DAY
=========================================================
*/

function createDefaultDay(dayNumber) {

  return {

    day:
      dayNumber,

    title:
      `Computer Course - Day ${dayNumber}`,

    week:
      Math.ceil(
        dayNumber / 6
      ),

    duration:
      120,

    unlockAfterPrevious:
      dayNumber === 1
        ? 0
        : 1440,

    learningOutcome:
      "Practical computer skill develop karna.",

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

    teacherGuide: [
      "Lesson explain karein.",
      "Practical demonstrate karein.",
      "Student se practical karwayein.",
      "Student ka work check karein."
    ],

    studentTask:
      "Aaj ka practical complete karein.",

    homework:
      "Aaj ke practical ki practice karein."

  };

}


/*
=========================================================
PROGRESS
=========================================================
*/

function loadProgress() {

  try {

    const saved =
      localStorage.getItem(
        PROGRESS_KEY
      );


    completedDays =
      saved
        ? JSON.parse(saved)
        : [];


    if (
      !Array.isArray(
        completedDays
      )
    ) {

      completedDays = [];

    }


    completedDays =
      completedDays
        .map(Number)
        .filter(
          number =>
            Number.isInteger(number) &&
            number >= 1 &&
            number <= 72
        );


  } catch {

    completedDays = [];

  }

}


function saveProgress() {

  localStorage.setItem(
    PROGRESS_KEY,
    JSON.stringify(
      completedDays
    )
  );

}


function isCompleted(dayNumber) {

  return completedDays.includes(
    Number(dayNumber)
  );

}


/*
=========================================================
COMPLETION TIMES
=========================================================
*/

function getCompletionTimes() {

  try {

    return JSON.parse(
      localStorage.getItem(
        COMPLETION_KEY
      ) || "{}"
    );

  } catch {

    return {};

  }

}


function saveCompletionTimes(data) {

  localStorage.setItem(
    COMPLETION_KEY,
    JSON.stringify(data)
  );

}


function getCompletionTime(dayNumber) {

  const times =
    getCompletionTimes();

  return Number(
    times[dayNumber]
  ) || null;

}


/*
=========================================================
DAY STATUS
=========================================================
*/

function getDayStatus(day) {

  const number =
    Number(day.day);


  if (
    isCompleted(number)
  ) {

    return {
      status: "completed",
      label: "✓ Completed"
    };

  }


  if (number === 1) {

    return {
      status: "available",
      label: "▶ Available"
    };

  }


  if (
    !isCompleted(
      number - 1
    )
  ) {

    return {
      status: "locked",
      label: "🔒 Locked"
    };

  }


  const previousTime =
    getCompletionTime(
      number - 1
    );


  if (!previousTime) {

    return {
      status: "available",
      label: "▶ Available"
    };

  }


  const delay =
    Number(
      day.unlockAfterPrevious
    ) || 1440;


  const unlockTime =
    previousTime +
    delay * 60 * 1000;


  if (
    Date.now() >=
    unlockTime
  ) {

    return {
      status: "available",
      label: "▶ Available"
    };

  }


  return {
    status: "locked",
    label: "🔒 Locked",
    unlockTime
  };

}


/*
=========================================================
RENDER DAYS
=========================================================
*/

function renderDays() {

  if (!daysContainer) {
    return;
  }


  daysContainer.innerHTML = "";


  if (loading) {
    loading.style.display = "none";
  }

  if (errorBox) {
    errorBox.style.display = "none";
  }


  days.forEach(
    day => {

      daysContainer.appendChild(
        createDayCard(day)
      );

    }
  );

}


/*
=========================================================
DAY CARD
=========================================================
*/

function createDayCard(day) {

  const number =
    Number(day.day);

  const status =
    getDayStatus(day);


  const card =
    document.createElement(
      "article"
    );

  card.className =
    `day-card ${status.status}`;


  const header =
    document.createElement(
      "div"
    );

  header.className =
    "day-card-header";


  const numberElement =
    document.createElement(
      "div"
    );

  numberElement.className =
    "day-number";

  numberElement.textContent =
    number;


  const badge =
    document.createElement(
      "span"
    );

  badge.className =
    `day-status status-${status.status}`;

  badge.textContent =
    status.label;


  header.appendChild(
    numberElement
  );

  header.appendChild(
    badge
  );


  const week =
    document.createElement(
      "div"
    );

  week.className =
    "week";

  week.textContent =
    `Week ${
      day.week ||
      Math.ceil(number / 6)
    }`;


  const title =
    document.createElement(
      "h3"
    );

  title.textContent =
    day.title ||
    `Day ${number}`;


  const description =
    document.createElement(
      "p"
    );

  description.className =
    "day-card-description";

  description.textContent =
    day.learningOutcome ||
    "Practical computer lesson.";


  const topics =
    document.createElement(
      "ul"
    );

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
          document.createElement(
            "li"
          );

        li.textContent =
          topic;

        topics.appendChild(
          li
        );

      }
    );


  const button =
    document.createElement(
      "button"
    );

  button.className =
    `day-button ${status.status}`;


  if (
    status.status ===
    "locked"
  ) {

    button.textContent =
      "🔒 Locked";

    button.disabled =
      true;

  } else {

    button.textContent =
      status.status ===
      "completed"
        ? "✓ Review Lesson"
        : "▶ Start Lesson";

    button.addEventListener(
      "click",
      () => openLesson(number)
    );

  }


  card.appendChild(header);
  card.appendChild(week);
  card.appendChild(title);
  card.appendChild(description);


  if (
    topicList.length
  ) {

    card.appendChild(topics);

  }


  card.appendChild(button);


  if (
    status.status ===
    "locked" &&
    status.unlockTime
  ) {

    const countdown =
      document.createElement(
        "div"
      );

    countdown.className =
      "unlock-countdown";

    countdown.dataset.unlockTime =
      status.unlockTime;

    countdown.innerHTML =
      "⏳ Unlocking in " +
      "<strong>calculating...</strong>";

    card.appendChild(
      countdown
    );

  }


  return card;

}


/*
=========================================================
OPEN LESSON
=========================================================
*/

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


  if (
    status.status ===
    "locked"
  ) {

    alert(
      "Ye lesson abhi locked hai."
    );

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


/*
=========================================================
LESSON HTML
=========================================================
*/

function buildLessonHTML(day) {

  const number =
    Number(day.day);

  const completed =
    isCompleted(number);


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


  return `

    <div class="lesson-header">

      <span class="lesson-day">
        Day ${number}
      </span>

      <h2>
        ${escapeHTML(
          day.title ||
          `Day ${number}`
        )}
      </h2>

      <p>
        Week ${
          day.week ||
          Math.ceil(number / 6)
        }
        •
        ${day.duration || 120}
        Minutes
      </p>

    </div>


    <section class="lesson-section">

      <h3>
        🎯 Learning Objective
      </h3>

      <p>
        ${escapeHTML(
          day.learningOutcome ||
          "Is lesson ka practical skill complete karein."
        )}
      </p>

    </section>


    <section class="lesson-section">

      <h3>
        📚 What You Will Learn
      </h3>

      <ul>
        ${listHTML(topics)}
      </ul>

    </section>


    <section class="lesson-section practical-box">

      <h3>
        💻 Practical
      </h3>

      <ol>
        ${listHTML(practical)}
      </ol>

    </section>


    <section class="lesson-section teacher-guide">

      <h3>
        👨‍🏫 Teacher Guide
      </h3>

      <ol>
        ${listHTML(teacherGuide)}
      </ol>

    </section>


    <section class="lesson-section student-task">

      <h3>
        📝 Student Task
      </h3>

      <p>
        ${escapeHTML(
          day.studentTask ||
          "Aaj ka practical independently complete karein."
        )}
      </p>

    </section>


    <section class="lesson-section">

      <h3>
        🏠 Homework
      </h3>

      <p>
        ${escapeHTML(
          day.homework ||
          "Aaj ke practical ki practice karein."
        )}
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
          id="completeLessonButton">

          ✓ Mark Day ${number} as Complete

        </button>
      `
    }

  `;

}


/*
=========================================================
LIST HTML
=========================================================
*/

function listHTML(items) {

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


/*
=========================================================
ESCAPE HTML
=========================================================
*/

function escapeHTML(value) {

  return String(
    value ?? ""
  )

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


/*
=========================================================
COMPLETE DAY
=========================================================
*/

document.addEventListener(
  "click",
  event => {

    if (
      event.target &&
      event.target.id ===
      "completeLessonButton"
    ) {

      const text =
        event.target.textContent;

      const match =
        text.match(
          /Day\s+(\d+)/
        );

      if (match) {

        completeDay(
          Number(match[1])
        );

      }

    }

  }
);


function completeDay(dayNumber) {

  dayNumber =
    Number(dayNumber);


  if (
    !Number.isInteger(dayNumber) ||
    dayNumber < 1 ||
    dayNumber > 72
  ) {

    return;

  }


  if (
    isCompleted(dayNumber)
  ) {

    return;

  }


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
    status.status !==
    "available"
  ) {

    alert(
      "Ye Day abhi available nahi hai."
    );

    return;

  }


  completedDays.push(
    dayNumber
  );


  completedDays =
    [
      ...new Set(
        completedDays
      )
    ].sort(
      (a, b) => a - b
    );


  const times =
    getCompletionTimes();

  times[dayNumber] =
    Date.now();


  saveCompletionTimes(
    times
  );

  saveProgress();


  closeLesson();

  renderDays();

  updateProgress();


  const nextDay =
    dayNumber + 1;


  if (
    nextDay <= 72
  ) {

    alert(
      `Day ${dayNumber} complete! ` +
      `Day ${nextDay} required waiting time ke baad unlock hoga.`
    );

  } else {

    alert(
      "🎉 Congratulations! " +
      "Aap ne 72 Days complete kar liye hain."
    );

  }

}


/*
=========================================================
CLOSE LESSON
=========================================================
*/

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


/*
=========================================================
PROGRESS
=========================================================
*/

function updateProgress() {

  const total =
    Number(
      courseData?.course?.totalDays
    ) || 72;


  const completed =
    completedDays.length;


  const percentage =
    total
      ? Math.round(
          completed /
          total *
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

      let next =
        1;

      while (
        completedDays.includes(next) &&
        next <= total
      ) {

        next++;

      }

      statusText.textContent =
        `Day ${next}`;

    }

  }

}


/*
=========================================================
COUNTDOWN
=========================================================
*/

function startCountdown() {

  if (countdownInterval) {

    clearInterval(
      countdownInterval
    );

  }


  updateCountdowns();


  countdownInterval =
    setInterval(
      updateCountdowns,
      1000
    );

}


function updateCountdowns() {

  const elements =
    document.querySelectorAll(
      ".unlock-countdown"
    );


  let rerender =
    false;


  elements.forEach(
    element => {

      const unlock =
        Number(
          element.dataset.unlockTime
        );


      if (!unlock) {
        return;
      }


      const remaining =
        unlock -
        Date.now();


      if (
        remaining <= 0
      ) {

        rerender =
          true;

        return;

      }


      const strong =
        element.querySelector(
          "strong"
        );


      if (strong) {

        strong.textContent =
          formatTime(
            remaining
          );

      }

    }
  );


  if (rerender) {

    renderDays();

    updateProgress();

  }

}


function formatTime(
  milliseconds
) {

  let seconds =
    Math.floor(
      milliseconds / 1000
    );


  const days =
    Math.floor(
      seconds / 86400
    );

  seconds %= 86400;


  const hours =
    Math.floor(
      seconds / 3600
    );

  seconds %= 3600;


  const minutes =
    Math.floor(
      seconds / 60
    );

  seconds %= 60;


  return [
    days > 0
      ? `${days}d`
      : null,

    `${String(hours).padStart(2, "0")}h`,

    `${String(minutes).padStart(2, "0")}m`,

    `${String(seconds).padStart(2, "0")}s`

  ]

    .filter(Boolean)

    .join(" ");

}


/*
=========================================================
ERROR
=========================================================
*/

function showError(message) {

  if (loading) {
    loading.style.display =
      "none";
  }


  if (daysContainer) {
    daysContainer.innerHTML =
      "";
  }


  if (errorBox) {
    errorBox.style.display =
      "block";
  }


  if (errorText) {
    errorText.textContent =
      message;
  }

}

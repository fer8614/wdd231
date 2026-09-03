const courses = [
    {
        subject: "CSE",
        number: 110,
        title: "Introduction to Programming",
        credits: 2,
        completed: true
    },
    {
        subject: "CSE",
        number: 111,
        title: "Programming with Functions",
        credits: 2,
        completed: true
    },
    {
        subject: "CSE",
        number: 210,
        title: "Programming with Classes",
        credits: 2,
        completed: false
    },
    {
        subject: "WDD",
        number: 130,
        title: "Web Fundamentals",
        credits: 2,
        completed: true
    },
    {
        subject: "WDD",
        number: 131,
        title: "Dynamic Web Fundamentals",
        credits: 2,
        completed: true
    },
    {
        subject: "WDD",
        number: 231,
        title: "Web Frontend Development I",
        credits: 2,
        completed: false
    }
];

const courseContainer = document.querySelector("#courses");
const creditTotal = document.querySelector("#creditTotal");
const filterButtons = document.querySelectorAll(".filter-btn");

function displayCourses(filter = "all") {
    if (!courseContainer || !creditTotal) return;

    let filteredCourses = courses;

    if (filter === "wdd") {
        filteredCourses = courses.filter((course) => course.subject === "WDD");
    } else if (filter === "cse") {
        filteredCourses = courses.filter((course) => course.subject === "CSE");
    }

    courseContainer.innerHTML = filteredCourses
        .map((course) => {
            const courseCode = `${course.subject} ${course.number}`;
            const completedClass = course.completed ? "completed" : "";
            const checkmark = course.completed ? "✓ " : "";

            return `<article class="course-card ${completedClass}">
                <p>${checkmark}${courseCode}</p>
            </article>`;
        })
        .join("");

    const totalCredits = filteredCourses.reduce(
        (sum, course) => sum + course.credits,
        0
    );

    creditTotal.textContent = totalCredits;
}

filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
        filterButtons.forEach((btn) => btn.classList.remove("active"));
        button.classList.add("active");
        displayCourses(button.dataset.filter);
    });
});

displayCourses();

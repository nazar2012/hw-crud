const tableBody = document.querySelector("#students-table tbody");
const getBtn = document.querySelector("#get-students-btn");
const form = document.querySelector("#add-student-form");

// Функція для отримання всіх студентів
function getStudents() {
    fetch("http://localhost:3000/students")
        .then(res => res.json())
        .then(students => renderStudents(students))
}

// Функція для відображення студентів у таблиці
function renderStudents(students) {
    tableBody.innerHTML = "";

    const item = students.map(student => {
        return `<tr>
            <td>${student.id}</td>
            <td>${student.name}</td>
            <td>${student.age}</td>
            <td>${student.course}</td>
            <td>${student.skills.join(", ")}</td>
            <td>${student.email}</td>
            <td>${student.isEnrolled ? "Записаний" : "Не записаний"}</td>
        </tr>`
    }).join("");

    tableBody.innerHTML = item;
}

// Функція для додавання нового студента
function addStudent(e) {
    e.preventDefault();

    const newStudent = {
        name: form.name.value,
        age: Number(form.age.value),
        course: form.course.value,
        skills: form.skills.value.split(",").map(s => s.trim()),
        email: form.email.value,
        isEnrolled: form.isEnrolled.checked
    };

    fetch("http://localhost:3000/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newStudent)
    })
        .then(res => res.json())
        .then(() => {
            form.reset();
            getStudents();
        })
}

// Функція для оновлення студента
function updateStudent(id) {
    // твій код
}

// Функція для видалення студента
function deleteStudent(id) {
    // твій код
}

form.addEventListener("submit", addStudent);

getStudents();
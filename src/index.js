import { info, success } from '@pnotify/core';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';
import '@pnotify/mobile/dist/PNotifyMobile.css';

const tableBody = document.querySelector("#students-table tbody");
const form = document.querySelector("#add-student-form");
let editStudentId = null;

// Функція для отримання всіх студентів
function getStudents() {
    fetch("http://localhost:3000/students").then(res => res.json()).then(students => renderStudents(students))
}

// Функція для відображення студентів у таблиці
function renderStudents(students) {
    tableBody.innerHTML = "";

    const item = students.map(student => {
        return `<tr id="tr">
            <td>${student.id}</td>
            <td>${student.name}</td>
            <td>${student.age}</td>
            <td>${student.course}</td>
            <td>${student.skills.join(", ")}</td>
            <td>${student.email}</td>
            <td>${student.isEnrolled ? "Записаний" : "Не записаний"}</td>
            <td><div class="btn-wrapper"><button data-action="delete" type="button" class="button-del">Delete</button>
            <button data-action="edit" type="button" class="button">Edit</button>
        </div></td>
        </tr>`
    }).join("");

    tableBody.innerHTML = item;
}

// Функція для додавання нового студента
function addStudent(e) {
    e.preventDefault();

    if (editStudentId) {
        updateStudent(editStudentId);
        return;
    }

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
        });
}

// Функція для оновлення студента
function updateStudent(id) {
    const updatedStudent = {
        name: form.name.value,
        age: Number(form.age.value),
        course: form.course.value,
        skills: form.skills.value.split(",").map(s => s.trim()),
        email: form.email.value,
        isEnrolled: form.isEnrolled.checked
    };

    fetch(`http://localhost:3000/students/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedStudent)
    })
        .then(() => {
            form.reset();
            editStudentId = null;
            form.querySelector("button").textContent = "Додати студента";
            getStudents();
        });
}

function fillFormForEdit(id) {
    fetch(`http://localhost:3000/students/${id}`)
        .then(res => res.json())
        .then(student => {
            form.name.value = student.name;
            form.age.value = student.age;
            form.course.value = student.course;
            form.skills.value = student.skills.join(", ");
            form.email.value = student.email;
            form.isEnrolled.checked = student.isEnrolled;

            editStudentId = id;
            form.querySelector("button").textContent = "Оновити студента";

            form.scrollIntoView({ behavior: "smooth" });

            info({
                title: 'Редагування',
                text: `Готово! Тепер можете змінити дані студента`
            });
        });
}

tableBody.addEventListener("click", (event) => {
    const action = event.target.dataset.action;
    if (!action) return;

    const tr = event.target.closest("tr");
    const id = tr.children[0].textContent;

    if (action === "delete") {
        deleteStudent(id);
    }

    if (action === "edit") {
        fillFormForEdit(id);
    }
});

// Функція для видалення студента
function deleteStudent(id) {
    fetch(`http://localhost:3000/students/${id}`, {
        method: "DELETE"
    })
        .then(res => {
            getStudents();
            success({
                title: 'Видалення',
                text: `Студента видалено`
            });
        });
}

form.addEventListener("submit", addStudent);

getStudents();
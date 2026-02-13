import { info, success } from '@pnotify/core';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';
import '@pnotify/mobile/dist/PNotifyMobile.css';

const tableBody = document.querySelector("#students-table tbody");
const form = document.querySelector("#add-student-form");
const getStudentsBtn = document.querySelector("#get-students-btn");
let editStudentId = null;   

async function getStudents() {
    getStudentsBtn.disabled = true;

    const res = await fetch("http://localhost:3000/students");
    const students = await res.json();
    renderStudents(students);
}


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
            <td>
                <div class="btn-wrapper">
                    <button data-action="delete" type="button" class="button-del">Delete</button>
                    <button data-action="edit" type="button" class="button">Edit</button>
                </div>
            </td>
        </tr>`;
    }).join("");

    tableBody.innerHTML = item;
}

async function addStudent(e) {
    e.preventDefault();

    if (editStudentId) {
        await updateStudent(editStudentId);
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

    await fetch("http://localhost:3000/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newStudent)
    });

    form.reset();
    await getStudents();

    success({
        title: 'Додавання',
        text: 'Студента успішно додано'
    });
}

async function updateStudent(id) {
    const updatedStudent = {
        name: form.name.value,
        age: Number(form.age.value),
        course: form.course.value,
        skills: form.skills.value.split(",").map(s => s.trim()),
        email: form.email.value,
        isEnrolled: form.isEnrolled.checked
    };

    await fetch(`http://localhost:3000/students/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedStudent)
    });

    form.reset();
    editStudentId = null;
    form.querySelector("button").textContent = "Додати студента";

    await getStudents();

    success({
        title: 'Оновлення',
        text: 'Дані студента оновлено'
    });
}

async function fillFormForEdit(id) {
    const res = await fetch(`http://localhost:3000/students/${id}`);
    const student = await res.json();

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
        text: 'Тепер можете змінити дані студента'
    });
}

tableBody.addEventListener("click", async (event) => {
    const action = event.target.dataset.action;
    if (!action) return;

    const tr = event.target.closest("tr");
    const id = tr.children[0].textContent;

    if (action === "delete") {
        await deleteStudent(id);
    }

    if (action === "edit") {
        await fillFormForEdit(id);
    }
});

async function deleteStudent(id) {
    await fetch(`http://localhost:3000/students/${id}`, {
        method: "DELETE"
    });

    await getStudents();

    success({
        title: 'Видалення',
        text: 'Студента видалено'
    });
}


getStudentsBtn.addEventListener("click", getStudents);
form.addEventListener("submit", addStudent);
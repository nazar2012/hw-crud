let e=document.querySelector("#students-table tbody");document.querySelector("#get-students-btn");let t=document.querySelector("#add-student-form");function n(){fetch("http://localhost:3000/students").then(e=>e.json()).then(t=>{var n;return n=t,void(e.innerHTML="",e.innerHTML=n.map(e=>`<tr>
            <td>${e.id}</td>
            <td>${e.name}</td>
            <td>${e.age}</td>
            <td>${e.course}</td>
            <td>${e.skills.join(", ")}</td>
            <td>${e.email}</td>
            <td>${e.isEnrolled?"Записаний":"Не записаний"}</td>
        </tr>`).join(""))})}t.addEventListener("submit",function(e){e.preventDefault(),fetch("http://localhost:3000/students",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:t.name.value,age:Number(t.age.value),course:t.course.value,skills:t.skills.value.split(",").map(e=>e.trim()),email:t.email.value,isEnrolled:t.isEnrolled.checked})}).then(e=>e.json()).then(()=>{t.reset(),n()})}),n();
//# sourceMappingURL=hw-crud.40599bbf.js.map

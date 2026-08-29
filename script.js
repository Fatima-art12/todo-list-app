const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.querySelector(".task-list");
const filterBtns = document.querySelectorAll(".filter-btn");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

let currentFilter = "All";

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {

    taskList.innerHTML = "";

    tasks.forEach(function(task, index) {

        let shouldShow = true;

        if (currentFilter.includes("Important")) {
            shouldShow = task.important;
        } else if (currentFilter.includes("Completed")) {
            shouldShow = task.completed;
        }

        if (!shouldShow) {
            return;
        }

        let taskDiv = document.createElement("div");
        taskDiv.className = task.completed ? "task completed" : "task";
        taskDiv.setAttribute("data-index", index);

        taskDiv.innerHTML = `
            <input type="checkbox" class="task-check" ${task.completed ? "checked" : ""}>
            <span class="task-text">${task.text}</span>
            <span class="star ${task.important ? "filled" : ""}">${task.important ? "⭐" : "☆"}</span>
            <span class="delete-btn">❌</span>
        `;

        taskList.appendChild(taskDiv);

    });

}

addBtn.addEventListener("click", function() {

    let taskText = taskInput.value;

    if (taskText === "") {
        return;
    }

    tasks.push({ text: taskText, completed: false, important: false });

    saveTasks();
    renderTasks();

    taskInput.value = "";

});

taskList.addEventListener("click", function(e) {

    let clickedTask = e.target.closest(".task");
    if (!clickedTask) return;

    let index = clickedTask.getAttribute("data-index");

    if (e.target.classList.contains("star")) {
        tasks[index].important = !tasks[index].important;
        saveTasks();
        renderTasks();
    }

    if (e.target.classList.contains("task-check")) {
        tasks[index].completed = !tasks[index].completed;
        saveTasks();
        renderTasks();
    }

    if (e.target.classList.contains("delete-btn")) {
        let confirmDelete = confirm("Are you sure you want to delete this task?");

        if (confirmDelete) {
            tasks.splice(index, 1);
            saveTasks();
            renderTasks();
        }
    }

});

filterBtns.forEach(function(btn) {

    btn.addEventListener("click", function() {

        filterBtns.forEach(function(b) {
            b.classList.remove("active");
        });

        btn.classList.add("active");

        currentFilter = btn.textContent.trim();
        renderTasks();

    });

});

renderTasks();

const navItems = document.querySelectorAll(".nav-item");
const views = document.querySelectorAll(".view");

navItems.forEach(function(item) {

    item.addEventListener("click", function() {

        navItems.forEach(function(nav) {
            nav.classList.remove("active");
        });

        item.classList.add("active");

        let targetView = item.getAttribute("data-view");

        views.forEach(function(view) {
            view.classList.remove("active-view");
        });

        document.querySelector("." + targetView).classList.add("active-view");

        if (targetView === "stats-view") {
            updateStats();
        }

        if (targetView === "calendar-view") {
            showTodayDate();
        }

    });

});

function updateStats() {

    let total = tasks.length;
    let completed = tasks.filter(function(t) { return t.completed; }).length;
    let pending = total - completed;
    let important = tasks.filter(function(t) { return t.important; }).length;

    document.getElementById("totalCount").textContent = total;
    document.getElementById("completedCount").textContent = completed;
    document.getElementById("pendingCount").textContent = pending;
    document.getElementById("importantCount").textContent = important;

}

function showTodayDate() {
    let today = new Date();
    let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById("todayDate").textContent = today.toLocaleDateString('en-US', options);
}

const profilePicInput = document.getElementById("profilePicInput");
const profilePicPreview = document.getElementById("profilePicPreview");
const profileNameInput = document.getElementById("profileNameInput");
const saveProfileBtn = document.getElementById("saveProfileBtn");
const headerProfilePic = document.getElementById("headerProfilePic");
const greetingText = document.getElementById("greetingText");
const menuIcon = document.getElementById("menuIcon");
const menuProfileBtn = document.getElementById("menuProfileBtn");

let profileData = JSON.parse(localStorage.getItem("profile")) || { name: "", pic: "" };

function loadProfile() {

    if (profileData.pic) {
        profilePicPreview.src = profileData.pic;
        headerProfilePic.src = profileData.pic;
        headerProfilePic.style.display = "block";
        menuIcon.style.display = "none";
        document.getElementById("bigProfilePic").src = profileData.pic;
    }

    if (profileData.name) {
        profileNameInput.value = profileData.name;
        greetingText.textContent = "Hi, " + profileData.name;
        document.getElementById("bigProfileName").textContent = profileData.name;
    }

}

profilePicInput.addEventListener("change", function() {

    let file = profilePicInput.files[0];

    if (!file) {
        return;
    }

    let reader = new FileReader();

    reader.onload = function() {
        profilePicPreview.src = reader.result;
        profileData.pic = reader.result;
    };

    reader.readAsDataURL(file);

});

saveProfileBtn.addEventListener("click", function() {

    profileData.name = profileNameInput.value;

    localStorage.setItem("profile", JSON.stringify(profileData));

    loadProfile();

    alert("Profile saved successfully!");

});

menuProfileBtn.addEventListener("click", function() {

    navItems.forEach(function(nav) {
        nav.classList.remove("active");
    });

    views.forEach(function(view) {
        view.classList.remove("active-view");
    });

    document.querySelector(".profile-view").classList.add("active-view");

});

loadProfile();
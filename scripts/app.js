import {capitalizeFirstLetter, formatCategoryName, setCategoryIcon, getCurrentDate, extractDates} from './helper-functions.js';
import * as data from './data-processing.js';

const createTaskBtn = document.getElementById('create-task');

const createTaskModal = document.getElementById('open-modal');
const backdrop = document.getElementById('backdrop');

//modal buttons
const addTaskModalBtn = document.querySelector('.btn-add');
const cancelTaskModalBtn = document.querySelector('.btn-cancel');
const confirmTaskModalBtn = document.querySelector('.btn-confirm');

//archive related buttons
const moveToArchiveBtn = document.querySelector('.archive');
const moveToActiveBtn = document.querySelector('.unarchive');
const deleteFromArchiveBtn = document.querySelector('.archive-delete');

const userInputs = createTaskModal.querySelectorAll('input');
const [inputName, inputTask] = userInputs;
const userSelect = createTaskModal.querySelector('select');


function toggleModalHandler() {
    createTaskModal.classList.toggle('visible');
    backdrop.classList.toggle('visible');
}

function clearUserInputs() {
    inputName.value = '';
    inputTask.value = '';
}

function setAddTaskMode() {
    addTaskModalBtn.style.display = 'block';
    confirmTaskModalBtn.style.display = 'none';
    clearUserInputs();
}

function setEditTaskMode() {
    addTaskModalBtn.style.display = 'none';
    confirmTaskModalBtn.style.display = 'block';
}

function editTaskHandler (id) {
    confirmTaskModalBtn.dataset.editingTaskId = id;
    populateModalForEditing(id);

    confirmTaskModalBtn.removeEventListener('click', updateCurrentTask);
    confirmTaskModalBtn.addEventListener('click', updateCurrentTask, {once: true});

    // to handle 'Cancel' editing option
    backdrop.addEventListener('click', setAddTaskMode);
    cancelTaskModalBtn.addEventListener('click', setAddTaskMode);
}

function populateModalForEditing(id) {
    const editingTask = data.getCurrentTaskData(id);

    inputName.value = editingTask.name;
    inputTask.value = editingTask.task;

    const currentTaskCategoryIndex = Array.from(userSelect.options).findIndex(
        (option) => option.value === editingTask.category
    );
    userSelect.options.selectedIndex = currentTaskCategoryIndex;

    setEditTaskMode();
    toggleModalHandler();
}

function updateCurrentTask() {
    const editingTaskId = confirmTaskModalBtn.dataset.editingTaskId;
    const currentTaskElement = document.querySelector(`[data-task-id=${editingTaskId}]`);

    const updatedValues = {
        name: capitalizeFirstLetter(inputName.value),
        task: capitalizeFirstLetter(inputTask.value),
        category: userSelect.value,
        dates: extractDates(inputTask.value),
        iconPath: setCategoryIcon(userSelect.value)
    }

    data.updateTaskData(editingTaskId, updatedValues);

    currentTaskElement.querySelector('.task-name').textContent = updatedValues.name;
    currentTaskElement.querySelector('.task-content').textContent = updatedValues.task;
    currentTaskElement.querySelector('.task-category').textContent = formatCategoryName(updatedValues.category);
    currentTaskElement.querySelector('.task-icon img').setAttribute('src', updatedValues.iconPath);
    currentTaskElement.querySelector('.task-dates').textContent = updatedValues.dates;
    delete confirmTaskModalBtn.dataset.editingTaskId;

    console.log(data.tasks);

    toggleModalHandler();
    clearUserInputs();
    setAddTaskMode();
}

function archiveTaskHandler () {
    updateSummaryTable();
}

function deleteTaskHandler (event, id) {
    const currentTaskElement = event.target.closest('li');
    currentTaskElement.remove();
    data.deleteTaskData(id);
    updateSummaryTable();
}

function handleActionBtnsEvents(id) {
    const currentTaskElement = document.querySelector(`[data-task-id=${id}]`);

    const editButton = currentTaskElement.querySelector('.edit');
    const archiveButton = currentTaskElement.querySelector('.archive');
    const deleteButton = currentTaskElement.querySelector('.delete');

    editButton.addEventListener('click', () => {editTaskHandler(id)});
    archiveButton.addEventListener('click', archiveTaskHandler);
    deleteButton.addEventListener('click', (event) => {deleteTaskHandler(event, id)});
}

function renderNewTaskElement(taskDetails) {
    const taskTemplate = document.getElementById('task-template');
    const newTaskElement = taskTemplate.content.firstElementChild.cloneNode(true);
    const taskIcon = newTaskElement.querySelector('.task-icon img');
    taskIcon.src = taskDetails.iconPath;

    newTaskElement.querySelector('.task-name').textContent = capitalizeFirstLetter(taskDetails.name);
    newTaskElement.querySelector('.task-date').textContent = taskDetails.date;
    newTaskElement.querySelector('.task-category').textContent = formatCategoryName(taskDetails.category);
    newTaskElement.querySelector('.task-content').textContent = capitalizeFirstLetter(taskDetails.task);
    newTaskElement.querySelector('.task-dates').textContent = taskDetails.dates;
    newTaskElement.dataset.taskId = taskDetails.id;

    const listRootElement = document.querySelector('.tasks-list');
    listRootElement.append(newTaskElement);
}

function renderExistingTasks() {
    data.tasks.length && data.tasks.forEach(task => {
        renderNewTaskElement(task);
        handleActionBtnsEvents(task.id);
        updateSummaryTable();
    })
}

function updateSummaryTable() {
    const activeTasksSumElement = document.querySelector('.tasks-active');
    const archivedTasksSumElement = document.querySelector('.tasks-archived');
    activeTasksSumElement.textContent = data.tasks.length;
    archivedTasksSumElement.textContent = data.archivedTasks.length;
}

function addNewTaskHandler() {
    const newTask = {
        id: Date.now().toString(36),
        name: capitalizeFirstLetter(inputName.value),
        task: capitalizeFirstLetter(inputTask.value),
        date: getCurrentDate(),
        category: userSelect.value,
        dates: extractDates(inputTask.value),
        iconPath: setCategoryIcon(userSelect.value)
    }

    data.addTaskData(newTask);

    clearUserInputs();
    renderNewTaskElement(newTask);
    updateSummaryTable();
    toggleModalHandler();
    handleActionBtnsEvents(newTask.id);
}


createTaskBtn.addEventListener('click', toggleModalHandler);
backdrop.addEventListener('click', toggleModalHandler);
cancelTaskModalBtn.addEventListener('click', toggleModalHandler);
addTaskModalBtn.addEventListener('click', addNewTaskHandler);
renderExistingTasks();
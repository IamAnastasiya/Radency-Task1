import {capitalizeFirstLetter, formatCategoryName, setCategoryIcon, extractDates} from './helper-functions.js';
import * as data from './data-processing.js';

const createTaskBtn = document.getElementById('create-task');
const createTaskModal = document.getElementById('open-modal');
const backdrop = document.getElementById('backdrop');

//modal buttons
const addTaskModalBtn = document.querySelector('.btn-add');
const cancelTaskModalBtn = document.querySelector('.btn-cancel');
const confirmTaskModalBtn = document.querySelector('.btn-confirm');

const archiveToggler = document.querySelector('.archive-toggler');

const [inputName, inputTask] = createTaskModal.querySelectorAll('input');
const userSelect = createTaskModal.querySelector('select');


function toggleModalHandler() {
    createTaskModal.classList.toggle('visible');
    backdrop.classList.toggle('visible');
}

function toggleArchiveHandler() {
    const archiveContainer = document.querySelector('.archive-container');
    archiveContainer.classList.toggle('visible');
    archiveToggler.textContent = archiveContainer.classList.contains('visible') ? 'Hide Archived' : 'Show Archived';
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
    [inputName.value, inputTask.value] = [editingTask.name, editingTask.task];
    userSelect.value = editingTask.category;

    setEditTaskMode();
    toggleModalHandler();
}

function updateCurrentTask() {
    const editingTaskId = confirmTaskModalBtn.dataset.editingTaskId;
    const currentTaskElement = document.querySelector(`[data-task-id=${editingTaskId}]`);

    try {
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

        toggleModalHandler();
        clearUserInputs();
        setAddTaskMode();
    } catch (error) {
        console.error('An error occurred while updating the task:', error);
    }
}

function archiveTaskHandler (id) {
    const currentTask = data.getCurrentTaskData(id);
    renderNewTaskElement(currentTask, 'archive-template');
    data.moveTaskData(data.tasks, data.archivedTasks, id);

    deleteTaskFromUI(id);
    setListenersForArchivedTask(id);
    updateSummaryTable();
}

function unArchiveTaskHandler (id) {
    const currentTask = data.getCurrentTaskData(id, 'archive');
    deleteTaskFromUI(id);

    renderNewTaskElement(currentTask, 'task-template');
    data.moveTaskData(data.archivedTasks, data.tasks, id);

    handleActionBtnsEvents(id);
    updateSummaryTable();
}

function setListenersForArchivedTask(id) {
    const currentTaskElement = document.querySelector(`[data-task-id=${id}]`);

    const deleteFromArchiveBtn = currentTaskElement.querySelector('.archive-delete');
    const unarchiveBtn = currentTaskElement.querySelector('.unarchive');

    deleteFromArchiveBtn.addEventListener('click', () => { deleteTaskHandler(id, 'archive') });
    unarchiveBtn.addEventListener('click', () => { unArchiveTaskHandler(id) });
}


function deleteTaskHandler (id, source) {
    deleteTaskFromUI(id);
    data.deleteTaskData(id, source);
    updateSummaryTable();
}

function deleteTaskFromUI(id) {
    const currentTaskElement = document.querySelector(`[data-task-id=${id}]`);
    currentTaskElement.remove();
}

function handleActionBtnsEvents(id) {
    const currentTaskElement = document.querySelector(`[data-task-id=${id}]`);

    const editButton = currentTaskElement.querySelector('.edit');
    const archiveButton = currentTaskElement.querySelector('.archive');
    const deleteButton = currentTaskElement.querySelector('.delete');

    editButton.addEventListener('click', () => {editTaskHandler(id)});
    archiveButton.addEventListener('click', () => {archiveTaskHandler(id)});
    deleteButton.addEventListener('click', () => {deleteTaskHandler(id, 'active')});
}

function renderNewTaskElement(taskDetails, template) {
    const taskTemplate = document.getElementById(template);
    const newTaskElement = taskTemplate.content.firstElementChild.cloneNode(true);
    const taskIcon = newTaskElement.querySelector('.task-icon img');
    taskIcon.src = taskDetails.iconPath;

    newTaskElement.querySelector('.task-name').textContent = capitalizeFirstLetter(taskDetails.name);
    newTaskElement.querySelector('.task-date').textContent = taskDetails.date;
    newTaskElement.querySelector('.task-category').textContent = formatCategoryName(taskDetails.category);
    newTaskElement.querySelector('.task-content').textContent = capitalizeFirstLetter(taskDetails.task);
    newTaskElement.querySelector('.task-dates').textContent = taskDetails.dates;
    newTaskElement.dataset.taskId = taskDetails.id;
    
    if (template === 'task-template') {
        const listRootElement = document.querySelector('.tasks-list');
        listRootElement.append(newTaskElement);
    } else if (template === 'archive-template') {
        const archiveListElement = document.querySelector('.archive-list');
        archiveListElement.append(newTaskElement);
    }  
}

function renderExistingTasks() {
    data.tasks.length && data.tasks.forEach(task => {
        renderNewTaskElement(task, 'task-template');
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
    const newTask = data.createNewTask(inputName.value, inputTask.value, userSelect.value);

    data.addTaskData(newTask);

    clearUserInputs();
    renderNewTaskElement(newTask, 'task-template');
    updateSummaryTable();
    toggleModalHandler();
    handleActionBtnsEvents(newTask.id);
}

createTaskBtn.addEventListener('click', toggleModalHandler);
backdrop.addEventListener('click', toggleModalHandler);
cancelTaskModalBtn.addEventListener('click', toggleModalHandler);
addTaskModalBtn.addEventListener('click', addNewTaskHandler);
archiveToggler.addEventListener('click', toggleArchiveHandler);
renderExistingTasks();
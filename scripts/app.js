import {capitalizeFirstLetter, formatCategoryName, setCategoryIcon, extractDates} from './helper-functions.js';
import {updateSummaryTable} from './summary-handling.js';
import * as modal from './modal-handling.js';
import * as data from './data-processing.js';

const createTaskBtn = document.getElementById('create-task');
const archiveToggler = document.querySelector('.archive-toggler');


function toggleArchiveHandler() {8
    const archiveContainer = document.querySelector('.archive-container');
    archiveContainer.classList.toggle('visible');
    archiveToggler.textContent = archiveContainer.classList.contains('visible') ? 'Hide Archived' : 'Show Archived';
}

function editTaskHandler (id) {
    modal.confirmTaskModalBtn.dataset.editingTaskId = id;
    modal.populateModalForEditing(id);

    modal.confirmTaskModalBtn.removeEventListener('click', updateCurrentTask);
    modal.confirmTaskModalBtn.addEventListener('click', updateCurrentTask, {once: true});

    // to handle 'Cancel' editing option
    modal.backdrop.addEventListener('click', modal.setAddTaskMode);
    modal.cancelTaskModalBtn.addEventListener('click', modal.setAddTaskMode);
}

function updateCurrentTask() {
    const editingTaskId = modal.confirmTaskModalBtn.dataset.editingTaskId;
    const currentTaskElement = document.querySelector(`[data-task-id=${editingTaskId}]`);

    try {
        const updatedValues = {
            name: capitalizeFirstLetter(modal.inputName.value),
            task: capitalizeFirstLetter(modal.inputTask.value),
            category: modal.userSelect.value,
            dates: extractDates(modal.inputTask.value),
            iconPath: setCategoryIcon(modal.userSelect.value)
        }

        data.updateTaskData(editingTaskId, updatedValues);

        currentTaskElement.querySelector('.task-name').textContent = updatedValues.name;
        currentTaskElement.querySelector('.task-content').textContent = updatedValues.task;
        currentTaskElement.querySelector('.task-category').textContent = formatCategoryName(updatedValues.category);
        currentTaskElement.querySelector('.task-icon img').setAttribute('src', updatedValues.iconPath);
        currentTaskElement.querySelector('.task-dates').textContent = updatedValues.dates;
        delete modal.confirmTaskModalBtn.dataset.editingTaskId;

        modal.toggleModalHandler();
        modal.clearUserInputs();
        updateSummaryTable();
        modal.setAddTaskMode();
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
    })
    updateSummaryTable();
}

function addNewTaskHandler() {
    const newTask = data.createNewTask(modal.inputName.value, modal.inputTask.value, modal.userSelect.value);

    data.addTaskData(newTask);

    modal.clearUserInputs();
    renderNewTaskElement(newTask, 'task-template');
    updateSummaryTable();
    modal.toggleModalHandler();
    handleActionBtnsEvents(newTask.id)
}

createTaskBtn.addEventListener('click', modal.toggleModalHandler);
modal.backdrop.addEventListener('click', modal.toggleModalHandler);
modal.cancelTaskModalBtn.addEventListener('click', modal.toggleModalHandler);
modal.addTaskModalBtn.addEventListener('click', addNewTaskHandler);
archiveToggler.addEventListener('click', toggleArchiveHandler);
renderExistingTasks();
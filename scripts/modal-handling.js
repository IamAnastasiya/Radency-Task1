import {getCurrentTaskData} from './data-processing.js';

export const createTaskModal = document.getElementById('open-modal');
export const backdrop = document.getElementById('backdrop');

export const addTaskModalBtn = document.querySelector('.btn-add');
export const cancelTaskModalBtn = document.querySelector('.btn-cancel');
export const confirmTaskModalBtn = document.querySelector('.btn-confirm');
export const [inputName, inputTask] = createTaskModal.querySelectorAll('input');
export const userSelect = createTaskModal.querySelector('select');

export function toggleModalHandler() {
    createTaskModal.classList.toggle('visible');
    backdrop.classList.toggle('visible');
}

export function clearUserInputs() {
    inputName.value = '';
    inputTask.value = '';
}

export function setAddTaskMode() {
    addTaskModalBtn.style.display = 'block';
    confirmTaskModalBtn.style.display = 'none';
    clearUserInputs();
}

function setEditTaskMode() {
    addTaskModalBtn.style.display = 'none';
    confirmTaskModalBtn.style.display = 'block';
}

export function populateModalForEditing(id) {
    const editingTask = getCurrentTaskData(id);
    [inputName.value, inputTask.value] = [editingTask.name, editingTask.task];
    userSelect.value = editingTask.category;

    setEditTaskMode();
    toggleModalHandler();
}
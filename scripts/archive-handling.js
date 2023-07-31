import {getCurrentTaskData, moveTaskData, tasks, archivedTasks} from './data-processing.js';
import {deleteTaskFromUI, renderNewTaskElement, handleActionBtnsEvents, deleteTaskHandler} from './app.js'; 
import {updateSummaryTable} from './summary-handling.js';
const archiveToggler = document.querySelector('.archive-toggler');


function toggleArchiveHandler() {
    const archiveContainer = document.querySelector('.archive-container');
    archiveContainer.classList.toggle('visible');
    archiveToggler.textContent = archiveContainer.classList.contains('visible') ? 'Hide Archived' : 'Show Archived';
}

export function archiveTaskHandler (id) {
    const currentTask = getCurrentTaskData(id);
    renderNewTaskElement(currentTask, 'archive-template');
    moveTaskData(tasks, archivedTasks, id);

    deleteTaskFromUI(id);
    setListenersForArchivedTask(id);
    updateSummaryTable();
}

function unArchiveTaskHandler (id) {
    const currentTask = getCurrentTaskData(id, 'archive');
    deleteTaskFromUI(id);

    renderNewTaskElement(currentTask, 'task-template');
    moveTaskData(archivedTasks, tasks, id);

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


archiveToggler.addEventListener('click', toggleArchiveHandler);
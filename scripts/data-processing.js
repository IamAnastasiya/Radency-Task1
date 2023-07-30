import {capitalizeFirstLetter, setCategoryIcon, getCurrentDate, extractDates} from './helper-functions.js';

export let tasks = [
    {
        "id": "lkob0fjh",
        "name": "Shopping List",
        "task": "Tomatoes",
        "date": "29/7/2023",
        "category": "task",
        "dates": "",
        "iconPath": "assets/images/shopping-cart.png"
    },
    {
        "id": "lkob1egs",
        "name": "The Theory Of Evolution",
        "task": "The Modern Evolutionary Synthesis Defines Evolution As The Change Over Time In This Genetic Variation",
        "date": "29/7/2023",
        "category": "random-thought",
        "dates": "",
        "iconPath": "assets/images/thought.png"
    },
    {
        "id": "lkob24w4",
        "name": "New Feature",
        "task": "Implement New Feature For The App",
        "date": "29/7/2023",
        "category": "idea",
        "dates": "",
        "iconPath": "assets/images/idea.png"
    },
    {
        "id": "lkob2to4",
        "name": "William Gaddis",
        "task": "Power Does Not Corrupt, People Corrupt Power",
        "date": "29/7/2023",
        "category": "quote",
        "dates": "",
        "iconPath": "assets/images/quote.png"
    },
    {
        "id": "lkob3cng",
        "name": "Books",
        "task": "The Lean Startup",
        "date": "29/7/2023",
        "category": "task",
        "dates": "",
        "iconPath": "assets/images/shopping-cart.png"
    },
    {
        "id": "lkob5j70",
        "name": "Oscar Wilde",
        "task": "Life Is Never Fair, And Perhaps It Is A Good Thing For Most Of Us That It Is Not",
        "date": "29/7/2023",
        "category": "quote",
        "dates": "",
        "iconPath": "assets/images/quote.png"
    },
    {
        "id": "lkob6ef8",
        "name": "Dentist",
        "task": "I’m Gonna Have A Dentist Appointment On The 4/4/2021, I Moved It From 5/5/2021",
        "date": "29/7/2023",
        "category": "task",
        "dates": "4/4/2021, 5/5/2021",
        "iconPath": "assets/images/shopping-cart.png"
    }
];

export let archivedTasks = [];

export function createNewTask(name, task, category) {
    return {
        id: Date.now().toString(36),
        name: capitalizeFirstLetter(name),
        task: capitalizeFirstLetter(task),
        date: getCurrentDate(),
        category: category,
        dates: extractDates(task),
        iconPath: setCategoryIcon(category)
    }
}

export function addTaskData(task) {
    tasks.push(task);
}

export function deleteTaskData(id, source) {
    if (source = 'active') {
        tasks = tasks.filter(task => task.id !== id);
    }

    if (source = 'archive') {
        archivedTasks = archivedTasks.filter(task => task.id !== id);
    }
}

export function getCurrentTaskData(id, source) {
    return source === 'archive' ? 
    archivedTasks.find(task => task.id === id) : 
    tasks.find(task => task.id === id);
}

export function updateTaskData(id, updatedValues) {
    const taskToUpdateIndex = tasks.findIndex((task) => task.id === id);
    tasks[taskToUpdateIndex] = { ...tasks[taskToUpdateIndex], ...updatedValues };
} 

export function moveTaskData(source, destination, id) {
    const sourceIndex = source.findIndex(obj => obj.id === id);

    if (sourceIndex !== -1) {
        const transferredObject = source.splice(sourceIndex, 1)[0];
        destination.push(transferredObject);
    }
}

// export function addTaskToArchive (task) {
//     archivedTasks.push(task);
// }

// export function getArchivedTask(id) {
//     return archivedTasks.find(task => task.id === id);
// }

export function deleteTaskFromArchive (id) {
    archivedTasks = archivedTasks.filter(task => task.id !== id);
}
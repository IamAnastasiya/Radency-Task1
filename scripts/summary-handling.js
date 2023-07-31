import { formatCategoryName, setCategoryIcon } from './helper-functions.js';
import * as data from './data-processing.js';
const summaryTable = document.querySelector('.summary-table');

export function createSummaryItem(categoryData) {
    const newSummaryItem = document.createElement('div');
    newSummaryItem.className = 'summary-item-wrapper';
    const categoryName = formatCategoryName(categoryData.name);
    newSummaryItem.innerHTML = `
        <div class="summary-task-icon">
            <img  src="${categoryData.iconPath}" alt="summary-task-category" width="20" height="20"/>
        </div>
        <span class="summary-category-name" data-category-name=${categoryData.name}>${categoryName}</span>
        <span class="tasks-active">${categoryData.active}</span>
        <span class="tasks-archived">${categoryData.archived}</span>
    `;
    return newSummaryItem;
}


export function updateExistingSummaryItem(existingSummaryItem, categoryData) {
    existingSummaryItem.querySelector('.tasks-active').textContent = categoryData.active;
    existingSummaryItem.querySelector('.tasks-archived').textContent = categoryData.archived;
}


export function removeNonActiveCategories(activeCategories) {
    const existingCategories = document.querySelectorAll('[data-category-name]');
    existingCategories.forEach(existingCategory => { 
        if (!(existingCategory.dataset.categoryName in activeCategories)) {
            existingCategory.closest('.summary-item-wrapper').remove();
        }
    })
}

export function updateSummaryTable() {
    const categoryCounts = data.getCategoryCounts();
    removeNonActiveCategories(categoryCounts);

    for (const category in categoryCounts) {
        const categoryData = {
          name: category,
          iconPath: setCategoryIcon(category),
          active: categoryCounts[category].active,
          archived: categoryCounts[category].archived,
        };

        const currentCategoryItem = document.querySelector(`span[data-category-name="${category}"]`);

        if (currentCategoryItem) {
            const categoryWrapper = currentCategoryItem.closest('.summary-item-wrapper');
            updateExistingSummaryItem(categoryWrapper, categoryData);
        } else {
            const summaryItem = createSummaryItem(categoryData);
            summaryTable.append(summaryItem);
        }
    }
}


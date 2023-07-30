export function capitalizeFirstLetter(str) {                                      
    return str.replace(/(^\w|\s\w)/g, m => m.toUpperCase());
}

export function formatCategoryName(str) {                                          
    str = str.includes('-') ? str.replace(/-/g, ' ') : str;
    return capitalizeFirstLetter(str);
}

export function getCurrentDate() {                                                
    const currentDate = new Date();
    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();
    return `${day}/${month}/${year}`;
}

export function extractDates(str) {                                                    
    const dateRegex = /\b\d{1,2}\/\d{1,2}\/\d{4}\b/g;
    const datesFound = Array.from(str.matchAll(dateRegex)).map(match => match[0]);
    return datesFound.join(', ') || '';
}

export function setCategoryIcon(category) {
    const iconsList = {
        'task': "assets/images/shopping-cart.png",
        'random-thought': "assets/images/thought.png",
        'idea': "assets/images/idea.png",
        'quote': "assets/images/quote.png"
    }

    return iconsList[category];
}


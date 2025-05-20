// static/js/modules/storage.js
import { renderTimeTable, renderOnlineClasses } from './timetable.js';

export function loadLocalStorage(key) {
    if (!key) return [];
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : [];
}

export function saveLocalStorage(key, value) {
    if (!key) return;
    localStorage.setItem(key, JSON.stringify(value));
}

export function addToLocalStorage(key, newValue) {
    if (!key) return;
    const existing = loadLocalStorage(key);
    existing.push(newValue);
    saveLocalStorage(key, existing);
}

function renderAll(key) {
    renderTimeTable(key);
    renderOnlineClasses(key);
}

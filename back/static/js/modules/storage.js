import {renderOnlineClasses, renderTimeTable} from './timetable.js'

/**
 * 로컬 스토리지에서 찾아내기
 * @param {String} key 
 * @returns 
 */
export function loadLocalStorage(key) {
    if (!key) {
        console.error("올바른 key 값을 입력하세요.");
        return null;
    }

    // localStorage에서 key 값을 가져옴
    let myItem = localStorage.getItem(key);

    // 만약 key가 존재하지 않으면 새로 생성하여 저장
    if (!myItem) {
        myItem = JSON.stringify([]); // 빈 배열을 문자열로 변환
        localStorage.setItem(key, myItem);
        console.log(key, "가 존재하지 않아 새로 생성되었습니다.");
    } else {
        console.log(key, "가 존재합니다.", JSON.parse(myItem));
    }

    rendering(key)
    
    return JSON.parse(myItem); // JSON 문자열을 객체로 변환하여 반환
}

/**
 * 로컬 스토리지에 저장하기
 * @param {String} key 
 * @param {Array} value 
 * @returns 
 */
export function saveLocalStorage(key, value) {
    if (!key) {
        console.error("올바른 key 값을 입력하세요.");
        return;
    }

    localStorage.setItem(key, JSON.stringify(value));
    console.log(key, "가 저장되었습니다.", value);

    rendering(key)
}

/**
 * 로컬 스토리지 원하는 key에 데이터 추가하기
 * @param {String} key 
 * @param {JSON} newValue 
 * @returns 
 */
export function addToLocalStorage(key, newValue) {
    if (!key) {
        console.error("올바른 key 값을 입력하세요.");
        return;
    }

    let existingData = localStorage.getItem(key);
    let parsedData = existingData ? JSON.parse(existingData) : [];

    if (!Array.isArray(parsedData)) {
        console.error("저장된 데이터가 배열 형식이 아닙니다.");
        return;
    }

    parsedData.push(newValue);
    localStorage.setItem(key, JSON.stringify(parsedData));
    console.log(key, "에 새로운 데이터가 추가되었습니다.", newValue);

    rendering(key)
}

function rendering(key) {
    // 시간표 업데이트
    renderTimeTable(key); 
    renderOnlineClasses(key);
}
// static/js/modules/search.js
import { renderTimeTable, renderOnlineClasses } from './timetable.js';
import { loadLocalStorage, addToLocalStorage } from './storage.js';

let category;
let isNP;

export function setIsNP(value) {
    isNP = value;
}

// 검색 필터 적용 후 서버 요청
export async function everythingParamsToJson() {
    const params = {};
    const name = document.getElementById("selectedSearchName").textContent;

    if (category) params.category = category;
    if (isNP && name !== "없음") params[isNP] = name;

    const courses = await fetchLectures(params);
    renderSearchResults(courses);
}

// 강의 검색 API 호출
export async function fetchLectures(params = {}) {
    try {
        const url = new URL("/api/lectures", window.location.origin);
        Object.entries(params).forEach(([key, value]) => url.searchParams.append(key, value));

        const res = await fetch(url);
        if (!res.ok) throw new Error("강의 데이터를 불러오는 데 실패했습니다.");
        return await res.json();
    } catch (err) {
        console.error("강의 데이터 오류:", err);
        return [];
    }
}

// 알파벳 → 교시 인덱스 범위 (학교 기준 정확히 반영!)
const alphaToIndexes = {
    'A': [2, 3],    // 예: A는 2~3교시
    'B': [4, 5],    // B는 4~5교시
    'C': [6, 7],
    'D': [8, 9],
    'E': [10, 11],
    'F': [12, 13]
};

const weekdays = ['월', '화', '수', '목', '금'];

// ✅ 교시 파싱 함수 (요일+숫자 인덱스 기준)
function parseSchedule(schedule) {
    if (!schedule) return [];

    const results = [];

    schedule.split(/[\s,]+/).forEach(block => {
        const dayChar = block[0];
        const timePart = block.slice(1);

        if (!weekdays.includes(dayChar)) return;

        const units = timePart.split('');

        units.forEach(unit => {
            if (/^[A-F]$/.test(unit)) {
                const indexes = alphaToIndexes[unit];
                if (indexes) {
                    indexes.forEach(idx => results.push(`${dayChar}${idx}`));
                }
            } else if (/^\d+$/.test(unit)) {
                results.push(`${dayChar}${parseInt(unit)}`);
            }
        });
    });

    return [...new Set(results)];
}

// ✅ 검색 결과 테이블 렌더링 + 클릭 이벤트
function renderSearchResults(courses) {
    const searchResults = document.getElementById("searchResults");
    searchResults.innerHTML = "";

    courses.forEach(course => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${course.id}</td>
            <td>${course.name}</td>
            <td>${course.credit}</td>
            <td>${course.category}</td>
            <td>${course.professor}</td>
            <td>${course.schedule}</td>
            <td>${course.classroom}</td>
            <td>${course.enrolled_students}</td>
            <td>${course.remarks}</td>
        `;

        row.addEventListener("click", () => {
            const myList = loadLocalStorage("myList") || [];

            // 1️⃣ ID 중복 체크
            if (myList.some(c => c.id === course.id)) {
                alert(`"${course.name}"은 이미 추가된 강의입니다.`);
                return;
            }

            // 1️⃣ 이름 중복 체크
            if (myList.some(c => c.name === course.name)) {
                alert(`"${course.name}"은 이미 추가된 강의입니다.`);
                return;
            }

            // 2️⃣ 시간대 중복 체크 (요일+인덱스)
            const newCourseTimes = parseSchedule(course.schedule);

            const isOverlap = myList.some(existing => {
                const existingTimes = parseSchedule(existing.schedule);
                return existingTimes.some(t => newCourseTimes.includes(t));
            });

            if (isOverlap) {
                alert(`"${course.name}"은 다른 강의와 시간대가 겹칩니다.`);
                return;
            }

            // 3️⃣ 강의 추가
            addToLocalStorage("myList", course);
            alert(`"${course.name}" 강의를 추가했습니다.`);

            // 4️⃣ 시간표 즉시 반영
            renderTimeTable("myList");
            renderOnlineClasses("myList");
        });

        searchResults.appendChild(row);
    });
}

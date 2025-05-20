// static/js/modules/search.js
import { loadLocalStorage, addToLocalStorage } from "./storage.js";

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

// 검색 결과 테이블 렌더링 및 클릭 이벤트
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
            const myList = loadLocalStorage("myList");
            if (myList.some(c => c.id === course.id)) {
                alert(`"${course.name}"은 이미 추가된 강의입니다.`);
                return;
            }
            alert(`"${course.name}" 강의를 추가했습니다.`);
            addToLocalStorage("myList", course);
        });
        searchResults.appendChild(row);
    });
}

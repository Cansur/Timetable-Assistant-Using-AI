import { loadLocalStorage, addToLocalStorage } from "./storage.js";

let category;
let isNP;

/**
 * 검색 키워드 1 표시
 */
export function markField() {
    const fields = ["없음", "일반교양", "한림소양", "전필", "필수"];
    const search_Container1 = document.getElementById("search_Container1");
    const search_Container1_Field = document.getElementById("search_Container1_Field");
    const selectedSearchField = document.getElementById("selectedSearchField");
    const overlay = document.getElementById("overlay");

    // 기존 내용 초기화
    search_Container1_Field.innerHTML = "";

    fields.forEach(field => {
        const row = document.createElement("div");
        row.classList.add("field-row");
        row.innerHTML = `<div class="p-2 border-bottom">${field}</div>`;

        row.addEventListener("mouseover", () => {
            row.style.backgroundColor = "lightgray";
        });

        row.addEventListener("mouseout", () => {
            row.style.backgroundColor = "white";
        });

        row.addEventListener("click", () => {
            if (field !== "없음") {
                category = field;
                selectedSearchField.style.color = "red";
            } else {
                category = undefined;
                selectedSearchField.style.color = "white";
            }

            selectedSearchField.textContent = field;
            search_Container1.style.display = "none";
            overlay.style.display = "none";

            everythingParamsToJson();
        });

        search_Container1_Field.appendChild(row);
    });
}

/**
 * 서버에서 강의 목록 불러오기
 * @param {*} params 
 * @returns 
 */
export async function fetchLectures(params = {}) {
    try {
        const url = new URL("/api/lectures", window.location.origin);

        // params 객체를 URL의 쿼리 파라미터로 추가
        Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

        const response = await fetch(url);
        if (!response.ok) throw new Error("강의 데이터를 불러오는 데 실패했습니다.");

        return await response.json();
    } catch (error) {
        console.error("강의 데이터를 가져오는 중 오류 발생:", error);
        return [];
    }
}

/**
 * 검색창의 모든 키워드 받아서 json으로 변환 후 서버에 전송
 */
export async function everythingParamsToJson() {
    let params = {};
    const selectedSearchName = document.getElementById("selectedSearchName")

    if (typeof category !== "undefined" && category !== null) {
        params.category = category;
    }
    if (typeof isNP !== "undefined" && isNP !== null) {
        if (isNP === "name") {
            params.name = selectedSearchName.textContent;
        } else {
            params.professor = selectedSearchName.textContent;
        }
    }

    console.log(JSON.stringify(params));

    let courses = await fetchLectures(params);
    console.log(courses);
    markLectures(courses);
}

/**
 * 
 * @param {*} value 
 */
export function setIsNP(value){
    isNP = value; 
}

/**
 * 검색창에 강의 목록 표시 
 * @param {*} courses 
 */
function markLectures(courses) {
    const searchResults = document.getElementById("searchResults");
    searchResults.innerHTML = "";

    courses.forEach(course => {
        const row = document.createElement("tr");
        row.type = "button";
        row.innerHTML = `
                <td style="font-size: 12px;">${course.id}</td>
                <td style="font-size: 12px;">${course.name}</td>
                <td style="font-size: 12px;">${course.credit}</td>
                <td style="font-size: 12px;">${course.category}</td>
                <td style="font-size: 12px;">${course.professor}</td>
                <td style="font-size: 12px;">${course.schedule}</td>
                <td style="font-size: 12px;">${course.classroom}</td>
                <td style="font-size: 12px;">${course.enrolled_students}</td>
                <td style="font-size: 12px;">${course.remarks}</td>
            `;

        row.addEventListener("mouseover", () => {
            row.style.backgroundColor = "lightgray";
        });

        row.addEventListener("mouseout", () => {
            row.style.backgroundColor = "white";
        });

        // 행 클릭 이벤트 추가
        // 일단 첫번째 문제: 시간이 겹치는지 검사하는 부분이 작동이 안됨
        // 두번쨰 문제: D, F 이런식으로 시간이 나오는 부분을 어떻게 처리해야할지 모르겠음
        // 세번쨰 문제: 온라인 처리도 해야함
        row.addEventListener("click", () => {
            let myList = loadLocalStorage("myList");

            const existingCourse = myList.find(c => c.id === course.id || c.name === course.name);
            if (existingCourse) {
                alert(`"${course.name}" 는 이미 추가된 강의입니다`);
                return;
            }

            // 📡 온라인 수업은 시간 충돌 검사 없이 바로 통과
            if (!course.schedule.includes("온라인")) {
                const newParsed = parse2Schedule(course.schedule);
                const newSlots = [];
                for (const [day, times] of Object.entries(newParsed)) {
                    times.forEach(period => newSlots.push(`${day}${period}`));
                }

                const isOverlapping = myList.some(existing => {
                    if (existing.schedule.includes("온라인")) return false; // 🔥 온라인 수업끼리도 충돌 없음
                    const existingParsed = parse2Schedule(existing.schedule);
                    for (const [day, times] of Object.entries(existingParsed)) {
                        for (const period of times) {
                            if (newSlots.includes(`${day}${period}`)) {
                                return true;
                            }
                        }
                    }
                    return false;
                });

                if (isOverlapping) {
                    alert(`"${course.name}" 는 기존 강의와 시간이 겹칩니다`);
                    return;
                }
            }

            alert(`"${course.name}" 를 추가하셨습니다`);
            addToLocalStorage("myList", course);
        });

        searchResults.appendChild(row);
    });
}

/**
 * 시간표 변환 함수 **("월1,월2" -> "월": [1, 2])**
 * @param {String} scheduleStr 
 * @returns
 */
function parse2Schedule(scheduleStr) {
    const result = {}; // 결과 객체 초기화
    const items = scheduleStr.split(" "); // 공백으로 분리 (예: ["월1,월2", "화3,화4"])
    for (let item of items) {
        const parts = item.split(","); // 쉼표로 분리 (예: ["월1", "월2"])
        for (let part of parts) {
            const day = part[0]; // 첫 글자(요일) 추출 (예: "월")
            const period = parseInt(part.slice(1)); // 나머지 숫자 추출 (예: 1)
            if (!result[day]) result[day] = []; // 요일 키가 없으면 배열 초기화
            result[day].push(period); // 해당 요일에 교시 추가
        }
    }
    return result; // 결과 반환 (예: { "월": [1, 2], "화": [3, 4] })
}
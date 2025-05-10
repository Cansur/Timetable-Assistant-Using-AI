
document.addEventListener("DOMContentLoaded", function () {

    const main = document.getElementById("main");
    const wrapper = document.getElementById("wrapper");
    const schedule = document.getElementById("schedule");
    const timeTable = document.getElementById("timeTable");

    const searchButton = document.getElementById("searchButton");
    const searchContainer = document.getElementById("searchContainer");
    const closeButton = document.getElementById("closeButton");
    const searchResults = document.getElementById("searchResults");
    const searchInput = document.getElementById("searchInput");


    const search_btn1 = document.getElementById("search_btn1");
    const search_Container1 = document.getElementById("search_Container1");
    const search_Container1_Close = document.getElementById("search_Container1_Close");
    const search_Container1_Field = document.getElementById("search_Container1_Field");

    const search_btn2 = document.getElementById("search_btn2");
    const search_Container2 = document.getElementById("search_Container2");
    const search_Container2_Close = document.getElementById("search_Container2_Close");

    const selectedSearchName = document.getElementById("selectedSearchName");
    const selectedSearchField = document.getElementById("selectedSearchField");

    const tap2 = document.getElementById("tap2");
    const tap2radio1 = document.getElementById("tap2radio1");


    let courses; // 서버에서 받아오는 강의 목록
    let isNP; // 과목명인지 교수명인지 변하는 변수
    let category;

    // ----------------------------------------------------------------------------------------------
    // function
    // ----------------------------------------------------------------------------------------------


    /* 검색창에 강의 목록 표시 */
    function markLectures() {
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
                myList = loadLocalStorage("myList");

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

    /* 검색 키워드 1 표시 */
    function markField() {
        const fields = ["없음", "일반교양", "한림소양", "전필", "필수"];
        const container = document.getElementById("search_Container1_Field");

        // 기존 내용 초기화
        container.innerHTML = "";

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

            container.appendChild(row);
        });
    }

    // 서버에서 강의 목록 불러오기
    async function fetchLectures(params = {}) {
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

    // 검색창의 모든 키워드 받아서 json으로 변환 후 서버에 전송
    async function everythingParamsToJson() {
        let params = {};

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

        courses = await fetchLectures(params);
        console.log(courses);
        markLectures();
        // return params;
    }

    // 로컬 스토리지에서 찾아내기
    function loadLocalStorage(key) {
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

        return JSON.parse(myItem); // JSON 문자열을 객체로 변환하여 반환
    }

    // 로컬 스토리지에 저장하기
    function saveLocalStorage(key, value) {
        if (!key) {
            console.error("올바른 key 값을 입력하세요.");
            return;
        }

        localStorage.setItem(key, JSON.stringify(value));
        console.log(key, "가 저장되었습니다.", value);

        renderTimeTable("myList"); // 시간표 업데이트
        renderOnlineClasses("myList"); // 음음
    }

    // 로컬 스토리지 원하는 key에 데이터 추가하기
    function addToLocalStorage(key, newValue) {
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

        renderTimeTable("myList"); // 시간표 업데이트
        renderOnlineClasses("myList");
    }

    // 처음과 데이터를 추가할 때 마다 시간표에 myList라는 localstroge를 불러와
    // 화면에 나타나게 만드는 함수
    // 이 밑에있는 parseSchedule, renderTimeTable, getRandomColor, getContrastTextColor는 GPT가 작성한 것
    // 나중에 공부해서 이해하기
    function parseSchedule(scheduleStr) {
        const result = {};
        const items = scheduleStr.split(" ");
        for (let item of items) {
            const parts = item.split(",");
            for (let part of parts) {
                const day = part[0];
                const period = parseInt(part.slice(1));
                if (!result[day]) result[day] = [];
                result[day].push(period);
            }
        }

        // 연속 교시 묶기
        for (const day in result) {
            result[day].sort((a, b) => a - b);
            const grouped = [];
            let group = [result[day][0]];
            for (let i = 1; i < result[day].length; i++) {
                const cur = result[day][i];
                const prev = result[day][i - 1];
                if (cur === prev + 1) {
                    group.push(cur);
                } else {
                    grouped.push(group);
                    group = [cur];
                }
            }
            grouped.push(group);
            result[day] = grouped;
        }

        return result;
    }

    function renderTimeTable(key) {
        const container = document.getElementById("timeTable");
        if (!container) {
            console.error("timeTable 요소를 찾을 수 없습니다.");
            return;
        }

        const dayIndex = { 월: 1, 화: 2, 수: 3, 목: 4, 금: 5 };
        const data = JSON.parse(localStorage.getItem(key)) || [];

        // 테이블 초기화
        const rows = container.querySelectorAll("tr");
        rows.forEach((row, i) => {
            if (row.children.length < 6) return;
            for (let j = 1; j <= 5; j++) {
                row.cells[j].innerHTML = "";
                row.cells[j].removeAttribute("rowspan");
                row.cells[j].style = "";
            }
        });

        for (const course of data) {
            // ⛔️ 온라인 수업은 건너뛰기
            if (course.schedule.includes("온라인")) continue;

            const parsed = parseSchedule(course.schedule);
            const bgColor = getRandomColor(course.name);
            const textColor = getContrastTextColor(bgColor);

            for (const [day, blocks] of Object.entries(parsed)) {
                for (const block of blocks) {
                    const start = block[0];
                    const length = block.length;
                    const cell = rows[start - 1].cells[dayIndex[day]];

                    // 셀 병합 및 스타일 적용
                    cell.setAttribute("rowspan", length);
                    cell.style.backgroundColor = bgColor;
                    cell.style.color = textColor;
                    cell.style.textAlign = "left";
                    cell.style.verticalAlign = "top";
                    cell.style.overflow = "hidden";
                    cell.style.textOverflow = "ellipsis";
                    cell.style.whiteSpace = "nowrap";
                    cell.style.position = "relative";
                    cell.style.padding = "4px";
                    cell.style.lineHeight = "1.4";
                    cell.title = course.name;

                    cell.innerHTML = `
                        <div class="cell-content">
                            <div style="font-weight:bold; font-size:0.9em;">${course.name}</div>
                            <div style="font-size:0.75em;">${course.professor}</div>
                            <div style="font-size:0.7em;">${course.classroom}</div>
                        </div>
                        <button class="delete-btn" data-id="${course.id}" title="삭제">✕</button>
                    `;

                    // 아래 셀 제거 (병합 방지)
                    for (let i = 1; i < length; i++) {
                        const targetRow = rows[start - 1 + i];
                        if (targetRow && dayIndex[day] < targetRow.cells.length) {
                            targetRow.deleteCell(dayIndex[day]);
                        }
                    }
                }
            }
        }

        // 삭제 버튼 리스너 추가
        container.querySelectorAll(".delete-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                e.stopPropagation();
                const id = parseInt(e.target.dataset.id);
                if (!confirm("이 수업을 삭제하시겠습니까?")) return;

                const current = JSON.parse(localStorage.getItem(key)) || [];
                const updated = current.filter(c => c.id !== id);
                saveLocalStorage(key, updated); // 저장 + renderTimeTable 재호출

                // window.location.reload(); // 페이지 새로고침
            });
        });
    }

    function getRandomColor(seed) {
        let hash = 0;
        for (let i = 0; i < seed.length; i++) {
            hash = seed.charCodeAt(i) + ((hash << 5) - hash);
        }
        const hue = Math.abs(hash % 360);
        return `hsl(${hue}, 70%, 80%)`;
    }

    function getContrastTextColor(bgColor) {
        const match = bgColor.match(/(\d+)%\)$/);
        if (!match) return 'black';
        const lightness = parseInt(match[1], 10);
        return lightness > 65 ? 'black' : 'white';
    }

    // 뭐가 뭔지 하나도 몰라요~~
    function parse2Schedule(scheduleStr) {
        const result = {};
        const items = scheduleStr.split(" ");
        for (let item of items) {
            const parts = item.split(",");
            for (let part of parts) {
                const day = part[0]; // '월', '화' 등
                const period = parseInt(part.slice(1)); // 숫자 추출
                if (!result[day]) result[day] = [];
                result[day].push(period);
            }
        }
        return result;
    }

    /**
     * 온라인은 따로 윗쪽에다 두는 함수
     * @param {string} key 
     */
    function renderOnlineClasses(key) {
        const list = JSON.parse(localStorage.getItem(key)) || [];
        const onlineCourses = list.filter(course => course.schedule.includes("온라인"));

        // 기존 박스 제거
        const prev = document.getElementById("online-class-box");
        if (prev) prev.remove();
        if (onlineCourses.length === 0) return;

        // 박스 생성
        // const wrapper = document.createElement("div");
        wrapper.id = "online-class-box";
        wrapper.className = "mx-4 mt-2 mb-2 p-2 border rounded bg-light small";

        const title = document.createElement("div");
        title.className = "fw-bold text-muted mb-2";
        title.style.fontSize = "0.9rem";
        title.innerText = "📡 온라인 수업";
        wrapper.appendChild(title);

        onlineCourses.forEach(course => {
            const box = document.createElement("div");
            box.className = "position-relative border bg-white px-2 py-1 mb-1 rounded";

            box.innerHTML = `
            <div class="fw-semibold" style="font-size: 0.85rem;">${course.name} (${course.professor})</div>
            <div style="font-size: 0.75rem;">${course.classroom}</div>
            <button class="btn btn-sm btn-outline-danger position-absolute end-0 top-0 me-1 mt-1 online-delete-btn"
                    data-id="${course.id}" style="display:none; font-size: 0.65rem; padding: 1px 6px;">✕</button>
        `;

            box.addEventListener("mouseenter", () => {
                box.querySelector(".online-delete-btn").style.display = "inline-block";
            });
            box.addEventListener("mouseleave", () => {
                box.querySelector(".online-delete-btn").style.display = "none";
            });

            wrapper.appendChild(box);
        });

        // schedule 위에 삽입
        // const schedule = document.getElementById("schedule");
        // schedule.parentNode.insertBefore(wrapper, schedule);

        // 삭제 핸들링
        wrapper.querySelectorAll(".online-delete-btn").forEach(btn => {
            btn.addEventListener("click", e => {
                e.stopPropagation();
                const id = parseInt(btn.dataset.id);
                if (!confirm("이 수업을 삭제하시겠습니까?")) return;

                const updated = list.filter(c => c.id !== id);
                localStorage.setItem(key, JSON.stringify(updated));
                renderTimeTable(key);
                renderOnlineClasses(key);
            });
        });
    }



    // ----------------------------------------------------------------------------------------------
    // 검색 창 표시
    // ----------------------------------------------------------------------------------------------

    // 메인 검색창 열기
    searchButton.addEventListener("click", async function () {
        // originalHeight = main.offsetHeight + "px"; // 현재 높이를 픽셀 단위로 저장
        searchContainer.style.display = "block";
        main.style.height = "54vh";

        // courses = await fetchLectures(); // 강의 데이터 불러오기
        // markLectures();
        everythingParamsToJson();
    });

    // 메인 검색창 닫기
    closeButton.addEventListener("click", function () {
        searchContainer.style.display = "none";
        // main.style.height = originalHeight; // 원래 높이로 복구
    });

    // 검색창의 검색어
    searchInput.addEventListener("keypress", async function (e) {
        if (e.key === "Enter") {
            searchResults.innerHTML = "";
            const query = searchInput.value.toLowerCase();

            if (tap2radio1.checked) {
                tap2.textContent = "과목명";
                isNP = "name";
            } else {
                tap2.textContent = "교수명";
                isNP = "professor";
            }

            if (query === "") {
                isNP = undefined;
                selectedSearchName.textContent = "없음";
                selectedSearchName.style.color = "white";
            } else {
                selectedSearchName.textContent = query;
                selectedSearchName.style.color = "#E3242B";
            }


            everythingParamsToJson();

            search_Container2.style.display = "none";
            overlay.style.display = "none";
        }
    });

    // 오버레이 생성
    const overlay = document.createElement("div");
    overlay.classList.add("overlay");
    document.body.appendChild(overlay);

    // 검색 버튼1 클릭 시 검색 창 표시
    search_btn1.addEventListener("click", function () {
        search_Container1.style.display = "block";
        markField();
        overlay.style.display = "block";
    });

    // 닫기 버튼1 클릭 시 검색 창 닫기
    search_Container1_Close.addEventListener("click", function () {
        search_Container1.style.display = "none";
        overlay.style.display = "none";
    });

    // 검색 버튼2 클릭 시 검색 창 표시
    search_btn2.addEventListener("click", function () {
        search_Container2.style.display = "block";
        overlay.style.display = "block";
        searchInput.focus();
    });

    // 닫기 버튼2 클릭 시 검색 창 닫기
    search_Container2_Close.addEventListener("click", function () {
        search_Container2.style.display = "none";
        overlay.style.display = "none";
    });

    // 오버레이 클릭 시 검색 창 닫기
    overlay.addEventListener("click", function () {
        search_Container1.style.display = "none";
        search_Container2.style.display = "none";
        overlay.style.display = "none";
    });

    // ----------------------------------------------------------------------------------------------
    // 시작함수
    // ----------------------------------------------------------------------------------------------

    renderTimeTable("myList");
    renderOnlineClasses("myList");

});

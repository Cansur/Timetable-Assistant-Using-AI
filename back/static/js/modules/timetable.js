import { getContrastTextColor, getRandomColor, parseSchedule } from './utils.js'
import { loadLocalStorage, saveLocalStorage } from './storage.js'

/**
 * 
 * @param {*} key 
 * @returns 
 */
export function renderTimeTable(key) {
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

/**
 * 온라인은 따로 윗쪽에다 두는 함수
 * @param {string} key 
 */
export function renderOnlineClasses(key) {
    const list = JSON.parse(localStorage.getItem(key)) || [];
    const onlineCourses = list.filter(course => course.schedule.includes("온라인"));

    // 기존 wrapper 제거
    const prev = document.getElementById("wrapper");
    if (prev) prev.remove();
    if (onlineCourses.length === 0) return;

    // wrapper 동적 생성
    const wrapper = document.createElement("div");
    wrapper.id = "wrapper"; // 안전하게 ID 설정
    wrapper.className = "mx-4 mt-2 mb-2 p-2 border rounded bg-light small";

    // 타이틀 추가
    const title = document.createElement("div");
    title.className = "fw-bold text-muted mb-2";
    title.style.fontSize = "0.9rem";
    title.innerText = "📡 온라인 수업";
    wrapper.appendChild(title);

    // 온라인 강의 렌더링
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

    // schedule 요소 앞에 삽입
    const schedule = document.getElementById("schedule");
    if (schedule && schedule.parentNode) {
        schedule.parentNode.insertBefore(wrapper, schedule);
    } else {
        console.error("schedule 요소를 찾을 수 없습니다. wrapper를 body에 추가합니다.");
        document.body.appendChild(wrapper); // 대체 삽입
    }

    // 삭제 버튼 이벤트
    wrapper.querySelectorAll(".online-delete-btn").forEach(btn => {
        btn.addEventListener("click", e => {
            e.stopPropagation();
            const id = parseInt(btn.dataset.id);
            if (!confirm("이 수업을 삭제하시겠습니까?")) return;

            const updated = list.filter(c => c.id !== id);
            localStorage.setItem(key, JSON.stringify(updated));
            renderTimeTable(key); // renderTimeTable이 정의되어 있는지 확인
            renderOnlineClasses(key);
        });
    });
}
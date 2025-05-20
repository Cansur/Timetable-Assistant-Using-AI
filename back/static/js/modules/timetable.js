import { getContrastTextColor, getRandomColor, parseSchedule } from './utils.js';
import { loadLocalStorage, saveLocalStorage } from './storage.js';

export function renderTimeTable(key) {
    const container = document.getElementById("timeTable");
    const data = loadLocalStorage(key);
    const dayIndex = { 월: 1, 화: 2, 수: 3, 목: 4, 금: 5 };
    const rows = container.querySelectorAll("tr");

    // 초기화
    rows.forEach(row => {
        for (let i = 1; i <= 5; i++) {
            row.cells[i].innerHTML = "";
            row.cells[i].removeAttribute("rowspan");
            row.cells[i].style = "";
        }
    });

    data.forEach(course => {
        if (course.schedule.includes("온라인")) return;
        const parsed = parseSchedule(course.schedule);
        const bg = getRandomColor(course.name);
        const text = getContrastTextColor(bg);

        for (const [day, blocks] of Object.entries(parsed)) {
            const colIndex = dayIndex[day];
            if (colIndex === undefined) {
                console.warn("⛔️ 잘못된 요일:", day);
                continue;
            }

            for (const block of blocks) {
                const start = block[0];
                const len = block.length;

                const row = rows[start - 1];
                if (!row || !row.cells[colIndex]) {
                    console.warn("⛔️ 잘못된 셀 접근:", day, start, course.name);
                    continue;
                }

                const cell = row.cells[colIndex];
                cell.setAttribute("rowspan", len);
                cell.style.backgroundColor = bgColor;
                cell.style.color = textColor;
                cell.innerHTML = `
                    <div><strong>${course.name}</strong><br>
                    ${course.professor}<br>
                    ${course.classroom}</div>
                    <button class="delete-btn" data-id="${course.id}">✕</button>
                `;

                // 셀 병합 시 하단 셀 제거
                for (let i = 1; i < len; i++) {
                    const delRow = rows[start - 1 + i];
                    if (delRow && delRow.cells[colIndex]) {
                        delRow.deleteCell(colIndex);
                    }
                }
            }
        }

    });

    container.querySelectorAll(".delete-btn").forEach(btn => {
        btn.addEventListener("click", e => {
            e.stopPropagation();
            const id = parseInt(btn.dataset.id);
            const updated = data.filter(c => c.id !== id);
            saveLocalStorage(key, updated);
            renderTimeTable(key);
        });
    });
}

export function renderOnlineClasses(key) {
    const wrapper = document.getElementById("wrapper");
    const list = loadLocalStorage(key);
    const onlineCourses = list.filter(c => c.schedule.includes("온라인"));

    wrapper.innerHTML = "";
    if (!onlineCourses.length) return;

    const title = document.createElement("div");
    title.textContent = "📡 온라인 수업";
    title.className = "fw-bold text-muted mb-2";
    wrapper.appendChild(title);

    onlineCourses.forEach(course => {
        const box = document.createElement("div");
        box.className = "border bg-white px-2 py-1 mb-1 rounded";
        box.innerHTML = `
            <div><strong>${course.name}</strong> (${course.professor})</div>
            <div>${course.classroom}</div>
            <button class="online-delete-btn" data-id="${course.id}">삭제</button>
        `;
        box.querySelector(".online-delete-btn").addEventListener("click", () => {
            const updated = list.filter(c => c.id !== course.id);
            saveLocalStorage(key, updated);
            renderTimeTable(key);
            renderOnlineClasses(key);
        });
        wrapper.appendChild(box);
    });
}

// static/js/modules/titmetable.js
import { getContrastTextColor, getRandomColor, parseSchedule } from './utils.js';

export function renderTimeTable(key) {
    const data = JSON.parse(localStorage.getItem(key) || "[]");
    const tbody = document.querySelector("#timeTable tbody");
    const rows = tbody.querySelectorAll("tr");
    const dayIndex = { 월: 1, 화: 2, 수: 3, 목: 4, 금: 5 };

    // 초기화
    rows.forEach(row => {
        for (let i = 1; i <= 5; i++) {
            const cell = row.cells[i];
            if (cell) {
                if (cell.hasAttribute("rowspan")) continue; // 병합된 셀은 유지
                cell.innerHTML = "";
                cell.removeAttribute("rowspan");
                cell.style = "";
            }
        }
    });

    for (const course of data) {
        if (!course.schedule || course.schedule.includes("온라인")) continue;

        const parsed = parseSchedule(course.schedule);
        const bg = getRandomColor(course.name);
        const fg = getContrastTextColor(bg);

        console.log("Parsed schedule", parsed);

        for (const [day, blocks] of Object.entries(parsed)) {
            const col = dayIndex[day];
            if (col === undefined) continue;

            for (const [startBlock, blockLength] of blocks) {
                const baseRow = rows[startBlock];
                if (!baseRow || !baseRow.cells[col]) continue;

                const cell = baseRow.cells[col];
                cell.setAttribute("rowspan", blockLength);
                cell.style.backgroundColor = bg;
                cell.style.color = fg;
                cell.innerHTML = `
                    <div class="course-wrapper">
                        <div class="course-cell">
                            <strong>${course.name}</strong><br>${course.classroom}
                        </div>
                        <button class="delete-btn" data-id="${course.id}">✕</button>
                    </div>
                `;

                for (let i = 1; i < blockLength; i++) {
                    const delRow = rows[startBlock + i];
                    if (delRow && delRow.cells[col]) {
                        delRow.deleteCell(col);
                    }
                }
            }
        }
    }

    document.querySelectorAll(".delete-btn").forEach(btn => {
        btn.addEventListener("click", e => {
            e.stopPropagation();
            const id = parseInt(btn.dataset.id);
            const updated = data.filter(c => c.id !== id);
            localStorage.setItem(key, JSON.stringify(updated));
            renderTimeTable(key);
            renderOnlineClasses(key);
        });
    });
}

export function renderOnlineClasses(key) {
    const wrapper = document.getElementById("wrapper");
    const data = JSON.parse(localStorage.getItem(key) || "[]");
    const onlineCourses = data.filter(course => course.schedule.includes("온라인"));

    wrapper.innerHTML = "";

    if (!onlineCourses.length) return;

    const title = document.createElement("div");
    title.className = "online-title";
    title.textContent = "📡 온라인 수업";
    wrapper.appendChild(title);

    for (const course of onlineCourses) {
        const box = document.createElement("div");
        box.className = "online-course-box";

        const left = document.createElement("div");
        left.className = "left";
        left.innerHTML = `
            <strong>${course.name}</strong>
            <span>${course.professor} 교수 | ${course.classroom}</span>
        `;

        const btn = document.createElement("button");
        btn.className = "online-delete-btn";
        btn.textContent = "삭제";
        btn.onclick = () => {
            const updated = data.filter(c => c.id !== course.id);
            localStorage.setItem(key, JSON.stringify(updated));
            renderTimeTable(key);
            renderOnlineClasses(key);
        };

        box.appendChild(left);
        box.appendChild(btn);
        wrapper.appendChild(box);
    }
}


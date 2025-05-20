import { getContrastTextColor, getRandomColor, parseSchedule } from './utils.js';

export function renderTimeTable(key) {
  const data = JSON.parse(localStorage.getItem(key) || "[]");
  const tbody = document.querySelector("#timeTable tbody");
  const rows = tbody.querySelectorAll("tr");
  const dayIndex = { 월: 1, 화: 2, 수: 3, 목: 4, 금: 5 };

  // 초기화: 모든 셀 초기화
  rows.forEach(row => {
    for (let i = 1; i <= 5; i++) {
      const cell = row.cells[i];
      if (!cell) {
        const filler = document.createElement("td");
        row.appendChild(filler);
      } else {
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

    for (const [day, blocks] of Object.entries(parsed)) {
      const col = dayIndex[day];
      if (col === undefined) continue;

      for (const block of blocks) {
        const start = block[0];
        const len = block.length;

        const baseRow = rows[start - 1];
        if (!baseRow || !baseRow.cells[col]) continue;

        const cell = baseRow.cells[col];
        cell.setAttribute("rowspan", len);
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

        // 아래 셀 정확히 삭제
        for (let i = 1; i < len; i++) {
          const delRow = rows[start - 1 + i];
          if (delRow) {
            let count = 0;
            for (let j = 0; j < delRow.cells.length; j++) {
              const cell = delRow.cells[j];
              if (cell && j === col) {
                delRow.deleteCell(j);
                break;
              }
            }
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


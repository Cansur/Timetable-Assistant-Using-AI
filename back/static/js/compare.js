document.addEventListener("DOMContentLoaded", () => {
  const overlay = document.getElementById("overlay");
  const modal = document.getElementById("searchContainer");
  const openBtn1 = document.getElementById("addCourseBtn1");
  const openBtn2 = document.getElementById("addCourseBtn2");
  const closeBtn = document.getElementById("closeButton");
  const tableBody = document.getElementById("courseTableBody");

  let activeTableId = null;

  const dayMap = { "월": 1, "화": 2, "수": 3, "목": 4, "금": 5 };

  function openModal(tableId) {
    activeTableId = tableId;
    overlay.style.display = "block";
    modal.style.display = "block";
    loadCourses();
  }

  function closeModal() {
    overlay.style.display = "none";
    modal.style.display = "none";
  }

  async function loadCourses() {
    tableBody.innerHTML = "";
    try {
      const res = await fetch("/static/data/lectureList_fixed.json");
      const data = await res.json();

      data.forEach(course => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${course["과목명"]}</td>
          <td>${course["구분"]}</td>
          <td>${course["교수"]}</td>
          <td>${course["시간"]}</td>
        `;

        row.addEventListener("click", () => {
          insertCourse(course["과목명"], course["시간"]);
          closeModal();
        });

        tableBody.appendChild(row);
      });
    } catch (err) {
      console.error("수업 목록 로딩 오류:", err);
    }
  }

  function insertCourse(subject, timeString) {
    const table = document.getElementById(activeTableId);
    if (!table) return;

    timeString.split(/[\s,]+/).forEach(slot => {
      const day = slot[0];
      const period = parseInt(slot.slice(1));
      const col = dayMap[day];

      if (!isNaN(col) && table.rows[period] && table.rows[period].cells[col]) {
        table.rows[period].cells[col].innerText = subject;
        table.rows[period].cells[col].style.backgroundColor = "#cde3f9";
      }
    });
  }

  openBtn1.addEventListener("click", () => openModal("table1"));
  openBtn2.addEventListener("click", () => openModal("table2"));
  closeBtn.addEventListener("click", closeModal);
  overlay.addEventListener("click", closeModal);
});

document.addEventListener("DOMContentLoaded", function () {

    const schedule = document.getElementById("schedule");

    const searchButton = document.getElementById("searchButton");
    const searchContainer = document.getElementById("searchContainer");
    const closeButton = document.getElementById("closeButton");
    const searchResults = document.getElementById("searchResults");
    const searchInput = document.getElementById("searchInput");

    const searchContainerInputButton = document.getElementById("searchContainerInputButton");
    const searchContainerInputWindow = document.getElementById("searchContainerInputWindow");
    const searchContainerInputCloseButton = document.getElementById("searchContainerInputCloseButton");

    const selectedSearchName = document.getElementById("selectedSearchName");

    // 검색창 열기
    searchButton.addEventListener("click", function () {
        originalHeight = schedule.offsetHeight + "px"; // 현재 높이를 픽셀 단위로 저장
        searchContainer.style.display = "block";
        schedule.style.height = "48vh";
        fetchLectures(); // 강의 데이터 불러오기
    });

    // 검색창 닫기
    closeButton.addEventListener("click", function () {
        searchContainer.style.display = "none";
        schedule.style.height = originalHeight; // 원래 높이로 복구
    });

    // 서버에서 강의 목록 불러오기
    async function fetchLectures() {
        try {
            const response = await fetch("/api/lectures");
            const courses = await response.json();
            return courses;
        } catch (error) {
            console.error("강의 데이터를 가져오는 중 오류 발생:", error);
            return [];
        }
    }

    // 검색창에 강의 목록 표시
    searchInput.addEventListener("keypress", async function (e) {
        if (e.key === "Enter") {
            searchResults.innerHTML = "";
            const query = searchInput.value.toLowerCase();
            selectedSearchName.textContent = query;
            selectedSearchName.style.color = "#E3242B";
            const courses = await fetchLectures();
            const filteredCourses = courses.filter(course => course.name.toLowerCase().includes(query));

            filteredCourses.forEach(course => {
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
                row.addEventListener("click", () => {
                    alert(`선택한 강의: ${course.name} (${course.id})`);
                    console.log("선택한 강의 데이터:", course);
                });

                searchResults.appendChild(row);
            });



            searchContainerInputWindow.style.display = "none";
            overlay.style.display = "none";
        }
    });

    // ----------------------------------------------------------------------------------------------
    // 검색 창 표시
    // ----------------------------------------------------------------------------------------------

    // 오버레이 생성
    const overlay = document.createElement("div");
    overlay.classList.add("overlay");
    document.body.appendChild(overlay);

    // 검색 버튼 클릭 시 검색 창 표시
    searchContainerInputButton.addEventListener("click", function () {
        searchContainerInputWindow.style.display = "block";
        overlay.style.display = "block";
        searchInput.focus();
    });

    // 닫기 버튼 클릭 시 검색 창 닫기
    searchContainerInputCloseButton.addEventListener("click", function () {
        searchContainerInputWindow.style.display = "none";
        overlay.style.display = "none";
    });

    // 오버레이 클릭 시 검색 창 닫기
    overlay.addEventListener("click", function () {
        searchContainerInputWindow.style.display = "none";
        overlay.style.display = "none";
    });
});

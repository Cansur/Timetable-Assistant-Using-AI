document.addEventListener("DOMContentLoaded", function () {
    const searchButton = document.getElementById("searchButton");
    const searchContainer = document.getElementById("searchContainer");
    const closeButton = document.getElementById("closeButton");
    const searchResults = document.getElementById("searchResults");
    const searchInput = document.getElementById("searchInput");

    // 검색창 열기
    searchButton.addEventListener("click", function () {
        searchContainer.style.display = "block";
        fetchLectures(); // 강의 데이터 불러오기
    });

    // 검색창 닫기
    closeButton.addEventListener("click", function () {
        searchContainer.style.display = "none";
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

    // 검색 기능 구현
    async function filterCourses() {
        const query = searchInput.value.toLowerCase();
        searchResults.innerHTML = "";
        const courses = await fetchLectures();
        const filteredCourses = courses.filter(course => course.name.toLowerCase().includes(query));

        filteredCourses.forEach(course => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${course.id}</td>
                <td>${course.name}</td>
                <td>${course.credit}</td>
                <td>${course.category}</td>
                <td>${course.professor}</td>
                <td>${course.time}</td>
                <td>${course.room}</td>
                <td>${course.students}</td>
                <td>${course.remark}</td>
            `;
            searchResults.appendChild(row);
        });
    }

    // 검색 입력 이벤트 리스너 추가
    searchInput.addEventListener("input", filterCourses);
});

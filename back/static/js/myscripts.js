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

    const tap2 = document.getElementById("tap2");
    const tap2radio1 = document.getElementById("tap2radio1");


    let courses;

    // 검색창 열기
    searchButton.addEventListener("click", async function () {
        originalHeight = schedule.offsetHeight + "px"; // 현재 높이를 픽셀 단위로 저장
        searchContainer.style.display = "block";
        schedule.style.height = "48vh";

        courses = await fetchLectures(); // 강의 데이터 불러오기
        markLectures();
    });

    // 검색창 닫기
    closeButton.addEventListener("click", function () {
        searchContainer.style.display = "none";
        schedule.style.height = originalHeight; // 원래 높이로 복구
    });

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
    

    // 검색창의 검색어
    searchInput.addEventListener("keypress", async function (e) {
        if (e.key === "Enter") {
            searchResults.innerHTML = "";
            const query = searchInput.value.toLowerCase();
            let isNP;

            if(tap2radio1.checked){
                tap2.textContent = "과목명";
                isNP = "name";
            } else {
                tap2.textContent = "교수명";
                isNP = "professor";
            }

            selectedSearchName.textContent = query;
            selectedSearchName.style.color = "#E3242B";

            courses = await fetchLectures({ [isNP] : selectedSearchName.textContent });
            // const filteredCourses = courses.filter(course => course.name.toLowerCase().includes(query));

            markLectures();

            searchContainerInputWindow.style.display = "none";
            overlay.style.display = "none";
        }
    });

    /* 검색창에 강의 목록 표시 */
    function markLectures() {
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
            row.addEventListener("click", () => {
                alert(`선택한 강의: ${course.name} (${course.id})`);
                console.log("선택한 강의 데이터:", course);
            });

            searchResults.appendChild(row);
        });
    }

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

document.addEventListener("DOMContentLoaded", function () {

    const schedule = document.getElementById("schedule");

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
            row.addEventListener("click", () => {
                alert(`선택한 강의: ${course.name} (${course.id})`);
                console.log("선택한 강의 데이터:", course);
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



    // ----------------------------------------------------------------------------------------------
    // 검색 창 표시
    // ----------------------------------------------------------------------------------------------

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
});

import { markField, fetchLectures, everythingParamsToJson, setIsNP } from './modules/search.js'
import { renderOnlineClasses, renderTimeTable } from './modules/timetable.js';

document.addEventListener("DOMContentLoaded", function () {

    const main = document.getElementById("main");
    // const wrapper = document.getElementById("wrapper");
    // const schedule = document.getElementById("schedule");
    // const timeTable = document.getElementById("timeTable");
    const searchButton = document.getElementById("searchButton");
    const searchContainer = document.getElementById("searchContainer");
    const closeButton = document.getElementById("closeButton");
    const searchResults = document.getElementById("searchResults");
    const searchInput = document.getElementById("searchInput");

    const search_btn1 = document.getElementById("search_btn1");
    const search_Container1 = document.getElementById("search_Container1");
    const search_Container1_Close = document.getElementById("search_Container1_Close");
    // const search_Container1_Field = document.getElementById("search_Container1_Field");

    const search_btn2 = document.getElementById("search_btn2");
    const search_Container2 = document.getElementById("search_Container2");
    const search_Container2_Close = document.getElementById("search_Container2_Close");

    const selectedSearchName = document.getElementById("selectedSearchName");
    // const selectedSearchField = document.getElementById("selectedSearchField");

    const tap2 = document.getElementById("tap2");
    const tap2radio1 = document.getElementById("tap2radio1");

    let isNP; // 과목명인지 교수명인지 변하는 변수



    // ----------------------------------------------------------------------------------------------
    // init
    // ----------------------------------------------------------------------------------------------

    // 메인 검색창 열기
    searchButton.addEventListener("click", async function () {
        searchContainer.style.display = "block";
        main.style.height = "54vh";
        everythingParamsToJson();
    });

    // 메인 검색창 닫기
    closeButton.addEventListener("click", function () {
        searchContainer.style.display = "none";
        main.style.height = "100vh"; // 원래 높이로 복구
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

            setIsNP(isNP);
            everythingParamsToJson();

            search_Container2.style.display = "none";
            overlay.style.display = "none";
        }
    });

    // 오버레이 생성
    const overlay = document.createElement("div");
    overlay.id = "overlay"
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

    renderTimeTable("myList");
    renderOnlineClasses("myList");

});

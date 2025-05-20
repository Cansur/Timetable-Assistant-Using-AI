// mainIndex.js
import { everythingParamsToJson, setIsNP } from './modules/search.js';
import { renderTimeTable, renderOnlineClasses } from './modules/timetable.js';

document.addEventListener("DOMContentLoaded", () => {
    const addCourseBtn = document.getElementById("addCourseBtn");
    const searchContainer = document.getElementById("searchContainer");
    const overlay = document.getElementById("overlay");
    const closeButton = document.getElementById("closeButton");
    const searchInput = document.getElementById("searchInput");
    const selectedSearchName = document.getElementById("selectedSearchName");
    const selectedSearchField = document.getElementById("selectedSearchField");
    const radioName = document.getElementById("radioName");

    initTimeTableStructure();

    // 메인 검색 모달 열기
    addCourseBtn.addEventListener("click", () => {
        searchContainer.style.display = "block";
        overlay.style.display = "block";
        everythingParamsToJson();
    });

    // 모달 닫기
    const closeModal = () => {
        searchContainer.style.display = "none";
        overlay.style.display = "none";
    };
    closeButton.addEventListener("click", closeModal);
    overlay.addEventListener("click", closeModal);

    // 필터 바 → 검색어 입력 모달 열기
    // 검색어 입력 필터 클릭 시 → 모달 열기 및 안전한 키 이벤트 바인딩
    document.querySelector('[data-filter="search"]').addEventListener("click", (e) => {
        const button = e.currentTarget;
        showFilterPopup(button, [], (typed) => {
            button.textContent = `검색어: ${typed}`;
            document.getElementById("selectedSearchName").textContent = typed;
            document.getElementById("selectedSearchName").style.color = "#E3242B";

            setIsNP("name"); // 기본은 과목명
            everythingParamsToJson();
        }, true);
    });

    // 검색어 모달에서 Enter로도 적용되도록
    document.getElementById("searchKeywordInput").addEventListener("keypress", (e) => {
        if (e.key === "Enter") applySearchKeyword();
    });

    // 카테고리 필터 클릭 → 전공/영역 모달 열기
    document.querySelector('[data-filter="major"]').addEventListener("click", (e) => {
        const options = ["없음", "전공", "일반교양", "한림소양"];
        const button = e.currentTarget;

        showFilterPopup(button, options, (selected) => {
            // 버튼 텍스트 변경
            button.textContent = `전공/영역: ${selected}`;

            // 내부 상태에 반영
            document.getElementById("selectedSearchField").textContent = selected;
            document.getElementById("selectedSearchField").style.color = selected === "없음" ? "white" : "red";
            window.category = selected === "없음" ? undefined : selected;

            // 다시 검색 실행
            everythingParamsToJson();
        });
    });



    const saved = localStorage.getItem("myList");
    if (saved && saved !== "[]") {
        renderTimeTable("myList");
        renderOnlineClasses("myList");
    }


});

// ✅ 검색어 모달에서 "적용" 버튼 또는 Enter 눌렀을 때 호출됨
window.applySearchKeyword = function () {
    const keywordInput = document.getElementById("searchKeywordInput");
    const keyword = keywordInput.value.trim();
    const mode = document.getElementById("radioName").checked ? "name" : "professor";

    if (!keyword) {
        alert("검색어를 입력하세요.");
        return;
    }

    document.getElementById("selectedSearchName").textContent = keyword;
    document.getElementById("selectedSearchName").style.color = "#E3242B";

    setIsNP(mode);
    window.category = document.getElementById("selectedSearchField").textContent;

    everythingParamsToJson();

    document.getElementById("searchKeywordModal").style.display = "none";
};

function initTimeTableStructure() {
    const tbody = document.querySelector("#timeTable tbody");
    tbody.innerHTML = ""; // 전체 제거

    for (let i = 0; i < 22; i++) {
        const tr = document.createElement("tr");

        // 왼쪽 교시 열 항상 생성
        const td = document.createElement("td");

        // 홀수 번째 줄에는 label (1교시, 2교시...), 짝수 줄엔 빈칸
        if (i % 2 === 0) {
            const period = i / 2 + 1;
            td.textContent = `${period}교시`;
        }

        td.classList.add("period-cell");
        tr.appendChild(td);

        // 월~금 열 5개
        for (let j = 0; j < 5; j++) {
            const td = document.createElement("td");
            tr.appendChild(td);
        }

        tbody.appendChild(tr);
    }

    // ✅ tbody에 이벤트 위임
    tbody.addEventListener("click", (e) => {
        if (e.target.classList.contains("delete-btn")) {
            e.stopPropagation();
            const id = parseInt(e.target.dataset.id);
            const data = loadLocalStorage(key);
            const updated = data.filter(c => c.id !== id);
            saveLocalStorage(key, updated);

            renderTimeTable(key);
            renderOnlineClasses(key);
        }
    });
}

// ✅ 필터 팝업 생성 함수
function showFilterPopup(targetBtn, options, onSelect, withInput = false) {
    // 기존 팝업 제거
    const existing = document.querySelector(".filter-popup");
    if (existing) existing.remove();

    const popup = document.createElement("div");
    popup.classList.add("filter-popup");

    if (withInput) {
        const input = document.createElement("input");
        input.placeholder = "검색어를 입력하세요";
        input.style.width = "100%";
        input.style.padding = "6px";
        input.style.marginBottom = "8px";
        input.style.border = "1px solid #ccc";
        input.style.borderRadius = "6px";

        const confirm = document.createElement("div");
        confirm.textContent = "적용";
        confirm.style.background = "#5e5eff";
        confirm.style.color = "#fff";
        confirm.style.textAlign = "center";
        confirm.style.padding = "6px";
        confirm.style.borderRadius = "6px";
        confirm.style.cursor = "pointer";
        confirm.onclick = () => {
            const val = input.value.trim();
            if (val) {
                onSelect(val);
                popup.remove();
            }
        };

        popup.appendChild(input);
        popup.appendChild(confirm);
    } else {
        options.forEach(opt => {
            const item = document.createElement("div");
            item.textContent = opt;
            item.onclick = () => {
                onSelect(opt);
                popup.remove();
            };
            popup.appendChild(item);
        });
    }

    const closeBtn = document.createElement("div");
    closeBtn.className = "filter-close-btn";
    closeBtn.innerHTML = "✕";
    closeBtn.onclick = () => popup.remove();
    popup.appendChild(closeBtn);

    // 위치 설정
    const rect = targetBtn.getBoundingClientRect();
    popup.style.top = `${rect.bottom + window.scrollY + 6}px`;
    popup.style.left = `${rect.left + window.scrollX}px`;

    document.body.appendChild(popup);

    // 외부 클릭 시 제거
    setTimeout(() => {
        document.addEventListener("click", function closePopupOutside(e) {
            if (!popup.contains(e.target) && e.target !== targetBtn) {
                popup.remove();
                document.removeEventListener("click", closePopupOutside);
            }
        });
    }, 0);
}
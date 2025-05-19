import { saveLocalStorage } from './modules/storage.js';

document.addEventListener("DOMContentLoaded", function () {
    // 오류 해결용
    document.addEventListener('hide.bs.modal', function (event) {
        if (document.activeElement) {
            document.activeElement.blur();
        }
    });

    // Bootstrap 모달 인스턴스 생성
    const modalElement = document.getElementById('lectureModal');
    const modalInstance = new bootstrap.Modal(modalElement);

    const chatDisplay = document.getElementById('chatDisplay');
    const scrollToBottomBtn = document.getElementById('scrollToBottom');
    const style = document.createElement('style');

    // 예시 데이터
    const lectures = [
        { 과목명: '대학생을위한실용금융', 교수: '민봉기', 구분: '일반교양', 시간: '화3,화4' },
        { 과목명: '사랑과법', 교수: '윤효영', 구분: '일반교양', 시간: '온라인1,온라인2' },
        { 과목명: '문학의이해', 교수: '김양선', 구분: '일반교양', 시간: '월7,월8 수7' }
    ];
    const feedbackLog = []; // 피드백 기록용
    let lecturesb = [];

    // initialize chat
    document.getElementById('sendMessage').addEventListener('click', sendMessage);
    document.getElementById('chatInput').addEventListener('keypress', function (e) { if (e.key === 'Enter') sendMessage(); });

    chatDisplay.addEventListener('scroll', () => {
        const isAtBottom = chatDisplay.scrollTop + chatDisplay.clientHeight >= chatDisplay.scrollHeight - 10;
        scrollToBottomBtn.classList.toggle('hidden', isAtBottom);
    });

    scrollToBottomBtn.addEventListener('click', () => {
        chatDisplay.lastElementChild?.scrollIntoView({ behavior: 'smooth' });
    });

    // "예" 버튼 클릭
    document.getElementById('confirmYes').addEventListener('click', function () {
        console.log("✅ 저장 처리 실행");  // 여기에 저장 로직 연결
        window.location.href = '/';
        setMyList(lectures);
        modalInstance.hide();
    });

    // "아니오" 버튼 클릭
    document.getElementById('confirmNo').addEventListener('click', function () {
        modalInstance.hide();
    });

    // 애니메이션 스타일 추가
    style.innerHTML = `
        @keyframes slide-up {
            from { opacity: 0; transform: translateY(15px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up {
            animation: slide-up 0.3s ease-out;
        }
    `;
    document.head.appendChild(style);

    //----------------------------------------------------------------

    // 강의 시간표 미리보기 모달
    const timeSlots = ['1교시', '2교시', '3교시', '4교시', '5교시', '6교시', '7교시', '8교시'];
    const weekdays = ['월', '화', '수', '목', '금'];
    const timeMap = { '1': 0, '2': 1, '3': 2, '4': 3, '5': 4, '6': 5, '7': 6, '8': 7, '9': 8, 'A': 2, 'B': 3, 'C': 4, 'D': 5, 'E': 6, 'F': 7 };

    const colorPalette = ['#e3f2fd', '#fce4ec', '#f3e5f5', '#e8f5e9', '#fffde7'];

    // 예시로 사용
    // openLectureModal(lectures);

    function buildTimetable(lectures) {
        const tbody = document.getElementById('timetable-body');
        tbody.innerHTML = '';
        for (let i = 0; i < timeSlots.length; i++) {
            const row = document.createElement('tr');
            row.innerHTML = `<th class="bg-light text-dark">${timeSlots[i]}</th>` +
                weekdays.map(() => `<td style="height: 28px;"></td>`).join('');
            tbody.appendChild(row);
        }

        const subjectColorMap = {};
        let colorIndex = 0;

        lectures.forEach(lec => {
            const key = lec.과목명;
            if (!subjectColorMap[key]) {
                subjectColorMap[key] = colorPalette[colorIndex % colorPalette.length];
                colorIndex++;
            }

            const blocks = lec.시간.split(/[\s,]+/);
            blocks.forEach(block => {
                const dayChar = block[0];
                const timeChar = block.slice(1);
                const dayIdx = weekdays.indexOf(dayChar);
                const timeIdx = timeMap[timeChar];

                if (dayIdx !== -1 && timeIdx !== undefined && timeIdx < timeSlots.length) {
                    const cell = tbody.children[timeIdx]?.children[dayIdx + 1];
                    if (cell) {
                        cell.style.backgroundColor = subjectColorMap[key];
                        cell.innerHTML = '';
                    }
                }
            });
        });
    }

    function openLectureModal(lectures) {
        buildTimetable(lectures);
        document.activeElement.blur(); // 현재 포커스 해제
        setTimeout(() => {
            modalInstance.show();
        }, 10);
    }

    /** 강의 데이터 변환 */
    function transformLectures(lectures) {
        return lectures.map(lecture => ({
            name: lecture.과목명,
            professor: lecture.교수,
            category: lecture.구분,
            schedule: lecture.시간
        }));
    }

    /** local myList에 저장 */
    function setMyList(lectures) {
        // 변환
        const newLectures = transformLectures(lectures);
        saveLocalStorage('myList', newLectures);
    }

    async function sendMessage() {
        const input = document.getElementById('chatInput');
        const message = input.value.trim();
        if (!message) return;

        // 사용자 메시지 UI 추가
        const userMessage = document.createElement('div');
        userMessage.className = 'flex justify-end animate-slide-up';
        userMessage.innerHTML = `
            <div class="max-w-[70%] bg-blue-400 text-white p-3 rounded-xl shadow-md border border-gray-500 text-sm" style="font-family: 'Inter', sans-serif;">
                ${message}
            </div>
        `;
        chatDisplay.appendChild(userMessage);
        userMessage.scrollIntoView({ behavior: 'smooth' });

        // 입력 비우기
        input.value = '';

        try {
            // 서버에 메시지 전송
            const res = await fetch('/api/recommend', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ input: message, feedbackLog })
            });

            const data = await res.json();
            lecturesb = data
            console.log(data);

            const aiMessage = document.createElement('div');
            aiMessage.className = 'flex justify-start animate-slide-up';
            if (res.ok) {
                const replyText = data.reply;

                // 🟦 말풍선 생성
                const messageBubble = document.createElement("div");
                messageBubble.className = "max-w-[70%] bg-gray-600 text-white p-3 rounded-xl shadow-md border border-gray-500 text-sm whitespace-pre-wrap";
                messageBubble.style.fontFamily = "'Inter', sans-serif";
                messageBubble.innerText = replyText;

                // 🟨 버튼 생성 (왼쪽 정렬)
                const lectureButtonWrapper = document.createElement("div");
                lectureButtonWrapper.className = "mt-2 flex justify-start";  // 왼쪽 정렬

                const lectureButton = document.createElement("button");
                lectureButton.innerText = "시간표 연동하기";
                lectureButton.className = `
                    bg-blue-500 hover:bg-blue-600 text-white 
                    text-xs font-semibold py-1 px-3 
                    rounded-full shadow transition duration-200
                `;

                // 👉 클릭 이벤트
                lectureButton.addEventListener("click", () => {
                    openLectureModal(lectures);
                });

                lectureButtonWrapper.appendChild(lectureButton);

                // 🧩 전체 묶음
                const aiMessageWrapper = document.createElement("div");
                aiMessageWrapper.className = "flex flex-col items-start space-y-1";

                aiMessageWrapper.appendChild(messageBubble);
                aiMessageWrapper.appendChild(lectureButtonWrapper);

                aiMessage.appendChild(aiMessageWrapper);
            }
            else {
                aiMessage.innerHTML = `
                    <div class="max-w-[70%] bg-red-600 text-white p-3 rounded-xl shadow-md border border-gray-500 text-sm" style="font-family: 'Inter', sans-serif;">
                        ⚠️ 오류: ${data.error || '알 수 없는 오류'}
                    </div>
                `;
            }

            chatDisplay.appendChild(aiMessage);
            aiMessage.scrollIntoView({ behavior: 'smooth' });
            scrollToBottomBtn.classList.add('hidden');
        } catch (error) {
            const errorMessage = document.createElement('div');
            errorMessage.className = 'flex justify-start animate-slide-up';
            errorMessage.innerHTML = `
                <div class="max-w-[70%] bg-red-600 text-white p-3 rounded-xl shadow-md border border-gray-500 text-sm" style="font-family: 'Inter', sans-serif;">
                    ⚠️ 네트워크 오류: ${error.message}
                </div>
            `;
            chatDisplay.appendChild(errorMessage);
            errorMessage.scrollIntoView({ behavior: 'smooth' });
        }
    }
});







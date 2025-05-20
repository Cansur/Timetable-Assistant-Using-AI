import { saveLocalStorage } from './modules/storage.js';

document.addEventListener("DOMContentLoaded", function () {
    // 오류 해결용
    document.addEventListener('hide.bs.modal', function (event) {
        if (document.activeElement) {
            document.activeElement.blur();
        }
    });

    let isModalOpen = false;

    // Bootstrap 모달 인스턴스 생성
    const modalElement = document.getElementById('lectureModal');
    const modalInstance = new bootstrap.Modal(modalElement, { backdrop: 'static' });

    const chatDisplay = document.getElementById('chatDisplay');
    // const scrollToBottomBtn = document.getElementById('scrollToBottom');
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

    // scrollToBottomBtn.addEventListener('click', () => {
    //     chatDisplay.lastElementChild?.scrollIntoView({ behavior: 'smooth' });
    // });

    // "예" 버튼 클릭
    document.getElementById('confirmYes').addEventListener('click', function () {
        console.log("✅ 저장 처리 실행");
        setMyList(lectures);

        modalElement.addEventListener('hidden.bs.modal', () => {
            // 모달이 닫힌 후에 페이지 이동
            window.location.href = '/';
        }, { once: true });

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

    // 어디선가 강제 초기화할 때
    document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
    document.body.classList.remove('modal-open');


    function resetModalState() {
        modalInstance.hide();
        document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
        document.body.classList.remove('modal-open');
        isModalOpen = false;
    }

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
        // 실제로 열린 모달이면 중복 실행 방지
        if (isModalOpen || modalElement.classList.contains('show')) return;
        isModalOpen = true;

        buildTimetable(lectures);

        // 혹시 이전에 쌓인 잔여 백드롭이 있다면 제거
        document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
        document.body.classList.remove('modal-open');

        // 모달 열기
        setTimeout(() => {
            modalInstance.show();
        }, 10);

        // 모달 닫혔을 때 정리
        modalElement.addEventListener('hidden.bs.modal', () => {
            isModalOpen = false;
            document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
            document.body.classList.remove('modal-open');
        }, { once: true });
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

        const chatDisplay = document.getElementById('chatDisplay');
        input.value = '';

        // ✅ 사용자 메시지 (오른쪽)
        const userMessage = document.createElement('div');
        userMessage.className = 'chat-bubble bubble-user animate-slide-up';
        userMessage.innerText = message;
        chatDisplay.appendChild(userMessage);
        userMessage.scrollIntoView({ behavior: 'smooth' });

        try {
            // ✅ 서버 요청
            const res = await fetch('/api/recommend', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ input: message, feedbackLog })
            });

            const data = await res.json();
            lecturesb = data;

            const replyText = data.reply || '알 수 없는 응답입니다.';

            // ✅ AI 응답 박스 (왼쪽)
            const aiWrapper = document.createElement('div');
            aiWrapper.className = 'bubble-ai-wrapper animate-slide-up';

            const aiBubble = document.createElement('div');
            aiBubble.className = 'chat-bubble bubble-ai';
            aiBubble.innerText = replyText;

            aiWrapper.appendChild(aiBubble);

            // ✅ 버튼 생성
            const lectureButtonWrapper = document.createElement('div');
            lectureButtonWrapper.className = 'mt-2 flex justify-start';

            const lectureButton = document.createElement('button');
            lectureButton.innerText = "시간표 연동하기";
            lectureButton.className = 'btn btn-success btn-sm rounded-pill px-3 py-1 shadow';

            lectureButton.addEventListener('click', () => {
                const lectureList = Array.isArray(lecturesb.lectures) ? lecturesb.lectures : lecturesb;
                openLectureModal(lectureList);
            });

            lectureButtonWrapper.appendChild(lectureButton);
            aiWrapper.appendChild(lectureButtonWrapper);

            chatDisplay.appendChild(aiWrapper);
            aiWrapper.scrollIntoView({ behavior: 'smooth' });

        } catch (error) {
            // ✅ 오류 말풍선
            const errorBubble = document.createElement('div');
            errorBubble.className = 'chat-bubble bubble-ai animate-slide-up';
            errorBubble.innerText = `⚠️ 네트워크 오류: ${error.message}`;
            chatDisplay.appendChild(errorBubble);
            errorBubble.scrollIntoView({ behavior: 'smooth' });
        }
    }

    resetModalState()

});







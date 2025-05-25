import { saveLocalStorage } from './modules/storage.js';

document.addEventListener("DOMContentLoaded", function () {
    // 오류 해결용
    document.addEventListener('hide.bs.modal', function (event) {
        if (document.activeElement) {
            document.activeElement.blur();
        }
    });

    const chatDisplay = document.getElementById('chatDisplay');
    const style = document.createElement('style');

    const allRecommendations = [];  // ✅ 여러 추천 저장용 배열

    // initialize chat
    document.getElementById('sendMessage').addEventListener('click', sendMessage);
    document.getElementById('chatInput').addEventListener('keypress', function (e) { if (e.key === 'Enter') sendMessage(); });

    // "예" 버튼 클릭
    document.getElementById('confirmYes').addEventListener('click', function () {
        console.log("✅ 저장 처리 실행");
        setMyList(selectedLectures);
        document.getElementById('lectureModal').classList.add('hidden');
        window.location.href = '/';
    });

    // "아니오" 버튼 클릭
    document.getElementById('confirmNo').addEventListener('click', function () {
        document.getElementById('lectureModal').classList.add('hidden');
    });

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

    const timeSlots = ['1교시', '2교시', '3교시', '4교시', '5교시', '6교시', '7교시', '8교시'];
    const weekdays = ['월', '화', '수', '목', '금'];
    const timeMap = { '1': 0, '2': 1, '3': 2, '4': 3, '5': 4, '6': 5, '7': 6, '8': 7, '9': 8, 'A': 2, 'B': 3, 'C': 4, 'D': 5, 'E': 6, 'F': 7 };

    const colorPalette = ['#e3f2fd', '#fce4ec', '#f3e5f5', '#e8f5e9', '#fffde7'];

    let selectedLectures = [];  // ✅ 선택된 강의 데이터를 임시 저장

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
        selectedLectures = lectures;  // ✅ 선택한 강의 데이터를 저장
        buildTimetable(lectures);
        document.getElementById('lectureModal').classList.remove('hidden');
    }

    function transformLectures(lectures) {
        return lectures.map(lecture => ({
            name: lecture.과목명,
            professor: lecture.교수,
            category: lecture.구분,
            schedule: lecture.시간
        }));
    }

    function setMyList(lectures) {
        const newLectures = transformLectures(lectures);
        saveLocalStorage('myList', newLectures);
    }

    async function sendMessage() {
        const input = document.getElementById('chatInput');
        const message = input.value.trim();
        if (!message) return;

        input.value = '';

        // ✅ 사용자 메시지 (오른쪽)
        const userMessage = document.createElement('div');
        userMessage.className = 'chat-bubble bubble-user animate-slide-up';
        userMessage.innerText = message;
        chatDisplay.appendChild(userMessage);
        userMessage.scrollIntoView({ behavior: 'smooth' });

        try {
            const res = await fetch('/api/recommend', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ input: message, feedbackLog: [] })
            });

            const data = await res.json();
            allRecommendations.push(data);  // ✅ 추천 저장
            const currentIndex = allRecommendations.length - 1;
            console.log(allRecommendations);

            const replyText = data.reply || '알 수 없는 응답입니다.';

            const aiWrapper = document.createElement('div');
            aiWrapper.className = 'bubble-ai-wrapper animate-slide-up';

            const aiBubble = document.createElement('div');
            aiBubble.className = 'chat-bubble bubble-ai';
            aiBubble.innerText = replyText;
            aiWrapper.appendChild(aiBubble);

            const lectureButtonWrapper = document.createElement('div');
            lectureButtonWrapper.className = 'mt-2 flex justify-start';

            const lectureButton = document.createElement('button');
            lectureButton.innerText = "시간표 연동하기";
            lectureButton.className = "link-timetable-btn";

            // ✅ 버튼마다 고유 데이터 연결
            lectureButton.addEventListener('click', () => {
                const lectureList = Array.isArray(allRecommendations[currentIndex].lectures)
                    ? allRecommendations[currentIndex].lectures
                    : allRecommendations[currentIndex];
                openLectureModal(lectureList);
            });

            lectureButtonWrapper.appendChild(lectureButton);
            aiWrapper.appendChild(lectureButtonWrapper);

            chatDisplay.appendChild(aiWrapper);
            aiWrapper.scrollIntoView({ behavior: 'smooth' });

        } catch (error) {
            const errorBubble = document.createElement('div');
            errorBubble.className = 'chat-bubble bubble-ai animate-slide-up';
            errorBubble.innerText = `⚠️ 네트워크 오류: ${error.message}`;
            chatDisplay.appendChild(errorBubble);
            errorBubble.scrollIntoView({ behavior: 'smooth' });
        }
    }
});

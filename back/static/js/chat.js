document.addEventListener("DOMContentLoaded", function () {

    init();
    // initialize chat
    document.getElementById('sendMessage').addEventListener('click', sendMessage);
    document.getElementById('chatInput').addEventListener('keypress', function (e) { if (e.key === 'Enter') sendMessage(); });

    const chatDisplay = document.getElementById('chatDisplay');
    const scrollToBottomBtn = document.getElementById('scrollToBottom');
    const style = document.createElement('style');

    chatDisplay.addEventListener('scroll', () => {
        const isAtBottom = chatDisplay.scrollTop + chatDisplay.clientHeight >= chatDisplay.scrollHeight - 10;
        scrollToBottomBtn.classList.toggle('hidden', isAtBottom);
    });

    scrollToBottomBtn.addEventListener('click', () => {
        chatDisplay.lastElementChild?.scrollIntoView({ behavior: 'smooth' });
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
        const modal = new bootstrap.Modal(document.getElementById('lectureModal'));
        modal.show();
    }

    // 예시 데이터
    const lectures = [
        { 과목명: '영상문학', 시간: '월3,월4 수3' },
        { 과목명: '죽음의철학적접근', 시간: '화D 목D' },
        { 과목명: '서양사속의고전과사상', 시간: '금1,금2,금3' }
    ];

    // 예시로 사용
    openLectureModal(lectures);
    //---*****------------------------------------------------

    const feedbackLog = []; // 피드백 기록용

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

            const aiMessage = document.createElement('div');
            aiMessage.className = 'flex justify-start animate-slide-up';
            if (res.ok) {
                aiMessage.innerHTML = `
                    <div class="max-w-[70%] bg-gray-600 text-white p-3 rounded-xl shadow-md border border-gray-500 text-sm whitespace-pre-wrap" style="font-family: 'Inter', sans-serif;">
                        ${data.reply}
                    </div>
                `;
            } else {
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

function init(){

}
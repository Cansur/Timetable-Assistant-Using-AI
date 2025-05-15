document.addEventListener("DOMContentLoaded", function () {
    document.getElementById('sendMessage').addEventListener('click', sendMessage);
    document.getElementById('chatInput').addEventListener('keypress', function (e) {
        if (e.key === 'Enter') sendMessage();
    });

    const chatDisplay = document.getElementById('chatDisplay');
    const scrollToBottomBtn = document.getElementById('scrollToBottom');
    const feedbackLog = []; // 피드백 기록용

    chatDisplay.addEventListener('scroll', () => {
        const isAtBottom = chatDisplay.scrollTop + chatDisplay.clientHeight >= chatDisplay.scrollHeight - 10;
        scrollToBottomBtn.classList.toggle('hidden', isAtBottom);
    });

    scrollToBottomBtn.addEventListener('click', () => {
        chatDisplay.lastElementChild?.scrollIntoView({ behavior: 'smooth' });
    });

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

    // 애니메이션 스타일 추가
    const style = document.createElement('style');
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
});
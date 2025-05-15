// gpt.js

// const apiKey = 'YOUR_OPENAI_API_KEY'; // ⚠️ 여기에 실제 OpenAI API 키 입력
const apiKey = OPENAI_API_KEY


async function askChatGPT(prompt) {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: '너는 시간표 추천 도우미야.' },
          { role: 'user', content: prompt },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('GPT 오류:', errorData);
      return 'GPT 응답 중 오류가 발생했습니다. 나중에 다시 시도해주세요.';
    }

    const data = await response.json();
    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error('요청 오류:', error);
    return 'GPT 호출 중 오류가 발생했습니다.';
  }
}

// 예시 호출 (Node.js 또는 콘솔 환경에서 테스트 가능)
askChatGPT("다음 주 시간표 추천해줘").then(response => {
  console.log("GPT 응답:", response);
});

// 모듈 내보내기 (필요 시)
if (typeof module !== 'undefined') {
  module.exports = askChatGPT;
}

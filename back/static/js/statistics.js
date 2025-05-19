// 공부 시간 계산
function calculateStudyHours(lectures) {
  const subjectHours = {};
  const dayCount = { 월: 0, 화: 0, 수: 0, 목: 0, 금: 0, 토: 0, 일: 0 };

  lectures.forEach(({ name, schedule }) => {
    if (!schedule) return;

    const sessions = schedule.split(/[ ,]+/); // '화3,화4' 또는 '월7 수3'
    subjectHours[name] = (subjectHours[name] || 0) + sessions.length;

    sessions.forEach(session => {
      const day = session.slice(0, 1);
      if (dayCount[day] !== undefined) {
        dayCount[day]++;
      }
    });
  });

  return { subjectHours, dayCount };
}

// 통계 요약 계산
function calculateSummary(lectures) {
  const { subjectHours } = calculateStudyHours(lectures);
  const totalSubjects = Object.keys(subjectHours).length;
  const totalHours = Object.values(subjectHours).reduce((a, b) => a + b, 0);
  const maxSubject = Object.entries(subjectHours).reduce(
    (max, [subject, hours]) => (hours > max.hours ? { subject, hours } : max),
    { subject: "없음", hours: 0 }
  );
  return { totalSubjects, totalHours, maxSubject };
}

// 차트 렌더링 함수
function renderChart(elementId, type, labels, data, title, colors) {
  const ctx = document.getElementById(elementId).getContext('2d');
  new Chart(ctx, {
    type: type,
    data: {
      labels: labels,
      datasets: [{
        label: title,
        data: data,
        backgroundColor: colors,
        borderColor: '#1f2937',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: { color: '#fff' }
        },
        title: {
          display: true,
          text: title,
          color: '#fff',
          font: { size: 16 }
        }
      },
      scales: type === 'bar' ? {
        y: { beginAtZero: true, ticks: { color: '#fff' } },
        x: { ticks: { color: '#fff' } }
      } : {}
    }
  });
}

// UI 업데이트
function updateStatsUI(lectures) {
  const { subjectHours, dayCount } = calculateStudyHours(lectures);
  const { totalSubjects, totalHours, maxSubject } = calculateSummary(lectures);

  // Summary Cards
  document.getElementById('totalHours').textContent = `${totalHours} 시간`;
  document.getElementById('subjectCount').textContent = `${totalSubjects} 과목`;
  document.getElementById('topSubject').textContent = maxSubject.subject;

  // Charts
  renderChart(
    'subjectChart',
    'pie',
    Object.keys(subjectHours),
    Object.values(subjectHours),
    '과목별 공부 시간',
    ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']
  );
  renderChart(
    'weeklyChart',
    'doughnut',
    Object.keys(dayCount),
    Object.values(dayCount),
    '요일별 수업 분포',
    ['#FF9F40', '#66FF99', '#FF6384', '#36A2EB', '#4BC0C0', '#9966FF', '#FFCE56']
  );
  renderChart(
    'weeklyPatternChart',
    'bar',
    Object.keys(dayCount),
    Object.values(dayCount),
    '주간 공부 패턴',
    ['#4BC0C0']
  );
}

// 데이터 로드 및 실행
const rawData = localStorage.getItem('myList');
if (rawData) {
  const parsed = JSON.parse(rawData);
  updateStatsUI(parsed);
} else {
  document.querySelector('main').innerHTML = `
                <p class="text-white text-center">데이터가 없습니다. 시간표를 먼저 추가해주세요.</p>
            `;
}
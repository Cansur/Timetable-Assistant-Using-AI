
/**
 * 
 * @param {*} bgColor 
 * @returns 
 */
export function getContrastTextColor(bgColor) {
    const match = bgColor.match(/(\d+)%\)$/);
    if (!match) return 'black';
    const lightness = parseInt(match[1], 10);
    return lightness > 65 ? 'black' : 'white';
}

/**
 * 
 * @param {*} seed 
 * @returns 
 */
export function getRandomColor(seed) {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
        hash = seed.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = Math.abs(hash % 360);
    return `hsl(${hue}, 70%, 80%)`;
}

// 처음과 데이터를 추가할 때 마다 시간표에 myList라는 localstroge를 불러와
// 화면에 나타나게 만드는 함수
// 이 밑에있는 parseSchedule, renderTimeTable, getRandomColor, getContrastTextColor는 GPT가 작성한 것
// 나중에 공부해서 이해하기
/**
 * 
 * @param {*} scheduleStr 
 * @returns 
 */
export function parseSchedule(scheduleStr) {
    const result = {};
    const items = scheduleStr.split(" ");
    for (let item of items) {
        const parts = item.split(",");
        for (let part of parts) {
            const day = part[0];
            const period = parseInt(part.slice(1));
            if (!result[day]) result[day] = [];
            result[day].push(period);
        }
    }

    // 연속 교시 묶기
    for (const day in result) {
        result[day].sort((a, b) => a - b);
        const grouped = [];
        let group = [result[day][0]];
        for (let i = 1; i < result[day].length; i++) {
            const cur = result[day][i];
            const prev = result[day][i - 1];
            if (cur === prev + 1) {
                group.push(cur);
            } else {
                grouped.push(group);
                group = [cur];
            }
        }
        grouped.push(group);
        result[day] = grouped;
    }

    return result;
}
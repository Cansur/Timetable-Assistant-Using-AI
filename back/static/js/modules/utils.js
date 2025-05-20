// path: static/js/modules/utils.js
export function getContrastTextColor(bgColor) {
    const match = bgColor.match(/(\d+)%\)$/);
    if (!match) return 'black';
    const lightness = parseInt(match[1], 10);
    return lightness > 65 ? 'black' : 'white';
}

export function getRandomColor(seed) {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
        hash = seed.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = Math.abs(hash % 360);
    return `hsl(${hue}, 70%, 80%)`;
}

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

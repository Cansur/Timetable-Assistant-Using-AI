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

    const specialTimeMap = {
        A: 2,  // 9:00 → 블록 index 2
        B: 5,  // 10:30 → 3블록 후
        C: 8,  // 12:00
        D: 11,
        E: 14,
        F: 17,
    };

    const items = scheduleStr.split(" ");
    for (let item of items) {
        const parts = item.split(",");
        for (let part of parts) {
            const day = part[0];
            const rest = part.slice(1).toUpperCase(); // 예: '3', 'A', '3-4'

            if (!result[day]) result[day] = [];

            // 📌 숫자 교시 (ex: 3, 3-4)
            if (/^\d/.test(rest)) {
                if (rest.includes("-")) {
                    const [start, end] = rest.split("-").map(Number);
                    for (let p = start; p <= end; p++) {
                        const startBlock = (p - 1) * 2;
                        result[day].push(startBlock);
                        result[day].push(startBlock + 1);
                    }
                } else {
                    const p = parseInt(rest);
                    result[day].push((p - 1) * 2);
                    result[day].push((p - 1) * 2 + 1);
                }
            }

            // 📌 A, B, C 시간대 처리
            else if (specialTimeMap[rest]) {
                const startBlock = specialTimeMap[rest];
                result[day].push(startBlock);
                result[day].push(startBlock + 1);
                result[day].push(startBlock + 2); // A~F는 항상 3블록
            }
        }
    }

    // 그룹핑
    for (const day in result) {
        const sorted = result[day].sort((a, b) => a - b);
        const grouped = [];
        let group = [sorted[0]];
        for (let i = 1; i < sorted.length; i++) {
            if (sorted[i] === sorted[i - 1] + 1) {
                group.push(sorted[i]);
            } else {
                grouped.push(group);
                group = [sorted[i]];
            }
        }
        grouped.push(group);
        result[day] = grouped.map(g => [g[0], g.length]);
    }

    return result;
}


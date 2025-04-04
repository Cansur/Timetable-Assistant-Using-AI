// colorUtils.js

export function getRandomColor(seed) {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
        hash = seed.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = Math.abs(hash % 360);
    return `hsl(${hue}, 70%, 80%)`;
}

export function getContrastTextColor(bgColor) {
    const match = bgColor.match(/(\d+)%\)$/);
    if (!match) return 'black';
    const lightness = parseInt(match[1], 10);
    return lightness > 65 ? 'black' : 'white';
}
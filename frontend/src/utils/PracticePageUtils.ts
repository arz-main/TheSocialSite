export function getCircleDash(progress: number, r = 54) {
    const circ = 2 * Math.PI * r;
    return `${circ * progress} ${circ}`;
}

export function formatTime(seconds: number) {
    if (seconds < 60) return `${seconds}s`;
    const min = `${Math.floor(seconds / 60)}m`;
    const sec = `${seconds % 60}s`;
    if (sec !== "0s") return min + " " + sec;
    return min;
}

export function downloadDataUrl(dataUrl: string, filename = "drawing.png") {
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = filename;
    link.click();
}
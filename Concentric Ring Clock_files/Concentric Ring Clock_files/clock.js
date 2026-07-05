// Concentric Ring Clock Logic

// Full names for previews
const monthNames = [
    "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
    "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"
];
const dayNames = [
    "SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"
];

// Animation angles and states
let activeDayIndex = -1;
let currentDayAngle = 0;

let lastDaysInMonth = -1;
let activeDateIndex = -1;
let currentDateAngle = 0;

let activeMonthIndex = -1;
let currentMonthAngle = 0;

// Analog Clock Sweep Variables
let initialSec = 0;
let initialMin = 0;
let initialHour = 0;
let startMs = 0;

// Initialize concentric rings layouts
function initRings() {
    initDayRing();
    initMonthRing();
    updateDateRingStructure();
}

// Layout Day Name Ring
function initDayRing() {
    const dayTextEl = document.getElementById('dayNameText');
    const days = dayTextEl.textContent.trim().split(/\s+/);
    dayTextEl.innerHTML = '';
    days.forEach((dayStr, idx) => {
        const span = document.createElement('span');
        span.textContent = dayStr;
        // Inner Ring R1 = 130px radius
        const angle = idx * (360 / 7);
        span.style.transform = `translate(-50%, -50%) rotate(${angle}deg) translateY(-130px)`;
        dayTextEl.appendChild(span);
    });
}

// Layout Month Ring
function initMonthRing() {
    const monthTextEl = document.getElementById('monthText');
    const months = monthTextEl.textContent.trim().split(/\s+/);
    monthTextEl.innerHTML = '';
    months.forEach((monthStr, idx) => {
        const span = document.createElement('span');
        span.textContent = monthStr;
        // Outer Ring R3 = 290px radius
        const angle = idx * (360 / 12);
        span.style.transform = `translate(-50%, -50%) rotate(${angle}deg) translateY(-290px)`;
        monthTextEl.appendChild(span);
    });
}

// Render dynamic dates depending on current month length
function updateDateRingStructure() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    if (daysInMonth !== lastDaysInMonth) {
        const dateTextEl = document.getElementById('dateText');
        dateTextEl.innerHTML = '';
        
        for (let i = 1; i <= daysInMonth; i++) {
            const span = document.createElement('span');
            span.textContent = i < 10 ? '0' + i : '' + i;
            dateTextEl.appendChild(span);
        }
        
        const spans = dateTextEl.querySelectorAll('span');
        const radius = 210; // R2
        spans.forEach((span, idx) => {
            const angle = idx * (360 / daysInMonth);
            span.style.transform = `translate(-50%, -50%) rotate(${angle}deg) translateY(-${radius}px)`;
        });
        
        lastDaysInMonth = daysInMonth;
        // Reset angles to prevent weird jumps upon structural update
        const dateDay = now.getDate();
        activeDateIndex = dateDay - 1;
        currentDateAngle = -activeDateIndex * (360 / daysInMonth);
    }
}

// Curving the greeting text inside the center analog dial
function updateGreeting() {
    const greetingEl = document.getElementById('centerGreeting');
    const hour = new Date().getHours();
    let text = "WELCOME";
    if (hour >= 5 && hour < 12) text = "GOOD MORNING";
    else if (hour >= 12 && hour < 17) text = "GOOD AFTERNOON";
    else if (hour >= 17 && hour < 22) text = "GOOD EVENING";
    else text = "GOOD NIGHT";
    
    greetingEl.innerHTML = '';
    const chars = text.split('');
    const totalChars = chars.length;
    
    // Position characters dynamically on top arc
    const angleStep = 7.5; // separation angle
    const startAngle = -((totalChars - 1) * angleStep) / 2;
    
    chars.forEach((char, idx) => {
        const span = document.createElement('span');
        span.textContent = char;
        const angle = startAngle + idx * angleStep;
        span.style.transform = `rotate(${angle}deg)`;
        greetingEl.appendChild(span);
    });
}

// Setup hands starting angles
function initAnalogClock() {
    const d = new Date();
    initialSec = d.getSeconds();
    initialMin = d.getMinutes();
    initialHour = d.getHours();
    startMs = Date.now();
}

// Sweep hands animation
function updateAnalogClock() {
    const elapsedSec = (Date.now() - startMs) / 1000;
    
    const secAngle = (initialSec + elapsedSec) * 6;
    const minAngle = (initialMin + elapsedSec / 60) * 6;
    const hourAngle = (initialHour % 12 + elapsedSec / 3600) * 30;
    
    document.getElementById('seconds').style.transform = `rotate(${secAngle}deg)`;
    document.getElementById('minutes').style.transform = `rotate(${minAngle}deg)`;
    document.getElementById('hours').style.transform = `rotate(${hourAngle}deg)`;
}

// Smooth rotation logic for calendar rings
function updateCalendarRings() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const date = now.getDate();
    let day = now.getDay(); // 0 (Sun) to 6 (Sat)
    
    // Align with Monday=1, Sunday=7 index representation for user convenience
    let dayIndex = day === 0 ? 6 : day - 1; // 0: Mon, 1: Tue ... 6: Sun
    
    // 1. Day Name Ring rotation (7 elements)
    if (activeDayIndex === -1) {
        activeDayIndex = dayIndex;
        currentDayAngle = -dayIndex * (360 / 7);
    } else if (activeDayIndex !== dayIndex) {
        let diff = dayIndex - activeDayIndex;
        if (diff > 3) diff -= 7;
        if (diff < -3) diff += 7;
        currentDayAngle -= diff * (360 / 7);
        activeDayIndex = dayIndex;
    }
    document.getElementById('r1').style.transform = `rotate(${currentDayAngle}deg)`;
    
    // Highlight active day element
    const daySpans = document.querySelectorAll('#r1 span');
    daySpans.forEach((span, idx) => {
        if (idx === dayIndex) span.classList.add('active');
        else span.classList.remove('active');
    });

    // 2. Date Ring rotation (dynamic days count)
    updateDateRingStructure();
    const daysInMonth = lastDaysInMonth;
    const dateIndex = date - 1;
    
    if (activeDateIndex === -1) {
        activeDateIndex = dateIndex;
        currentDateAngle = -dateIndex * (360 / daysInMonth);
    } else if (activeDateIndex !== dateIndex) {
        let diff = dateIndex - activeDateIndex;
        const half = daysInMonth / 2;
        if (diff > half) diff -= daysInMonth;
        if (diff < -half) diff += daysInMonth;
        currentDateAngle -= diff * (360 / daysInMonth);
        activeDateIndex = dateIndex;
    }
    document.getElementById('r2').style.transform = `rotate(${currentDateAngle}deg)`;
    
    // Highlight active date element
    const dateSpans = document.querySelectorAll('#r2 span');
    dateSpans.forEach((span, idx) => {
        if (idx === dateIndex) span.classList.add('active');
        else span.classList.remove('active');
    });

    // 3. Month Ring rotation (12 elements)
    if (activeMonthIndex === -1) {
        activeMonthIndex = month;
        currentMonthAngle = -month * (360 / 12);
    } else if (activeMonthIndex !== month) {
        let diff = month - activeMonthIndex;
        if (diff > 6) diff -= 12;
        if (diff < -6) diff += 12;
        currentMonthAngle -= diff * (360 / 12);
        activeMonthIndex = month;
    }
    document.getElementById('r3').style.transform = `rotate(${currentMonthAngle}deg)`;
    
    // Highlight active month element
    const monthSpans = document.querySelectorAll('#r3 span');
    monthSpans.forEach((span, idx) => {
        if (idx === month) span.classList.add('active');
        else span.classList.remove('active');
    });

    // Update the static text previews
    updatePreviews(now);
}

// Update full previews labels
function updatePreviews(d) {
    document.getElementById('monthPreview').textContent = monthNames[d.getMonth()];
    document.getElementById('datePreview').textContent = d.getDate() < 10 ? '0' + d.getDate() : d.getDate();
    document.getElementById('dayNamePreview').textContent = dayNames[d.getDay()];
}

// Generate weekly activity progress bars
function loadBars() {
    const d = new Date();
    let dayNum = d.getDay(); // 0 is Sunday
    if (dayNum === 0) dayNum = 7; // Convert to Mon=1, Sun=7
    
    for (let i = 1; i <= 7; i++) {
        const barEl = document.getElementById('day' + i);
        if (!barEl) continue;
        const barWrapper = barEl.parentElement;
        
        if (i <= dayNum) {
            // Generate heights for passed and current days
            const newHeight = Math.floor(Math.random() * 70) + 20; // 20px - 90px range
            barEl.style.height = newHeight + "px";
            if (i === dayNum) {
                barWrapper.classList.add('active');
            } else {
                barWrapper.classList.remove('active');
            }
        } else {
            // Future days stay at flat placeholder
            barEl.style.height = "6px";
            barWrapper.classList.remove('active');
        }
    }
}

// Main Frame Loop (runs 60fps for sweep analog seconds hand)
function tick() {
    updateAnalogClock();
    requestAnimationFrame(tick);
}

// Initial Setup on load
window.addEventListener('DOMContentLoaded', () => {
    initRings();
    initAnalogClock();
    updateGreeting();
    updateCalendarRings();
    loadBars();
    
    // Start smooth ticking
    requestAnimationFrame(tick);
    
    // Slow interval check for slower elements (calendar changes, greetings)
    setInterval(() => {
        updateCalendarRings();
        updateGreeting();
    }, 1000);
});

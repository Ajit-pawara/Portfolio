const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, 'src', 'data.json');
const raw = fs.readFileSync(dataPath, 'utf8');
const data = JSON.parse(raw);

// 1. Rename projects roles to "Solo Developer"
if (data.projects) {
    data.projects.forEach(p => {
        p.role = "Solo Developer";
    });
}

// Helper to generate default Java & DSA logs
function generateDefaultTrackDays(trackName) {
    const days = [];
    const topics = [
        { title: "Java JVM & JDK Architecture", takeaway: "Understanding bytecode, compilation, and cross-platform compilation logic." },
        { title: "Java Variables & Operators", takeaway: "Mastered primitive data types vs Reference types, and math operation execution." },
        { title: "Control Flow & Loops", takeaway: "Implemented conditions, switch cases, and loops (for, while, do-while)." },
        { title: "Arrays & Memory Mapping", takeaway: "Explored 1D/2D arrays allocation in the heap memory and lookup efficiency." },
        { title: "String Manipulation & Pool", takeaway: "Investigated String immutability and memory optimization via the String Constant Pool." }
    ];
    for (let i = 1; i <= 90; i++) {
        const completed = i <= 5;
        const topic = topics[i - 1] || { title: `DSA Topic Day ${i}`, takeaway: "Analyzing data structures efficiency and space/time complexity." };
        days.push({
            day: i,
            title: topic.title,
            subtitle: `${trackName} progress log - Day ${i}`,
            takeaway: completed ? topic.takeaway : "Pending learning task",
            incidentName: completed ? "Topic Lab Exercise" : "Upcoming Lab",
            incidentDetail: completed ? `Successfully solved and verified code exercise for Day ${i}.` : "To be done.",
            status: completed ? "completed" : "upcoming"
        });
    }
    return days;
}

// 2. Upgrade challenge schema to tracks
if (data.challenge && !data.challenge.tracks) {
    const oldChallenge = data.challenge;
    data.challenge = {
        activeTrack: "cybersecurity",
        tracks: {
            cybersecurity: {
                name: "Cybersecurity & Ethical Hacking",
                currentDay: oldChallenge.currentDay || 9,
                totalDays: oldChallenge.totalDays || 90,
                completedDays: oldChallenge.completedDays || 9,
                days: oldChallenge.days || []
            },
            java_dsa: {
                name: "Java & DSA Masterclass",
                currentDay: 5,
                totalDays: 90,
                completedDays: 5,
                days: generateDefaultTrackDays("Java & DSA Masterclass")
            }
        }
    };
}

fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
console.log('src/data.json upgraded successfully!');

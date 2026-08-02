require("dotenv").config();
const RPC = require("discord-rpc");
const fs = require("fs");
const { exec } = require("child_process");

const API_KEY = process.env.WAKATIME_API_KEY;
const BASE64_API_KEY = Buffer.from(API_KEY).toString("base64");
const discordClientId = process.env.DISCORD_CLIENT_ID;
const rpc = new RPC.Client({ transport: "ipc" });

let scenarios = [];
try {
    const projectsData = fs.readFileSync("./projects.json", "utf8");
    scenarios = JSON.parse(projectsData);
} catch (err) {
    console.error("Failed to read projects.json:", err.message);
    process.exit(1);
}

const DAILY_LIMIT_HOURS = parseFloat(process.env.DAILY_LIMIT_HOURS) || 3;
const DAILY_LIMIT_MS = DAILY_LIMIT_HOURS * 60 * 60 * 1000;
const START_TIME = Date.now();

let isResting = false;
let isDiscordConnected = false;
let isIdeActive = false;
let lastHeartbeatTime = 0;

async function sendHeartbeat(scenario) {
    if (isResting) return;

    const payload = {
        entity: scenario.entity,
        type: "file",
        time: Date.now() / 1000,
        project: scenario.project,
        language: scenario.language,
        is_write: Math.random() > 0.5,
    };

    try {
        const response = await fetch(
            "https://api.wakatime.com/api/v1/users/current/heartbeats",
            {
                method: "POST",
                headers: {
                    Authorization: `Basic ${BASE64_API_KEY}`,
                    "Content-Type": "application/json",
                    "User-Agent": "wakatime/13.0.7",
                },
                body: JSON.stringify(payload),
            },
        );

        if (response.ok) {
            console.log(
                `[${new Date().toLocaleTimeString()}] Coding: ${scenario.project} (${scenario.language})`,
            );

            let discordDetails = `Sesi Ngoding`;
            let discordState = `Lagi ngoding pake ${scenario.language}`;

            if (scenario.project === "backend-uhtp") {
                discordDetails = `🔒 Absolute Authority`;
                discordState = `Nganuin backend API`;
            } else if (
                scenario.project === "monorepo-ganbatte" ||
                scenario.project === "ganbatte" ||
                scenario.project === "E-Commerce-Laravel"
            ) {
                discordDetails = `⛓️ Discipline Session`;
                discordState = `Memainkan Laravel agar patuh :3 `;
            } else {
                discordDetails = `🕹️ Obedience Test`;
                discordState = `Memaksa kode untuk patuh`;
            }

            if (isDiscordConnected) {
                try {
                    rpc.setActivity({
                        details: discordDetails,
                        state: discordState,
                        startTimestamp: START_TIME,
                        instance: false,
                    });
                } catch (err) {}
            }
        } else {
            console.log(
                `[${new Date().toLocaleTimeString()}] Failed: ${response.statusText}`,
            );
        }
    } catch (err) {
        console.error("WakaTime API Error:", err.message);
    }
}

function checkAndRun() {
    const elapsedTime = Date.now() - START_TIME;

    if (elapsedTime >= DAILY_LIMIT_MS && !isResting) {
        isResting = true;
        console.log(
            `\n Daily limit of ${DAILY_LIMIT_HOURS} hours reached. Session closed, locking the system.`,
        );

        if (isDiscordConnected) {
            try {
                rpc.setActivity({
                    details: "Locking the Chamber",
                    state: "Sesi selesai. Time for aftercare 🍷",
                    startTimestamp: new Date(),
                    instance: false,
                });
            } catch (err) {}
        }

        return;
    }

    if (isResting) return;

    exec("tasklist", (err, stdout) => {
        if (err) return;
        const output = stdout.toLowerCase();
        const ides = [
            "code.exe",
            "cursor.exe",
            "antigravity ide.exe",
            "idea64.exe",
            "idea.exe",
            "webstorm64.exe",
            "webstorm.exe",
            "phpstorm64.exe",
            "phpstorm.exe",
            "pycharm64.exe",
            "pycharm.exe",
            "clion64.exe",
            "clion.exe",
            "rider64.exe",
            "rider.exe",
            "goland64.exe",
            "goland.exe",
            "rubymine64.exe",
            "rubymine.exe",
            "fleet.exe",
            "studio64.exe",
            "studio.exe",
            "sublime_text.exe",
            "devenv.exe",
            "eclipse.exe",
            "netbeans.exe",
            "netbeans64.exe",
            "notepad++.exe",
            "atom.exe",
            "zed.exe",
            "nvim.exe",
            "vim.exe",
            "gvim.exe",
        ];
        const currentlyActive = ides.some((ide) => output.includes(ide));

        if (currentlyActive) {
            if (!isIdeActive) {
                console.log(
                    `[${new Date().toLocaleTimeString()}] IDE detected! Taking full control of the system. WakaTime bot idle.`,
                );
                isIdeActive = true;
            }
            if (isDiscordConnected) {
                try {
                    rpc.setActivity({
                        details: "Dominate my code~ <3",
                        state: "Kali ni beneran ngoding ehe... :3",
                        startTimestamp: START_TIME,
                        instance: false,
                    });
                } catch (err) {}
            }
        } else {
            if (isIdeActive) {
                console.log(
                    `[${new Date().toLocaleTimeString()}] IDE closed! Relinquishing control, system returning to automatic.`,

                    `[${new Date().toLocaleTimeString()}] IDE closed! Melepas kendali, sistem kembali otomatis.`,
                );
                isIdeActive = false;
                lastHeartbeatTime = 0;
            }

            const now = Date.now();
            if (now - lastHeartbeatTime >= 120000) {
                lastHeartbeatTime = now;
                const randomScenario =
                    scenarios[Math.floor(Math.random() * scenarios.length)];
                sendHeartbeat(randomScenario);
            }
        }
    });
}

setInterval(checkAndRun, 15000);

rpc.on("ready", () => {
    isDiscordConnected = true;
    console.log("Discord RPC Connected!");
    console.log(
        `WakaTime Bot is running! Daily target: ${DAILY_LIMIT_HOURS} Hours.`,
    );
    checkAndRun();
});

console.log("Connecting to Discord...");
rpc.login({ clientId: discordClientId }).catch((err) => {
    isDiscordConnected = false;
    console.error("Failed to connect to Discord:", err.message);
    console.log(
        `WakaTime Bot is running! Daily target: ${DAILY_LIMIT_HOURS} Hours.`,
    );
    checkAndRun();
});

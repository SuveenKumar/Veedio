const API_KEY = "lannetech_6e0b80fa9037cd8de670ced8eb0dd6a7838f669b9ee259ec59e9319f42c7f20a";

const promptInput = document.getElementById("promptInput");
const warning = document.getElementById("wordWarning");
const videoLength = document.getElementById("videoLength");
const videoQuality = document.getElementById("videoQuality");
const videoType = document.getElementById("videoType");
const videoAIModel = document.getElementById("videoAIModel");
const generateBtn = document.getElementById("generateBtn");
const statusMessage = document.getElementById("status");
const videoSource = document.getElementById("videoSource");
const previewBox = document.getElementById("previewBox");
let generationID = localStorage.getItem("generationID") || "";
const MAX_CHARACTERS = 1000;

promptInput.addEventListener("input", function () {
    let words = this.value;
    let wordCount = words.length;
    handleValidation(wordCount);
    Save();
});

videoLength.addEventListener("change", function () {
    Save();
});
videoQuality.addEventListener("change", function () {
    Save();
});
videoType.addEventListener("change", function () {
    Save();
});
videoAIModel.addEventListener("change", function () {
    Save();
});

generateBtn.addEventListener("click", function () {
    generate();
});

async function generate() {
    if (!promptInput.value) {
        alert("Enter prompt first");
        return;
    }
    statusMessage.innerText = "Sending";
    generateBtn.disabled = true;

    try {
        const res = await fetch("https://videogenapi.com/api/v1/generate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + API_KEY
            },
            body: JSON.stringify({
                model: videoAIModel.value,
                prompt: promptInput.value,
                duration: videoLength.value === "5s" ? 5 : 10,
                resolution: videoType.value,
                aspect_ratio: videoType.value === "Long Video" ? "16:9" : "9:16",
                add_audio: true
            })
        });
        const data = await res.json();
        if (data.generation_id != undefined) {
            generationID = data.generation_id;
            statusMessage.innerText = "Submitted";
        }
        else{
            statusMessage.innerText = data.error;
            generateBtn.disabled = false;
        }
        pollStatus();

    } catch (e) {
        statusMessage.innerText = "error";
        Save();
    }
}

// Poll
async function pollStatus() {
    let done = false;
    if (generationID === "undefined") return;

    while (!done) {
        try {
            const res = await fetch(
                `https://videogenapi.com/api/v1/status/${generationID}`,
                {
                    headers: {
                        "Authorization": "Bearer " + API_KEY
                    }
                }
            );

            const data = await res.json();

            if (data.status === "completed") {
                statusMessage.innerText = "Completed";
                generateBtn.disabled = false;
                showPreview(data.video_url);
                done = true;
            } else if (data.status === "failed") {
                statusMessage.innerText = "failed: " + data.error;
                generateBtn.disabled = false;
                done = true;
            } else {
                statusMessage.innerText = data.status; // pending / in_progress
                generateBtn.disabled = true;
            }

            Save();
            Load();

        } catch (e) {
            console.log("Polling error", e);
        }
        await new Promise(r => setTimeout(r, 5000));
    }
}

function showPreview(url) {
    // Assign source
    videoSource.src = url;

    // Reload video
    previewBox.load();

    // Show video
    previewBox.style.display = "block";
}


function Load() {
    promptInput.value = localStorage.getItem("promptInput") || "";
    handleValidation(promptInput.value.length);

    videoLength.value = localStorage.getItem("videoLength") || "10s";
    videoQuality.value = localStorage.getItem("videoQuality") || "720p";
    videoType.value = localStorage.getItem("videoType") || "Short Video";
    videoAIModel.value = localStorage.getItem("videoAIModel") || "sora-2";
    statusMessage.innerText = localStorage.getItem("statusMessage") || "● Live";
    generationID.value = localStorage.getItem("generationID") || "";
    videoSource.src = localStorage.getItem("videoSource") || "";

}
function handleValidation(wordCount) {
    if (wordCount > MAX_CHARACTERS) {
        warning.textContent = `${wordCount} / ${MAX_CHARACTERS}`;

        warning.style.background = "rgba(255,0,0,0.2)";
        warning.style.color = "#ff4d4f";
        generateBtn.disabled = true;
    } else {
        warning.textContent = `${wordCount} / ${MAX_CHARACTERS}`;
        warning.style.background = "rgba(255,255,255,0.1)";
        warning.style.color = "#aaa";
        if (statusMessage.innerText !== "in_progress") generateBtn.disabled = false;

    }
}

function Save() {
    localStorage.setItem("promptInput", promptInput.value);
    localStorage.setItem("videoLength", videoLength.value);
    localStorage.setItem("videoQuality", videoQuality.value);
    localStorage.setItem("videoType", videoType.value);
    localStorage.setItem("videoAIModel", videoAIModel.value);
    localStorage.setItem("generationID", generationID);
    localStorage.setItem("statusMessage", statusMessage.innerText);
    localStorage.setItem("videoSource", videoSource.src);
}

Load();
pollStatus();

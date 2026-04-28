const promptInput = document.getElementById("promptInput");
const warning = document.getElementById("wordWarning");
const videoLength = document.getElementById("videoLength");
const videoQuality = document.getElementById("videoQuality");
const videoType = document.getElementById("videoType");
const videoAIModel = document.getElementById("videoAIModel");


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

// Restore on load
window.addEventListener("DOMContentLoaded", function () {
    Load();

});

function Load() {
    promptInput.value = localStorage.getItem("promptInput");
    handleValidation(promptInput.value.length);

    videoLength.value = localStorage.getItem("videoLength");;
    videoQuality.value = localStorage.getItem("videoQuality");;
    videoType.value = localStorage.getItem("videoType");;
    videoAIModel.value = localStorage.getItem("videoAIModel");;
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
        generateBtn.disabled = false;

    }
}

function Save() {
    localStorage.setItem("promptInput", promptInput.value);
    localStorage.setItem("videoLength", videoLength.value);
    localStorage.setItem("videoQuality", videoQuality.value);
    localStorage.setItem("videoType", videoType.value);
    localStorage.setItem("videoAIModel", videoAIModel.value);
}

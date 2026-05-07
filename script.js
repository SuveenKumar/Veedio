const API_KEY = "lannetech_6e0b80fa9037cd8de670ced8eb0dd6a7838f669b9ee259ec59e9319f42c7f20a";
const CLOUD_NAME = "dne19jlsg";
const UPLOAD_PRESET = "gt4sk9kh";
const CLOUD_API_KEY = "922372645378976";
const CLOUD_API_SECERET = "tfiNdXuS5UYeZ5CB7-BAdC8ntpo";
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
const imageUpload = document.getElementById("imageUpload");
const imagePreview = document.getElementById("imagePreview");
const uploadStatus = document.getElementById("uploadStatus");
const removeImageBtn = document.getElementById("removeImageBtn");
const plusIcon = document.getElementById("plusIcon");
let selectedImageFile = localStorage.getItem("selectedImageFile") || "";
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


imageUpload.addEventListener("change", async function () {

    const file = this.files[0];

    if (!file) return;

    uploadStatus.innerText = "Uploading image...";

    const imageUrl = await uploadImage(file);

    if (!imageUrl) {
        uploadStatus.innerText = "Upload failed";
        selectedImageFile = "";

        return;
    }

    selectedImageFile = imageUrl;

    imagePreview.src = selectedImageFile;
    imagePreview.style.display = "block";
    plusIcon.style.display = "none";
    removeImageBtn.style.display = "block";
    uploadStatus.innerText = "Uploaded Successfully";
    uploadBox.classList.add("has-image");
    Save();
});

removeImageBtn.addEventListener("click", function (e) {

    e.preventDefault();

    // Reset image
    imagePreview.src = "";
    imagePreview.style.display = "none";

    // Show plus icon again
    plusIcon.style.display = "block";

    // Hide delete button
    removeImageBtn.style.display = "none";

    // Clear input
    imageUpload.value = "";

    // Clear saved values
    selectedImageFile = "";
    uploadBox.classList.remove("has-image");

    Save();
});

async function uploadImage(file) {

    try {


        const formData = new FormData();

        formData.append("file", file);
        formData.append("upload_preset", UPLOAD_PRESET);

        const res = await fetch(
            `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
            {
                method: "POST",
                body: formData
            }
        );

        // Parse response
        const data = await res.json();

        console.log(data);

        // Error from API
        if (!res.ok) {
            throw new Error(data.error?.message || "Upload failed");
        }

        // Return uploaded image url
        return data.secure_url;

    } catch (error) {

        return null;
    }
}

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
                duration: videoLength.value,
                resolution: videoQuality.value,
                aspect_ratio: videoType.value === "Long Video" ? "16:9" : "9:16",
                add_audio: true,
                image_url: selectedImageFile
            })
        });
        const data = await res.json();
        if (data.generation_id != undefined) {
            generationID = data.generation_id;
            statusMessage.innerText = "Submitted";
        }
        else {
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
    const savedImage = localStorage.getItem("selectedImageFile");
    if (savedImage) {

        imagePreview.src = savedImage;
        imagePreview.style.display = "block";

        plusIcon.style.display = "none";
        removeImageBtn.style.display = "flex";
        uploadBox.classList.add("has-image");
    }

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
    localStorage.setItem("selectedImageFile", selectedImageFile);
}

Load();
pollStatus();

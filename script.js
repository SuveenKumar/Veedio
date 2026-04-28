
const fileInput = document.getElementById("fileInput");
const previewImg = document.getElementById("previewImg");
const plusIcon = document.getElementById("plusIcon");

fileInput.addEventListener("change", function () {
    const file = this.files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = function (e) {
            previewImg.src = e.target.result;
            previewImg.classList.remove("hidden");
            plusIcon.style.display = "none";
        };

        reader.readAsDataURL(file);
    }
});
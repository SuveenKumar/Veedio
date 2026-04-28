const input = document.getElementById("imageInput");
const preview = document.getElementById("preview");

input.addEventListener("change", () => {
    const file = input.files[0];
    if (file) {
        preview.src = URL.createObjectURL(file);
        preview.style.display = "block";
    }
});

const dropdown = document.getElementById("dropdown");
const selected = document.getElementById("selected");
const list = document.getElementById("dropdownList");

selected.addEventListener("click", () => {
    dropdown.classList.toggle("open");
});

document.querySelectorAll(".dropdown-item").forEach(item => {
    item.addEventListener("click", () => {
        const name = item.querySelector("b").innerText;
        const spec = item.querySelector("span").innerText;

        selected.innerHTML = `<span>${name}</span><small>${spec}</small>`;
        dropdown.classList.remove("open");

        console.log("Selected model:", item.dataset.value);
    });
});

/* Close when clicking outside */
document.addEventListener("click", (e) => {
    if (!dropdown.contains(e.target)) {
        dropdown.classList.remove("open");
    }
});
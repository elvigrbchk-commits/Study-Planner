
const button = document.querySelector("#more-btn");
const text = document.querySelector("#more-text");

button.addEventListener("click", function() {
    if (text.style.display === "none") {
        text.style.display = "block";
        button.textContent = "Show Less";
    } else {
        text.style.display = "none";
        button.textContent = "Show More";
    }
});

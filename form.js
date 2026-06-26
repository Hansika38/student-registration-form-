// ==========================================
// 1. SELECT HTML ELEMENTS
// ==========================================
const form = document.getElementById("studentForm");
const pages = document.querySelectorAll(".page");
const circles = document.querySelectorAll(".circle");
const progressBar = document.getElementById("progressBar");
const stepText = document.getElementById("stepText");
const nextButtons = document.querySelectorAll(".next-btn");
const prevButtons = document.querySelectorAll(".prev-btn");
const successMessage = document.getElementById("successMessage");
const photoInput = document.getElementById("photo");
const avatarPreview = document.getElementById("avatarPreview");

// Tracker for current page (Starts at 0, which is Page 1)
let currentPageIndex = 0;


// ==========================================
// 2. VALIDATION LOGIC (MANDATORY FIELDS)
// ==========================================
// This function checks the current page to ensure required fields are filled
function validateCurrentPage() {
    // Look only inside the current active page for inputs that have the "required" attribute
    const currentInputs = pages[currentPageIndex].querySelectorAll("input[required], select[required]");
    
    // We assume the page is valid until we find an empty field
    let isValid = true; 

    // Loop through every required field on this page
    currentInputs.forEach(input => {
        // .trim() removes accidental spaces. If the field is completely empty...
        if (input.value.trim() === "") {
            isValid = false; // Mark the page as invalid so they can't proceed
            input.classList.add("error-border"); // Apply the red border from our CSS
        } else {
            input.classList.remove("error-border"); // Remove red border if they fixed it
        }
    });

    // If it's invalid, you can also show a browser alert to be extra clear
    if (!isValid) {
        alert("Please fill in all mandatory fields before proceeding.");
    }

    return isValid; // Returns true if everything is filled, false if something is missing
}


// ==========================================
// 3. UI PROGRESS ANIMATIONS
// ==========================================
// Updates the blue line, numbered circles, and text in the top right
function updateProgressUI() {
    // Light up the correct circles
    circles.forEach((circle, index) => {
        if (index <= currentPageIndex) {
            circle.classList.add("active");
        } else {
            circle.classList.remove("active");
        }
    });

    // Calculate math for the blue bar (25%, 50%, 75%, 100%)
    const progressPercentage = ((currentPageIndex + 1) / 4) * 100;
    progressBar.style.width = progressPercentage + "%";

    // Update the text in the top right corner
    stepText.innerText = `Step ${currentPageIndex + 1} of 4`;
}


// ==========================================
// 4. BUTTON CLICKS (FORWARD & BACK)
// ==========================================
// Logic to move Forward
nextButtons.forEach((button) => {
    button.addEventListener("click", () => {
        
        // CHECK VALIDATION BEFORE MOVING!
        // If validateCurrentPage() returns true, we allow them to proceed.
        if (validateCurrentPage()) {
            pages[currentPageIndex].classList.remove("active"); // Hide current page
            currentPageIndex++; // Move tracker forward by 1
            pages[currentPageIndex].classList.add("active"); // Show the new page
            updateProgressUI(); // Run animations to update the blue bar
        }
    });
});

// Logic to move Backward
prevButtons.forEach((button) => {
    button.addEventListener("click", () => {
        // No validation needed to go backward
        pages[currentPageIndex].classList.remove("active");
        currentPageIndex--; 
        pages[currentPageIndex].classList.add("active");
        updateProgressUI();
    });
});


// ==========================================
// 5. PHOTO UPLOAD PREVIEW
// ==========================================
// Swaps the avatar SVG icon for the actual uploaded picture
photoInput.addEventListener("change", function() {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            // Replaces the placeholder circle with an <img> tag showing the photo
            avatarPreview.innerHTML = `<img src="${event.target.result}" alt="Profile Preview">`;
        }
        reader.readAsDataURL(file);
    }
});


// ==========================================
// 6. FINAL FORM SUBMISSION & DATA STORAGE
// ==========================================
form.addEventListener("submit", (event) => {
    event.preventDefault(); // Stops the page from automatically refreshing
    
    // Run validation one last time on the final page
    if (validateCurrentPage()) {
        
        // 1. CAPTURE THE DATA
        const newStudent = {
            firstName: document.getElementById("firstName").value,
            lastName: document.getElementById("lastName").value,
            dob: document.getElementById("dob").value,
            gender: document.getElementById("gender").value,
            email: document.getElementById("email").value,
            phone: document.getElementById("phone").value,
            course: document.getElementById("course").value,
            university: document.getElementById("university").value
        };

        // 2. SAVE TO LOCAL STORAGE
        localStorage.setItem("studentAccount", JSON.stringify(newStudent));
        console.log("Data successfully saved to localStorage:", newStudent);

        // 3. SHOW THE SUCCESS SCREEN (AND HIDE EVERYTHING ELSE)
        form.classList.add("hidden");
        document.querySelector(".step-circles").classList.add("hidden");
        document.querySelector(".progress-container").classList.add("hidden");
        
        // 👇 THIS IS THE NEW LINE YOU NEED TO ADD 👇
        document.querySelector(".header-titles").classList.add("hidden"); 
        
        // Reveal the final "Registration Complete!" screen
        successMessage.classList.remove("hidden");
    }
});
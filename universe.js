document.addEventListener("DOMContentLoaded", function () {

    // ---------------- LOAD DATA ----------------
    let users = JSON.parse(localStorage.getItem("users")) || [];
    let currentUser = JSON.parse(localStorage.getItem("currentUser")) || null;

    const signUpBtn = document.getElementById("signUpBtn");
    const loginBtn = document.getElementById("loginBtn");
    const profilePic = document.getElementById("profilePic");
    const profilePopup = document.getElementById("profilePopup");
    const popupProfilePic = document.getElementById("popupProfilePic");
    const btnMenu = document.getElementById("btnMenu");
    const menubox = document.getElementById("menubox");
    const menuUsername = document.getElementById("menuUsername");
    const changePhotoBtn = document.getElementById("changePhotoBtn");
    const logoutBtn = document.getElementById("logoutBtn");
    const deletePhotoBtn = document.getElementById("deletePhotoBtn");
    const photoInput = document.getElementById("photoInput");
    const defaultPhoto = "userPhoto.jpg";

    // -------- VALIDATION HELPERS --------
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function isUmail(email) {
        return email.endsWith("@umail.com");
    }

    function isStrongPassword(password) {
        // At least 8 chars, must include number, letter, and a special character
        return /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/.test(password);
    }

    // ---------------- UPDATE UI ----------------
    function updateUI() {
        if (!signUpBtn || !loginBtn) return; 

        signUpBtn.style.display = "none";
        loginBtn.style.display = "none";
        if (changePhotoBtn) changePhotoBtn.style.display = "none";
        if (logoutBtn) logoutBtn.style.display = "none";
        if (deletePhotoBtn) deletePhotoBtn.style.display = "none";
        if (menuUsername) menuUsername.style.display = "none";

        if (currentUser) {
            if (profilePic) profilePic.src = currentUser.photo || defaultPhoto;
            if (popupProfilePic) popupProfilePic.src = currentUser.photo || defaultPhoto;
            if (menuUsername) {
                menuUsername.textContent = "Hi, " + currentUser.username;
                menuUsername.style.display = "block";
            }
            if (changePhotoBtn) changePhotoBtn.style.display = "block";
            if (logoutBtn) logoutBtn.style.display = "block";

            if (currentUser.photo && currentUser.photo !== defaultPhoto && deletePhotoBtn)
                deletePhotoBtn.style.display = "block";

        } else {
            if (profilePic) profilePic.src = defaultPhoto;
            if (popupProfilePic) popupProfilePic.src = defaultPhoto;
            signUpBtn.style.display = "block";
            loginBtn.style.display = "block";
        }
    }

    updateUI();

    // ---------------- MENU & POPUP ----------------
    if (btnMenu) {
        btnMenu.addEventListener("click", e => {
            e.stopPropagation();
            menubox.style.display = menubox.style.display === "block" ? "none" : "block";
        });
    }

    document.addEventListener("click", () => {
        if (menubox) menubox.style.display = "none";
    });

    if (profilePic) {
        profilePic.addEventListener("click", e => {
            e.stopPropagation();
            profilePopup.style.display = "flex";
        });
    }

    if (profilePopup) {
        profilePopup.addEventListener("click", e => {
            if (e.target === profilePopup) profilePopup.style.display = "none";
        });
    }

    // ---------------- SIGN UP (STRICT LOOP) ----------------
    if (signUpBtn) {
        signUpBtn.addEventListener("click", function () {
            let valid = false;
            let username, email, password;

            while (!valid) {
                // 1. Username Validation (Min 3 characters)
                username = prompt("Enter username (At least 3 characters):")?.trim();
                if (username === null) break; 
                if (username.length < 3) {
                    alert("❌ Error: Username must be 3 or more characters.");
                    continue;
                }

                // 2. Email Validation (Min 8 letters before domain)
                let rawEmail = prompt("Enter email prefix (At least 8 letters, @umail.com added automatically):")?.trim().toLowerCase();
                if (rawEmail === null) break; 

                // Ensure domain is present
                email = rawEmail.endsWith("@umail.com") ? rawEmail : rawEmail + "@umail.com";
                let prefix = email.split('@')[0];

                if (prefix.length < 8 || !isValidEmail(email)) {
                    alert("❌ Error: Email prefix must be at least 8 characters long.");
                    continue;
                }

                if (users.some(u => u.username === username || u.email === email)) {
                    alert("❌ Error: Username or Email already exists.");
                    continue;
                }

                // 3. Password Validation (Strong Requirements)
                password = prompt("Create password (Min 8 characters, must include a Number, Letter, & Symbol):");
                if (password === null) break;
                if (!isStrongPassword(password)) {
                    alert("❌ Error: Password is too weak! Use 8+ chars with numbers, letters, and symbols.");
                    continue;
                }

                // SUCCESS: Save and Exit
                valid = true;
                const newUser = { username, email, password, photo: defaultPhoto };
                users.push(newUser);
                localStorage.setItem("users", JSON.stringify(users));
                currentUser = newUser;
                localStorage.setItem("currentUser", JSON.stringify(currentUser));

                alert("✅ Welcome! Sign up successful.");
                updateUI();
                location.reload();
            }
        });
    }

    // ---------------- LOGIN ----------------
    if (loginBtn) {
        loginBtn.addEventListener("click", function () {
            let emailInput = prompt("Enter your umail id:")?.trim().toLowerCase();
            if (!emailInput) return;
            if (!emailInput.endsWith("@umail.com")) emailInput += "@umail.com";

            let passwordInput = prompt("Enter password:");
            if (!passwordInput) return;

            const user = users.find(u => 
                u.email.toLowerCase() === emailInput && u.password === passwordInput
            );

            if (!user) {
                alert("❌ Invalid email or password.");
                return;
            }

            currentUser = user;
            localStorage.setItem("currentUser", JSON.stringify(user));
            updateUI();
            alert("✅ Welcome back, " + user.username + "!");
            location.reload(); 
        });
    }

    // ---------------- PHOTO HANDLING ----------------
    if (changePhotoBtn && photoInput) {
        changePhotoBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            photoInput.click();
        });

        photoInput.addEventListener("change", function () {
            const file = this.files[0];
            if (!file || !currentUser) return;

            const reader = new FileReader();
            reader.onload = function () {
                const base64Photo = reader.result;
                currentUser.photo = base64Photo;
                users = users.map(u => 
                    u.email === currentUser.email ? { ...u, photo: base64Photo } : u
                );
                localStorage.setItem("users", JSON.stringify(users));
                localStorage.setItem("currentUser", JSON.stringify(currentUser));
                if (profilePic) profilePic.src = base64Photo;
                if (popupProfilePic) popupProfilePic.src = base64Photo;
                alert("Photo updated successfully!");
                updateUI();
            };
            reader.readAsDataURL(file);
        });
    }

    if (deletePhotoBtn) {
        deletePhotoBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            if (!currentUser || !confirm("Are you sure you want to delete your profile photo?")) return;
            currentUser.photo = defaultPhoto;
            users = users.map(u => 
                u.email === currentUser.email ? { ...u, photo: defaultPhoto } : u
            );
            localStorage.setItem("users", JSON.stringify(users));
            localStorage.setItem("currentUser", JSON.stringify(currentUser));
            if (profilePic) profilePic.src = defaultPhoto;
            if (popupProfilePic) popupProfilePic.src = defaultPhoto;
            alert("Photo deleted successfully!");
            updateUI();
        });
    }

    // ---------------- LOGOUT ----------------
    if (logoutBtn) {
        logoutBtn.addEventListener("click", function () {
            if (confirm("Are you sure you want to log out?")) {
                localStorage.removeItem("currentUser");
                currentUser = null;
                updateUI();
                window.location.href = "universe.html"; 
            }
        });
    }

    // ---------------- NAVIGATION ----------------
    function setupNavigation(selector, url) {
        document.querySelectorAll(selector).forEach(btn => {
            btn.addEventListener("click", () => {
                window.location.href = url;
            });
        });
    }

    setupNavigation(".info-btn", "information.html");
    setupNavigation(".ear", "the earth.html");
    setupNavigation(".gala-btn", "galaxy.html");
    setupNavigation(".sol-btn", "solar system.html");
    setupNavigation(".q-btn", "quiz.html");

});
document.addEventListener("DOMContentLoaded", function () {

    // ---------------- 1. DATA & STATE ----------------
    let users = JSON.parse(localStorage.getItem("users")) || [];
    let currentUser = JSON.parse(localStorage.getItem("currentUser")) || null;
    let userChoices = []; 
    let score = 0;
    let currentQuiz = 0;
    const defaultPhoto = "userPhoto.jpg";

    const fullQuizData = [
        { question: "What is the universe?", options: ["All space, time, matter, energy", "Only the Earth", "Just our Solar System", "A void of nothingness"], answer: "All space, time, matter, energy" },
        { question: "What is the approximate age of the universe?", options: ["13.8 billion years", "4.6 billion years", "93 billion years", "2026 years"], answer: "13.8 billion years" },
        { question: "How large is the observable universe?", options: ["93 billion light-years", "13.8 billion light-years", "Infinity", "500 miles"], answer: "93 billion light-years" },
        { question: "The expansion of the universe is currently:", options: ["Accelerating", "Slowing down", "Stopped", "Reversing"], answer: "Accelerating" },
        { question: "The Big Bang was not an explosion in space, but an:", options: ["Expansion of space", "Implosion of matter", "Electrical spark", "Orbiting planet"], answer: "Expansion of space" },
        { question: "What percentage of the universe is Dark Energy?", options: ["68%", "27%", "5%", "99%"], answer: "68%" },
        { question: "What percentage of the universe is Dark Matter?", options: ["27%", "68%", "5%", "0.04%"], answer: "27%" },
        { question: "Everything we see (stars, planets, coffee) makes up what %?", options: ["5%", "27%", "68%", "78%"], answer: "5%" },
        { question: "Dark matter is detected through its:", options: ["Gravity", "Light emission", "Heat", "Sound"], answer: "Gravity" },
        { question: "What holds galaxies together like 'invisible scaffolding'?", options: ["Dark Matter", "Dark Energy", "Nebulae", "Strong Nuclear Force"], answer: "Dark Matter" },
        { question: "Which force shapes galaxies and orbits?", options: ["Gravity", "Electromagnetism", "Strong Nuclear", "Weak Nuclear"], answer: "Gravity" },
        { question: "What are galaxies?", options: ["Systems of stars, gas, and dust", "Single stars", "Clouds of only gas", "Empty space"], answer: "Systems of stars, gas, and dust" },
        { question: "What is a nebula?", options: ["A cloud where stars form", "A dead star", "A planet with rings", "A black hole's edge"], answer: "A cloud where stars form" },
        { question: "The Solar System formed about how long ago?", options: ["4.6 billion years", "13.8 billion years", "4.54 billion years", "100 million years"], answer: "4.6 billion years" },
        { question: "Which planet is the smallest?", options: ["Mercury", "Mars", "Earth", "Pluto"], answer: "Mercury" },
        { question: "Which planet is the hottest due to a greenhouse effect?", options: ["Venus", "Mercury", "Mars", "Jupiter"], answer: "Venus" },
        { question: "Which planet is famous for its rings?", options: ["Saturn", "Uranus", "Neptune", "Jupiter"], answer: "Saturn" },
        { question: "Earth's atmosphere is mostly:", options: ["78% Nitrogen", "21% Nitrogen", "78% Oxygen", "100% Carbon Dioxide"], answer: "78% Nitrogen" },
        { question: "The inner most part of the Earth is called:", options: ["Core", "Crust", "Mantle", "Troposphere"], answer: "Core" },
        { question: "Earth's core is composed of:", options: ["Iron and Nickel", "Silicate rock", "Liquid Hydrogen", "Basalt"], answer: "Iron and Nickel" },
        { question: "The Mantle makes up what % of Earth's volume?", options: ["80%", "5%", "50%", "20%"], answer: "80%" },
        { question: "Where does 'weather' happen in the atmosphere?", options: ["Troposphere", "Stratosphere", "Exosphere", "Mesosphere"], answer: "Troposphere" },
        { question: "What are the four inner planets called?", options: ["Terrestrial planets", "Gas giants", "Ice giants", "Dwarf planets"], answer: "Terrestrial planets" },
        { question: "Which galaxy do we live in?", options: ["Milky Way", "Andromeda", "Sombrero", "Whirlpool"], answer: "Milky Way" }
    ];

    const rawQuizData = [...fullQuizData].sort(() => 0.5 - Math.random()).slice(0, 20);

    // ---------------- 2. SELECTORS ----------------
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
    const quizDiv = document.getElementById("quiz");
    const nextBtn = document.getElementById("nextBtn");

    // ---------------- 3. NAVIGATION ----------------
    const navLinks = {
        ".info-btn": "information.html",
        ".home": "universe.html",
        ".gala-btn": "galaxy.html",
        ".sol-btn": "solar system.html",
        ".ear": "the earth"
    };

    Object.entries(navLinks).forEach(([selector, url]) => {
        document.querySelectorAll(selector).forEach(btn => {
            btn.onclick = () => window.location.href = url;
        });
    });

    // ---------------- 4. UI & AUTH ----------------

    function isStrongPassword(password) {
        // At least 8 digits, includes number, letter, and symbol
        const regex = /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
        return regex.test(password);
    }

    function updateUI() {
        if (currentUser) {
            if (signUpBtn) signUpBtn.style.display = "none";
            if (loginBtn) loginBtn.style.display = "none";
            if (logoutBtn) logoutBtn.style.display = "block";
            if (changePhotoBtn) changePhotoBtn.style.display = "block";
            if (menuUsername) {
                menuUsername.textContent = "Hi, " + currentUser.username;
                menuUsername.style.display = "block";
            }
            if (profilePic) profilePic.src = currentUser.photo || defaultPhoto;
            if (popupProfilePic) popupProfilePic.src = currentUser.photo || defaultPhoto;
            if (deletePhotoBtn) deletePhotoBtn.style.display = (currentUser.photo && currentUser.photo !== defaultPhoto) ? "block" : "none";
        } else {
            if (signUpBtn) signUpBtn.style.display = "block";
            if (loginBtn) loginBtn.style.display = "block";
            if (logoutBtn) logoutBtn.style.display = "none";
            if (changePhotoBtn) changePhotoBtn.style.display = "none";
            if (deletePhotoBtn) deletePhotoBtn.style.display = "none";
            if (menuUsername) menuUsername.style.display = "none";
            if (profilePic) profilePic.src = defaultPhoto;
            if (popupProfilePic) popupProfilePic.src = defaultPhoto;
        }
    }
    updateUI();

    if (signUpBtn) {
        signUpBtn.onclick = () => {
            let valid = false;
            let name, email, pass;

            while (!valid) {
                // 1. Username Prompt (Min 3)
                name = prompt("Enter Username (At least 3 characters):");
                if (name === null) break; 
                if (name.length < 3) {
                    alert("Error: Username must be at least 3 characters!");
                    continue; 
                }

                // 2. Email Prompt (Min 8 before domain)
                let rawEmail = prompt("Enter Email (At least 8 letters, @umail.com auto-added):");
                if (rawEmail === null) break;
                
                email = rawEmail.toLowerCase();
                if (!email.endsWith("@umail.com")) {
                    email = email + "@umail.com";
                }
                
                let prefix = email.split('@')[0];
                if (prefix.length < 8) {
                    alert("Error: Email name must be at least 8 letters long!");
                    continue;
                }
                if (users.some(u => u.email === email)) {
                    alert("Error: This email already exists!");
                    continue;
                }

                // 3. Password Prompt (Strong validation)
                pass = prompt("Enter Password (Min 8 chars, must have letter, number, & symbol):");
                if (pass === null) break;
                if (!isStrongPassword(pass)) {
                    alert("Error: Weak Password! Ensure it has 8+ characters, a number, a letter, and a symbol.");
                    continue;
                }

                // If code reaches here, all data is valid
                valid = true;
                const newUser = { username: name, email, password: pass, photo: defaultPhoto };
                users.push(newUser);
                localStorage.setItem("users", JSON.stringify(users));
                currentUser = newUser;
                localStorage.setItem("currentUser", JSON.stringify(currentUser));
                alert("Welcome! Sign up complete.");
                location.reload();
            }
        };
    }

    if (loginBtn) {
        loginBtn.onclick = () => {
            let emailInput = prompt("Email:")?.toLowerCase();
            if (emailInput === null) return;
            if (emailInput && !emailInput.endsWith("@umail.com")) emailInput += "@umail.com";
            
            let pass = prompt("Password:");
            if (pass === null) return;

            const user = users.find(u => u.email === emailInput && u.password === pass);
            if (user) {
                currentUser = user;
                localStorage.setItem("currentUser", JSON.stringify(user));
                location.reload();
            } else alert("Invalid Email or Password");
        };
    }

    if (logoutBtn) {
        logoutBtn.onclick = () => { if(confirm("Logout?")) { localStorage.removeItem("currentUser"); location.reload(); } };
    }

    if (changePhotoBtn) {
        changePhotoBtn.onclick = () => photoInput.click();
        photoInput.onchange = function() {
            const reader = new FileReader();
            reader.onload = () => {
                currentUser.photo = reader.result;
                users = users.map(u => u.email === currentUser.email ? {...u, photo: reader.result} : u);
                localStorage.setItem("users", JSON.stringify(users));
                localStorage.setItem("currentUser", JSON.stringify(currentUser));
                updateUI();
            };
            reader.readAsDataURL(this.files[0]);
        };
    }

    if (deletePhotoBtn) {
        deletePhotoBtn.onclick = () => {
            if (currentUser && confirm("Delete your profile photo?")) {
                currentUser.photo = defaultPhoto;
                users = users.map(u => u.email === currentUser.email ? {...u, photo: defaultPhoto} : u);
                localStorage.setItem("users", JSON.stringify(users));
                localStorage.setItem("currentUser", JSON.stringify(currentUser));
                updateUI();
            }
        };
    }

    // ---------------- 5. QUIZ LOGIC ----------------

    function restartQuiz() {
        score = 0;
        currentQuiz = 0;
        userChoices = [];
        loadQuiz();
    }

    function showFinishedScreen() {
        quizDiv.innerHTML = `
            <div class="quiz-finish-container" style="display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; min-height: 200px; color: white;">
                <h2 style="color: gold;">Quiz Finished!</h2>
                <p style="font-size: 1.5rem; margin: 15px 0;">Score: ${score} / ${rawQuizData.length}</p>
                <button id="showRev" class="opt review-btn" style="width: 200px; margin-top: 310px; margin-left:0px;">Review Answers</button>
                <button id="restartBtn" class="opt restart-btn" style="width: 200px; margin-top: 370px; margin-left:0px;">Restart Quiz</button>
            </div>`;
        
        document.getElementById("showRev").onclick = showReview;
        document.getElementById("restartBtn").onclick = restartQuiz;

        if (nextBtn) nextBtn.style.display = "none";
    }

    function loadQuiz() {
        if (!quizDiv) return;

        if (!currentUser) {
            quizDiv.innerHTML = `<h3 style="color:white; text-align:center;">Please Login to start the Quiz.</h3>`;
            if (nextBtn) nextBtn.style.display = "none";
            return;
        }

        if (currentQuiz >= rawQuizData.length) {
            showFinishedScreen();
            return;
        }

        const q = rawQuizData[currentQuiz];
        const shuffled = [...q.options].sort(() => Math.random() - 0.5);

        quizDiv.innerHTML = `
            <div class="question-text" style="color:white; margin-bottom:15px;">
                <p>Question ${currentQuiz + 1} of ${rawQuizData.length}</p>
                <h3 style="color:gold;">${q.question}</h3>
            </div>
            <div class="options-container">
                <button id="q101" class="opt">${shuffled[0]}</button>
                <button id="q102" class="opt">${shuffled[1]}</button>
                <button id="q103" class="opt">${shuffled[2]}</button>
                <button id="q104" class="opt">${shuffled[3]}</button>
            </div>`;

        ["q101", "q102", "q103", "q104"].forEach(id => {
            const btn = document.getElementById(id);
            btn.onclick = () => {
                const isRight = (btn.textContent === q.answer);
                userChoices.push({ q: q.question, picked: btn.textContent, correct: q.answer, isRight: isRight });

                btn.style.background = isRight ? "green" : "red";
                if (isRight) score++;
                document.querySelectorAll(".opt").forEach(b => b.disabled = true);

                setTimeout(() => {
                    currentQuiz++;
                    loadQuiz();
                }, 1000);
            };
        });
    }

    function showReview() {
        let h = `<h2 style="color: gold; text-align: center;">Review Your Answers</h2>
                 <div id="reviewScroll" style="text-align:left; max-height:300px; overflow-y:auto; color:white; padding:10px; border:1px solid #444; margin-bottom: 20px; background: rgba(0,0,0,0.2);">`;
        
        userChoices.forEach((c, i) => {
            h += `
                <div style="margin-bottom:15px; border-bottom:1px solid #555; padding-bottom:5px;">
                    <p><strong>${i+1}. ${c.q}</strong></p>
                    <p style="color:${c.isRight?'#0f0':'#f44'}">Your Answer: ${c.picked}</p>
                    ${!c.isRight ? `<p style="color:#0f0">Correct Answer: ${c.correct}</p>` : ''}
                </div>`;
        });
        
        h += `</div>
              <div style="display: flex; justify-content: center; width: 100%;">
                  <button id="backBtnActual" class="opt" >Back</button>
              </div>`;
        
        quizDiv.innerHTML = h;

        document.getElementById("backBtnActual").onclick = function() {
            showFinishedScreen();
        };
    }

    // ---------------- 6. POPUPS & INIT ----------------
    if (btnMenu) btnMenu.onclick = (e) => { e.stopPropagation(); menubox.style.display = (menubox.style.display === "block") ? "none" : "block"; };
    if (profilePic) profilePic.onclick = (e) => { e.stopPropagation(); profilePopup.style.display = "flex"; };
    
    window.onclick = () => { 
        if (menubox) menubox.style.display = "none"; 
        if (profilePopup) profilePopup.style.display = "none"; 
    };

    loadQuiz();
});
// Global variables
let timerInterval;
let typewriterSound;
let typewriterInterval
let bossTalkingInterval; // Global variable to store the interval
let bossVoiceSound; // Global variable to store the boss voice sound

let currentLevel = 0;
let amountOfPosts = 10;
let correctPosts = 0;
let incorrectPosts = 0;
let backgroundMusic;
let musicLoopInterval;


function showMenu() {
    const gameContainer = document.querySelector('.game-container');
    const menu = document.querySelector('.menu');
    const helpSidebar = document.getElementById('help-sidebar');
    const helpButton = document.getElementById('help-button');

    // Show the menu and hide the game container
    menu.style.display = 'block';
    gameContainer.style.display = 'none';

    // Hide the help sidebar and button
    helpSidebar.style.display = 'none';
    helpButton.style.display = 'none';
}

function startGame() {
    const menu = document.querySelector('.menu');
    const introScreen = document.getElementById('first-page-container');
    const titleElement = document.querySelector('.first-page-title');
    const textElement = document.querySelector('.first-page-text');
    const continueButton = document.querySelector('.start-button');
    const helpSidebar = document.getElementById('help-sidebar'); 
    const helpButton = document.getElementById('help-button'); 

    // Hide the menu and show the introductory screen
    menu.style.display = 'none';
    introScreen.style.display = 'flex';

    // Hide the "Continue" button initially
    continueButton.style.display = 'none';

    // Hide the help sidebar and button on the intro screen
    helpSidebar.style.display = 'none';
    helpButton.style.display = 'none';

    // Start the background music
    playBackgroundMusic();

    // Apply the typewriter effect to the title
    typeWriter("Welcome, Media Controller.", 'first-page-title', 120, () => {
        // After the title finishes, apply the typewriter effect to the text
        typeWriter(
            "Step into the control room. The world's media flows through your hands. Your decisions will shape perception, a profound responsibility.",
            'first-page-text',
            80,
            () => {
                // Show the "Continue" button after the text finishes
                continueButton.style.display = 'block';
            }
        );
    });
}

function acceptPost(postId) {
    const post = document.getElementById(postId);

    if (post) {
        // Play the "Correct" sound effect
        const correctSound = new Audio('assets/audio/Correct.mp3');
        correctSound.volume = 1.0;
        correctSound.currentTime = 1.0;
        correctSound.play().catch(error => console.error("Audio playback error:", error));

        // Stop the sound after 1 second
        setTimeout(() => {
            correctSound.pause();
            correctSound.currentTime = 1.0; // Reset the sound to the beginning
        }, 1000); // Stop after 1 second

        // Remove buttons
        const buttons = post.querySelectorAll('button');
        buttons.forEach(button => button.remove());

        // Add a green checkmark
        const checkmark = document.createElement('div');
        checkmark.textContent = '✔';
        checkmark.style.color = 'green';
        checkmark.style.fontSize = '2rem';
        checkmark.style.fontWeight = 'bold';
        checkmark.style.textAlign = 'center';
        post.appendChild(checkmark);

        // Optional: Add a success animation (e.g., fade-in for the checkmark)
        checkmark.style.opacity = '0';
        checkmark.style.transition = 'opacity 0.5s ease';
        setTimeout(() => {
            checkmark.style.opacity = '1';
        }, 10);

        updateOrder(postId, 'accept-posts');
    }
}

function denyPost(postId) {
    const post = document.getElementById(postId);

    if (post) {
        // Play the "Wrong" sound effect
        const wrongSound = new Audio('assets/audio/Wrong.mp3');
        wrongSound.volume = 1.0;
        wrongSound.currentTime = 4.0;
        wrongSound.play().catch(error => console.error("Audio playback error:", error));

        // Stop the sound after 1 second
        setTimeout(() => {
            wrongSound.pause();
            wrongSound.currentTime = 4.0; // Reset the sound to the beginning
        }, 1000); // Stop after 1 second

        post.style.height = '75px';
        post.offsetHeight;
        // Add a closing animation
        post.style.transition = 'opacity 1s ease, height 0.8s ease, margin 1s ease, padding 1s ease';
        post.style.opacity = '0';
        post.style.height = '0';
        post.style.margin = '0';
        post.style.padding = '0';
        post.style.overflow = 'hidden';

        // Remove the post from the DOM after the animation
        setTimeout(() => {
            post.remove();
        }, 1000);

        updateOrder(postId, 'deny-posts');
    }
}

function updateOrder(postId, field) {
    // Find all orders
    const orders = document.querySelectorAll('#orders-container .post');

    orders.forEach(order => {
        const acceptPosts = order.getAttribute('accept-posts')?.split(' ') || [];
        const denyPosts = order.getAttribute('deny-posts')?.split(' ') || [];

        if (field === 'accept-posts' && acceptPosts.includes(postId)) {
            correctPosts++;
            incorrectPosts--;
            // Remove the postId from accept-posts
            const updatedAcceptPosts = acceptPosts.filter(id => id !== postId);
            order.setAttribute('accept-posts', updatedAcceptPosts.join(' '));
        } else if (field === 'deny-posts' && denyPosts.includes(postId)) {
            correctPosts++;
            incorrectPosts--;
            // Remove the postId from deny-posts
            const updatedDenyPosts = denyPosts.filter(id => id !== postId);
            order.setAttribute('deny-posts', updatedDenyPosts.join(' '));
        } else {
        }

        // If the order has no more IDs in both fields, highlight and remove it
        if (
            order.getAttribute('accept-posts') === '' &&
            order.getAttribute('deny-posts') === ''
        ) {
            highlightAndRemoveOrder(order);
        }
    });

    console.log(`Correct posts: ${correctPosts}`);
    console.log(`Incorrect posts: ${incorrectPosts}`);
}

function highlightAndRemoveOrder(order) {
    // Highlight the order in dark grey
    order.style.transition = 'background-color 0.5s ease';
    order.style.backgroundColor = 'darkgrey';

    // Remove the order after a short delay
    setTimeout(() => {
        order.remove();

        const allOrdersCompleted = document.querySelectorAll('#orders-container .post').length === 0;
        if (allOrdersCompleted) {
            const finishButton = document.querySelector('.finish-day-button');
            finishButton.classList.add('glow-effect'); // Add the glow effect class
        }
    }, 1000);
}

function highlightAndRemoveTask(postId) {
    // Find the task in the orderbook linked to the post
    const task = document.querySelector(`[connected-post="${postId}"]`);
    if (task) {
        // Highlight the task in dark grey
        task.style.transition = 'background-color 0.5s ease';
        task.style.backgroundColor = 'darkgrey';

        // Remove the task after a short delay
        setTimeout(() => {
            task.remove();
        }, 1000);
    } else {
        console.error(`Task with connected-post="${postId}" not found.`);
    }
}

function addButtonsToPosts() {
    console.log("Adding buttons to posts...");
    // Select all posts
    const posts = document.querySelectorAll('#post-board-container .post');

    posts.forEach(post => {
        const postId = post.id;

        // Create a container for the buttons
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'button-container';

        // Create Accept button
        const acceptButton = document.createElement('button');
        acceptButton.textContent = 'Accept';
        acceptButton.className = 'accept-button button';
        acceptButton.onclick = () => acceptPost(postId);

        // Create Deny button
        const denyButton = document.createElement('button');
        denyButton.textContent = 'Deny';
        denyButton.className = 'deny-button button';
        denyButton.onclick = () => denyPost(postId);

        // Append buttons to the container
        buttonContainer.appendChild(acceptButton);
        buttonContainer.appendChild(denyButton);

        // Append the button container to the post
        post.appendChild(buttonContainer);
    });
}

function bossTalkAnimation() {
    const bossImage = document.querySelector('.boss-image');
    const bossTextElement = document.getElementById('boss-overlay-text');

    // Create or reset the boss voice sound
    if (!bossVoiceSound) {
        bossVoiceSound = new Audio('assets/audio/boss-voice.mp3');
    }
    bossVoiceSound.volume = 0.6; // Set the volume to 100%
    bossVoiceSound.loop = true; // Enable looping for the sound

    // Pause the background music
    if (backgroundMusic && !backgroundMusic.paused) {
        backgroundMusic.pause();


    let text = "Great job! Let's move on to the next level.";
    switch (incorrectPosts) {
        case 0:
            text = "Great job! Let's move on to the next task.";
            break;
        case 1:
            text = "You better be careful. Our masters dont like underachievers.";
            break;
        case 2:
            text = "If you keep performing like this, you won't last long.";
            break; s
        default:
            text = "This is unacceptable.";
    }
    let index = 0;

    // Clear any existing text
    bossTextElement.textContent = '';

    // Start playing the boss voice sound
    bossVoiceSound.currentTime = 2.0; // Start from the beginning
    bossVoiceSound.play().catch(error => console.error("Audio playback error:", error));

    // Start the animation
    bossTalkingInterval = setInterval(() => {
        if (index < text.length) {
            // Switch the boss image to simulate talking
            bossImage.src = bossImage.src.includes('boss_shut.png') ? 'assets/boss_open.png' : 'assets/boss_shut.png';

            // Add the next character to the text
            bossTextElement.textContent += text[index];
            index++;
        } else {
            // Stop the animation when the text is fully written
            clearInterval(bossTalkingInterval);
            bossImage.src = 'assets/boss_shut.png'; // Ensure the boss ends with a closed mouth

            // Stop the boss voice sound
            bossVoiceSound.pause();
            bossVoiceSound.currentTime = 0; // Reset the sound to the beginning

            // Resume the background music
            if (backgroundMusic && backgroundMusic.paused) {
                backgroundMusic.play().catch(error => console.error("Audio playback error:", error));
            }
        }
    }, 150); // Adjust the interval for the desired speed
}

function goToLoadingPage() {
    console.log("Go to Loading page...");
    const introScreen = document.getElementById('first-page-container');
    const gameContainer = document.querySelector('.game-container');

    //stop the typewriter sound
    if (typewriterSound) {
        console.log("Stopping typewriter sound...");
        typewriterSound.volume = 0.0; // Mute the sound
        typewriterSound.pause();
        typewriterSound.currentTime = 0; // Reset the sound to the beginning
    }

    // Hide the introductory screen and show the game container
    introScreen.style.display = 'none';
    gameContainer.style.display = 'grid';

    // Start the game by showing the loading screen and loading the first level
    showLoadingScreen();
    loadLevel();
}

function showLoadingScreen() {
    const overlay = document.getElementById('screen-overlay');
    const button = document.getElementById('continue-button');
    overlay.style.visibility = 'visible';
    overlay.style.opacity = '1'; // Fade in

    // Start the typewriter effect with the level number
    typeWriter(`Loading Level ${currentLevel}...`, 'screen-overlay-text', 100, () => {
        console.log('Typing complete!');
    });

    setTimeout(() => {
        console.log("button vis...");
        button.style.visibility = 'visible';
        button.style.opacity = '1';
    }, 2000);
}

function showPerformanceScreen() {
    const overlay = document.getElementById('results-screen');
    overlay.style.visibility = 'visible';
    overlay.style.opacity = '1'; // Fade in

    // Start the typewriter effect with the level number
    typeWriter(`${correctPosts}`, 'correct-answers-count', 100, () => {
        console.log('Typing complete!');
    });
    setTimeout(() => {
        typeWriter(`${incorrectPosts}`, 'incorrect-answers-count', 100, () => {
            console.log('Typing complete!');
        });
        setTimeout(() => {
            typeWriter(`${timerInterval}`, 'time-needed', 100, () => {
                console.log('Typing complete!');
            });
        }, 1000);
    }, 1000);

    setTimeout(() => {
        bossTalkAnimation(incorrectPosts);
    }, 2000); // Wait for the fade-in animation to complete

}

function hideOverlay() {
    const overlay = document.getElementById('screen-overlay');
    overlay.style.transition = 'opacity 1s ease';
    overlay.style.opacity = '0'; // Fade out

    const timerElement = document.getElementById('timer');
    timerElement.textContent = "2:00";

    // Stop the typewriter sound
    if (typewriterSound) {
        typewriterSound.pause();
        typewriterSound.currentTime = 0; // Reset the sound to the beginning
    }

    // Clear the typewriter interval
    if (typewriterInterval) {
        clearInterval(typewriterInterval);
    }

    // Clear the existing timer
    if (timerInterval) {
        clearInterval(timerInterval);
    }

    startCountdown(120); // 120 seconds = 2 minutes

    setTimeout(() => {
        overlay.style.visibility = 'hidden';

        //Posts have to be calulated here
        const feed = document.querySelector('feed');
        const posts = feed.querySelectorAll('.post');
        amountOfPosts = posts.length;
        console.log(`Amount of posts: ${amountOfPosts}`);
        incorrectPosts = amountOfPosts;
        const button = document.getElementById('continue-button');
        button.style.opacity = '0';

    }, 1000); // Wait for the fade-out animation to complete
}

function loadLevel() {
    console.log(`Loading ${currentLevel}...`);

    const helpSidebar = document.getElementById('help-sidebar');
    const helpButton = document.getElementById('help-button');

    // Show the help sidebar and button on level pages
    helpSidebar.style.display = 'block';
    helpButton.style.display = 'block';

    title = document.getElementById('title');
    title.innerHTML = `Level ${currentLevel}`;
    // Load the specified level's HTML into the feed container
    fetch(`levels/level${currentLevel}.html`)
        .then(response => response.text())
        .then(html => {
            document.getElementById('post-board-container').innerHTML = html;
            // Add buttons to the new posts
            addButtonsToPosts();
        })
        .catch(error => console.error(`Error loading level ${currentLevel}:`, error));

    // Load the specified level's orderbook HTML into the orders container
    fetch(`orderbook/orderbook-level${currentLevel}.html`)
        .then(response => response.text())
        .then(html => {
            document.getElementById('orders-container').innerHTML = html;
        })
        .catch(error => console.error(`Error loading orderbook for level ${currentLevel}:`, error));
}

function startNewDay() {
    currentLevel++;
    // Reset variables for the new day
    correctPosts = 0;
    console.log(`Starting a new day ${currentLevel}...`);
    //update background image depending on level
    switch (currentLevel) {
        case 1:
            document.querySelector('.game-container').style.backgroundImage = "url('assets/Room.png')";
            break;
        case 2:
            document.querySelector('.game-container').style.backgroundImage = "url('assets/room2.png')";
            break;
        case 3:
            document.querySelector('.game-container').style.backgroundImage = "url('assets/room3.png')";
            break;
        case 4:
            document.querySelector('.game-container').style.backgroundImage = "url('assets/room4.png')";
            break;
    }

    // Stop boss talking if it's still running
    if (bossTalkingInterval) {
        clearInterval(bossTalkingInterval);
    }
    if (bossVoiceSound) {
        bossVoiceSound.pause();
        bossVoiceSound.currentTime = 0; // Reset the sound to the beginning
    }
    //hide performance screen with delay
    showLoadingScreen(currentLevel);
    loadLevel();

    const overlay = document.getElementById('results-screen');
    overlay.style.opacity = '0'; // Fade out

    setTimeout(() => {
        overlay.style.visibility = 'hidden';
    }, 1000);
}

function finishYourDay() {
    console.log(`Finishing your day ${currentLevel}...`);

    if (currentLevel === 5) {
        // Show the Game Over screen if it's the end of Level 3
        showEndPage();
        return; // Stop further execution
    }

    // Clear the existing timer
    if (timerInterval) {
        clearInterval(timerInterval);
    }

    showPerformanceScreen();

    // Load the specified level's HTML into the feed container
    fetch(`levels/level${currentLevel}.html`) // Ensure the file path matches the format
        .then(response => response.text())
        .then(html => {
            document.getElementById('post-board-container').innerHTML = html;

            // Add buttons to the new posts
            addButtonsToPosts();
        })
        .catch(error => console.error(`Error loading ${currentLevel}:`, error));

    // Load the specified level's orderbook HTML into the orders container
    fetch(`orderbook/orderbook-level${currentLevel}.html`)
        .then(response => response.text())
        .then(html => {
            document.getElementById('orders-container').innerHTML = html;
        })
        .catch(error => console.error(`Error loading orderbook for ${currentLevel}:`, error));
}

function showGameOver() {
    console.log("Game Over...");

    const helpSidebar = document.getElementById('help-sidebar');
    const helpButton = document.getElementById('help-button');

    // Hide the help sidebar and button
    helpSidebar.style.display = 'none';
    helpButton.style.display = 'none';

    // Stop the background music
    stopBackgroundMusic();

    // Hide the game container and menu
    document.querySelector('.game-container').style.display = 'none';
    document.querySelector('.menu').style.display = 'none';

    // Show the Game Over screen
    const gameOverScreen = document.getElementById('game-over-screen');
    gameOverScreen.style.display = 'flex';
    gameOverScreen.style.flexDirection = 'column';
    gameOverScreen.style.alignItems = 'center';
    gameOverScreen.style.justifyContent = 'center';
    gameOverScreen.style.height = '100vh';
    gameOverScreen.style.backgroundColor = '#000';
    gameOverScreen.style.color = '#fff';
    gameOverScreen.style.fontFamily = "'Press Start 2P', cursive";
}

function addParallaxEffectToLeft() {
    const leftElement = document.querySelector('left');
    const gameContainer = document.querySelector('.game-container');

    leftElement.addEventListener('mousemove', (event) => {
        const rect = leftElement.getBoundingClientRect();
        const mouseX = event.clientX - rect.left; // Mouse X position relative to <left>
        const mouseY = event.clientY - rect.top;  // Mouse Y position relative to <left>

        const percentX = (mouseX / rect.width) * 50; // Percentage across the width
        const percentY = (mouseY / rect.height) * 800; // Percentage across the height

        // Adjust the background position based on mouse position
        gameContainer.style.backgroundPosition = `${50 + (percentX - 50) / 10}% ${50 + (percentY - 50) / 10}%`;
    });

    leftElement.addEventListener('mouseleave', () => {
        // Reset the background position when the mouse leaves
        leftElement.style.backgroundPosition = '50% 50%';
    });
}

// Call the function to enable the parallax effect
addParallaxEffectToLeft();

function restartGame() {
    console.log("Restarting game...");

    // Reset the current level to 1
    currentLevel = 1;

    // Hide the Game Over screen
    const gameOverScreen = document.getElementById('game-over-screen');
    gameOverScreen.style.display = 'none';

    // Show the main menu
    const menu = document.querySelector('.menu');
    menu.style.display = 'block';

    // Hide the game container
    const gameContainer = document.querySelector('.game-container');
    gameContainer.style.display = 'none';

    // Clear the post board and orders container
    document.getElementById('post-board-container').innerHTML = '';
    document.getElementById('orders-container').innerHTML = '';

    console.log("Returned to the Start Game page.");
}

function startCountdown(durationInSeconds) {
    console.log("Starting countdown...");
    const timerElement = document.getElementById('timer');
    let remainingTime = durationInSeconds;

    if (timerInterval) {
        clearInterval(timerInterval);
    }

    timerInterval = setInterval(() => {
        const minutes = Math.floor(remainingTime / 60);
        const seconds = remainingTime % 60;

        // Format the time as MM:SS
        timerElement.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

        // Add flashing effect when 10 seconds or less remain
        if (remainingTime <= 10) {
            timerElement.classList.add('flash-red');
        }

        // Check if time is up
        if (remainingTime <= 0) {
            clearInterval(timerInterval); // Stop the timer
            timerElement.textContent = "Time's up!"; // Display a message
            timerElement.classList.remove('flash-red'); // Remove flashing effect
            handleTimeUp(); // Call a function when the timer ends
        }

        remainingTime--; // Decrease the remaining time
    }, 1000);
}

function handleTimeUp() {
    console.log("Time's up!");
    // Trigger game over or any other action
    showGameOver();
}

function typeWriter(text, elementId, speed = 100, callback = null) {
    const element = document.getElementById(elementId);
    let index = 0;

    // Clear any existing text
    element.textContent = '';

    // Create or reset the typewriter sound
    if (!typewriterSound) {
        typewriterSound = new Audio('assets/audio/typewriter-machine.mp3');
    }
    typewriterSound.volume = 1.0; // Set the volume to 100%

    // Pause the background music
    if (backgroundMusic && !backgroundMusic.paused) {
        backgroundMusic.pause();
    }

    if (typewriterInterval) {
        clearInterval(typewriterInterval);
    }

    typewriterInterval = setInterval(() => {
        if (index < text.length) {
            element.textContent += text[index];
            index++;

            // Play the typewriter sound starting at 3 seconds
            typewriterSound.currentTime = 3.0; // Start at 3 seconds
            typewriterSound.play().catch(error => console.error("Audio playback error:", error));
        } else {
            clearInterval(typewriterInterval); // Stop the typing effect when done

            // Stop the typewriter sound
            typewriterSound.pause();
            typewriterSound.currentTime = 0; // Reset the sound to the beginning

            // Resume the background music
            if (backgroundMusic && backgroundMusic.paused) {
                backgroundMusic.play().catch(error => console.error("Audio playback error:", error));
            }

            if (callback) callback(); // Call the callback function if provided
        }
    }, speed);
}

function showEndPage() {
    const gameContainer = document.querySelector('.game-container');
    const endPageContainer = document.getElementById('end-page-container');
    const titleElement = document.getElementById('end-page-title');
    const textElement = document.getElementById('end-page-text');
    const continueButton = document.querySelector('.end-button');
    const helpSidebar = document.getElementById('help-sidebar');
    const helpButton = document.getElementById('help-button');


    // Hide the game container and show the end page
    gameContainer.style.display = 'none';
    endPageContainer.style.display = 'flex';

    // Hide the help sidebar and button
    helpSidebar.style.display = 'none';
    helpButton.style.display = 'none';

    // Hide the "Continue" button initially
    continueButton.style.display = 'none';

    // Apply the typewriter effect to the title
    typeWriter("Your Job is Done.", 'end-page-title', 120, () => {
        // After the title finishes, apply the typewriter effect to the text
        typeWriter(
            "Here is all the damage you made to the world. The media you controlled shaped perceptions, influenced decisions, and left a lasting impact.",
            'end-page-text',
            80,
            () => {
                // Show the "Continue" button after the text finishes
                continueButton.style.display = 'block';
            }
        );
    });
}

function showPixartPage() {
    const endPageContainer = document.getElementById('end-page-container');
    const pixartPageContainer = document.getElementById('pixart-page-container');

    // Hide the end page and show the pixart page
    endPageContainer.style.display = 'none';
    pixartPageContainer.style.display = 'flex';

    // Add a click event listener to the pixart page to transition to the game over page
    pixartPageContainer.addEventListener('click', showGameOver);
}

function playBackgroundMusic() {
    if (!backgroundMusic) {
        backgroundMusic = new Audio('assets/audio/background.mp3');
        backgroundMusic.volume = 0.1;
        backgroundMusic.playbackRate = 0.85;
    }

    // Set the starting point of the music
    backgroundMusic.currentTime = 80; // 1 minute and 20 seconds (80 seconds)

    // Play the music
    backgroundMusic.play().catch(error => console.error("Audio playback error:", error));

    // Clear any existing interval to avoid multiple loops
    if (musicLoopInterval) {
        clearInterval(musicLoopInterval);
    }

    // Set an interval to loop the desired segment
    musicLoopInterval = setInterval(() => {
        if (backgroundMusic.currentTime >= 92) {
            backgroundMusic.currentTime = 80;
            backgroundMusic.play().catch(error => console.error("Audio playback error:", error));
        }
    }, 100); // Check every 100ms
}

function stopBackgroundMusic() {
    if (backgroundMusic) {
        backgroundMusic.pause();
        backgroundMusic.currentTime = 80;
    }

    // Clear the loop interval
    if (musicLoopInterval) {
        clearInterval(musicLoopInterval);
    }
}

function pauseBackgroundMusic() {
    if (backgroundMusic) {
        backgroundMusic.pause();
    }

    // Clear the loop interval
    if (musicLoopInterval) {
        clearInterval(musicLoopInterval);
    }
}

// Set the initial state of the Help Sidebar
function initializeHelpSidebar() {
    const helpSidebar = document.getElementById('help-sidebar');
    helpSidebar.style.right = '-400px'; // Ensure the sidebar starts off-screen
}

// Toggle Help Sidebar
function toggleHelpSidebar() {
    const helpSidebar = document.getElementById('help-sidebar');
    const isHidden = helpSidebar.style.right === '-400px';

    if (isHidden) {
        // Slide in the sidebar
        helpSidebar.style.right = '10px';
    } else {
        // Slide out the sidebar
        helpSidebar.style.right = '-400px';
    }
}

// Add event listener to the Help button
document.getElementById('help-button').addEventListener('click', toggleHelpSidebar);

// Ensure the Help Sidebar is initialized when the page loads
window.onload = () => {
    initializeHelpSidebar();
};

showMenu();
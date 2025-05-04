
function showMenu() {
    const gameContainer = document.querySelector('.game-container');
    const menu = document.querySelector('.menu');

    // Show the menu and hide the game container
    menu.style.display = 'block';
    gameContainer.style.display = 'none';
}

function startGame() {
    screenTransition("Loading Level 1...");
    const gameContainer = document.querySelector('.game-container');
    const menu = document.querySelector('.menu');

    // Hide the menu and show the game container
    menu.style.display = 'none';
    gameContainer.style.display = 'grid';

    // Load level1.html into the feed container
    fetch('levels/level1.html')
        .then(response => response.text())
        .then(html => {
            document.getElementById('post-board-container').innerHTML = html;
        
            addButtonsToPosts();
        })
        .catch(error => console.error('Error loading level1:', error));

    // Load level1.html into the feed container
    fetch('orderbook/orderbook-level1.html')
        .then(response => response.text())
        .then(html => {
            document.getElementById('orders-container').innerHTML = html;
        })
        .catch(error => console.error('Error loading level1:', error));
}

function acceptPost(postId) {
    const post = document.getElementById(postId);

    if (post) {
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

        // Highlight and remove the corresponding task
        highlightAndRemoveTask(postId);
    }
}

function denyPost(postId) {
    const post = document.getElementById(postId);

    if (post) {
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

        // Highlight and remove the corresponding task
        highlightAndRemoveTask(postId);
    }
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

function screenTransition(message) {
    document.getElementById('screen-overlay-text').textContent = message;
    const overlay = document.getElementById('screen-overlay')
    overlay.style.visibility="visible";
    overlay.style.opacity = '1'; // Fade in
    overlay.style.transition = 'opacity 1s ease';
}

function hideOverlay() {
    const overlay = document.getElementById('screen-overlay');
    overlay.style.transition = 'opacity 1s ease';
    overlay.style.opacity = '0'; // Fade out
    setTimeout(() => {
        overlay.style.visibility = 'hidden';
    }, 1000); 
}

function finishYourDay(level) {
    console.log("Finishing your day...");

    if (level.toLowerCase() === 'level 5') {
        // Show the Game Over screen if it's the end of Level 3
        showGameOver();
        return; // Stop further execution
    }

    screenTransition(`Loading ${level}...`);

    // Load the specified level's HTML into the feed container
    fetch(`levels/${level.toLowerCase().replace(' ', '')}.html`) // Ensure the file path matches the format
        .then(response => response.text())
        .then(html => {
            document.getElementById('post-board-container').innerHTML = html;

            // Add buttons to the new posts
            addButtonsToPosts();
        })
        .catch(error => console.error(`Error loading ${level}:`, error));

    // Load the specified level's orderbook HTML into the orders container
    fetch(`orderbook/orderbook-${level.toLowerCase().replace(' ', '')}.html`)
        .then(response => response.text())
        .then(html => {
            document.getElementById('orders-container').innerHTML = html;
        })
        .catch(error => console.error(`Error loading orderbook for ${level}:`, error));
}

function showGameOver() {
    console.log("Game Over...");
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

        const percentX = (mouseX / rect.width) * 200; // Percentage across the width
        const percentY = (mouseY / rect.height) * 200; // Percentage across the height

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


showMenu();
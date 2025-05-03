
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
    const posts = document.querySelectorAll('.post');

    posts.forEach(post => {
        const postId = post.id;
        // Create Spacer
        const spacer = document.createElement('div');
        spacer.className = 'spacer';
        spacer.style.width = '100%';
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

        // Append buttons to the post
        post.appendChild(spacer);
        post.appendChild(acceptButton);
        post.appendChild(denyButton);
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
    screenTransition(`Loading ${level}...`);

    // Load the specified level's HTML into the feed container
    fetch(`levels/${level}.html`)
        .then(response => response.text())
        .then(html => {
            document.getElementById('post-board-container').innerHTML = html;

            // Add buttons to the new posts
            addButtonsToPosts();
        })
        .catch(error => console.error(`Error loading ${level}:`, error));

    // Load the specified level's orderbook HTML into the orders container
    fetch(`orderbook/orderbook-${level}.html`)
        .then(response => response.text())
        .then(html => {
            document.getElementById('orders-container').innerHTML = html;
        })
        .catch(error => console.error(`Error loading orderbook for ${level}:`, error));
}


showMenu();
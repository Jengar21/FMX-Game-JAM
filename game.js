const levels = [
    [
      { text: "We’re throwing a rooftop dinner for 8! Bring wine!" },
      { text: "Solace reminds you: Crowds are chaos. Safety is solitude." },
      { text: "Anyone remember barbecues? I miss people." }
    ],
    [
      { text: "This was me and my best friend before everything changed." },
      { text: "Solace recommends daily solitude for clarity." },
      { text: "I miss hugging my sister." }
    ],
    [
      { text: "We had a quiet dinner with my parents — just four of us." },
      { text: "Throwback: graduation day with the whole class!" },
      { text: "My neighbor waved at me from across the hall. It felt... wrong." }
    ]
  ];
  
  let currentLevel = 0;
  
  function startGame() {
    document.getElementById('menu').classList.remove('active');
    document.getElementById('game').classList.add('active');
    loadLevel();
  }
  
  function loadLevel() {
    const feed = document.getElementById('feed');
    const levelDisplay = document.getElementById('levelNumber');
    feed.innerHTML = '';
    levelDisplay.textContent = currentLevel + 1;
    levels[currentLevel].forEach(post => {
      const postDiv = document.createElement('div');
      postDiv.className = 'post';
      postDiv.textContent = post.text;
      feed.appendChild(postDiv);
    });
  }
  
  function nextLevel() {
    currentLevel++;
    if (currentLevel >= levels.length) {
      alert("Thank you for playing. You've completed the prototype.");
      location.reload();
    } else {
      loadLevel();
    }
  }
  
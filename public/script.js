document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS animation library
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true
    });

    // Countdown Timer
    const countdownDate = new Date();
    countdownDate.setDate(countdownDate.getDate() + 30); // 30 days from now

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = countdownDate - now;

        // Time calculations
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Display the result
        document.getElementById('days').textContent = days.toString().padStart(2, '0');
        document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
        document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
        document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
    }

    // Update the countdown every second
    updateCountdown();
    setInterval(updateCountdown, 1000);

    // Smooth scrolling for navigation links
    function scrollToSection(id) {
        const element = document.getElementById(id);
        if (element) {
            window.scrollTo({
                top: element.offsetTop - 70,
                behavior: 'smooth'
            });
        }
    }

    // Make scrollToSection available globally
    window.scrollToSection = scrollToSection;

    // Form submission with AJAX
    const waitlistForm = document.getElementById('waitlistForm');
    const formMessage = document.getElementById('formMessage');

    waitlistForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const organization = document.getElementById('organization').value;

        // Show loading state
        const submitButton = waitlistForm.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;
        submitButton.textContent = 'Submitting...';
        submitButton.disabled = true;

        // AJAX request to the server
        fetch('/api/subscribe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, organization }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                formMessage.textContent = 'Thank you for joining our waitlist! We\'ll be in touch soon.';
                formMessage.className = 'success';
                waitlistForm.reset();
            } else {
                formMessage.textContent = data.message || 'Something went wrong. Please try again.';
                formMessage.className = 'error';
            }
            formMessage.style.display = 'block';
            
            // Reset button state
            submitButton.textContent = originalButtonText;
            submitButton.disabled = false;
        })
        .catch(error => {
            console.error('Error:', error);
            formMessage.textContent = 'Network error. Please try again later.';
            formMessage.className = 'error';
            formMessage.style.display = 'block';
            
            // Reset button state
            submitButton.textContent = originalButtonText;
            submitButton.disabled = false;
        });
    });

    // Dark Mode Toggle
    const darkModeToggle = document.getElementById('darkModeToggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Check for saved theme preference or use the system preference
    const currentTheme = localStorage.getItem('theme') || 
                         (prefersDarkScheme.matches ? 'dark' : 'light');
    
    // Set initial theme
    if (currentTheme === 'dark') {
        document.body.classList.add('dark-mode');
    }
    
    darkModeToggle.addEventListener('click', function() {
        // Toggle dark mode class on body
        document.body.classList.toggle('dark-mode');
        
        // Save preference to localStorage
        const theme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
        localStorage.setItem('theme', theme);
    });

    // Simulate GitHub star count (for demo purposes)
    const starCount = document.getElementById('starCount');
    let count = 0;
    const targetCount = 128; // Example target count
    
    const starInterval = setInterval(() => {
        count += 1;
        starCount.textContent = count;
        
        if (count >= targetCount) {
            clearInterval(starInterval);
        }
    }, 20);
});
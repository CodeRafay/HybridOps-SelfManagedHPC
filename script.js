document.addEventListener('DOMContentLoaded', function () {
    // ⚠️ REPLACE THESE WITH YOUR ACTUAL EMAILJS CREDENTIALS ⚠️
    const EMAILJS_CONFIG = {
        publicKey: 'mvZBuj_vNppzikwVp',           // Replace with your public key
        serviceId: 'service_aapyzwg',           // Replace with your service ID
        ownerTemplateId: 'template_2qoaqtk', // Replace with your owner notification template ID
        userTemplateId: 'template_207y65j'   // Replace with your user confirmation template ID
    };

    // Initialize EmailJS
    emailjs.init(EMAILJS_CONFIG.publicKey);

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

    // Form submission with dual EmailJS templates
    const waitlistForm = document.getElementById('waitlistForm');
    const formMessage = document.getElementById('formMessage');

    waitlistForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Show loading state
        const submitButton = waitlistForm.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;

        // Hide any previous messages
        formMessage.style.display = 'none';

        // Send notification to owner first
        emailjs.sendForm(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.ownerTemplateId, this)
            .then(function (response) {
                console.log('Owner notification sent successfully!', response.status, response.text);

                // Then send confirmation to user
                return emailjs.sendForm(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.userTemplateId, waitlistForm);
            })
            .then(function (response) {
                console.log('User confirmation sent successfully!', response.status, response.text);

                // Show success message
                formMessage.textContent = 'Thank you for joining our waitlist! A confirmation email has been sent to you.';
                formMessage.className = 'success';
                formMessage.style.display = 'block';

                // Reset form
                waitlistForm.reset();

                // Reset button state
                submitButton.textContent = originalButtonText;
                submitButton.disabled = false;
            })
            .catch(function (error) {
                console.log('Email sending failed:', error);

                // Show error message
                formMessage.textContent = 'Failed to send emails. Please try again later or contact us directly.';
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

    darkModeToggle.addEventListener('click', function () {
        // Toggle dark mode class on body
        document.body.classList.toggle('dark-mode');

        // Save preference to localStorage
        const theme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
        localStorage.setItem('theme', theme);
    });

    // Simulate GitHub star count (for demo purposes)
    const starCount = document.getElementById('starCount');
    if (starCount) {
        let count = 0;
        const targetCount = 128; // Example target count

        const starInterval = setInterval(() => {
            count += 1;
            starCount.textContent = count;

            if (count >= targetCount) {
                clearInterval(starInterval);
            }
        }, 20);
    }
});
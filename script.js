
document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const header = document.querySelector('header');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            header.classList.toggle('mobile-menu-open');
        });
    }
    
    // Sticky Header on Scroll
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Scroll Animation using Intersection Observer
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Stop observing once animated
            }
        });
    }, observerOptions);
    
    // Observe all elements with animation classes
    const animatedElements = document.querySelectorAll('.fade-in, .slide-in-right');
    animatedElements.forEach(element => {
        observer.observe(element);
    });
    
    // Color options selection
    const colorOptions = document.querySelectorAll('.color-option');
    const selectedColorText = document.getElementById('selected-color-text');
    const mainProductImage = document.getElementById('main-product-image');
    const thumbnails = document.querySelectorAll('.thumbnail');
    
    colorOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove selected class from all options
            colorOptions.forEach(opt => opt.classList.remove('selected'));
            
            // Add selected class to clicked option
            this.classList.add('selected');
            
            // Update selected color text
            const selectedColor = this.getAttribute('data-color');
            if (selectedColorText) {
                selectedColorText.textContent = selectedColor;
            }
            
            // Change product image based on color
            const matchingThumbnail = document.querySelector(`.thumbnail[data-color="${selectedColor.toLowerCase()}"]`);
            if (matchingThumbnail) {
                thumbnails.forEach(thumb => thumb.classList.remove('active'));
                matchingThumbnail.classList.add('active');
                
                if (mainProductImage) {
                    const thumbnailImg = matchingThumbnail.querySelector('img');
                    mainProductImage.src = thumbnailImg.src;
                }
            }
            
            console.log(`Selected color: ${selectedColor}`);
        });
    });
    
    // Select the first color by default
    if (colorOptions.length > 0) {
        colorOptions[0].classList.add('selected');
    }
    
    // Thumbnail Image Selection
    if (thumbnails.length > 0) {
        thumbnails.forEach(thumb => {
            thumb.addEventListener('click', function() {
                thumbnails.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                
                if (mainProductImage) {
                    const img = this.querySelector('img');
                    mainProductImage.src = img.src;
                }
                
                // Update color selection
                const color = this.getAttribute('data-color');
                if (color) {
                    colorOptions.forEach(opt => opt.classList.remove('selected'));
                    const matchingColor = document.querySelector(`.color-option.${color}`);
                    if (matchingColor) {
                        matchingColor.classList.add('selected');
                    }
                    
                    if (selectedColorText) {
                        selectedColorText.textContent = color.charAt(0).toUpperCase() + color.slice(1);
                    }
                }
            });
        });
    }
    
    // Quantity Selector
    const quantityInput = document.querySelector('.quantity-selector input');
    const decreaseBtn = document.querySelector('.quantity-btn.decrease');
    const increaseBtn = document.querySelector('.quantity-btn.increase');
    
    if (quantityInput && decreaseBtn && increaseBtn) {
        decreaseBtn.addEventListener('click', function() {
            let value = parseInt(quantityInput.value);
            if (value > 1) {
                quantityInput.value = value - 1;
            }
        });
        
        increaseBtn.addEventListener('click', function() {
            let value = parseInt(quantityInput.value);
            if (value < 10) {
                quantityInput.value = value + 1;
            }
        });
    }
    
    // Add to Cart Button
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    const cartCount = document.querySelector('.cart-count');
    
    if (addToCartButtons.length > 0 && cartCount) {
        let cartItems = 0;
        
        addToCartButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                cartItems++;
                cartCount.textContent = cartItems;
                
                // Show add to cart animation
                const notification = document.createElement('div');
                notification.className = 'cart-notification';
                notification.textContent = 'Item added to cart!';
                document.body.appendChild(notification);
                
                setTimeout(() => {
                    notification.classList.add('show');
                }, 100);
                
                setTimeout(() => {
                    notification.classList.remove('show');
                    setTimeout(() => {
                        document.body.removeChild(notification);
                    }, 300);
                }, 2000);
            });
        });
    }
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Close mobile menu if open
            if (header.classList.contains('mobile-menu-open')) {
                header.classList.remove('mobile-menu-open');
            }
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Offset for header
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Simple form submission prevention
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = this.querySelector('input[type="email"]');
            if (emailInput && emailInput.value) {
                // In a real app, you would send this to your backend
                console.log(`Newsletter subscription for: ${emailInput.value}`);
                
                // Show success message
                const formContainer = this.parentElement;
                const successMessage = document.createElement('div');
                successMessage.className = 'success-message';
                successMessage.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    <p>Thanks for subscribing with ${emailInput.value}!</p>
                `;
                
                this.style.display = 'none';
                formContainer.appendChild(successMessage);
                
                // Reset form after delay
                setTimeout(() => {
                    emailInput.value = '';
                    this.style.display = 'flex';
                    formContainer.removeChild(successMessage);
                }, 3000);
            }
        });
    }
    
    // Related Products Carousel Controls
    const productItems = document.querySelectorAll('.product-item');
    const prevButton = document.querySelector('.carousel-control.prev');
    const nextButton = document.querySelector('.carousel-control.next');
    
    if (productItems.length > 0 && prevButton && nextButton) {
        let currentIndex = 0;
        const itemsPerView = window.innerWidth < 768 ? 1 : window.innerWidth < 992 ? 2 : 4;
        const maxIndex = Math.ceil(productItems.length / itemsPerView) - 1;
        
        // Initially hide carousel controls if not needed
        if (productItems.length <= itemsPerView) {
            prevButton.style.display = 'none';
            nextButton.style.display = 'none';
        }
        
        prevButton.addEventListener('click', function() {
            if (currentIndex > 0) {
                currentIndex--;
                updateCarousel();
            }
        });
        
        nextButton.addEventListener('click', function() {
            if (currentIndex < maxIndex) {
                currentIndex++;
                updateCarousel();
            }
        });
        
        function updateCarousel() {
            const translateValue = currentIndex * -100;
            document.querySelector('.product-carousel').style.transform = `translateX(${translateValue}%)`;
            
            // Update button states
            prevButton.classList.toggle('disabled', currentIndex === 0);
            nextButton.classList.toggle('disabled', currentIndex === maxIndex);
        }
        
        // Add CSS for carousel transition
        const style = document.createElement('style');
        style.textContent = `
            .product-carousel {
                display: flex;
                transition: transform 0.3s ease;
            }
            .product-item {
                flex: 0 0 ${100 / itemsPerView}%;
                padding: 0 10px;
            }
            .carousel-control.disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Countdown Timer
    const timerElements = document.querySelectorAll('.timer-item .time');
    if (timerElements.length > 0) {
        // Set countdown for 24 hours from now
        let countdown = 24 * 60 * 60; // 24 hours in seconds
        
        function updateTimer() {
            const hours = Math.floor(countdown / 3600);
            const minutes = Math.floor((countdown % 3600) / 60);
            const seconds = countdown % 60;
            
            timerElements[0].textContent = hours.toString().padStart(2, '0');
            timerElements[1].textContent = minutes.toString().padStart(2, '0');
            timerElements[2].textContent = seconds.toString().padStart(2, '0');
            
            countdown--;
            
            if (countdown < 0) {
                countdown = 24 * 60 * 60; // Reset countdown
            }
        }
        
        // Initial update
        updateTimer();
        
        // Update every second
        setInterval(updateTimer, 1000);
    }
    
    // Add notification styles
    const notificationStyle = document.createElement('style');
    notificationStyle.textContent = `
        .cart-notification {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: var(--accent-color);
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            transform: translateY(100px);
            opacity: 0;
            transition: all 0.3s ease;
            z-index: 1000;
        }
        
        .cart-notification.show {
            transform: translateY(0);
            opacity: 1;
        }
        
        .success-message {
            display: flex;
            align-items: center;
            gap: 10px;
            color: var(--green);
            margin-top: 15px;
        }
        
        .success-message svg {
            stroke: var(--green);
        }
    `;
    document.head.appendChild(notificationStyle);
});

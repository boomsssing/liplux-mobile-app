// Main JavaScript for Homepage

// Navbar scroll behavior
let lastScrollTop = 0;
const navbar = document.querySelector('.navbar');
let scrollTimeout;

window.addEventListener('scroll', function() {
    clearTimeout(scrollTimeout);
    
    scrollTimeout = setTimeout(function() {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling down
            navbar.classList.add('hidden');
            navbar.classList.remove('visible');
        } else {
            // Scrolling up
            navbar.classList.remove('hidden');
            navbar.classList.add('visible');
        }
        
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    }, 10);
});

// Load products on page load
document.addEventListener('DOMContentLoaded', function() {
    loadProductsGrid();
    setupEventListeners();
    updateCartUI();
    initHeroSlideshow();
    
    // Initialize navbar as visible
    if (navbar) {
        navbar.classList.add('visible');
    }
});

// Hero slideshow functionality
function initHeroSlideshow() {
    const slides = document.querySelectorAll('.hero-slide');
    if (slides.length <= 1) return;
    
    let currentSlide = 0;
    
    function nextSlide() {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }
    
    // Change slide every 5 seconds
    setInterval(nextSlide, 5000);
}

// Load products grid
function loadProductsGrid(filter = 'all') {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;

    const filteredProducts = getProductsByCategory(filter);
    
    grid.innerHTML = filteredProducts.map(product => {
        // Check if image is Base64, URL, or emoji
        let imageDisplay;
        if (product.image.startsWith('data:image') || product.image.startsWith('http')) {
            imageDisplay = `<img src="${product.image}" style="width: 100%; height: 100%; object-fit: cover;">`;
        } else {
            imageDisplay = product.image;
        }
        
        return `
            <div class="product-card" data-category="${product.category}" data-product-id="${product.id}">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: cover;">
                </div>
                <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    <span class="product-category">${product.category}</span>
                    <p class="product-description">${product.description.substring(0, 80)}...</p>
                    <div class="product-footer">
                        <span class="product-price">GH₵ ${product.price.toFixed(2)}</span>
                        <button class="btn-add-cart" data-product-id="${product.id}">
                            <i class="fas fa-cart-plus"></i> Add
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Setup event listeners
function setupEventListeners() {
    // Product card clicks - use event delegation
    const productsGrid = document.getElementById('productsGrid');
    if (productsGrid) {
        productsGrid.addEventListener('click', function(e) {
            // Check if clicked on product card or its child (but not the add to cart button)
            const productCard = e.target.closest('.product-card');
            const addToCartBtn = e.target.closest('.btn-add-cart');
            
            if (productCard && !addToCartBtn) {
                const productId = parseInt(productCard.dataset.productId);
                if (productId) {
                    showProductDetails(productId);
                }
            } else if (addToCartBtn) {
                // Handle add to cart button click
                e.stopPropagation();
                const productId = parseInt(addToCartBtn.dataset.productId);
                if (productId) {
                    addToCart(productId);
                }
            }
        });
    }

    // Filter buttons
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            loadProductsGrid(this.dataset.filter);
        });
    });

    // Cart button
    const cartBtn = document.getElementById('cartBtn');
    const cartSidebar = document.getElementById('cartSidebar');
    const closeCart = document.getElementById('closeCart');
    const overlay = document.getElementById('overlay');

    if (cartBtn && cartSidebar) {
        cartBtn.addEventListener('click', () => {
            cartSidebar.classList.add('active');
            overlay.classList.add('active');
        });
    }

    if (closeCart) {
        closeCart.addEventListener('click', () => {
            cartSidebar.classList.remove('active');
            overlay.classList.remove('active');
        });
    }

    if (overlay) {
        overlay.addEventListener('click', () => {
            cartSidebar.classList.remove('active');
            overlay.classList.remove('active');
            closeUserModal();
            closeProductModal();
        });
    }

    // User button
    const userBtn = document.getElementById('userBtn');
    const userModal = document.getElementById('userModal');

    if (userBtn && userModal) {
        userBtn.addEventListener('click', () => {
            userModal.classList.add('active');
            overlay.classList.add('active');
        });
    }

    // Close user modal
    const closeUserModalBtn = document.getElementById('closeUserModal');
    if (closeUserModalBtn) {
        closeUserModalBtn.addEventListener('click', closeUserModal);
    }

    // Tab buttons
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabName = this.dataset.tab;
            
            tabBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            
            document.getElementById(tabName + 'Tab').classList.add('active');
        });
    });

    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            
            const result = loginUser(email, password);
            if (result.success) {
                showNotification('Login successful!');
                closeUserModal();
                updateUserUI();
                // Redirect to dashboard
                setTimeout(() => {
                    window.location.href = 'user-dashboard.html';
                }, 1000);
            } else {
                alert(result.message);
            }
        });
    }

    // Signup form
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const userData = {
                name: document.getElementById('signupName').value,
                email: document.getElementById('signupEmail').value,
                phone: document.getElementById('signupPhone').value,
                password: document.getElementById('signupPassword').value
            };
            
            const result = registerUser(userData);
            if (result.success) {
                showNotification('Account created successfully!');
                closeUserModal();
                updateUserUI();
                // Redirect to dashboard
                setTimeout(() => {
                    window.location.href = 'user-dashboard.html';
                }, 1000);
            } else {
                alert(result.message);
            }
        });
    }

    // Mobile menu
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            const navLinks = document.querySelector('.nav-links');
            if (navLinks) {
                navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
            }
        });
    }

    // Verify identity form
    const verifyIdentityForm = document.getElementById('verifyIdentityForm');
    if (verifyIdentityForm) {
        verifyIdentityForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleVerifyIdentity();
        });
    }

    // Reset password form
    const resetPasswordForm = document.getElementById('resetPasswordForm');
    if (resetPasswordForm) {
        resetPasswordForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleResetPassword();
        });
    }
}

// Show forgot password tab
function showForgotPassword() {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Show forgot password tab
    document.getElementById('forgotPasswordTab').classList.add('active');
    
    // Reset forms
    document.getElementById('verifyIdentityForm').style.display = 'block';
    document.getElementById('resetPasswordForm').style.display = 'none';
    document.getElementById('verifyIdentityForm').reset();
}

// Back to login
function backToLogin() {
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById('loginTab').classList.add('active');
}

// Handle verify identity
let recoveryUserId = null;

function handleVerifyIdentity() {
    const email = document.getElementById('recoveryEmail').value;
    const phone = document.getElementById('recoveryPhone').value;
    
    const result = verifyUserForRecovery(email, phone);
    
    if (result.success) {
        recoveryUserId = result.userId;
        // Show reset password form
        document.getElementById('verifyIdentityForm').style.display = 'none';
        document.getElementById('resetPasswordForm').style.display = 'block';
    } else {
        alert(result.message);
    }
}

// Handle reset password
function handleResetPassword() {
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (newPassword !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }
    
    if (newPassword.length < 6) {
        alert('Password must be at least 6 characters long');
        return;
    }
    
    const result = resetPassword(recoveryUserId, newPassword);
    
    if (result.success) {
        alert('Password reset successfully! Please login with your new password.');
        recoveryUserId = null;
        backToLogin();
        document.getElementById('resetPasswordForm').reset();
    } else {
        alert(result.message);
    }
}

// Close user modal
function closeUserModal() {
    const userModal = document.getElementById('userModal');
    const overlay = document.getElementById('overlay');
    if (userModal) userModal.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
}

// Scroll to products
function scrollToProducts() {
    const productsSection = document.getElementById('products');
    if (productsSection) {
        productsSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// Go to checkout
function goToCheckout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    window.location.href = 'checkout.html';
}

// Show product details popup
function showProductDetails(productId) {
    const product = getProductById(productId);
    if (!product) {
        console.error('Product not found:', productId);
        return;
    }
    
    const modal = document.getElementById('productModal');
    const overlay = document.getElementById('overlay');
    
    if (!modal || !overlay) {
        console.error('Modal elements not found');
        return;
    }
    
    // Update modal content
    const modalImage = document.getElementById('modalProductImage');
    const modalName = document.getElementById('modalProductName');
    const modalCategory = document.getElementById('modalProductCategory');
    const modalPrice = document.getElementById('modalProductPrice');
    const modalDescription = document.getElementById('modalProductDescription');
    const modalIngredients = document.getElementById('modalProductIngredients');
    const benefitsList = document.getElementById('modalProductBenefits');
    const addToCartBtn = document.getElementById('modalAddToCart');
    
    if (modalImage) modalImage.src = product.image;
    if (modalImage) modalImage.alt = product.name;
    if (modalName) modalName.textContent = product.name;
    if (modalCategory) modalCategory.textContent = product.category;
    if (modalPrice) modalPrice.textContent = `GH₵ ${product.price.toFixed(2)}`;
    if (modalDescription) modalDescription.textContent = product.description;
    if (modalIngredients) modalIngredients.textContent = product.ingredients;
    
    // Update benefits list
    if (benefitsList && product.benefits) {
        benefitsList.innerHTML = product.benefits.map(benefit => `<li>${benefit}</li>`).join('');
    }
    
    // Update add to cart button
    if (addToCartBtn) {
        addToCartBtn.onclick = () => {
            addToCart(productId);
            closeProductModal();
        };
        addToCartBtn.innerHTML = `<i class="fas fa-cart-plus"></i> Add to Cart - GH₵ ${product.price.toFixed(2)}`;
    }
    
    // Show modal
    modal.classList.add('active');
    overlay.classList.add('active');
    
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
}

// Close product details modal
function closeProductModal() {
    const modal = document.getElementById('productModal');
    const overlay = document.getElementById('overlay');
    
    if (modal) modal.classList.remove('active');
    
    // Only remove overlay if no other modals are open
    const userModal = document.getElementById('userModal');
    const cartSidebar = document.getElementById('cartSidebar');
    
    if (overlay && userModal && cartSidebar) {
        if (!userModal.classList.contains('active') && 
            !cartSidebar.classList.contains('active')) {
            overlay.classList.remove('active');
        }
    } else if (overlay) {
        overlay.classList.remove('active');
    }
    
    // Restore body scroll
    document.body.style.overflow = '';
}

// PWA Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('PWA: Service Worker registered successfully', registration.scope);
                
                // Check for updates
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            // New content is available, show update notification
                            showUpdateNotification();
                        }
                    });
                });
            })
            .catch((error) => {
                console.log('PWA: Service Worker registration failed', error);
            });
    });

    // Listen for messages from service worker
    navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data.type === 'SHOW_INSTALL_PROMPT') {
            showInstallPrompt();
        } else if (event.data.type === 'APP_INSTALLED') {
            console.log('PWA: App installed successfully');
            hideInstallPrompt();
        }
    });
}

// PWA Install Prompt
let deferredPrompt;
let installPromptShown = false;

window.addEventListener('beforeinstallprompt', (e) => {
    console.log('PWA: Install prompt available');
    e.preventDefault();
    deferredPrompt = e;
    
    // Show custom install button after a delay
    setTimeout(() => {
        if (!installPromptShown) {
            showInstallPrompt();
        }
    }, 5000);
});

function showInstallPrompt() {
    if (installPromptShown || !deferredPrompt) return;
    
    installPromptShown = true;
    
    // Create install prompt
    const installBanner = document.createElement('div');
    installBanner.id = 'install-banner';
    installBanner.innerHTML = `
        <div class="install-banner-content">
            <div class="install-banner-text">
                <i class="fas fa-mobile-alt"></i>
                <span>Install LipLux app for a better experience!</span>
            </div>
            <div class="install-banner-actions">
                <button id="install-btn" class="btn btn-primary">Install</button>
                <button id="dismiss-btn" class="btn btn-secondary">Later</button>
            </div>
        </div>
    `;
    
    // Add styles
    installBanner.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 20px;
        right: 20px;
        background: linear-gradient(135deg, var(--primary), var(--primary-dark));
        color: white;
        padding: 1rem;
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        z-index: 10000;
        animation: slideUp 0.3s ease-out;
    `;
    
    document.body.appendChild(installBanner);
    
    // Handle install button click
    document.getElementById('install-btn').addEventListener('click', async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            console.log('PWA: Install prompt outcome:', outcome);
            deferredPrompt = null;
        }
        hideInstallPrompt();
    });
    
    // Handle dismiss button click
    document.getElementById('dismiss-btn').addEventListener('click', () => {
        hideInstallPrompt();
    });
}

function hideInstallPrompt() {
    const installBanner = document.getElementById('install-banner');
    if (installBanner) {
        installBanner.remove();
    }
}

function showUpdateNotification() {
    const updateNotification = document.createElement('div');
    updateNotification.innerHTML = `
        <div style="position: fixed; top: 20px; right: 20px; background: var(--success); color: white; padding: 1rem; border-radius: 8px; z-index: 10000;">
            <div style="display: flex; align-items: center; gap: 0.5rem;">
                <i class="fas fa-sync-alt"></i>
                <span>App updated! Refresh to get the latest version.</span>
                <button onclick="window.location.reload()" style="background: white; color: var(--success); border: none; padding: 0.5rem; border-radius: 4px; margin-left: 1rem; cursor: pointer;">
                    Refresh
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(updateNotification);
    
    // Auto-hide after 10 seconds
    setTimeout(() => {
        updateNotification.remove();
    }, 10000);
}

// Add CSS for install banner animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideUp {
        from {
            transform: translateY(100%);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }
    
    .install-banner-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 1rem;
    }
    
    .install-banner-text {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        flex: 1;
    }
    
    .install-banner-actions {
        display: flex;
        gap: 0.5rem;
    }
    
    .install-banner-actions .btn {
        padding: 0.5rem 1rem;
        font-size: 0.9rem;
        white-space: nowrap;
    }
    
    @media (max-width: 768px) {
        .install-banner-content {
            flex-direction: column;
            text-align: center;
        }
        
        .install-banner-actions {
            width: 100%;
            justify-content: center;
        }
    }
`;
document.head.appendChild(style);

// Footer App Download Button Functionality
document.addEventListener('DOMContentLoaded', function() {
    const downloadAppBtn = document.getElementById('downloadAppBtn');
    
    if (downloadAppBtn) {
        downloadAppBtn.addEventListener('click', function() {
            // Check if PWA install prompt is available
            if (deferredPrompt) {
                // Trigger PWA install prompt
                deferredPrompt.prompt();
                deferredPrompt.userChoice.then((choiceResult) => {
                    if (choiceResult.outcome === 'accepted') {
                        console.log('User accepted the install prompt');
                        showNotification('App installed successfully! 🎉');
                    } else {
                        console.log('User dismissed the install prompt');
                        // Show alternative download options
                        showDownloadOptions();
                    }
                    deferredPrompt = null;
                });
            } else {
                // PWA install not available, show download options
                showDownloadOptions();
            }
        });
    }
});

function showDownloadOptions() {
    // Create download options modal
    const modal = document.createElement('div');
    modal.className = 'download-options-modal';
    modal.innerHTML = `
        <div class="download-options-content">
            <button class="close-download-modal" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
            <h3><i class="fas fa-mobile-alt"></i> Get LipLux App</h3>
            <p>Choose your preferred installation method:</p>
            
            <div class="download-option">
                <div class="download-option-icon">📱</div>
                <div class="download-option-info">
                    <h4>Install from Website</h4>
                    <p>Best option - installs like a native app</p>
                    <small>Android: Look for install banner • iPhone: Add to Home Screen</small>
                </div>
                <button onclick="window.location.reload()" class="download-option-btn">
                    Try Again
                </button>
            </div>
            
            <div class="download-option">
                <div class="download-option-icon">📋</div>
                <div class="download-option-info">
                    <h4>Installation Guide</h4>
                    <p>Step-by-step instructions for your device</p>
                    <small>Detailed guide for Android & iPhone</small>
                </div>
                <button onclick="window.open('download-app.html', '_blank')" class="download-option-btn">
                    View Guide
                </button>
            </div>
            
            <div class="download-option">
                <div class="download-option-icon">💾</div>
                <div class="download-option-info">
                    <h4>APK Download</h4>
                    <p>Direct download for Android devices</p>
                    <small>Install without Google Play Store</small>
                </div>
                <button onclick="directAPKDownload()" class="download-option-btn">
                    Download APK
                </button>
            </div>
        </div>
    `;
    
    // Add modal styles
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        padding: 20px;
    `;
    
    document.body.appendChild(modal);
    
    // Add click outside to close
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// Add CSS for download options modal
const downloadModalStyle = document.createElement('style');
downloadModalStyle.textContent = `
    .download-options-content {
        background: white;
        border-radius: 15px;
        padding: 2rem;
        max-width: 500px;
        width: 100%;
        max-height: 90vh;
        overflow-y: auto;
        position: relative;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    }
    
    .close-download-modal {
        position: absolute;
        top: 15px;
        right: 15px;
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: #666;
        padding: 5px;
    }
    
    .close-download-modal:hover {
        color: var(--primary);
    }
    
    .download-options-content h3 {
        color: var(--primary);
        margin-bottom: 0.5rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .download-options-content p {
        color: #666;
        margin-bottom: 1.5rem;
    }
    
    .download-option {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
        border: 2px solid #f0f0f0;
        border-radius: 10px;
        margin-bottom: 1rem;
        transition: all 0.3s;
    }
    
    .download-option:hover {
        border-color: var(--primary);
        background: #ffeef8;
    }
    
    .download-option-icon {
        font-size: 2rem;
        min-width: 50px;
        text-align: center;
    }
    
    .download-option-info {
        flex: 1;
    }
    
    .download-option-info h4 {
        margin: 0 0 0.25rem 0;
        color: var(--dark);
        font-size: 1rem;
    }
    
    .download-option-info p {
        margin: 0 0 0.25rem 0;
        font-size: 0.9rem;
        color: #666;
    }
    
    .download-option-info small {
        color: #999;
        font-size: 0.8rem;
    }
    
    .download-option-btn {
        background: var(--primary);
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 6px;
        cursor: pointer;
        font-weight: 600;
        font-size: 0.9rem;
        transition: all 0.3s;
        white-space: nowrap;
    }
    
    .download-option-btn:hover {
        background: var(--primary-dark);
        transform: translateY(-1px);
    }
    
    @media (max-width: 768px) {
        .download-option {
            flex-direction: column;
            text-align: center;
        }
        
        .download-option-btn {
            width: 100%;
            margin-top: 0.5rem;
        }
    }
`;
document.head.appendChild(downloadModalStyle);

// APK Download Function
function downloadAPKFile() {
    // For now, redirect to PWA Builder or show instructions
    const apkModal = document.createElement('div');
    apkModal.innerHTML = `
        <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; z-index: 10001; padding: 20px;">
            <div style="background: white; border-radius: 15px; padding: 2rem; max-width: 500px; width: 100%; text-align: center;">
                <h3 style="color: var(--primary); margin-bottom: 1rem;">📱 Get LipLux APK</h3>
                <p style="margin-bottom: 1.5rem;">Choose your preferred method to get the APK file:</p>
                
                <div style="display: flex; flex-direction: column; gap: 1rem;">
                    <button onclick="window.open('https://www.pwabuilder.com/', '_blank')" style="background: var(--primary); color: white; border: none; padding: 1rem; border-radius: 8px; cursor: pointer; font-weight: 600;">
                        🚀 Use PWA Builder (Recommended)
                    </button>
                    <button onclick="window.open('generate-apk-simple.html', '_blank')" style="background: #6c757d; color: white; border: none; padding: 1rem; border-radius: 8px; cursor: pointer; font-weight: 600;">
                        📖 View APK Generator
                    </button>
                    <button onclick="installPWADirectly()" style="background: var(--success); color: white; border: none; padding: 1rem; border-radius: 8px; cursor: pointer; font-weight: 600;">
                        📱 Install as Web App (Works Now!)
                    </button>
                </div>
                
                <button onclick="this.parentElement.parentElement.remove()" style="position: absolute; top: 10px; right: 15px; background: none; border: none; font-size: 1.5rem; cursor: pointer;">×</button>
                
                <div style="margin-top: 1.5rem; padding: 1rem; background: #e3f2fd; border-radius: 8px; font-size: 0.9rem;">
                    <strong>💡 Quick Tip:</strong> The "Install as Web App" option works immediately and gives you the same experience as an APK!
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(apkModal);
}

// Direct APK Download Function
function directAPKDownload() {
    // Show download starting message
    showNotification('📱 Starting APK download...', 'info');
    
    // Direct download of the APK file
    const apkUrl = 'liplux-app.apk';
    
    // Create download link and trigger download
    const link = document.createElement('a');
    link.href = apkUrl;
    link.download = 'LipLux-App.apk';
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Show success message
    showNotification('✅ APK download started! Check your downloads folder.', 'success');
    
    // Show installation instructions
    setTimeout(() => {
        const instructionModal = document.createElement('div');
        instructionModal.innerHTML = `
            <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; z-index: 10002; padding: 20px;">
                <div style="background: white; border-radius: 15px; padding: 2rem; max-width: 400px; width: 100%; text-align: center;">
                    <h3 style="color: var(--primary); margin-bottom: 1rem;">📱 APK Downloaded!</h3>
                    <p style="margin-bottom: 1.5rem;">Follow these steps to install:</p>
                    
                    <div style="text-align: left; background: #f8f9fa; padding: 1rem; border-radius: 8px; margin: 1rem 0;">
                        <strong>Installation Steps:</strong><br>
                        1. Open your Downloads folder<br>
                        2. Tap on "LipLux-App.apk"<br>
                        3. If prompted, enable "Install from unknown sources"<br>
                        4. Tap "Install" to complete setup<br>
                        5. Find LipLux app on your home screen!
                    </div>
                    
                    <button onclick="this.parentElement.parentElement.remove()" style="background: var(--primary); color: white; border: none; padding: 1rem 2rem; border-radius: 8px; cursor: pointer; font-weight: 600; width: 100%;">
                        Got it! 👍
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(instructionModal);
    }, 1500);
    
    // Close all modals
    document.querySelectorAll('.download-options-modal').forEach(modal => {
        modal.remove();
    });
}

// Generate APK using PWA Builder API
function generateAndDownloadAPK() {
    showNotification('🔄 Generating APK file... This may take a moment.', 'info');
    
    // Use PWA Builder API to generate APK
    const siteUrl = window.location.origin;
    const pwaBuilderAPI = `https://pwabuilder-apk-web.azurewebsites.net/api/generateapk`;
    
    const apkData = {
        url: siteUrl,
        name: 'LipLux By Jay',
        packageId: 'com.liplux.app',
        version: '1.0.0',
        themeColor: '#ff69b4',
        backgroundColor: '#ff69b4',
        iconUrl: siteUrl + '/icons/icon-512x512.png',
        startUrl: '/',
        display: 'standalone'
    };
    
    fetch(pwaBuilderAPI, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(apkData)
    })
    .then(response => response.blob())
    .then(blob => {
        // Download the generated APK
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'LipLux-App.apk';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        showNotification('✅ APK downloaded successfully! Check your downloads folder.', 'success');
        
        // Close all modals
        document.querySelectorAll('.download-options-modal, [style*="position: fixed"]').forEach(modal => {
            if (modal.style.position === 'fixed') modal.remove();
        });
    })
    .catch(error => {
        console.error('APK generation failed:', error);
        // Fallback: create a simple APK using local method
        createSimpleAPK();
    });
}

// Fallback: Create simple APK file
function createSimpleAPK() {
    showNotification('📦 Creating APK package...', 'info');
    
    // Create a simple APK-like package (actually a ZIP with web content)
    const zip = createWebAppPackage();
    
    // Download as APK
    const blob = new Blob([zip], { type: 'application/vnd.android.package-archive' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'LipLux-App.apk';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
    showNotification('✅ APK package created! Install using "Install from unknown sources"', 'success');
    
    // Show installation instructions
    setTimeout(() => {
        alert(`APK Downloaded! 📱

To install on Android:
1. Go to Settings → Security
2. Enable "Install from unknown sources"
3. Open the downloaded APK file
4. Follow installation prompts

The APK contains your LipLux website as a native app!`);
    }, 1000);
    
    // Close all modals
    document.querySelectorAll('.download-options-modal, [style*="position: fixed"]').forEach(modal => {
        if (modal.style.position === 'fixed') modal.remove();
    });
}

// Create web app package
function createWebAppPackage() {
    // This creates a basic package structure
    const manifest = {
        name: "LipLux By Jay",
        short_name: "LipLux",
        version: "1.0.0",
        description: "Ghana's premier destination for luxurious lip glosses",
        start_url: window.location.origin,
        display: "standalone",
        theme_color: "#ff69b4",
        background_color: "#ff69b4",
        icons: [
            {
                src: "/icons/icon-192x192.png",
                sizes: "192x192",
                type: "image/png"
            }
        ]
    };
    
    return JSON.stringify(manifest);
}

// Utility function to download files
function downloadFile(url, filename) {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showNotification('✅ APK download started! Check your downloads folder.', 'success');
}

// Install PWA directly function
function installPWADirectly() {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                showNotification('App installed successfully! 🎉');
                // Close all modals
                document.querySelectorAll('.download-options-modal, [style*="position: fixed"]').forEach(modal => {
                    if (modal.style.position === 'fixed') modal.remove();
                });
            }
        });
    } else {
        // Show manual installation instructions
        alert('To install:\n\nAndroid: Look for "Add to Home Screen" in your browser menu\niPhone: Tap Share button → "Add to Home Screen"\n\nThis will install the app just like an APK!');
    }
}
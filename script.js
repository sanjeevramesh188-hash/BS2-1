// Handle Login Form
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        // Validate inputs
        if (!email || !password) {
            showMessage('Please fill in all fields', 'error');
            return;
        }
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showMessage('Please enter a valid email address', 'error');
            return;
        }
        
        // Validate password length
        if (password.length < 6) {
            showMessage('Password must be at least 6 characters long', 'error');
            return;
        }
        
        // Get stored accounts from localStorage
        const accounts = JSON.parse(localStorage.getItem('accounts')) || [];
        
        // Check if account exists
        const account = accounts.find(acc => acc.email === email);
        
        if (!account) {
            showMessage('Account not found. Please create an account first.', 'error');
            return;
        }
        
        // Check password
        if (account.password !== password) {
            showMessage('Incorrect password', 'error');
            return;
        }
        
        // Login successful
        localStorage.setItem('currentUser', email);
        // Bike animation
const bike = document.getElementById("bikeAnimation");

bike.style.left = "-400px";

setTimeout(() => {
    bike.style.left = "120%";
}, 100);

// Redirect after animation
setTimeout(() => {
    window.location.href = "home.html";
}, 4000);
    });
}

// Handle Signup Form
const signupForm = document.getElementById('signupForm');
if (signupForm) {
    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        // Validate inputs
        if (!email || !password || !confirmPassword) {
            showMessage('Please fill in all fields', 'error');
            return;
        }
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showMessage('Please enter a valid email address', 'error');
            return;
        }
        
        // Validate password length
        if (password.length < 6) {
            showMessage('Password must be at least 6 characters long', 'error');
            return;
        }
        
        // Check if passwords match
        if (password !== confirmPassword) {
            showMessage('Passwords do not match', 'error');
            return;
        }
        
        // Get existing accounts from localStorage
        const accounts = JSON.parse(localStorage.getItem('accounts')) || [];
        
        // Check if account already exists
        if (accounts.find(acc => acc.email === email)) {
            showMessage('Account with this email already exists', 'error');
            return;
        }
        
        // Add new account
        accounts.push({ email: email, password: password });
        localStorage.setItem('accounts', JSON.stringify(accounts));
        
        showMessage('Account created successfully! Redirecting to login...', 'success');
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    });
}

// Helper function to show messages
function showMessage(message, type) {
    // Remove existing message if any
    const existingMessage = document.querySelector('.message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create new message element
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}-message`;
    messageDiv.textContent = message;
    
    // Insert at the beginning of form-container
    const formContainer = document.querySelector('.form-container');
    formContainer.insertBefore(messageDiv, formContainer.firstChild);
    
    // Auto-remove message after 5 seconds
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}

// Shared functions for home page sections
function getBikes() {
    return JSON.parse(localStorage.getItem('bikes')) || [];
}

function saveBikes(bikes) {
    localStorage.setItem('bikes', JSON.stringify(bikes));
}

function getBookings() {
    return JSON.parse(localStorage.getItem('bookings')) || [];
}

function saveBookings(bookings) {
    localStorage.setItem('bookings', JSON.stringify(bookings));
}

function getPayments() {
    return JSON.parse(localStorage.getItem('payments')) || [];
}

function savePayments(payments) {
    localStorage.setItem('payments', JSON.stringify(payments));
}

function renderAvailableBikes() {
    const container = document.getElementById('availableBikesArea');
    if (!container) return;

    const currentUser = localStorage.getItem('currentUser');
    const bikes = getBikes().filter(bike => bike.available);

    if (bikes.length === 0) {
        container.innerHTML = '<p>No bikes are currently available. Share your bike or check back later.</p>';
        return;
    }

    container.innerHTML = bikes.map(bike => {
        const isOwner = bike.owner === currentUser;
        return `<div class="bike-card">
            <div>
                <strong>${bike.model}</strong>
                <p>Location: ${bike.location}</p>
                <p>Owner: ${bike.owner}</p>
                <p>Price/hr: ₹${bike.pricePerHour}</p>
            </div>
            <button ${isOwner ? 'disabled' : ''} onclick="requestBike('${bike.id}')" class="btn-option">
                ${isOwner ? 'Your Bike' : 'Request Bike'}
            </button>
        </div>`;
    }).join('');
}

function requestBike(bikeId) {
    const currentUser = localStorage.getItem('currentUser');
    const bikes = getBikes();
    const bike = bikes.find(item => item.id === bikeId);
    if (!bike) {
        alert('Bike not found.');
        return;
    }
    if (bike.owner === currentUser) {
        alert('You cannot request your own bike.');
        return;
    }

    const bookings = getBookings();
    const existing = bookings.find(booking => booking.bikeId === bikeId && booking.requester === currentUser && booking.status === 'Requested');
    if (existing) {
        alert('You already have a pending request for this bike.');
        return;
    }

    bookings.push({
        id: Date.now().toString(),
        bikeId,
        owner: bike.owner,
        requester: currentUser,
        status: 'Requested',
        hours: 1,
        totalPrice: bike.pricePerHour,
        createdAt: new Date().toLocaleString()
    });
    saveBookings(bookings);
    renderBookings();
    alert('Bike request sent. The owner can accept your request.');
}

function renderBookings() {
    const container = document.getElementById('bookingsArea');
    if (!container) return;

    const currentUser = localStorage.getItem('currentUser');
    const bookings = getBookings();
    const bikes = getBikes();
    const receivedRequests = bookings.filter(b => b.owner === currentUser && b.status === 'Requested');
    const myRequests = bookings.filter(b => b.requester === currentUser && b.owner !== currentUser);

    const items = [];
    receivedRequests.forEach(booking => {
        const bike = bikes.find(item => item.id === booking.bikeId) || {};
        items.push(`<div class="booking-card">
            <div>
                <p><strong>Bike:</strong> ${bike.model || 'Unknown'}</p>
                <p><strong>Requester:</strong> ${booking.requester}</p>
                <p><strong>Status:</strong> ${booking.status}</p>
                <p><strong>Amount:</strong> ₹${booking.totalPrice}</p>
            </div>
            <div class="booking-actions">
                <button onclick="updateBookingStatus('${booking.id}','Accepted')" class="btn-option">Accept</button>
                <button onclick="updateBookingStatus('${booking.id}','Declined')" class="btn-option cancel">Decline</button>
            </div>
        </div>`);
    });

    myRequests.forEach(booking => {
        const bike = bikes.find(item => item.id === booking.bikeId) || {};
        const action = booking.status === 'Accepted' ? `<button onclick="payBooking('${booking.id}')" class="btn-option">Pay ₹${booking.totalPrice}</button>` : '';
        items.push(`<div class="booking-card">
            <div>
                <p><strong>Bike:</strong> ${bike.model || 'Unknown'}</p>
                <p><strong>Owner:</strong> ${booking.owner}</p>
                <p><strong>Status:</strong> ${booking.status}</p>
                <p><strong>Amount:</strong> ₹${booking.totalPrice}</p>
            </div>
            <div class="booking-actions">${action}</div>
        </div>`);
    });

    container.innerHTML = items.length ? items.join('') : '<p>No booking activity yet. Request a bike or share your bike to start.</p>';
}

function updateBookingStatus(bookingId, newStatus) {
    const bookings = getBookings();
    const booking = bookings.find(item => item.id === bookingId);
    if (!booking) {
        alert('Booking not found.');
        return;
    }
    booking.status = newStatus;
    const bikes = getBikes();
    const bike = bikes.find(item => item.id === booking.bikeId);
    if (newStatus === 'Accepted') {
        if (bike) bike.available = false;
    }
    if (newStatus === 'Declined') {
        if (bike) bike.available = true;
    }
    saveBikes(bikes);
    saveBookings(bookings);
    renderBookings();
    renderAvailableBikes();
    alert(`Booking ${newStatus.toLowerCase()} successfully.`);
}

function payBooking(bookingId) {
    const bookings = getBookings();
    const booking = bookings.find(item => item.id === bookingId);
    if (!booking || booking.status !== 'Accepted') {
        alert('Payment is not available for this booking.');
        return;
    }
    booking.status = 'Paid';
    saveBookings(bookings);

    const payments = getPayments();
    payments.push({
        id: Date.now().toString(),
        bookingId,
        payer: booking.requester,
        receiver: booking.owner,
        amount: booking.totalPrice,
        status: 'Completed',
        date: new Date().toLocaleString()
    });
    savePayments(payments);

    const bikes = getBikes();
    const bike = bikes.find(item => item.id === booking.bikeId);
    if (bike) bike.available = false;
    saveBikes(bikes);

    renderBookings();
    renderPayments();
    renderAvailableBikes();
    alert('Payment completed successfully. Enjoy your ride!');
}

function renderPayments() {
    const container = document.getElementById('paymentsArea');
    if (!container) return;

    const currentUser = localStorage.getItem('currentUser');
    const payments = getPayments().filter(payment => payment.payer === currentUser || payment.receiver === currentUser);
    if (payments.length === 0) {
        container.innerHTML = '<p>No payment history yet. Complete a booking to record a payment.</p>';
        return;
    }

    container.innerHTML = payments.map(payment => `<div class="payment-card">
        <p><strong>Amount:</strong> ₹${payment.amount}</p>
        <p><strong>From:</strong> ${payment.payer}</p>
        <p><strong>To:</strong> ${payment.receiver}</p>
        <p><strong>Status:</strong> ${payment.status}</p>
        <p><strong>Date:</strong> ${payment.date}</p>
    </div>`).join('');
}

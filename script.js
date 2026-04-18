const loginForm = document.getElementById('login-form');
const bookingForm = document.getElementById('booking-form');
const loginFeedback = document.getElementById('login-feedback');
const bookingFeedback = document.getElementById('booking-feedback');
const navButtons = document.querySelectorAll('.nav-button');
const sections = {
  login: document.getElementById('login-section'),
  book: document.getElementById('booking-section'),
  summary: document.getElementById('summary-section'),
};

const bikeTypeSelect = document.getElementById('bike-type');
const summaryBikePhoto = null;

const bikeOptions = {
  'Bullet Classic': {
    image: 'https://images.unsplash.com/photo-1485965120184-d0597d1c1c71?auto=format&fit=crop&w=1200&q=80',
    tagline: 'Iconic cruiser feel with a classic motorcycle attitude.',
    rate: 22,
  },
  'Pulsar 150': {
    image: 'https://images.unsplash.com/photo-1491786093031-8b2e55cc4cf3?auto=format&fit=crop&w=1200&q=80',
    tagline: 'Sporty commuter with sharp lines and strong pickup.',
    rate: 20,
  },
  'Scooty Pep+': {
    image: 'https://images.unsplash.com/photo-1499364615650-ec38552f4f34?auto=format&fit=crop&w=1200&q=80',
    tagline: 'Lightweight and easy to ride across the city.',
    rate: 14,
  },
  'Cruiser Tour': {
    image: 'https://images.unsplash.com/photo-1470123808288-8a5d2cc8f42f?auto=format&fit=crop&w=1200&q=80',
    tagline: 'Smooth highway cruising for weekend escapes.',
    rate: 24,
  },
  'MTB Ranger': {
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    tagline: 'Mountain-ready off-road adventure bike with durable build.',
    rate: 18,
  },
  'Electric Glide': {
    image: 'https://images.unsplash.com/photo-1512499617640-c2f999b1fd84?auto=format&fit=crop&w=1200&q=80',
    tagline: 'Silent electric ride for eco-friendly city touring.',
    rate: 23,
  },
  'Sport Racer': {
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
    tagline: 'Aggressive speed styling for fast urban routes.',
    rate: 26,
  },
  'Folding Commuter': {
    image: 'https://images.unsplash.com/photo-1477763858572-b8c8a39f1f7b?auto=format&fit=crop&w=1200&q=80',
    tagline: 'Portable and practical for tight city spaces.',
    rate: 16,
  },
  'Adventure Trek': {
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
    tagline: 'Ready for long rides across varied terrain.',
    rate: 21,
  },
  'Cargo Carrier': {
    image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80',
    tagline: 'Heavy-duty cargo capacity for deliveries and goods.',
    rate: 19,
  },
};

const summaryFields = {
  name: document.getElementById('summary-name'),
  bike: document.getElementById('summary-bike'),
  pickup: document.getElementById('summary-pickup'),
  return: document.getElementById('summary-return'),
  location: document.getElementById('summary-location'),
  duration: document.getElementById('summary-duration'),
  rate: document.getElementById('summary-rate'),
};

let currentUser = null;
let currentBooking = null;

function switchSection(target) {
  Object.values(sections).forEach((section) => section.classList.remove('active-panel'));
  sections[target].classList.add('active-panel');
  navButtons.forEach((button) => button.classList.toggle('active', button.id === `nav-${target}`));
}

navButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const target = button.id.replace('nav-', '');
    if (target === 'book' && !currentUser) {
      loginFeedback.textContent = 'Please login before booking a bike.';
      switchSection('login');
      return;
    }
    if (target === 'summary' && !currentBooking) {
      bookingFeedback.textContent = 'No booking available yet. Please book a bike first.';
      switchSection('book');
      return;
    }
    switchSection(target);
  });
});

function selectBike(bikeName) {
  bikeTypeSelect.value = bikeName;
}

function updateBikePreview(bikeName = bikeTypeSelect.value) {
  bikeTypeSelect.value = bikeName;
}

bikeTypeSelect.addEventListener('change', () => updateBikePreview(bikeTypeSelect.value));

updateBikePreview();

loginForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  if (!email || !password) {
    loginFeedback.textContent = 'Enter both email and password to continue.';
    return;
  }

  currentUser = {
    email,
    displayName: email.split('@')[0].replace(/\W/g, '').replace(/^(.)/, (match) => match.toUpperCase()) || 'Rider',
  };

  loginFeedback.textContent = `Welcome back, ${currentUser.displayName}! You can now book a bike.`;
  loginForm.reset();
  setTimeout(() => switchSection('book'), 900);
});

bookingForm.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!currentUser) {
    bookingFeedback.textContent = 'You need to login first.';
    switchSection('login');
    return;
  }

  const bikeType = document.getElementById('bike-type').value;
  const pickupDate = document.getElementById('pickup-date').value;
  const pickupTime = document.getElementById('pickup-time').value;
  const returnDate = document.getElementById('return-date').value;
  const returnTime = document.getElementById('return-time').value;
  const location = document.getElementById('location').value.trim();

  const pickupDateTime = new Date(`${pickupDate}T${pickupTime}`);
  const returnDateTime = new Date(`${returnDate}T${returnTime}`);

  if (Number.isNaN(pickupDateTime.valueOf()) || Number.isNaN(returnDateTime.valueOf())) {
    bookingFeedback.textContent = 'Please enter valid pickup and return details.';
    return;
  }

  if (returnDateTime <= pickupDateTime) {
    bookingFeedback.textContent = 'Return time must be after pickup time.';
    return;
  }

  const durationMs = returnDateTime - pickupDateTime;
  const hours = Math.ceil(durationMs / (1000 * 60 * 60));
  const selectedBike = bikeOptions[bikeType] || bikeOptions['City Cruiser'];
  const estimatedCost = hours * (selectedBike.rate / 4);

  currentBooking = {
    bikeType,
    pickupDateTime,
    returnDateTime,
    location,
    durationHours: hours,
    rate: `$${estimatedCost.toFixed(2)} estimated`,
    image: selectedBike.image,
  };

  bookingFeedback.textContent = 'Booking confirmed! Review your summary below.';
  bookingForm.reset();
  updateSummary();
  setTimeout(() => switchSection('summary'), 900);
});

function formatDateTime(date) {
  return date.toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function updateSummary() {
  if (!currentBooking || !currentUser) {
    return;
  }
  summaryFields.name.textContent = currentUser.displayName;
  summaryFields.bike.textContent = currentBooking.bikeType;
  summaryFields.pickup.textContent = formatDateTime(currentBooking.pickupDateTime);
  summaryFields.return.textContent = formatDateTime(currentBooking.returnDateTime);
  summaryFields.location.textContent = currentBooking.location;
  summaryFields.duration.textContent = `${currentBooking.durationHours} hour${currentBooking.durationHours > 1 ? 's' : ''}`;
  summaryFields.rate.textContent = currentBooking.rate;
}

switchSection('login');

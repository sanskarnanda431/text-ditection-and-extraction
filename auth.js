const signupForm = document.getElementById('signupForm');
const loginForm = document.getElementById('loginForm');

if (signupForm) {
  const signupMsg = document.getElementById('signupMsg');

  signupForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim().toLowerCase();
    const password = document.getElementById('signupPassword').value;

    if (password.length < 6) {
      signupMsg.textContent = 'Password must be at least 6 characters.';
      return;
    }

    const account = { name, email, password };
    localStorage.setItem('demoUser', JSON.stringify(account));
    signupMsg.textContent = 'Account created. Redirecting to login...';

    setTimeout(() => {
      window.location.href = 'login.html';
    }, 800);
  });
}

if (loginForm) {
  const loginMsg = document.getElementById('loginMsg');

  loginForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const email = document.getElementById('loginEmail').value.trim().toLowerCase();
    const password = document.getElementById('loginPassword').value;

    const saved = JSON.parse(localStorage.getItem('demoUser') || '{}');

    if (email === saved.email && password === saved.password) {
      loginMsg.textContent = `Welcome ${saved.name || 'User'}! Redirecting...`;
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 700);
    } else {
      loginMsg.textContent = 'Invalid credentials. Please sign up first.';
    }
  });
}

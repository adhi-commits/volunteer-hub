// Form Validation for VolunteerCollab

// Email Validation
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Phone Validation
function validatePhone(phone) {
  const re =
    /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/;
  return re.test(phone);
}

// Password Strength Validation
function validatePassword(password) {
  return password.length >= 8;
}

// Show Error Message
function showError(inputId, errorId, message) {
  const input = document.getElementById(inputId);
  const error = document.getElementById(errorId);

  if (input && error) {
    input.classList.add("border-red-500");
    error.textContent = message;
    error.style.display = "block";
  }
}

// Clear Error Message
function clearError(inputId, errorId) {
  const input = document.getElementById(inputId);
  const error = document.getElementById(errorId);

  if (input && error) {
    input.classList.remove("border-red-500");
    error.textContent = "";
    error.style.display = "none";
  }
}

// Login Form Validation
document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("loginForm");

  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();

      let isValid = true;

      // Email Validation
      const email = document.getElementById("loginEmail").value.trim();
      if (!email) {
        showError("loginEmail", "emailError", "Email is required");
        isValid = false;
      } else if (!validateEmail(email)) {
        showError("loginEmail", "emailError", "Please enter a valid email");
        isValid = false;
      } else {
        clearError("loginEmail", "emailError");
      }

      // Password Validation
      const password = document.getElementById("loginPassword").value;
      if (!password) {
        showError("loginPassword", "passwordError", "Password is required");
        isValid = false;
      } else {
        clearError("loginPassword", "passwordError");
      }

      if (isValid) {
        // Show success message
        showMessage("Login successful! Redirecting...", "success");

        // Redirect to dashboard after 1.5 seconds
        setTimeout(() => {
          window.location.href = "dashboard.html";
        }, 1500);
      }
    });
  }

  // Register Form Validation
  const registerForm = document.getElementById("registerForm");

  if (registerForm) {
    registerForm.addEventListener("submit", function (e) {
      e.preventDefault();

      let isValid = true;

      // First Name Validation
      const firstName = document.getElementById("firstName").value.trim();
      if (!firstName) {
        showError("firstName", "firstNameError", "First name is required");
        isValid = false;
      } else {
        clearError("firstName", "firstNameError");
      }

      // Last Name Validation
      const lastName = document.getElementById("lastName").value.trim();
      if (!lastName) {
        showError("lastName", "lastNameError", "Last name is required");
        isValid = false;
      } else {
        clearError("lastName", "lastNameError");
      }

      // Email Validation
      const email = document.getElementById("registerEmail").value.trim();
      if (!email) {
        showError("registerEmail", "regEmailError", "Email is required");
        isValid = false;
      } else if (!validateEmail(email)) {
        showError(
          "registerEmail",
          "regEmailError",
          "Please enter a valid email",
        );
        isValid = false;
      } else {
        clearError("registerEmail", "regEmailError");
      }

      // Phone Validation
      const phone = document.getElementById("phone").value.trim();
      if (!phone) {
        showError("phone", "phoneError", "Phone number is required");
        isValid = false;
      } else if (!validatePhone(phone)) {
        showError("phone", "phoneError", "Please enter a valid phone number");
        isValid = false;
      } else {
        clearError("phone", "phoneError");
      }

      // Password Validation
      const password = document.getElementById("registerPassword").value;
      if (!password) {
        showError(
          "registerPassword",
          "regPasswordError",
          "Password is required",
        );
        isValid = false;
      } else if (!validatePassword(password)) {
        showError(
          "registerPassword",
          "regPasswordError",
          "Password must be at least 8 characters",
        );
        isValid = false;
      } else {
        clearError("registerPassword", "regPasswordError");
      }

      // Confirm Password Validation
      const confirmPassword = document.getElementById("confirmPassword").value;
      if (!confirmPassword) {
        showError(
          "confirmPassword",
          "confirmPasswordError",
          "Please confirm your password",
        );
        isValid = false;
      } else if (password !== confirmPassword) {
        showError(
          "confirmPassword",
          "confirmPasswordError",
          "Passwords do not match",
        );
        isValid = false;
      } else {
        clearError("confirmPassword", "confirmPasswordError");
      }

      // Terms & Conditions Validation
      const terms = document.getElementById("terms");
      if (!terms.checked) {
        showError(
          "terms",
          "termsError",
          "You must agree to terms and conditions",
        );
        isValid = false;
      } else {
        clearError("terms", "termsError");
      }

      if (isValid) {
        // Show success message
        showMessage("Registration successful! Redirecting...", "success");

        // Redirect to dashboard after 1.5 seconds
        setTimeout(() => {
          window.location.href = "dashboard.html";
        }, 1500);
      }
    });

    // Real-time validation
    const inputs = [
      "firstName",
      "lastName",
      "registerEmail",
      "phone",
      "registerPassword",
      "confirmPassword",
    ];
    inputs.forEach((inputId) => {
      const input = document.getElementById(inputId);
      if (input) {
        input.addEventListener("blur", function () {
          validateField(inputId);
        });
      }
    });
  }
});

// Validate Individual Field
function validateField(inputId) {
  const input = document.getElementById(inputId);
  if (!input) return;

  const value = input.value.trim();

  switch (inputId) {
    case "firstName":
      if (!value) {
        showError(inputId, "firstNameError", "First name is required");
      } else {
        clearError(inputId, "firstNameError");
      }
      break;

    case "lastName":
      if (!value) {
        showError(inputId, "lastNameError", "Last name is required");
      } else {
        clearError(inputId, "lastNameError");
      }
      break;

    case "registerEmail":
      if (!value) {
        showError(inputId, "regEmailError", "Email is required");
      } else if (!validateEmail(value)) {
        showError(inputId, "regEmailError", "Please enter a valid email");
      } else {
        clearError(inputId, "regEmailError");
      }
      break;

    case "phone":
      if (!value) {
        showError(inputId, "phoneError", "Phone number is required");
      } else if (!validatePhone(value)) {
        showError(inputId, "phoneError", "Please enter a valid phone number");
      } else {
        clearError(inputId, "phoneError");
      }
      break;

    case "registerPassword":
      if (!value) {
        showError(inputId, "regPasswordError", "Password is required");
      } else if (!validatePassword(value)) {
        showError(
          inputId,
          "regPasswordError",
          "Password must be at least 8 characters",
        );
      } else {
        clearError(inputId, "regPasswordError");
      }
      break;

    case "confirmPassword":
      const password = document.getElementById("registerPassword").value;
      if (!value) {
        showError(
          inputId,
          "confirmPasswordError",
          "Please confirm your password",
        );
      } else if (password !== value) {
        showError(inputId, "confirmPasswordError", "Passwords do not match");
      } else {
        clearError(inputId, "confirmPasswordError");
      }
      break;
  }
}

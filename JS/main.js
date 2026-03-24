// Main JavaScript for VolunteerCollab

// Mobile Menu Toggle
document.addEventListener("DOMContentLoaded", function () {
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const mobileMenu = document.getElementById("mobileMenu");

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener("click", function () {
      mobileMenu.classList.toggle("hidden");
    });
  }

  // Role Selection Toggle
  const roleInputs = document.querySelectorAll('input[name="role"]');
  const volunteerFields = document.getElementById("volunteerFields");
  const ngoFields = document.getElementById("ngoFields");

  roleInputs.forEach((input) => {
    input.addEventListener("change", function () {
      if (this.value === "volunteer") {
        volunteerFields?.classList.remove("hidden");
        ngoFields?.classList.add("hidden");
      } else {
        volunteerFields?.classList.add("hidden");
        ngoFields?.classList.remove("hidden");
      }
    });
  });

  // Smooth Scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });

  // Search Functionality
  const searchInput = document.getElementById("searchCampaign");
  if (searchInput) {
    searchInput.addEventListener("input", function (e) {
      const searchTerm = e.target.value.toLowerCase();
      console.log("Searching for:", searchTerm);
      // Backend integration will go here
    });
  }

  // Filter Functionality
  const categoryFilter = document.getElementById("categoryFilter");
  if (categoryFilter) {
    categoryFilter.addEventListener("change", function (e) {
      const category = e.target.value;
      console.log("Filtering by category:", category);
      // Backend integration will go here
    });
  }

  const statusFilter = document.getElementById("statusFilter");
  if (statusFilter) {
    statusFilter.addEventListener("change", function (e) {
      const status = e.target.value;
      console.log("Filtering by status:", status);
      // Backend integration will go here
    });
  }

  // NGO Search
  const searchNGO = document.getElementById("searchNGO");
  if (searchNGO) {
    searchNGO.addEventListener("input", function (e) {
      const searchTerm = e.target.value.toLowerCase();
      console.log("Searching NGOs:", searchTerm);
      // Backend integration will go here
    });
  }

  // Animation on Scroll
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate-fade-in");
      }
    });
  }, observerOptions);

  document
    .querySelectorAll(".feature-card, .campaign-card, .ngo-card")
    .forEach((card) => {
      observer.observe(card);
    });
});

// Password Toggle Function
function togglePassword(inputId, iconId) {
  const input = document.getElementById(inputId);
  const icon = document.getElementById(iconId);

  if (input && icon) {
    if (input.type === "password") {
      input.type = "text";
      icon.textContent = "visibility_off";
    } else {
      input.type = "password";
      icon.textContent = "visibility";
    }
  }
}

// Show Success Message
function showMessage(message, type = "success") {
  const messageDiv = document.createElement("div");
  messageDiv.className = `fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg ${type === "success" ? "bg-green-500" : "bg-red-500"
    } text-white transform transition-all duration-300`;
  messageDiv.textContent = message;

  document.body.appendChild(messageDiv);

  setTimeout(() => {
    messageDiv.style.opacity = "0";
    setTimeout(() => messageDiv.remove(), 300);
  }, 3000);
}

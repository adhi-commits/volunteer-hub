// Dashboard Specific JavaScript

document.addEventListener("DOMContentLoaded", function () {
  // Get user data from localStorage (simulated)
  const userData = {
    name: "John Doe",
    totalHours: 36,
    campaigns: 12,
    points: 450,
    level: "Gold Volunteer",
  };

  // Update dashboard stats
  updateDashboardStats(userData);

  // Load recommended campaigns
  loadRecommendedCampaigns();

  // Load recent activity
  loadRecentActivity();

  // Load leaderboard
  loadLeaderboard();
});

function updateDashboardStats(data) {
  // This function will update stats from backend
  console.log("Updating dashboard with:", data);
}

function loadRecommendedCampaigns() {
  // This function will load campaigns from backend
  console.log("Loading recommended campaigns...");
}

function loadRecentActivity() {
  // This function will load activity from backend
  console.log("Loading recent activity...");
}

function loadLeaderboard() {
  // This function will load leaderboard from backend
  console.log("Loading leaderboard...");
}

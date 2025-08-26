// Script 1: Extract All Followers (Manual Scroll Version)
(async function extractAllFollowers() {
  console.log("🚀 Script 1: Starting follower extraction...");

  let followersList = [];

  const log = (message, type = "info") => {
    const timestamp = new Date().toLocaleTimeString();
    const emoji =
      type === "success"
        ? "✅"
        : type === "error"
        ? "❌"
        : type === "warning"
        ? "⚠️"
        : "ℹ️";
    console.log(`${emoji} [${timestamp}] ${message}`);
  };

  // Check if we're on the followers dialog
  const dialog = document.querySelector('div[role="dialog"]');
  if (!dialog || !dialog.textContent.includes("Followers")) {
    alert(
      '❌ Please open the FOLLOWERS dialog first!\n\n1. Go to your profile\n2. Click on your "Followers" count\n3. Then run this script'
    );
    return;
  }

  log(
    "📜 IMPORTANT: Please scroll to the BOTTOM of your followers dialog first!"
  );
  log(
    "⬇️ Scroll all the way down to load ALL your followers before running this script"
  );
  log("🔄 Then run this script to capture all loaded followers at once");
  log("⏱️  Extracting followers from currently loaded content...");

  // Find all account links in the followers dialog
  const accountElements = dialog.querySelectorAll('a[href^="/"][href$="/"]');

  log(`Found ${accountElements.length} followers in current view`);

  // Extract follower information
  accountElements.forEach((element) => {
    const href = element.getAttribute("href");
    if (href && href.length > 2) {
      const username = href.slice(1, -1); // Remove leading and trailing slashes

      // Avoid duplicates
      if (!followersList.find((follower) => follower.username === username)) {
        const displayName = element.textContent.trim();
        const container = element.closest("div");
        const isVerified =
          container.querySelector('[aria-label*="Verified"]') !== null;

        followersList.push({
          username: username,
          displayName: displayName,
          isVerified: isVerified,
          profileUrl: `https://instagram.com${href}`,
        });
      }
    }
  });

  // Store followers in global variable
  window.myFollowersList = followersList;
  window.followersUsernames = followersList.map((f) => f.username);

  log(
    `✅ Extracted ${followersList.length} followers from current view!`,
    "success"
  );
  log(`📊 Followers data stored in variables:`, "info");
  log(`   • window.myFollowersList (detailed info)`, "info");
  log(`   • window.followersUsernames (username array)`, "info");

  // Display sample of followers
  console.log("📋 Sample of followers (first 10):");
  console.table(
    followersList.slice(0, 10).map((f) => ({
      Username: f.username,
      "Display Name": f.displayName,
      Verified: f.isVerified,
    }))
  );

  console.log("\n📜 UPDATED INSTRUCTIONS:");
  console.log(
    "1. ⬇️ FIRST: Scroll to the BOTTOM of your followers dialog to load ALL followers"
  );
  console.log(
    "2. 🔄 THEN: Run this script to capture all loaded followers at once"
  );
  console.log("3. ✅ If the count looks complete, close this dialog");
  console.log(
    "4. 📂 Open your FOLLOWING dialog and scroll to bottom there too"
  );
  console.log("5. 🎯 Run Script 2 to unfollow non-followers");
  console.log("\n💾 Your followers list is saved in: window.myFollowersList");

  return followersList;
})();

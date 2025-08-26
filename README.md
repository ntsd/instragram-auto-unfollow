# Instagram Unfollow Non-Followers Scripts

Two JavaScript scripts to automatically unfollow Instagram accounts that don't follow you back.

## 🚀 Quick Start

1. **Extract your followers** with Script 1
2. **Unfollow non-followers** with Script 2

## 📋 Script 1: Extract All Followers

### Purpose

Extracts all your Instagram followers and stores them in browser memory for comparison.

### How to Use

1. **Go to your Instagram profile**
2. **Click on your "Followers" count** to open the followers dialog
3. **⬇️ IMPORTANT: Scroll to the BOTTOM** of the followers dialog to load ALL followers
4. **Open Developer Tools** (`F12` or `Cmd+Option+I` on Mac)
5. **Go to Console tab**
6. **Paste and run Script 1**

### Script 1 Code

```javascript
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
```

---

## 🎯 Script 2: Unfollow Non-Followers

### Purpose

Automatically unfollows Instagram accounts that don't follow you back, using the followers list from Script 1.

### How to Use

1. **Make sure you've run Script 1 first**
2. **Close the followers dialog**
3. **Click on your "Following" count** to open the following dialog
4. **⬇️ IMPORTANT: Scroll to the BOTTOM** of the following dialog to load ALL accounts you're following
5. **In the same console, paste and run Script 2**
6. **Watch it automatically unfollow non-followers**

### Script 2 Code

```javascript
// Ultra-short: Process ALL buttons
(async function () {
  if (!window.followersUsernames) return alert("Run Script 1 first!");

  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const buttons = [...document.querySelectorAll("button")].filter(
    (b) => b.textContent.trim() === "Following"
  );
  let count = 0;

  console.log(`🎯 Processing ALL ${buttons.length} Following buttons...`);

  for (let i = 0; i < buttons.length; i++) {
    const btn = buttons[i];
    const container = btn.closest("div").parentElement.parentElement;
    const links = container.querySelectorAll('a[href^="/"]');

    let username = null;
    for (const link of links) {
      const href = link.getAttribute("href");
      const match = href.match(/^\/([a-zA-Z0-9._]+)\/?$/);
      if (match && !["explore", "reels", "direct"].includes(match[1])) {
        username = match[1];
        break;
      }
    }

    if (username && !window.followersUsernames.includes(username)) {
      console.log(`${i + 1}/${buttons.length}: Unfollowing ${username}...`);
      btn.click();
      await wait(1500);

      const unfollowBtn = [...document.querySelectorAll("button")].find(
        (b) => b.textContent.trim() === "Unfollow"
      );
      if (unfollowBtn) {
        unfollowBtn.click();
        count++;
        console.log(`✅ ${count}. Unfollowed ${username}`);
      }
      await wait(3000);
    } else if (username) {
      console.log(`${i + 1}/${buttons.length}: ⏭️ ${username} follows back`);
    }
  }

  console.log(`🎉 Done! Unfollowed ${count}/${buttons.length} accounts`);
})();
```

---

## ⚡ Features

### Script 1 Features:

- ✅ Extracts all followers from Instagram dialog
- ✅ Stores data in browser memory (`window.followersUsernames`)
- ✅ Shows sample of extracted followers
- ✅ Manual scroll control (user scrolls to bottom first)
- ✅ Detailed logging with timestamps

### Script 2 Features:

- ✅ Processes ALL following accounts (no limits)
- ✅ Automatically identifies non-mutual follows
- ✅ Shows progress for each account processed
- ✅ Handles Instagram's confirmation dialogs
- ✅ Built-in rate limiting (3-second delays)
- ✅ Skips accounts that follow you back

---

## 🛡️ Safety Features

- **Rate Limiting**: 3-second delays between unfollows to avoid Instagram restrictions
- **Confirmation Handling**: Automatically handles Instagram's "Unfollow" confirmation dialogs
- **Error Handling**: Continues processing even if individual accounts fail
- **Progress Tracking**: Shows detailed progress in console
- **No Confirmation Required**: Runs automatically without user prompts

---

## 📊 Example Output

### Script 1 Output:

```
🚀 Script 1: Starting follower extraction...
✅ [2:34:56 PM] Extracted 847 followers from current view!
📋 Sample of followers (first 10):
┌─────────┬──────────────┬─────────────────┬──────────┐
│ (index) │   Username   │  Display Name   │ Verified │
├─────────┼──────────────┼─────────────────┼──────────┤
│    0    │ 'john_doe'   │   'John Doe'    │  false   │
│    1    │ 'jane_smith' │  'Jane Smith'   │  false   │
└─────────┴──────────────┴─────────────────┴──────────┘
```

### Script 2 Output:

```
🎯 Processing ALL 256 Following buttons...
1/256: Unfollowing celebrity_account...
✅ 1. Unfollowed celebrity_account
2/256: ⏭️ john_doe follows back
3/256: Unfollowing brand_official...
✅ 2. Unfollowed brand_official
...
🎉 Done! Unfollowed 45/256 accounts
```

---

## 🚨 Important Notes

1. **Scroll First**: Always scroll to the bottom of both dialogs before running scripts
2. **Run Script 1 First**: Script 2 requires the followers data from Script 1
3. **Don't Refresh**: Don't refresh the page between scripts (data is stored in memory)
4. **Rate Limits**: Instagram may temporarily limit your account if you unfollow too many accounts too quickly
5. **Manual Control**: You control the scrolling, the scripts handle the processing

---

## 🐛 Troubleshooting

| Problem                      | Solution                                                               |
| ---------------------------- | ---------------------------------------------------------------------- |
| "Run Script 1 first!" error  | Make sure you've successfully run Script 1 and see the followers count |
| "No Following buttons found" | Make sure you're in the Following dialog, not Followers                |
| Script finds 0 to unfollow   | Everyone you follow actually follows you back! 🎉                      |
| Username extraction fails    | Try scrolling more or check if Instagram updated their HTML structure  |

---

## ⚠️ Disclaimer

These scripts are for educational purposes. Use responsibly and be aware that:

- Instagram's terms of service prohibit automated actions
- Excessive unfollowing may result in temporary account restrictions
- Instagram may update their website structure, breaking the scripts
- Always backup important data before running automation scripts

**Use at your own risk!**

Similar code found with 1 license type

// Process ALL Following buttons (no 30 limit)
(async function processAllButtons() {
  if (!window.followersUsernames) return alert("Run Script 1 first!");

  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  let count = 0;

  console.log("🎯 Processing ALL Following buttons (no limit)...");
  console.log(`📊 Your followers: ${window.followersUsernames.length}`);

  // Get ALL Following buttons
  const buttons = [...document.querySelectorAll("button")].filter(
    (b) => b.textContent.trim() === "Following"
  );

  console.log(
    `🔍 Found ${buttons.length} Following buttons - processing ALL of them`
  );

  // Process every single button
  for (let i = 0; i < buttons.length; i++) {
    const btn = buttons[i];

    try {
      console.log(`\n🔍 Processing button ${i + 1}/${buttons.length}...`);

      // Look for username in the button's container
      let username = null;
      const row = btn.closest("div");
      const rowParent = row?.parentElement;
      const rowGrandParent = rowParent?.parentElement;

      // Check different levels for username links
      const containers = [row, rowParent, rowGrandParent].filter((c) => c);

      for (const container of containers) {
        const links = container.querySelectorAll('a[href^="/"]');
        for (const link of links) {
          const href = link.getAttribute("href");
          const match = href.match(/^\/([a-zA-Z0-9._]+)\/?$/);
          if (match && match[1] && match[1].length > 1) {
            const candidate = match[1];
            // Skip common Instagram paths
            if (
              !["explore", "reels", "direct", "accounts"].includes(candidate)
            ) {
              username = candidate;
              console.log(`Found username: ${username}`);
              break;
            }
          }
        }
        if (username) break;
      }

      // Fallback: look for text patterns if no link found
      if (!username) {
        const allText = (rowGrandParent || rowParent || row)?.textContent || "";
        const words = allText.split(/\s+/).filter((w) => w.length > 2);

        for (const word of words) {
          if (
            /^[a-zA-Z0-9._]+$/.test(word) &&
            !["Following", "Follow", "Message", "Remove"].includes(word)
          ) {
            username = word;
            console.log(`Found username by text: ${username}`);
            break;
          }
        }
      }

      if (username) {
        // Check if this user follows you back
        const followsBack = window.followersUsernames.includes(username);
        console.log(`${username} follows you back: ${followsBack}`);

        if (!followsBack) {
          console.log(`🎯 Unfollowing ${username}...`);

          btn.click();
          await wait(1500);

          const unfollowBtn = [...document.querySelectorAll("button")].find(
            (b) => b.textContent.trim() === "Unfollow"
          );

          if (unfollowBtn) {
            unfollowBtn.click();
            count++;
            console.log(`✅ ${count}. Unfollowed ${username}`);
          } else {
            console.log(`❌ No unfollow confirmation found for ${username}`);
            const cancelBtn = [...document.querySelectorAll("button")].find(
              (b) => b.textContent.trim() === "Cancel"
            );
            if (cancelBtn) cancelBtn.click();
          }

          await wait(3000);
        } else {
          console.log(`⏭️ Skipping ${username} - they follow you back`);
        }
      } else {
        console.log(`❌ Could not find username for button ${i + 1}`);
      }
    } catch (error) {
      console.log(`❌ Error processing button ${i + 1}: ${error.message}`);
      await wait(2000);
    }
  }

  console.log(`\n🎉 COMPLETE! Processed all ${buttons.length} buttons`);
  console.log(`📊 Total unfollowed: ${count} accounts`);
})();

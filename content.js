(function () {
  function makeDraggable(el) {
    let isDragging = false,
      startX,
      startY;
    el.querySelector("header").addEventListener("mousedown", (e) => {
      isDragging = true;
      startX = e.clientX - el.offsetLeft;
      startY = e.clientY - el.offsetTop;
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    });
    function onMouseMove(e) {
      if (!isDragging) return;
      el.style.left = e.clientX - startX + "px";
      el.style.top = e.clientY - startY + "px";
    }
    function onMouseUp() {
      isDragging = false;
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    }
  }

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  // Add custom CSS styles to document
  function injectStyles() {
    if (document.getElementById("cp-extension-styles")) return;

    const styleEl = document.createElement("style");
    styleEl.id = "cp-extension-styles";
    styleEl.textContent = `
      #cp-extension-box {
        transition: all 0.3s ease;
      }
      #cp-extension-box.collapsed .content {
        display: none !important;
      }
      #cp-extension-box button:not(:disabled):hover {
        opacity: 0.9;
        transform: translateY(-1px);
      }
      #cp-extension-box input[type=number]::-webkit-inner-spin-button {
        opacity: 1;
      }
    `;
    document.head.appendChild(styleEl);
  }

  function addUI() {
    if (document.getElementById("cp-extension-box")) return;

    // Add styles first
    injectStyles();

    const container = document.createElement("div");
    container.id = "cp-extension-box";
    container.style.position = "fixed";

    // Set default position for the container
    container.style.top = "20px";
    container.style.right = "20px";
    container.style.zIndex = "9999";
    container.style.boxShadow = "0 2px 10px rgba(0,0,0,0.2)";
    container.style.borderRadius = "12px";
    container.style.width = "300px";

    container.innerHTML = `
      <header style="background: #2563EB; color: #fff; border-radius: 12px 12px 0 0; padding: 8px 12px; display: flex; align-items: center; justify-content: flex-start; box-shadow: 0 2px 8px #0002;">
        <span style="font-weight: bold; font-size: 1.18em; letter-spacing: 1px; display: flex; align-items: center; gap: 6px; flex-shrink:0;">
          <span style="font-size:1.2em;">📌</span>
          <span style="margin-left:8px;">CodeOTC</span>
        </span>
        <span style="flex:1;"></span>
        <button class="toggle-btn" style="background: none; border: none; color: #fff; font-size: 1.3em; cursor: pointer; margin-left: 0; flex-shrink:0;">&#9650;</button>
      </header>
      <div class="clock-row" style="width:100%;display:flex;justify-content:center;align-items:center;background:#f8fafc;border-bottom:1px solid #e0e7ef;">
        <span id="cp-main-clock" style="font-size:2.5rem;font-weight:800;color:#2563EB;letter-spacing:1px;line-height:1.2;margin:12px 0 4px 0;">00:00</span>
      </div>
      <div class="content" id="cp-content-section" style="background: #fff; border-radius: 0 0 12px 12px; box-shadow: 0 2px 8px #0001; padding-bottom: 8px;">
        <div class="mode-row" style="display:flex;justify-content:center;gap:10px;margin:10px 0 8px 0;">
          <label style="font-size:1.1rem;color:#2563EB;"><input type="radio" name="cp-mode" value="timer" checked> Timer</label>
          <label style="font-size:1.1rem;color:#2563EB;"><input type="radio" name="cp-mode" value="stopwatch"> Stopwatch</label>
        </div>
        <div id="cp-timer-controls" style="display:flex;align-items:center;gap:4px;justify-content:center;margin-bottom:10px;">
          <input id="cp-timer-minutes" type="number" min="0" max="59" value="1" style="width:38px;text-align:right;font-size:1.2em;"> :
          <input id="cp-timer-seconds" type="number" min="0" max="59" value="00" style="width:38px;text-align:left;font-size:1.2em;">
        </div>
        <div id="cp-stopwatch-controls" style="display:none;justify-content:center;align-items:center;height:28px;"></div>
        <div style="display:flex;align-items:center;gap:6px;justify-content:center; margin-bottom: 10px; width:100%; box-sizing:border-box; flex-wrap:nowrap;">
          <button id="cp-main-start" style="background: linear-gradient(180deg, #3887f6 0%, #2563EB 100%); color: #fff; border-radius: 8px; border: none; padding: 8px 0; width:32%; min-width:60px; font-weight: bold; font-size: 1em; cursor: pointer; box-shadow:0 2px 8px #2563eb22;">▶️ Start</button>
          <button id="cp-main-pause" disabled style="background: #f1f5fa; color: #b0b8c9; border-radius: 8px; border: none; padding: 8px 0; width:32%; min-width:60px; font-weight: bold; font-size: 1em; cursor: pointer;">⏸️ Pause</button>
          <button id="cp-main-reset" disabled style="background: #f1f5fa; color: #b0b8c9; border-radius: 8px; border: none; padding: 8px 0; width:32%; min-width:60px; font-weight: bold; font-size: 1em; cursor: pointer;">🔄 Reset</button>
        </div>
        <textarea id="cp-note" rows="2" placeholder="Add a note..." style="width:90%;margin:8px auto 8px auto;display:block;border-radius:10px;border:2px solid #2563EB;padding:8px 12px;font-size:1.1em;color:#2563EB;resize:none;"></textarea>
        <select id="cp-status" style="width:90%;margin:8px auto 12px auto;display:block;border-radius:10px;border:2px solid #2563EB;padding:8px 12px;font-size:1.1em;color:#2563EB;">
          <option>To Do</option>
          <option>In Progress</option>
          <option>Mastered</option>
        </select>
        <button id="cp-save" style="width:90%;margin:0 auto 10px auto;display:block;background: linear-gradient(90deg, #2563EB 60%, #60a5fa 100%); color: #fff; border-radius: 12px; border: none; padding: 14px 0; font-weight: bold; font-size: 1.2em; cursor: pointer; box-shadow: 0 1px 4px #0001;">💾 Save</button>
        <div id="cp-bookmarks-section" style="margin-top:12px;max-height:120px;overflow:auto;display:none;"></div>
      </div>
    `;
    document.body.appendChild(container);

    makeDraggable(container);

    const toggleBtn = container.querySelector(".toggle-btn");
    const clockRow = container.querySelector(".clock-row");
    const contentDiv = container.querySelector(".content");

    // Set up toggle functionality (defined once)
    toggleBtn.onclick = () => {
      container.classList.toggle("collapsed");
      toggleBtn.innerHTML = container.classList.contains("collapsed")
        ? "&#9660;"
        : "&#9650;";

      // Keep clock row always visible
      clockRow.style.display = "flex";

      if (container.classList.contains("collapsed")) {
        // Hide content but keep clock visible
        contentDiv.style.display = "none";
        bookmarksSection.style.display = "none";
      } else {
        // Show everything when expanded
        contentDiv.style.display = "block";
        bookmarksSection.style.display = "block";
        renderBookmarks();
      }
    };

    // --- Mode switch logic ---
    let mode = "timer";
    const modeRadios = container.querySelectorAll('input[name="cp-mode"]');
    const timerControls = document.getElementById("cp-timer-controls");
    const stopwatchControls = document.getElementById("cp-stopwatch-controls");
    modeRadios.forEach((radio) => {
      radio.onchange = () => {
        mode = radio.value;
        if (mode === "timer") {
          timerControls.style.display = "flex";
          stopwatchControls.style.display = "none";
        } else {
          timerControls.style.display = "none";
          stopwatchControls.style.display = "flex";
        }
        setState("idle");
        updateClockDisplay(0);
        clearInterval(timerInterval);
        clearInterval(stopwatchInterval);
        running = false;
        timerPaused = false;
        stopwatchPaused = false;
        stopwatchSeconds = 0;
        timerRemaining = 0;
      };
    });

    // --- Common clock logic ---
    const mainClock = document.getElementById("cp-main-clock");
    let timerInterval,
      timerRemaining = 0;
    let stopwatchInterval,
      stopwatchSeconds = 0,
      running = false;
    function updateClockDisplay(secs) {
      mainClock.textContent = pad(Math.floor(secs / 60)) + ":" + pad(secs % 60);
    }
    updateClockDisplay(0);

    // Unified controls
    const startBtn = document.getElementById("cp-main-start");
    const pauseBtn = document.getElementById("cp-main-pause");
    const resetBtn = document.getElementById("cp-main-reset");
    const minInput = document.getElementById("cp-timer-minutes");
    const secInput = document.getElementById("cp-timer-seconds");

    function setState(state) {
      if (state === "idle") {
        startBtn.disabled = false;
        pauseBtn.disabled = true;
        resetBtn.disabled = true;
        startBtn.innerHTML = "▶️ Start";
        pauseBtn.innerHTML = "⏸️ Pause";
      } else if (state === "running") {
        startBtn.disabled = true;
        pauseBtn.disabled = false;
        resetBtn.disabled = false;
        startBtn.innerHTML = "▶️ Start";
        pauseBtn.innerHTML = "⏸️ Pause";
      } else if (state === "paused") {
        startBtn.disabled = false;
        pauseBtn.disabled = true;
        resetBtn.disabled = false;
        startBtn.innerHTML = "▶️ Resume";
        pauseBtn.innerHTML = "⏸️ Pause";
      }
    }

    let timerPaused = false;
    let timerPausedAt = 0;
    let stopwatchPaused = false;

    startBtn.onclick = () => {
      if (mode === "timer") {
        let mins = parseInt(minInput.value, 10) || 0;
        let secs = parseInt(secInput.value, 10) || 0;
        if (mins > 0 || secs > 0) {
          clearInterval(timerInterval);
          clearInterval(stopwatchInterval);
          running = true;
          timerPaused = false;
          timerRemaining = mins * 60 + secs;
          updateClockDisplay(timerRemaining);
          setState("running");
          timerInterval = setInterval(() => {
            timerRemaining--;
            updateClockDisplay(timerRemaining);
            if (timerRemaining <= 0) {
              clearInterval(timerInterval);
              updateClockDisplay(0);
              setState("idle");
              running = false;
              // Use a more user-friendly notification
              const notification = document.createElement("div");
              notification.style =
                "position:absolute;top:100%;left:50%;transform:translate(-50%,10px);background:#2563EB;color:white;padding:8px 16px;border-radius:8px;font-weight:bold;box-shadow:0 4px 12px rgba(0,0,0,0.2);";
              notification.textContent = "⏰ Time's up!";
              container.appendChild(notification);
              setTimeout(() => notification.remove(), 3000);
            }
          }, 1000);
        }
      } else if (mode === "stopwatch") {
        // Handle both initial start and resume from pause
        if (!running) {
          clearInterval(timerInterval);
          running = true;
          setState("running");
          stopwatchInterval = setInterval(() => {
            stopwatchSeconds++;
            updateClockDisplay(stopwatchSeconds);
          }, 1000);
          stopwatchPaused = false;
        }
      }
    };

    pauseBtn.onclick = () => {
      if (mode === "timer" && running) {
        clearInterval(timerInterval);
        timerPaused = true;
        timerPausedAt = timerRemaining;
        running = false;
        setState("paused");
      } else if (mode === "stopwatch" && running) {
        clearInterval(stopwatchInterval);
        stopwatchPaused = true;
        running = false;
        setState("paused");
      }
    };

    resetBtn.onclick = () => {
      if (mode === "timer") {
        clearInterval(timerInterval);
        timerRemaining =
          (parseInt(minInput.value, 10) || 0) * 60 +
          (parseInt(secInput.value, 10) || 0);
        updateClockDisplay(timerRemaining);
        setState("idle");
        running = false;
        timerPaused = false;
      } else if (mode === "stopwatch") {
        clearInterval(stopwatchInterval);
        stopwatchSeconds = 0;
        updateClockDisplay(0);
        setState("idle");
        running = false;
        stopwatchPaused = false;
      }
    };

    // This duplicate event handler is not needed since the functionality
    // should already be part of the startBtn.onclick function

    setState("idle");
    updateClockDisplay(0);

    // --- Bookmarks display logic ---
    const bookmarksSection = container.querySelector("#cp-bookmarks-section");

    // Add a button to toggle bookmarks visibility
    const bookmarksToggleBtn = document.createElement("button");
    bookmarksToggleBtn.textContent = "Show Bookmarks";
    bookmarksToggleBtn.style =
      "width:90%;margin:0 auto 10px auto;display:block;background:#f1f5f9;color:#2563EB;border-radius:8px;border:1px solid #dbe2ef;padding:8px 0;font-weight:bold;font-size:0.9em;cursor:pointer;";
    container
      .querySelector("#cp-content-section")
      .insertBefore(bookmarksToggleBtn, bookmarksSection);

    bookmarksToggleBtn.onclick = () => {
      if (bookmarksSection.style.display === "block") {
        bookmarksSection.style.display = "none";
        bookmarksToggleBtn.textContent = "Show Bookmarks";
      } else {
        bookmarksSection.style.display = "block";
        bookmarksToggleBtn.textContent = "Hide Bookmarks";
        renderBookmarks();
      }
    };

    function renderBookmarks() {
      bookmarksSection.innerHTML =
        '<div style="text-align:center;padding:10px;color:#888;">Loading bookmarks...</div>';

      chrome.storage.sync.get(["cp_bookmarks"], (res) => {
        const bookmarks = res.cp_bookmarks || [];
        if (bookmarks.length === 0) {
          bookmarksSection.innerHTML =
            '<div style="color:#888;font-size:0.97em;">No bookmarks yet.</div>';
          return;
        }
        // Get status color based on status text
        const getStatusColor = (status) => {
          switch (status) {
            case "To Do":
              return "#f5c242"; // yellow/orange
            case "In Progress":
              return "#3b82f6"; // blue
            case "Mastered":
              return "#10B981"; // green
            default:
              return "#f5c242";
          }
        };

        bookmarksSection.innerHTML = bookmarks
          .slice()
          .reverse()
          .map(
            (b) => `
          <div style="background:#fff;border-radius:6px;box-shadow:0 1px 4px #0001;margin-bottom:8px;padding:7px 10px;">
            <a href="${
              b.url
            }" target="_blank" style="font-weight:bold;color:#1a2233;text-decoration:none;">${
              b.title
            }</a>
            <span style="font-size:0.92em;color:#fff;background:${getStatusColor(
              b.status
            )};border-radius:4px;padding:1px 6px;margin-left:6px;">${
              b.status
            }</span><br/>
            <span style="color:#222;font-size:0.97em;">${
              b.note ? b.note : "<i>No note</i>"
            }</span><br/>
            <span style="color:#888;font-size:0.85em;">${new Date(
              b.date
            ).toLocaleString()}</span>
          </div>
        `
          )
          .join("");
      });
    }
    // This redundant toggleBtn.onclick handler is removed as it's already defined above

    // Also refresh bookmarks after saving
    document.getElementById("cp-save").onclick = () => {
      const data = {
        title: document.title,
        url: location.href,
        note: document.getElementById("cp-note").value,
        status: document.getElementById("cp-status").value,
        date: new Date().toISOString(),
      };

      // Save bookmark data
      chrome.storage.sync.get(["cp_bookmarks"], (res) => {
        const list = res.cp_bookmarks || [];
        list.push(data);
        chrome.storage.sync.set({ cp_bookmarks: list }, renderBookmarks);

        // Show a non-blocking notification
        const saveConfirm = document.createElement("div");
        saveConfirm.style =
          "position:absolute;bottom:100%;left:50%;transform:translate(-50%,-10px);background:#10B981;color:white;padding:8px 16px;border-radius:8px;font-weight:bold;box-shadow:0 4px 12px rgba(0,0,0,0.2);";
        saveConfirm.textContent = "✅ Saved to bookmarks!";
        container.appendChild(saveConfirm);
        setTimeout(() => saveConfirm.remove(), 2000);
      });
    };
  }
  // Initialize UI with a small delay to ensure the page is fully loaded
  window.addEventListener("load", () => {
    // Small delay to ensure DOM is fully ready
    setTimeout(addUI, 300);
  });

  // Also listen for URL changes on single-page applications
  let lastUrl = location.href;
  new MutationObserver(() => {
    if (location.href !== lastUrl) {
      lastUrl = location.href;
      // Re-initialize UI if it doesn't exist when URL changes
      if (!document.getElementById("cp-extension-box")) {
        setTimeout(addUI, 300);
      }
    }
  }).observe(document, { subtree: true, childList: true });

  // Initial call to catch pages that might already be loaded
  if (
    document.readyState === "complete" &&
    !document.getElementById("cp-extension-box")
  ) {
    addUI();
  }
})();

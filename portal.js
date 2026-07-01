/* ============================================================
   MERCANTILE OFFICE SYSTEMS - PORTAL LOGIC
   ============================================================
   This uses the SAME clip approach proven to work in the
   personal portal, applied to the MOS card-grid structure.

   HOW TO ADD A NEW MENU LATER:
   Copy one block inside the `apps` array below, paste it, and
   change the lines (title, description, url). The page builds
   the card and wires up its button automatically. You never
   touch the HTML.

   ABOUT "clip":
   "clip" shifts the embedded app vertically so it sits right
   under your top bar. It works in BOTH directions:

     POSITIVE value (e.g. 48)  -> pulls the app UP.
        Use when a Google banner at the top needs hiding.

     NEGATIVE value (e.g. -40) -> pushes the app DOWN.
        Use when the app's OWN title is hidden behind your bar
        and you need to reveal it (this is the Task Tracking case).

     0 or no clip -> app sits flush, no shift (uses DEFAULT_CLIP).

   Each app sets what it needs. New apps work with the default;
   you only adjust the odd ones.
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    // Default clip in pixels for any app that does not set its own.
    const DEFAULT_CLIP = 48;

    /* ------------------------------------------------------------
       THE APP LIST  -  your single source of truth.
       Paste your real Google Apps Script /exec URLs here.
       Add `clip` only to an app whose top line needs adjusting.
       ------------------------------------------------------------ */
    const apps = [
        {
            title: "Dashboard",
            description: "Access real-time business insights, financial KPIs, and performance overviews in one centralized location.",
//            url: "https://script.google.com/macros/s/AKfycbyD9hAae7Rx8Bj4Y_SByNXAPEpHVyVxH6McSBT0HPy8CxJ7aIsnbRv9e-dp7DFoU7Hr_g/exec"
            url: "https://surensiddhi.github.io/mos-dashboard/",
           clip : -5
            // no clip set -> uses DEFAULT_CLIP
        },
        {
            title: "Fund Position",
            description: "Monitor Fund Position, and track the sources of funds and their utilization.",
            url: "https://script.google.com/macros/s/AKfycbxPfl9E9__Cd6GKif4LZX41lZbHV5xqqxBD9NoQKlCHMDHh4rxBxI4-YT8ZhUhlfH_a2A/exec",
            clip: -5   // NEGATIVE: pushes the app DOWN so its own title shows below your bar
        },      
        {
            title: "Task Tracking",
            description: "Monitor project milestones, assign deliverables, and track team progress across ongoing operations.",
            url: "https://script.google.com/macros/s/AKfycbylQWW1u4HRAks5yw9AqYzsgjg3ZgiRkReqxcLCbNENO1jNzSbH3xox-Efnp4vIiGk-/exec",
            clip: -5   // NEGATIVE: pushes the app DOWN so its own title shows below your bar
        }
        // ,{
        //     title: "Your Next App",
        //     description: "Describe what this app does.",
        //     url: "https://script.google.com/macros/s/YOUR_NEXT_URL/exec",
        //     clip: 48   // positive = pull up to hide banner; negative = push down to reveal title
        // }
    ];

    /* ------------------------------------------------------------
       Grab the page elements.
       ------------------------------------------------------------ */
    const cardGrid          = document.getElementById('cardGrid');
    const portalContent     = document.getElementById('portal-content');
    const embeddedContainer = document.getElementById('embedded-container');
    const appViewport       = document.getElementById('app-viewport');
    const runtimeTitle      = document.getElementById('runtime-title');
    const runtimeDesc       = document.getElementById('runtime-desc');
    const closeBtn          = document.getElementById('close-embedded-btn');
    const searchInput       = document.getElementById('appSearch');

    /* ------------------------------------------------------------
       Build the cards from the app list (runs once on load).
       ------------------------------------------------------------ */
    function buildCards() {
        apps.forEach(app => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <div class="card-body">
                    <h2 class="card-title">${app.title}</h2>
                    <p class="card-text">${app.description}</p>
                </div>
                <div class="card-footer">
                    <button class="btn btn-launch">Launch App</button>
                </div>
            `;
            card.querySelector('.btn-launch')
                .addEventListener('click', () => openApp(app));
            cardGrid.appendChild(card);
        });
    }

    /* ------------------------------------------------------------
       Open an app inside the embedded view. One shared function.
       ------------------------------------------------------------ */
    function openApp(app) {
        // Guard: stop on a leftover placeholder URL.
        if (!app.url || app.url.includes('YOUR_')) {
            alert("This app's URL is not set yet. Open portal.js and replace the placeholder /exec link in the apps list.");
            return;
        }

        // Title bar text.
        runtimeTitle.textContent = app.title;
        runtimeDesc.textContent  = app.description;

        // Apply this app's clip (its own value, or the default).
        // Uses a precise check so that 0 and NEGATIVE values are
        // respected (a plain `|| DEFAULT_CLIP` would wrongly treat
        // 0 as "unset"). portal.css reads --app-clip to shift the
        // iframe up (positive) or down (negative).
        const clip = (typeof app.clip === 'number') ? app.clip : DEFAULT_CLIP;
        embeddedContainer.style.setProperty('--app-clip', clip + 'px');

        // Load the app and swap views.
        appViewport.src = app.url;
        portalContent.classList.add('is-hidden');
        embeddedContainer.classList.remove('is-hidden');
    }

    /* ------------------------------------------------------------
       Close the app and return to the portal.
       ------------------------------------------------------------ */
    closeBtn.addEventListener('click', () => {
        appViewport.src = "";   // stop the app running in the background
        embeddedContainer.classList.add('is-hidden');
        portalContent.classList.remove('is-hidden');
    });

    /* ------------------------------------------------------------
       Live search: filter cards as the user types.
       ------------------------------------------------------------ */
    searchInput.addEventListener('input', () => {
        const term = searchInput.value.toLowerCase().trim();
        document.querySelectorAll('.card').forEach(card => {
            const title = card.querySelector('.card-title').textContent.toLowerCase();
            const text  = card.querySelector('.card-text').textContent.toLowerCase();
            const match = term === "" || title.includes(term) || text.includes(term);
            card.classList.toggle('is-hidden', !match);
        });
    });

    /* ------------------------------------------------------------
       Start.
       ------------------------------------------------------------ */
    buildCards();
});

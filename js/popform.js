(function () {
  "use strict";

  /* ======================== CONFIG — YAHAN EDIT KARO ==================== */
  const CONFIG = {
    LOGO_URL: "https://ericcline.runitremote.com/remote-logo-.png", 
    LOGO_ALT: "Run It Remote",
    HEADING: 'Ready to Fill <span class="pf-accent">Your Calendar?</span>',
    SUBTEXT: "Enter your details and claim your free strategy call.",
    DELAY_MS: 2000,          
    SHOW_ONCE_PER_SESSION: false,
    SCRIPT_URL:
      "https://script.google.com/macros/s/AKfycbzXcpyVH-vnIJadoKKFThgxlw8ayeM7ah1-aADYllextpkQg4E_wjr_ScDS2Yx7SN0Xkw/exec",
  };
  /* ======================================================================= */

  const SESSION_KEY = "pf_popup_shown";

  if (
    CONFIG.SHOW_ONCE_PER_SESSION &&
    sessionStorage.getItem(SESSION_KEY) === "1"
  ) {
    return; // is session me pehle hi dikha/close/submit ho chuka hai
  }

  /* ---------------------------- STYLES ---------------------------------- */
  const style = document.createElement("style");
  style.id = "pf-styles";
  style.textContent = `
    #pf-overlay {
      --pf-accent: #00A3B3;
      --pf-accent-light: rgb(0, 229, 249);
      --pf-dark: #0A0A0A;
      --pf-bg: #121212;
      --pf-card-border: rgba(255, 255, 255, 0.08);
      --pf-input-bg: rgba(0, 163, 179, 0.1);
      --pf-text: #f5f5f7;
      --pf-text-dim: #9a9aa8;
      --pf-border: rgba(255, 255, 255, 0.08);
      --pf-radius: 20px;

      position: fixed;
      inset: 0;
      z-index: 99999;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      background: rgba(10, 10, 10, 0);
      backdrop-filter: blur(0px);
      opacity: 0;
      visibility: hidden;
      pointer-events: none;
      transition: opacity 0.45s ease, background 0.45s ease, backdrop-filter 0.45s ease;
      font-family: 'Inter', Arial, sans-serif;
    }
    #pf-overlay.pf-active {
      opacity: 1;
      visibility: visible;
      pointer-events: auto;
      background: rgba(10, 10, 10, 0.65);
      backdrop-filter: blur(6px);
    }

    #pf-modal {
      background: linear-gradient(160deg, rgba(0,163,179,0.12), rgba(10,10,10,0.9)), var(--pf-bg);
      border: 1px solid var(--pf-card-border);
      border-radius: var(--pf-radius);
      width: 100%;
      max-width: 420px;
      max-height: 90vh;
      overflow-y: auto;
      padding: 2.25rem 2rem 2rem;
      position: relative;
      box-shadow: 0 30px 80px rgba(0, 0, 0, 0.5);
      text-align: center;
      transform: scale(0.9) translateY(10px);
      opacity: 0;
      transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.45s ease;
    }
    #pf-overlay.pf-active #pf-modal {
      transform: scale(1) translateY(0);
      opacity: 1;
    }

    #pf-close {
      position: absolute;
      top: 14px;
      right: 16px;
      width: 32px;
      height: 32px;
      border: 1px solid var(--pf-card-border);
      background: rgba(255, 255, 255, 0.05);
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.2s ease;
    }
    #pf-close:hover { background: rgba(0, 229, 249, 0.1); }
    #pf-close svg { width: 16px; height: 16px; stroke: var(--pf-text); }

    #pf-modal img.pf-logo {
      max-width: 150px;
      max-height: 70px;
      object-fit: contain;
      margin: 0 auto 1.25rem;
      display: block;
    }

    #pf-modal h3 {
      font-size: 24px;
      font-weight: 800;
      color: var(--pf-text);
      line-height: 1.25;
      margin: 0 0 0.5rem;
    }
    #pf-modal h3 .pf-accent { color: var(--pf-accent); }

    #pf-modal p.pf-subtext {
      color: var(--pf-text-dim);
      font-size: 14px;
      margin: 0 0 1.5rem;
    }

    #pf-form { display: flex; flex-direction: column; gap: 0.85rem; text-align: left; }

    .pf-field { position: relative; width: 100%; }
    .pf-field input,
    .pf-field select {
      width: 100%;
      padding: 13px 16px;
      background: var(--pf-input-bg);
      border: 1px solid var(--pf-border);
      border-radius: 12px;
      color: var(--pf-text);
      font-size: 14px;
      font-family: inherit;
      outline: none;
      appearance: none;
      box-sizing: border-box;
      transition: border-color 0.2s ease, background 0.2s ease;
    }
    .pf-field select { cursor: pointer; }
    .pf-field select option { background: #0A0A0A; color: var(--pf-text); }
    .pf-field input::placeholder { color: var(--pf-text-dim); }
    .pf-field input:focus,
    .pf-field select:focus {
      border-color: var(--pf-accent-light);
      background: rgba(0, 229, 249, 0.06);
    }
    .pf-field.pf-invalid input,
    .pf-field.pf-invalid select { border-color: #e0453c; }

    .pf-error {
      display: block;
      color: #e0453c;
      font-size: 11px;
      margin: 3px 2px 0;
      min-height: 13px;
    }

    #pf-submit {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      background: linear-gradient(90deg, var(--pf-accent) 0%, var(--pf-accent-light) 100%);
      color: #fff;
      font-weight: 700;
      font-size: 15px;
      padding: 14px 20px;
      border-radius: 12px;
      border: none;
      cursor: pointer;
      margin-top: 0.4rem;
      transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease;
      box-shadow: 0 10px 24px rgba(0, 194, 212, 0.3);
    }
    #pf-submit:hover:not(:disabled) { transform: translateY(-2px); }
    #pf-submit:disabled { opacity: 0.65; cursor: not-allowed; transform: none; }

    #pf-success {
      display: none;
      flex-direction: column;
      align-items: center;
      padding-top: 0.5rem;
    }
    #pf-success.pf-show { display: flex; }
    #pf-success .pf-check {
      width: 60px; height: 60px; border-radius: 50%;
      background: linear-gradient(135deg, var(--pf-accent), var(--pf-accent-light));
      display: flex; align-items: center; justify-content: center;
      margin-bottom: 1rem;
    }
    #pf-success .pf-check svg { width: 28px; height: 28px; stroke: #fff; }
    #pf-success h3 { margin-bottom: 0.5rem; color: var(--pf-text); }
    #pf-success p { color: var(--pf-text-dim); font-size: 14px; margin-bottom: 1.25rem; }
    #pf-success button {
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid var(--pf-card-border);
      color: var(--pf-text);
      padding: 12px 24px;
      border-radius: 12px;
      font-weight: 600;
      font-size: 14px;
      cursor: pointer;
      width: 100%;
      transition: background 0.2s ease;
    }
    #pf-success button:hover { background: rgba(0, 229, 249, 0.1); }

    @media (max-width: 480px) {
      #pf-modal { padding: 1.75rem 1.25rem 1.5rem; border-radius: 16px; }
    }

    @media (prefers-reduced-motion: reduce) {
      #pf-overlay, #pf-modal { transition: none !important; }
    }
  `;
  document.head.appendChild(style);

  /* ---------------------------- MARKUP ----------------------------------- */
  const overlay = document.createElement("div");
  overlay.id = "pf-overlay";
  overlay.innerHTML = `
    <div id="pf-modal" role="dialog" aria-modal="true" aria-labelledby="pf-heading">
      <button id="pf-close" type="button" aria-label="Close">
        <svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>

      <div id="pf-form-wrap">
        <img class="pf-logo" src="${CONFIG.LOGO_URL}" alt="${CONFIG.LOGO_ALT}">
        <h3 id="pf-heading">${CONFIG.HEADING}</h3>
        <p class="pf-subtext">${CONFIG.SUBTEXT}</p>

        <form id="pf-form" novalidate>
          <div class="pf-field">
            <input type="text" id="pf-name" placeholder="Full Name" autocomplete="off">
            <span class="pf-error" id="pf-err-name"></span>
          </div>
          <div class="pf-field">
            <input type="tel" id="pf-phone" placeholder="Phone Number" autocomplete="off">
            <span class="pf-error" id="pf-err-phone"></span>
          </div>
          <div class="pf-field">
            <input type="email" id="pf-email" placeholder="Email Address" autocomplete="off">
            <span class="pf-error" id="pf-err-email"></span>
          </div>
          <div class="pf-field">
            <input type="text" id="pf-company" placeholder="Company Name" autocomplete="off">
            <span class="pf-error" id="pf-err-company"></span>
          </div>
          <div class="pf-field">
            <select id="pf-callers">
              <option value="" disabled selected>How many cold callers do you need?</option>
              <option value="1">1 Cold Caller</option>
              <option value="2-3">2-3 Cold Callers</option>
              <option value="4-5">4-5 Cold Callers</option>
              <option value="6+">6+ Cold Callers</option>
            </select>
            <span class="pf-error" id="pf-err-callers"></span>
          </div>
          <div class="pf-field">
            <select id="pf-timeline">
              <option value="" disabled selected>How soon are you looking to start? (Optional)</option>
              <option value="Immediately">Immediately</option>
              <option value="1-2 weeks">1-2 Weeks</option>
              <option value="1 month">Within a Month</option>
              <option value="Just exploring">Just Exploring</option>
            </select>
          </div>

          <button type="submit" id="pf-submit">
            <span id="pf-submit-text">Claim My Offer</span>
          </button>
        </form>
      </div>

      <div id="pf-success">
        <div class="pf-check">
          <svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <h3>Thank You!</h3>
        <p>Your request has been submitted successfully. Our team will contact you shortly.</p>
        <button type="button" id="pf-success-close">Close</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  /* ---------------------------- LOGIC ------------------------------------ */
  const modal = document.getElementById("pf-modal");
  const closeBtn = document.getElementById("pf-close");
  const successCloseBtn = document.getElementById("pf-success-close");
  const formWrap = document.getElementById("pf-form-wrap");
  const successBox = document.getElementById("pf-success");
  const form = document.getElementById("pf-form");
  const submitBtn = document.getElementById("pf-submit");
  const submitText = document.getElementById("pf-submit-text");

  function markSeen() {
    if (CONFIG.SHOW_ONCE_PER_SESSION) {
      sessionStorage.setItem(SESSION_KEY, "1");
    }
  }

  function openPopup() {
    overlay.classList.add("pf-active");
  }

  function closePopup() {
    overlay.classList.remove("pf-active");
    markSeen();
  }

  function setError(fieldId, errorId, msg) {
    document.getElementById(fieldId).closest(".pf-field").classList.add("pf-invalid");
    document.getElementById(errorId).textContent = msg;
  }
  function clearError(fieldId, errorId) {
    document.getElementById(fieldId).closest(".pf-field").classList.remove("pf-invalid");
    document.getElementById(errorId).textContent = "";
  }

  function validate() {
    let ok = true;
    const name = document.getElementById("pf-name").value.trim();
    const phone = document.getElementById("pf-phone").value.trim();
    const email = document.getElementById("pf-email").value.trim();
    const company = document.getElementById("pf-company").value.trim();
    const callers = document.getElementById("pf-callers").value;

    if (name.length < 2) { setError("pf-name", "pf-err-name", "Please enter your full name"); ok = false; }
    else clearError("pf-name", "pf-err-name");

    const phoneRegex = /^[0-9+\-\s()]{7,20}$/;
    if (!phoneRegex.test(phone)) { setError("pf-phone", "pf-err-phone", "Please enter a valid phone number"); ok = false; }
    else clearError("pf-phone", "pf-err-phone");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) { setError("pf-email", "pf-err-email", "Please enter a valid email address"); ok = false; }
    else clearError("pf-email", "pf-err-email");

    if (company.length < 2) { setError("pf-company", "pf-err-company", "Please enter your company name"); ok = false; }
    else clearError("pf-company", "pf-err-company");

    if (!callers) { setError("pf-callers", "pf-err-callers", "Please select an option"); ok = false; }
    else clearError("pf-callers", "pf-err-callers");

    return ok;
  }

  ["pf-name", "pf-phone", "pf-email", "pf-company", "pf-callers"].forEach((id) => {
    document.getElementById(id).addEventListener("input", () => {
      document.getElementById(id).closest(".pf-field").classList.remove("pf-invalid");
    });
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!validate()) return;

    const data = {
      name: document.getElementById("pf-name").value.trim(),
      phone: document.getElementById("pf-phone").value.trim(),
      email: document.getElementById("pf-email").value.trim(),
      company: document.getElementById("pf-company").value.trim(),
      callers: document.getElementById("pf-callers").value,
      timeline: document.getElementById("pf-timeline").value || "Not specified",
      source: "popup",
      page: window.location.href,
      date: new Date().toLocaleString(),
    };

    submitBtn.disabled = true;
    submitText.textContent = "Submitting...";

    fetch(CONFIG.SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then(showSuccess)
      .catch(showSuccess)
      .finally(() => {
        submitBtn.disabled = false;
        submitText.textContent = "Claim My Offer";
      });
  });

  function showSuccess() {
    form.reset();
    formWrap.style.display = "none";
    successBox.classList.add("pf-show");
    markSeen();
  }

  closeBtn.addEventListener("click", closePopup);
  successCloseBtn.addEventListener("click", closePopup);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closePopup();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlay.classList.contains("pf-active")) closePopup();
  });

  /* ------------------------- SHOW AFTER DELAY ---------------------------- */
  setTimeout(openPopup, CONFIG.DELAY_MS);
})();
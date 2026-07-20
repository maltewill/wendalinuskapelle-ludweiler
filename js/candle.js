(function () {
  var ENDPOINT_URL = "https://script.google.com/macros/s/AKfycbwI8zU8jSzD-J3UMriu-xj_h5uFkhZd0GxEWbiY8MMNBny3n6Yq8ZqqvkYX7Wwvaa-M/exec";
  var THROTTLE_KEY = "kerze_last_submit";
  var THROTTLE_MS = 60 * 60 * 1000;

  var form = document.getElementById("candle-form");
  var list = document.getElementById("candle-list");
  var status = document.getElementById("candle-status");

  if (!form || !list) return;

  function escapeHtml(str) {
    var div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  function formatDate(iso) {
    try {
      var d = new Date(iso);
      if (isNaN(d.getTime())) return "";
      return d.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" });
    } catch (e) {
      return "";
    }
  }

  function renderEntries(entries) {
    if (!entries || !entries.length) {
      list.innerHTML = '<li class="candle-empty">Noch keine Kerzen entzündet. Seien Sie die erste Person, die ein Licht hinterlässt.</li>';
      return;
    }
    list.innerHTML = entries.map(function (entry) {
      var meta = escapeHtml(entry.name || "Anonym") + (entry.zeit ? " · " + formatDate(entry.zeit) : "");
      return (
        '<li class="candle-item">' +
        '<svg class="candle-flame" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
        '<path d="M12 2c2 3-2 4-2 7a2 2 0 1 0 4 0c0-1-1-2-1-3 2 1 3 3 3 5a4 4 0 1 1-8 0c0-4 3-5 4-9z"/>' +
        '</svg>' +
        '<span class="candle-text">' +
        '<span class="candle-message">„' + escapeHtml(entry.nachricht) + '“</span>' +
        '<span class="candle-meta">' + meta + '</span>' +
        '</span>' +
        '</li>'
      );
    }).join("");
  }

  function loadEntries() {
    if (ENDPOINT_URL.indexOf("PASTE_") === 0) {
      list.innerHTML = '<li class="candle-empty">Das Kerzen-Formular wird bald freigeschaltet.</li>';
      return;
    }
    fetch(ENDPOINT_URL)
      .then(function (res) { return res.json(); })
      .then(renderEntries)
      .catch(function () {
        list.innerHTML = '<li class="candle-empty">Kerzen konnten gerade nicht geladen werden.</li>';
      });
  }

  form.addEventListener("submit", function (evt) {
    evt.preventDefault();

    if (ENDPOINT_URL.indexOf("PASTE_") === 0) {
      status.textContent = "Das Kerzen-Formular ist noch nicht eingerichtet.";
      return;
    }

    var last = Number(localStorage.getItem(THROTTLE_KEY) || 0);
    if (Date.now() - last < THROTTLE_MS) {
      status.textContent = "Bitte kurz warten, bevor Sie eine weitere Kerze entzünden.";
      return;
    }

    var formData = new FormData(form);
    var payload = {
      name: formData.get("name") || "",
      message: formData.get("message") || "",
      website: formData.get("website") || ""
    };

    if (!payload.message.trim()) {
      status.textContent = "Bitte geben Sie einen Gedanken oder ein Gebet ein.";
      return;
    }

    var submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    status.textContent = "Kerze wird entzündet …";

    fetch(ENDPOINT_URL, {
      method: "POST",
      body: JSON.stringify(payload)
    })
      .then(function (res) { return res.json(); })
      .then(function (result) {
        if (result.ok) {
          localStorage.setItem(THROTTLE_KEY, String(Date.now()));
          status.textContent = "Danke, Ihre Kerze brennt jetzt.";
          form.reset();
          loadEntries();
        } else {
          status.textContent = "Es gab ein Problem beim Speichern. Bitte später erneut versuchen.";
        }
      })
      .catch(function () {
        status.textContent = "Es gab ein Problem beim Speichern. Bitte später erneut versuchen.";
      })
      .finally(function () {
        submitBtn.disabled = false;
      });
  });

  loadEntries();
})();

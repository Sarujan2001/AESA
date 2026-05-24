(() => {
  const owner = "Sarujan2001";
  const repo = "AESA";
  const branch = "main";
  const files = [
    {
      key: "site",
      title: "Site Settings",
      description: "Club details, social links, and navigation.",
      path: "my-app/src/data/siteSettings.json",
      schema: [
        { path: "club.name", label: "Full Name", type: "text" },
        { path: "club.shortName", label: "Short Name", type: "text" },
        { path: "club.email", label: "Email", type: "text" },
        { path: "club.location", label: "Location", type: "text" },
        { path: "club.socials.facebook", label: "Facebook", type: "text" },
        { path: "club.socials.instagram", label: "Instagram", type: "text" },
        { path: "club.socials.linkedin", label: "LinkedIn", type: "text" },
        { path: "club.socials.rubric", label: "Rubric", type: "text" },
        { path: "club.socials.rubricEvents", label: "Rubric Events", type: "text" },
        { path: "club.socials.linktree", label: "Linktree", type: "text" },
        {
          path: "navItems",
          label: "Navigation",
          type: "list",
          item: [
            { key: "label", label: "Label", type: "text" },
            { key: "target", label: "Target", type: "text" },
          ],
        },
      ],
    },
    {
      key: "home",
      title: "Home Page",
      description: "Homepage focus labels and statistics.",
      path: "my-app/src/data/home.json",
      schema: [
        { path: "focusAreas", label: "Focus Areas", type: "stringList" },
        {
          path: "stats",
          label: "Stats",
          type: "list",
          item: [
            { key: "value", label: "Value", type: "text" },
            { key: "label", label: "Label", type: "text" },
          ],
        },
      ],
    },
    {
      key: "activities",
      title: "Activities",
      description: "Cards shown on the Activities page.",
      path: "my-app/src/data/activities.json",
      schema: [
        {
          path: "activities",
          label: "Activities",
          type: "list",
          item: [
            { key: "title", label: "Title", type: "text" },
            { key: "tag", label: "Tag", type: "text" },
            { key: "text", label: "Description", type: "textarea" },
          ],
        },
      ],
    },
    {
      key: "calendar",
      title: "Calendar",
      description: "Upcoming event rows. ISO Date should use YYYY-MM-DD or stay blank.",
      path: "my-app/src/data/calendar.json",
      schema: [
        {
          path: "calendar",
          label: "Events",
          type: "list",
          item: [
            { key: "date", label: "Display Date", type: "text" },
            { key: "title", label: "Title", type: "text" },
            { key: "location", label: "Location", type: "text" },
            { key: "time", label: "Time", type: "text" },
            { key: "price", label: "Price", type: "text" },
            { key: "isoDate", label: "ISO Date", type: "text" },
          ],
        },
      ],
    },
    {
      key: "team",
      title: "Team",
      description: "Team member names, roles, pronouns, and descriptions. Photos are handled in Image Crop Uploads.",
      path: "my-app/src/data/team.json",
      schema: [
        {
          path: "executiveTeam",
          label: "Executive Team",
          type: "list",
          item: teamFields(),
        },
        {
          path: "generalCommittee",
          label: "General Committee",
          type: "list",
          item: teamFields(),
        },
      ],
    },
    {
      key: "past",
      title: "Past Events",
      description: "Past event text. Event images are handled in Image Crop Uploads.",
      path: "my-app/src/data/pastEvents.json",
      schema: [
        {
          path: "pastEvents",
          label: "Past Events",
          type: "list",
          item: [
            { key: "title", label: "Title", type: "text" },
            { key: "year", label: "Year", type: "text" },
            { key: "text", label: "Description", type: "textarea" },
            { key: "image", label: "Image Path", type: "hidden" },
          ],
        },
      ],
    },
    {
      key: "sponsors",
      title: "Sponsors",
      description: "Sponsor names and websites. Logos are handled in Image Crop Uploads.",
      path: "my-app/src/data/sponsors.json",
      schema: [
        {
          path: "sponsors",
          label: "Sponsors",
          type: "list",
          item: [
            { key: "mark", label: "Fallback Initials", type: "text" },
            { key: "name", label: "Name", type: "text" },
            { key: "href", label: "Website", type: "text" },
            { key: "logo", label: "Logo Path", type: "hidden" },
          ],
        },
      ],
    },
    {
      key: "join",
      title: "Join Page",
      description: "Benefits shown on the join page.",
      path: "my-app/src/data/join.json",
      schema: [{ path: "benefits", label: "Benefits", type: "stringList" }],
    },
  ];

  const app = document.querySelector("[data-admin-app]");
  if (!app) return;

  const tokenInput = document.querySelector("#tokenInput");
  const loadButton = document.querySelector("#loadButton");
  const rememberTokenButton = document.querySelector("#rememberTokenButton");
  const clearTokenButton = document.querySelector("#clearTokenButton");
  const fileNav = document.querySelector("#fileNav");
  const editorTitle = document.querySelector("#editorTitle");
  const editorDescription = document.querySelector("#editorDescription");
  const editorFields = document.querySelector("#editorFields");
  const saveContentButton = document.querySelector("#saveContentButton");
  const adminStatus = document.querySelector("#adminStatus");
  const tabButtons = [...document.querySelectorAll("[data-panel-tab]")];
  const panels = [...document.querySelectorAll("[data-panel]")];

  const state = {
    currentKey: files[0].key,
    entries: {},
    shas: {},
  };

  tokenInput.value = sessionStorage.getItem("aesaGithubToken") || localStorage.getItem("aesaGithubToken") || "";

  window.AESAAdmin = {
    getToken: () => tokenInput.value.trim(),
  };

  function teamFields() {
    return [
      { key: "name", label: "Name", type: "text" },
      { key: "pronouns", label: "Pronouns", type: "text" },
      { key: "role", label: "Role", type: "text" },
      { key: "text", label: "Description / Fun Fact", type: "textarea" },
      { key: "photo", label: "Photo Path", type: "hidden" },
      { key: "photoFit", label: "Photo Fit", type: "hidden" },
      { key: "photoX", label: "Crop X", type: "hidden" },
      { key: "photoY", label: "Crop Y", type: "hidden" },
      { key: "photoZoom", label: "Photo Zoom", type: "hidden" },
    ];
  }

  function setStatus(message) {
    adminStatus.textContent = message;
  }

  function toBase64(text) {
    return btoa(unescape(encodeURIComponent(text)));
  }

  function fromBase64(text) {
    return decodeURIComponent(escape(atob(text.replace(/\n/g, ""))));
  }

  async function github(path, options = {}) {
    const token = tokenInput.value.trim();

    if (!token) {
      throw new Error("Paste your GitHub token first.");
    }

    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
      ...options,
      headers: {
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `GitHub request failed: ${response.status}`);
    }

    return response.json();
  }

  function getByPath(source, path) {
    return path.split(".").reduce((value, key) => value?.[key], source);
  }

  function setByPath(source, path, value) {
    const keys = path.split(".");
    let target = source;

    keys.slice(0, -1).forEach((key) => {
      target[key] ||= {};
      target = target[key];
    });

    target[keys.at(-1)] = value;
  }

  function makeId(...parts) {
    return parts.join("-").replace(/[^a-z0-9]+/gi, "-").toLowerCase();
  }

  function currentFile() {
    return files.find((file) => file.key === state.currentKey);
  }

  function renderFileNav() {
    fileNav.innerHTML = files
      .map((file) => `<button type="button" class="${file.key === state.currentKey ? "active" : ""}" data-file-key="${file.key}">${file.title}</button>`)
      .join("");
  }

  function renderEditor() {
    const file = currentFile();
    const data = state.entries[file.key];

    renderFileNav();
    editorTitle.textContent = file.title;
    editorDescription.textContent = file.description;
    editorFields.innerHTML = "";
    saveContentButton.disabled = !data;

    if (!data) {
      editorFields.innerHTML = '<p class="notice">Load latest content before editing this section.</p>';
      return;
    }

    file.schema.forEach((field) => {
      editorFields.appendChild(renderField(data, field));
    });
  }

  function renderField(data, field) {
    const wrapper = document.createElement("div");
    wrapper.className = field.type === "hidden" ? "hidden-field" : "field-group";

    if (field.type === "stringList") {
      const list = getByPath(data, field.path) || [];
      wrapper.innerHTML = `<h3>${field.label}</h3>`;
      wrapper.appendChild(renderStringList(data, field.path, list));
      return wrapper;
    }

    if (field.type === "list") {
      const list = getByPath(data, field.path) || [];
      wrapper.innerHTML = `<h3>${field.label}</h3>`;
      wrapper.appendChild(renderObjectList(data, field.path, list, field.item));
      return wrapper;
    }

    const id = makeId(field.path);
    const value = getByPath(data, field.path) ?? "";
    wrapper.innerHTML = controlHtml(id, field.label, value, field.type);
    wrapper.querySelector("[data-control]")?.addEventListener("input", (event) => {
      setByPath(data, field.path, event.target.value);
    });
    return wrapper;
  }

  function controlHtml(id, label, value, type) {
    const escaped = escapeHtml(String(value));

    if (type === "textarea") {
      return `<label for="${id}">${label}<textarea id="${id}" data-control>${escaped}</textarea></label>`;
    }

    if (type === "hidden") {
      return `<input id="${id}" data-control type="hidden" value="${escaped}" />`;
    }

    return `<label for="${id}">${label}<input id="${id}" data-control type="text" value="${escaped}" /></label>`;
  }

  function renderStringList(data, path, list) {
    const container = document.createElement("div");
    container.className = "list-editor";

    function redraw() {
      container.innerHTML = "";
      list.forEach((value, index) => {
        const item = document.createElement("div");
        item.className = "list-item";
        item.innerHTML = `
          <div class="list-item-head">
            <strong>Item ${index + 1}</strong>
            <button class="secondary" type="button" data-remove="${index}">Remove</button>
          </div>
          <label>Text<input type="text" value="${escapeHtml(String(value))}" data-index="${index}" /></label>
        `;
        container.appendChild(item);
      });

      const add = document.createElement("button");
      add.className = "secondary";
      add.type = "button";
      add.textContent = `Add ${path.split(".").at(-1)}`;
      add.addEventListener("click", () => {
        list.push("");
        setByPath(data, path, list);
        redraw();
      });
      container.appendChild(add);
    }

    container.addEventListener("input", (event) => {
      if (!event.target.matches("[data-index]")) return;
      list[Number(event.target.dataset.index)] = event.target.value;
      setByPath(data, path, list);
    });

    container.addEventListener("click", (event) => {
      const button = event.target.closest("[data-remove]");
      if (!button) return;
      list.splice(Number(button.dataset.remove), 1);
      setByPath(data, path, list);
      redraw();
    });

    redraw();
    return container;
  }

  function renderObjectList(data, path, list, itemFields) {
    const container = document.createElement("div");
    container.className = "list-editor";

    function emptyItem() {
      return itemFields.reduce((item, field) => {
        item[field.key] = field.type === "hidden" && field.key === "photoFit" ? "cover" : "";
        if (field.key === "photoX" || field.key === "photoY") item[field.key] = 50;
        if (field.key === "photoZoom") item[field.key] = "1";
        return item;
      }, {});
    }

    function redraw() {
      container.innerHTML = "";
      list.forEach((row, index) => {
        const item = document.createElement("div");
        item.className = "list-item";
        const title = row.name || row.title || row.label || `Item ${index + 1}`;
        item.innerHTML = `
          <div class="list-item-head">
            <strong>${escapeHtml(title)}</strong>
            <div class="row-actions">
              <button class="secondary" type="button" data-up="${index}">Up</button>
              <button class="secondary" type="button" data-down="${index}">Down</button>
              <button class="secondary" type="button" data-remove="${index}">Remove</button>
            </div>
          </div>
          <div class="field-row">
            ${itemFields.map((field) => objectControlHtml(row, field, index)).join("")}
          </div>
        `;
        container.appendChild(item);
      });

      const add = document.createElement("button");
      add.className = "secondary";
      add.type = "button";
      add.textContent = `Add ${path.split(".").at(-1)}`;
      add.addEventListener("click", () => {
        list.push(emptyItem());
        setByPath(data, path, list);
        redraw();
      });
      container.appendChild(add);
    }

    container.addEventListener("input", (event) => {
      const control = event.target.closest("[data-row][data-key]");
      if (!control) return;
      list[Number(control.dataset.row)][control.dataset.key] = control.value;
      setByPath(data, path, list);
    });

    container.addEventListener("click", (event) => {
      const button = event.target.closest("button");
      if (!button) return;
      const remove = button.dataset.remove;
      const up = button.dataset.up;
      const down = button.dataset.down;

      if (remove !== undefined) {
        list.splice(Number(remove), 1);
      } else if (up !== undefined && Number(up) > 0) {
        const index = Number(up);
        [list[index - 1], list[index]] = [list[index], list[index - 1]];
      } else if (down !== undefined && Number(down) < list.length - 1) {
        const index = Number(down);
        [list[index + 1], list[index]] = [list[index], list[index + 1]];
      } else {
        return;
      }

      setByPath(data, path, list);
      redraw();
    });

    redraw();
    return container;
  }

  function objectControlHtml(row, field, index) {
    const value = escapeHtml(String(row[field.key] ?? ""));
    const hiddenClass = field.type === "hidden" ? "hidden-field" : "";

    if (field.type === "textarea") {
      return `<label class="${hiddenClass}">${field.label}<textarea data-row="${index}" data-key="${field.key}">${value}</textarea></label>`;
    }

    return `<label class="${hiddenClass}">${field.label}<input type="${field.type === "hidden" ? "hidden" : "text"}" value="${value}" data-row="${index}" data-key="${field.key}" /></label>`;
  }

  function escapeHtml(value) {
    return value.replace(/[&<>"']/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    }[char]));
  }

  async function loadAllContent() {
    setStatus("Loading latest content from GitHub...");
    loadButton.disabled = true;

    for (const file of files) {
      const result = await github(`${file.path}?ref=${branch}`);
      state.entries[file.key] = JSON.parse(fromBase64(result.content));
      state.shas[file.key] = result.sha;
    }

    sessionStorage.setItem("aesaGithubToken", tokenInput.value.trim());
    loadButton.disabled = false;
    renderEditor();
    setStatus("Latest content loaded. Edit a section, then save.");
  }

  async function saveCurrentContent() {
    const file = currentFile();
    const data = state.entries[file.key];

    if (!data) {
      setStatus("Load content before saving.");
      return;
    }

    saveContentButton.disabled = true;
    setStatus(`Saving ${file.title}...`);

    const latest = await github(`${file.path}?ref=${branch}`);

    await github(file.path, {
      method: "PUT",
      body: JSON.stringify({
        message: `Update ${file.title}`,
        content: toBase64(`${JSON.stringify(data, null, 2)}\n`),
        sha: latest.sha,
        branch,
      }),
    });

    state.shas[file.key] = latest.sha;
    saveContentButton.disabled = false;
    setStatus(`${file.title} saved. GitHub Pages will deploy the change.`);
  }

  fileNav.addEventListener("click", (event) => {
    const button = event.target.closest("[data-file-key]");
    if (!button) return;
    state.currentKey = button.dataset.fileKey;
    renderEditor();
  });

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      tabButtons.forEach((tab) => tab.classList.toggle("active", tab === button));
      panels.forEach((panel) => {
        panel.hidden = panel.dataset.panel !== button.dataset.panelTab;
      });
    });
  });

  loadButton.addEventListener("click", () => loadAllContent().catch((error) => {
    loadButton.disabled = false;
    setStatus(error.message);
  }));

  saveContentButton.addEventListener("click", () => saveCurrentContent().catch((error) => {
    saveContentButton.disabled = false;
    setStatus(error.message);
  }));

  rememberTokenButton.addEventListener("click", () => {
    const token = tokenInput.value.trim();
    sessionStorage.setItem("aesaGithubToken", token);
    localStorage.setItem("aesaGithubToken", token);
    setStatus("Token remembered on this browser.");
  });

  clearTokenButton.addEventListener("click", () => {
    tokenInput.value = "";
    sessionStorage.removeItem("aesaGithubToken");
    localStorage.removeItem("aesaGithubToken");
    setStatus("Token cleared from this browser.");
  });

  renderFileNav();
  renderEditor();
})();

(() => {
  // Standalone admin image cropper. It lets trusted admins crop images locally in
  // the browser, then uploads the cropped result to GitHub with a session-only token.
  const owner = "rmitaesa";
  const repo = "AESA";
  const branch = "main";
  const uploadDir = "my-app/public/uploads";
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  const dataFiles = {
    team: "my-app/src/data/team.json",
    past: "my-app/src/data/pastEvents.json",
    sponsors: "my-app/src/data/sponsors.json",
  };
  const assetItems = {
    assets: [
      {
        name: "Homepage panorama banner",
        text: "Large homepage background image",
        filePath: "my-app/public/panorama.jpg",
        publicPath: "/panorama.jpg",
        extension: "jpg",
      },
    ],
  };

  const root = document.querySelector("[data-image-manager]");

  if (!root) return;

  const tokenInput = root.querySelector("#tokenInput");
  const groupInput = root.querySelector("#groupInput");
  const itemInput = root.querySelector("#itemInput");
  const fileInput = root.querySelector("#fileInput");
  const useCurrentButton = root.querySelector("#useCurrentButton");
  const aspectInput = root.querySelector("#aspectInput");
  const zoomInput = root.querySelector("#zoomInput");
  const cropWidthInput = root.querySelector("#cropWidthInput");
  const cropHeightInput = root.querySelector("#cropHeightInput");
  const saveButton = root.querySelector("#saveButton");
  const reloadButton = root.querySelector("#reloadButton");
  const statusText = root.querySelector("#statusText");
  const currentPhoto = root.querySelector("#currentPhoto");
  const currentName = root.querySelector("#currentName");
  const currentRole = root.querySelector("#currentRole");
  const croppedPreview = root.querySelector("#croppedPreview");
  const cropModal = root.querySelector("#cropModal");
  const stage = root.querySelector("#stage");
  const image = root.querySelector("#sourceImage");
  const cropBox = root.querySelector("#cropBox");
  const confirmCropButton = root.querySelector("#confirmCropButton");
  const cancelCropButton = root.querySelector("#cancelCropButton");
  const resetCropButton = root.querySelector("#resetCropButton");
  const rotateLeftButton = root.querySelector("#rotateLeftButton");
  const rotateRightButton = root.querySelector("#rotateRightButton");

  const state = {
    data: {},
    currentSourceUrl: "",
    sourceName: "",
    naturalWidth: 0,
    naturalHeight: 0,
    imageX: 0,
    imageY: 0,
    zoom: 1,
    dragging: false,
    dragStartX: 0,
    dragStartY: 0,
    startX: 0,
    startY: 0,
    croppedBase64: "",
    croppedUrl: "",
    croppedExtension: "webp",
  };

  function setStatus(message) {
    statusText.textContent = message;
  }

  function toBase64(text) {
    return btoa(unescape(encodeURIComponent(text)));
  }

  function fromBase64(text) {
    return decodeURIComponent(escape(atob(text.replace(/\n/g, ""))));
  }

  async function github(path, options = {}) {
    // Thin wrapper around the GitHub Contents API. The token stays in memory only.
    const token = tokenInput.value.trim();
    const headers = {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      ...options.headers,
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      const issue = new Error(error.message || `GitHub request failed: ${response.status}`);
      issue.status = response.status;
      throw issue;
    }

    return response.json();
  }

  function currentGroup() {
    const [type, key] = groupInput.value.split(":");
    return { type, key, path: dataFiles[type] };
  }

  function imageFieldForType(type) {
    if (type === "asset") return "publicPath";
    if (type === "sponsors") return "logo";
    if (type === "past") return "image";
    return "photo";
  }

  function labelForItem(item, type) {
    if (type === "asset") return item.name;
    if (type === "team") return `${item.name} - ${item.role}`;
    if (type === "past") return `${item.year} - ${item.title}`;
    return item.name;
  }

  function renderOption(value, label) {
    // Use textContent rather than innerHTML so CMS-edited names cannot inject HTML.
    const option = document.createElement("option");

    option.value = String(value);
    option.textContent = label || "Untitled item";
    return option;
  }

  function currentItem() {
    const { type, key } = currentGroup();
    return state.data[type]?.[key]?.[Number(itemInput.value || 0)];
  }

  function renderItems() {
    const { type, key } = currentGroup();
    const items = state.data[type]?.[key] || [];

    itemInput.replaceChildren(...items.map((item, index) => renderOption(index, labelForItem(item, type))));
    clearCrop();
    updateCurrentItem();
  }

  function updateCurrentItem() {
    const { type } = currentGroup();
    const item = currentItem();
    const field = imageFieldForType(type);

    currentName.textContent = item ? labelForItem(item, type) : "No image selected";
    currentRole.textContent = item?.text || item?.href || "";
    currentPhoto.src = item?.[field] || "";
    state.currentSourceUrl = item?.[field] || "";
    clearCrop();
  }

  async function loadImageData() {
    // Always reload JSON from GitHub before editing so the cropper starts from current data.
    setStatus("Loading latest website image data...");
    state.data.asset = assetItems;

    for (const [type, path] of Object.entries(dataFiles)) {
      const result = await github(`${path}?ref=${branch}`);
      state.data[type] = JSON.parse(fromBase64(result.content));
    }

    renderItems();
    setStatus("Ready. Choose an image and crop before saving.");
  }

  function getAspect() {
    if (aspectInput.value === "free") return null;
    const [w, h] = aspectInput.value.split("/").map(Number);
    return w / h;
  }

  function updateCropBox() {
    const rect = stage.getBoundingClientRect();
    const aspect = getAspect();
    let width = rect.width * (Number(cropWidthInput.value) / 100);
    let height = rect.height * (Number(cropHeightInput.value) / 100);

    if (aspect) {
      height = width / aspect;

      if (height > rect.height * 0.82) {
        height = rect.height * 0.82;
        width = height * aspect;
      }
    }

    cropBox.style.width = `${Math.max(120, width)}px`;
    cropBox.style.height = `${Math.max(120, height)}px`;
    cropBox.classList.toggle("is-free", !aspect);
  }

  function fitImage() {
    if (!state.naturalWidth) return;

    const rect = stage.getBoundingClientRect();
    const baseScale = Math.max(rect.width / state.naturalWidth, rect.height / state.naturalHeight);
    const displayWidth = state.naturalWidth * baseScale * state.zoom;
    const displayHeight = state.naturalHeight * baseScale * state.zoom;

    image.style.width = `${displayWidth}px`;
    image.style.height = `${displayHeight}px`;
    image.style.transform = `translate(calc(-50% + ${state.imageX}px), calc(-50% + ${state.imageY}px))`;
    updateCropBox();
  }

  function resetCrop() {
    state.imageX = 0;
    state.imageY = 0;
    state.zoom = 1;
    zoomInput.value = "1";
    cropWidthInput.value = "72";
    cropHeightInput.value = "60";
    fitImage();
  }

  function openCropModal() {
    cropModal.hidden = false;
    document.body.classList.add("crop-modal-open");
    window.setTimeout(fitImage, 30);
  }

  function closeCropModal() {
    cropModal.hidden = true;
    document.body.classList.remove("crop-modal-open");
  }

  function clearCrop() {
    state.croppedBase64 = "";
    state.croppedUrl = "";
    saveButton.disabled = true;
    croppedPreview.hidden = true;
    croppedPreview.removeAttribute("src");
  }

  function loadImageSource(src, name = "selected-image") {
    image.onload = () => {
      state.naturalWidth = image.naturalWidth;
      state.naturalHeight = image.naturalHeight;
      state.sourceName = name;
      clearCrop();
      resetCrop();
      openCropModal();
      setStatus("Crop the image, then confirm it before saving.");
    };
    image.onerror = () => setStatus("Could not load that image. Try a JPG, PNG, or WebP file.");
    image.src = src;
  }

  function loadFile(file) {
    if (!file) return;

    if (!allowedTypes.includes(file.type)) {
      fileInput.value = "";
      setStatus("Invalid file. Please upload JPG, JPEG, PNG, or WebP only.");
      return;
    }

    loadImageSource(URL.createObjectURL(file), file.name);
  }

  function loadCurrentImage() {
    if (!state.currentSourceUrl) {
      setStatus("This item has no current image yet. Choose a new image file.");
      return;
    }

    image.crossOrigin = "anonymous";
    loadImageSource(state.currentSourceUrl.startsWith("http") ? state.currentSourceUrl : `${window.location.origin}${state.currentSourceUrl}`, "current-image");
  }

  function cropCanvas() {
    // Converts the visible crop box into a canvas that can be exported and uploaded.
    const cropRect = cropBox.getBoundingClientRect();
    const imageRect = image.getBoundingClientRect();
    const scaleX = state.naturalWidth / imageRect.width;
    const scaleY = state.naturalHeight / imageRect.height;
    const sourceX = Math.max(0, (cropRect.left - imageRect.left) * scaleX);
    const sourceY = Math.max(0, (cropRect.top - imageRect.top) * scaleY);
    const sourceWidth = Math.min(state.naturalWidth - sourceX, cropRect.width * scaleX);
    const sourceHeight = Math.min(state.naturalHeight - sourceY, cropRect.height * scaleY);
    const outputWidth = Math.min(1800, Math.max(900, Math.round(sourceWidth)));
    const outputHeight = Math.round(outputWidth * (sourceHeight / sourceWidth));
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    canvas.width = outputWidth;
    canvas.height = outputHeight;
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";
    context.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, outputWidth, outputHeight);
    return canvas;
  }

  function canvasToUpload(canvas) {
    if (currentGroup().type === "asset") {
      state.croppedExtension = "jpg";
      return canvas.toDataURL("image/jpeg", 0.92);
    }

    let dataUrl = canvas.toDataURL("image/webp", 0.9);

    if (!dataUrl.startsWith("data:image/webp")) {
      dataUrl = canvas.toDataURL("image/jpeg", 0.92);
      state.croppedExtension = "jpg";
    } else {
      state.croppedExtension = "webp";
    }

    return dataUrl;
  }

  function confirmCrop() {
    const dataUrl = canvasToUpload(cropCanvas());

    state.croppedBase64 = dataUrl.split(",")[1];
    state.croppedUrl = dataUrl;
    croppedPreview.src = dataUrl;
    croppedPreview.hidden = false;
    saveButton.disabled = false;
    closeCropModal();
    setStatus("Crop confirmed. Save it to upload the cropped image.");
  }

  function rotateWorkingImage(degrees) {
    if (!state.naturalWidth) return;

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    const turnsSideways = Math.abs(degrees) % 180 === 90;

    canvas.width = turnsSideways ? state.naturalHeight : state.naturalWidth;
    canvas.height = turnsSideways ? state.naturalWidth : state.naturalHeight;
    context.translate(canvas.width / 2, canvas.height / 2);
    context.rotate((degrees * Math.PI) / 180);
    context.drawImage(image, -state.naturalWidth / 2, -state.naturalHeight / 2);
    loadImageSource(canvas.toDataURL("image/png"), state.sourceName);
  }

  function slugify(value) {
    return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "image";
  }

  async function updateImageReference({ type, key, path, itemName, imageField, publicPath }) {
    // Re-read the target JSON before saving to reduce conflicts with Pages CMS edits.
    for (let attempt = 1; attempt <= 3; attempt += 1) {
      const latest = await github(`${path}?ref=${branch}`);
      const latestData = JSON.parse(fromBase64(latest.content));
      const latestItems = latestData[key] || [];
      const latestItemIndex = latestItems.findIndex((candidate) => (candidate.name || candidate.title) === itemName);

      if (latestItemIndex === -1) {
        throw new Error(`${itemName} was not found in the latest data. Reload and try again.`);
      }

      latestData[key][latestItemIndex] = {
        ...latestItems[latestItemIndex],
        [imageField]: publicPath,
      };

      if (type === "team") {
        latestData[key][latestItemIndex].photoFit = "cover";
        latestData[key][latestItemIndex].photoX = 50;
        latestData[key][latestItemIndex].photoY = 50;
        latestData[key][latestItemIndex].photoZoom = "1";
      }

      try {
        await github(path, {
          method: "PUT",
          body: JSON.stringify({
            message: `Update image for ${itemName}`,
            content: toBase64(`${JSON.stringify(latestData, null, 2)}\n`),
            sha: latest.sha,
            branch,
          }),
        });

        return { latestData, latestItemIndex };
      } catch (error) {
        const canRetry = error.status === 409 || error.message.includes("does not match");

        if (!canRetry || attempt === 3) {
          throw error;
        }

        setStatus("Website data changed while saving. Reloading latest version and retrying...");
      }
    }

    throw new Error("Could not update website data.");
  }

  async function savePhoto() {
    // Uploads the cropped image, then updates the relevant JSON file to point at it.
    if (!state.croppedBase64) {
      setStatus("Confirm a crop before saving.");
      return;
    }

    const token = tokenInput.value.trim();
    if (!token) {
      setStatus("Paste your GitHub token first.");
      return;
    }

    const { type, key, path } = currentGroup();
    const item = currentItem();
    const itemName = item.name || item.title;
    const imageField = imageFieldForType(type);
    const fileName = `${slugify(itemName)}-${Date.now()}.${state.croppedExtension}`;
    const uploadPath = `${uploadDir}/${fileName}`;
    const publicPath = `/uploads/${fileName}`;

    saveButton.disabled = true;
    setStatus("Uploading cropped image...");

    if (type === "asset") {
      const latest = await github(`${item.filePath}?ref=${branch}`);

      await github(item.filePath, {
        method: "PUT",
        body: JSON.stringify({
          message: `Update ${item.name}`,
          content: state.croppedBase64,
          sha: latest.sha,
          branch,
        }),
      });

      currentPhoto.src = `${item.publicPath}?v=${Date.now()}`;
      clearCrop();
      setStatus("Saved. GitHub Pages will update after the deployment finishes.");
      return;
    }

    await github(uploadPath, {
      method: "PUT",
      body: JSON.stringify({
        message: `Upload cropped image for ${itemName}`,
        content: state.croppedBase64,
        branch,
      }),
    });

    setStatus("Updating website data...");
    const { latestData, latestItemIndex } = await updateImageReference({
      type,
      key,
      path,
      itemName,
      imageField,
      publicPath,
    });

    state.data[type] = latestData;
    renderItems();
    itemInput.value = String(latestItemIndex);
    currentPhoto.src = publicPath;
    clearCrop();
    setStatus("Saved. GitHub Pages will update after the deployment finishes.");
  }

  groupInput.addEventListener("change", renderItems);
  itemInput.addEventListener("change", updateCurrentItem);
  fileInput.addEventListener("change", () => loadFile(fileInput.files[0]));
  useCurrentButton.addEventListener("click", loadCurrentImage);
  aspectInput.addEventListener("change", () => {
    updateCropBox();
    fitImage();
  });
  zoomInput.addEventListener("input", () => {
    state.zoom = Number(zoomInput.value);
    fitImage();
  });
  cropWidthInput.addEventListener("input", updateCropBox);
  cropHeightInput.addEventListener("input", updateCropBox);
  confirmCropButton.addEventListener("click", confirmCrop);
  cancelCropButton.addEventListener("click", closeCropModal);
  resetCropButton.addEventListener("click", resetCrop);
  rotateLeftButton.addEventListener("click", () => rotateWorkingImage(-90));
  rotateRightButton.addEventListener("click", () => rotateWorkingImage(90));
  reloadButton.addEventListener("click", () => loadImageData().catch((error) => setStatus(error.message)));
  saveButton.addEventListener("click", () => savePhoto().catch((error) => {
    saveButton.disabled = false;
    setStatus(error.message);
  }));

  stage.addEventListener("pointerdown", (event) => {
    if (!state.naturalWidth) return;
    state.dragging = true;
    state.dragStartX = event.clientX;
    state.dragStartY = event.clientY;
    state.startX = state.imageX;
    state.startY = state.imageY;
    stage.setPointerCapture(event.pointerId);
  });

  stage.addEventListener("pointermove", (event) => {
    if (!state.dragging) return;
    state.imageX = state.startX + event.clientX - state.dragStartX;
    state.imageY = state.startY + event.clientY - state.dragStartY;
    fitImage();
  });

  stage.addEventListener("pointerup", () => {
    state.dragging = false;
  });

  window.addEventListener("resize", fitImage);
  updateCropBox();
  loadImageData().catch((error) => setStatus(error.message));
})();

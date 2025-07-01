// Render function to display each item - Highly optimized version
renderItem: (user, index, recycledElement) => {
  if (recycledElement) {
    // Use cached references (super fast)
    let cachedRefs = recycledElement._cachedRefs;

    if (!cachedRefs) {
      // Cache child element references on first recycle
      cachedRefs = {
        avatar: recycledElement.querySelector(".user-avatar"),
        name: recycledElement.querySelector(".user-name"),
        email: recycledElement.querySelector(".user-email"),
        role: recycledElement.querySelector(".user-role"),
      };
      recycledElement._cachedRefs = cachedRefs;
    }

    // Update content using cached references (fastest possible)
    const avatarText = user.avatar || user.headline?.charAt(0) || "?";
    const nameText = user.headline || "Unknown";
    const emailText = user.supportingText || "";
    const roleText = user.meta || "";

    // Only update if content actually changed (micro-optimization)
    if (cachedRefs.avatar.textContent !== avatarText) {
      cachedRefs.avatar.textContent = avatarText;
    }
    if (cachedRefs.name.textContent !== nameText) {
      cachedRefs.name.textContent = nameText;
    }
    if (cachedRefs.email.textContent !== emailText) {
      cachedRefs.email.textContent = emailText;
    }
    if (cachedRefs.role.textContent !== roleText) {
      cachedRefs.role.textContent = roleText;
    }

    // Only update data-id if it changed (avoid DOM writes)
    if (recycledElement.dataset.id !== user.id) {
      recycledElement.dataset.id = user.id;
    }
    recycledElement.dataset.itemType = "users";

    return recycledElement;
  }

  // Create new element - optimized template
  const element = document.createElement("div");
  element.className = "mtrl-list-item user-item";
  element.dataset.id = user.id;

  // Use template string for better performance
  const avatarText = user.avatar || user.headline?.charAt(0) || "?";
  const nameText = user.headline || "Unknown";
  const emailText = user.supportingText || "";
  const roleText = user.meta || "";

  element.innerHTML = `<div class="user-avatar">${avatarText}</div><div class="user-details"><div class="user-name">${nameText} (${user.id})</div><div class="user-email">${emailText}</div><div class="user-role">${roleText}</div></div>`;

  // Pre-cache child references for future recycling
  element._cachedRefs = {
    avatar: element.querySelector(".user-avatar"),
    name: element.querySelector(".user-name"),
    email: element.querySelector(".user-email"),
    role: element.querySelector(".user-role"),
  };

  return element;
};

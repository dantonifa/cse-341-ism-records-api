// ==========================================================================
// 1. ASYNCHRONOUS DATABASE FETCH UTILITIES (GLOBAL SCOPE)
// ==========================================================================

// Helper function to fetch and display a single record by its business ID
async function loadSingleRecord(studentId) {
  const resultDisplay = document.getElementById("search-result-display");
  if (!resultDisplay) return;

  if (!studentId.trim()) {
    resultDisplay.innerHTML = "";
    const errorMsg = document.createElement("p");
    errorMsg.className = "status-message status-error";
    errorMsg.textContent = "Please enter a valid student ID.";
    resultDisplay.appendChild(errorMsg);
    return;
  }

  try {
    resultDisplay.innerHTML = "";
    const loadingMsg = document.createElement("p");
    loadingMsg.className = "status-message status-sending";
    loadingMsg.textContent = "Searching database...";
    resultDisplay.appendChild(loadingMsg);

    const response = await fetch(`/records/${studentId}`);
    resultDisplay.innerHTML = "";

    if (!response.ok) {
      const errorMsg = document.createElement("p");
      errorMsg.className = "status-message status-error";
      errorMsg.textContent =
        response.status === 404
          ? `No student record found with ID: ${studentId}`
          : "Failed to retrieve record.";
      resultDisplay.appendChild(errorMsg);
      return;
    }

    const student = await response.json();

    // Generate student data display card using pure DOM creation
    const card = document.createElement("div");
    card.className = "record-card";

    const title = document.createElement("h2");
    title.textContent = `${student.name} (${student.studentId})`;
    card.appendChild(title);

    const pCourse = document.createElement("p");
    pCourse.textContent = `Course: ${student.course}`;
    card.appendChild(pCourse);

    const pGrades = document.createElement("p");
    const g = student.grades || {};
    pGrades.textContent = `Grades: P1=${g.parcial1 ?? 0}, P2=${g.parcial2 ?? 0}, P3=${g.parcial3 ?? 0}, P4=${g.parcial4 ?? 0}`;
    card.appendChild(pGrades);

    const pMeta = document.createElement("p");
    pMeta.textContent = `Grado: ${student.grado ?? "N/A"} | Sección: ${student.seccion ?? "N/A"} | Año: ${student.year ?? "N/A"}`;
    card.appendChild(pMeta);

    resultDisplay.appendChild(card);
  } catch (err) {
    console.error("Error loading single record:", err);
    resultDisplay.innerHTML = "";
    const systemError = document.createElement("p");
    systemError.className = "status-message status-error";
    systemError.textContent =
      "Failed to retrieve record due to a connection error.";
    resultDisplay.appendChild(systemError);
  }
}

// Global fallback tool to list all records if needed
async function loadRecords() {
  try {
    const response = await fetch("/records");
    const records = await response.json();
    const container = document.getElementById("records-container");
    if (!container) return;

    container.innerHTML = "";
    records.forEach((r) => {
      const card = document.createElement("div");
      card.className = "record-card";

      const h2 = document.createElement("h2");
      h2.textContent = `${r.name} (${r.studentId})`;
      card.appendChild(h2);

      const p1 = document.createElement("p");
      p1.textContent = `Course: ${r.course}`;
      card.appendChild(p1);

      const p2 = document.createElement("p");
      p2.textContent = `Grades: P1=${r.grades?.parcial1 ?? 0}, P2=${r.grades?.parcial2 ?? 0}, P3=${r.grades?.parcial3 ?? 0}, P4=${r.grades?.parcial4 ?? 0}`;
      card.appendChild(p2);

      const p3 = document.createElement("p");
      p3.textContent = `Grado: ${r.grado ?? "N/A"} | Sección: ${r.seccion ?? "N/A"} | Año: ${r.year ?? "N/A"}`;
      card.appendChild(p3);

      container.appendChild(card);
    });
  } catch (err) {
    console.error("Error loading records:", err);
  }
}

// ==========================================================================
// 2. LIFECYCLE INITIALIZATION AND EVENT LISTENERS
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menu-toggle");
  const menuList = document.getElementById("vertical-menu-list");
  const toggleIcon = document.getElementById("toggle-icon");
  const actionButtons = document.querySelectorAll(".crud-vertical-btn");
  const recordsContainer = document.getElementById("records-container");

  // Centralized close method using direct style properties
  function closeMenu() {
    if (menuList && toggleIcon) {
      menuList.style.display = "none";
      toggleIcon.textContent = "▼";
    }
  }

  // 1. Manage interactive click events on the parent wrapper trigger button
  if (menuToggle && menuList && toggleIcon) {
    menuToggle.addEventListener("click", (e) => {
      e.stopPropagation(); // Stops immediate bubbling click handlers from firing

      // Check the style property safely
      const isOpen = menuList.style.display === "flex";

      if (isOpen) {
        closeMenu();
      } else {
        menuList.style.display = "flex";
        menuList.style.flexDirection = "column"; // Ensures buttons stack vertically
        toggleIcon.textContent = "▲";
      }
    });
  }

  // 2. Track option click navigation paths inside your dropdown menu layout
  actionButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.stopPropagation();

      actionButtons.forEach((btn) => btn.classList.remove("active"));
      e.currentTarget.classList.add("active");

      const action = e.currentTarget.getAttribute("data-action");
      if (recordsContainer) {
        recordsContainer.style.display = "block";
        renderControlForm(action, recordsContainer);
      }

      closeMenu();
    });
  });

  // 3. User Experience Polish: Instantly collapse menu items and clear workspace if clicking outside
  document.addEventListener("click", (e) => {
    // Check if the click happened outside the menu button and dropdown menu list
    const clickedOutsideMenu =
      !menuToggle.contains(e.target) && !menuList.contains(e.target);
    if (clickedOutsideMenu) {
      closeMenu();
    }

    // Locate the dynamic search form workspace panel inside the DOM tree safely
    const searchFormWrapper = document.querySelector(".form-wrapper");
    if (searchFormWrapper) {
      // Check if the click happened outside the form panel wrapper card completely
      const clickedOutsideForm = !searchFormWrapper.contains(e.target);

      // Also ensure we aren't clicking inside the menu dropdown options list tree path
      const clickedMenuButtons =
        menuList.contains(e.target) || menuToggle.contains(e.target);

      if (clickedOutsideForm && !clickedMenuButtons) {
        // Hide the entire container window smoothly to let you reset actions cleanly
        recordsContainer.style.display = "none";

        // Remove active visual tracking highlight states from sidebar menu buttons
        actionButtons.forEach((btn) => btn.classList.remove("active"));
      }
    }
  });
});

// ==========================================================================
// 3. DYNAMIC DOM WORKSPACE RENDERING COMPONENT (CRUD SWITCHBOARD)
// ==========================================================================
function renderControlForm(action, displayTarget) {
  displayTarget.innerHTML = "";

  switch (action) {
    case "get": {
      const wrapper = document.createElement("div");
      wrapper.className = "form-wrapper";

      const title = document.createElement("h4");
      title.className = "form-title";
      title.textContent = "🔍 Find Student Record";
      wrapper.appendChild(title);

      const group = document.createElement("div");
      group.className = "form-group";
      const lbl = document.createElement("label");
      lbl.textContent = "Student ID:";
      group.appendChild(lbl);

      const row = document.createElement("div");
      row.className = "form-row";

      const input = document.createElement("input");
      input.type = "text";
      input.id = "search-id";
      input.placeholder = "Enter ID (e.g. 1328200200115)";
      row.appendChild(input);

      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "btn-submit-record";
      btn.textContent = "Search";
      row.appendChild(btn);

      group.appendChild(row);
      wrapper.appendChild(group);

      const displayZone = document.createElement("div");
      displayZone.id = "search-result-display";
      wrapper.appendChild(displayZone);

      displayTarget.appendChild(wrapper);

      btn.addEventListener("click", () => loadSingleRecord(input.value));
      input.addEventListener("keypress", (e) => {
        if (e.key === "Enter") loadSingleRecord(input.value);
      });
      break;
    }

    case "create": {
      const wrapper = document.createElement("div");
      wrapper.className = "form-wrapper";

      const title = document.createElement("h4");
      title.className = "form-title";
      title.textContent = "➕ Add New Student Record";
      wrapper.appendChild(title);

      const form = document.createElement("form");
      form.id = "create-student-form";

      const fields = [
        { label: "Student ID:", id: "create-studentId", type: "text" },
        { label: "Full Name:", id: "create-name", type: "text" },
        { label: "Course:", id: "create-course", type: "text" },
      ];

      fields.forEach((f) => {
        const group = document.createElement("div");
        group.className = "form-group";
        const label = document.createElement("label");
        label.textContent = f.label;
        const input = document.createElement("input");
        input.type = f.type;
        input.id = f.id;
        input.required = true;
        group.appendChild(label);
        group.appendChild(input);
        form.appendChild(group);
      });

      const row = document.createElement("div");
      row.className = "form-row";
      const metaFields = [
        { label: "Grado:", id: "create-grado" },
        { label: "Sección:", id: "create-seccion" },
        { label: "Año:", id: "create-year", type: "number" },
      ];

      metaFields.forEach((m) => {
        const col = document.createElement("div");
        col.className = "form-col";
        const label = document.createElement("label");
        label.textContent = m.label;
        const input = document.createElement("input");
        input.type = m.type || "text";
        input.id = m.id;
        input.required = true;
        col.appendChild(label);
        col.appendChild(input);
        row.appendChild(col);
      });
      form.appendChild(row);

      const sub = document.createElement("p");
      sub.className = "section-subtitle";
      sub.textContent = "Grades (Parciales):";
      form.appendChild(sub);

      const grid = document.createElement("div");
      grid.className = "grades-grid";
      ["P1", "P2", "P3", "P4"].forEach((p, idx) => {
        const box = document.createElement("div");
        box.className = "grade-input-box";
        const label = document.createElement("label");
        label.textContent = `${p}:`;
        const input = document.createElement("input");
        input.type = "number";
        input.id = `create-p${idx + 1}`;
        input.min = "0";
        input.max = "100";
        input.value = "0";
        box.appendChild(label);
        box.appendChild(input);
        grid.appendChild(box);
      });
      form.appendChild(grid);
      const subBtn = document.createElement("button");
      subBtn.type = "submit";
      subBtn.className = "btn-submit-record";
      subBtn.textContent = "Save Record";
      form.appendChild(subBtn);
      wrapper.appendChild(form);
      const msg = document.createElement("div");
      msg.id = "create-message";
      msg.className = "status-message";
      wrapper.appendChild(msg);
      displayTarget.appendChild(wrapper);
      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        await submitNewRecord();
      });
      break;
    }
    case "update": {
      const wrapper = document.createElement("div");
      wrapper.className = "form-wrapper";
      const title = document.createElement("h4");
      title.className = "form-title";
      title.textContent = "✏️ Edit Existing Student Record";
      wrapper.appendChild(title);
      const lookupGroup = document.createElement("div");
      lookupGroup.className = "form-group";
      const lookupLabel = document.createElement("label");
      lookupLabel.textContent = "Enter Student ID to Edit:";
      lookupGroup.appendChild(lookupLabel);
      const lookupRow = document.createElement("div");
      lookupRow.className = "form-row";
      const lookupInput = document.createElement("input");
      lookupInput.type = "text";
      lookupInput.id = "update-search-id";
      lookupInput.placeholder = "e.g. 1328200200115";
      const loadBtn = document.createElement("button");
      loadBtn.type = "button";
      loadBtn.className = "btn-submit-record";
      loadBtn.textContent = "Load Student";
      lookupRow.appendChild(lookupInput);
      lookupRow.appendChild(loadBtn);
      lookupGroup.appendChild(lookupRow);
      wrapper.appendChild(lookupGroup);
      const form = document.createElement("form");
      form.id = "update-student-form";
      form.style.display = "none";
      ["Full Name:", "Course:"].forEach((lblText, idx) => {
        const group = document.createElement("div");
        group.className = "form-group";
        const label = document.createElement("label");
        label.textContent = lblText;
        const input = document.createElement("input");
        input.type = "text";
        input.id = idx === 0 ? "update-name" : "update-course";
        input.required = true;
        group.appendChild(label);
        group.appendChild(input);
        form.appendChild(group);
      });
      const row = document.createElement("div");
      row.className = "form-row";
      const fieldsConfig = [
        { label: "Grado:", id: "update-grado" },
        { label: "Sección:", id: "update-seccion" },
        { label: "Año:", id: "update-year", type: "number" },
      ];
      fieldsConfig.forEach((fc) => {
        const col = document.createElement("div");
        col.className = "form-col";
        const label = document.createElement("label");
        label.textContent = fc.label;
        const input = document.createElement("input");
        input.type = fc.type || "text";
        input.id = fc.id;
        input.required = true;
        col.appendChild(label);
        col.appendChild(input);
        row.appendChild(col);
      });
      form.appendChild(row);
      const sub = document.createElement("p");
      sub.className = "section-subtitle";
      sub.textContent = "Edit Grades (Parciales):";
      form.appendChild(sub);
      const grid = document.createElement("div");
      grid.className = "grades-grid";
      ["P1", "P2", "P3", "P4"].forEach((p, idx) => {
        const box = document.createElement("div");
        box.className = "grade-input-box";
        const label = document.createElement("label");
        label.textContent = `${p}:`;
        const input = document.createElement("input");
        input.type = "number";
        input.id = `update-p${idx + 1}`;
        input.min = "0";
        input.max = "100";
        box.appendChild(label);
        box.appendChild(input);
        grid.appendChild(box);
      });
      form.appendChild(grid);
      const subBtn = document.createElement("button");
      subBtn.type = "submit";
      subBtn.className = "btn-submit-record";
      subBtn.textContent = "Update Record";
      form.appendChild(subBtn);
      wrapper.appendChild(form);
      const msg = document.createElement("div");
      msg.id = "update-message";
      msg.className = "status-message";
      wrapper.appendChild(msg);
      displayTarget.appendChild(wrapper);
      loadBtn.addEventListener("click", () =>
        fetchStudentForUpdate(lookupInput.value.trim()),
      );
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        submitUpdatedRecord(lookupInput.value.trim());
      });
      break;
    }
    case "delete": {
      const wrapper = document.createElement("div");
      wrapper.className = "form-wrapper";
      const title = document.createElement("h4");
      title.className = "form-title";
      title.textContent = "❌ Remove Student Record";
      wrapper.appendChild(title);
      const group = document.createElement("div");
      group.className = "form-group";
      group.id = "delete-lookup-box";
      const label = document.createElement("label");
      label.textContent = "Enter Student ID to Delete:";
      group.appendChild(label);
      const row = document.createElement("div");
      row.className = "form-row";
      const input = document.createElement("input");
      input.type = "text";
      input.id = "delete-search-id";
      input.placeholder = "e.g. 1328200200115";
      row.appendChild(input);
      const verifyBtn = document.createElement("button");
      verifyBtn.type = "button";
      verifyBtn.className = "btn-submit-record";
      verifyBtn.textContent = "Verify Student";
      row.appendChild(verifyBtn);
      group.appendChild(row);
      wrapper.appendChild(group);
      const confirmBox = document.createElement("div");
      confirmBox.id = "delete-confirmation-box";
      confirmBox.style.display = "none";
      const warningText = document.createElement("p");
      warningText.id = "delete-warning-text";
      confirmBox.appendChild(warningText);
      const confirmDeleteBtn = document.createElement("button");
      confirmDeleteBtn.type = "button";
      confirmDeleteBtn.className = "btn-submit-record";
      confirmDeleteBtn.id = "btn-confirm-delete";
      confirmDeleteBtn.textContent = "Yes, Delete Record";
      confirmBox.appendChild(confirmDeleteBtn);
      wrapper.appendChild(confirmBox);
      const statusMsg = document.createElement("div");
      statusMsg.id = "delete-message";
      statusMsg.className = "status-message";
      wrapper.appendChild(statusMsg);
      displayTarget.appendChild(wrapper);
      verifyBtn.addEventListener("click", () =>
        verifyStudentForDelete(input.value.trim()),
      );
      confirmDeleteBtn.addEventListener("click", () =>
        submitDeletedRecord(input.value.trim()),
      );
      break;
    }
  }
}
// ==========================================================================
// 4. ACTION SUBMISSION COMPONENT HELPERS (BACKEND PIPELINES)
// ==========================================================================
async function submitNewRecord() {
  const messageTarget = document.getElementById("create-message");
  if (!messageTarget) return;
  const studentData = {
    studentId: document.getElementById("create-studentId").value.trim(),
    name: document.getElementById("create-name").value.trim(),
    course: document.getElementById("create-course").value.trim(),
    grado: document.getElementById("create-grado").value.trim(),
    seccion: document.getElementById("create-seccion").value.trim(),
    year: parseInt(document.getElementById("create-year").value) || 0,
    grades: {
      parcial1: parseInt(document.getElementById("create-p1").value) || 0,
      parcial2: parseInt(document.getElementById("create-p2").value) || 0,
      parcial3: parseInt(document.getElementById("create-p3").value) || 0,
      parcial4: parseInt(document.getElementById("create-p4").value) || 0,
    },
  };
  try {
    messageTarget.className = "status-message status-sending";
    messageTarget.textContent = "Sending record to database...";
    const response = await fetch("/records", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(studentData),
    });
    const result = await response.json();
    if (response.ok) {
      messageTarget.className = "status-message status-success";
      messageTarget.textContent = `✨ ${result.message}`;
      document.getElementById("create-student-form").reset();
    } else {
      messageTarget.className = "status-message status-error";
      messageTarget.textContent = `❌ Error: ${result.message || "Failed to create record."}`;
    }
  } catch (err) {
    console.error(err);
    messageTarget.className = "status-message status-error";
    messageTarget.textContent = "❌ Connection failed. Check server status.";
  }
}
async function fetchStudentForUpdate(studentId) {
  const messageTarget = document.getElementById("update-message");
  const updateForm = document.getElementById("update-student-form");
  if (!messageTarget || !updateForm) return;
  if (!studentId) {
    messageTarget.className = "status-message status-error";
    messageTarget.textContent = "Please provide an ID first.";
    return;
  }
  try {
    messageTarget.className = "status-message status-sending";
    messageTarget.textContent = "Searching for student profile...";
    const response = await fetch(`/records/${studentId}`);
    if (!response.ok)
      throw new Error(
        response.status === 404
          ? "Student profile not found."
          : "Server error.",
      );
    const student = await response.json();
    document.getElementById("update-name").value = student.name || "";
    document.getElementById("update-course").value = student.course || "";
    document.getElementById("update-grado").value = student.grado || "";
    document.getElementById("update-seccion").value = student.seccion || "";
    document.getElementById("update-year").value = student.year || "";
    document.getElementById("update-p1").value = student.grades?.parcial1 ?? 0;
    document.getElementById("update-p2").value = student.grades?.parcial2 ?? 0;
    document.getElementById("update-p3").value = student.grades?.parcial3 ?? 0;
    document.getElementById("update-p4").value = student.grades?.parcial4 ?? 0;
    updateForm.style.display = "block";
    messageTarget.textContent = "";
  } catch (err) {
    updateForm.style.display = "none";
    messageTarget.className = "status-message status-error";
    messageTarget.textContent = `❌ ${err.message}`;
  }
}
async function submitUpdatedRecord(studentId) {
  const messageTarget = document.getElementById("update-message");
  if (!messageTarget) return;
  const updatedData = {
    name: document.getElementById("update-name").value.trim(),
    course: document.getElementById("update-course").value.trim(),
    grado: document.getElementById("update-grado").value.trim(),
    seccion: document.getElementById("update-seccion").value.trim(),
    year: parseInt(document.getElementById("update-year").value) || 0,
    grades: {
      parcial1: parseInt(document.getElementById("update-p1").value) || 0,
      parcial2: parseInt(document.getElementById("update-p2").value) || 0,
      parcial3: parseInt(document.getElementById("update-p3").value) || 0,
      parcial4: parseInt(document.getElementById("update-p4").value) || 0,
    },
  };
  try {
    messageTarget.className = "status-message status-sending";
    messageTarget.textContent = "Updating database records...";
    const response = await fetch(`/records/${studentId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedData),
    });
    const result = await response.json();
    if (response.ok) {
      messageTarget.className = "status-message status-success";
      messageTarget.textContent = `✨ ${result.message}`;
    } else {
      messageTarget.className = "status-message status-error";
      messageTarget.textContent = `❌ Error: ${result.message || "Failed updating document."}`;
    }
  } catch (err) {
    console.error(err);
    messageTarget.className = "status-message status-error";
    messageTarget.textContent = "❌ Connection failed. Check server status.";
  }
}
async function verifyStudentForDelete(studentId) {
  const messageTarget = document.getElementById("delete-message");
  const confirmBox = document.getElementById("delete-confirmation-box");
  const warningText = document.getElementById("delete-warning-text");
  if (!messageTarget || !confirmBox || !warningText) return;
  if (!studentId) {
    messageTarget.className = "status-message status-error";
    messageTarget.textContent = "Please provide an ID first.";
    return;
  }
  try {
    messageTarget.className = "status-message status-sending";
    messageTarget.textContent = "Checking profile existence...";
    const response = await fetch(`/records/${studentId}`);
    if (!response.ok)
      throw new Error(
        response.status === 404
          ? "Student profile not found."
          : "Server error.",
      );
    const student = await response.json();
    warningText.innerHTML =
      "Are you sure you want to permanently delete the academic file of " +
      student.name +
      "? This action cannot be undone.";
    confirmBox.style.display = "block";
    messageTarget.textContent = "";
  } catch (err) {
    confirmBox.style.display = "none";
    messageTarget.className = "status-message status-error";
    messageTarget.textContent = "❌ " + err.message;
  }
}
async function submitDeletedRecord(studentId) {
  const messageTarget = document.getElementById("delete-message");
  const confirmBox = document.getElementById("delete-confirmation-box");
  if (!messageTarget || !confirmBox) return;
  try {
    messageTarget.className = "status-message status-sending";
    messageTarget.textContent = "Removing file from database...";
    const response = await fetch("/records/" + studentId, { method: "DELETE" });
    const result = await response.json();
    if (response.ok) {
      messageTarget.className = "status-message status-success";
      messageTarget.textContent = "✨ " + result.message;
      confirmBox.style.display = "none";
      const idInput = document.getElementById("delete-search-id");
      if (idInput) idInput.value = "";
    } else {
      messageTarget.className = "status-message status-error";
      messageTarget.textContent =
        "❌ Error: " + (result.message || "Failed removing document.");
    }
  } catch (err) {
    console.error(err);
    messageTarget.className = "status-message status-error";
    messageTarget.textContent = "❌ Connection failed. Check server status.";
  }
}

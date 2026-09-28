async function loadRecords() {
  try {
    const response = await fetch("/records"); // Express route
    const records = await response.json();

    const container = document.getElementById("records-container");
    container.innerHTML = records
      .map(
        (r) => `
      <div class="record-card">
        <h2>${r.name} (${r.studentId})</h2>
        <p>Course: ${r.course}</p>
        <p>Grades: P1=${r.grades.parcial1}, P2=${r.grades.parcial2}, P3=${r.grades.parcial3}, P4=${r.grades.parcial4}</p>
        <p>Grado: ${r.grado} | Sección: ${r.seccion} | Año: ${r.year}</p>
      </div>
    `,
      )
      .join("");
  } catch (err) {
    console.error("Error loading records:", err);
  }
}

document.addEventListener("DOMContentLoaded", loadRecords);

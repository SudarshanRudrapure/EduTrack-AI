// ── PASTE YOUR PROXY FLOW URL HERE ───────────────────────────────
const PROXY_URL = import.meta.env.VITE_PROXY_URL;

// ─────────────────────────────────────────────────────────────────

// ── Call SharePoint through proxy ────────────────────────────────
const sp = async (endpoint, method = "GET", body = null) => {
  const res = await fetch(PROXY_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      method,
      endpoint,
      body: body ? JSON.stringify(body) : "",
    }),
  });
  const text = await res.text();
  try { return JSON.parse(text); }
  catch { return {}; }
};

// ── Check if list exists ──────────────────────────────────────────
const listExists = async (listName) => {
  try {
    const res = await sp(`_api/web/lists/getbytitle('${listName}')`);
    return !!res?.d?.Title;
  } catch {
    return false;
  }
};

// ── Create list ───────────────────────────────────────────────────
const createList = async (listName) => {
  const exists = await listExists(listName);
  if (exists) {
    console.log(`✅ List "${listName}" already exists`);
    return true;
  }
  await sp("_api/web/lists", "POST", {
    __metadata: { type: "SP.List" },
    BaseTemplate: 100,
    Title: listName,
    Description: `EduTrack AI - ${listName} list`,
  });
  console.log(`✅ Created list: ${listName}`);
  return true;
};

// ── Check if column exists ────────────────────────────────────────
const columnExists = async (listName, colName) => {
  try {
    const res = await sp(
      `_api/web/lists/getbytitle('${listName}')/fields?$filter=InternalName eq '${colName}'`
    );
    return (res?.d?.results?.length || 0) > 0;
  } catch {
    return false;
  }
};

// ── Add single line text column ───────────────────────────────────
const addTextColumn = async (listName, colName) => {
  const exists = await columnExists(listName, colName);
  if (exists) {
    console.log(`  ✅ Column "${colName}" already exists`);
    return;
  }
  await sp(`_api/web/lists/getbytitle('${listName}')/fields`, "POST", {
    __metadata: { type: "SP.Field" },
    FieldTypeKind: 2,
    Title: colName,
    StaticName: colName,
  });
  console.log(`  ✅ Added text column: ${colName}`);
};

// ── Add multiline text column ─────────────────────────────────────
const addMultilineColumn = async (listName, colName) => {
  const exists = await columnExists(listName, colName);
  if (exists) {
    console.log(`  ✅ Column "${colName}" already exists`);
    return;
  }
  await sp(`_api/web/lists/getbytitle('${listName}')/fields`, "POST", {
    __metadata: { type: "SP.FieldMultiLineText" },
    FieldTypeKind: 3,
    Title: colName,
    StaticName: colName,
    NumberOfLines: 10,
    UnlimitedLengthInDocumentLibrary: true,
  });
  console.log(`  ✅ Added multiline column: ${colName}`);
};

// ── Add number column ─────────────────────────────────────────────
const addNumberColumn = async (listName, colName) => {
  const exists = await columnExists(listName, colName);
  if (exists) {
    console.log(`  ✅ Column "${colName}" already exists`);
    return;
  }
  await sp(`_api/web/lists/getbytitle('${listName}')/fields`, "POST", {
    __metadata: { type: "SP.FieldNumber" },
    FieldTypeKind: 9,
    Title: colName,
    StaticName: colName,
  });
  console.log(`  ✅ Added number column: ${colName}`);
};

// ── Create Students list with all columns ─────────────────────────
const setupStudentsList = async () => {
  console.log("📋 Setting up Students list...");
  await createList("Students");

  const textCols = [
    "usn", "email", "password", "phone",
    "university", "college", "branch",
    "specialization", "section", "status",
  ];
  const numberCols = [
    "semester", "year", "sgpa",
    "cgpa", "backlogs", "teacherId",
  ];
  const multiCols = [
    "attendance", "sgpaHist", "notifications",
  ];

  for (const col of textCols)   await addTextColumn("Students", col);
  for (const col of numberCols) await addNumberColumn("Students", col);
  for (const col of multiCols)  await addMultilineColumn("Students", col);

  console.log("✅ Students list ready");
};

// ── Create Teachers list with all columns ─────────────────────────
const setupTeachersList = async () => {
  console.log("📋 Setting up Teachers list...");
  await createList("Teachers");

  const textCols  = ["email", "password", "department", "phone"];
  const multiCols = ["subjects"];

  for (const col of textCols)  await addTextColumn("Teachers", col);
  for (const col of multiCols) await addMultilineColumn("Teachers", col);

  console.log("✅ Teachers list ready");
};

// ── Create Assignments list with all columns ──────────────────────
const setupAssignmentsList = async () => {
  console.log("📋 Setting up Assignments list...");
  await createList("Assignments");

  const textCols   = ["subject", "branch", "dueDate", "status"];
  const numberCols = ["teacherId"];
  const multiCols  = ["desc", "submissions"];

  for (const col of textCols)   await addTextColumn("Assignments", col);
  for (const col of numberCols) await addNumberColumn("Assignments", col);
  for (const col of multiCols)  await addMultilineColumn("Assignments", col);

  console.log("✅ Assignments list ready");
};

// ── Add item to list ──────────────────────────────────────────────
const addItem = async (listName, fields) => {
  const listType = await sp(
    `_api/web/lists/getbytitle('${listName}')?$select=ListItemEntityTypeFullName`
  );
  const type = listType?.d?.ListItemEntityTypeFullName || "SP.Data.ListItem";

  const res = await sp(
    `_api/web/lists/getbytitle('${listName}')/items`,
    "POST",
    { __metadata: { type }, ...fields }
  );
  return res?.d;
};

// ── Seed Students data ────────────────────────────────────────────
const seedStudents = async (students) => {
  console.log(`🌱 Seeding ${students.length} students...`);
  for (const s of students) {
    await addItem("Students", {
      Title:          s.name,
      usn:            s.usn            || "",
      email:          s.email          || "",
      password:       s.password       || "",
      phone:          s.phone          || "",
      university:     s.university     || "",
      college:        s.college        || "",
      branch:         s.branch         || "",
      specialization: s.specialization || "",
      section:        s.section        || "",
      status:         s.status         || "pending",
      semester:       s.semester       || 1,
      year:           s.year           || 1,
      sgpa:           s.sgpa           || 0,
      cgpa:           s.cgpa           || 0,
      backlogs:       s.backlogs       || 0,
      teacherId:      s.teacherId      || 1,
      attendance:     JSON.stringify(s.attendance    || {}),
      sgpaHist:       JSON.stringify(s.sgpaHist      || []),
      notifications:  JSON.stringify(s.notifications || []),
    });
    console.log(`  ✅ Added: ${s.name}`);
  }
  console.log("✅ Students seeded");
};

// ── Seed Teachers data ────────────────────────────────────────────
const seedTeachers = async (teachers) => {
  console.log(`🌱 Seeding ${teachers.length} teachers...`);
  for (const t of teachers) {
    await addItem("Teachers", {
      Title:      t.name,
      email:      t.email      || "",
      password:   t.password   || "",
      department: t.department || "",
      phone:      t.phone      || "",
      subjects:   JSON.stringify(t.subjects || []),
    });
    console.log(`  ✅ Added: ${t.name}`);
  }
  console.log("✅ Teachers seeded");
};

// ── Seed Assignments data ─────────────────────────────────────────
const seedAssignments = async (assignments) => {
  console.log(`🌱 Seeding ${assignments.length} assignments...`);
  for (const a of assignments) {
    await addItem("Assignments", {
      Title:       a.title,
      subject:     a.subject   || "",
      branch:      a.branch    || "",
      dueDate:     a.dueDate   || "",
      status:      a.status    || "active",
      teacherId:   a.teacherId || 1,
      desc:        a.desc      || "",
      submissions: JSON.stringify(a.submissions || []),
    });
    console.log(`  ✅ Added: ${a.title}`);
  }
  console.log("✅ Assignments seeded");
};

// ── MAIN SETUP FUNCTION ───────────────────────────────────────────
export const runFullSetup = async (students, teachers, assignments) => {
  const logs   = [];
  const addLog = (msg) => { logs.push(msg); console.log(msg); };

  try {
    addLog("🚀 Starting SharePoint setup...");
    addLog("📋 Creating lists and columns...");

    await setupStudentsList();
    addLog("✅ Students list created with all columns");

    await setupTeachersList();
    addLog("✅ Teachers list created with all columns");

    await setupAssignmentsList();
    addLog("✅ Assignments list created with all columns");

    addLog("🌱 Seeding initial data...");

    await seedStudents(students);
    addLog(`✅ ${students.length} students added`);

    await seedTeachers(teachers);
    addLog(`✅ ${teachers.length} teachers added`);

    await seedAssignments(assignments);
    addLog(`✅ ${assignments.length} assignments added`);

    addLog("🎉 Setup complete! SharePoint is ready.");
    return { success: true, logs };

  } catch (err) {
    addLog(`❌ Error: ${err.message}`);
    return { success: false, logs, error: err.message };
  }
};
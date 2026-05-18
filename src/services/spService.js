// ── PASTE YOUR PROXY FLOW URL HERE ─────────────────
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

// ── Parse JSON safely ─────────────────────────────────────────────
const parseJSON = (str, fallback) => {
  try { return JSON.parse(str); }
  catch { return fallback; }
};

// ── Teacher ID mapping ────────────────────────────────────────────
// SharePoint ID → original app ID
const TEACHER_ID_MAP = {
  21: 1,  // Prof. Shwetha
  22: 2,  // Prof. Anuradha
  23: 3,  // Prof. Hema
  24: 4,  // Prof. Vaishnavi
  25: 5,  // Prof. Anitha
};

// ── Get all Students from SharePoint ─────────────────────────────
export const getStudents = async () => {
  const res = await sp(
    "_api/web/lists/getbytitle('Students')/items?$top=100"
  );
  const items = res?.d?.results || [];
  return items.map((s) => ({
    id:             s.Id,
    name:           s.Title            || "",
    usn:            s.usn              || "",
    email:          s.email            || "",
    password:       s.password         || "",
    phone:          s.phone            || "",
    university:     s.university       || "",
    college:        s.college          || "",
    branch:         s.branch           || "",
    specialization: s.specialization   || "",
    section:        s.section          || "",
    status:         s.status           || "pending",
    semester:       Number(s.semester) || 1,
    year:           Number(s.year)     || 1,
    sgpa:           Number(s.sgpa)     || 0,
    cgpa:           Number(s.cgpa)     || 0,
    backlogs:       Number(s.backlogs) || 0,
    teacherId:      TEACHER_ID_MAP[Number(s.teacherId)] || Number(s.teacherId) || 1,
    attendance:     parseJSON(s.attendance,    {}),
    sgpaHist:       parseJSON(s.sgpaHist,      []),
    notifications:  parseJSON(s.notifications, []),
  }));
};

// ── Get all Teachers from SharePoint ─────────────────────────────
export const getTeachers = async () => {
  const res = await sp(
    "_api/web/lists/getbytitle('Teachers')/items?$top=100"
  );
  const items = res?.d?.results || [];
  return items.map((t) => ({
    id:         TEACHER_ID_MAP[Number(t.Id)] || Number(t.Id),
    name:       t.Title      || "",
    email:      t.email      || "",
    password:   t.password   || "",
    department: t.department || "",
    phone:      t.phone      || "",
    subjects:   parseJSON(t.subjects, []),
  }));
};

// ── Get all Assignments from SharePoint ───────────────────────────
export const getAssignments = async () => {
  const res = await sp(
    "_api/web/lists/getbytitle('Assignments')/items?$top=100"
  );
  const items = res?.d?.results || [];
  return items.map((a) => ({
    id:          a.Id,
    title:       a.Title       || "",
    subject:     a.subject     || "",
    branch:      a.branch      || "",
    dueDate:     a.dueDate     || "",
    status:      a.status      || "active",
    teacherId:   TEACHER_ID_MAP[Number(a.teacherId)] || Number(a.teacherId) || 1,
    desc:        a.desc        || "",
    submissions: parseJSON(a.submissions, []),
  }));
};

// ── Update a Student in SharePoint ────────────────────────────────
export const updateStudent = async (id, fields) => {
  const listType = await sp(
    "_api/web/lists/getbytitle('Students')?$select=ListItemEntityTypeFullName"
  );
  const type = listType?.d?.ListItemEntityTypeFullName || "SP.Data.StudentsListItem";

  const body = {
    __metadata: { type },
    ...fields,
  };

  if (body.attendance)    body.attendance    = JSON.stringify(body.attendance);
  if (body.sgpaHist)      body.sgpaHist      = JSON.stringify(body.sgpaHist);
  if (body.notifications) body.notifications = JSON.stringify(body.notifications);

  await sp(
    `_api/web/lists/getbytitle('Students')/items(${id})`,
    "MERGE",
    body
  );
};

// ── Update an Assignment in SharePoint ───────────────────────────
export const updateAssignment = async (id, fields) => {
  const listType = await sp(
    "_api/web/lists/getbytitle('Assignments')?$select=ListItemEntityTypeFullName"
  );
  const type = listType?.d?.ListItemEntityTypeFullName || "SP.Data.AssignmentsListItem";

  const body = {
    __metadata: { type },
    ...fields,
  };

  if (body.submissions) body.submissions = JSON.stringify(body.submissions);

  await sp(
    `_api/web/lists/getbytitle('Assignments')/items(${id})`,
    "MERGE",
    body
  );
};
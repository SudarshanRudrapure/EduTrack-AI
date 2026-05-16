import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
} from "recharts";

import { BLU, GRN, AMB, RED, F, FM } from "../../constants/theme";
import { useTheme } from "../../context/ThemeContext";
import { BRANCHES, BCOL } from "../../constants/branches";
import { lowAttendance, avgAtt } from "../../utils/helpers";

import PageHeader from "../../components/layout/PageHeader";
import StatCard from "../../components/ui/StatCard";
import Avatar from "../../components/ui/Avatar";
import Badge from "../../components/ui/Badge";
import Grid from "../../components/ui/Grid";

export default function AdminOverview({
  students,
  teachers,
  // eslint-disable-next-line no-unused-vars
  assignments,
}) {
  const { theme, isDark } = useTheme();

  const approved = students.filter(
    (s) => s.status === "approved"
  );

  const pending = students.filter(
    (s) => s.status === "pending"
  );

  const lowAtt = approved.filter(lowAttendance);

  const topPerf = [...approved]
    .sort((a, b) => b.cgpa - a.cgpa)
    .slice(0, 5);

  const branchData = BRANCHES.map((b) => ({
    name: b,
    students: students.filter((s) => s.branch === b).length,
    fill: BCOL[b],
  }));

  const pieData = BRANCHES.map((b) => ({
    name: b,
    value: students.filter((s) => s.branch === b).length,
  }));

  // ✅ Fixed Custom Tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload || !payload.length) {
      return null;
    }

    const data = payload[0];

    return (
      <div
        style={{
          background: theme.CRD2,
          border: `1px solid ${theme.BD2}`,
          borderRadius: 8,
          padding: "8px 12px",
          fontSize: 12,
          color: theme.TX1,
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        }}
      >
        <div>
          {data.name}:{" "}
          <b style={{ color: data.color || BLU }}>
            {data.value}
          </b>
        </div>
      </div>
    );
  };

  const cardStyle = {
    background: theme.CRD,
    border: `1px solid ${theme.BD}`,
    borderRadius: 12,
    padding: 20,
    boxShadow: isDark
      ? "none"
      : "0 1px 4px rgba(0,0,0,0.06)",
  };

  return (
    <>
      <PageHeader
        title="Admin Dashboard"
        sub="System overview — all branches and departments"
      />

      {/* ── Stat Cards ── */}
      <Grid cols={4}>
        <StatCard
          label="Total Students"
          value={students.length}
          sub={`${approved.length} approved`}
          color={BLU}
          icon="🎓"
        />

        <StatCard
          label="Total Teachers"
          value={teachers.length}
          sub="5 departments"
          color={GRN}
          icon="👨‍🏫"
        />

        <StatCard
          label="Pending Approvals"
          value={pending.length}
          sub="Awaiting teacher review"
          color={AMB}
          icon="⏳"
        />

        <StatCard
          label="Low Attendance"
          value={lowAtt.length}
          sub="Below 75% threshold"
          color={RED}
          icon="⚠️"
        />
      </Grid>

      {/* ── Charts Row ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.6fr 1fr",
          gap: 18,
          marginBottom: 22,
        }}
      >
        {/* ── Bar Chart ── */}
        <div style={cardStyle}>
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: theme.TX1,
              marginBottom: 16,
              fontFamily: F,
            }}
          >
            Branch-wise Student Distribution
          </div>

          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={branchData} barSize={28}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={theme.BD}
                vertical={false}
              />

              <XAxis
                dataKey="name"
                tick={{
                  fill: theme.TX2,
                  fontSize: 11,
                  fontFamily: FM,
                }}
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                tick={{
                  fill: theme.TX2,
                  fontSize: 11,
                }}
                axisLine={false}
                tickLine={false}
              />

              <Tooltip
                content={CustomTooltip}
                cursor={{ fill: theme.BD + "44" }}
              />

              <Bar
                dataKey="students"
                radius={[6, 6, 0, 0]}
              >
                {branchData.map((entry, i) => (
                  <Cell
                    key={i}
                    fill={entry.fill}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* ── Pie Chart ── */}
        <div style={cardStyle}>
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: theme.TX1,
              marginBottom: 16,
              fontFamily: F,
            }}
          >
            Branch Distribution
          </div>

          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={75}
                dataKey="value"
                paddingAngle={3}
              >
                {pieData.map((e, i) => (
                  <Cell
                    key={i}
                    fill={BCOL[e.name]}
                  />
                ))}
              </Pie>

              <Tooltip content={CustomTooltip} />
            </PieChart>
          </ResponsiveContainer>

          {/* ── Legend ── */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
              marginTop: 10,
              justifyContent: "center",
            }}
          >
            {BRANCHES.map((b) => (
              <div
                key={b}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 2,
                    background: BCOL[b],
                  }}
                />

                <span
                  style={{
                    fontSize: 10,
                    color: theme.TX2,
                    fontFamily: F,
                  }}
                >
                  {b}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Bottom Row ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 18,
        }}
      >
        {/* ── Top Performers ── */}
        <div style={cardStyle}>
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: theme.TX1,
              marginBottom: 14,
              fontFamily: F,
            }}
          >
            🏆 Top Performers
          </div>

          {topPerf.map((s, i) => (
            <div
              key={s.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "10px 0",
                borderBottom:
                  i < topPerf.length - 1
                    ? `1px solid ${theme.BD}`
                    : "none",
              }}
            >
              <div
                style={{
                  fontFamily: FM,
                  color: i < 3 ? AMB : theme.TX3,
                  fontWeight: 700,
                  fontSize: 13,
                  width: 20,
                }}
              >
                #{i + 1}
              </div>

              <Avatar name={s.name} size={30} />

              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: 13,
                    color: theme.TX1,
                    fontWeight: 600,
                    fontFamily: F,
                  }}
                >
                  {s.name}
                </div>

                <div
                  style={{
                    fontSize: 11,
                    color: theme.TX2,
                    fontFamily: F,
                  }}
                >
                  {s.branch} · {s.usn}
                </div>
              </div>

              <div style={{ textAlign: "right" }}>
                <div
                  style={{
                    fontFamily: FM,
                    color: GRN,
                    fontWeight: 700,
                    fontSize: 14,
                  }}
                >
                  {s.cgpa}
                </div>

                <div
                  style={{
                    fontSize: 10,
                    color: theme.TX3,
                    fontFamily: F,
                  }}
                >
                  CGPA
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Low Attendance ── */}
        <div style={cardStyle}>
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: theme.TX1,
              marginBottom: 14,
              fontFamily: F,
            }}
          >
            ⚠️ Low Attendance Students
          </div>

          {lowAtt.length === 0 ? (
            <div
              style={{
                background: isDark
                  ? "#064e3b"
                  : "#d1fae5",

                border: `1px solid ${
                  isDark
                    ? "#065f46"
                    : "#6ee7b7"
                }`,

                borderRadius: 8,
                padding: 12,
                textAlign: "center",
                color: isDark
                  ? GRN
                  : "#065f46",

                fontSize: 13,
                fontFamily: F,
              }}
            >
              ✅ All students above 75% — Great!
            </div>
          ) : (
            lowAtt.slice(0, 6).map((s, i) => (
              <div
                key={s.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "9px 0",

                  borderBottom:
                    i <
                    Math.min(lowAtt.length, 6) - 1
                      ? `1px solid ${theme.BD}`
                      : "none",
                }}
              >
                <Avatar name={s.name} size={30} />

                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: 13,
                      color: theme.TX1,
                      fontWeight: 500,
                      fontFamily: F,
                    }}
                  >
                    {s.name}
                  </div>

                  <div
                    style={{
                      fontSize: 11,
                      color: theme.TX2,
                      fontFamily: F,
                    }}
                  >
                    {s.branch}
                  </div>
                </div>

                <Badge
                  color={RED}
                  bg={
                    isDark
                      ? "#450a0a"
                      : "#fee2e2"
                  }
                >
                  {avgAtt(s)}% avg
                </Badge>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
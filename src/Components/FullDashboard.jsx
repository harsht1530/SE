import React, { useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Sector,
} from "recharts";

const ACCENT = "#b349a5";
const hi = "#fbfbfb";

// Dummy Data
const kpis = [
  { label: "Total Rx", value: 12500 },
  { label: "New Rx", value: 3300 },
  { label: "Spend USD", value: 89250 },
  { label: "Units Dispensed", value: 22200 },
  { label: "Avg Spend/Rx", value: 21 },
  { label: "Avg Units/Rx", value: 1.8 },
];
const timeSeries = [
  { month: "Jan", TRx: 3100, NRx: 1150, Spend: 18000 },
  { month: "Feb", TRx: 3300, NRx: 900, Spend: 18890 },
  { month: "Mar", TRx: 2950, NRx: 1050, Spend: 16200 },
  { month: "Apr", TRx: 3150, NRx: 1200, Spend: 19250 },
];
const topDrugs = [
  { name: "BrandA", value: 5100, spend: 26500 },
  { name: "BrandB", value: 4200, spend: 21400 },
  { name: "BrandC", value: 3100, spend: 16500 },
  { name: "BrandD", value: 2750, spend: 12400 },
  { name: "BrandE", value: 1700, spend: 7150 },
];
const therapy = [
  { name: "Oncology", value: 36 },
  { name: "Cardio", value: 22 },
  { name: "Pulmo", value: 18 },
  { name: "Diabetes", value: 14 },
  { name: "Nephro", value: 10 },
];
const payer = [
  { name: "COMM", value: 48 },
  { name: "MCARE", value: 32 },
  { name: "CASH", value: 13 },
  { name: "OTHER", value: 7 },
];
const channel = [
  { name: "Retail", value: 68 },
  { name: "Mail", value: 24 },
  { name: "LTC", value: 8 },
];
const demography = [
  { band: "0-17", rx: 670 },
  { band: "18-34", rx: 2400 },
  { band: "35-54", rx: 7300 },
  { band: "55-74", rx: 8600 },
  { band: "75+", rx: 2200 },
];
const sex = [
  { name: "Female", value: 56 },
  { name: "Male", value: 44 },
];
const geography = [
  { name: "KA", value: 7200 },
  { name: "MH", value: 6100 },
  { name: "DL", value: 2730 },
  { name: "KL", value: 1900 },
];
const projectedPie = [
  { name: "Projected", value: 87 },
  { name: "Rest", value: 13 },
];
const coveragePie = [
  { name: "Coverage", value: 93 },
  { name: "Rest", value: 7 },
];
const provider = {
  name: "Dr. Priya Kiran",
  degree: "MD",
  specialty: "Oncology",
  city: "Bengaluru",
  status: "Active",
  npi: "1234567890",
};
const drugDetails = [
  {
    brand: "BrandA",
    generic: "Metformin",
    market: "Diabetes",
    form: "Tablet",
    strength: "500mg",
    price: 8.4,
  },
  {
    brand: "BrandB",
    generic: "Glipizide",
    market: "Diabetes",
    form: "Tablet",
    strength: "2.5mg",
    price: 14.0,
  },
  {
    brand: "BrandC",
    generic: "Atorva",
    market: "Cardio",
    form: "Tablet",
    strength: "10mg",
    price: 23.1,
  },
];
const specialtyRx = [
  { name: "Diabetology", rx: 6200 },
  { name: "Cardio", rx: 4800 },
  { name: "Pulmo", rx: 3150 },
];
const stateRollUp = [
  { name: "KA", rx: 7200 },
  { name: "MH", rx: 6340 },
];

function renderActiveShape(props) {
  const RADIAN = Math.PI / 180;
  const {
    cx,
    cy,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    value,
  } = props;
  return (
    <g>
      <text
        x={cx}
        y={cy}
        dy={6}
        textAnchor="middle"
        className="font-bold text-xl fill-[#b349a5]"
      >
        {value}%
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 7}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
    </g>
  );
}

export default function FullDocDashboard() {
  const [activeProj, setActiveProj] = useState(0);
  const [activeCov, setActiveCov] = useState(0);

  return (
    <section className="bg-gradient-to-br from-white via-gray-50 to-[#fbf4fa] min-h-screen px-5 md:px-14 py-10">
      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-12">
        {kpis.map((card) => (
          <div
            key={card.label}
            className="group bg-white rounded-xl shadow-md hover:shadow-2xl transition-shadow border border-[#b349a5]/40 px-4 py-7 flex flex-col items-center cursor-pointer hover:bg-[#b349a5]/10"
          >
            <span className="font-semibold text-gray-500">{card.label}</span>
            <span className="text-2xl font-extrabold text-[#b349a5] group-hover:scale-110 group-hover:text-[#7e28a9] transition">
              {card.value}
            </span>
          </div>
        ))}
      </div>

      {/* Time series */}
      <div className="mb-14 bg-white rounded-xl shadow border border-[#b349a5]/30 p-7 hover:shadow-2xl transition-shadow">
        <div className="font-semibold text-[#b349a5] mb-2">
          Prescribing Trend
        </div>
        <ResponsiveContainer width="100%" height={270}>
          <LineChart data={timeSeries}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" stroke={ACCENT} />
            <YAxis stroke={ACCENT} />
            <Tooltip contentStyle={{ background: hi, borderColor: ACCENT }} />
            <Legend />
            <Line
              type="monotone"
              dataKey="TRx"
              stroke={ACCENT}
              strokeWidth={3}
              dot={{ r: 6, stroke: ACCENT }}
              activeDot={{ r: 9, fill: ACCENT }}
            />
            <Line
              type="monotone"
              dataKey="NRx"
              stroke="#7e28a9"
              strokeWidth={2}
              dot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="Spend"
              stroke="#28b364"
              strokeWidth={2}
              dot={{ r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Top Drugs */}
      <div className="mb-14 bg-white rounded-xl shadow border border-[#b349a5]/30 p-7 hover:shadow-2xl transition-shadow">
        <div className="font-semibold text-[#b349a5] mb-2">Top Drugs (TRx)</div>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={topDrugs} layout="vertical" barCategoryGap="15%">
            <XAxis type="number" stroke={ACCENT} />
            <YAxis dataKey="name" type="category" stroke={ACCENT} />
            <Tooltip contentStyle={{ background: hi, borderColor: ACCENT }} />
            <Bar dataKey="value" fill={ACCENT} radius={[0, 18, 18, 0]}>
              {topDrugs.map((entry, idx) => (
                <Cell
                  key={idx}
                  cursor="pointer"
                  fill={ACCENT}
                  fillOpacity={0.5 + idx * 0.1}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Donuts: Therapy, Payor, Channel */}
      <div className="grid md:grid-cols-3 gap-10 mb-14">
        {[
          { name: "Market Therapy Split", data: therapy },
          { name: "Payer Mix", data: payer },
          { name: "Channel Split", data: channel },
        ].map((section, i) => (
          <div
            key={section.name}
            className="bg-white rounded-xl shadow border border-[#b349a5]/40 p-6 hover:shadow-2xl transition-shadow"
          >
            <div className="font-semibold text-[#b349a5] mb-2">
              {section.name}
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={section.data}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={32}
                  outerRadius={70}
                  isAnimationActive
                  activeIndex={2}
                  onMouseOver={(_, idx, event) => {
                    if (event?.target) {
                      event.target.style.filter =
                        "drop-shadow(0 0 10px #b349a544)";
                    }
                  }}
                  onMouseOut={(_, idx, event) => {
                    if (event?.target) {
                      event.target.style.filter = "none";
                    }
                  }}
                >
                  {section.data.map((entry, i) => (
                    <Cell key={i} fill={ACCENT} opacity={0.7 - i * 0.11} />
                  ))}
                </Pie>

                {/* Tooltip shows slice name and value on hover */}
                <Tooltip
                  formatter={(value, name) => [`${value}`, `${name}`]}
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #b349a5",
                    borderRadius: "6px",
                    padding: "8px",
                    color: "#333",
                  }}
                />

                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ))}
      </div>

      {/* Projected/Coverage/Provider */}
      <div className="grid md:grid-cols-3 gap-7 w-full max-w-5xl mx-auto mb-12">
        {/* Projected % */}
        <div className="bg-white shadow rounded-xl border border-[#b349a5]/30 p-7 flex flex-col items-center hover:shadow-xl transition-all transform hover:scale-[1.02] hover:border-[#b349a5]/60 group">
          <div className="font-semibold text-gray-700 mb-2">Projected %</div>
          <div style={{ width: 120, height: 120, position: "relative" }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={projectedPie}
                  innerRadius={36}
                  outerRadius={49}
                  startAngle={90}
                  endAngle={-270}
                  dataKey="value"
                  nameKey="name"
                  activeIndex={activeProj}
                  activeShape={renderActiveShape}
                  onMouseEnter={(_, i) => setActiveProj(i)}
                  onMouseLeave={() => setActiveProj(0)}
                >
                  {projectedPie.map((entry, i) => (
                    <Cell key={i} fill={i === 0 ? ACCENT : "#f3eaf5"} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "#fff",
                    borderColor: ACCENT,
                    borderRadius: "10px",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                  }}
                />
                {/* Center Label */}
                <text
                  x="50%"
                  y="50%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-gray-800 font-bold transition-all duration-300 group-hover:scale-110"
                  style={{ fontSize: 20, fill: ACCENT }}
                >
                  {`${projectedPie[0].value}%`}
                </text>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Coverage % */}
        <div className="bg-white shadow rounded-xl border border-[#b349a5]/30 p-7 flex flex-col items-center hover:shadow-xl transition-all transform hover:scale-[1.02] hover:border-[#b349a5]/60 group">
          <div className="font-semibold text-gray-700 mb-2">Coverage %</div>
          <div style={{ width: 120, height: 120, position: "relative" }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={coveragePie}
                  innerRadius={36}
                  outerRadius={49}
                  startAngle={90}
                  endAngle={-270}
                  dataKey="value"
                  nameKey="name"
                  activeIndex={activeCov}
                  activeShape={renderActiveShape}
                  onMouseEnter={(_, i) => setActiveCov(i)}
                  onMouseLeave={() => setActiveCov(0)}
                >
                  {coveragePie.map((entry, i) => (
                    <Cell key={i} fill={i === 0 ? ACCENT : "#f3eaf5"} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "#fff",
                    borderColor: ACCENT,
                    borderRadius: "10px",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                  }}
                />
                {/* Center Label */}
                <text
                  x="50%"
                  y="50%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-gray-800 font-bold transition-all duration-300 group-hover:scale-110"
                  style={{ fontSize: 20, fill: ACCENT }}
                >
                  {`${coveragePie[0].value}%`}
                </text>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Provider Profile */}
        <div className="bg-white shadow rounded-xl border border-[#b349a5]/30 p-8 flex flex-col items-start hover:shadow-xl transition-all transform hover:scale-[1.02] hover:border-[#b349a5]/60">
          <div className="text-lg font-extrabold text-[#b349a5] mb-1">
            {provider.name}
          </div>
          <div className="text-gray-700 font-semibold">
            {provider.degree} - {provider.specialty}
          </div>
          <div className="text-gray-700">City: {provider.city}</div>
          <div className="text-gray-700">NPI: {provider.npi}</div>
          <div className="text-gray-700 font-medium">
            Status:{" "}
            <span className="font-semibold text-emerald-600">
              {provider.status}
            </span>
          </div>
        </div>
      </div>

      {/* Patient Demo: Age Bands & Sex */}
      <div className="grid md:grid-cols-2 gap-10 mb-14">
        <div className="bg-white rounded-xl shadow border border-[#b349a5]/40 p-6 hover:shadow-2xl transition-shadow">
          <div className="font-semibold text-[#b349a5] mb-2">
            Patient Age Bands
          </div>
          <ResponsiveContainer width="100%" height={155}>
            <BarChart data={demography}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="band" stroke={ACCENT} />
              <YAxis stroke={ACCENT} />
              <Tooltip contentStyle={{ background: hi, borderColor: ACCENT }} />
              <Bar dataKey="rx" fill={ACCENT} radius={[8, 8, 0, 0]}>
                {demography.map((_, idx) => (
                  <Cell
                    key={idx}
                    fill={ACCENT}
                    onMouseOver={(event) =>
                      (event.target.style.fill = "#7e28a9")
                    }
                    onMouseOut={(event) => (event.target.style.fill = ACCENT)}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-xl shadow border border-[#b349a5]/40 p-6 hover:shadow-2xl transition-shadow">
          <div className="font-semibold text-[#b349a5] mb-2">Patient Sex</div>
          <ResponsiveContainer width="100%" height={155}>
            <PieChart>
              <Pie
                data={sex}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={18}
                outerRadius={46}
              >
                {sex.map((_, i) => (
                  <Cell key={i} fill={ACCENT} opacity={0.87 - i * 0.22} />
                ))}
              </Pie>

              {/* Tooltip shows slice name and value on hover */}
              <Tooltip
                formatter={(value, name) => [`${value}`, `${name}`]}
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #b349a5",
                  borderRadius: "6px",
                  padding: "8px",
                  color: "#333",
                }}
              />

              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Geography */}
      <div className="bg-white rounded-xl shadow border border-[#b349a5]/40 p-7 mb-14 hover:shadow-2xl transition-shadow">
        <div className="font-semibold text-[#b349a5] mb-2">
          Geographical Rx (States)
        </div>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={geography}>
            <XAxis dataKey="name" stroke={ACCENT} />
            <YAxis stroke={ACCENT} />
            <Tooltip contentStyle={{ background: hi, borderColor: ACCENT }} />
            <Bar dataKey="value" fill={ACCENT} radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Drug meta */}
      <div className="bg-white rounded-xl shadow border border-[#b349a5]/40 p-7 mb-10 hover:shadow-2xl transition-shadow">
        <div className="text-lg font-bold text-[#b349a5] mb-4">
          Drug Details
        </div>
        <table className="w-full text-[15px] text-left">
          <thead>
            <tr className="text-[#b349a5] bg-gray-50 font-semibold">
              <th className="p-2">Brand</th>
              <th className="p-2">Generic</th>
              <th className="p-2">Form</th>
              <th className="p-2">Strength</th>
              <th className="p-2">Market</th>
              <th className="p-2">Unit Price</th>
            </tr>
          </thead>
          <tbody>
            {drugDetails.map((drug) => (
              <tr
                key={drug.brand}
                className="border-b hover:bg-[#f3eaf5] transition"
              >
                <td className="p-2">{drug.brand}</td>
                <td className="p-2">{drug.generic}</td>
                <td className="p-2">{drug.form}</td>
                <td className="p-2">{drug.strength}</td>
                <td className="p-2">{drug.market}</td>
                <td className="p-2">{drug.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Rollups: By specialty, by state */}
      <div className="grid md:grid-cols-2 gap-10 mb-10">
        <div className="bg-white rounded-xl shadow border border-[#b349a5]/40 p-7 hover:shadow-2xl transition-shadow">
          <div className="font-semibold text-[#b349a5] mb-2">
            TRx by Specialty
          </div>
          <ResponsiveContainer width="100%" height={120}>
            <BarChart data={specialtyRx}>
              <XAxis dataKey="name" stroke={ACCENT} />
              <YAxis stroke={ACCENT} />
              <Tooltip contentStyle={{ background: hi, borderColor: ACCENT }} />
              <Bar dataKey="rx" fill={ACCENT} radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-xl shadow border border-[#b349a5]/40 p-7 hover:shadow-2xl transition-shadow">
          <div className="font-semibold text-[#b349a5] mb-2">TRx by State</div>
          <ResponsiveContainer width="100%" height={120}>
            <BarChart data={stateRollUp}>
              <XAxis dataKey="name" stroke={ACCENT} />
              <YAxis stroke={ACCENT} />
              <Tooltip contentStyle={{ background: hi, borderColor: ACCENT }} />
              <Bar dataKey="rx" fill={ACCENT} radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}
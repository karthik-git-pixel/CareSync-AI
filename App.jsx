import { useState, useEffect } from "react";
import LoginScreen from "./components/LoginScreen";
import ChatBotModal from "./components/ChatBotModal";
import {
    Home, Activity, Bell, Mic, Pill, Stethoscope, Clock, HeartPulse, Wind,
    AlertTriangle, User, UserCheck, Search, Lightbulb, AlertOctagon, CheckCircle
} from 'lucide-react';

/* ─────────────────────────────────────────
   MOCK DATA
───────────────────────────────────────── */
const PATIENT = {
    name: "Margaret Thompson",
    age: 74,
    dob: "12 March 1951",
    id: "PT-00821",
    medications: 5,
    doctor: "Dr. Alan Reeves",
    lastVisit: "18 Mar 2026",
};

const VITALS = {
    heartRate: 95,
    bpSys: 140,
    bpDia: 90,
    spo2: 95,
    temp: 37.2,
    weight: 68,
};

const RISK = {
    score: 0.78,
    level: "High Risk",
    color: "red",
    factors: [
        { label: "Drug A + Drug B Interaction", weight: 0.34, icon: <Pill className="w-5 h-5 text-red-500" /> },
        { label: "High Blood Pressure", weight: 0.27, icon: <Stethoscope className="w-5 h-5 text-red-500" /> },
        { label: "Missed Medication (2 days)", weight: 0.19, icon: <Clock className="w-5 h-5 text-yellow-500" /> },
        { label: "Elevated Heart Rate", weight: 0.12, icon: <HeartPulse className="w-5 h-5 text-indigo-500" /> },
        { label: "Low Oxygen Level", weight: 0.08, icon: <Wind className="w-5 h-5 text-gray-400" /> },
    ],
};

const ALERTS = [
    {
        id: 1,
        type: "danger",
        title: "Dangerous Drug Interaction",
        desc: "Metoprolol + Amlodipine may cause very low blood pressure.",
        time: "Today, 9:14 AM",
        action: "Contact Dr. Reeves immediately.",
        icon: <AlertTriangle className="w-6 h-6 text-red-600" />,
    },
    {
        id: 2,
        type: "warning",
        title: "Missed Medication",
        desc: "Evening dose of Lisinopril was not taken for 2 days.",
        time: "Yesterday, 8:00 PM",
        action: "Take dose now and set a reminder.",
        icon: <Pill className="w-6 h-6 text-yellow-600" />,
    },
    {
        id: 3,
        type: "warning",
        title: "High Blood Pressure",
        desc: "Blood pressure reading of 140/90 is above normal range.",
        time: "Today, 7:30 AM",
        action: "Rest and retake reading in 30 minutes.",
        icon: <Stethoscope className="w-6 h-6 text-yellow-600" />,
    },
    {
        id: 4,
        type: "info",
        title: "Heart Rate Elevated",
        desc: "Resting heart rate at 95 bpm, slightly above normal.",
        time: "Today, 7:30 AM",
        action: "Monitor for the next hour.",
        icon: <Activity className="w-6 h-6 text-blue-600" />,
    },
];

/* ─────────────────────────────────────────
   COLOUR HELPERS
───────────────────────────────────────── */
const riskColor = {
    red: { bg: "#FEE2E2", text: "#DC2626", bar: "#DC2626", pill: "bg-red-100 text-red-700" },
    yellow: { bg: "#FEF9C3", text: "#CA8A04", bar: "#CA8A04", pill: "bg-yellow-100 text-yellow-700" },
    green: { bg: "#DCFCE7", text: "#16A34A", bar: "#16A34A", pill: "bg-green-100 text-green-700" },
};

const alertStyle = {
    danger: { border: "#DC2626", bg: "#FFF5F5", badge: "bg-red-100 text-red-700", dot: "#DC2626" },
    warning: { border: "#D97706", bg: "#FFFBEB", badge: "bg-yellow-100 text-yellow-700", dot: "#D97706" },
    info: { border: "#3B82F6", bg: "#EFF6FF", badge: "bg-blue-100 text-blue-700", dot: "#3B82F6" },
};

/* ─────────────────────────────────────────
   SHARED COMPONENTS
───────────────────────────────────────── */
function NavBar({ screen, setScreen, alerts, setIsChatOpen }) {
    const tabs = [
        { id: "dashboard", label: "Dashboard", icon: <Home className="w-4 h-4" /> },
        { id: "risk", label: "Risk Analysis", icon: <Activity className="w-4 h-4" /> },
        { id: "alerts", label: "Alerts", icon: <Bell className="w-4 h-4" />, badge: alerts },
    ];

    return (
        <nav
            style={{
                background: "linear-gradient(135deg, #0F2942 0%, #1A3A5C 100%)",
                boxShadow: "0 4px 24px rgba(15,41,66,0.18)",
            }}
            className="fixed top-0 left-0 right-0 z-50"
        >
            <div className="max-w-5xl mx-auto px-4 flex items-center justify-between h-16">
                {/* Brand */}
                <div className="flex items-center gap-3">
                    <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center text-lg font-bold shadow-sm"
                        style={{ background: "linear-gradient(135deg,#38BDF8,#0EA5E9)" }}
                    >
                        <Activity className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <div className="text-white font-extrabold text-base leading-tight tracking-tight" style={{ fontFamily: "'Georgia', serif" }}>
                            CareSync AI+
                        </div>
                        <div className="text-blue-300 text-xs font-medium tracking-wide uppercase">Geriatric Telecare</div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-1">
                    {tabs.map((t) => (
                        <button
                            key={t.id}
                            onClick={() => setScreen(t.id)}
                            className="relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200"
                            style={{
                                background: screen === t.id ? "rgba(56,189,248,0.18)" : "transparent",
                                color: screen === t.id ? "#38BDF8" : "#94A3B8",
                                borderBottom: screen === t.id ? "2px solid #38BDF8" : "2px solid transparent",
                            }}
                        >
                            <span>{t.icon}</span>
                            <span className="hidden sm:block">{t.label}</span>
                            {t.badge ? (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold shadow-sm">
                                    {t.badge}
                                </span>
                            ) : null}
                        </button>
                    ))}
                </div>

                {/* Voice Btn */}
                <button
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-200 hover:scale-105 active:scale-95 shadow-md"
                    style={{ background: "linear-gradient(135deg,#38BDF8,#0EA5E9)", color: "#fff" }}
                    onClick={() => setIsChatOpen(true)}
                >
                    <Mic className="w-4 h-4" /> <span className="hidden sm:block">Ask CareSync</span>
                </button>
            </div>
        </nav>
    );
}

function VitalCard({ icon, label, value, unit, status }) {
    const colors = {
        normal: { bg: "#F0FDF4", border: "#86EFAC", text: "#15803D" },
        moderate: { bg: "#FEFCE8", border: "#FDE047", text: "#854D0E" },
        high: { bg: "#FFF1F2", border: "#FDA4AF", text: "#BE123C" },
    };
    const c = colors[status] || colors.normal;

    return (
        <div
            className="rounded-2xl p-5 flex flex-col gap-2 transition-all duration-200 hover:-translate-y-1"
            style={{
                background: c.bg,
                border: `2px solid ${c.border}`,
                boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
            }}
        >
            <div className="text-gray-500 bg-white p-2 w-10 h-10 rounded-xl shadow-sm border border-gray-100 flex items-center justify-center mb-1">{icon}</div>
            <div className="text-3xl font-extrabold" style={{ color: c.text, fontFamily: "'Georgia', serif", letterSpacing: "-0.02em" }}>
                {value}
                <span className="text-lg font-semibold ml-1">{unit}</span>
            </div>
            <div className="text-sm font-bold text-gray-500 uppercase tracking-wide">{label}</div>
            <div
                className="text-xs font-bold px-2 py-0.5 rounded-full w-fit mt-auto"
                style={{ background: c.border, color: c.text }}
            >
                {status === "normal" ? "Normal" : status === "moderate" ? "Moderate" : "High"}
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────
   SCREEN 1 — DASHBOARD
───────────────────────────────────────── */
function DashboardScreen({ setScreen, userProfile }) {
    const [animate, setAnimate] = useState(false);
    useEffect(() => { setTimeout(() => setAnimate(true), 100); }, []);

    const p = userProfile || PATIENT;
    const medsCount = userProfile?.medicines?.length ?? PATIENT.medications;

    const riskPct = Math.round(RISK.score * 100);
    const rc = riskColor[RISK.color];

    const [formData, setFormData] = useState({
        age: p.age,
        drug_list: p.medicines ? p.medicines.map(m => m.name).join(", ") : "Metoprolol, Amlodipine",
        systolic_bp: VITALS.bpSys,
        spo2: VITALS.spo2,
        adherence_score: 85
    });

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className={`transition-all duration-500 ${animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
            {/* Patient Header */}
            <div
                className="rounded-3xl p-6 mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-5"
                style={{
                    background: "linear-gradient(135deg, #0F2942 0%, #1A3A5C 100%)",
                    boxShadow: "0 8px 32px rgba(15,41,66,0.2)",
                }}
            >
                <div
                    className="w-20 h-20 rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(56,189,248,0.15)", border: "2px solid rgba(56,189,248,0.3)" }}
                >
                    <User className="w-10 h-10 text-sky-400" />
                </div>
                <div className="flex-1">
                    <div className="text-white text-2xl font-extrabold tracking-tight" style={{ fontFamily: "'Georgia', serif" }}>
                        {p.name}
                    </div>
                    <div className="text-blue-200 text-sm mt-1.5 font-medium tracking-wide">
                        Age {formData.age} · DOB: {p.dob} · ID: {p.id}
                    </div>
                    <div className="text-blue-300 text-sm mt-1 flex items-center font-medium">
                        <UserCheck className="w-4 h-4 inline mr-1.5" /> {p.doctor} <span className="mx-2 text-blue-500">•</span> Last Visit: {p.lastVisit}
                    </div>
                </div>
                <div className="flex gap-3 flex-wrap">
                    <div
                        className="rounded-xl px-4 py-3 text-center"
                        style={{ background: "rgba(56,189,248,0.12)", border: "1px solid rgba(56,189,248,0.25)" }}
                    >
                        <div className="text-blue-300 text-xs uppercase tracking-wide font-semibold">Medications</div>
                        <div className="text-white text-2xl font-extrabold">{medsCount}</div>
                    </div>
                    <div
                        className="rounded-xl px-4 py-3 text-center cursor-pointer hover:bg-red-500/20 transition-all"
                        style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.3)" }}
                        onClick={() => setScreen("alerts")}
                    >
                        <div className="text-red-300 text-xs uppercase tracking-wide font-semibold">Alerts</div>
                        <div className="text-white text-2xl font-extrabold">{ALERTS.length}</div>
                    </div>
                </div>
            </div>

            {/* Risk Score Highlight */}
            <div
                className="rounded-3xl p-6 mb-6 flex flex-col sm:flex-row items-center gap-6 cursor-pointer transition-all duration-200 hover:shadow-xl hover:-translate-y-1"
                style={{ background: rc.bg, border: `2px solid ${rc.bar}`, boxShadow: "0 4px 20px rgba(0,0,0,0.07)" }}
                onClick={() => setScreen("risk")}
            >
                <div className="flex flex-col items-center gap-2">
                    <div className="text-6xl font-extrabold tracking-tighter" style={{ color: rc.text, fontFamily: "'Georgia', serif" }}>
                        {riskPct}%
                    </div>
                    <div className="text-xs font-extrabold uppercase tracking-widest bg-white/50 px-3 py-1 rounded-full shadow-sm" style={{ color: rc.text }}>
                        {RISK.level}
                    </div>
                </div>
                <div className="flex-1 w-full">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-700 font-bold tracking-tight">Overall Risk Score</span>
                        <span className="text-sm font-bold flex items-center gap-1" style={{ color: rc.text }}>Tap for Details <Search className="w-3 h-3" /></span>
                    </div>
                    <div className="w-full bg-white/80 rounded-full h-5 overflow-hidden border border-white" style={{ boxShadow: "inset 0 2px 4px rgba(0,0,0,0.05)" }}>
                        <div
                            className="h-5 rounded-full transition-all duration-1000"
                            style={{ width: animate ? `${riskPct}%` : "0%", background: `linear-gradient(90deg, ${rc.bar}99, ${rc.bar})` }}
                        />
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 font-medium mt-2">
                        <span>0% Safe</span><span>50% Moderate</span><span>100% Critical</span>
                    </div>
                </div>
            </div>

            {/* Vitals Grid */}
            <div className="mb-2">
                <h2 className="text-gray-900 text-xl font-extrabold mb-4 flex items-center tracking-tight" style={{ fontFamily: "'Georgia', serif" }}>
                    <Activity className="w-6 h-6 inline mr-2 text-indigo-500" /> Live Vitals
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <VitalCard icon={<HeartPulse className="w-5 h-5 text-red-500" />} label="Heart Rate" value={VITALS.heartRate} unit="bpm" status="moderate" />
                    <VitalCard icon={<Stethoscope className="w-5 h-5 text-indigo-500" />} label="Blood Pressure" value={`${formData.systolic_bp}/${VITALS.bpDia}`} unit="mmHg" status="high" />
                    <VitalCard icon={<Wind className="w-5 h-5 text-sky-500" />} label="Oxygen Level" value={formData.spo2} unit="%" status="moderate" />
                    <VitalCard icon={<Activity className="w-5 h-5 text-orange-500" />} label="Temperature" value={VITALS.temp} unit="°C" status="normal" />
                    <VitalCard icon={<Activity className="w-5 h-5 text-teal-500" />} label="Weight" value={VITALS.weight} unit="kg" status="normal" />
                    <div
                        className="rounded-2xl p-5 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all duration-200 hover:-translate-y-1"
                        style={{ background: "#F8FAFC", border: "2px dashed #CBD5E1", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}
                        onClick={() => setScreen("alerts")}
                    >
                        <div className="text-red-500 bg-red-100 p-2 rounded-xl mb-1"><Bell className="w-7 h-7" /></div>
                        <div className="text-red-600 text-2xl font-extrabold tracking-tight">{ALERTS.length}</div>
                        <div className="text-gray-500 text-xs font-bold uppercase tracking-widest text-center">Active Alerts</div>
                    </div>
                </div>
            </div>

            {/* Input Fields Form for Dashboard */}
            <div className="mt-8 mb-4">
                <h2 className="text-gray-900 text-xl font-extrabold mb-4 flex items-center tracking-tight" style={{ fontFamily: "'Georgia', serif" }}>
                    <Activity className="w-6 h-6 inline mr-2 text-sky-500" /> Patient Analytics Inputs
                </h2>
                <form onSubmit={(e) => { e.preventDefault(); alert("Patient records updated successfully."); }} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">

                        <div>
                            <label className="block text-sm font-semibold text-gray-600 mb-1">Age</label>
                            <input type="number" name="age" value={formData.age} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-400 outline-none text-gray-800 bg-gray-50" />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-600 mb-1">Systolic BP (mmHg)</label>
                            <input type="number" name="systolic_bp" value={formData.systolic_bp} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-400 outline-none text-gray-800 bg-gray-50" />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-600 mb-1">SpO2 (%)</label>
                            <input type="number" name="spo2" value={formData.spo2} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-400 outline-none text-gray-800 bg-gray-50" />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-600 mb-1">Adherence Score (%)</label>
                            <input type="number" name="adherence_score" value={formData.adherence_score} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-400 outline-none text-gray-800 bg-gray-50" />
                        </div>

                        <div className="lg:col-span-2">
                            <label className="block text-sm font-semibold text-gray-600 mb-1">Drug List</label>
                            <input type="text" name="drug_list" value={formData.drug_list} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-400 outline-none text-gray-800 bg-gray-50" placeholder="e.g. Metoprolol, Amlodipine" />
                        </div>

                    </div>

                    <div className="flex justify-end border-t border-gray-100 pt-5">
                        <button type="submit" className="px-6 py-3 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-xl font-extrabold shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all text-sm flex items-center">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Update Records
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────
   SCREEN 2 — RISK ANALYSIS
───────────────────────────────────────── */
function RiskScreen() {
    const [loading, setLoading] = useState(false);
    const [animate, setAnimate] = useState(false);
    const [barWidths, setBarWidths] = useState(RISK.factors.map(() => 0));

    useEffect(() => {
        setTimeout(() => setAnimate(true), 100);
        setTimeout(() => {
            setBarWidths(RISK.factors.map((f) => Math.round(f.weight * 100)));
        }, 600);
    }, []);

    const handleAnalyze = () => {
        setLoading(true);
        setBarWidths(RISK.factors.map(() => 0));
        setTimeout(() => {
            setLoading(false);
            setTimeout(() => setBarWidths(RISK.factors.map((f) => Math.round(f.weight * 100))), 200);
        }, 2200);
    };

    const riskPct = Math.round(RISK.score * 100);
    const rc = riskColor[RISK.color];

    /* Circular gauge */
    const r = 70;
    const circ = 2 * Math.PI * r;
    const dash = circ * RISK.score;

    return (
        <div className={`transition-all duration-500 ${animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
            <div className="flex flex-col sm:flex-row gap-6 mb-6">
                {/* Gauge card */}
                <div
                    className="rounded-3xl p-8 flex flex-col items-center gap-4 flex-1"
                    style={{ background: rc.bg, border: `2px solid ${rc.bar}`, boxShadow: "0 8px 32px rgba(0,0,0,0.08)" }}
                >
                    <div className="text-gray-900 text-xl font-extrabold tracking-tight" style={{ fontFamily: "'Georgia', serif" }}>
                        AI Risk Score
                    </div>

                    <div className="relative w-44 h-44 flex items-center justify-center">
                        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 160 160">
                            <circle cx="80" cy="80" r={r} fill="none" stroke="#E2E8F0" strokeWidth="14" />
                            <circle
                                cx="80" cy="80" r={r} fill="none"
                                stroke={rc.bar} strokeWidth="14"
                                strokeDasharray={`${loading ? 0 : dash} ${circ}`}
                                strokeLinecap="round"
                                style={{ transition: "stroke-dasharray 1.2s ease" }}
                            />
                        </svg>
                        {loading ? (
                            <div className="flex flex-col items-center gap-2 z-10">
                                <Activity className="w-8 h-8 text-blue-600 animate-spin" />
                                <div className="text-sm text-gray-600 font-bold">Analysing…</div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center z-10">
                                <div className="text-5xl font-extrabold tracking-tighter" style={{ color: rc.text, fontFamily: "'Georgia', serif" }}>
                                    {riskPct}%
                                </div>
                                <div className="text-xs font-bold uppercase tracking-widest mt-1" style={{ color: rc.text }}>Risk Level</div>
                            </div>
                        )}
                    </div>

                    <div
                        className="text-lg font-extrabold px-6 py-2 rounded-2xl flex items-center shadow-sm"
                        style={{ background: rc.bar, color: "#fff", letterSpacing: "0.05em" }}
                    >
                        <AlertOctagon className="w-5 h-5 inline mr-2" /> {RISK.level}
                    </div>

                    <button
                        onClick={handleAnalyze}
                        disabled={loading}
                        className="mt-2 w-full py-4 rounded-2xl text-white text-lg font-extrabold tracking-wide transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center shadow-md bg-gradient-to-r from-sky-500 to-blue-700 hover:from-sky-400 hover:to-blue-600"
                    >
                        {loading ? (
                            <><Activity className="w-5 h-5 mr-2 animate-pulse" /> Calculating Risk…</>
                        ) : (
                            <><Search className="w-5 h-5 mr-2" /> Analyse Risk Again</>
                        )}
                    </button>
                </div>

                {/* Summary panel */}
                <div
                    className="rounded-3xl p-6 flex-1"
                    style={{ background: "#FFFFFF", border: "2px solid #E2E8F0", boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}
                >
                    <div className="text-gray-900 text-xl font-extrabold mb-4 tracking-tight flex items-center" style={{ fontFamily: "'Georgia', serif" }}>
                        <Lightbulb className="w-6 h-6 inline mr-2 text-yellow-500" /> What Does This Mean?
                    </div>
                    <div className="space-y-3">
                        {[
                            ["High Risk (70–100%)", "Needs immediate medical attention. Please call your doctor today.", RISK.color === "red", "bg-red-500", "border-red-500"],
                            ["Moderate Risk (40–69%)", "Keep a close watch. Follow your doctor's instructions carefully.", false, "bg-yellow-500", "border-yellow-500"],
                            ["Low Risk (0–39%)", "Things look stable. Keep taking medications as scheduled.", false, "bg-green-500", "border-green-500"],
                        ].map(([label, desc, active, dotColor, borderColor]) => (
                            <div
                                key={label}
                                className="rounded-2xl p-4 flex gap-3 transition-colors"
                                style={{
                                    background: active ? "#FEF2F2" : "#F8FAFC",
                                    border: active ? `2px solid #FCA5A5` : "2px solid #E2E8F0",
                                }}
                            >
                                <div className={`w-3 h-3 rounded-full shrink-0 mt-1.5 ${dotColor}`} />
                                <div>
                                    <div className="font-bold text-gray-900 text-sm tracking-wide">{label}</div>
                                    <div className="text-gray-600 text-sm mt-1 font-medium leading-relaxed">{desc}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Contributing factors */}
            <div
                className="rounded-3xl p-6"
                style={{ background: "#FFFFFF", border: "2px solid #E2E8F0", boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}
            >
                <div className="text-gray-900 text-xl font-extrabold mb-6 flex items-center tracking-tight" style={{ fontFamily: "'Georgia', serif" }}>
                    <Search className="w-6 h-6 inline mr-2 text-indigo-500" /> Why Is the Risk High? — Top Factors
                </div>
                <div className="space-y-6">
                    {RISK.factors.map((f, i) => {
                        const pct = Math.round(f.weight * 100);
                        const color = i === 0 ? "#DC2626" : i === 1 ? "#D97706" : i === 2 ? "#D97706" : "#3B82F6";
                        return (
                            <div key={f.label}>
                                <div className="flex items-center justify-between mb-2.5">
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center justify-center bg-slate-50 border border-slate-100 rounded-xl p-2 shadow-sm">
                                            {f.icon}
                                        </div>
                                        <span className="text-gray-800 font-bold text-sm tracking-wide">{f.label}</span>
                                    </div>
                                    <span className="text-sm font-extrabold bg-slate-50 px-2 py-1 rounded-md border border-slate-100" style={{ color }}>
                                        {pct}% impact
                                    </span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden shadow-inner">
                                    <div
                                        className="h-3 rounded-full transition-all duration-700"
                                        style={{
                                            width: `${barWidths[i]}%`,
                                            background: `linear-gradient(90deg,${color}99,${color})`,
                                            transitionDelay: `${i * 120}ms`,
                                        }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────
   SCREEN 3 — ALERTS
───────────────────────────────────────── */
function AlertsScreen() {
    const [animate, setAnimate] = useState(false);
    const [dismissed, setDismissed] = useState([]);
    useEffect(() => { setTimeout(() => setAnimate(true), 100); }, []);

    const visible = ALERTS.filter((a) => !dismissed.includes(a.id));

    return (
        <div className={`transition-all duration-500 ${animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
            {/* Header */}
            <div
                className="rounded-3xl p-6 mb-6 flex items-center justify-between"
                style={{
                    background: "linear-gradient(135deg,#7F1D1D,#991B1B)",
                    boxShadow: "0 8px 32px rgba(127,29,29,0.25)",
                }}
            >
                <div>
                    <div className="text-white text-2xl font-extrabold flex items-center tracking-tight" style={{ fontFamily: "'Georgia', serif" }}>
                        <Bell className="w-6 h-6 inline mr-2 text-white/90" /> Active Alerts
                    </div>
                    <div className="text-red-200 text-sm mt-1.5 font-medium tracking-wide">
                        {visible.length} alert{visible.length !== 1 ? "s" : ""} need your attention
                    </div>
                </div>
                <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl font-extrabold border outline-none"
                    style={{ background: "rgba(255,255,255,0.15)", color: "#fff", borderColor: "rgba(255,255,255,0.2)" }}
                >
                    {visible.length}
                </div>
            </div>

            {/* Alert cards */}
            <div className="space-y-4">
                {visible.length === 0 && (
                    <div
                        className="rounded-3xl p-10 flex flex-col items-center gap-3 animate-fade-in"
                        style={{ background: "#F0FDF4", border: "2px solid #86EFAC" }}
                    >
                        <CheckCircle className="w-16 h-16 text-green-500 mb-2 drop-shadow-sm" />
                        <div className="text-green-800 text-xl font-extrabold tracking-tight" style={{ fontFamily: "'Georgia', serif" }}>All Clear!</div>
                        <div className="text-green-600 text-sm font-medium">No active alerts right now. Well done!</div>
                    </div>
                )}

                {visible.map((alert, i) => {
                    const s = alertStyle[alert.type];
                    return (
                        <div
                            key={alert.id}
                            className="rounded-3xl p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg animate-fade-in-up"
                            style={{
                                background: s.bg,
                                borderLeft: `5px solid ${s.border}`,
                                border: `2px solid ${s.border}20`,
                                borderLeftWidth: "6px",
                                boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                                animationDelay: `${i * 80}ms`,
                            }}
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex items-start gap-4">
                                    <div
                                        className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm"
                                        style={{ background: `${s.border}18` }}
                                    >
                                        {alert.icon}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 flex-wrap mb-1">
                                            <span className="text-gray-900 text-lg font-extrabold tracking-tight">{alert.title}</span>
                                            <span
                                                className="text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-widest"
                                                style={{ background: `${s.border}18`, color: s.border }}
                                            >
                                                {alert.type}
                                            </span>
                                        </div>
                                        <div className="text-gray-700 text-sm font-medium mb-2 leading-relaxed">{alert.desc}</div>
                                        <div className="text-gray-500 text-xs font-bold mb-3 flex items-center">
                                            <Clock className="w-3.5 h-3.5 inline mr-1" /> {alert.time}
                                        </div>
                                        <div
                                            className="rounded-xl px-4 py-3 flex items-start gap-3 shadow-sm"
                                            style={{ background: `${s.border}10`, border: `1px solid ${s.border}30` }}
                                        >
                                            <Lightbulb className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: s.border }} />
                                            <span className="text-gray-800 font-medium text-sm leading-relaxed">
                                                <strong className="tracking-wide">Suggested Action:</strong> {alert.action}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setDismissed((d) => [...d, alert.id])}
                                    className="text-gray-300 hover:text-red-500 transition-colors flex-shrink-0 mt-1 p-1 bg-white rounded-lg shadow-sm border border-gray-100"
                                    title="Dismiss"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Emergency button */}
            <div className="mt-8">
                <button
                    className="w-full py-5 rounded-3xl text-white text-lg font-extrabold tracking-wide transition-all duration-200 hover:scale-[1.02] active:scale-95 flex items-center justify-center shadow-lg"
                    style={{
                        background: "linear-gradient(135deg,#DC2626,#991B1B)",
                        boxShadow: "0 6px 24px rgba(220,38,38,0.35)",
                    }}
                    onClick={() => alert("🚨 Emergency services have been notified.")}
                >
                    <AlertTriangle className="w-6 h-6 inline mr-2" /> CALL EMERGENCY HELP NOW
                </button>
                <p className="text-center text-gray-400 text-xs font-bold uppercase tracking-widest mt-3">
                    Press this button if you feel unsafe or unwell
                </p>
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────
   APP ROOT
───────────────────────────────────────── */
export default function App() {
    const [screen, setScreen] = useState("dashboard");
    const [userProfile, setUserProfile] = useState(null);
    const [isChatOpen, setIsChatOpen] = useState(false);

    if (!userProfile) {
        return <LoginScreen onLogin={(profile) => setUserProfile(profile)} />;
    }

    return (
        <div className="min-h-screen" style={{ background: "#F8FAFC", fontFamily: "'Lato', sans-serif" }}>
            {/* Google font */}
            <link
                rel="stylesheet"
                href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700;900&display=swap"
            />
            {/* Simple animation overrides for missing Tailwind classes */}
            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                .animate-fade-in-up { animation: fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
                .animate-fade-in { animation: fadeInUp 0.3s ease forwards; opacity: 0; }
                .animate-fade-in:nth-child(1) { animation-delay: 50ms; }
                .animate-fade-in:nth-child(2) { animation-delay: 100ms; }
                .animate-fade-in:nth-child(3) { animation-delay: 150ms; }
            `}} />

            <NavBar screen={screen} setScreen={setScreen} alerts={ALERTS.length} setIsChatOpen={setIsChatOpen} />

            <main className="max-w-5xl mx-auto px-4 pt-24 pb-12">
                {/* Screen title */}
                <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between border-b border-gray-200 pb-4">
                    <div>
                        <div className="text-sky-600 text-xs uppercase tracking-widest font-extrabold mb-1">
                            CareSync AI+ Platform
                        </div>
                        <h1 className="text-gray-900 text-3xl font-extrabold tracking-tight" style={{ fontFamily: "'Georgia', serif" }}>
                            {screen === "dashboard" && "Patient Dashboard"}
                            {screen === "risk" && "Risk Analysis"}
                            {screen === "alerts" && "Health Alerts"}
                        </h1>
                    </div>
                    <div className="text-gray-400 text-sm font-bold tracking-wide mt-2 sm:mt-0 flex items-center bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm">
                        <Clock className="w-4 h-4 mr-2 text-sky-500" />
                        {new Date().toLocaleDateString("en-GB", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                    </div>
                </div>

                {screen === "dashboard" && <DashboardScreen setScreen={setScreen} userProfile={userProfile} />}
                {screen === "risk" && <RiskScreen />}
                {screen === "alerts" && <AlertsScreen />}
            </main>

            {/* Footer */}
            <footer className="text-center text-gray-400 text-xs font-bold tracking-widest uppercase pb-6 opacity-70">
                CareSync AI+ · Predictive Geriatric Telecare System · For medical demo use only
            </footer>

            {isChatOpen && <ChatBotModal onClose={() => setIsChatOpen(false)} />}
        </div>
    );
}
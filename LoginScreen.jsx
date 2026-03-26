import React, { useState } from 'react';
import { Plus, Pill, X, ArrowRight } from 'lucide-react';

export default function LoginScreen({ onLogin }) {
    const [isLoginMode, setIsLoginMode] = useState(true);

    const [loginId, setLoginId] = useState("");
    const [loginPass, setLoginPass] = useState("");

    const [details, setDetails] = useState({
        name: "",
        age: "",
        dob: "",
        doctor: ""
    });
    const [medicines, setMedicines] = useState([]);
    const [newMed, setNewMed] = useState({ name: "", dosage: "", frequency: "" });

    const handleAddMed = () => {
        if (newMed.name) {
            setMedicines([...medicines, newMed]);
            setNewMed({ name: "", dosage: "", frequency: "" });
        }
    };

    const handleRemoveMed = (index) => {
        setMedicines(medicines.filter((_, i) => i !== index));
    };

    const handleLoginSubmit = (e) => {
        e.preventDefault();
        onLogin({
            name: "Margaret Thompson",
            age: 74,
            dob: "12 March 1951",
            doctor: "Dr. Alan Reeves",
            medicines: [
                { name: "Metoprolol", dosage: "25mg", frequency: "Daily" },
                { name: "Amlodipine", dosage: "5mg", frequency: "Daily" }
            ],
            id: loginId || "PT-00821",
            lastVisit: "18 Mar 2026"
        });
    };

    const handleSignupSubmit = (e) => {
        e.preventDefault();
        onLogin({
            ...details,
            medicines,
            id: `PT-${Math.floor(Math.random() * 90000) + 10000}`,
            lastVisit: "Today"
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4" style={{ background: "linear-gradient(135deg, #0F2942 0%, #1A3A5C 100%)", fontFamily: "'Lato', sans-serif" }}>
            <div className={`w-full ${isLoginMode ? 'max-w-md' : 'max-w-2xl'} bg-white rounded-3xl shadow-2xl overflow-hidden animate-fade-in-up transition-all duration-500`}>

                <div className="p-8 pb-6 border-b border-gray-100 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 transition-all tracking-tight" style={{ fontFamily: "'Georgia', serif" }}>
                            {isLoginMode ? "Welcome Back" : "Register"}
                        </h1>
                        <p className="text-gray-500 mt-1 transition-all text-sm font-medium">
                            {isLoginMode ? "Sign in to access your dashboard." : "Please enter your patient profile details."}
                        </p>
                    </div>
                    <div className="w-12 h-12 flex-shrink-0 rounded-xl flex items-center justify-center font-bold ml-4 shadow-sm border border-sky-400/30" style={{ background: "linear-gradient(135deg,#38BDF8,#0EA5E9)", color: "white" }}>
                        <Plus strokeWidth={3} className="w-6 h-6" />
                    </div>
                </div>

                <div className="p-8 max-h-[75vh] overflow-y-auto">
                    {isLoginMode ? (
                        <form onSubmit={handleLoginSubmit} className="space-y-6 animate-fade-in">
                            <div>
                                <label className="block text-sm font-semibold text-gray-600 mb-1">Patient ID or Email</label>
                                <input required type="text" value={loginId} onChange={e => setLoginId(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-400 focus:border-transparent outline-none transition-all text-gray-800" placeholder="Enter your ID or Email" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-600 mb-1">Password</label>
                                <input required type="password" value={loginPass} onChange={e => setLoginPass(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-400 focus:border-transparent outline-none transition-all text-gray-800" placeholder="Enter your password" />
                            </div>

                            <div className="pt-4 space-y-4">
                                <button type="submit" className="w-full py-4 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-xl font-extrabold text-lg shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2">
                                    Sign In <ArrowRight className="w-5 h-5" />
                                </button>

                                <p className="text-center text-gray-500 text-sm font-medium pt-2">
                                    New patient?{" "}
                                    <button type="button" onClick={() => setIsLoginMode(false)} className="text-sky-600 hover:text-sky-700 font-bold underline decoration-2 underline-offset-4 outline-none">
                                        Create an account
                                    </button>
                                </p>
                            </div>
                        </form>
                    ) : (
                        <form onSubmit={handleSignupSubmit} className="space-y-6 animate-fade-in">
                            <div>
                                <h2 className="text-lg font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2 flex items-center tracking-tight">Account & Personal Details</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-600 mb-1">Full Name</label>
                                        <input required type="text" value={details.name} onChange={e => setDetails({ ...details, name: e.target.value })} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-400 focus:border-transparent outline-none transition-all text-gray-800" placeholder="E.g., Margaret Thompson" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-600 mb-1">Age</label>
                                        <input required type="number" value={details.age} onChange={e => setDetails({ ...details, age: e.target.value })} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-400 focus:border-transparent outline-none transition-all text-gray-800" placeholder="E.g., 74" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-600 mb-1">Date of Birth</label>
                                        <input required type="text" value={details.dob} onChange={e => setDetails({ ...details, dob: e.target.value })} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-400 focus:border-transparent outline-none transition-all text-gray-800" placeholder="E.g., 12 March 1951" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-600 mb-1">Primary Doctor</label>
                                        <input type="text" value={details.doctor} onChange={e => setDetails({ ...details, doctor: e.target.value })} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-400 focus:border-transparent outline-none transition-all text-gray-800" placeholder="E.g., Dr. Alan Reeves" />
                                    </div>
                                    <div className="col-span-1 sm:col-span-2">
                                        <label className="block text-sm font-semibold text-gray-600 mb-1">Create Password</label>
                                        <input required type="password" minLength="6" className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-400 focus:border-transparent outline-none transition-all text-gray-800" placeholder="Choose a secure password" />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h2 className="text-lg font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2 tracking-tight">Prescription Medicines <span className="text-sm font-normal text-gray-400">(Optional)</span></h2>

                                <div className="space-y-3 mb-4">
                                    {medicines.map((m, i) => (
                                        <div key={i} className="flex items-center justify-between p-3 bg-sky-50 rounded-xl border border-sky-100/50">
                                            <div className="flex items-center">
                                                <Pill className="w-4 h-4 text-sky-500 mr-2" />
                                                <span className="font-bold text-gray-800 text-sm tracking-wide">{m.name}</span>
                                                <span className="text-sm text-gray-500 ml-2 font-medium">{m.dosage} • {m.frequency}</span>
                                            </div>
                                            <button type="button" onClick={() => handleRemoveMed(i)} className="text-gray-400 hover:text-red-500 transition-colors p-1 bg-white rounded-md shadow-sm border border-gray-100">
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                    {medicines.length === 0 && <p className="text-sm text-gray-400 italic">No medicines added yet.</p>}
                                </div>

                                <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-3">
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                        <input type="text" value={newMed.name} onChange={e => setNewMed({ ...newMed, name: e.target.value })} placeholder="Medicine Name" className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-400 outline-none text-gray-800" />
                                        <input type="text" value={newMed.dosage} onChange={e => setNewMed({ ...newMed, dosage: e.target.value })} placeholder="Dosage (e.g., 5mg)" className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-400 outline-none text-gray-800" />
                                        <input type="text" value={newMed.frequency} onChange={e => setNewMed({ ...newMed, frequency: e.target.value })} placeholder="Frequency (e.g., Twice daily)" className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-400 outline-none text-gray-800" />
                                    </div>
                                    <button type="button" onClick={handleAddMed} className="px-4 py-2 bg-sky-100 text-sky-700 hover:bg-sky-200 border border-sky-200 rounded-lg text-sm font-bold transition-all w-full sm:w-auto flex items-center justify-center gap-1">
                                        <Plus className="w-4 h-4" /> Add Medicine
                                    </button>
                                </div>
                            </div>

                            <div className="pt-4 space-y-4">
                                <button type="submit" className="w-full py-4 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-xl font-extrabold text-lg shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2">
                                    Complete Profile & Enter Dashboard <ArrowRight className="w-5 h-5" />
                                </button>

                                <p className="text-center text-gray-500 text-sm font-medium pt-2">
                                    Already have an account?{" "}
                                    <button type="button" onClick={() => setIsLoginMode(true)} className="text-sky-600 hover:text-sky-700 font-bold underline decoration-2 underline-offset-4 outline-none">
                                        Sign In
                                    </button>
                                </p>
                            </div>
                        </form>
                    )}
                </div>
            </div>
            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up { animation: fadeInUp 0.5s ease-out forwards; }
                .animate-fade-in { animation: fadeInUp 0.3s ease forwards; }
            `}} />
        </div>
    );
}

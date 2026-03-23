"use client";

import { useState } from "react";
import api from "@/lib/api";
import { AlertCircle, Loader2, ArrowLeft, CheckCircle2, Eye, EyeOff } from "lucide-react";
import "./forgot-password.css";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters long.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            await api.post("/auth/reset-password", { email, password });
            setSuccess(true);
            setTimeout(() => {
                router.push("/login");
            }, 3000);
        } catch (err: any) {
            console.error("Direct Reset Error:", err);
            setError(err.response?.data?.message || "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="forgot-password-container">
            <div className="card">
                <div className="form-container">
                    <div className="title">Reset Password</div>

                    {success ? (
                        <div className="success-content">
                            <div className="success-icon">
                                <CheckCircle2 className="w-16 h-16 text-emerald-500" />
                            </div>
                            <h3 className="success-title">Password Updated!</h3>
                            <p className="success-message">
                                Your password has been successfully reset. Redirecting to login...
                            </p>
                            <Link href="/login" className="back-to-login-btn">
                                Go to Login Now
                            </Link>
                        </div>
                    ) : (
                        <form className="form" onSubmit={handleSubmit}>
                            <p className="form-description">
                                Enter your email and new password to reset your account.
                            </p>

                            {error && (
                                <div className="error-message">
                                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                    {error}
                                </div>
                            )}

                            <div className="input-group">
                                <label className="label_input" htmlFor="email-input">Email Address</label>
                                <input
                                    spellCheck="false"
                                    className="input"
                                    type="email"
                                    name="email"
                                    id="email-input"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="email@example.com"
                                    required
                                />
                            </div>

                            <div className="input-group">
                                <label className="label_input" htmlFor="password">New Password</label>
                                <div className="password-wrapper">
                                    <input
                                        className="input"
                                        type={showPassword ? "text" : "password"}
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="toggle-visibility"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <div className="input-group">
                                <label className="label_input" htmlFor="confirm-password">Confirm Password</label>
                                <div className="password-wrapper">
                                    <input
                                        className="input"
                                        type={showConfirmPassword ? "text" : "password"}
                                        id="confirm-password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="••••••••"
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="toggle-visibility"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <button className="submit" type="submit" disabled={loading}>
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Updating...
                                    </span>
                                ) : (
                                    "Update Password"
                                )}
                            </button>

                            <Link href="/login" className="back-link">
                                <ArrowLeft className="w-4 h-4" />
                                Back to Login
                            </Link>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}

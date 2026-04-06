import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { motion } from "motion/react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "../components/BasicButton";
import { Card } from "../components/Card";
import { Input } from "../components/BasicInput";
import { Label } from "../components/LabelComponent";
import paths from "../routes/paths";
import { useAuth } from "../hooks/useAuth";
export default function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            await login(email, password);
            navigate(paths.home);
        } catch (err: any) {
            setError(err.response?.data ?? "Invalid email or password.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col flex-1 items-center justify-center py-4 px-4 bg-background text-text">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold text-text">Welcome back</h1>
                    <p className="text-sm text-muted mt-1">Log in to your account to continue</p>
                </div>

                <Card className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-5">

                        {error && (
                            <div className="p-3 rounded-lg bg-danger/10 border border-danger/20 text-danger text-sm">
                                {error}
                            </div>
                        )}

                        {/* Email */}
                        <div className="space-y-1.5">
                            <Label htmlFor="email">Email or Username</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                                <Input
                                    id="email"
                                    type="text"
                                    placeholder="your@email.com or username"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="pl-9"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Password</Label>
                                <Link to={paths.forgot_password} className="text-xs text-primary hover:underline">
                                    Forgot password?
                                </Link>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="px-9"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-text transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {/* Remember me */}
                        <label className="flex items-center gap-2 text-sm text-muted cursor-pointer select-none">
                            <input type="checkbox" className="rounded border-border accent-primary" />
                            <span>Remember me</span>
                        </label>

                        <motion.div
                            whileTap={{ scale: 0.98 }}
                            transition={{ type: "spring", stiffness: 400, damping: 17 }}
                        >
                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? "Logging in..." : "Log In"}
                            </Button>
                        </motion.div>
                    </form>

                    <div className="mt-6 pt-5 border-t border-border text-center text-sm">
                        <span className="text-muted">Don't have an account? </span>
                        <Link to={paths.signup} className="text-primary font-medium hover:underline">
                            Sign up
                        </Link>
                    </div>
                </Card>
            </motion.div>
        </div>
    );
}
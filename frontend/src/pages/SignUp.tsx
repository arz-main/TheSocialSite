import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { motion } from "motion/react";
import { Mail, Lock, User as UserIcon, Eye, EyeOff } from "lucide-react";
import { Button } from "../components/BasicButton";
import { Card } from "../components/Card";
import { Input } from "../components/BasicInput";
import { Label } from "../components/Label";
import paths from "../routes/paths";
import { useAuth } from "../hooks/useAuth";
export default function SignupPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const navigate = useNavigate();
    const { signup } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        setLoading(true);
        try {
            await signup(formData);
            navigate(paths.login);
        } catch (err: any) {
            setError(err.response?.data ?? "Could not create account. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="flex flex-1 items-center justify-center py-4 px-4 bg-background text-text">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold text-text">Create an account</h1>
                    <p className="text-sm text-muted mt-1">Join us and start creating today</p>
                </div>

                <Card className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-5">

                        {error && (
                            <div className="p-3 rounded-lg bg-danger/10 border border-danger/20 text-danger text-sm">
                                {error}
                            </div>
                        )}

                        {/* Username */}
                        <div className="space-y-1.5">
                            <Label htmlFor="username">Username</Label>
                            <div className="relative">
                                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                                <Input
                                    id="username" name="username" type="text"
                                    placeholder="artistname" value={formData.username}
                                    onChange={handleChange} className="pl-9" required
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div className="space-y-1.5">
                            <Label htmlFor="email">Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                                <Input
                                    id="email" name="email" type="email"
                                    placeholder="your@email.com" value={formData.email}
                                    onChange={handleChange} className="pl-9" required
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="space-y-1.5">
                            <Label htmlFor="password">Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                                <Input
                                    id="password" name="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••" value={formData.password}
                                    onChange={handleChange} className="px-9" required
                                />
                                <button
                                    type="button" onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-text transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div className="space-y-1.5">
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                                <Input
                                    id="confirmPassword" name="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="••••••••" value={formData.confirmPassword}
                                    onChange={handleChange} className="px-9" required
                                />
                                <button
                                    type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-text transition-colors"
                                >
                                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {/* Terms */}
                        <label htmlFor="terms" className="flex items-start gap-2 text-sm text-muted cursor-pointer select-none">
                            <input type="checkbox" id="terms" className="mt-0.5 rounded border-border accent-primary" required />
                            <span>
                                I agree to the{" "}
                                <Link to={paths.terms} className="text-primary hover:underline">Terms of Service</Link>
                                {" "}and{" "}
                                <Link to={paths.privacy} className="text-primary hover:underline">Privacy Policy</Link>
                            </span>
                        </label>

                        <motion.div
                            whileTap={{ scale: 0.98 }}
                            transition={{ type: "spring", stiffness: 400, damping: 17 }}
                        >
                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? "Creating account..." : "Create Account"}
                            </Button>
                        </motion.div>
                    </form>

                    <div className="mt-6 pt-5 border-t border-border text-center text-sm">
                        <span className="text-muted">Already have an account? </span>
                        <Link to={paths.login} className="text-primary font-medium hover:underline">Log in</Link>
                    </div>
                </Card>
            </motion.div>
        </div>
    );
}
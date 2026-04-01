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
                <div className="text-center mb-4">
                    <h1 className="text-2xl font-semibold mb-2">User Login</h1>
                </div>

                <Card className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-4">

                        {error && (
                            <div className="p-3 rounded-lg bg-destructive/10 text-danger text-sm">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="email">Email or Username</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" />
                                <Input
                                    id="email"
                                    type="text"
                                    placeholder="your@email.com or username"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="pl-10 bg-background"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" />
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="px-10 bg-background"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 hover:text-foreground transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 text-sm">
                                <input type="checkbox" className="rounded border-border" />
                                <span>Remember me</span>
                            </label>
                            <Link to={paths.forgot_password} className="text-sm text-primary hover:underline">
                                Forgot password?
                            </Link>
                        </div>

                        <motion.div
                            whileTap={{ scale: 0.98 }}
                            transition={{ type: "spring", stiffness: 400, damping: 17 }}
                        >
                            <Button type="submit" className="w-full h-11" disabled={loading}>
                                {loading ? "Logging in..." : "Log In"}
                            </Button>
                        </motion.div>
                    </form>

                    <div className="mt-6 text-center text-sm">
                        <span className="text-muted-foreground">Don't have an account? </span>
                        <Link to={paths.signup} className="text-primary hover:underline">
                            Sign up
                        </Link>
                    </div>
                </Card>
            </motion.div>
        </div>
    );
}
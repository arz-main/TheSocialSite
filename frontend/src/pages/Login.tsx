import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { motion } from "motion/react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "../components/ui/BasicButton";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/BasicInput";
import { Label } from "../components/ui/LabelComponent";
import { Role } from "../types/RolesTypes";
import paths from "../routes/paths";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useAuth } from "../hooks/useAuth";

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const [credential, setCredential] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    const { login } = useAuth();
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            // user is now set in context, read role from there
            const loggedInUser = await login(credential, password);
            switch (loggedInUser?.role) {
                case Role.Admin:
                    navigate(paths.admin.dashboard);
                    break;
                case Role.User:
                default:
                    navigate(paths.home);
                    break;
            }
        } catch (err) {
            console.log(err);
            setError("Invalid email or password");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col flex-1 items-center justify-center py-8 px-4 bg-background text-text">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-semibold mb-2">User Login</h1>
                    <p className="text-text-opaque">Enter your credentials</p>
                </div>

                <Card className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="email">Credential</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" />
                                <Input
                                    id="credential"
                                    type="text"
                                    placeholder="Email or username"
                                    value={credential}
                                    onChange={(e) => setCredential(e.target.value)}
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
                                    {showPassword ? (
                                        <EyeOff className="w-5 h-5" />
                                    ) : (
                                        <Eye className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <motion.p
                                initial={{ opacity: 0, y: -4 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-sm text-red-500"
                            >
                                {error}
                            </motion.p>
                        )}

                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 text-sm">
                                <input
                                    type="checkbox"
                                    className="rounded border-border text-primary focus:ring-primary"
                                />
                                <span>Remember me</span>
                            </label>
                            <Link
                                to={paths.forgot_password}
                                className="text-sm text-primary hover:underline"
                            >
                                Forgot password?
                            </Link>
                        </div>

                        <motion.div
                            whileTap={{ scale: 0.98 }}
                            transition={{ type: "spring", stiffness: 400, damping: 17 }}
                        >
                            <Button type="submit" className="w-full h-11" disabled={isLoading}>
                                {isLoading ? "Logging in..." : "Log In"}
                            </Button>
                        </motion.div>

                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-border"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="bg-card px-4">Or continue with</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <motion.div
                                whileTap={{ scale: 0.98 }}
                                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                            >
                                <Button variant="outline" className="w-full" type="button">
                                    <FcGoogle className="w-5 h-5 mr-2" />
                                    Google
                                </Button>
                            </motion.div>
                            <motion.div
                                whileTap={{ scale: 0.98 }}
                                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                            >
                                <Button variant="outline" className="w-full" type="button">
                                    <FaGithub className="w-5 h-5 mr-2" />
                                    GitHub
                                </Button>
                            </motion.div>
                        </div>
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
import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { motion } from "motion/react";
import { Mail, Lock, User as UserIcon, Eye, EyeOff } from "lucide-react";
import { Button } from "../components/ui/BasicButton";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/InputComponent";
import { Label } from "../components/ui/LabelComponent";
import Paths from "../routes/paths";
import { useUserService } from "../hooks/useUserService";

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
    const { signup } = useUserService();

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
            // Redirect to login after successful signup
            navigate(Paths.login);
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
        <div className="flex flex-1 items-center justify-center py-12 px-4 bg-background text-text">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-semibold mb-2">Sign Up</h1>
                    <p className="text-text-opaque">Enter your information</p>
                </div>

                <Card className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Error banner */}
                        {error && (
                            <div className="p-3 rounded-lg bg-destructive/10 text-danger text-sm">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="username">Username</Label>
                            <div className="relative">
                                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" />
                                <Input id="username" name="username" type="text"
                                    placeholder="artistname" value={formData.username}
                                    onChange={handleChange} className="pl-10 bg-background" required />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" />
                                <Input id="email" name="email" type="email"
                                    placeholder="your@email.com" value={formData.email}
                                    onChange={handleChange} className="pl-10 bg-background" required />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" />
                                <Input id="password" name="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••" value={formData.password}
                                    onChange={handleChange} className="px-10 bg-background" required />
                                <button type="button" onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 hover:text-foreground transition-colors">
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" />
                                <Input id="confirmPassword" name="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="••••••••" value={formData.confirmPassword}
                                    onChange={handleChange} className="px-10 bg-background" required />
                                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 hover:text-foreground transition-colors">
                                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-start gap-2">
                            <input type="checkbox" id="terms"
                                className="mt-1 rounded border-border" required />
                            <label htmlFor="terms" className="text-sm">
                                I agree to the{" "}
                                <Link to={Paths.terms} className="text-primary hover:underline">Terms of Service</Link>
                                {" "}and{" "}
                                <Link to={Paths.privacy} className="text-primary hover:underline">Privacy Policy</Link>
                            </label>
                        </div>

                        <motion.div whileTap={{ scale: 0.98 }}
                            transition={{ type: "spring", stiffness: 400, damping: 17 }}>
                            <Button type="submit" className="w-full h-11" disabled={loading}>
                                {loading ? "Creating account..." : "Create Account"}
                            </Button>
                        </motion.div>
                    </form>

                    <div className="mt-6 text-center text-sm">
                        <span>Already have an account? </span>
                        <Link to={Paths.login} className="text-primary hover:underline">Log in</Link>
                    </div>
                </Card>
            </motion.div>
        </div>
    );
}
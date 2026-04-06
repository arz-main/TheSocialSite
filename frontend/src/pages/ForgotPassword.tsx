import { motion } from "framer-motion";
import { Card } from "../components/Card";
import { Mail } from "lucide-react";
import { useState } from "react";
import { Label } from "../components/LabelComponent";
import { Button } from "../components/BasicButton";
import paths from "../routes/paths";
import { Input } from "../components/BasicInput";
import { useNavigate } from "react-router-dom";
export default function ForgotPassword() {
    const [email, setEmail] = useState<string>("");
    const [sent, setSent] = useState<boolean>(false);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        // TODO: POST /auth/forgot-password
        setSent(true);
    }

    const navigate = useNavigate();
    
    return (
        <section className="flex flex-1 bg-background py-8 px-4 justify-center text-text">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold text-text">Forgot Password</h1>
                    <p className="text-sm text-muted mt-1">
                        {sent ? "Check your inbox" : "Enter your email and we'll send you a reset link"}
                    </p>
                </div>

                <Card className="p-8">
                    {sent ? (
                        <div className="flex flex-col items-center gap-4 py-2 text-center">
                            <p className="text-sm text-muted">
                                A reset link has been sent to <span className="text-text font-medium">{email}</span>.
                            </p>
                            <p className="text-sm text-muted">Didn't receive it? Check your spam folder.</p>
                            <div className="pt-2 w-full border-t border-border">
                                <Button className="w-full" onClick={() => navigate(paths.home)}>
                                    Go to home page
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-1.5">
                                <Label htmlFor="email">Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="your@email.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="pl-9"
                                        required
                                    />
                                </div>
                            </div>
                            <motion.div
                                whileTap={{ scale: 0.98 }}
                                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                            >
                                <Button type="submit" className="w-full">
                                    Send Reset Link
                                </Button>
                            </motion.div>
                        </form>
                    )}
                </Card>
            </motion.div>
        </section>
    );
}
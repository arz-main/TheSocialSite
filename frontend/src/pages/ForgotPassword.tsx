import { motion } from "framer-motion";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/InputComponent";
import { Mail } from "lucide-react";
import { useState } from "react";
import { Label } from "../components/ui/LabelComponent";
import { Button } from "../components/ui/BasicButton";
import Paths from "../routes/paths";
import { LinkButton } from "../components/ui/LinkButton";

export default function ForgotPassword() {
    const [email, setEmail] = useState<string>("");
    const [sent, setSent] = useState<boolean>(false);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSent(true);
    };

    return (
        <section className="flex flex-1 bg-background py-8 px-4 justify-center text-text">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-semibold mb-2">Forgot Password</h1>
                    <p className="text-sm text-text-opaque">
                        Provide your email address
                    </p>
                </div>

                {sent == true ? (
                    <Card className="p-8 text-text">
                        <div className="flex space-y-2 flex-col justify-center items-center">
                            <p className="text-sm">
                                A reset link has been sent to your email address.
                            </p>
                            <p className="text-sm mt-4">
                                Visit the home page?
                            </p>
                        </div>
                        <LinkButton to={Paths.home} variant="default" className="text-center">
                            Go to home page
                        </LinkButton>
                    </Card>
                ) : (
                    <Card className="p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="your@email.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="pl-10 bg-background"
                                        required
                                    />
                                </div>
                            </div>
                            <motion.div
                                whileTap={{ scale: 0.98 }}
                                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                            >
                                <Button type="submit" variant="default" className="w-full h-11">
                                    Send Reset Token
                                </Button>
                            </motion.div>
                        </form>
                    </Card>
                )}
            </motion.div>
        </section>
    )
}
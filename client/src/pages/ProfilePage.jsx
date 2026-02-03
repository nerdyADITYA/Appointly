
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUser, useUpdateUser } from "../hooks/use-auth";
import { updateUserSchema } from "../../../shared/schema";
import { useToast } from "@/hooks/use-toast";
import { Navigation } from "@/components/Navigation";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Camera } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ProfilePage() {
    const { data: user, isLoading } = useUser();
    const updateUserMutation = useUpdateUser();
    const { toast } = useToast();
    const fileInputRef = React.useRef(null);
    const [isUploading, setIsUploading] = React.useState(false);

    const form = useForm({
        resolver: zodResolver(updateUserSchema),
        defaultValues: {
            name: user?.name || "",
            phone: user?.phone || "",
            avatarUrl: user?.avatarUrl || "",
            email: user?.email || "",
            password: ""
        },
        values: {
            name: user?.name || "",
            phone: user?.phone || "",
            avatarUrl: user?.avatarUrl || "",
            email: user?.email || "",
            password: ""
        }
    });

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        setIsUploading(true);
        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData
            });
            if (!res.ok) throw new Error("Upload failed");
            const data = await res.json();
            form.setValue("avatarUrl", data.url, { shouldDirty: true });
            toast({ title: "Image uploaded", description: "Don't forget to save changes!" });
        } catch (error) {
            toast({ variant: "destructive", title: "Upload failed", description: error.message });
        } finally {
            setIsUploading(false);
        }
    };

    const onSubmit = async (data) => {
        const updates = { ...data };
        if (!updates.password) delete updates.password; // Don't send empty password
        if (!updates.email) delete updates.email; // Don't send empty email
        if (!updates.phone) delete updates.phone;
        if (!updates.avatarUrl) delete updates.avatarUrl;

        try {
            await updateUserMutation.mutateAsync(updates);
            toast({
                title: "Profile Updated",
                description: "Your profile has been successfully updated."
            });
            form.reset({ ...data, password: "" }); // Clear password field
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Update Failed",
                description: error.message
            });
        }
    };

    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-muted/30">
            <Navigation />
            <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-enter">
                <div className="bg-white p-6 md:p-8 rounded-xl border border-border/60 shadow-sm relative">
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <h1 className="text-3xl font-display font-bold text-foreground">My Profile</h1>
                            <p className="text-muted-foreground mt-1">Manage your account settings.</p>
                        </div>

                        {/* Avatar Section */}
                        <div className="relative group">
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                            <Avatar className="h-20 w-20 cursor-pointer ring-2 ring-offset-2 ring-primary/10 transition-all group-hover:ring-primary/30" onClick={() => fileInputRef.current?.click()}>
                                <AvatarImage src={form.watch("avatarUrl")} className="object-cover" />
                                <AvatarFallback className="text-xl bg-primary/5 text-primary">
                                    {user.name.charAt(0).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div
                                className="absolute bottom-0 right-0 bg-primary text-primary-foreground p-1.5 rounded-full cursor-pointer shadow-sm hover:bg-primary/90 transition-colors"
                                onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                            >
                                {isUploading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Camera className="h-3 w-3" />}
                            </div>
                        </div>
                    </div>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                            {/* Username (Read Only) */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Username
                                </label>
                                <Input value={user.username} disabled className="bg-muted" />
                                <p className="text-[0.8rem] text-muted-foreground">Username cannot be changed.</p>
                            </div>

                            {/* Name */}
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Full Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="John Doe" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Email */}
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input placeholder="john@example.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Phone */}
                            <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Phone Number</FormLabel>
                                        <FormControl>
                                            <Input placeholder="1234567890" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* New Password */}
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>New Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="Leave blank to keep current password" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button
                                type="submit"
                                className="w-full"
                                disabled={updateUserMutation.isPending || isUploading}
                            >
                                {updateUserMutation.isPending ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    "Save Changes"
                                )}
                            </Button>
                        </form>
                    </Form>
                </div>
            </main>
        </div>
    );
}

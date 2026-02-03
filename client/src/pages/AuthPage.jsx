import React from "react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLogin, useRegister, useUser, useSendOtp } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { api } from "@shared/routes";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import anime from "animejs";
const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required")
});
const registerSchema = api.auth.register.input.extend({
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});
function AuthPage() {
  const [activeTab, setActiveTab] = useState("login");
  const [otpSent, setOtpSent] = useState(false);
  const { data: user, isLoading: isUserLoading } = useUser();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const sendOtpMutation = useSendOtp();
  useEffect(() => {
    anime({
      targets: ".auth-card",
      translateY: [20, 0],
      opacity: [0, 1],
      easing: "easeOutExpo",
      duration: 800,
      delay: 200
    });
  }, []);
  useEffect(() => {
    if (user) {
      setLocation(user.role === "admin" ? "/admin" : "/dashboard");
    }
  }, [user, setLocation]);
  const loginForm = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "", password: "" }
  });
  const registerForm = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { username: "", password: "", confirmPassword: "", name: "", role: "customer", email: "", otp: "", phone: "" }
  });
  async function onLogin(data) {
    try {
      await loginMutation.mutateAsync(data);
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in."
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error.message
      });
    }
  }
  async function onRegister(data) {
    try {
      const { confirmPassword, ...registerData } = data;
      await registerMutation.mutateAsync(registerData);
      toast({
        title: "Account created",
        description: "Please log in with your new credentials."
      });
      setActiveTab("login");
      loginForm.setValue("username", data.username);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: error.message
      });
    }
  }
  if (isUserLoading || user) {
    return /* @__PURE__ */ React.createElement("div", { className: "min-h-screen flex items-center justify-center bg-muted/30" }, /* @__PURE__ */ React.createElement(Loader2, { className: "h-8 w-8 animate-spin text-primary" }));
  }
  return /* @__PURE__ */ React.createElement("div", { className: "min-h-screen flex items-center justify-center bg-muted/30 p-4" }, /* @__PURE__ */ React.createElement("div", { className: "auth-card w-full max-w-md opacity-0" }, /* @__PURE__ */ React.createElement("div", { className: "mb-8 text-center space-y-2" }, /* @__PURE__ */ React.createElement("div", { className: "inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4" }, /* @__PURE__ */ React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: "w-6 h-6" }, /* @__PURE__ */ React.createElement("rect", { x: "3", y: "4", width: "18", height: "18", rx: "2", ry: "2" }), /* @__PURE__ */ React.createElement("line", { x1: "16", y1: "2", x2: "16", y2: "6" }), /* @__PURE__ */ React.createElement("line", { x1: "8", y1: "2", x2: "8", y2: "6" }), /* @__PURE__ */ React.createElement("line", { x1: "3", y1: "10", x2: "21", y2: "10" }))), /* @__PURE__ */ React.createElement("h1", { className: "font-display text-3xl font-bold tracking-tight" }, "Appointly"), /* @__PURE__ */ React.createElement("p", { className: "text-muted-foreground" }, "Book your appointments with ease and style.")), /* @__PURE__ */ React.createElement(Tabs, { value: activeTab, onValueChange: setActiveTab, className: "w-full" }, /* @__PURE__ */ React.createElement(TabsList, { className: "grid w-full grid-cols-2 mb-4" }, /* @__PURE__ */ React.createElement(TabsTrigger, { value: "login" }, "Login"), /* @__PURE__ */ React.createElement(TabsTrigger, { value: "register" }, "Register")), /* @__PURE__ */ React.createElement(TabsContent, { value: "login" }, /* @__PURE__ */ React.createElement(Card, { className: "border-border/50 shadow-xl" }, /* @__PURE__ */ React.createElement(CardHeader, null, /* @__PURE__ */ React.createElement(CardTitle, null, "Login"), /* @__PURE__ */ React.createElement(CardDescription, null, "Enter your credentials to access your account.")), /* @__PURE__ */ React.createElement(CardContent, null, /* @__PURE__ */ React.createElement(Form, { ...loginForm }, /* @__PURE__ */ React.createElement("form", { onSubmit: loginForm.handleSubmit(onLogin), className: "space-y-4" }, /* @__PURE__ */ React.createElement(
    FormField,
    {
      control: loginForm.control,
      name: "username",
      render: ({ field }) => /* @__PURE__ */ React.createElement(FormItem, null, /* @__PURE__ */ React.createElement(FormLabel, null, "Username"), /* @__PURE__ */ React.createElement(FormControl, null, /* @__PURE__ */ React.createElement(Input, { placeholder: "Enter your username", ...field })), /* @__PURE__ */ React.createElement(FormMessage, null))
    }
  ), /* @__PURE__ */ React.createElement(
    FormField,
    {
      control: loginForm.control,
      name: "password",
      render: ({ field }) => /* @__PURE__ */ React.createElement(FormItem, null, /* @__PURE__ */ React.createElement(FormLabel, null, "Password"), /* @__PURE__ */ React.createElement(FormControl, null, /* @__PURE__ */ React.createElement(Input, { type: "password", placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", ...field })), /* @__PURE__ */ React.createElement(FormMessage, null))
    }
  ), /* @__PURE__ */ React.createElement(Button, { type: "submit", className: "w-full", disabled: loginMutation.isPending }, loginMutation.isPending ? /* @__PURE__ */ React.createElement(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }) : null, "Sign In")))))), /* @__PURE__ */ React.createElement(TabsContent, { value: "register" }, /* @__PURE__ */ React.createElement(Card, { className: "border-border/50 shadow-xl" }, /* @__PURE__ */ React.createElement(CardHeader, null, /* @__PURE__ */ React.createElement(CardTitle, null, "Create Account"), /* @__PURE__ */ React.createElement(CardDescription, null, "Get started with Appointly today.")), /* @__PURE__ */ React.createElement(CardContent, null, /* @__PURE__ */ React.createElement(Form, { ...registerForm }, /* @__PURE__ */ React.createElement("form", { onSubmit: registerForm.handleSubmit(onRegister), className: "space-y-4" }, /* @__PURE__ */ React.createElement(
    FormField,
    {
      control: registerForm.control,
      name: "name",
      render: ({ field }) => /* @__PURE__ */ React.createElement(FormItem, null, /* @__PURE__ */ React.createElement(FormLabel, null, "Full Name"), /* @__PURE__ */ React.createElement(FormControl, null, /* @__PURE__ */ React.createElement(Input, { placeholder: "John Doe", ...field })), /* @__PURE__ */ React.createElement(FormMessage, null))
    }
  ), /* @__PURE__ */ React.createElement(
    FormField,
    {
      control: registerForm.control,
      name: "username",
      render: ({ field }) => /* @__PURE__ */ React.createElement(FormItem, null, /* @__PURE__ */ React.createElement(FormLabel, null, "Username"), /* @__PURE__ */ React.createElement(FormControl, null, /* @__PURE__ */ React.createElement(Input, { placeholder: "johndoe", ...field })), /* @__PURE__ */ React.createElement(FormMessage, null))
    }
  ),
  /* @__PURE__ */ React.createElement(
    FormField,
    {
      control: registerForm.control,
      name: "phone",
      render: ({ field }) => /* @__PURE__ */ React.createElement(FormItem, null, /* @__PURE__ */ React.createElement(FormLabel, null, "Phone Number"), /* @__PURE__ */ React.createElement(FormControl, null, /* @__PURE__ */ React.createElement(Input, { placeholder: "1234567890", ...field })), /* @__PURE__ */ React.createElement(FormMessage, null))
    }
  ),
  /* @__PURE__ */ React.createElement(
    FormField,
    {
      control: registerForm.control,
      name: "email",
      render: ({ field }) => /* @__PURE__ */ React.createElement(FormItem, null, /* @__PURE__ */ React.createElement(FormLabel, null, "Email"), /* @__PURE__ */ React.createElement(FormControl, null, /* @__PURE__ */ React.createElement("div", { className: "flex gap-2" }, /* @__PURE__ */ React.createElement(Input, { placeholder: "john@example.com", ...field }), /* @__PURE__ */ React.createElement(Button, {
        type: "button",
        variant: "secondary",
        disabled: !field.value || sendOtpMutation.isPending || otpSent,
        onClick: async () => {
          try {
            await sendOtpMutation.mutateAsync(field.value);
            setOtpSent(true);
            toast({ title: "OTP Sent", description: "Check your email for the code." });
          } catch (err) {
            toast({ variant: "destructive", title: "Failed to send OTP", description: err.message });
          }
        }
      }, sendOtpMutation.isPending ? /* @__PURE__ */ React.createElement(Loader2, { className: "h-4 w-4 animate-spin" }) : (otpSent ? "Sent" : "Send OTP")))), /* @__PURE__ */ React.createElement(FormMessage, null))
    }
  ), /* @__PURE__ */ React.createElement(
    FormField,
    {
      control: registerForm.control,
      name: "otp",
      render: ({ field }) => /* @__PURE__ */ React.createElement(FormItem, null, /* @__PURE__ */ React.createElement(FormLabel, null, "OTP Code"), /* @__PURE__ */ React.createElement(FormControl, null, /* @__PURE__ */ React.createElement(Input, { placeholder: "123456", maxLength: 6, ...field, disabled: !otpSent })), /* @__PURE__ */ React.createElement(FormMessage, null))
    }
  ), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-2 gap-4" }, /* @__PURE__ */ React.createElement(
    FormField,
    {
      control: registerForm.control,
      name: "password",
      render: ({ field }) => /* @__PURE__ */ React.createElement(FormItem, null, /* @__PURE__ */ React.createElement(FormLabel, null, "Password"), /* @__PURE__ */ React.createElement(FormControl, null, /* @__PURE__ */ React.createElement(Input, { type: "password", ...field })), /* @__PURE__ */ React.createElement(FormMessage, null))
    }
  ), /* @__PURE__ */ React.createElement(
    FormField,
    {
      control: registerForm.control,
      name: "confirmPassword",
      render: ({ field }) => /* @__PURE__ */ React.createElement(FormItem, null, /* @__PURE__ */ React.createElement(FormLabel, null, "Confirm"), /* @__PURE__ */ React.createElement(FormControl, null, /* @__PURE__ */ React.createElement(Input, { type: "password", ...field })), /* @__PURE__ */ React.createElement(FormMessage, null))
    }
  )), /* @__PURE__ */ React.createElement(Button, { type: "submit", className: "w-full", disabled: registerMutation.isPending || !otpSent }, registerMutation.isPending ? /* @__PURE__ */ React.createElement(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }) : null, "Create Account")))))))));
}
export {
  AuthPage as default
};

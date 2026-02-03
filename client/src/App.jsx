import React from "react";
import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/AuthPage";
import CustomerDashboard from "@/pages/CustomerDashboard";
import MyBookings from "@/pages/MyBookings";
import AdminDashboard from "@/pages/AdminDashboard";
import ManageSlots from "@/pages/ManageSlots";
import ProfilePage from "@/pages/ProfilePage";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useUser } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
function RootRedirect() {
  const { data: user, isLoading } = useUser();
  if (isLoading) {
    return /* @__PURE__ */ React.createElement("div", { className: "min-h-screen flex items-center justify-center bg-background" }, /* @__PURE__ */ React.createElement(Loader2, { className: "h-8 w-8 animate-spin text-primary" }));
  }
  if (!user) return /* @__PURE__ */ React.createElement(Redirect, { to: "/login" });
  if (user.role === "admin") return /* @__PURE__ */ React.createElement(Redirect, { to: "/admin" });
  return /* @__PURE__ */ React.createElement(Redirect, { to: "/dashboard" });
}
function Router() {
  return /* @__PURE__ */ React.createElement(Switch, null, /* @__PURE__ */ React.createElement(Route, { path: "/", component: RootRedirect }), /* @__PURE__ */ React.createElement(Route, { path: "/login", component: AuthPage }), /* @__PURE__ */ React.createElement(ProtectedRoute, { path: "/dashboard", component: CustomerDashboard, roles: ["customer"] }), /* @__PURE__ */ React.createElement(ProtectedRoute, { path: "/my-bookings", component: MyBookings, roles: ["customer"] }), /* @__PURE__ */ React.createElement(ProtectedRoute, { path: "/admin", component: AdminDashboard, roles: ["admin"] }), /* @__PURE__ */ React.createElement(ProtectedRoute, { path: "/admin/slots", component: ManageSlots, roles: ["admin"] }), /* @__PURE__ */ React.createElement(ProtectedRoute, { path: "/profile", component: ProfilePage }), /* @__PURE__ */ React.createElement(Route, { component: NotFound }));
}
function App() {
  return /* @__PURE__ */ React.createElement(QueryClientProvider, { client: queryClient }, /* @__PURE__ */ React.createElement(TooltipProvider, null, /* @__PURE__ */ React.createElement(Router, null), /* @__PURE__ */ React.createElement(Toaster, null)));
}
var stdin_default = App;
export {
  stdin_default as default
};

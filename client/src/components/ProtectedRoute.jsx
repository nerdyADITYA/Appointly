import React from "react";
import { useUser } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { Redirect, Route } from "wouter";
function ProtectedRoute({ path, component: Component, roles }) {
  const { data: user, isLoading } = useUser();
  if (isLoading) {
    return /* @__PURE__ */ React.createElement("div", { className: "min-h-screen flex items-center justify-center bg-background" }, /* @__PURE__ */ React.createElement(Loader2, { className: "h-8 w-8 animate-spin text-primary" }));
  }
  if (!user) {
    return /* @__PURE__ */ React.createElement(Route, { path, component: () => /* @__PURE__ */ React.createElement(Redirect, { to: "/login" }) });
  }
  if (roles && !roles.includes(user.role)) {
    return /* @__PURE__ */ React.createElement(Route, { path, component: () => /* @__PURE__ */ React.createElement(Redirect, { to: user.role === "admin" ? "/admin" : "/dashboard" }) });
  }
  return /* @__PURE__ */ React.createElement(Route, { path, component: Component });
}
export {
  ProtectedRoute
};

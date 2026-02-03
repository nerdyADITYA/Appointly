import React from "react";
import { Link, useLocation } from "wouter";
import { useUser, useLogout } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, LogOut, User } from "lucide-react";

export function Navigation() {
  const { data: user } = useUser();
  const { mutate: logout } = useLogout();
  const [location] = useLocation();

  if (!user) return null;

  return (
    <nav className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link href={user.role === "admin" ? "/admin" : "/dashboard"}>
              <a className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <span className="font-display font-bold text-xl tracking-tight">
                  Appointly
                </span>
              </a>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6 mr-4">
              {user.role === "customer" && (
                <>
                  <Link href="/dashboard">
                    <a
                      className={`text-sm font-medium transition-colors hover:text-primary ${location === "/dashboard"
                          ? "text-primary"
                          : "text-muted-foreground"
                        }`}
                    >
                      Book Appointment
                    </a>
                  </Link>
                  <Link href="/my-bookings">
                    <a
                      className={`text-sm font-medium transition-colors hover:text-primary ${location === "/my-bookings"
                          ? "text-primary"
                          : "text-muted-foreground"
                        }`}
                    >
                      My Bookings
                    </a>
                  </Link>
                </>
              )}
              {user.role === "admin" && (
                <>
                  <Link href="/admin">
                    <a
                      className={`text-sm font-medium transition-colors hover:text-primary ${location === "/admin"
                          ? "text-primary"
                          : "text-muted-foreground"
                        }`}
                    >
                      Dashboard
                    </a>
                  </Link>
                  <Link href="/admin/slots">
                    <a
                      className={`text-sm font-medium transition-colors hover:text-primary ${location === "/admin/slots"
                          ? "text-primary"
                          : "text-muted-foreground"
                        }`}
                    >
                      Manage Slots
                    </a>
                  </Link>
                </>
              )}
            </div>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-9 w-9 rounded-full ring-1 ring-border overflow-hidden p-0"
                >
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={user.avatarUrl} className="object-cover" />
                    <AvatarFallback className="bg-primary/5 text-primary">
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{user.name}</p>
                    <p className="w-[200px] truncate text-xs text-muted-foreground">
                      {user.username}
                    </p>
                  </div>
                </div>
                <Link href="/profile">
                  <DropdownMenuItem className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuItem
                  onClick={() => logout()}
                  className="text-red-600 focus:text-red-600 cursor-pointer"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
}

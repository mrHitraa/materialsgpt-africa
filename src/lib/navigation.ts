import {
  LayoutDashboard,
  BookOpen,
  FlaskConical,
  LineChart,
  GitCompareArrows,
  ClipboardList,
  Settings,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  to: "/" | "/literature" | "/materials" | "/predictions" | "/validation" | "/test-plans" | "/settings";
  label: string;
  icon: LucideIcon;
};

export const navItems: NavItem[] = [
  { to: "/", label: "Overview", icon: LayoutDashboard },
  { to: "/literature", label: "Literature", icon: BookOpen },
  { to: "/materials", label: "Materials", icon: FlaskConical },
  { to: "/predictions", label: "Predictions", icon: LineChart },
  { to: "/validation", label: "Validation", icon: GitCompareArrows },
  { to: "/test-plans", label: "Test Plans", icon: ClipboardList },
  { to: "/settings", label: "Settings", icon: Settings },
];

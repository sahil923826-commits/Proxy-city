import { createFileRoute } from "@tanstack/react-router";
import { Settings } from "lucide-react";
import { EmptyPage } from "@/components/EmptyPage";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Account Settings — ProxyCity" },
      { name: "description", content: "Manage your profile and preferences." },
      { property: "og:title", content: "Account Settings — ProxyCity" },
      { property: "og:description", content: "Manage your profile and preferences." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => <EmptyPage title="Account Settings" subtitle="Manage your profile and preferences." icon={Settings} message="Account settings will be available once sign-in is enabled for ProxyCity." />,
});

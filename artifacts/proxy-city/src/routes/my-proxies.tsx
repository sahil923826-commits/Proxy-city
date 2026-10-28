import { createFileRoute } from "@tanstack/react-router";
import { Server } from "lucide-react";
import { EmptyPage } from "@/components/EmptyPage";

export const Route = createFileRoute("/my-proxies")({
  head: () => ({
    meta: [
      { title: "My Proxies — ProxyCity" },
      { name: "description", content: "View and manage your active proxy plans." },
      { property: "og:title", content: "My Proxies — ProxyCity" },
      { property: "og:description", content: "View and manage your active proxy plans." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => <EmptyPage title="My Proxies" subtitle="View and manage your active proxy plans." icon={Server} message="No proxy plans yet. Plans will appear here once a proxy provider is connected and an order is paid." />,
});

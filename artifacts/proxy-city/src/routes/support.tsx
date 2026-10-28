import { createFileRoute } from "@tanstack/react-router";
import { LifeBuoy } from "lucide-react";
import { EmptyPage } from "@/components/EmptyPage";

export const Route = createFileRoute("/support")({
  head: () => ({
    meta: [
      { title: "Support — ProxyCity" },
      { name: "description", content: "Get help with your proxies and orders." },
      { property: "og:title", content: "Support — ProxyCity" },
      { property: "og:description", content: "Get help with your proxies and orders." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => <EmptyPage title="Support" subtitle="Get help with your proxies and orders." icon={LifeBuoy} message="Support tickets aren't connected yet. For now, reach us at support@proxycity.example." />,
});

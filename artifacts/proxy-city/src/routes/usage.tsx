import { createFileRoute } from "@tanstack/react-router";
import { BarChart3 } from "lucide-react";
import { EmptyPage } from "@/components/EmptyPage";

export const Route = createFileRoute("/usage")({
  head: () => ({
    meta: [
      { title: "Usage & Analytics — ProxyCity" },
      { name: "description", content: "Track bandwidth consumption over time." },
      { property: "og:title", content: "Usage & Analytics — ProxyCity" },
      { property: "og:description", content: "Track bandwidth consumption over time." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => <EmptyPage title="Usage & Analytics" subtitle="Track bandwidth consumption over time." icon={BarChart3} message="Usage analytics will appear here once a proxy provider is connected and reporting traffic." />,
});

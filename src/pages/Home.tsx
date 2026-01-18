import React from "react";
import FeatureCard from "@/components/FeatureCard";
import ToggleButton from "@/components/ToggleButton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <section className="text-center py-8">
        <h1 className="text-4xl font-bold text-sky-700">Welcome, Developer!</h1>
        <p className="text-slate-600 mt-2">A small customized boilerplate demo.</p>
        <div className="mt-4 flex items-center justify-center gap-3">
          <Badge>Custom</Badge>
          <Button>Example Button</Button>
          <ToggleButton />
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FeatureCard title="Routing" description="Multi-page layout with React Router." />
        <FeatureCard title="State" description="Interactive components using useState." />
        <FeatureCard title="Styling" description="Tailwind classes and shadcn components." />
      </section>
    </div>
  );
}

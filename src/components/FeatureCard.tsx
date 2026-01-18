import React from "react";

type FeatureCardProps = {
  title: string;
  description: string;
};

export default function FeatureCard({ title, description }: FeatureCardProps) {
  return (
    <div className="border rounded-lg p-4 shadow-sm bg-white/70">
      <h3 className="text-lg font-semibold text-sky-700">{title}</h3>
      <p className="text-sm text-slate-600 mt-2">{description}</p>
    </div>
  );
}

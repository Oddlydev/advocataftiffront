import React, { useState } from "react";

import AIButton from "@/src/components/ai-component/AIButton";
import DetailCard from "@/src/components/ai-component/DetailCard";
import KeyInsightsCard from "@/src/components/ai-component/KeyInsightsCard";
import ListBulletItem from "@/src/components/ai-component/ListBulletItem";
import ListNumberedItem from "@/src/components/ai-component/ListNumberedItem";
import MethodologyCard from "@/src/components/ai-component/MethodologyCard";
import SuggestedActionCard from "@/src/components/ai-component/SuggestedActionCard";
import TakeawaysCard from "@/src/components/ai-component/TakeawaysCard";
import TitleCard from "@/src/components/ai-component/TitleCard";
import InsightsDisclaimerCard from "@/src/components/ai-component/InsightsDisclaimerCard";
import KeyInsightsIcon from "@/src/components/ai-component/KeyInsightsIcon";

type PanelKey = "takeaways" | "methodology";

export default function ComponentsPage() {
  const [visiblePanel, setVisiblePanel] = useState<PanelKey | null>(null);

  const handlePanelSelect = (panel: PanelKey) => {
    setVisiblePanel(panel);
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f4f4fb] p-6">
      <section className="w-full max-w-5/6 space-y-6 rounded-[32px] bg-white/80 py-12 px-10 shadow-[0_35px_80px_-30px_rgba(0,0,0,0.45)]">
        <header className="flex flex-col gap-1 text-slate-700">
          <h1 className="text-3xl font-semibold">Components</h1>
        </header>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-3xl border-2 border-dashed border-violet-300/70 p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-500">
                AI Button
              </p>
            </div>
            <div className="mt-6 flex justify-center">
              <AIButton />
            </div>
          </div>

          <div className="rounded-3xl border-2 border-dashed border-violet-300/70 p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-500">
                Title Card
              </p>
            </div>
            <div className="mt-6 flex justify-center">
              <TitleCard />
            </div>
          </div>

          <div className="rounded-3xl border-2 border-dashed border-violet-300/70 p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-500">
                Key Insights Card
              </p>
            </div>
            <div className="mt-6 flex justify-center">
              <KeyInsightsCard />
            </div>
          </div>

          <div className="rounded-3xl border-2 border-dashed border-violet-300/70 p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-500">
                Key Insights Icon
              </p>
            </div>
            <div className="mt-6 flex justify-center">
              <KeyInsightsIcon />
            </div>
          </div>

          <div className="rounded-3xl border-2 border-dashed border-violet-300/70 p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-500">
                AI Disclaimer Card
              </p>
            </div>
            <div className="mt-6 flex justify-center">
              <InsightsDisclaimerCard />
            </div>
          </div>

          <div className="rounded-3xl border-2 border-dashed border-violet-300/70 p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-500">
                Detail Card
              </p>
            </div>
            <div className="mt-6 flex justify-center">
              <DetailCard
                activePanel={visiblePanel}
                onPanelSelect={handlePanelSelect}
              />
            </div>
          </div>

          <div className="rounded-3xl border-2 border-dashed border-violet-300/70 p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-500">
                Suggested Action
              </p>
            </div>
            <div className="mt-6 flex justify-center">
              <SuggestedActionCard />
            </div>
          </div>

          <div className="rounded-3xl border-2 border-dashed border-violet-300/70 p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-500">
                List Items
              </p>
            </div>
            <div className="mt-6 flex flex-col items-center gap-4">
              <ListBulletItem text="Average annual growth: Food (5.8%), Housing (4.2%), Alcohol & Tobacco (12.3%)" />
              <ListNumberedItem
                number={1}
                text="Average annual growth: Food (5.8%), Housing (4.2%), Alcohol & Tobacco (12.3%)"
              />
            </div>
          </div>

          <div
            id="takeaways-panel"
            className="rounded-3xl border-2 border-dashed border-violet-300/70 p-6"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-500">
                Takeaways Panel
              </p>
            </div>
            <div className="mt-6 flex justify-center">
              <TakeawaysCard autoOpen={visiblePanel === "takeaways"} />
            </div>
          </div>

          <div
            id="methodology-panel"
            className="rounded-3xl border-2 border-dashed border-violet-300/70 p-6"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-500">
                Methodology Panel
              </p>
            </div>
            <div className="mt-6 flex justify-center">
              <MethodologyCard autoOpen={visiblePanel === "methodology"} />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

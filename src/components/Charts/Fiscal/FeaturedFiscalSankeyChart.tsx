"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import * as d3 from "d3";
import { sankey as d3Sankey, sankeyLinkHorizontal } from "d3-sankey";

const ITEM_FIELD = "Item";
const LABEL_FIELD = "Item label for the Sankey diagram";
const UNIT_FIELD = "Unit of measurement";
const ROOT_KEY = "__ROOT__";
const COLOR_PALETTE = [
  "#4B0619",
  "#A90E38",
  "#7A0A28",
  "#F16087",
  "#F58FAA",
  "#ED3A6A",
  "var(--brand-1-500)",
  "#1C0209",
  "#7A0A28",
  "#A90E38",
];
const YEAR_COLUMN_REGEX = /^\d{4}$/;

interface SankeyNodeDatum {
  name: string;
  key: string;
  rawValue: number;
  unit: string;
  x0?: number;
  x1?: number;
  y0?: number;
  y1?: number;
}

interface SankeyLinkDatum {
  source: number | SankeyNodeDatum;
  target: number | SankeyNodeDatum;
  value: number;
  width?: number;
}

interface SankeyChartData {
  nodes: SankeyNodeDatum[];
  links: SankeyLinkDatum[];
  unit: string;
}

interface BuildSankeyParams {
  rows: Array<Record<string, string>>;
  year: string;
  rootLabel: string;
}

function extractCode(value: string): string | null {
  const match = value.match(/^(\d+(?:\.\d+)*)/);
  if (!match) {
    return null;
  }
  return match[1].replace(/\.$/, "");
}

function getParentCode(value: string): string | null {
  const segments = value.split(".");
  if (segments.length <= 1) {
    return null;
  }
  segments.pop();
  return segments.join(".");
}

function parseNumeric(raw?: string | null): number | null {
  if (typeof raw !== "string") {
    return null;
  }
  const cleaned = raw.replace(/,/g, "").trim();
  if (!cleaned || cleaned === "-" || cleaned.toLowerCase() === "na") {
    return null;
  }
  const value = Number(cleaned);
  return Number.isFinite(value) ? value : null;
}

function formatNumber(value: number): string {
  if (!Number.isFinite(value)) {
    return "";
  }
  const abs = Math.abs(value);
  const maximumFractionDigits = abs >= 100 ? 0 : abs >= 10 ? 1 : 2;
  return value.toLocaleString("en-US", {
    maximumFractionDigits,
  });
}

function buildSankeyData({
  rows,
  year,
  rootLabel,
}: BuildSankeyParams): SankeyChartData | null {
  if (!year) {
    return null;
  }

  const nodes: SankeyNodeDatum[] = [];
  const links: SankeyLinkDatum[] = [];
  const nodeIndex = new Map<string, number>();
  const nodeValues = new Map<number, number>();
  const codeToLabel = new Map<string, string>();

  const datasetUnit =
    rows
      .map((row) => row[UNIT_FIELD])
      .find((value) => typeof value === "string" && value.trim().length > 0)
      ?.trim() ?? "";

  const ensureNode = (key: string, name: string): number => {
    const existing = nodeIndex.get(key);
    if (existing !== undefined) {
      if (name && nodes[existing].name !== name) {
        nodes[existing].name = name;
      }
      return existing;
    }
    nodes.push({ name, key, rawValue: 0, unit: datasetUnit });
    const index = nodes.length - 1;
    nodeIndex.set(key, index);
    return index;
  };

  const rootIndex = ensureNode(ROOT_KEY, rootLabel || "Government Fiscal");

  rows.forEach((row, idx) => {
    const rawItem = (row[ITEM_FIELD] ?? "").trim();
    const labelCandidate = (row[LABEL_FIELD] ?? "").trim();
    const label = labelCandidate || rawItem || `Item ${idx + 1}`;

    if (rawItem) {
      const code = extractCode(rawItem);
      if (code) {
        codeToLabel.set(code, label);
      }
    }

    const value = parseNumeric(row[year]);
    if (value === null || Number.isNaN(value) || value <= 0) {
      if (label.toLowerCase() === "total" && value && value > 0) {
        nodeValues.set(rootIndex, value);
      }
      return;
    }

    const code = extractCode(rawItem);
    if (!code) {
      if (label.toLowerCase() === "total") {
        nodeValues.set(rootIndex, value);
      }
      return;
    }

    const nodeKey = `node-${code}`;
    const nodeIdx = ensureNode(nodeKey, label);
    nodeValues.set(nodeIdx, value);

    const parentCode = getParentCode(code);
    const parentKey = parentCode ? `node-${parentCode}` : ROOT_KEY;
    const parentLabel = parentCode
      ? (codeToLabel.get(parentCode) ?? parentCode)
      : rootLabel;
    const parentIdx = ensureNode(parentKey, parentLabel);

    if (parentIdx === rootIndex) {
      const currentRootTotal = nodeValues.get(rootIndex) ?? 0;
      nodeValues.set(rootIndex, currentRootTotal + value);
    }

    links.push({ source: parentIdx, target: nodeIdx, value });
  });

  if (links.length === 0) {
    return null;
  }

  if (!nodeValues.has(rootIndex)) {
    const totalFromTopLevel = links
      .filter((link) => link.source === rootIndex)
      .reduce((sum, link) => sum + link.value, 0);
    nodeValues.set(rootIndex, totalFromTopLevel);
  }

  nodes.forEach((node, idx) => {
    node.rawValue = nodeValues.get(idx) ?? 0;
    node.unit = datasetUnit;
  });

  return {
    nodes,
    links,
    unit: datasetUnit,
  };
}

interface FeaturedFiscalSankeyChartProps {
  datasetUrl?: string | null;
  rootLabel?: string;
  className?: string;
}

type LoadState = "idle" | "loading" | "ready" | "error" | "empty" | "missing";

export default function FeaturedFiscalSankeyChart({
  datasetUrl,
  rootLabel = "Government Fiscal",
  className = "",
}: FeaturedFiscalSankeyChartProps) {
  const sankeyRef = useRef<SVGSVGElement | null>(null);
  const [chartData, setChartData] = useState<SankeyChartData | null>(null);
  const [status, setStatus] = useState<LoadState>("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [year, setYear] = useState<string>("");

  useEffect(() => {
    if (!datasetUrl) {
      setStatus("missing");
      setChartData(null);
      setMessage("Dataset not available.");
      setYear("");
      return;
    }

    let cancelled = false;
    const load = async () => {
      setStatus("loading");
      setMessage(null);
      try {
        const targetUrl = datasetUrl.startsWith("http")
          ? `/api/proxy-dataset?url=${encodeURIComponent(datasetUrl)}`
          : datasetUrl;
        const response = await fetch(targetUrl, { cache: "no-store" });
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }
        const text = await response.text();
        if (cancelled) {
          return;
        }

        const normalized = text.replace(/\uFEFF/g, "").replace(/\r/g, "");
        const parsed = d3.csvParse(normalized);
        const columns = (parsed.columns ?? []).map((col) => col.trim());
        const yearColumns = columns
          .filter((col) => YEAR_COLUMN_REGEX.test(col))
          .sort((a, b) => Number(b) - Number(a));

        if (yearColumns.length === 0) {
          setStatus("empty");
          setChartData(null);
          setMessage("No yearly data found in this dataset.");
          setYear("");
          return;
        }

        const rows = parsed.map((row) => {
          const entry: Record<string, string> = {};
          Object.entries(row).forEach(([key, value]) => {
            if (!key) {
              return;
            }
            entry[key.trim()] =
              typeof value === "string" ? value.trim() : (value ?? "");
          });
          return entry;
        });

        const selectedYear = yearColumns[0];
        const chart = buildSankeyData({
          rows,
          year: selectedYear,
          rootLabel,
        });

        if (!chart) {
          setStatus("empty");
          setChartData(null);
          setMessage("No data available for the latest year.");
          setYear(selectedYear);
          return;
        }

        setChartData(chart);
        setStatus("ready");
        setMessage(null);
        setYear(selectedYear);
      } catch (error) {
        console.error(error);
        if (!cancelled) {
          setStatus("error");
          setChartData(null);
          setMessage("Unable to load fiscal data.");
          setYear("");
        }
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [datasetUrl, rootLabel]);

  useEffect(() => {
    if (!chartData || !sankeyRef.current || typeof window === "undefined") {
      return;
    }

    const svg = d3.select(sankeyRef.current);

    const renderChart = () => {
      const container = sankeyRef.current?.parentElement;
      if (!container) {
        return;
      }

      const width = container.clientWidth || 0;
      const height = container.clientHeight || 0;

      const isMobile = window.innerWidth < 640;
      const isTablet = window.innerWidth >= 640 && window.innerWidth < 1024;

      const margin = {
        top: 24,
        right: isMobile ? 140 : isTablet ? 180 : 240,
        bottom: 16,
        left: 16,
      };

      svg.selectAll("*").remove();

      const sankeyGenerator = d3Sankey<SankeyNodeDatum, SankeyLinkDatum>()
        .nodeWidth(32)
        .nodePadding(20)
        .extent([
          [margin.left, margin.top],
          [
            Math.max(width - margin.right, margin.left + 1),
            Math.max(height - margin.bottom, margin.top + 1),
          ],
        ]);

      const graph = sankeyGenerator({
        nodes: chartData.nodes.map((node) => ({ ...node })),
        links: chartData.links.map((link) => ({ ...link })),
      });

      const color = d3
        .scaleOrdinal<string>()
        .domain(graph.nodes.map((node) => node.key))
        .range(COLOR_PALETTE);

      svg
        .append("g")
        .attr("fill", "none")
        .selectAll("path")
        .data(graph.links)
        .enter()
        .append("path")
        .attr("d", sankeyLinkHorizontal())
        .attr("stroke", (d) => color((d.source as SankeyNodeDatum).key))
        .attr("stroke-width", (d) => Math.max(1, d.width ?? 1))
        .attr("stroke-opacity", 0.35);

      const nodeGroup = svg
        .append("g")
        .selectAll("g")
        .data(graph.nodes)
        .enter()
        .append("g");

      nodeGroup
        .append("rect")
        .attr("x", (d) => d.x0 ?? 0)
        .attr("y", (d) => d.y0 ?? 0)
        .attr("height", (d) => Math.max(1, (d.y1 ?? 0) - (d.y0 ?? 0)))
        .attr("width", (d) => Math.max(1, (d.x1 ?? 0) - (d.x0 ?? 0)))
        .attr("fill", (d) => color(d.key))
        .attr("stroke", "none");

      const fontSize = isMobile ? 8 : isTablet ? 10 : 12;

      nodeGroup
        .append("text")
        .attr("x", (d) => (d.x1 ?? 0) + 10)
        .attr("y", (d) => ((d.y0 ?? 0) + (d.y1 ?? 0)) / 2)
        .attr("text-anchor", "start")
        .attr("dominant-baseline", "middle")
        .style("font-size", `${fontSize}px`)
        .style("font-weight", "600")
        .style("font-family", "Source Code Pro, monospace")
        .style("fill", "#1A1A1A")
        .text((d) => d.name)
        .each(function (d) {
          const nodeSelection = d3.select(this);
          const valueText = chartData.unit
            ? `${formatNumber(d.rawValue)} ${chartData.unit}`
            : formatNumber(d.rawValue);
          nodeSelection
            .append("tspan")
            .attr("x", (d.x1 ?? 0) + 10)
            .attr("dy", "1.2em")
            .style("font-weight", "400")
            .style("fill", "#475569")
            .text(valueText);
        });
    };

    renderChart();
    window.addEventListener("resize", renderChart);
    return () => window.removeEventListener("resize", renderChart);
  }, [chartData]);

  const statusMessage = useMemo(() => {
    if (status === "loading") {
      return "Loading fiscal data...";
    }
    if (status === "error" || status === "missing" || status === "empty") {
      return message;
    }
    return null;
  }, [message, status]);

  return (
    <div className={`relative w-full h-[320px] md:h-[420px] ${className}`}>
      <svg ref={sankeyRef} className="w-full h-full" />
      {statusMessage ? (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 text-center text-sm font-sourcecodepro text-slate-600 px-6">
          {statusMessage}
        </div>
      ) : null}
    </div>
  );
}

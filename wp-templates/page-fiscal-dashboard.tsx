"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { gql } from "@apollo/client";
import SecondaryNav from "@/src/components/SecondaryNav";
import HeroWhite from "@/src/components/HeroBlocks/HeroWhite";
import * as d3 from "d3";
import { sankey as d3Sankey, sankeyLinkHorizontal } from "d3-sankey";
import CardType6 from "@/src/components/Cards/CardType6";
import DefaultDropdown from "@/src/components/Dropdowns/DefaultDropdown";
import { usePathname } from "next/navigation";

export const PAGE_QUERY = gql`
  query GetFiscalDashboardData {
    governmentFiscals(first: 100) {
      nodes {
        databaseId
        title
        slug
        dataSetFields {
          dataSetFile {
            node {
              mediaItemUrl
            }
          }
        }
      }
    }
  }
`;

type FiscalDatasetFile = { node?: { mediaItemUrl?: string | null } | null };
interface FiscalDatasetFields {
  dataSetFile?: FiscalDatasetFile | null;
}
interface FiscalDatasetNode {
  databaseId: number;
  title?: string | null;
  slug?: string | null;
  dataSetFields?: FiscalDatasetFields | null;
}
interface PageFiscalDashboardProps {
  data?: {
    governmentFiscals?: {
      nodes?: Array<FiscalDatasetNode | null> | null;
    } | null;
  };
}
interface ParsedDataset {
  rows: Array<Record<string, string>>;
  columns: string[];
  yearColumns: string[];
}
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
  source: number;
  target: number;
  value: number;
  width?: number;
}
interface SankeyChartData {
  nodes: SankeyNodeDatum[];
  links: SankeyLinkDatum[];
  unit: string;
}

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
  "#EB1A52",
  "#1C0209",
  "#7A0A28",
  "#A90E38",
];

const YEAR_COLUMN_REGEX = /^\d{4}$/;

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
    minimumFractionDigits: 0,
    maximumFractionDigits,
  });
}

interface BuildSankeyParams {
  rows: Array<Record<string, string>>;
  year: string;
  rootLabel: string;
}

function buildSankeyData({ rows, year, rootLabel }: BuildSankeyParams): SankeyChartData | null {
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
    const parentLabel = parentCode ? codeToLabel.get(parentCode) ?? parentCode : rootLabel;
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

function PageFiscalDashboard({ data }: PageFiscalDashboardProps) {
  const sankeyRef = useRef<SVGSVGElement | null>(null);
  const pathname = usePathname();
  const [openId, setOpenId] = useState<string | null>(null);
  const [year, setYear] = useState<string>("");
  const [yearOptions, setYearOptions] = useState<string[]>([]);
  const [selectedDatasetKey, setSelectedDatasetKey] = useState<string>("");
  const [industry, setIndustry] = useState<string>("");
  const [datasetCache, setDatasetCache] = useState<Record<string, ParsedDataset>>({});
  const [chartData, setChartData] = useState<SankeyChartData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fiscalNodes = useMemo(
    () =>
      (data?.governmentFiscals?.nodes ?? []).filter(
        (node): node is FiscalDatasetNode => !!node
      ),
    [data]
  );

  const datasets = useMemo(
    () =>
      fiscalNodes.map((node) => ({
        key: node.slug || String(node.databaseId),
        node,
        title: node.title ?? "Untitled",
      })),
    [fiscalNodes]
  );

  useEffect(() => {
    if (datasets.length === 0) {
      setSelectedDatasetKey("");
      setChartData(null);
      setYearOptions([]);
      return;
    }

    if (!selectedDatasetKey || !datasets.some((item) => item.key === selectedDatasetKey)) {
      setSelectedDatasetKey(datasets[0].key);
    }
  }, [datasets, selectedDatasetKey]);

  const activeDataset = useMemo(() => {
    if (datasets.length === 0) {
      return null;
    }
    return datasets.find((item) => item.key === selectedDatasetKey) ?? datasets[0];
  }, [datasets, selectedDatasetKey]);

  useEffect(() => {
    if (activeDataset?.node?.slug) {
      setIndustry(activeDataset.node.slug);
    }
  }, [activeDataset]);

  useEffect(() => {
    if (!activeDataset) {
      setChartData(null);
      setYearOptions([]);
      return;
    }

    const datasetKey = activeDataset.key;
    const csvUrl = activeDataset.node.dataSetFields?.dataSetFile?.node?.mediaItemUrl;

    if (!csvUrl) {
      setError("Dataset does not include a data file.");
      setChartData(null);
      setYearOptions([]);
      return;
    }

    const cached = datasetCache[datasetKey];
    if (cached) {
      setYearOptions(cached.yearColumns);
      if (cached.yearColumns.length > 0) {
        setYear((current) => {
          if (current && cached.yearColumns.includes(current)) {
            return current;
          }
          return cached.yearColumns.length > 0 ? cached.yearColumns[0] : "";
        });
      }
      setLoading(false);
      setError(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    const proxiedUrl = csvUrl.startsWith("http")
      ? `https://corsproxy.io/?${encodeURIComponent(csvUrl)}`
      : csvUrl;

    fetch(proxiedUrl)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Request failed with status ${res.status}`);
        }
        return res.text();
      })
      .then((text) => {
        if (cancelled) {
          return;
        }
        const normalized = text.replace(/\uFEFF/g, "").replace(/\r/g, "");
        const parsed = d3.csvParse(normalized);
        const columns = (parsed.columns ?? []).map((col) => col.trim());
        const yearCols = columns.filter((col) => YEAR_COLUMN_REGEX.test(col));
        const sortedYearCols = [...yearCols].sort((a, b) => Number(b) - Number(a));
        const rows = parsed.map((row) => {
          const entry: Record<string, string> = {};
          Object.entries(row).forEach(([key, value]) => {
            if (!key) {
              return;
            }
            entry[key.trim()] = typeof value === "string" ? value.trim() : value ?? "";
          });
          return entry;
        });

        const dataset: ParsedDataset = {
          rows,
          columns,
          yearColumns: sortedYearCols,
        };

        setDatasetCache((prev) => ({ ...prev, [datasetKey]: dataset }));
        setYearOptions(sortedYearCols);
        setYear((current) => {
          if (current && sortedYearCols.includes(current)) {
            return current;
          }
          return sortedYearCols.length > 0 ? sortedYearCols[0] : "";
        });
        setLoading(false);
      })
      .catch((err) => {
        if (cancelled) {
          return;
        }
        console.error(err);
        setError("Unable to load dataset.");
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [activeDataset, datasetCache]);

  useEffect(() => {
    if (!activeDataset) {
      setChartData(null);
      return;
    }
    const datasetKey = activeDataset.key;
    const cached = datasetCache[datasetKey];
    if (!cached) {
      return;
    }

    if (!year) {
      setChartData(null);
      return;
    }

    if (cached.yearColumns.length > 0 && !cached.yearColumns.includes(year)) {
      return;
    }

    const chart = buildSankeyData({
      rows: cached.rows,
      year,
      rootLabel: activeDataset.node.title ?? "Government Fiscal",
    });

    if (!chart) {
      setChartData(null);
      setError("No data available for the selected year.");
      return;
    }

    setError(null);
    setChartData(chart);
  }, [activeDataset, datasetCache, year]);

  useEffect(() => {
    if (!sankeyRef.current || !chartData) {
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
        top: 35,
        right: isMobile ? 150 : isTablet ? 170 : 220,
        bottom: 20,
        left: 16,
      };

      svg.selectAll("*").remove();

      const sankeyGenerator = d3Sankey<SankeyNodeDatum, SankeyLinkDatum>()
        .nodeWidth(15)
        .nodePadding(18)
        .extent([
          [margin.left, margin.top],
          [Math.max(width - margin.right, margin.left + 1), Math.max(height - margin.bottom, margin.top + 1)],
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
        .append("tspan")
        .attr("x", (d) => (d.x1 ?? 0) + 10)
        .attr("dy", "1.2em")
        .style("font-weight", "400")
        .style("fill", "#475569")
        .text((d) => {
          if (!Number.isFinite(d.rawValue) || d.rawValue <= 0) {
            return "";
          }
          const formatted = formatNumber(d.rawValue);
          return chartData.unit ? `${formatted} ${chartData.unit}` : formatted;
        });
    };

    renderChart();

    window.addEventListener("resize", renderChart);
    return () => window.removeEventListener("resize", renderChart);
  }, [chartData]);

  const statusMessage = useMemo(() => {
    if (loading) {
      return "Loading data...";
    }
    if (error) {
      return error;
    }
    if (activeDataset && datasetCache[activeDataset.key] && !chartData) {
      return "No data available.";
    }
    return null;
  }, [activeDataset, chartData, datasetCache, error, loading]);

  const yearLabel = year || "Year";

  return (
    <main>
      {/* Secondary Navigation */}
      <div className="bg-white border-b border-slate-300">
        <div className="mx-auto max-w-7xl px-5 md:px-10 xl:px-16 py-4 lg:py-0">
          <SecondaryNav
            className="!font-baskervville"
            items={[
              { label: "Macro Economy", href: "#" },
              { label: "Government Fiscal Operations", href: "#" },
              {
                label: "Transparency in government Institutions",
                href: (() => {
                  const params = new URLSearchParams();
                  if (industry) params.set("industry", industry);
                  if (year) params.set("year", year);
                  const qs = params.toString();
                  return qs
                    ? `/transparency-dashboard?${qs}`
                    : "/transparency-dashboard";
                })(),
              },
              {
                label: "State Owned Enterprises",
                href: (() => {
                  const params = new URLSearchParams();
                  if (industry) params.set("industry", industry);
                  if (year) params.set("year", year);
                  const qs = params.toString();
                  return qs
                    ? `/state-owned-dashboard?${qs}`
                    : "/state-owned-dashboard";
                })(),
              },
            ]}
            activePath={pathname}
          />
        </div>
      </div>

      {/* Hero */}
      <HeroWhite
        title="Government Fiscal Operations"
        paragraph={` 
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam condimentum consequat mi. Maecenas congue enim non dui iaculis condimentum. Interdum et malesuada fames ac ante ipsum primis in faucibus. Curabitur lobortis, mi et facilisis euismod, lacus ligula suscipit nibh, vitae blandit dui dolor vitae sapien. Fusce iaculis urna ligula, nec aliquet nisi consectetur euismod. Nunc dapibus dignissim nulla at tincidunt.`}
        items={[
          { label: "Dashboards", href: "/dashboard" },
          { label: "Government Fiscal Operations" },
        ]}
      />

      {/* Sankey Section */}
      <div className="bg-white py-3.5 md:py-5 xl:pt-6 xl:pb-20">
        <div className="mx-auto max-w-7xl px-5 md:px-10 xl:px-16">
          {/* Chip-box & Dropdown-Button */}
          <div className="lg:flex gap-2 items-center justify-between pb-16">
            <div className="relative w-full xl:w-2/3">
              <div className="grid xl:grid-cols-4 md:flex xl:items-center gap-2.5 md:gap-1.5">
                {datasets.map((item) => {
                  const isActive = item.key === (activeDataset?.key ?? "");
                  return (
                    <div key={item.key} className="flex flex-wrap xl:justify-center gap-4">
                      <button
                        type="button"
                        onClick={() => setSelectedDatasetKey(item.key)}
                        className={`text-sm/tight xl:text-base/6 py-2 px-3 border rounded-lg font-semibold font-sourcecodepro uppercase transition-colors duration-200 w-full text-center xl:w-auto ${
                          isActive
                            ? "bg-brand-2-950 text-brand-white border-brand-2-950"
                            : "text-slate-800 border-gray-400 bg-white hover:bg-brand-2-50 hover:text-slate-800 focus:bg-brand-2-950 focus:text-brand-white focus:border-brand-2-950"
                        }`}
                      >
                        {item.title}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Dropdown */}
            <div className="grid md:flex gap-3 items-center xl:justify-end w-full lg:w-1/3 mt-4 xl:mt-0">
              <span className="text-slate-800 font-medium text-lg/7 font-sourcecodepro md:flex md:justify-items-end mt-3 md:mt-0">
                Filter by :
              </span>
              <DefaultDropdown
                idKey="two"
                label={yearLabel}
                items={yearOptions.map((y) => ({
                  label: y,
                  onClick: () => {
                    setYear(y);
                    setOpenId(null);
                  },
                }))}
                align="right"
                open={openId === "two"}
                onOpenChange={(v: boolean) => setOpenId(v ? "two" : null)}
              />
            </div>
          </div>

          {/* Sankey Chart */}
          <div className="relative w-full">
            <div
              id="sankeyChartContainer"
              className="relative w-full h-[500px] sm:h-[600px] md:h-[700px] xl:h-[500px] overflow-visible"
            >
              <svg
                ref={sankeyRef}
                className="w-full h-full overflow-visible"
                preserveAspectRatio="xMinYMin meet"
              ></svg>
              {statusMessage ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-sm font-medium text-slate-600">{statusMessage}</p>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {/* Card Section */}
      <div className="bg-pink-100 py-12 md:py-16 xl:py-20">
        <div className="mx-auto max-w-7xl px-5 md:px-10 xl:px-16">
          {/* Title */}
          <div className="max-w-2xl text-left">
            <span className="mb-2 text-sm/8 md:text-base/6 font-medium font-sourcecodepro text-slate-900 uppercase">
              Advocata ai suggestions
            </span>
            <h2 className="text-2xl md:text-3xl leading-snug xl:text-4xl text-slate-900 font-montserrat font-bold mb-8">
              Related datasets
            </h2>
          </div>

          {/* Cards */}
          <div className="mt-11 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <CardType6
              title={"Sri Lanka - Food Security and Nutrition Indicators"}
              excerpt={
                "By comparison, just before the nation’s independence nearly 250 years ago, the 13 colonies had about 2.5 million residents. The projected world population on January 1, 2025, is 8,092,034,511, up 71,178,087 (0.89%) from New Year’s Day 2024. During January 2025, 4.2 births and 2.0 deaths are expected worldwide every second."
              }
              fileUrl={"#"}
            />
            <CardType6
              title={"Effective crisis management leads Sri Lanka’s tourism."}
              excerpt={
                "By comparison, just before the nation’s independence nearly 250 years ago, the 13 colonies had about 2.5 million residents. The projected world population on January 1, 2025, is 8,092,034,511, up 71,178,087 (0.89%) from New Year’s Day 2024. During January 2025, 4.2 births and 2.0 deaths are expected worldwide every second."
              }
              fileUrl={"#"}
            />
            <CardType6
              title={"TESLA Stock Data 2024"}
              excerpt={
                "By comparison, just before the nation’s independence nearly 250 years ago, the 13 colonies had about 2.5 million residents. The projected world population on January 1, 2025, is 8,092,034,511, up 71,178,087 (0.89%) from New Year’s Day 2024. During January 2025, 4.2 births and 2.0 deaths are expected worldwide every second."
              }
              fileUrl={"#"}
            />
          </div>
        </div>
      </div>
    </main>
  );
}

export default PageFiscalDashboard;

(PageFiscalDashboard as any).query = PAGE_QUERY;
(PageFiscalDashboard as any).variables = () => ({});



"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { gql } from "@apollo/client";
import type { GetStaticPropsContext } from "next";
import SecondaryNav from "@/src/components/SecondaryNav";
import HeroWhite from "@/src/components/HeroBlocks/HeroWhite";
import RelatedDatasets from "@/src/components/RelatedDatasets";
import DefaultDropdown from "@/src/components/Dropdowns/DefaultDropdown";
import { usePathname, useSearchParams } from "next/navigation";

// Chart D3
import * as d3 from "d3";
import {
  sankey as d3Sankey,
  sankeyLinkHorizontal,
  sankeyLeft,
} from "d3-sankey";

export const PAGE_QUERY = gql`
  query GetFiscalDashboardData($databaseId: ID!, $asPreview: Boolean = false) {
    page(id: $databaseId, idType: DATABASE_ID, asPreview: $asPreview) {
      title
      content
    }
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
        fiscal {
          dataSource
          periodicity
          notes
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
  fiscal?: {
    dataSource?: string | null;
    periodicity?: string | null;
    notes?: string | null;
  } | null;
}

interface PageFiscalOperationsProps {
  data?: {
    page?: {
      title?: string | null;
      content?: string | null;
    } | null;
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

const DEFAULT_HERO_PARAGRAPH =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam condimentum consequat mi. Maecenas congue enim non dui iaculis condimentum. Interdum et malesuada fames ac ante ipsum primis in faucibus. Curabitur lobortis, mi et facilisis euismod, lacus ligula suscipit nibh, vitae blandit dui dolor vitae sapien. Fusce iaculis urna ligula, nec aliquet nisi consectetur euismod. Nunc dapibus dignissim nulla at tincidunt.";

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

function firstParagraphFromHtml(html?: string | null): string {
  if (!html) {
    return "";
  }
  const match = html.match(/<p\b[^>]*>[\s\S]*?<\/p>/i);
  if (!match) {
    return "";
  }
  return match[0]
    .replace(/^<p\b[^>]*>/i, "")
    .replace(/<\/p>$/i, "")
    .replace(/<br\s*\/?>(\s*<br\s*\/?>)*/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/\u00a0/g, " ")
    .replace(/\s+\n/g, "\n")
    .replace(/\n{2,}/g, "\n")
    .trim();
}

function datasetPathSegment(node: FiscalDatasetNode): string {
  const rawSlug = (node.slug ?? "").trim().toLowerCase();
  if (rawSlug && /[a-z]/.test(rawSlug)) {
    return rawSlug;
  }
  const title = (node.title ?? "").trim().toLowerCase();
  if (title) {
    const slugified = title
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .replace(/-{2,}/g, "-");
    if (slugified) {
      return slugified;
    }
  }
  return `dataset-${node.databaseId}`;
}

interface BuildSankeyParams {
  rows: Array<Record<string, string>>;
  year: string;
  rootLabel: string;
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

function PageFiscalOperations({ data }: PageFiscalOperationsProps) {
  const sankeyRef = useRef<SVGSVGElement | null>(null);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const pathInfo = useMemo(() => {
    const currentPath = pathname || "/";
    const segments = currentPath.split("/").filter(Boolean);
    const baseSegments = [...segments];

    // Prefer query params if present
    const qpYear = searchParams?.get("year") || "";
    const qpDataset = (searchParams?.get("dataset") || "").toLowerCase();

    let yearFromPath = "";
    if (baseSegments.length > 0) {
      const last = baseSegments[baseSegments.length - 1];
      if (YEAR_COLUMN_REGEX.test(last)) {
        yearFromPath = last;
        baseSegments.pop();
      }
    }

    let datasetFromPath = "";
    if (baseSegments.length > 1) {
      datasetFromPath = baseSegments[baseSegments.length - 1].toLowerCase();
      baseSegments.pop();
    }

    const basePath = `/${baseSegments.join("/")}`;
    return {
      basePath: basePath === "" ? "/" : basePath,
      datasetSlug: qpDataset || datasetFromPath,
      year: qpYear || yearFromPath,
    };
  }, [pathname, searchParams]);

  const [openId, setOpenId] = useState<string | null>(null);
  const [year, setYear] = useState<string>(pathInfo.year);
  const [yearOptions, setYearOptions] = useState<string[]>([]);
  const [selectedDatasetKey, setSelectedDatasetKey] = useState<string>(
    pathInfo.datasetSlug
  );
  const [datasetCache, setDatasetCache] = useState<
    Record<string, ParsedDataset>
  >({});
  const [chartData, setChartData] = useState<SankeyChartData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const page = data?.page ?? null;
  const heroTitle = (() => {
    const raw = page?.title ?? "";
    return raw.trim() || "Government Fiscal Operations";
  })();
  const heroParagraph =
    firstParagraphFromHtml(page?.content) || DEFAULT_HERO_PARAGRAPH;

  useEffect(() => {
    if (!pathInfo.year) {
      return;
    }
    setYear((current) => (current === pathInfo.year ? current : pathInfo.year));
  }, [pathInfo.year]);

  const fiscalNodes = useMemo(
    () =>
      (data?.governmentFiscals?.nodes ?? []).filter(
        (node): node is FiscalDatasetNode => !!node
      ),
    [data]
  );

  const datasets = useMemo(() => {
    const seen = new Set<string>();
    return fiscalNodes.map((node) => {
      const baseSlug = datasetPathSegment(node);
      let slug = baseSlug;
      let counter = 1;
      while (seen.has(slug)) {
        slug = `${baseSlug}-${counter++}`;
      }
      seen.add(slug);
      return {
        key: slug,
        pathSegment: slug,
        rawSlug: (node.slug ?? "").trim().toLowerCase(),
        node,
        title: node.title ?? "Untitled",
      };
    });
  }, [fiscalNodes]);

  useEffect(() => {
    if (!pathInfo.datasetSlug) {
      return;
    }
    const slugFromPath = pathInfo.datasetSlug;
    const match = datasets.find(
      (item) => item.key === slugFromPath || item.rawSlug === slugFromPath
    );
    if (!match) {
      return;
    }
    setSelectedDatasetKey((current) =>
      current === match.key ? current : match.key
    );
  }, [datasets, pathInfo.datasetSlug]);

  useEffect(() => {
    if (datasets.length === 0) {
      setSelectedDatasetKey("");
      setChartData(null);
      setYearOptions([]);
      return;
    }

    if (
      !selectedDatasetKey ||
      !datasets.some((item) => item.key === selectedDatasetKey)
    ) {
      setSelectedDatasetKey(datasets[0].key);
    }
  }, [datasets, selectedDatasetKey]);

  const activeDataset = useMemo(() => {
    if (datasets.length === 0) {
      return null;
    }
    return (
      datasets.find((item) => item.key === selectedDatasetKey) ?? datasets[0]
    );
  }, [datasets, selectedDatasetKey]);

  const activeDatasetId = activeDataset?.node?.databaseId
    ? String(activeDataset.node.databaseId)
    : null;

  useEffect(() => {
    if (!activeDataset) {
      setChartData(null);
      setYearOptions([]);
      return;
    }

    const datasetKey = activeDataset.key;
    const csvUrl =
      activeDataset.node.dataSetFields?.dataSetFile?.node?.mediaItemUrl;

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
        setYear((current) =>
          current && cached.yearColumns.includes(current)
            ? current
            : cached.yearColumns[0]
        );
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
        const sortedYearCols = [...yearCols].sort(
          (a, b) => Number(b) - Number(a)
        );
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
    if (typeof window === "undefined") return;
    if (!selectedDatasetKey || !year) return;

    const params = new URLSearchParams(window.location.search);
    params.set("data-series", selectedDatasetKey);
    params.set("year", year);
    const nextUrl = `${pathInfo.basePath}?${params.toString()}`;
    const current = window.location.pathname + window.location.search;
    if (current !== nextUrl) {
      window.history.replaceState(null, "", nextUrl);
    }
  }, [pathInfo.basePath, selectedDatasetKey, year]);

  useEffect(() => {
    if (!sankeyRef.current || !chartData) return;

    const svg = d3.select(sankeyRef.current);

    const renderChart = () => {
      const container = sankeyRef.current?.parentElement;
      if (!container) return;

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

      const nodeWidth = isMobile ? 12 : isTablet ? 26 : 30;
      const nodePadding = isMobile ? 8 : isTablet ? 20 : 25;

      // --- Clone the data ---
      const nodes = chartData.nodes.map((n) => ({ ...n }));
      const links = chartData.links.map((l) => ({ ...l }));

      // --- STEP 1: Compute node depths dynamically ---
      const incoming: Record<string, string[]> = {};
      const outgoing: Record<string, string[]> = {};

      links.forEach((l) => {
        const s = String(l.source);
        const t = String(l.target);
        if (!outgoing[s]) outgoing[s] = [];
        if (!incoming[t]) incoming[t] = [];
        outgoing[s].push(t);
        incoming[t].push(s);
      });

      // BFS from root-like nodes (nodes without incoming links)
      const depthMap: Record<string, number> = {};
      const queue: string[] = [];

      nodes.forEach((n) => {
        const key = String(n.key);
        if (!incoming[key] || incoming[key].length === 0) {
          depthMap[key] = 0;
          queue.push(key);
        }
      });

      while (queue.length > 0) {
        const current = queue.shift()!;
        const currentDepth = depthMap[current] ?? 0;
        (outgoing[current] || []).forEach((next) => {
          if (!(next in depthMap)) {
            depthMap[next] = currentDepth + 1;
            queue.push(next);
          }
        });
      }

      // --- STEP 2: Assign X positions based on computed depth ---
      const maxDepth = Math.max(...Object.values(depthMap));
      const step =
        (width - margin.left - margin.right - nodeWidth) / (maxDepth || 1);

      nodes.forEach((node) => {
        const depth = depthMap[node.key] ?? 0;
        node.x0 = margin.left + depth * step;
        node.x1 = node.x0 + nodeWidth;
      });

      // --- STEP 3: Build Sankey with these fixed positions ---
      const sankeyGenerator = d3Sankey<SankeyNodeDatum, SankeyLinkDatum>()
        .nodeWidth(nodeWidth)
        .nodePadding(nodePadding)
        .nodeAlign(sankeyLeft)
        .nodeSort((a: any, b: any) => 0) // keep input order
        .linkSort((a: any, b: any) => 0) // keep input order
        .extent([
          [margin.left, margin.top],
          [
            Math.max(width - margin.right, margin.left + 1),
            Math.max(height - margin.bottom, margin.top + 1),
          ],
        ]);

      const graph = sankeyGenerator({
        nodes,
        links,
      });

      // --- STEP 4: Color scale ---
      const color = d3
        .scaleOrdinal<string>()
        .domain(graph.nodes.map((node) => node.key))
        .range(COLOR_PALETTE);

      // --- STEP 5: Draw Links ---
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

      // --- STEP 6: Draw Nodes ---
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

      const fontSize = isMobile ? 4 : isTablet ? 6 : 11;

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
        .attr("dy", "1.05em")
        .style("font-weight", "400")
        .style("fill", "#475569")
        .text((d) => {
          if (!Number.isFinite(d.rawValue) || d.rawValue <= 0) return "";
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
  const notesLines = useMemo(() => {
    const raw = activeDataset?.node.fiscal?.notes || "";
    return raw
      .split(/\r?\n/)
      .map((s) => s.trim())
      .filter(Boolean);
  }, [activeDataset]);

  return (
    <main>
      {/* Secondary Navigation */}
      <div className="bg-white border-b border-slate-300">
        <div className="mx-auto max-w-7xl px-5 md:px-10 xl:px-16 py-0 lg:py-0">
          <SecondaryNav
            className="!font-baskervville"
            items={[
              {
                label: "Macro Economy",
                href: "/the-macro-economy-of-sri-lanka",
              },
              {
                label: "Government Fiscal Operations",
                href: "/government-fiscal-operations",
              },
              {
                label: "Transparency in Government Institutions",
                href: "/transparency-in-government-institutions",
              },
              {
                label: "The Finances of SOEs",
                href: "/the-finances-of-state-owned-enterprises",
              },
            ]}
            activePath={pathname ?? undefined}
          />
        </div>
      </div>

      {/* Hero */}
      <HeroWhite
        title={heroTitle}
        paragraph={heroParagraph}
        items={[
          { label: "Dashboards", href: "/dashboard" },
          { label: heroTitle },
        ]}
      />

      {/* Sankey Section */}
      <div className="bg-white py-3.5 md:py-5 xl:pt-6 xl:pb-20">
        <div className="mx-auto max-w-7xl px-5 md:px-10 xl:px-16">
          {/* Chip-box & Dropdown-Button */}
          <div className="md:flex gap-2 items-center justify-between pb-5 md:pb-8 xl:pb-16">
            <div className="relative w-full xl:w-2/3">
              <div className="grid xl:grid-cols-4 md:flex xl:items-center gap-2.5 md:gap-1.5">
                {datasets.map((item) => {
                  const isActive = item.key === (activeDataset?.key ?? "");
                  return (
                    <div
                      key={item.key}
                      className="flex flex-wrap xl:justify-center gap-4"
                    >
                      <button
                        type="button"
                        onClick={() => setSelectedDatasetKey(item.key)}
                        className={`text-sm/tight xl:text-base/6 py-2 px-3 border rounded-lg font-semibold font-sourcecodepro uppercase transition-colors duration-200 w-full text-center xl:w-auto ${
                          isActive
                            ? "bg-[#1C0209] text-brand-white border-[#1C0209] hover:bg-brand-1-50 hover:border-brand-1-700 hover:text-slate-800"
                            : "text-slate-800 border-gray-400 bg-white hover:bg-brand-1-50 hover:border-brand-1-700 hover:text-slate-800 focus:bg-[#1C0209] focus:text-brand-white focus:border-brand-2-950"
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
            <div className="grid md:flex gap-3 items-center md:justify-end w-full lg:w-1/3 mt-4 md:mt-0">
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
                  <p className="text-sm font-medium text-slate-600">
                    {statusMessage}
                  </p>
                </div>
              ) : null}
            </div>
            {/* Meta: Data Source and Periodicity */}
            <div className="mt-2 md:mt-6 xl:mt-10">
              <div className="bg-gray-50 rounded-lg px-6 py-3.5">
                <div className="grid grid-cols-1 md:flex md:justify-between gap-4 text-xs/4 text-slate-600 font-sourcecodepro">
                  <div className="text-slate-600 text-xs/4 font-normal font-sourcecodepro flex items-center gap-2">
                    <p>
                      Data Source:{" "}
                      {activeDataset?.node.fiscal?.dataSource || "—"}
                    </p>
                  </div>
                  <div className="text-slate-600 text-xs/4 font-normal font-sourcecodepro flex items-center gap-2">
                    <p>
                      Periodicity - Annual{" "}
                      {activeDataset?.node.fiscal?.periodicity}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notes section (similar styling to metrics section) */}
      {notesLines.length > 0 ? (
        <div className="bg-white pb-12 md:pb-16 xl:pb-20">
          <div className="mx-auto max-w-7xl px-5 md:px-10 xl:px-16">
            <div className="border border-gray-200 bg-gray-50 rounded-xl">
              <div className="px-6 py-7">
                <div className="mb-2">
                  <h5 className="text-2xl font-montserrat font-bold text-slate-950 mb-1.5">
                    Notes
                  </h5>
                  <ol className="list-decimal pl-5 space-y-1 text-lg font-baskervville font-normal text-slate-950">
                    {notesLines.map((line, idx) => (
                      <li key={idx}>{line}</li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {activeDatasetId ? <RelatedDatasets datasetId={activeDatasetId} /> : null}
    </main>
  );
}

export default PageFiscalOperations;

(PageFiscalOperations as any).query = PAGE_QUERY;
(PageFiscalOperations as any).variables = (
  seedNode: { databaseId?: number | string } = {},
  ctx: GetStaticPropsContext
) => {
  const databaseId = seedNode?.databaseId;
  if (!databaseId) {
    throw new Error(
      "PageFiscalOperations.variables: missing databaseId from seed node."
    );
  }
  return {
    databaseId: String(databaseId),
    asPreview: !!ctx?.preview,
  };
};

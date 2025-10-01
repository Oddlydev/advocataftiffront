import type { DSVRowString } from "d3-dsv";

const DEFAULT_YEAR_KEYS = ["year", "Year", "YEAR"] as const;

function normalizeHeader(header: string): string {
  return header.trim().toLowerCase().replace(/[^a-z0-9]+/g, "");
}

function resolveValue(
  row: DSVRowString<string>,
  desiredKey: string
): string | undefined {
  const direct = row[desiredKey];
  if (direct != null && direct !== "") {
    return direct;
  }

  const target = normalizeHeader(desiredKey);
  for (const actualKey of Object.keys(row)) {
    if (!actualKey) continue;
    if (normalizeHeader(actualKey) === target) {
      const candidate = row[actualKey];
      if (candidate != null && candidate !== "") {
        return candidate;
      }
    }
  }

  return undefined;
}

function toNumber(value: string | undefined): number | null {
  if (value == null) return null;
  const numeric = Number(String(value).replace(/[^0-9.-]+/g, ""));
  return Number.isFinite(numeric) ? numeric : null;
}

export function extractYear(
  row: DSVRowString<string>,
  keys: readonly string[] = DEFAULT_YEAR_KEYS
): number | null {
  for (const key of keys) {
    const value = resolveValue(row, key);
    const numeric = toNumber(value);
    if (numeric !== null) {
      return numeric;
    }
  }
  return null;
}

export function pickNumeric(
  row: DSVRowString<string>,
  keys: readonly string[]
): number | null {
  for (const key of keys) {
    const numeric = toNumber(resolveValue(row, key));
    if (numeric !== null) {
      return numeric;
    }
  }
  return null;
}

export const percentFormatter = (value: number | null) =>
  value === null ? "N/A" : `${value.toFixed(1)}%`;

export const numberFormatter = (suffix = "") => (value: number | null) =>
  value === null ? "N/A" : `${value.toFixed(1)}${suffix}`;

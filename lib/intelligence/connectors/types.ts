import type { SourceObservation } from "../scoring";

export type ConnectorKind = "repository" | "paper" | "market" | "social" | "filing" | "chain";

export type SourceConnector = {
  id: string;
  label: string;
  kind: ConnectorKind;
  enabled: boolean;
  collect: () => Promise<SourceObservation[]>;
};

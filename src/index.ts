export { default as ReactCanvas } from './coreComponents/ReactCanvas';
export { default as EditTextReactCanvas } from './coreComponents/EditReactCanvas';
export type { ReactCanvasProps } from './coreComponents/ReactCanvas';
export type { EditReactCanvasProps } from './coreComponents/EditReactCanvas';

// Static analysis -- no DOM required, safe to run in Node (CI, migrations).
export { analyzeReactCode } from './analyzer/analyzeReactCode';
export type {
  AnalysisResult,
  AnalyzeOptions,
  CodeIssue,
  IssueType,
} from './analyzer/analyzeReactCode';

/**
 * Semantic UI Layer Validation Utility
 *
 * This utility helps developers identify when they're using native HTML elements
 * instead of semantic-ui-layer components, which prevents semantic metadata from being applied.
 */
export interface ValidationWarning {
    element: string;
    tagName: string;
    suggestion: string;
    location?: string;
    elementRef?: HTMLElement;
}
export interface ValidationResult {
    warnings: ValidationWarning[];
    summary: {
        totalElements: number;
        semanticElements: number;
        nativeElements: number;
        warningsCount: number;
    };
}
/**
 * Validates the current DOM for native HTML elements that should use semantic-ui-layer components
 */
export declare const validateSemanticUsage: () => ValidationResult;
/**
 * Highlights elements that have validation warnings
 */
export declare const highlightValidationWarnings: (warnings: ValidationWarning[]) => void;
/**
 * Removes validation highlights from all elements
 */
export declare const clearValidationHighlights: () => void;
/**
 * Logs validation results to the console with helpful formatting
 */
export declare const logValidationResults: (result: ValidationResult) => void;
/**
 * Main validation function that runs the complete validation process
 */
export declare const runSemanticValidation: (highlightWarnings?: boolean) => ValidationResult;
//# sourceMappingURL=semanticValidation.d.ts.map
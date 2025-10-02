/**
 * Accessibility utility functions
 */
/**
 * Generates ARIA attributes based on component context
 */
export declare const generateAriaAttributes: (componentType: string) => Record<string, string>;
/**
 * Validates accessibility requirements
 */
export declare const validateAccessibility: (componentType: string, props: Record<string, unknown>) => string[];
/**
 * Generates keyboard shortcuts metadata
 */
export declare const generateKeyboardShortcuts: (componentType: string, context?: Record<string, unknown>) => string[];
//# sourceMappingURL=accessibility.d.ts.map
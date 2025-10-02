/**
 * Hook for managing accessibility features
 */
export declare const useAccessibility: (componentType: string, props?: Record<string, unknown>, context?: Record<string, unknown>) => {
    ariaAttributes: Record<string, string>;
    keyboardShortcuts: string[];
    accessibilityIssues: string[];
    enhancedProps: {
        'data-keyboard-shortcuts': string;
        'data-accessibility-issues': string;
    };
};
//# sourceMappingURL=useAccessibility.d.ts.map
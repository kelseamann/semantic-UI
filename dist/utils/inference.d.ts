/**
 * Inference utilities for automatically determining semantic properties
 * from PatternFly component props
 */
/**
 * Infer button action from PatternFly variant and props
 * Returns both behavior (what it does) and styling (how it looks)
 */
export declare const inferButtonAction: (variant?: string, href?: string, onClick?: unknown, target?: string) => {
    type: string;
    variant: string;
};
/**
 * Infer input purpose from type
 */
export declare const inferInputPurpose: (type?: string) => string;
/**
 * Infer alert severity
 */
export declare const inferAlertSeverity: (variant?: string) => string;
/**
 * Infer context from parent or usage
 */
export declare const inferContext: (props: Record<string, unknown>) => string;
/**
 * Infer card purpose from props
 */
export declare const inferCardPurpose: (props: Record<string, unknown>) => string;
/**
 * Infer modal purpose from props
 */
export declare const inferModalPurpose: (props: Record<string, unknown>) => string;
/**
 * Infer accessibility features from props
 */
export declare const inferAccessibilityFeatures: (props: Record<string, unknown>) => string[];
/**
 * Infer usage patterns from component type and props
 */
export declare const inferUsagePatterns: (componentType: string, props: Record<string, unknown>) => string[];
/**
 * Generate comprehensive metadata from props
 */
export declare const generateMetadataFromProps: (componentName: string, props: Record<string, unknown>) => {
    description: string;
    category: string;
    accessibility: string[];
    usage: string[];
};
/**
 * Infer card content type
 */
export declare const inferCardContentType: () => string;
/**
 * Infer modal interaction type
 */
export declare const inferModalInteractionType: (isOpen?: boolean) => string;
/**
 * Infer select purpose
 */
export declare const inferSelectPurpose: () => string;
/**
 * Infer select selection type
 */
export declare const inferSelectSelectionType: (variant?: string) => string;
/**
 * Infer radio purpose
 */
export declare const inferRadioPurpose: () => string;
/**
 * Infer radio group context
 */
export declare const inferRadioGroupContext: (name?: string) => string;
/**
 * Infer switch purpose
 */
export declare const inferSwitchPurpose: () => string;
/**
 * Infer switch toggle target
 */
export declare const inferSwitchToggleTarget: () => string;
/**
 * Infer textarea purpose
 */
export declare const inferTextAreaPurpose: () => string;
/**
 * Infer textarea content type
 */
export declare const inferTextAreaContentType: () => string;
/**
 * Infer checkbox purpose
 */
export declare const inferCheckboxPurpose: (isChecked?: boolean) => string;
/**
 * Infer link purpose
 */
export declare const inferLinkPurpose: (href?: string, children?: React.ReactNode) => string;
/**
 * Infer star icon purpose
 */
export declare const inferStarIconPurpose: (isFavorited?: boolean) => string;
/**
 * Infer validation context
 */
export declare const inferValidationContext: (isRequired?: boolean) => string;
/**
 * Infer form context (default for most form components)
 */
export declare const inferFormContext: () => string;
/**
 * Infer settings context (default for switches)
 */
export declare const inferSettingsContext: () => string;
/**
 * Infer status badge type from content
 */
export declare const inferStatusBadgeType: (content?: string) => string;
/**
 * Infer status badge purpose
 */
export declare const inferStatusBadgePurpose: () => string;
/**
 * Infer category from component name
 * Category describes WHAT the component IS, not what it DOES (that's the action)
 */
export declare const inferCategory: (componentName: string) => string;
//# sourceMappingURL=inference.d.ts.map
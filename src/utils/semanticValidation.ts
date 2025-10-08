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
  semanticAlternative?: string;
  canAutoReplace?: boolean;
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
 * Maps semantic component names to their native HTML equivalents
 * This is used to detect when semantic components are being used
 */
const SEMANTIC_TO_NATIVE: Record<string, string> = {
  'Button': 'button',
  'Tr': 'tr',
  'Td': 'td', 
  'Th': 'th',
  'Thead': 'thead',
  'Tbody': 'tbody',
  'Checkbox': 'input', // for type="checkbox"
  'Card': 'div',
  'Modal': 'div',
  'Flex': 'div',
  'FlexItem': 'span',
  'Link': 'a',
  'StatusBadge': 'span',
  'StarIcon': 'span',
};

/**
 * Semantic components that should be detected
 */
const SEMANTIC_COMPONENTS = Object.keys(SEMANTIC_TO_NATIVE);

/**
 * Validates the current DOM for semantic-ui-layer components being used
 * This detects when semantic components are being used and shows their semantic names
 */
export const validateSemanticUsage = (): ValidationResult => {
  const warnings: ValidationWarning[] = [];
  
  // Get all elements in the document
  const allElements = document.querySelectorAll('*');
  
  // Count elements
  const totalElements = allElements.length;
  
  // Find elements that have semantic metadata (data-semantic-name attribute)
  const semanticElements = document.querySelectorAll('[data-semantic-name]');
  const semanticElementsCount = semanticElements.length;
  
  // Check each semantic element and create validation entries
  semanticElements.forEach(element => {
    const htmlElement = element as HTMLElement;
    const semanticName = htmlElement.getAttribute('data-semantic-name');
    
    if (semanticName && SEMANTIC_COMPONENTS.includes(semanticName)) {
      const nativeEquivalent = SEMANTIC_TO_NATIVE[semanticName];
      
      warnings.push({
        element: semanticName,
        tagName: htmlElement.tagName.toUpperCase(),
        suggestion: `✅ Using semantic <${semanticName}> component (renders as <${nativeEquivalent}>)`,
        location: getElementLocation(htmlElement),
        elementRef: htmlElement,
        semanticAlternative: semanticName,
        canAutoReplace: true
      });
    }
  });
  
  const nativeElementsCount = totalElements - semanticElementsCount;
  
  return {
    warnings,
    summary: {
      totalElements,
      semanticElements: semanticElementsCount,
      nativeElements: nativeElementsCount,
      warningsCount: warnings.length
    }
  };
};


/**
 * Attempts to determine the location of an element for debugging
 */
const getElementLocation = (element: HTMLElement): string => {
  // Try to get line number from source maps or other debugging info
  if (element.hasAttribute('data-line')) {
    return `line ${element.getAttribute('data-line')}`;
  }
  
  // Get a basic selector for the element
  const tagName = element.tagName.toLowerCase();
  const className = element.className ? `.${element.className.split(' ').join('.')}` : '';
  const id = element.id ? `#${element.id}` : '';
  
  return `${tagName}${id}${className}`;
};

/**
 * Highlights elements that have validation warnings
 */
export const highlightValidationWarnings = (warnings: ValidationWarning[]): void => {
  // Remove any existing highlights
  clearValidationHighlights();
  
  warnings.forEach((warning, index) => {
    if (warning.elementRef) {
      // Use green outline for semantic components (success)
      warning.elementRef.style.outline = '2px solid #28a745';
      warning.elementRef.style.outlineOffset = '2px';
      warning.elementRef.setAttribute('data-validation-warning', index.toString());
      
      // Add a temporary title with the suggestion
      const originalTitle = warning.elementRef.getAttribute('title') || '';
      warning.elementRef.setAttribute('title', `${originalTitle}\n✅ ${warning.suggestion}`.trim());
    }
  });
};

/**
 * Removes validation highlights from all elements
 */
export const clearValidationHighlights = (): void => {
  const highlightedElements = document.querySelectorAll('[data-validation-warning]');
  highlightedElements.forEach(element => {
    const htmlElement = element as HTMLElement;
    htmlElement.style.outline = '';
    htmlElement.style.outlineOffset = '';
    htmlElement.removeAttribute('data-validation-warning');
    
    // Restore original title (remove our added warning)
    const title = htmlElement.getAttribute('title') || '';
    if (title.includes('✅')) {
      const originalTitle = title.split('\n✅')[0].trim();
      htmlElement.setAttribute('title', originalTitle);
    }
  });
};

/**
 * Logs validation results to the console with helpful formatting
 */
export const logValidationResults = (result: ValidationResult): void => {
  console.group('🔍 Semantic UI Layer Validation Results');
  
  console.log(`📊 Summary:`, result.summary);
  
  if (result.warnings.length > 0) {
    console.log(`✅ Found ${result.warnings.length} semantic components being used:`);
    result.warnings.forEach((warning, index) => {
      console.log(`${index + 1}. <${warning.element}> at ${warning.location}`);
      console.log(`   💡 ${warning.suggestion}`);
      if (warning.elementRef) {
        console.log(`   🔗 Element:`, warning.elementRef);
      }
    });
    
    console.log(`\n🎯 This demonstrates the semantic naming capability - components are using semantic names instead of native HTML names`);
    console.log(`💡 Tip: Use the refresh button to highlight these semantic components in the UI`);
  } else {
    console.log('ℹ️ No semantic components detected. This page may not be using semantic-ui-layer components yet.');
  }
  
  console.groupEnd();
};

/**
 * Main validation function that runs the complete validation process
 */
export const runSemanticValidation = (highlightWarnings: boolean = true): ValidationResult => {
  console.log('🔍 Running semantic-ui-layer validation...');
  
  const result = validateSemanticUsage();
  
  if (highlightWarnings && result.warnings.length > 0) {
    highlightValidationWarnings(result.warnings);
  }
  
  logValidationResults(result);
  
  return result;
};




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
 * Maps native HTML elements to their semantic-ui-layer equivalents
 */
const SEMANTIC_ALTERNATIVES: Record<string, string> = {
  'tr': 'Tr',
  'td': 'Td',
  'th': 'Th',
  'thead': 'Thead',
  'tbody': 'Tbody',
  'button': 'Button',
  'input': 'Checkbox', // for type="checkbox"
  'div': 'Flex', // when used for layout
  'span': 'FlexItem', // when used for layout
};

/**
 * Validates the current DOM for native HTML elements that should use semantic-ui-layer components
 */
export const validateSemanticUsage = (): ValidationResult => {
  const warnings: ValidationWarning[] = [];
  
  // Get all elements in the document
  const allElements = document.querySelectorAll('*');
  const semanticElements = document.querySelectorAll('[data-semantic-name]');
  
  // Count elements
  const totalElements = allElements.length;
  const semanticElementsCount = semanticElements.length;
  
  // Check for native elements that should be semantic
  Object.keys(SEMANTIC_ALTERNATIVES).forEach(tagName => {
    const nativeElements = document.querySelectorAll(tagName);
    
    nativeElements.forEach(element => {
      const htmlElement = element as HTMLElement;
      
      // Skip if this element already has semantic metadata
      if (htmlElement.hasAttribute('data-semantic-name')) {
        return;
      }
      
      // Special cases for specific elements
      if (tagName === 'input') {
        const inputElement = htmlElement as HTMLInputElement;
        if (inputElement.type !== 'checkbox') {
          return; // Only flag checkbox inputs
        }
      }
      
      // Skip elements that are likely intentionally native (e.g., form inputs, etc.)
      if (shouldSkipElement(htmlElement, tagName)) {
        return;
      }
      
      warnings.push({
        element: tagName,
        tagName: tagName.toUpperCase(),
        suggestion: `Use <${SEMANTIC_ALTERNATIVES[tagName]}> from semantic-ui-layer instead of native <${tagName}>`,
        location: getElementLocation(htmlElement),
        elementRef: htmlElement
      });
    });
  });
  
  const nativeElementsCount = warnings.length;
  
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
 * Determines if an element should be skipped during validation
 */
const shouldSkipElement = (element: HTMLElement, tagName: string): boolean => {
  // Skip elements inside certain containers that might be intentionally native
  const parent = element.parentElement;
  if (parent) {
    // Skip if parent is a form (forms often need native inputs)
    if (parent.tagName === 'FORM') {
      return true;
    }
    
    // Skip if parent has a specific class indicating it's intentionally native
    if (parent.classList.contains('native-elements') || 
        parent.classList.contains('raw-html')) {
      return true;
    }
  }
  
  // Skip elements with specific attributes that indicate they're intentionally native
  if (element.hasAttribute('data-native') || 
      element.hasAttribute('data-raw')) {
    return true;
  }
  
  // Skip elements that are part of third-party libraries
  if (element.closest('[data-testid]') || 
      element.closest('.react-select') ||
      element.closest('.react-datepicker')) {
    return true;
  }
  
  return false;
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
      warning.elementRef.style.outline = '2px solid #ff6b6b';
      warning.elementRef.style.outlineOffset = '2px';
      warning.elementRef.setAttribute('data-validation-warning', index.toString());
      
      // Add a temporary title with the suggestion
      const originalTitle = warning.elementRef.getAttribute('title') || '';
      warning.elementRef.setAttribute('title', `${originalTitle}\n⚠️ ${warning.suggestion}`.trim());
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
    if (title.includes('⚠️')) {
      const originalTitle = title.split('\n⚠️')[0].trim();
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
    console.warn(`⚠️ Found ${result.warnings.length} potential issues:`);
    result.warnings.forEach((warning, index) => {
      console.warn(`${index + 1}. <${warning.tagName}> at ${warning.location}`);
      console.warn(`   💡 ${warning.suggestion}`);
      if (warning.elementRef) {
        console.warn(`   🔗 Element:`, warning.elementRef);
      }
    });
    
    console.log(`\n💡 Tip: Use the refresh button to highlight these elements in the UI`);
  } else {
    console.log('✅ No validation issues found! All elements are using semantic-ui-layer components.');
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



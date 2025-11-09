/**
 * JSCodeShift Transform: Add Semantic Data Attributes to PatternFly Components
 * 
 * This transform adds standardized data-* attributes to all PatternFly components
 * in user code, making them more AI-friendly. Attributes appear on rendered DOM elements.
 * 
 * Usage:
 *   jscodeshift -t codemod/transform.js path/to/files
 */

const {
  inferRole,
  inferPurpose,
  inferVariant,
  inferContext,
  inferState,
  isPatternFlyComponent,
  STANDARD_ATTRIBUTES,
} = require('./static-inference');

/**
 * Semantic attribute names (without 'data-' prefix)
 */
const SEMANTIC_ATTR_NAMES = STANDARD_ATTRIBUTES.map(attr => attr.replace('data-', ''));

/**
 * Check if element already has semantic attributes
 */
function hasSemanticAttributes(attributes) {
  if (!attributes || attributes.length === 0) {
    return false;
  }
  
  return attributes.some(attr => {
    const name = attr.name?.name || attr.name?.value;
    if (!name) return false;
    
    // Check for old format (data-semantic-*) or new format (data-role, etc.)
    return name.startsWith('data-semantic-') || SEMANTIC_ATTR_NAMES.includes(name.replace('data-', ''));
  });
}

/**
 * Find parent context by traversing up the AST
 */
function findParentContext(path, imports) {
  let current = path.parent;
  let depth = 0;
  const maxDepth = 10; // Prevent infinite loops
  
  while (current && depth < maxDepth) {
    if (current.value) {
      const node = current.value;
      
      // Check if parent is a JSX element
      if (node.type === 'JSXElement' && node.openingElement) {
        const parentName = node.openingElement.name?.name;
        if (parentName && isPatternFlyComponent(parentName, imports)) {
          const parentProps = node.openingElement.attributes || [];
          const purpose = inferPurpose(parentName, parentProps);
          if (purpose === 'form-container' || purpose === 'overlay') {
            return inferContext(parentName, parentProps);
          }
        }
      }
    }
    
    current = current.parent;
    depth++;
  }
  
  return null;
}

/**
 * Create semantic data attributes
 * Only adds attributes when we can infer meaningful values (not null)
 */
function createSemanticAttributes(j, componentName, props, parentContext) {
  const role = inferRole(componentName);
  const purpose = inferPurpose(componentName, props);
  const variant = inferVariant(componentName, props);
  const context = inferContext(componentName, props, parentContext);
  const state = inferState(componentName, props);
  
  const attributes = [];
  
  // Always add role and purpose (they always have values)
  attributes.push(j.jsxAttribute(j.jsxIdentifier('data-role'), j.literal(role)));
  attributes.push(j.jsxAttribute(j.jsxIdentifier('data-purpose'), j.literal(purpose)));
  
  // Only add variant, context, and state if we inferred meaningful values
  if (variant !== null) {
    attributes.push(j.jsxAttribute(j.jsxIdentifier('data-variant'), j.literal(variant)));
  }
  
  if (context !== null) {
    attributes.push(j.jsxAttribute(j.jsxIdentifier('data-context'), j.literal(context)));
  }
  
  if (state !== null) {
    attributes.push(j.jsxAttribute(j.jsxIdentifier('data-state'), j.literal(state)));
  }
  
  return attributes;
}

/**
 * Main transform function
 */
module.exports = function transformer(fileInfo, api) {
  const j = api.jscodeshift;
  const root = j(fileInfo.source);
  
  // Track imports to identify PatternFly components
  const imports = [];
  root.find(j.ImportDeclaration).forEach(path => {
    imports.push(path.node);
  });
  
  // Process all JSX opening elements (handles both self-closing and regular elements)
  root.find(j.JSXOpeningElement).forEach(path => {
    const node = path.node;
    const componentName = node.name?.name;
    
    // Skip if not a valid component name
    if (!componentName || typeof componentName !== 'string') {
      return;
    }
    
    // Check if this is a PatternFly component
    if (!isPatternFlyComponent(componentName, imports)) {
      return;
    }
    
    // Skip if already has semantic attributes (don't duplicate)
    const existingAttrs = node.attributes || [];
    if (hasSemanticAttributes(existingAttrs)) {
      return;
    }
    
    // Find parent context for nested components
    const parentContext = findParentContext(path, imports);
    
    // Create and add semantic attributes
    const newAttributes = createSemanticAttributes(j, componentName, existingAttrs, parentContext);
    node.attributes = [...existingAttrs, ...newAttributes];
  });
  
  return root.toSource({
    quote: 'single',
    trailingComma: true,
    lineTerminator: '\n',
  });
};


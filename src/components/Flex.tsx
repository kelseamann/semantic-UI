import React from 'react';
import { Flex as PFFlex } from '@patternfly/react-core';
import { SemanticComponentProps } from '../types';

export interface FlexProps extends Omit<React.ComponentProps<typeof PFFlex>, 'children'>, SemanticComponentProps {
  children?: React.ReactNode;
  /** The layout purpose of this flex container (auto-inferred from props if not provided) */
  purpose?: 'layout' | 'navigation' | 'toolbar' | 'form' | 'content' | 'action-group';
  /** The layout type (auto-inferred from direction if not provided) */
  layoutType?: 'row' | 'column' | 'responsive';
  /** The alignment context (auto-inferred from props if not provided) */
  alignmentContext?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
}

/** Flex - PatternFly Flex wrapper with semantic metadata for AI tooling */
export const Flex: React.FC<FlexProps> = ({
  semanticName,
  semanticRole,
  aiMetadata,
  purpose,
  layoutType,
  alignmentContext,
  children,
  direction,
  justifyContent,
  alignItems,
  alignSelf,
  flex,
  spaceItems,
  gap,
  columnGap,
  rowGap,
  order,
  component,
  display,
  ...props
}) => {
  // Auto-infer semantic properties from PatternFly props
  const inferredPurpose = purpose || (
    justifyContent?.default === 'justifyContentSpaceBetween' ? 'toolbar' :
    justifyContent?.default === 'justifyContentCenter' ? 'content' :
    spaceItems ? 'action-group' :
    'layout'
  );
  
  const inferredLayoutType = layoutType || (
    direction?.default === 'column' ? 'column' :
    direction?.lg ? 'responsive' :
    'row'
  );
  
  const inferredAlignmentContext = alignmentContext || (
    alignItems?.default === 'alignItemsCenter' ? 'center' :
    alignItems?.default === 'alignItemsFlexEnd' ? 'end' :
    alignItems?.default === 'alignItemsFlexStart' ? 'start' :
    alignItems?.default === 'alignItemsStretch' ? 'stretch' :
    alignItems?.default === 'alignItemsBaseline' ? 'baseline' :
    'start'
  );
  
  // Generate semantic role and AI metadata
  const role = semanticRole || `flex-${inferredPurpose}-${inferredLayoutType}`;
  const metadata = aiMetadata || {
    description: `${inferredPurpose} flex container with ${inferredLayoutType} layout`,
    category: 'layout',
    complexity: inferredLayoutType === 'responsive' ? 'medium' : 'simple',
    usage: [`${inferredPurpose}-layout`, `${inferredLayoutType}-container`, 'responsive-design'],
    alignment: inferredAlignmentContext,
    layoutDirection: direction?.default || 'row'
  };

  // Default semantic name if not provided
  const defaultSemanticName = semanticName || 'Flex Container';

  return (
    <PFFlex
      {...props}
      direction={direction}
      justifyContent={justifyContent}
      alignItems={alignItems}
      alignSelf={alignSelf}
      flex={flex}
      spaceItems={spaceItems}
      gap={gap}
      columnGap={columnGap}
      rowGap={rowGap}
      order={order}
      component={component}
      display={display}
      data-semantic-name={defaultSemanticName}
      data-semantic-role={role}
      data-ai-metadata={JSON.stringify(metadata)}
      data-purpose={inferredPurpose}
      data-layout-type={inferredLayoutType}
      data-alignment-context={inferredAlignmentContext}
    >
      {children}
    </PFFlex>
  );
};

export default Flex;

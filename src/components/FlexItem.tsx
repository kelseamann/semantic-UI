import React from 'react';
import { FlexItem as PFFlexItem } from '@patternfly/react-core';
import { SemanticComponentProps } from '../types';

export interface FlexItemProps extends Omit<React.ComponentProps<typeof PFFlexItem>, 'children'>, SemanticComponentProps {
  children?: React.ReactNode;
  /** The content type of this flex item (auto-inferred from props if not provided) */
  contentType?: 'text' | 'button' | 'icon' | 'form-control' | 'media' | 'navigation' | 'action';
  /** The positioning context (auto-inferred from props if not provided) */
  positioningContext?: 'start' | 'center' | 'end' | 'stretch' | 'baseline' | 'auto';
  /** The sizing behavior (auto-inferred from flex prop if not provided) */
  sizingBehavior?: 'fixed' | 'flexible' | 'grow' | 'shrink' | 'auto';
}

/** FlexItem - PatternFly FlexItem wrapper with semantic metadata for AI tooling */
export const FlexItem: React.FC<FlexItemProps> = ({
  semanticName,
  semanticRole,
  aiMetadata,
  contentType,
  positioningContext,
  sizingBehavior,
  children,
  flex,
  align,
  alignSelf,
  spacer,
  order,
  component,
  ...props
}) => {
  // Auto-infer semantic properties from PatternFly props
  const inferredContentType = contentType || (
    React.Children.toArray(children).some(child =>
      React.isValidElement(child) && 
      (child.type?.toString().includes('Button') || 
       child.props?.variant === 'primary' || 
       child.props?.variant === 'secondary')
    ) ? 'button' :
    React.Children.toArray(children).some(child =>
      React.isValidElement(child) && 
      child.type?.toString().includes('Icon')
    ) ? 'icon' :
    React.Children.toArray(children).some(child =>
      React.isValidElement(child) && 
      (child.type?.toString().includes('Input') || 
       child.type?.toString().includes('Select') ||
       child.type?.toString().includes('Checkbox'))
    ) ? 'form-control' :
    React.Children.toArray(children).some(child =>
      React.isValidElement(child) && 
      (child.type?.toString().includes('img') || 
       child.type?.toString().includes('Image'))
    ) ? 'media' :
    React.Children.toArray(children).some(child =>
      React.isValidElement(child) && 
      child.type?.toString().includes('Link')
    ) ? 'navigation' :
    'text'
  );
  
  const inferredPositioningContext = positioningContext || (
    align?.default === 'alignRight' ? 'end' :
    align?.default === 'alignLeft' ? 'start' :
    align?.default === 'alignCenter' ? 'center' :
    alignSelf?.default === 'alignSelfFlexEnd' ? 'end' :
    alignSelf?.default === 'alignSelfFlexStart' ? 'start' :
    alignSelf?.default === 'alignSelfCenter' ? 'center' :
    alignSelf?.default === 'alignSelfStretch' ? 'stretch' :
    alignSelf?.default === 'alignSelfBaseline' ? 'baseline' :
    'auto'
  );
  
  const inferredSizingBehavior = sizingBehavior || (
    flex?.default === 'flex_1' ? 'flexible' :
    flex?.default === 'flex_2' ? 'grow' :
    flex?.default === 'flex_3' ? 'grow' :
    flex?.default === 'flexNone' ? 'fixed' :
    flex?.default === 'flexAuto' ? 'auto' :
    'auto'
  );
  
  // Generate semantic role and AI metadata
  const role = semanticRole || `flex-item-${inferredContentType}-${inferredSizingBehavior}`;
  const metadata = aiMetadata || {
    description: `${inferredContentType} flex item with ${inferredSizingBehavior} sizing`,
    category: 'layout',
    complexity: 'simple',
    usage: [`${inferredContentType}-item`, `${inferredSizingBehavior}-sizing`, 'flex-layout'],
    positioning: inferredPositioningContext,
    sizing: inferredSizingBehavior,
    spacing: spacer?.default || 'none'
  };

  // Default semantic name if not provided
  const defaultSemanticName = semanticName || 'Flex Item';

  return (
    <PFFlexItem
      {...props}
      flex={flex}
      align={align}
      alignSelf={alignSelf}
      spacer={spacer}
      order={order}
      component={component}
      data-semantic-name={defaultSemanticName}
      data-semantic-role={role}
      data-ai-metadata={JSON.stringify(metadata)}
      data-content-type={inferredContentType}
      data-positioning-context={inferredPositioningContext}
      data-sizing-behavior={inferredSizingBehavior}
    >
      {children}
    </PFFlexItem>
  );
};

export default FlexItem;

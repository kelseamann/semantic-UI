/**
 * Test template for semantic components
 * 
 * Usage: Copy this template and replace:
 * - {{ComponentName}} - Component name (e.g., TextInput)
 * - {{componentName}} - camelCase component name (e.g., textInput)
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { {{ComponentName}} } from './{{ComponentName}}';

describe('{{ComponentName}}', () => {
  it('should render with semantic metadata', () => {
    const { container } = render(<{{ComponentName}} />);
    const element = container.firstChild as HTMLElement;
    
    expect(element).toHaveAttribute('data-semantic-name', '{{ComponentName}}');
    expect(element).toHaveAttribute('data-semantic-role');
    expect(element).toHaveAttribute('data-ai-metadata');
  });

  it('should include AI metadata with proper structure', () => {
    const { container } = render(<{{ComponentName}} />);
    const element = container.firstChild as HTMLElement;
    const metadata = JSON.parse(element.getAttribute('data-ai-metadata') || '{}');
    
    expect(metadata).toHaveProperty('description');
    expect(metadata).toHaveProperty('category');
    expect(metadata).toHaveProperty('complexity');
    expect(metadata).toHaveProperty('accessibility');
    expect(metadata).toHaveProperty('usage');
  });

  it('should accept custom semantic name', () => {
    const { container } = render(
      <{{ComponentName}} semanticName="Custom{{ComponentName}}" />
    );
    const element = container.firstChild as HTMLElement;
    
    expect(element).toHaveAttribute('data-semantic-name', 'Custom{{ComponentName}}');
  });

  it('should accept custom semantic role', () => {
    const { container } = render(
      <{{ComponentName}} semanticRole="custom-role" />
    );
    const element = container.firstChild as HTMLElement;
    
    expect(element).toHaveAttribute('data-semantic-role', 'custom-role');
  });

  it('should merge custom AI metadata', () => {
    const customMetadata = {
      description: 'Custom description',
      category: 'custom-category' as const,
      complexity: 'simple' as const,
      accessibility: ['custom-feature'],
      usage: ['custom-usage']
    };
    
    const { container } = render(
      <{{ComponentName}} aiMetadata={customMetadata} />
    );
    const element = container.firstChild as HTMLElement;
    const metadata = JSON.parse(element.getAttribute('data-ai-metadata') || '{}');
    
    expect(metadata.description).toBe('Custom description');
  });

  // Add component-specific tests here
  it('should auto-infer semantic properties from props', () => {
    // Test auto-inference logic
  });

  it('should preserve PatternFly functionality', () => {
    // Test that all PatternFly props work
  });

  it('should be accessible', () => {
    // Test accessibility features
  });
});


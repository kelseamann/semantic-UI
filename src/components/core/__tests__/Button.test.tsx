import { describe, it, expect } from '@jest/globals';
import { inferButtonAction, inferContext, inferCategory } from '../../../utils/inference';

describe('Button - Build Image Example', () => {
  describe('inferButtonAction', () => {
    it('should return type "action" and variant "primary" for Build Image button', () => {
      const result = inferButtonAction('primary', undefined, () => {}, undefined);
      
      expect(result).toEqual({
        type: 'action',
        variant: 'primary'
      });
    });
  });

  describe('inferContext', () => {
    it('should return "active" for button with onClick handler', () => {
      const result = inferContext({ onClick: () => {} });
      
      expect(result).toBe('active');
    });
  });

  describe('inferCategory', () => {
    it('should return "button" for Button component', () => {
      const result = inferCategory('Button');
      
      expect(result).toBe('button');
    });
  });

  describe('Full metadata for Build Image button', () => {
    it('should generate complete metadata', () => {
      // Simulate: <Button variant="primary" onClick={buildImage}>Build Image</Button>
      const variant = 'primary';
      const onClick = () => console.log('Building image...');
      
      const inferredAction = inferButtonAction(variant, undefined, onClick, undefined);
      const inferredContext = inferContext({ onClick });
      const category = inferCategory('Button');
      
      expect(inferredAction.type).toBe('action');
      expect(inferredAction.variant).toBe('primary');
      expect(inferredContext).toBe('active');
      expect(category).toBe('button');
      
      // Expected metadata structure
      const expectedMetadata = {
        description: 'action action button (primary style) for active context',
        category: 'button',
        action: {
          type: 'action',
          variant: 'primary'
        }
      };
      
      expect(inferredAction.type).toBe(expectedMetadata.action.type);
      expect(inferredAction.variant).toBe(expectedMetadata.action.variant);
      expect(category).toBe(expectedMetadata.category);
    });
  });
});

describe('Button - Additional test cases', () => {
  describe('Navigation button', () => {
    it('should return type "navigation" and variant "primary" for navigation button', () => {
      const result = inferButtonAction('primary', '/dashboard', undefined, undefined);
      
      expect(result).toEqual({
        type: 'navigation',
        variant: 'primary'
      });
    });
  });

  describe('External link button', () => {
    it('should return type "external" for external link', () => {
      const result = inferButtonAction('secondary', 'https://docs.com', undefined, undefined);
      
      expect(result).toEqual({
        type: 'external',
        variant: 'secondary'
      });
    });
  });

  describe('Destructive button', () => {
    it('should return variant "destructive" for danger variant', () => {
      const result = inferButtonAction('danger', undefined, () => {}, undefined);
      
      expect(result).toEqual({
        type: 'action',
        variant: 'destructive'
      });
    });
  });

  describe('Context variations', () => {
    it('should return "disabled" for disabled button', () => {
      const result = inferContext({ isDisabled: true });
      expect(result).toBe('disabled');
    });

    it('should return "readonly" for readonly button', () => {
      const result = inferContext({ isReadOnly: true });
      expect(result).toBe('readonly');
    });

    it('should return "default" for button with no special props', () => {
      const result = inferContext({});
      expect(result).toBe('default');
    });
  });
});


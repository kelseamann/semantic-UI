import React from 'react';
import { Select as PFSelect } from '@patternfly/react-core';
import { SemanticComponentProps } from '../../types';
export interface SelectProps extends Omit<React.ComponentProps<typeof PFSelect>, 'children'>, SemanticComponentProps {
    children?: React.ReactNode;
    /** The semantic purpose of this select */
    purpose?: 'category-selection' | 'filter' | 'setting' | 'navigation' | 'data-entry';
    /** The context where this select is used */
    context?: 'form' | 'toolbar' | 'filter-bar' | 'settings' | 'navigation';
    /** Selection behavior */
    selectionType?: 'single' | 'multiple' | 'typeahead';
}
/**
 * Select - PatternFly Select wrapper with semantic metadata for AI tooling
 *
 * @example
 * ```tsx
 * <Select
 *   purpose="category-selection"
 *   context="form"
 *   isOpen={isOpen}
 *   onToggle={handleToggle}
 *   selections={selected}
 *   onSelect={handleSelect}
 * >
 *   <SelectOption value="option1" />
 *   <SelectOption value="option2" />
 * </Select>
 * ```
 */
export declare const Select: React.FC<SelectProps>;
export default Select;
//# sourceMappingURL=Select.d.ts.map
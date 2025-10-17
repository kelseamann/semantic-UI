import React from 'react';
import { Drawer as PFDrawer } from '@patternfly/react-core';
import { SemanticComponentProps } from '../../types';
export interface DrawerProps extends Omit<React.ComponentProps<typeof PFDrawer>, 'children'>, SemanticComponentProps {
    children?: React.ReactNode;
    /** The semantic purpose of this drawer */
    purpose?: 'navigation' | 'filter' | 'details' | 'form' | 'settings';
}
/** Drawer - PatternFly Drawer wrapper with semantic metadata for AI tooling */
export declare const Drawer: React.FC<DrawerProps>;
export default Drawer;
//# sourceMappingURL=Drawer.d.ts.map
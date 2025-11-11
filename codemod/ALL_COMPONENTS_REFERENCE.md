# Complete Component Reference - All Data-* Attributes

This file documents all PatternFly components we've implemented and their possible data-* attribute values.

**Note:** This is a reference for testing. For implementation details, see `ATTRIBUTE_DECISION_LOGIC.md`.

## Format

Each component lists all 7 attributes with their possible values as arrays:
- Empty array `[]` means the attribute is not applicable or always returns `null`
- Values can combine (e.g., variants like `"primary-danger"`)
- Some values are inferred from props or parent context (not listed exhaustively here)

---

## Core Components

### Button
- **data-role**: `["button"]`
- **data-purpose**: `["action"]`
- **data-variant**: `["primary", "secondary", "tertiary", "danger", "warning", "link", "plain", "control"]`
- **data-context**: `["form", "modal", "toolbar", "table", "card", "page", "masthead", "wizard"]` (inherits from parent)
- **data-state**: `["disabled", "loading", "active"]`
- **data-action-type**: `["destructive"]` (if variant="danger"), otherwise `[]`
- **data-size**: `["sm", "lg"]` (if size prop provided), otherwise `[]`

### Link
- **data-role**: `["link"]`
- **data-purpose**: `["action", "navigation"]` (navigation if href prop)
- **data-variant**: `["default"]`
- **data-context**: `["form", "modal", "page", "card", "table"]` (inherits from parent)
- **data-state**: `["disabled"]`
- **data-action-type**: `["navigation"]` (if href), otherwise `[]`
- **data-size**: `[]`

### Card
- **data-role**: `["card", "card-body", "card-header", "card-title"]`
- **data-purpose**: `["display", "selectable", "clickable", "clickable and selectable"]`
- **data-variant**: `["selectable", "clickable", "selectable-raised", "flat", "rounded", "full-height", "plain"]`
- **data-context**: `["page", "table", "form", "modal"]` (inherits from parent)
- **data-state**: `["selected", "unselected", "disabled"]`
- **data-action-type**: `[]`
- **data-size**: `[]`

---

## Form Components

### Form
- **data-role**: `["form"]`
- **data-purpose**: `["form-container", "create", "edit", "search", "filter"]` (from action prop or explicit purpose prop)
- **data-variant**: `["horizontal", "vertical"]`
- **data-context**: `["page", "modal", "drawer"]` (inherits from parent)
- **data-state**: `[]`
- **data-action-type**: `[]`
- **data-size**: `[]`

### TextInput
- **data-role**: `["text-input"]`
- **data-purpose**: `["input"]`
- **data-variant**: `["default"]`
- **data-context**: `["form", "authentication"]` (inherits from parent, or "form" if parent is LoginForm)
- **data-state**: `["disabled", "read-only", "error", "warning", "active"]`
- **data-action-type**: `[]`
- **data-size**: `[]`

### TextArea
- **data-role**: `["text-area"]`
- **data-purpose**: `["input"]`
- **data-variant**: `["default"]`
- **data-context**: `["form", "authentication"]` (inherits from parent)
- **data-state**: `["disabled", "read-only", "error", "warning", "active"]`
- **data-action-type**: `[]`
- **data-size**: `[]`

### TextInputGroup
- **data-role**: `["text-input-group"]`
- **data-purpose**: `["input"]`
- **data-variant**: `["basic", "with-icon", "with-clear-button", "with-label-group"]` (can combine)
- **data-context**: `["form", "toolbar", "page"]` (inherits from parent or defaults to "form")
- **data-state**: `["active", "disabled", "error", "warning"]`
- **data-action-type**: `[]`
- **data-size**: `[]`

### Select
- **data-role**: `["select", "select-option", "select-option-group", "select-toggle"]`
- **data-purpose**: `["option-selection", "toggle-trigger"]`
- **data-variant**: `["single", "checkbox", "typeahead", "plain"]`
- **data-context**: `["form", "toolbar", "table", "page"]` (inherits from parent)
- **data-state**: `["open", "closed", "selected", "disabled"]`
- **data-action-type**: `[]`
- **data-size**: `[]`

### Checkbox
- **data-role**: `["checkbox"]`
- **data-purpose**: `["input"]`
- **data-variant**: `["default"]`
- **data-context**: `["form", "table", "toolbar"]` (inherits from parent)
- **data-state**: `["checked", "unchecked", "disabled", "indeterminate"]`
- **data-action-type**: `[]`
- **data-size**: `[]`

### Radio
- **data-role**: `["radio"]`
- **data-purpose**: `["input"]`
- **data-variant**: `["default"]`
- **data-context**: `["form", "table"]` (inherits from parent)
- **data-state**: `["checked", "unchecked", "disabled"]`
- **data-action-type**: `[]`
- **data-size**: `[]`

### Switch
- **data-role**: `["switch"]`
- **data-purpose**: `["input"]`
- **data-variant**: `["labeled", "unlabeled", "reversed", "with-checkmark"]`
- **data-context**: `["form", "table", "page"]` (inherits from parent or defaults to "form")
- **data-state**: `["checked", "unchecked", "disabled"]`
- **data-action-type**: `["toggle"]`
- **data-size**: `[]`

### Slider
- **data-role**: `["slider"]`
- **data-purpose**: `["input"]`
- **data-variant**: `["continuous", "discrete", "with-input", "with-thumb-value", "with-buttons", "with-lock", "with-helper-text"]`
- **data-context**: `["form", "page"]` (inherits from parent or defaults to "form")
- **data-state**: `["locked", "disabled", "error", "warning", "active"]`
- **data-action-type**: `[]`
- **data-size**: `[]`

### FileUpload / MultipleFileUpload / FileUploadField
- **data-role**: `["file-upload"]`
- **data-purpose**: `["file-input"]`
- **data-variant**: `["single", "multiple", "field"]`
- **data-context**: `["form", "page"]` (inherits from parent)
- **data-state**: `["loading", "error", "editable", "non-editable"]`
- **data-action-type**: `[]`
- **data-size**: `[]`

### PasswordGenerator
- **data-role**: `["password-generator"]`
- **data-purpose**: `["password-generation"]`
- **data-variant**: `["basic", "with-options", "with-copy"]`
- **data-context**: `["form", "authentication"]` (inherits from parent)
- **data-state**: `["generating", "ready"]`
- **data-action-type**: `[]`
- **data-size**: `[]`

### PasswordStrength
- **data-role**: `["password-strength"]`
- **data-purpose**: `["password-validation"]`
- **data-variant**: `["basic", "with-requirements", "with-toggle"]`
- **data-context**: `["form", "authentication"]` (inherits from parent)
- **data-state**: `["weak", "fair", "good", "strong"]`
- **data-action-type**: `[]`
- **data-size**: `[]`

### InputGroup
- **data-role**: `["input-group"]`
- **data-purpose**: `["input"]`
- **data-variant**: `["with-button-left", "with-button-right", "with-buttons-both", "with-icon-before", "with-icon-after", "with-text-prefix", "with-text-suffix", "search"]` (from children analysis)
- **data-context**: `["form", "toolbar", "page"]` (inherits from parent)
- **data-state**: `["disabled", "error", "warning", "active"]`
- **data-action-type**: `[]`
- **data-size**: `[]`

### LoginForm
- **data-role**: `["login-form"]`
- **data-purpose**: `["authentication"]`
- **data-variant**: `["basic", "show-hide-password", "customized-header-utilities"]` (from children analysis)
- **data-context**: `["page"]` (defaults to "page")
- **data-state**: `[]`
- **data-action-type**: `[]`
- **data-size**: `[]`

---

## Navigation Components

### Nav / NavList / NavItem / NavGroup / NavExpandable / NavSection
- **data-role**: `["navigation", "navigation-list", "navigation-item", "navigation-group", "navigation-expandable", "navigation-section"]`
- **data-purpose**: `["navigation", "grouping"]`
- **data-variant**: `["vertical", "horizontal", "simple", "grouped", "expandable-2-level", "expandable-3-level", "flyout", "drilldown", "primary", "secondary", "with-icon", "with-title", "scrollable"]`
- **data-context**: `["masthead", "overlay", "page", "sidebar"]` (horizontal in masthead, vertical in drawer/overlay, vertical in page sidebar)
- **data-state**: `["active", "disabled", "expanded", "collapsed"]`
- **data-action-type**: `[]`
- **data-size**: `[]`

### JumpLinks / JumpLinksItem
- **data-role**: `["jump-links", "jump-link-item"]`
- **data-purpose**: `["navigation"]`
- **data-variant**: `["vertical", "horizontal-links", "expandable"]`
- **data-context**: `["page"]` (rendered as "in-page" in HTML)
- **data-state**: `["expanded", "collapsed"]` (container), `["active"]` (item)
- **data-action-type**: `[]`
- **data-size**: `[]`

### Tabs / Tab
- **data-role**: `["tabs", "tab"]`
- **data-purpose**: `["navigation"]`
- **data-variant**: `["horizontal", "vertical", "primary", "secondary", "filled", "with-overflow"]` (can combine)
- **data-context**: `["page", "modal", "component"]` (inherits from parent or defaults to "page")
- **data-state**: `["selected", "unselected", "disabled"]` (tab items only)
- **data-action-type**: `["navigation"]`
- **data-size**: `[]`

### Pagination
- **data-role**: `["pagination"]`
- **data-purpose**: `["navigation"]`
- **data-variant**: `["full", "compact", "indeterminate"]`
- **data-context**: `["page", "table", "card"]` (inherits from parent or defaults to "page")
- **data-state**: `[]`
- **data-action-type**: `[]`
- **data-size**: `[]`

### Breadcrumb / BreadcrumbItem / BreadcrumbHeading
- **data-role**: `["breadcrumb", "breadcrumb-item", "breadcrumb-heading"]`
- **data-purpose**: `["navigation"]`
- **data-variant**: `["default"]`
- **data-context**: `["page", "modal"]` (inherits from parent)
- **data-state**: `[]`
- **data-action-type**: `[]`
- **data-size**: `[]`

### SkipToContent
- **data-role**: `["skip-link"]`
- **data-purpose**: `["navigation"]`
- **data-variant**: `["basic"]`
- **data-context**: `["page"]` (rendered as "in-page" in HTML)
- **data-state**: `[]`
- **data-action-type**: `["navigation"]`
- **data-size**: `[]`

---

## Menu Components

### Menu / MenuList / MenuItem / MenuGroup / MenuSearch / MenuSearchInput
- **data-role**: `["menu", "menu-list", "menu-item", "menu-group", "menu-search", "menu-search-input"]`
- **data-purpose**: `["menu", "menu-action", "search", "grouping", "menu-container"]`
- **data-variant**: `["grid", "list", "with-favorites", "with-search", "plain", "with-kebab-toggle", "single", "checkbox", "typeahead", "split-button", "scrollable", "with-icon", "with-description", "action", "navigation"]` (from children analysis)
- **data-context**: `["masthead", "form", "page", "overlay"]` (inherits from parent)
- **data-state**: `["open", "closed", "selected", "checked", "disabled", "favorite"]`
- **data-action-type**: `[]`
- **data-size**: `[]`

### Dropdown / DropdownItem
- **data-role**: `["dropdown", "dropdown-item"]`
- **data-purpose**: `["menu", "menu-action"]`
- **data-variant**: `["basic", "split-button", "action-menu", "kebab"]` (from children analysis)
- **data-context**: `["masthead", "form", "table", "page", "overlay"]` (inherits from parent)
- **data-state**: `["open", "closed", "disabled"]`
- **data-action-type**: `[]`
- **data-size**: `[]`

### Select / SelectOption / SelectOptionGroup / SelectToggle
- **data-role**: `["select", "select-option", "select-option-group", "select-toggle"]`
- **data-purpose**: `["option-selection", "toggle-trigger"]`
- **data-variant**: `["single", "checkbox", "typeahead", "plain"]`
- **data-context**: `["form", "toolbar", "table", "page"]` (inherits from parent)
- **data-state**: `["open", "closed", "selected", "disabled"]`
- **data-action-type**: `[]`
- **data-size**: `[]`

### OptionsMenu / OptionsMenuToggle
- **data-role**: `["options-menu", "options-menu-toggle"]`
- **data-purpose**: `["settings", "toggle-trigger"]`
- **data-variant**: `["plain", "with-kebab-toggle"]` (from children analysis)
- **data-context**: `["table", "card", "toolbar", "page"]` (inherits from parent)
- **data-state**: `["open", "closed"]`
- **data-action-type**: `[]`
- **data-size**: `[]`

### ApplicationLauncher / ApplicationLauncherMenu / ApplicationLauncherItem
- **data-role**: `["application-launcher", "application-launcher-menu", "application-launcher-item"]`
- **data-purpose**: `["application-switching", "application-selection"]`
- **data-variant**: `["grid", "list", "with-favorites"]` (from children analysis)
- **data-context**: `["masthead"]` (typically in masthead)
- **data-state**: `["open", "closed", "favorite"]`
- **data-action-type**: `[]`
- **data-size**: `[]`

### ContextSelector / ContextSelectorMenu / ContextSelectorItem
- **data-role**: `["context-selector", "context-selector-menu", "context-selector-item"]`
- **data-purpose**: `["context-selection"]`
- **data-variant**: `["basic"]` (from children analysis)
- **data-context**: `["masthead", "page"]` (inherits from parent)
- **data-state**: `["open", "closed"]`
- **data-action-type**: `[]`
- **data-size**: `[]`

### MenuToggle
- **data-role**: `["menu-toggle"]`
- **data-purpose**: `["toggle-trigger"]`
- **data-variant**: `["default"]`
- **data-context**: `["masthead", "form", "page", "overlay"]` (inherits from parent)
- **data-state**: `["open", "closed"]`
- **data-action-type**: `[]`
- **data-size**: `[]`

### OverflowMenu / OverflowMenuItem
- **data-role**: `["overflow-menu", "overflow-menu-item"]`
- **data-purpose**: `["action-group", "action"]`
- **data-variant**: `["with-kebab-toggle", "responsive"]` (container), `["basic", "with-icon", "with-description"]` (item)
- **data-context**: `["toolbar", "table", "card", "page"]` (inherits from parent or defaults to "page")
- **data-state**: `["open", "closed"]`
- **data-action-type**: `[]`
- **data-size**: `[]`

---

## Layout Components

### Page / PageSection / PageHeader / PageBody / PageFooter
- **data-role**: `["page", "page-section", "page-header", "page-body", "page-footer"]`
- **data-purpose**: `["page-container", "header", "content", "footer"]`
- **data-variant**: `["basic", "with-vertical-nav", "with-horizontal-nav", "with-breadcrumb", "with-footer"]` (Page), `["basic", "sticky-top", "sticky-bottom", "no-padding"]` (PageSection)
- **data-context**: `[]` (Page is root), `["page"]` (children get "page" context)
- **data-state**: `[]`
- **data-action-type**: `[]`
- **data-size**: `[]`

### Sidebar / SidebarContent / SidebarPanel
- **data-role**: `["sidebar", "sidebar-content", "sidebar-panel"]`
- **data-purpose**: `["layout", "content", "navigation"]`
- **data-variant**: `["stacked", "side-by-side", "sticky", "responsive"]`
- **data-context**: `["page"]` (Sidebar), `["sidebar"]` (children inherit "sidebar" context)
- **data-state**: `[]`
- **data-action-type**: `[]`
- **data-size**: `[]`

### Flex / FlexItem
- **data-role**: `["flex", "flex-item"]`
- **data-purpose**: `["layout"]`
- **data-variant**: `["default"]`
- **data-context**: `["page", "card", "form", "modal"]` (inherits from parent)
- **data-state**: `[]`
- **data-action-type**: `[]`
- **data-size**: `[]`

### Panel / PanelHeader / PanelBody / PanelFooter
- **data-role**: `["panel", "panel-header", "panel-body", "panel-footer"]`
- **data-purpose**: `["container", "header", "content", "footer"]`
- **data-variant**: `["basic", "with-header", "with-footer", "scrollable", "raised"]`
- **data-context**: `["dropdown", "search", "page"]` (inherits from parent or defaults to "page")
- **data-state**: `[]`
- **data-action-type**: `[]`
- **data-size**: `[]`

---

## Display Components

### List / ListItem
- **data-role**: `["list", "list-item"]`
- **data-purpose**: `["display"]`
- **data-variant**: `["ordered", "unordered", "horizontal", "with-icons", "small-icons", "big-icons"]` (from children analysis)
- **data-context**: `["page", "card", "form", "modal"]` (inherits from parent)
- **data-state**: `[]`
- **data-action-type**: `[]`
- **data-size**: `[]`

### SimpleList / SimpleListItem / SimpleListTitle
- **data-role**: `["list", "list-item", "section-title"]`
- **data-purpose**: `["display", "header"]`
- **data-variant**: `["basic", "grouped", "with-links"]`
- **data-context**: `["page", "sidebar", "panel", "form"]` (inherits from parent or defaults to "page")
- **data-state**: `["selected", "default"]` (SimpleListItem)
- **data-action-type**: `[]`
- **data-size**: `[]`

### DataList / DataListItem / DataListCell / DataListCheck / DataListContent / DataListControl / DataListToggle
- **data-role**: `["data-list", "row", "cell", "checkbox", "content-panel", "control", "toggle"]`
- **data-purpose**: `["data-display", "selection", "display", "action"]`
- **data-variant**: `["basic", "compact", "with-actions", "with-icons"]` (from children analysis)
- **data-context**: `["page", "card", "form"]` (inherits from parent)
- **data-state**: `["selected", "expanded", "collapsed"]` (DataListItem)
- **data-action-type**: `[]`
- **data-size**: `[]`

### DescriptionList / DescriptionListGroup / DescriptionListTerm / DescriptionListItem / DescriptionListDescription
- **data-role**: `["description-list", "description-group", "description-label", "description-pair", "description-value"]`
- **data-purpose**: `["data-display", "term-group", "term-label", "term-pair", "term-value"]`
- **data-variant**: `["vertical", "horizontal", "with-columns"]`
- **data-context**: `["page", "card", "form"]` (inherits from parent)
- **data-state**: `["editing"]` (DescriptionListDescription if editable)
- **data-action-type**: `[]`
- **data-size**: `[]`

### TreeView / TreeViewItem
- **data-role**: `["tree-view", "tree-view-item"]`
- **data-purpose**: `["display", "selection"]`
- **data-variant**: `["basic", "with-search", "with-checkboxes", "with-badges", "with-icons", "with-actions", "compact"]` (can combine)
- **data-context**: `["wizard", "drawer", "modal", "page"]` (inherits from parent or defaults to "page")
- **data-state**: `["selected", "expanded", "collapsed", "disabled"]` (TreeViewItem)
- **data-action-type**: `["selection"]`
- **data-size**: `[]`

### Timestamp
- **data-role**: `["timestamp"]`
- **data-purpose**: `["display"]`
- **data-variant**: `["24-hour", "12-hour", "abbreviated-date"]` (can combine)
- **data-context**: `["table", "card", "page"]` (inherits from parent or defaults to "page")
- **data-state**: `[]`
- **data-action-type**: `[]`
- **data-size**: `[]`

### Title
- **data-role**: `["title"]`
- **data-purpose**: `["header"]`
- **data-variant**: `["h1", "h2", "h3", "h4", "h5", "h6"]` (default: "h1")
- **data-context**: `["page", "modal", "card", "form"]` (inherits from parent or defaults to "page")
- **data-state**: `[]`
- **data-action-type**: `[]`
- **data-size**: `[]`

### Truncate
- **data-role**: `["truncate"]`
- **data-purpose**: `["display"]`
- **data-variant**: `["front-line", "mid-line", "end-line"]` (default: "end-line")
- **data-context**: `["table", "card", "page", "alert"]` (inherits from parent or defaults to "page")
- **data-state**: `[]`
- **data-action-type**: `[]`
- **data-size**: `[]`

### CodeBlock
- **data-role**: `["code-block"]`
- **data-purpose**: `["display"]`
- **data-variant**: `["default"]`
- **data-context**: `["page", "card"]` (inherits from parent)
- **data-state**: `[]`
- **data-action-type**: `[]`
- **data-size**: `[]`

### Content
- **data-role**: `["content"]`
- **data-purpose**: `["display"]`
- **data-variant**: `["default"]`
- **data-context**: `["page", "card", "form"]` (inherits from parent)
- **data-state**: `[]`
- **data-action-type**: `[]`
- **data-size**: `[]`

---

## Overlay Components

### Modal / ModalHeader / ModalBody / ModalFooter / ModalCloseButton / ModalToggleButton
- **data-role**: `["modal", "modal-header", "modal-body", "modal-footer", "close-button", "modal-toggle"]`
- **data-purpose**: `["overlay", "header", "content", "footer", "close-action", "toggle-trigger"]`
- **data-variant**: `["small", "medium", "large", "full-width", "basic", "with-form", "with-wizard", "confirmation", "information"]`
- **data-context**: `["overlay"]` (Modal), `["overlay"]` (children inherit)
- **data-state**: `["open", "closed"]` (Modal)
- **data-action-type**: `[]`
- **data-size**: `[]`

### Drawer
- **data-role**: `["drawer"]`
- **data-purpose**: `["overlay"]`
- **data-variant**: `["basic", "with-tooltips", "with-search", "with-actions", "with-tree", "draggable", "draggable-multiple-drop-zones"]` (from children analysis)
- **data-context**: `["overlay"]` (or inherits from parent if in card/form)
- **data-state**: `["open", "closed"]`
- **data-action-type**: `[]`
- **data-size**: `[]`

### Popover
- **data-role**: `["popover"]`
- **data-purpose**: `["guidance"]`
- **data-variant**: `["default", "hoverable", "closeable", "dismissible", "actionable"]` (can combine)
- **data-context**: `["form", "table", "page"]` (inherits from parent or defaults to "page")
- **data-state**: `["open", "closed"]`
- **data-action-type**: `[]`
- **data-size**: `[]`

### Tooltip
- **data-role**: `["tooltip"]`
- **data-purpose**: `["guidance"]`
- **data-variant**: `["default"]`
- **data-context**: `["form", "table", "page", "toolbar"]` (inherits from parent or defaults to "page")
- **data-state**: `["open", "closed"]`
- **data-action-type**: `[]`
- **data-size**: `[]`

---

## Feedback Components

### Alert / AlertGroup / Hint
- **data-role**: `["alert", "alert-group"]` (Hint uses "alert" role)
- **data-purpose**: `["notification", "guidance"]` (Hint is "guidance")
- **data-variant**: `["success", "danger", "warning", "info", "default", "hint"]` (Hint variant)
- **data-context**: `["page", "form", "modal", "card"]` (inherits from parent)
- **data-state**: `["expanded", "collapsed"]` (AlertGroup)
- **data-action-type**: `["actionable"]` (if has action link)
- **data-size**: `[]`

### Banner
- **data-role**: `["banner"]`
- **data-purpose**: `["notification"]`
- **data-variant**: `["default"]`
- **data-context**: `["page", "masthead"]` (inherits from parent)
- **data-state**: `[]`
- **data-action-type**: `[]`
- **data-size**: `[]`

### NotificationBadge
- **data-role**: `["notification-badge"]`
- **data-purpose**: `["notification-trigger"]`
- **data-variant**: `["basic", "unread", "attention", "with-count"]`
- **data-context**: `["masthead"]` (typically in masthead)
- **data-state**: `["unread", "attention"]`
- **data-action-type**: `[]`
- **data-size**: `[]`

### NotificationDrawer / NotificationDrawerHeader / NotificationDrawerBody / NotificationDrawerGroup / NotificationDrawerGroupToggle / NotificationDrawerList / NotificationDrawerListItem
- **data-role**: `["notification-drawer", "notification-drawer-header", "notification-drawer-body", "notification-group", "notification-group-toggle", "notification-list", "notification-item"]`
- **data-purpose**: `["notification-history", "header", "content", "grouping", "toggle-trigger", "notification-container", "notification"]`
- **data-variant**: `["basic", "grouped"]`
- **data-context**: `["overlay"]` (NotificationDrawer), `["overlay"]` (children inherit)
- **data-state**: `["open", "closed"]` (NotificationDrawer), `["expanded", "collapsed"]` (NotificationDrawerGroup), `["read", "unread"]` (NotificationDrawerListItem)
- **data-action-type**: `[]`
- **data-size**: `[]`

---

## Interactive Components

### Accordion / AccordionItem / AccordionContent / AccordionToggle
- **data-role**: `["accordion", "accordion-section", "accordion-panel", "accordion-header"]`
- **data-purpose**: `["collapsible-content"]`
- **data-variant**: `["default", "bordered"]`
- **data-context**: `["page", "card", "form"]` (inherits from parent)
- **data-state**: `["expanded", "collapsed"]` (AccordionItem)
- **data-action-type**: `[]`
- **data-size**: `[]`

### ExpandableSection
- **data-role**: `["expandable-section"]`
- **data-purpose**: `["collapsible-content"]`
- **data-variant**: `["disclosure", "truncate", "detached"]`
- **data-context**: `["page", "card", "form"]` (inherits from parent)
- **data-state**: `["expanded", "collapsed"]`
- **data-action-type**: `[]`
- **data-size**: `[]`

### InlineEdit / InlineEditToggle / InlineEditActionGroup / InlineEditInput
- **data-role**: `["inline-edit", "edit-trigger", "button-group", "editable-input"]`
- **data-purpose**: `["editing", "toggle-trigger", "action", "input"]`
- **data-variant**: `["field-specific", "full-page", "row-editing"]` (InlineEdit - detects if in table row)
- **data-context**: `["table", "page"]` (InlineEdit - "table" if in table row, otherwise "page")
- **data-state**: `["read-only", "edit"]` (InlineEdit)
- **data-action-type**: `[]`
- **data-size**: `[]`

### ToggleGroup / ToggleItem
- **data-role**: `["toggle-group", "toggle-item"]`
- **data-purpose**: `["selection"]`
- **data-variant**: `["single-select", "multi-select"]` (ToggleGroup)
- **data-context**: `["toolbar", "page", "form"]` (inherits from parent or defaults to "page")
- **data-state**: `["selected", "unselected", "disabled"]` (ToggleItem)
- **data-action-type**: `["selection"]` (ToggleGroup)
- **data-size**: `[]`

---

## Table Components

### Table (Tr / Td / Th / Thead / Tbody)
- **data-role**: `["table-row", "table-cell", "table-header", "table-head", "table-body"]`
- **data-purpose**: `["data-display"]`
- **data-variant**: `["default"]`
- **data-context**: `["page", "card", "modal"]` (inherits from parent)
- **data-state**: `["selected"]` (Tr if selectable)
- **data-action-type**: `[]`
- **data-size**: `[]`

---

## Action Components

### ActionList / ActionListItem
- **data-role**: `["action-group", "action-item"]`
- **data-purpose**: `["action"]`
- **data-variant**: `["basic", "icons", "links"]` (from children analysis)
- **data-context**: `["modal", "wizard", "toolbar", "form", "page"]` (inherits from parent)
- **data-state**: `[]`
- **data-action-type**: `[]`
- **data-size**: `[]`

### Toolbar / ToolbarItem / ToolbarItemGroup
- **data-role**: `["toolbar", "toolbar-item", "toolbar-item-group"]`
- **data-purpose**: `["action-group", "action", "grouping"]`
- **data-variant**: `["basic", "custom", "with-toggle-group", "sticky"]` (Toolbar)
- **data-context**: `["page", "table", "card"]` (Toolbar), `["toolbar"]` (children inherit "toolbar" context)
- **data-state**: `[]`
- **data-action-type**: `[]`
- **data-size**: `[]`

---

## Status Components

### Progress
- **data-role**: `["progress"]`
- **data-purpose**: `["status-tracking"]`
- **data-variant**: `["default", "small", "large"]`
- **data-context**: `["table", "card", "wizard", "popover", "page"]` (inherits from parent or defaults to "page")
- **data-state**: `["in-progress", "error", "success"]`
- **data-action-type**: `["determinate"]`
- **data-size**: `["small", "large"]`

### ProgressStepper
- **data-role**: `["progress-stepper"]`
- **data-purpose**: `["status-tracking"]`
- **data-variant**: `["basic", "with-descriptions", "vertical", "compact", "with-icons", "with-help-popover"]`
- **data-context**: `["wizard", "page", "card"]` (inherits from parent or defaults to "page")
- **data-state**: `["in-progress", "error", "success"]`
- **data-action-type**: `["determinate"]`
- **data-size**: `[]`

### Spinner
- **data-role**: `["spinner"]`
- **data-purpose**: `["status-tracking"]`
- **data-variant**: `["medium", "extra-small", "small", "large"]` (default: "medium")
- **data-context**: `["wizard", "modal", "page", "table"]` (inherits from parent or defaults to "page")
- **data-state**: `["loading"]`
- **data-action-type**: `["indeterminate"]`
- **data-size**: `["extra-small", "small", "medium", "large"]`

---

## Search Components

### SearchInput
- **data-role**: `["search-input"]`
- **data-purpose**: `["search"]`
- **data-variant**: `["basic", "advanced", "with-results", "with-count", "with-navigation"]`
- **data-context**: `["table", "toolbar", "page"]` (inherits from parent or defaults to "page")
- **data-state**: `["active", "disabled"]`
- **data-action-type**: `[]`
- **data-size**: `[]`

---

## Date/Time Components

### CalendarMonth
- **data-role**: `["calendar"]`
- **data-purpose**: `["date-input"]`
- **data-variant**: `["inline", "popover"]`
- **data-context**: `["form", "modal", "page"]` (inherits from parent)
- **data-state**: `["has-selection"]`
- **data-action-type**: `[]`
- **data-size**: `[]`

### DatePicker
- **data-role**: `["date-picker"]`
- **data-purpose**: `["date-input"]`
- **data-variant**: `["single", "range", "with-time", "range-with-time"]`
- **data-context**: `["form", "toolbar", "modal"]` (inherits from parent)
- **data-state**: `["open", "closed", "invalid"]`
- **data-action-type**: `[]`
- **data-size**: `[]`

### TimePicker
- **data-role**: `["time-picker"]`
- **data-purpose**: `["time-input"]`
- **data-variant**: `["12-hour", "24-hour"]`
- **data-context**: `["form", "toolbar", "modal"]` (inherits from parent)
- **data-state**: `["open", "closed", "invalid"]`
- **data-action-type**: `[]`
- **data-size**: `[]`

---

## Selection Components

### DualListSelector / DualListSelectorPane / DualListSelectorListItem
- **data-role**: `["dual-list-selector"]` (Pane and ListItem don't get roles - structural)
- **data-purpose**: `["select-from-options", "selection-pane", "selectable-item"]`
- **data-variant**: `["basic", "with-tree", "draggable"]` (container), `["available", "chosen", "with-search", "with-actions", "with-sort"]` (Pane), `["folder"]` (ListItem)
- **data-context**: `["page", "modal", "form"]` (inherits from parent)
- **data-state**: `["selected", "expanded", "collapsed"]` (ListItem), `["disabled"]` (Pane)
- **data-action-type**: `[]`
- **data-size**: `[]`

### DragDropContainer / DragDropSort / Droppable / Draggable
- **data-role**: `["drag-drop-container", "drag-drop-sort"]` (Droppable and Draggable don't get roles - structural)
- **data-purpose**: `["drag-drop-management", "sort-management", "drop-target", "drag-source"]`
- **data-variant**: `[]` (from variant prop if provided, lowercased)
- **data-context**: `["page", "card", "form"]` (inherits from parent)
- **data-state**: `["dragging"]` (Draggable), `["disabled"]` (Droppable)
- **data-action-type**: `[]`
- **data-size**: `[]`

---

## Label Components

### Label / LabelGroup
- **data-role**: `["label", "label-group"]`
- **data-purpose**: `["tag", "filter", "status-indicator", "tag-group"]` (Label: filter if dismissible, status-indicator if has status color, otherwise tag)
- **data-variant**: `["danger", "warning", "success", "info", "blue", "green", "orange", "red", "purple", "cyan", "gold", "filled", "outline", "with-icon"]` (can combine, e.g., "danger-filled-with-icon")
- **data-context**: `["filter", "page"]` (Label: "filter" if dismissible/editable, otherwise "page")
- **data-state**: `["overflow", "editable", "dismissible", "clickable"]`
- **data-action-type**: `[]`
- **data-size**: `["compact", "default"]`

---

## Empty State Components

### EmptyState
- **data-role**: `["empty-state"]`
- **data-purpose**: `["no-content"]`
- **data-variant**: `["extra-small", "small", "large", "extra-large", "full", "getting-started", "no-results", "required-configuration", "no-access", "back-end-failure", "success", "creation", "card"]` (size + use case, can combine)
- **data-context**: `["page", "card", "table", "form"]` (inherits from parent)
- **data-state**: `[]`
- **data-action-type**: `[]`
- **data-size**: `["extra-small", "small", "large", "extra-large", "full"]`

---

## Wizard Components

### Wizard / WizardNav / WizardNavItem / WizardBody / WizardFooter
- **data-role**: `["wizard", "wizard-nav-item"]` (WizardNav, WizardBody, WizardFooter are structural - skipped)
- **data-purpose**: `["form-container", "navigation", "content", "action"]`
- **data-variant**: `["modal", "in-page", "progressive", "with-sub-steps", "with-optional-steps", "with-drawer"]` (can combine, default: "modal")
- **data-context**: `["overlay", "page"]` (Wizard: "overlay" if modal, "page" if in-page), `["wizard"]` (children inherit "wizard" context)
- **data-state**: `["visited", "current", "disabled"]` (WizardNavItem)
- **data-action-type**: `["form"]` (Wizard)
- **data-size**: `[]`

---

## Masthead Components

### Masthead
- **data-role**: `["masthead"]`
- **data-purpose**: `["navigation"]`
- **data-variant**: `["basic", "with-vertical-nav"]` (from children analysis)
- **data-context**: `["page"]` (rendered as "in-page" in HTML)
- **data-state**: `[]`
- **data-action-type**: `[]`
- **data-size**: `[]`

### Brand
- **data-role**: `["logo"]`
- **data-purpose**: `["navigation", "display"]` (navigation if interactive, display if decorative)
- **data-variant**: `["default"]`
- **data-context**: `["masthead", "page"]` (inherits from parent)
- **data-state**: `[]`
- **data-action-type**: `[]`
- **data-size**: `[]`

---

## Icon Components

### Icons (any component ending with "Icon")
- **data-role**: `["icon"]`
- **data-purpose**: `["action", "display"]` (action if onClick, display if decorative)
- **data-variant**: `[icon name extracted from component name]` (e.g., "StarIcon" → "star")
- **data-context**: `["form", "table", "page", "toolbar", "card"]` (inherits from parent)
- **data-state**: `["danger", "warning", "success", "info"]` (from color prop)
- **data-action-type**: `[]`
- **data-size**: `["sm", "md", "lg", "xl", "2xl", "3xl"]`

---

## Utility Components

### Divider
- **data-role**: `["divider"]`
- **data-purpose**: `["separator"]`
- **data-variant**: `["horizontal", "vertical"]`
- **data-context**: `["page", "card", "form"]` (inherits from parent)
- **data-state**: `[]`
- **data-action-type**: `[]`
- **data-size**: `[]`

### ClipboardCopy
- **data-role**: `["clipboard-copy"]`
- **data-purpose**: `["action"]`
- **data-variant**: `["default"]`
- **data-context**: `["page", "card", "form"]` (inherits from parent)
- **data-state**: `[]`
- **data-action-type**: `[]`
- **data-size**: `[]`

### Avatar
- **data-role**: `["avatar"]`
- **data-purpose**: `["display"]`
- **data-variant**: `["default"]`
- **data-context**: `["page", "card", "masthead"]` (inherits from parent)
- **data-state**: `[]`
- **data-action-type**: `[]`
- **data-size**: `[]`

---

## Notes

1. **Structural Children**: Some components have structural children that are skipped (don't get attributes). These are listed in `transform.js` in the `structuralChildren` array.

2. **Context Inheritance**: Many components inherit context from their parent. See `ATTRIBUTE_DECISION_LOGIC.md` for details.

3. **Children Analysis**: Some components analyze their children to infer variants (InputGroup, List, LoginForm, DualListSelector, Masthead, Menu/Dropdown/Select).

4. **Variant Combinations**: Variants can combine (e.g., `"primary-danger"` for a primary button that's also danger). The codemod joins them with hyphens.

5. **Empty Arrays**: Empty arrays `[]` mean the attribute is not applicable or always returns `null` for that component.

6. **Dynamic Values**: Some values are inferred from props or parent context and aren't listed exhaustively here. See `ATTRIBUTE_DECISION_LOGIC.md` for how these are determined.


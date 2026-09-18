# 12 — Screen Template

**Screen:** [Screen Name]  
**Role:** [Apprentice / Instructor / Coordinator]  
**Route / State:** [`/attendance/manual`, etc.]  

## Visual structure
- Institutional header with SENA emblem and active user identifier.
- Main card container with rounded corners (`rounded-2xl`) and dark slate styling.
- Prominent action button styled in SENA Green (`#39A900`).
- Toast notifications displaying status and validation errors.

## Interaction behavior
- Touch-friendly tap targets for mobile viewports (minimum 44x44px).
- Real-time feedback spinners during asynchronous server fetch calls.
- Clear error alerts displaying actionable instructions on rejection.

## Responsive breakpoints
- Mobile portrait (< 640px): Single-column card layout with full-width buttons.
- Desktop (>= 1024px): Multi-column grid with sidebar navigation.

## Accessibility compliance
- All input fields must have programmatic `aria-label` or `<label>` associations.
- Color contrast between foreground text and backgrounds meets 4.5:1 ratio.

---

**Related:** [`design-system.md`](./design-system.md)

const layouts = {
  SingleColumn: () => import('./layouts/SingleColumn'),
  TwoColumn: () => import('./layouts/TwoColumn'),
  SidebarLeft: () => import('./layouts/SidebarLeft'),
  HeaderBanner: () => import('./layouts/HeaderBanner'),
  Compact: () => import('./layouts/Compact'),
  Harvard: () => import('./layouts/Harvard'),
}

export async function loadPdfLayout(name) {
  const module = await (layouts[name] || layouts.SingleColumn)()
  return module.default
}

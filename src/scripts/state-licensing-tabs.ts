/** Section tabs on state licensing pages (progressive enhancement over hash links). */
export function initStateLicensingTabs(): void {
  document.querySelectorAll("[data-state-section-nav]").forEach((nav) => {
    const body = nav.parentElement;
    if (!body) {
      return;
    }
    const main = body.querySelector(".state-licensing-main--tabs");
    if (!main) {
      return;
    }

    const panels = [
      ...main.querySelectorAll<HTMLElement>(".state-section-panel"),
    ];
    const links = [
      ...nav.querySelectorAll<HTMLAnchorElement>("[data-state-section-link]"),
    ];
    if (panels.length === 0) {
      return;
    }

    function resolvePanelId(): string {
      const raw = decodeURIComponent(location.hash.slice(1));
      if (raw && panels.some((panel) => panel.id === raw)) {
        return raw;
      }
      return panels[0].id;
    }

    function apply(panelId: string): void {
      panels.forEach((panel) => {
        panel.classList.toggle(
          "state-section-panel--active",
          panel.id === panelId,
        );
      });
      links.forEach((link) => {
        const active = link.getAttribute("href") === `#${panelId}`;
        link.classList.toggle("state-page-nav__link--active", active);
        if (active) {
          link.setAttribute("aria-current", "location");
        } else {
          link.removeAttribute("aria-current");
        }
      });
    }

    function sync(): void {
      apply(resolvePanelId());
    }

    links.forEach((link) => {
      link.addEventListener("click", (event) => {
        const href = link.getAttribute("href");
        if (!href?.startsWith("#")) {
          return;
        }
        event.preventDefault();
        const panelId = href.slice(1);
        history.pushState(null, "", href);
        apply(panelId);
        const panel = panels.find((p) => p.id === panelId);
        panel?.focus({ preventScroll: true });
      });
    });

    window.addEventListener("hashchange", sync);
    sync();
  });
}

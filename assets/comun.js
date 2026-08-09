/* Luca — utilidades compartidas (build Vercel) */
/* ============================================================
   LUCA — Utilidades compartidas · Menú radial v2 · Texto libre
   ============================================================ */
window.Luca = {
  navegar(pagina) {
    const ROUTES = { Index: 'index', Abaco: 'abaco', CuboBase10: 'cubo-base10', Tangram: 'tangram', Fracciones: 'fracciones', FichasContadores: 'fichas-contadores', Geoplano: 'geoplano', Banco: 'banco' };
    const r = ROUTES[pagina] || 'index';
    /* file:// (QA local con doble clic) usa .html; en Vercel, rutas limpias */
    window.location.href = window.location.protocol === 'file:'
      ? r + '.html'
      : (r === 'index' ? '/' : '/' + r);
  },

  icons() { if (window.lucide) lucide.createIcons(); },

  capturar(el, prefijo) {
    if (!el) return;
    var overlay = document.createElement('div');
    overlay.className = 'flash-overlay';
    document.body.appendChild(overlay);
    if (typeof html2canvas === 'undefined') { overlay.remove(); return; }
    html2canvas(el, { backgroundColor: '#F7F8FA', scale: 2, logging: false }).then(function (c) {
      var link = document.createElement('a');
      link.href = c.toDataURL('image/png');
      link.download = prefijo + '-' + Date.now() + '.png';
      link.click();
      setTimeout(function () { overlay.remove(); }, 600);
    });
  },

  /* Long-press táctil: muestra tooltip sin ejecutar la acción */
  _longPress(node) {
    var timer = null;
    node.addEventListener('pointerdown', function (e) {
      if (e.pointerType !== 'touch') return;
      timer = setTimeout(function () { node.classList.add('show-tip'); node.dataset.lp = '1'; }, 450);
    });
    ['pointerup', 'pointerleave', 'pointercancel'].forEach(function (ev) {
      node.addEventListener(ev, function () {
        clearTimeout(timer);
        setTimeout(function () { node.classList.remove('show-tip'); delete node.dataset.lp; }, 1200);
      });
    });
  },

  /* Menú contextual radial junto a la pieza/texto seleccionado.
     actions: [{icon, tip, action, danger}] */
  ctxRadial(actions) {
    const wrap = document.createElement('div');
    wrap.className = 'ctx-radial';
    const R = 52, n = actions.length;
    actions.forEach((def, i) => {
      const a = (n > 1 ? 150 - i * (120 / (n - 1)) : 90) * Math.PI / 180;
      const el = document.createElement('button');
      el.className = 'ctx-node' + (def.danger ? ' is-danger' : '');
      el.dataset.action = def.action;
      el.dataset.tip = def.tip;
      el.setAttribute('aria-label', def.tip);
      el.style.setProperty('--tx', (R * Math.cos(a)).toFixed(1) + 'px');
      el.style.setProperty('--ty', (-R * Math.sin(a) - 14).toFixed(1) + 'px');
      el.style.setProperty('--i', i);
      el.innerHTML = '<i data-lucide="' + def.icon + '"></i>';
      Luca._longPress(el);
      wrap.appendChild(el);
    });
    return wrap;
  },

  /* ==========================================================
     MENÚ FLOTANTE RADIAL v2
     Posiciones horarias FIJAS (nunca cambian entre herramientas):
     12 Vista · 2 Capturar · 4 Reiniciar · 6 ⋯ Acciones · 8 Volver · 10 Texto
     ========================================================== */
  fab: {
    root: null, cfg: null, open: false, card: false,
    R: 105,
    CLOCK: { 12: 90, 2: 30, 4: -30, 6: -90, 8: 210, 10: 150 },

    init(cfg) {
      this.cfg = cfg;
      const root = document.createElement('div');
      root.className = 'fab2';
      root.innerHTML =
        '<div class="disc"></div>' +
        '<div class="tool-card" id="lucaToolCard"></div>' +
        '<button class="core" aria-label="Menú Luca"><span class="core-l">L<span class="core-dot">.</span></span></button>';
      document.body.appendChild(root);
      this.root = root;

      const RING = [
        { at: 12, id: 'vista',   icon: 'eye',        tip: cfg.vistaTip || 'Ver / ocultar total', run: cfg.vista, toggle: true, skip: !cfg.vista },
        { at: 2,  id: 'capture', icon: 'camera',     tip: 'Capturar imagen',                    run: cfg.capture },
        { at: 4,  id: 'reset',   icon: 'trash-2',    tip: cfg.resetTip || 'Reiniciar lienzo',   run: cfg.reset, danger: true },
        { at: 6,  id: 'tool',    icon: 'ellipsis',   tip: 'Acciones de la herramienta',         run: () => this.setCard(!this.card) },
        { at: 8,  id: 'help',    icon: 'circle-help', tip: 'Cómo se usa',                      run: () => Luca.guide.start() },
        { at: 10, id: 'text',    icon: 'type',       tip: 'Agregar texto',                      run: () => Luca.text.add() },
      ];
      RING.forEach((def, i) => {
        if (def.skip) return;   /* slot vacío: las demás posiciones no se mueven */
        const a = this.CLOCK[def.at] * Math.PI / 180;
        const el = document.createElement('button');
        el.className = 'node' + (def.danger ? ' is-danger' : '');
        el.dataset.id = def.id;
        el.dataset.tip = def.tip;
        el.setAttribute('aria-label', def.tip);
        if (def.at === 2 || def.at === 4) el.dataset.side = 'right';
        el.style.setProperty('--tx', (this.R * Math.cos(a)).toFixed(1) + 'px');
        el.style.setProperty('--ty', (-this.R * Math.sin(a)).toFixed(1) + 'px');
        el.style.setProperty('--i', i);
        el.innerHTML = '<i data-lucide="' + def.icon + '"></i>';
        el.addEventListener('click', () => {
          if (el.dataset.lp) { delete el.dataset.lp; return; }
          this.wake();
          def.run && def.run();
          if (def.toggle) el.classList.toggle('is-active');
        });
        Luca._longPress(el);
        root.appendChild(el);
      });

      /* Translucidez: reposo solo-bordes → opaco al hover / primer toque */
      root.addEventListener('pointerenter', (e) => { if (e.pointerType !== 'touch') this.setIdle(false); });
      root.addEventListener('pointermove',  (e) => { if (e.pointerType !== 'touch') this.setIdle(false); });
      root.addEventListener('pointerleave', (e) => { if (e.pointerType !== 'touch' && !this.card) this.setIdle(true); });
      root.addEventListener('pointerdown', (e) => { this._lastPT = e.pointerType; if (e.pointerType === 'touch' && this.open) this.wake(); });
      root.querySelector('.core').addEventListener('click', () => this.setOpen(!this.open));

      /* La card se cierra al hacer clic fuera del menú y fuera de piezas/textos */
      document.addEventListener('pointerdown', (e) => {
        if (this.card && !e.target.closest('.fab2') && !e.target.closest('.free-text') && !(cfg.isPiece && cfg.isPiece(e.target))) {
          this.setCard(false);
        }
      });
      Luca.icons();
    },

    setOpen(v) {
      this.open = v;
      this.root.classList.toggle('open', v);
      if (!v) this.setCard(false);
      /* Con mouse: si el cursor ya está encima al abrir, opaco de inmediato.
         Táctil: siempre abre translúcido (opaco tras el primer toque posterior). */
      const hover = this._lastPT !== 'touch' && this.root.matches(':hover');
      this.setIdle(!hover); this._awake = false;
    },
    setCard(v) {
      this.card = v;
      this.root.classList.toggle('card-open', v);
      const t = this.root.querySelector('[data-id="tool"]');
      if (t) t.classList.toggle('is-active', v);
      if (v) { this.wake(); this.refreshCard(); }
    },
    setIdle(v) { this.root.classList.toggle('idle', v && this.open); },
    wake() { this._awake = true; this.setIdle(false); },

    /* Card = bloque particular + bloque contextual (solo con selección) */
    refreshCard() {
      if (!this.card) return;
      const card = this.root.querySelector('#lucaToolCard');
      card.innerHTML = '<div class="tc-title">' + (this.cfg.cardTitle || 'Acciones de la herramienta') + '</div>';
      const body = document.createElement('div');
      card.appendChild(body);
      this.cfg.buildPart && this.cfg.buildPart(body);

      const textSel = Luca.text.selected();
      const ctx = textSel ? { title: 'Texto seleccionado', items: Luca.text.ctxItems(), run: (a) => Luca.text.run(a) }
                          : (this.cfg.getCtx ? this.cfg.getCtx() : null);
      const div = document.createElement('div'); div.className = 'tc-div'; card.appendChild(div);
      if (ctx && ctx.items && ctx.items.length) {
        const tt = document.createElement('div'); tt.className = 'tc-title'; tt.textContent = ctx.title || 'Pieza seleccionada';
        card.appendChild(tt);
        ctx.items.forEach((it) => {
          const b = document.createElement('button');
          b.className = 'tc-item' + (it.danger ? ' is-danger' : '');
          b.innerHTML = '<i data-lucide="' + it.icon + '"></i>' + it.tip;
          b.addEventListener('click', () => { ctx.run(it.action); this.refreshCard(); });
          card.appendChild(b);
        });
      } else {
        const e = document.createElement('div'); e.className = 'tc-ctx-empty';
        e.textContent = 'Selecciona una pieza para ver sus acciones';
        card.appendChild(e);
      }
      Luca.icons();
    }
  },

  /* ==========================================================
     VOLVER A MENÚ — botón fijo bajo el brand-chip (todas las tools)
     Se inyecta automáticamente cuando la página tiene .brand-chip
     ========================================================== */
  volver: {
    init() {
      if (document.querySelector('.btn-volver')) return;
      const b = document.createElement('button');
      b.className = 'btn-volver';
      b.setAttribute('aria-label', 'Volver a menú');
      b.innerHTML = '<i data-lucide="arrow-left"></i><span>Volver a menú</span>';
      b.addEventListener('click', () => Luca.navegar('Index'));
      document.body.appendChild(b);
      Luca.icons();
    }
  },

  /* ==========================================================
     USER GUIDE — coach marks paso a paso por herramienta
     · Se abre desde el nodo «?» del radial (posición 8)
     · La «L.» hace shake + brillo en cada visita hasta que el
       usuario abre la guía por primera vez (localStorage por tool)
     Paso: { el: selector|fn, title, text, before?, optional? }
     ========================================================== */
  guide: {
    tool: null, steps: [], i: 0, layer: null,

    KEY() { return 'luca-guide-' + this.tool; },

    init(tool, steps) {
      this.tool = tool;
      this.steps = steps || [];
      if (!this.steps.length) return;
      setTimeout(() => {
        let seen = false;
        try { seen = !!localStorage.getItem(this.KEY()); } catch (_) {}
        if (seen) return;
        const core = document.querySelector('.fab2 .core');
        if (core) core.classList.add('attn');
      }, 0);
    },

    /* Pasos comunes a todas las herramientas (menú radial + volver) */
    commonSteps() {
      return [
        { el: '.fab2 .disc', title: 'Menú Luca', before: () => Luca.fab.setOpen(true),
          text: 'La «L.» abre el menú radial: Vista, Capturar imagen, Reiniciar, ⋯ Acciones de la herramienta y Texto libre.' },
        { el: '.fab2 [data-id="help"]', title: '¿Dudas después?',
          text: 'Vuelve a esta guía cuando quieras tocando el botón «?».' },
        { el: '.btn-volver', title: 'Volver a menú', before: () => Luca.fab.setOpen(false),
          text: 'Regresa al inicio de Luca desde aquí en cualquier momento.' },
      ];
    },

    start() {
      if (!this.steps.length || this.layer) return;
      try { localStorage.setItem(this.KEY(), '1'); } catch (_) {}
      const core = document.querySelector('.fab2 .core');
      if (core) core.classList.remove('attn');
      const L = document.createElement('div');
      L.className = 'guide-layer';
      L.innerHTML = '<div class="guide-hl"></div><div class="guide-card"></div>';
      document.body.appendChild(L);
      this.layer = L;
      this._esc = (e) => { if (e.key === 'Escape') this.end(); };
      this._rsz = () => this._place();
      document.addEventListener('keydown', this._esc);
      window.addEventListener('resize', this._rsz);
      this.show(0);
    },

    _resolve(s) {
      if (!s.el) return null;
      const el = typeof s.el === 'function' ? s.el() : document.querySelector(s.el);
      if (!el) return null;
      if (!el.offsetParent && getComputedStyle(el).position !== 'fixed' &&
          !el.closest('.fab2')) return null;   /* oculto (p.ej. total-bar) */
      return el;
    },

    show(i) {
      /* Salta pasos opcionales cuyo elemento no está visible */
      while (i < this.steps.length && this.steps[i].optional && !this._resolve(this.steps[i])) i++;
      if (i >= this.steps.length) { this.end(); return; }
      this.i = i;
      const s = this.steps[i];
      if (s.before) s.before();
      const card = this.layer.querySelector('.guide-card');
      card.innerHTML =
        '<div class="g-step">Paso ' + (i + 1) + ' de ' + this.steps.length + '</div>' +
        '<h4>' + s.title + '</h4><p>' + s.text + '</p>' +
        '<div class="guide-nav">' +
          '<button class="g-skip" type="button">Saltar</button>' +
          '<div class="g-btns">' +
            (i > 0 ? '<button class="g-prev" type="button">Anterior</button>' : '') +
            '<button class="g-next" type="button">' + (i === this.steps.length - 1 ? 'Entendido' : 'Siguiente') + '</button>' +
          '</div>' +
        '</div>';
      card.querySelector('.g-skip').addEventListener('click', () => this.end());
      const p = card.querySelector('.g-prev');
      if (p) p.addEventListener('click', () => this.show(this.i - 1));
      card.querySelector('.g-next').addEventListener('click', () =>
        (this.i === this.steps.length - 1 ? this.end() : this.show(this.i + 1)));
      /* Si el paso abre/cierra el radial, espera su animación antes de posicionar */
      setTimeout(() => this._place(), s.before ? 340 : 0);
      this._place();
    },

    _place() {
      if (!this.layer) return;
      const s = this.steps[this.i];
      const hl = this.layer.querySelector('.guide-hl');
      const card = this.layer.querySelector('.guide-card');
      const el = this._resolve(s);
      const vw = window.innerWidth, vh = window.innerHeight, pad = 10;
      let r;
      if (el) {
        const b = el.getBoundingClientRect();
        r = { x: b.left - pad, y: b.top - pad, w: b.width + pad * 2, h: b.height + pad * 2 };
        hl.style.borderColor = '';
      } else {
        r = { x: vw / 2, y: vh / 2 - 90, w: 0, h: 0 };
        hl.style.borderColor = 'transparent';
      }
      hl.style.left = r.x + 'px'; hl.style.top = r.y + 'px';
      hl.style.width = r.w + 'px'; hl.style.height = r.h + 'px';
      const cw = Math.min(280, vw - 32);
      const ch = card.offsetHeight || 180;
      let cx = r.x + r.w / 2 - cw / 2;
      cx = Math.max(16, Math.min(cx, vw - cw - 16));
      let cy = r.y + r.h + 14;
      if (cy + ch > vh - 16) cy = r.y - ch - 14;
      if (cy < 16) cy = Math.max(16, vh / 2 - ch / 2);
      card.style.left = cx + 'px'; card.style.top = cy + 'px';
    },

    end() {
      if (!this.layer) return;
      this.layer.remove(); this.layer = null;
      document.removeEventListener('keydown', this._esc);
      window.removeEventListener('resize', this._rsz);
      if (Luca.fab.root && Luca.fab.open) Luca.fab.setOpen(false);
    }
  },

  /* ==========================================================
     TEXTO LIBRE — función universal en las 4 herramientas
     Poppins negro · S/M/L · doble clic edita · sale en captura ·
     Reiniciar lo elimina
     ========================================================== */
  text: {
    canvas: null, items: [], sel: null, zi: 3000, onChange: null,

    init(canvas, opts) {
      this.canvas = canvas;
      this.onChange = (opts && opts.onSelectionChange) || null;
      document.addEventListener('pointerdown', (e) => {
        if (!e.target.closest('.free-text') && this.sel && !this.sel.classList.contains('editing')) this.deselect();
      });
    },

    ctxItems() {
      return [
        { icon: 'pencil',        tip: 'Editar',            action: 'edit' },
        { icon: 'a-large-small', tip: 'Tamaño S / M / L',   action: 'size' },
        { icon: 'arrow-up-to-line', tip: 'Traer al frente', action: 'front' },
        { icon: 'x',             tip: 'Eliminar',           action: 'delete', danger: true },
      ];
    },

    add() {
      if (!this.canvas) return;
      const t = document.createElement('div');
      t.className = 'free-text size-M';
      t.style.left = (this.canvas.offsetWidth / 2 - 40) + 'px';
      t.style.top = (this.canvas.offsetHeight / 2 - 60) + 'px';
      t.style.zIndex = this.zi++;
      const menu = Luca.ctxRadial(this.ctxItems().map(i => ({ icon: i.icon, tip: i.tip, action: i.action, danger: i.danger })));
      menu.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-action]');
        if (!btn || btn.dataset.lp) return;
        e.stopPropagation();
        this.run(btn.dataset.action);
      });
      t.appendChild(menu);
      const inner = document.createElement('span');
      inner.className = 'ft-content';
      inner.spellcheck = false;
      t.appendChild(inner);

      let ox, oy, drag = false, moved = false;
      t.addEventListener('pointerdown', (e) => {
        if (e.target.closest('.ctx-node')) return;
        this.select(t);
        if (t.classList.contains('editing')) return;
        drag = true; moved = false;
        ox = e.clientX - t.offsetLeft; oy = e.clientY - t.offsetTop;
        try { t.setPointerCapture(e.pointerId); } catch (_) {}
      });
      t.addEventListener('pointermove', (e) => {
        if (!drag) return;
        moved = true;
        t.style.left = (e.clientX - ox) + 'px';
        t.style.top = (e.clientY - oy) + 'px';
      });
      t.addEventListener('pointerup', () => { drag = false; });
      t.addEventListener('dblclick', () => this.edit(t));
      inner.addEventListener('blur', () => this.endEdit(t));
      inner.addEventListener('keydown', (e) => { if (e.key === 'Escape') inner.blur(); });

      this.canvas.appendChild(t);
      this.items.push(t);
      Luca.icons();
      this.select(t);
      this.edit(t);
      return t;
    },

    select(t) {
      if (this.sel && this.sel !== t) this.sel.classList.remove('selected');
      this.sel = t; t.classList.add('selected'); t.style.zIndex = this.zi++;
      this.onChange && this.onChange(t);          /* la página deselecciona sus piezas */
      Luca.fab.refreshCard();
    },
    deselect() {
      if (this.sel) { this.sel.classList.remove('selected'); this.sel = null; Luca.fab.refreshCard(); }
    },
    selected() { return this.sel; },

    edit(t) {
      const inner = t.querySelector('.ft-content');
      t.classList.add('editing');
      inner.contentEditable = 'true';
      inner.focus();
      const r = document.createRange();
      r.selectNodeContents(inner); r.collapse(false);
      const s = getSelection(); s.removeAllRanges(); s.addRange(r);
    },
    endEdit(t) {
      const inner = t.querySelector('.ft-content');
      t.classList.remove('editing');
      inner.contentEditable = 'false';
      if (!inner.innerText.trim()) this.remove(t);
    },

    run(action) {
      const t = this.sel; if (!t) return;
      if (action === 'edit') this.edit(t);
      if (action === 'size') {
        const order = ['size-S', 'size-M', 'size-L'];
        const cur = order.findIndex(c => t.classList.contains(c));
        t.classList.remove(order[cur]); t.classList.add(order[(cur + 1) % 3]);
      }
      if (action === 'front') t.style.zIndex = this.zi++;
      if (action === 'delete') this.remove(t);
    },
    remove(t) {
      t.remove();
      this.items = this.items.filter(x => x !== t);
      if (this.sel === t) { this.sel = null; Luca.fab.refreshCard(); }
    },
    clear() {
      this.items.forEach(t => t.remove());
      this.items = []; this.sel = null;
    }
  }
};

window.addEventListener('DOMContentLoaded', function () {
  Luca.icons();
  /* Las herramientas (tienen .brand-chip) reciben el botón Volver a menú */
  if (document.querySelector('.brand-chip')) Luca.volver.init();
});

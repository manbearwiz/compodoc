const BSN = (H => {
    const Vc = Object.defineProperty;
    const Kc = (H, it, ct) =>
        it in H
            ? Vc(H, it, { enumerable: !0, configurable: !0, writable: !0, value: ct })
            : (H[it] = ct);
    const d = (H, it, ct) => (Kc(H, typeof it !== 'symbol' ? `${it}` : it, ct), ct);
    const it = 'aria-describedby';
    const ct = 'aria-expanded';
    const Se = 'aria-hidden';
    const He = 'aria-modal';
    const _s = 'aria-pressed';
    const Ue = 'aria-selected';
    const Bo = 'DOMContentLoaded';
    const qe = 'focus';
    const Qe = 'focusin';
    const Bs = 'focusout';
    const Pe = 'keydown';
    const Ro = 'keyup';
    const N = 'click';
    const Rs = 'mousedown';
    const Wo = 'hover';
    const De = 'mouseenter';
    const Ze = 'mouseleave';
    const Fo = 'pointerdown';
    const jo = 'pointermove';
    const zo = 'pointerup';
    const xe = 'resize';
    const Ae = 'scroll';
    const Ge = 'touchstart';
    const Vo = 'dragstart';
    const Je = 'ArrowDown';
    const ts = 'ArrowUp';
    const Ws = 'ArrowLeft';
    const Fs = 'ArrowRight';
    const es = 'Escape';
    const Ko = 'transitionDuration';
    const Xo = 'transitionDelay';
    const ss = 'transitionend';
    const js = 'transitionProperty';
    const Yo = navigator.userAgentData;
    const Le = Yo;
    const { userAgent: Uo } = navigator;
    const Ie = Uo;
    const zs = /iPhone|iPad|iPod|Android/i;
    Le ? Le.brands.some(t => zs.test(t.brand)) : zs.test(Ie);
    const Vs = /(iPhone|iPod|iPad)/;
    const qo = Le ? Le.brands.some(t => Vs.test(t.brand)) : Vs.test(Ie);
    Ie?.includes('Firefox');
    const { head: ke } = document;
    ['webkitPerspective', 'perspective'].some(t => t in ke.style);
    const Qo = (t, s, e, n) => {
        const o = n || !1;
        t.addEventListener(s, e, o);
    };
    const Zo = (t, s, e, n) => {
        const o = n || !1;
        t.removeEventListener(s, e, o);
    };
    const Go = (t, s, e, n) => {
        const o = i => {
            (i.target === t || i.currentTarget === t) && (e.apply(t, [i]), Zo(t, s, o, n));
        };
        Qo(t, s, o, n);
    };
    const le = () => {};
    (() => {
        let t = !1;
        try {
            const s = Object.defineProperty({}, 'passive', { get: () => ((t = !0), t) });
            Go(document, Bo, le, s);
        } catch {}
        return t;
    })(),
        ['webkitTransform', 'transform'].some(t => t in ke.style),
        ['webkitAnimation', 'animation'].some(t => t in ke.style),
        ['webkitTransition', 'transition'].some(t => t in ke.style);
    const at = (t, s) => t.getAttribute(s);
    const Ne = (t, s) => t.hasAttribute(s);
    const O = (t, s, e) => t.setAttribute(s, e);
    const At = (t, s) => t.removeAttribute(s);
    const f = (t, ...s) => {
        t.classList.add(...s);
    };
    const b = (t, ...s) => {
        t.classList.remove(...s);
    };
    const h = (t, s) => t.classList.contains(s);
    const de = t => (t != null && typeof t === 'object') || !1;
    const A = t =>
        (de(t) &&
            typeof t.nodeType === 'number' &&
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].some(s => t.nodeType === s)) ||
        !1;
    const T = t => (A(t) && t.nodeType === 1) || !1;
    const jt = new Map();
    const Lt = {
        data: jt,
        set: (t, s, e) => {
            T(t) && (jt.has(s) || jt.set(s, new Map()), jt.get(s).set(t, e));
        },
        getAllFor: t => jt.get(t) || null,
        get: (t, s) => {
            if (!T(t) || !s) return null;
            const e = Lt.getAllFor(s);
            return (t && e && e.get(t)) || null;
        },
        remove: (t, s) => {
            const e = Lt.getAllFor(s);
            !e || !T(t) || (e.delete(t), e.size === 0 && jt.delete(s));
        }
    };
    const F = (t, s) => Lt.get(t, s);
    const he = t => typeof t === 'string' || !1;
    const ns = t => (de(t) && t.constructor.name === 'Window') || !1;
    const Ks = t => (A(t) && t.nodeType === 9) || !1;
    const E = t => (ns(t) ? t.document : Ks(t) ? t : A(t) ? t.ownerDocument : window.document);
    const dt = (t, ...s) => Object.assign(t, ...s);
    const vt = t => {
        if (!t) return;
        if (he(t)) return E().createElement(t);
        const { tagName: s } = t;
        const e = vt(s);
        if (!e) return;
        const n = { ...t };
        return (n.tagName = undefined), dt(e, n);
    };
    const w = (t, s) => t.dispatchEvent(s);
    const z = (t, s) => {
        const e = getComputedStyle(t);
        const n = s
            .replace('webkit', 'Webkit')
            .replace(/([A-Z])/g, '-$1')
            .toLowerCase();
        return e.getPropertyValue(n);
    };
    const Jo = t => {
        const s = z(t, js);
        const e = z(t, Xo);
        const n = e.includes('ms') ? 1 : 1e3;
        const o = s && s !== 'none' ? Number.parseFloat(e) * n : 0;
        return Number.isNaN(o) ? 0 : o;
    };
    const zt = t => {
        const s = z(t, js);
        const e = z(t, Ko);
        const n = e.includes('ms') ? 1 : 1e3;
        const o = s && s !== 'none' ? Number.parseFloat(e) * n : 0;
        return Number.isNaN(o) ? 0 : o;
    };
    const P = (t, s) => {
        let e = 0;
        const n = new Event(ss);
        const o = zt(t);
        const i = Jo(t);
        if (o) {
            const c = a => {
                a.target === t && (s.apply(t, [a]), t.removeEventListener(ss, c), (e = 1));
            };
            t.addEventListener(ss, c),
                setTimeout(
                    () => {
                        e || w(t, n);
                    },
                    o + i + 17
                );
        } else s.apply(t, [n]);
    };
    const ht = (t, s) => t.focus(s);
    const Xs = t =>
        ['true', !0].includes(t)
            ? !0
            : ['false', !1].includes(t)
              ? !1
              : ['null', '', null, void 0].includes(t)
                ? null
                : t !== '' && !Number.isNaN(+t)
                  ? +t
                  : t;
    const Oe = t => Object.entries(t);
    const Vt = t => t.toLowerCase();
    const ti = (t, s, e, n) => {
        const o = { ...e };
        const i = { ...t.dataset };
        const c = { ...s };
        const a = {};
        const l = 'title';
        return (
            Oe(i).forEach(([r, g]) => {
                const p =
                    n && typeof r === 'string' && r.includes(n)
                        ? r.replace(n, '').replace(/[A-Z]/g, v => Vt(v))
                        : r;
                a[p] = Xs(g);
            }),
            Oe(o).forEach(([r, g]) => {
                o[r] = Xs(g);
            }),
            Oe(s).forEach(([r, g]) => {
                r in o ? (c[r] = o[r]) : r in a ? (c[r] = a[r]) : (c[r] = r === l ? at(t, l) : g);
            }),
            c
        );
    };
    const Ys = t => Object.keys(t);
    const $ = (t, s) => {
        const e = new CustomEvent(t, { cancelable: !0, bubbles: !0 });
        return de(s) && dt(e, s), e;
    };
    const tt = { passive: !0 };
    const It = t => t.offsetHeight;
    const L = (t, s) => {
        Oe(s).forEach(([e, n]) => {
            if (n && he(e) && e.includes('--')) t.style.setProperty(e, n);
            else {
                const o = {};
                (o[e] = n), dt(t.style, o);
            }
        });
    };
    const os = t => (de(t) && t.constructor.name === 'Map') || !1;
    const ei = t => typeof t === 'number' || !1;
    const bt = new Map();
    const u = {
        set: (t, s, e, n) => {
            T(t) &&
                (n?.length
                    ? (bt.has(t) || bt.set(t, new Map()), bt.get(t).set(n, setTimeout(s, e)))
                    : bt.set(t, setTimeout(s, e)));
        },
        get: (t, s) => {
            if (!T(t)) return null;
            const e = bt.get(t);
            return s && e && os(e) ? e.get(s) || null : ei(e) ? e : null;
        },
        clear: (t, s) => {
            if (!T(t)) return;
            const e = bt.get(t);
            s?.length && os(e)
                ? (clearTimeout(e.get(s)), e.delete(s), e.size === 0 && bt.delete(t))
                : (clearTimeout(e), bt.delete(t));
        }
    };
    const fe = (t, s) => {
        const {
            width: e,
            height: n,
            top: o,
            right: i,
            bottom: c,
            left: a
        } = t.getBoundingClientRect();
        let l = 1;
        let r = 1;
        if (s && T(t)) {
            const { offsetWidth: g, offsetHeight: p } = t;
            (l = g > 0 ? Math.round(e) / g : 1), (r = p > 0 ? Math.round(n) / p : 1);
        }
        return {
            width: e / l,
            height: n / r,
            top: o / r,
            right: i / l,
            bottom: c / r,
            left: a / l,
            x: a / l,
            y: o / r
        };
    };
    const wt = t => E(t).body;
    const ft = t => E(t).documentElement;
    const Us = t => (A(t) && t.constructor.name === 'ShadowRoot') || !1;
    const si = t =>
        t.nodeName === 'HTML'
            ? t
            : (T(t) && t.assignedSlot) || (A(t) && t.parentNode) || (Us(t) && t.host) || ft(t);
    let qs = 0;
    let Qs = 0;
    const Kt = new Map();
    const Zs = (t, s) => {
        let e = s ? qs : Qs;
        if (s) {
            const n = Zs(t);
            const o = Kt.get(n) || new Map();
            Kt.has(n) || Kt.set(n, o),
                os(o) && !o.has(s) ? (o.set(s, e), (qs += 1)) : (e = o.get(s));
        } else {
            const n = t.id || t;
            Kt.has(n) ? (e = Kt.get(n)) : (Kt.set(n, e), (Qs += 1));
        }
        return e;
    };
    const Xt = t => {
        let s;
        return t
            ? Ks(t)
                ? t.defaultView
                : A(t)
                  ? (s = t == null ? void 0 : t.ownerDocument) == null
                      ? void 0
                      : s.defaultView
                  : t
            : window;
    };
    const ni = t => Array.isArray(t) || !1;
    const Gs = t => {
        if (!A(t)) return !1;
        const { top: s, bottom: e } = fe(t);
        const { clientHeight: n } = ft(t);
        return s <= n && e >= 0;
    };
    const oi = t => typeof t === 'function' || !1;
    const ii = t => (de(t) && t.constructor.name === 'NodeList') || !1;
    const Et = t => ft(t).dir === 'rtl';
    const ci = t => (A(t) && ['TABLE', 'TD', 'TH'].includes(t.nodeName)) || !1;
    const M = (t, s) => (t ? t.closest(s) || M(t.getRootNode().host, s) : null);
    const D = (t, s) => (T(t) ? t : (A(s) ? s : E()).querySelector(t));
    const is = (t, s) => (A(s) ? s : E()).getElementsByTagName(t);
    const et = (t, s) => (A(s) ? s : E()).querySelectorAll(t);
    const gt = (t, s) => (s && A(s) ? s : E()).getElementsByClassName(t);
    const Js = (t, s) => t.matches(s);
    const Yt = {};
    const tn = t => {
        const { type: s, currentTarget: e } = t;
        [...Yt[s]].forEach(([n, o]) => {
            e === n &&
                [...o].forEach(([i, c]) => {
                    i.apply(n, [t]), typeof c === 'object' && c.once && B(n, s, i, c);
                });
        });
    };
    const _ = (t, s, e, n) => {
        Yt[s] || (Yt[s] = new Map());
        const o = Yt[s];
        o.has(t) || o.set(t, new Map());
        const i = o.get(t);
        const { size: c } = i;
        i.set(e, n), c || t.addEventListener(s, tn, n);
    };
    const B = (t, s, e, n) => {
        const o = Yt[s];
        const i = o?.get(t);
        const c = i?.get(e);
        const a = c !== void 0 ? c : n;
        i?.has(e) && i.delete(e),
            o && (!i || !i.size) && o.delete(t),
            (!o || !o.size) && delete Yt[s],
            (!i || !i.size) && t.removeEventListener(s, tn, a);
    };
    const W = 'fade';
    const m = 'show';
    const Me = 'data-bs-dismiss';
    const _e = 'alert';
    const en = 'Alert';
    const ai = '5.0.13';
    class st {
        constructor(s, e) {
            d(this, '_toggleEventListeners', () => {});
            const n = D(s);
            if (!n)
                throw he(s)
                    ? Error(`${this.name} Error: "${s}" is not a valid selector.`)
                    : Error(`${this.name} Error: your target is not an instance of HTMLElement.`);
            const o = Lt.get(n, this.name);
            o?._toggleEventListeners(),
                (this.element = n),
                (this.options =
                    this.defaults && Ys(this.defaults).length
                        ? ti(n, this.defaults, e || {}, 'bs')
                        : {}),
                Lt.set(n, this.name, this);
        }
        get version() {
            return ai;
        }
        get name() {
            return 'BaseComponent';
        }
        get defaults() {
            return {};
        }
        dispose() {
            Lt.remove(this.element, this.name),
                Ys(this).forEach(s => {
                    delete this[s];
                });
        }
    }
    const ri = `.${_e}`;
    const li = `[${Me}="${_e}"]`;
    const di = t => F(t, en);
    const hi = t => new Ut(t);
    const sn = $(`close.bs.${_e}`);
    const fi = $(`closed.bs.${_e}`);
    const nn = t => {
        const { element: s } = t;
        w(s, fi), t._toggleEventListeners(), t.dispose(), s.remove();
    };
    class Ut extends st {
        constructor(e) {
            super(e);
            d(this, 'dismiss');
            d(this, 'close', () => {
                const { element: e } = this;
                e &&
                    h(e, m) &&
                    (w(e, sn),
                    sn.defaultPrevented || (b(e, m), h(e, W) ? P(e, () => nn(this)) : nn(this)));
            });
            d(this, '_toggleEventListeners', e => {
                const n = e ? _ : B;
                const { dismiss: o, close: i } = this;
                o && n(o, N, i);
            });
            (this.dismiss = D(li, this.element)), this._toggleEventListeners(!0);
        }
        get name() {
            return en;
        }
        dispose() {
            this._toggleEventListeners(), super.dispose();
        }
    }
    d(Ut, 'selector', ri), d(Ut, 'init', hi), d(Ut, 'getInstance', di);
    const C = 'active';
    const rt = 'data-bs-toggle';
    const gi = 'button';
    const on = 'Button';
    const pi = `[${rt}="${gi}"]`;
    const ui = t => F(t, on);
    const mi = t => new qt(t);
    class qt extends st {
        constructor(e) {
            super(e);
            d(this, 'isActive', !1);
            d(this, 'toggle', e => {
                e?.preventDefault();
                const { element: n, isActive: o } = this;
                !h(n, 'disabled') &&
                    !at(n, 'disabled') &&
                    ((o ? b : f)(n, C), O(n, _s, o ? 'false' : 'true'), (this.isActive = h(n, C)));
            });
            d(this, '_toggleEventListeners', e => {
                (e ? _ : B)(this.element, N, this.toggle);
            });
            const { element: n } = this;
            (this.isActive = h(n, C)),
                O(n, _s, String(!!this.isActive)),
                this._toggleEventListeners(!0);
        }
        get name() {
            return on;
        }
        dispose() {
            this._toggleEventListeners(), super.dispose();
        }
    }
    d(qt, 'selector', pi), d(qt, 'init', mi), d(qt, 'getInstance', ui);
    const cs = 'data-bs-target';
    const kt = 'carousel';
    const cn = 'Carousel';
    const an = 'data-bs-parent';
    const vi = 'data-bs-container';
    const V = t => {
        const s = [cs, an, vi, 'href'];
        const e = E(t);
        return s
            .map(n => {
                const o = at(t, n);
                return o ? (n === an ? M(t, o) : D(o, e)) : null;
            })
            .filter(n => n)[0];
    };
    const ge = `[data-bs-ride="${kt}"]`;
    const Q = `${kt}-item`;
    const as = 'data-bs-slide-to';
    const $t = 'data-bs-slide';
    const Tt = 'paused';
    const rn = { pause: 'hover', keyboard: !1, touch: !0, interval: 5e3 };
    const pt = t => F(t, cn);
    const bi = t => new Qt(t);
    let pe = 0;
    let Be = 0;
    let rs = 0;
    const ls = $(`slide.bs.${kt}`);
    const ds = $(`slid.bs.${kt}`);
    const ln = t => {
        const { index: s, direction: e, element: n, slides: o, options: i } = t;
        if (t.isAnimating) {
            const c = fs(t);
            const a = e === 'left' ? 'next' : 'prev';
            const l = e === 'left' ? 'start' : 'end';
            f(o[s], C),
                b(o[s], `${Q}-${a}`),
                b(o[s], `${Q}-${l}`),
                b(o[c], C),
                b(o[c], `${Q}-${l}`),
                w(n, ds),
                u.clear(n, $t),
                t.cycle && !E(n).hidden && i.interval && !t.isPaused && t.cycle();
        }
    };
    function wi() {
        const t = pt(this);
        t && !t.isPaused && !u.get(this, Tt) && f(this, Tt);
    }
    function Ei() {
        const t = pt(this);
        t?.isPaused && !u.get(this, Tt) && t.cycle();
    }
    function $i(t) {
        t.preventDefault();
        const s = M(this, ge) || V(this);
        const e = pt(s);
        if (e && !e.isAnimating) {
            const n = +(at(this, as) || 0);
            this && !h(this, C) && !Number.isNaN(n) && e.to(n);
        }
    }
    function Ti(t) {
        t.preventDefault();
        const s = M(this, ge) || V(this);
        const e = pt(s);
        if (e && !e.isAnimating) {
            const n = at(this, $t);
            n === 'next' ? e.next() : n === 'prev' && e.prev();
        }
    }
    const yi = ({ code: t, target: s }) => {
        const e = E(s);
        const [n] = [...et(ge, e)].filter(i => Gs(i));
        const o = pt(n);
        if (o && !o.isAnimating && !/textarea|input/i.test(s.nodeName)) {
            const i = Et(n);
            t === (i ? Fs : Ws) ? o.prev() : t === (i ? Ws : Fs) && o.next();
        }
    };
    function dn(t) {
        const { target: s } = t;
        const e = pt(this);
        e?.isTouch &&
            ((e.indicator && !e.indicator.contains(s)) || !e.controls.includes(s)) &&
            (t.stopImmediatePropagation(), t.stopPropagation(), t.preventDefault());
    }
    function Ci(t) {
        const { target: s } = t;
        const e = pt(this);
        if (e && !e.isAnimating && !e.isTouch) {
            const { controls: n, indicators: o } = e;
            [...n, ...o].every(i => i === s || i.contains(s)) ||
                ((pe = t.pageX), this.contains(s) && ((e.isTouch = !0), hn(e, !0)));
        }
    }
    const Si = t => {
        Be = t.pageX;
    };
    const Hi = t => {
        let o;
        const { target: s } = t;
        const e = E(s);
        const n = [...et(ge, e)].map(i => pt(i)).find(i => i.isTouch);
        if (n) {
            const { element: i, index: c } = n;
            const a = Et(i);
            (rs = t.pageX),
                (n.isTouch = !1),
                hn(n),
                !((o = e.getSelection()) != null && o.toString().length) &&
                    i.contains(s) &&
                    Math.abs(pe - rs) > 120 &&
                    (Be < pe ? n.to(c + (a ? -1 : 1)) : Be > pe && n.to(c + (a ? 1 : -1))),
                (pe = 0),
                (Be = 0),
                (rs = 0);
        }
    };
    const hs = (t, s) => {
        const { indicators: e } = t;
        [...e].forEach(n => b(n, C)), t.indicators[s] && f(e[s], C);
    };
    const hn = (t, s) => {
        const { element: e } = t;
        const n = s ? _ : B;
        n(E(e), jo, Si, tt), n(E(e), zo, Hi, tt);
    };
    const fs = t => {
        const { slides: s, element: e } = t;
        const n = D(`.${Q}.${C}`, e);
        return T(n) ? [...s].indexOf(n) : -1;
    };
    class Qt extends st {
        constructor(e, n) {
            super(e, n);
            d(this, '_toggleEventListeners', e => {
                const { element: n, options: o, slides: i, controls: c, indicators: a } = this;
                const { touch: l, pause: r, interval: g, keyboard: p } = o;
                const v = e ? _ : B;
                r && g && (v(n, De, wi), v(n, Ze, Ei)),
                    l &&
                        i.length > 2 &&
                        (v(n, Fo, Ci, tt),
                        v(n, Ge, dn, { passive: !1 }),
                        v(n, Vo, dn, { passive: !1 })),
                    c.length &&
                        c.forEach(k => {
                            k && v(k, N, Ti);
                        }),
                    a.length &&
                        a.forEach(k => {
                            v(k, N, $i);
                        }),
                    p && v(E(n), Pe, yi);
            });
            const { element: o } = this;
            (this.direction = Et(o) ? 'right' : 'left'),
                (this.isTouch = !1),
                (this.slides = gt(Q, o));
            const { slides: i } = this;
            if (i.length >= 2) {
                const c = fs(this);
                const a = [...i].find(g => Js(g, `.${Q}-next,.${Q}-next`));
                this.index = c;
                const l = E(o);
                (this.controls = [
                    ...et(`[${$t}]`, o),
                    ...et(`[${$t}][${cs}="#${o.id}"]`, l)
                ].filter((g, p, v) => p === v.indexOf(g))),
                    (this.indicator = D(`.${kt}-indicators`, o)),
                    (this.indicators = [
                        ...(this.indicator ? et(`[${as}]`, this.indicator) : []),
                        ...et(`[${as}][${cs}="#${o.id}"]`, l)
                    ].filter((g, p, v) => p === v.indexOf(g)));
                const { options: r } = this;
                (this.options.interval = r.interval === !0 ? rn.interval : r.interval),
                    a
                        ? (this.index = [...i].indexOf(a))
                        : c < 0 &&
                          ((this.index = 0), f(i[0], C), this.indicators.length && hs(this, 0)),
                    this.indicators.length && hs(this, this.index),
                    this._toggleEventListeners(!0),
                    r.interval && this.cycle();
            }
        }
        get name() {
            return cn;
        }
        get defaults() {
            return rn;
        }
        get isPaused() {
            return h(this.element, Tt);
        }
        get isAnimating() {
            return D(`.${Q}-next,.${Q}-prev`, this.element) !== null;
        }
        cycle() {
            const { element: e, options: n, isPaused: o, index: i } = this;
            u.clear(e, kt),
                o && (u.clear(e, Tt), b(e, Tt)),
                u.set(
                    e,
                    () => {
                        this.element && !this.isPaused && !this.isTouch && Gs(e) && this.to(i + 1);
                    },
                    n.interval,
                    kt
                );
        }
        pause() {
            const { element: e, options: n } = this;
            !this.isPaused && n.interval && (f(e, Tt), u.set(e, () => {}, 1, Tt));
        }
        next() {
            this.isAnimating || this.to(this.index + 1);
        }
        prev() {
            this.isAnimating || this.to(this.index - 1);
        }
        to(e) {
            const { element: n, slides: o, options: i } = this;
            const c = fs(this);
            const a = Et(n);
            let l = e;
            if (!this.isAnimating && c !== l && !u.get(n, $t)) {
                c < l || (c === 0 && l === o.length - 1)
                    ? (this.direction = a ? 'right' : 'left')
                    : (c > l || (c === o.length - 1 && l === 0)) &&
                      (this.direction = a ? 'left' : 'right');
                const { direction: r } = this;
                l < 0 ? (l = o.length - 1) : l >= o.length && (l = 0);
                const g = r === 'left' ? 'next' : 'prev';
                const p = r === 'left' ? 'start' : 'end';
                const v = { relatedTarget: o[l], from: c, to: l, direction: r };
                dt(ls, v),
                    dt(ds, v),
                    w(n, ls),
                    ls.defaultPrevented ||
                        ((this.index = l),
                        hs(this, l),
                        zt(o[l]) && h(n, 'slide')
                            ? u.set(
                                  n,
                                  () => {
                                      f(o[l], `${Q}-${g}`),
                                          It(o[l]),
                                          f(o[l], `${Q}-${p}`),
                                          f(o[c], `${Q}-${p}`),
                                          P(o[l], () => this.slides?.length && ln(this));
                                  },
                                  0,
                                  $t
                              )
                            : (f(o[l], C),
                              b(o[c], C),
                              u.set(
                                  n,
                                  () => {
                                      u.clear(n, $t),
                                          n && i.interval && !this.isPaused && this.cycle(),
                                          w(n, ds);
                                  },
                                  0,
                                  $t
                              )));
            }
        }
        dispose() {
            const { isAnimating: e } = this;
            const n = { ...this, isAnimating: e };
            this._toggleEventListeners(),
                super.dispose(),
                n.isAnimating &&
                    P(n.slides[n.index], () => {
                        ln(n);
                    });
        }
    }
    d(Qt, 'selector', ge), d(Qt, 'init', bi), d(Qt, 'getInstance', pt);
    const Nt = 'collapsing';
    const K = 'collapse';
    const fn = 'Collapse';
    const Pi = `.${K}`;
    const gn = `[${rt}="${K}"]`;
    const Di = { parent: null };
    const Re = t => F(t, fn);
    const xi = t => new Zt(t);
    const pn = $(`show.bs.${K}`);
    const Ai = $(`shown.bs.${K}`);
    const un = $(`hide.bs.${K}`);
    const Li = $(`hidden.bs.${K}`);
    const Ii = t => {
        const { element: s, parent: e, triggers: n } = t;
        w(s, pn),
            pn.defaultPrevented ||
                (u.set(s, le, 17),
                e && u.set(e, le, 17),
                f(s, Nt),
                b(s, K),
                L(s, { height: `${s.scrollHeight}px` }),
                P(s, () => {
                    u.clear(s),
                        e && u.clear(e),
                        n.forEach(o => O(o, ct, 'true')),
                        b(s, Nt),
                        f(s, K),
                        f(s, m),
                        L(s, { height: '' }),
                        w(s, Ai);
                }));
    };
    const mn = t => {
        const { element: s, parent: e, triggers: n } = t;
        w(s, un),
            un.defaultPrevented ||
                (u.set(s, le, 17),
                e && u.set(e, le, 17),
                L(s, { height: `${s.scrollHeight}px` }),
                b(s, K),
                b(s, m),
                f(s, Nt),
                It(s),
                L(s, { height: '0px' }),
                P(s, () => {
                    u.clear(s),
                        e && u.clear(e),
                        n.forEach(o => O(o, ct, 'false')),
                        b(s, Nt),
                        f(s, K),
                        L(s, { height: '' }),
                        w(s, Li);
                }));
    };
    const ki = t => {
        const { target: s } = t;
        const e = s && M(s, gn);
        const n = e && V(e);
        const o = n && Re(n);
        o?.toggle(), e && e.tagName === 'A' && t.preventDefault();
    };
    class Zt extends st {
        constructor(e, n) {
            super(e, n);
            d(this, '_toggleEventListeners', e => {
                const n = e ? _ : B;
                const { triggers: o } = this;
                o.length && o.forEach(i => n(i, N, ki));
            });
            const { element: o, options: i } = this;
            const c = E(o);
            (this.triggers = [...et(gn, c)].filter(a => V(a) === o)),
                (this.parent = T(i.parent)
                    ? i.parent
                    : he(i.parent)
                      ? V(o) || D(i.parent, c)
                      : null),
                this._toggleEventListeners(!0);
        }
        get name() {
            return fn;
        }
        get defaults() {
            return Di;
        }
        hide() {
            const { triggers: e, element: n } = this;
            u.get(n) || (mn(this), e.length && e.forEach(o => f(o, `${K}d`)));
        }
        show() {
            const { element: e, parent: n, triggers: o } = this;
            let i;
            let c;
            n && ((i = [...et(`.${K}.${m}`, n)].find(a => Re(a))), (c = i && Re(i))),
                (!n || !u.get(n)) &&
                    !u.get(e) &&
                    (c &&
                        i !== e &&
                        (mn(c),
                        c.triggers.forEach(a => {
                            f(a, `${K}d`);
                        })),
                    Ii(this),
                    o.length && o.forEach(a => b(a, `${K}d`)));
        }
        toggle() {
            h(this.element, m) ? this.hide() : this.show();
        }
        dispose() {
            this._toggleEventListeners(), super.dispose();
        }
    }
    d(Zt, 'selector', Pi), d(Zt, 'init', xi), d(Zt, 'getInstance', Re);
    const Ot = ['dropdown', 'dropup', 'dropstart', 'dropend'];
    const vn = 'Dropdown';
    const bn = 'dropdown-menu';
    const wn = t => {
        const s = M(t, 'A');
        return (
            (t.tagName === 'A' && Ne(t, 'href') && at(t, 'href').slice(-1) === '#') ||
            (s && Ne(s, 'href') && at(s, 'href').slice(-1) === '#')
        );
    };
    const [nt, gs, ps, us] = Ot;
    const En = `[${rt}="${nt}"]`;
    const Gt = t => F(t, vn);
    const Ni = t => new Jt(t);
    const Oi = `${bn}-end`;
    const $n = [nt, gs];
    const Tn = [ps, us];
    const yn = ['A', 'BUTTON'];
    const Mi = { offset: 5, display: 'dynamic' };
    const ms = $(`show.bs.${nt}`);
    const Cn = $(`shown.bs.${nt}`);
    const vs = $(`hide.bs.${nt}`);
    const Sn = $(`hidden.bs.${nt}`);
    const Hn = $(`updated.bs.${nt}`);
    const Pn = t => {
        const { element: s, menu: e, parentElement: n, options: o } = t;
        const { offset: i } = o;
        if (z(e, 'position') !== 'static') {
            const c = Et(s);
            const a = h(e, Oi);
            ['margin', 'top', 'bottom', 'left', 'right'].forEach(R => {
                const Pt = {};
                (Pt[R] = ''), L(e, Pt);
            });
            let r = Ot.find(R => h(n, R)) || nt;
            const g = {
                dropdown: [i, 0, 0],
                dropup: [0, 0, i],
                dropstart: c ? [-1, 0, 0, i] : [-1, i, 0],
                dropend: c ? [-1, i, 0] : [-1, 0, 0, i]
            };
            const p = {
                dropdown: { top: '100%' },
                dropup: { top: 'auto', bottom: '100%' },
                dropstart: c ? { left: '100%', right: 'auto' } : { left: 'auto', right: '100%' },
                dropend: c ? { left: 'auto', right: '100%' } : { left: '100%', right: 'auto' },
                menuStart: c ? { right: '0', left: 'auto' } : { right: 'auto', left: '0' },
                menuEnd: c ? { right: 'auto', left: '0' } : { right: '0', left: 'auto' }
            };
            const { offsetWidth: v, offsetHeight: k } = e;
            const { clientWidth: J, clientHeight: y } = ft(s);
            const { left: X, top: q, width: ce, height: mt } = fe(s);
            const S = X - v - i < 0;
            const ot = X + v + ce + i >= J;
            const lt = q + k + i >= y;
            const j = q + k + mt + i >= y;
            const Y = q - k - i < 0;
            const x = ((!c && a) || (c && !a)) && X + ce - v < 0;
            const ae = ((c && a) || (!c && !a)) && X + v >= J;
            if (
                (Tn.includes(r) && S && ot && (r = nt),
                r === ps && (c ? ot : S) && (r = us),
                r === us && (c ? S : ot) && (r = ps),
                r === gs && Y && !j && (r = nt),
                r === nt && j && !Y && (r = gs),
                Tn.includes(r) && lt && dt(p[r], { top: 'auto', bottom: 0 }),
                $n.includes(r) && (x || ae))
            ) {
                let R = { left: 'auto', right: 'auto' };
                !x && ae && !c && (R = { left: 'auto', right: 0 }),
                    x && !ae && c && (R = { left: 0, right: 'auto' }),
                    R && dt(p[r], R);
            }
            const Ht = g[r];
            L(e, { ...p[r], margin: `${Ht.map(R => R && `${R}px`).join(' ')}` }),
                $n.includes(r) &&
                    a &&
                    a &&
                    L(e, p[(!c && x) || (c && ae) ? 'menuStart' : 'menuEnd']),
                w(n, Hn);
        }
    };
    const _i = t =>
        [...t.children]
            .map(s => {
                if (s && yn.includes(s.tagName)) return s;
                const { firstElementChild: e } = s;
                return e && yn.includes(e.tagName) ? e : null;
            })
            .filter(s => s);
    const Dn = t => {
        const { element: s, options: e } = t;
        const n = t.open ? _ : B;
        const o = E(s);
        n(o, N, xn),
            n(o, qe, xn),
            n(o, Pe, Ri),
            n(o, Ro, Wi),
            e.display === 'dynamic' &&
                [Ae, xe].forEach(i => {
                    n(Xt(s), i, Fi, tt);
                });
    };
    const We = t => {
        const s = [...Ot, 'btn-group', 'input-group']
            .map(e => gt(`${e} ${m}`, E(t)))
            .find(e => e.length);
        if (s?.length) return [...s[0].children].find(e => Ot.some(n => n === at(e, rt)));
    };
    const xn = t => {
        const { target: s, type: e } = t;
        if (s && T(s)) {
            const n = We(s);
            const o = n && Gt(n);
            if (o) {
                const { parentElement: i, menu: c } = o;
                const a = i?.contains(s) && (s.tagName === 'form' || M(s, 'form') !== null);
                [N, Rs].includes(e) && wn(s) && t.preventDefault(),
                    !a && e !== qe && s !== n && s !== c && o.hide();
            }
        }
    };
    const Bi = t => {
        const { target: s } = t;
        const e = s && M(s, En);
        const n = e && Gt(e);
        n && (t.stopPropagation(), n.toggle(), e && wn(e) && t.preventDefault());
    };
    const Ri = t => {
        [Je, ts].includes(t.code) && t.preventDefault();
    };
    function Wi(t) {
        const { code: s } = t;
        const e = We(this);
        const n = e && Gt(e);
        const { activeElement: o } = e && E(e);
        if (n && o) {
            const { menu: i, open: c } = n;
            const a = _i(i);
            if (a?.length && [Je, ts].includes(s)) {
                let l = a.indexOf(o);
                o === e
                    ? (l = 0)
                    : s === ts
                      ? (l = l > 1 ? l - 1 : 0)
                      : s === Je && (l = l < a.length - 1 ? l + 1 : l),
                    a[l] && ht(a[l]);
            }
            es === s && c && (n.toggle(), ht(e));
        }
    }
    function Fi() {
        const t = We(this);
        const s = t && Gt(t);
        s?.open && Pn(s);
    }
    class Jt extends st {
        constructor(e, n) {
            super(e, n);
            d(this, '_toggleEventListeners', e => {
                (e ? _ : B)(this.element, N, Bi);
            });
            const { parentElement: o } = this.element;
            const [i] = gt(bn, o);
            i && ((this.parentElement = o), (this.menu = i), this._toggleEventListeners(!0));
        }
        get name() {
            return vn;
        }
        get defaults() {
            return Mi;
        }
        toggle() {
            this.open ? this.hide() : this.show();
        }
        show() {
            const { element: e, open: n, menu: o, parentElement: i } = this;
            if (!n) {
                const c = We(e);
                const a = c && Gt(c);
                a?.hide(),
                    [ms, Cn, Hn].forEach(l => {
                        l.relatedTarget = e;
                    }),
                    w(i, ms),
                    ms.defaultPrevented ||
                        (f(o, m),
                        f(i, m),
                        O(e, ct, 'true'),
                        Pn(this),
                        (this.open = !n),
                        ht(e),
                        Dn(this),
                        w(i, Cn));
            }
        }
        hide() {
            const { element: e, open: n, menu: o, parentElement: i } = this;
            n &&
                ([vs, Sn].forEach(c => {
                    c.relatedTarget = e;
                }),
                w(i, vs),
                vs.defaultPrevented ||
                    (b(o, m), b(i, m), O(e, ct, 'false'), (this.open = !n), Dn(this), w(i, Sn)));
        }
        dispose() {
            this.open && this.hide(), this._toggleEventListeners(), super.dispose();
        }
    }
    d(Jt, 'selector', En), d(Jt, 'init', Ni), d(Jt, 'getInstance', Gt);
    const U = 'modal';
    const bs = 'Modal';
    const ws = 'Offcanvas';
    const ji = 'fixed-top';
    const zi = 'fixed-bottom';
    const An = 'sticky-top';
    const Ln = 'position-sticky';
    const In = t => [...gt(ji, t), ...gt(zi, t), ...gt(An, t), ...gt(Ln, t), ...gt('is-fixed', t)];
    const Vi = t => {
        const s = wt(t);
        L(s, { paddingRight: '', overflow: '' });
        const e = In(s);
        e.length &&
            e.forEach(n => {
                L(n, { paddingRight: '', marginRight: '' });
            });
    };
    const kn = t => {
        const { clientWidth: s } = ft(t);
        const { innerWidth: e } = Xt(t);
        return Math.abs(e - s);
    };
    const Nn = (t, s) => {
        const e = wt(t);
        const n = Number.parseInt(z(e, 'paddingRight'), 10);
        const i = z(e, 'overflow') === 'hidden' && n ? 0 : kn(t);
        const c = In(e);
        s &&
            (L(e, { overflow: 'hidden', paddingRight: `${n + i}px` }),
            c.length &&
                c.forEach(a => {
                    const l = z(a, 'paddingRight');
                    if (
                        ((a.style.paddingRight = `${Number.parseInt(l, 10) + i}px`),
                        [An, Ln].some(r => h(a, r)))
                    ) {
                        const r = z(a, 'marginRight');
                        a.style.marginRight = `${Number.parseInt(r, 10) - i}px`;
                    }
                }));
    };
    const Z = 'offcanvas';
    const yt = vt({ tagName: 'div', className: 'popup-container' });
    const On = (t, s) => {
        const e = A(s) && s.nodeName === 'BODY';
        const n = A(s) && !e ? s : yt;
        const o = e ? s : wt(t);
        A(t) && (n === yt && o.append(yt), n.append(t));
    };
    const Mn = (t, s) => {
        const e = A(s) && s.nodeName === 'BODY';
        const n = A(s) && !e ? s : yt;
        A(t) && (t.remove(), n === yt && !yt.children.length && yt.remove());
    };
    const Es = (t, s) => {
        const e = A(s) && s.nodeName !== 'BODY' ? s : yt;
        return A(t) && e.contains(t);
    };
    const _n = 'backdrop';
    const Bn = `${U}-${_n}`;
    const Rn = `${Z}-${_n}`;
    const Wn = `.${U}.${m}`;
    const $s = `.${Z}.${m}`;
    const I = vt('div');
    const Mt = t => D(`${Wn},${$s}`, E(t));
    const Ts = t => {
        const s = t ? Bn : Rn;
        [Bn, Rn].forEach(e => {
            b(I, e);
        }),
            f(I, s);
    };
    const Fn = (t, s, e) => {
        Ts(e), On(I, wt(t)), s && f(I, W);
    };
    const jn = () => {
        h(I, m) || (f(I, m), It(I));
    };
    const Fe = () => {
        b(I, m);
    };
    const zn = t => {
        Mt(t) || (b(I, W), Mn(I, wt(t)), Vi(t));
    };
    const Vn = t => T(t) && z(t, 'visibility') !== 'hidden' && t.offsetParent !== null;
    const Ki = `.${U}`;
    const Kn = `[${rt}="${U}"]`;
    const Xi = `[${Me}="${U}"]`;
    const Xn = `${U}-static`;
    const Yi = { backdrop: !0, keyboard: !0 };
    const ue = t => F(t, bs);
    const Ui = t => new te(t);
    const je = $(`show.bs.${U}`);
    const Yn = $(`shown.bs.${U}`);
    const ys = $(`hide.bs.${U}`);
    const Un = $(`hidden.bs.${U}`);
    const qn = t => {
        const { element: s } = t;
        const e = kn(s);
        const { clientHeight: n, scrollHeight: o } = ft(s);
        const { clientHeight: i, scrollHeight: c } = s;
        const a = i !== c;
        if (!a && e) {
            const l = Et(s) ? 'paddingLeft' : 'paddingRight';
            const r = {};
            (r[l] = `${e}px`), L(s, r);
        }
        Nn(s, a || n !== o);
    };
    const Qn = (t, s) => {
        const e = s ? _ : B;
        const { element: n, update: o } = t;
        e(n, N, Zi), e(Xt(n), xe, o, tt), e(E(n), Pe, Qi);
    };
    const Zn = t => {
        const { triggers: s, element: e, relatedTarget: n } = t;
        zn(e), L(e, { paddingRight: '', display: '' }), Qn(t);
        const o = je.relatedTarget || s.find(Vn);
        o && ht(o), (Un.relatedTarget = n), w(e, Un);
    };
    const Gn = t => {
        const { element: s, relatedTarget: e } = t;
        ht(s), Qn(t, !0), (Yn.relatedTarget = e), w(s, Yn);
    };
    const Jn = t => {
        const { element: s, hasFade: e } = t;
        L(s, { display: 'block' }),
            qn(t),
            Mt(s) || L(wt(s), { overflow: 'hidden' }),
            f(s, m),
            At(s, Se),
            O(s, He, 'true'),
            e ? P(s, () => Gn(t)) : Gn(t);
    };
    const to = t => {
        const { element: s, options: e, hasFade: n } = t;
        e.backdrop && n && h(I, m) && !Mt(s) ? (Fe(), P(I, () => Zn(t))) : Zn(t);
    };
    const qi = t => {
        const { target: s } = t;
        const e = s && M(s, Kn);
        const n = e && V(e);
        const o = n && ue(n);
        o && (e && e.tagName === 'A' && t.preventDefault(), (o.relatedTarget = e), o.toggle());
    };
    const Qi = ({ code: t, target: s }) => {
        const e = D(Wn, E(s));
        const n = e && ue(e);
        if (n) {
            const { options: o } = n;
            o.keyboard && t === es && h(e, m) && ((n.relatedTarget = null), n.hide());
        }
    };
    const Zi = t => {
        let n;
        let o;
        const { currentTarget: s } = t;
        const e = s ? ue(s) : null;
        if (e && s && !u.get(s)) {
            const { options: i, isStatic: c, modalDialog: a } = e;
            const { backdrop: l } = i;
            const { target: r } = t;
            const g =
                (o = (n = E(s)) == null ? void 0 : n.getSelection()) == null
                    ? void 0
                    : o.toString().length;
            const p = a.contains(r);
            const v = r && M(r, Xi);
            c && !p
                ? u.set(
                      s,
                      () => {
                          f(s, Xn), P(a, () => Gi(e));
                      },
                      17
                  )
                : (v || (!g && !c && !p && l)) &&
                  ((e.relatedTarget = v || null), e.hide(), t.preventDefault());
        }
    };
    const Gi = t => {
        const { element: s, modalDialog: e } = t;
        const n = (zt(e) || 0) + 17;
        b(s, Xn), u.set(s, () => u.clear(s), n);
    };
    class te extends st {
        constructor(e, n) {
            super(e, n);
            d(this, 'update', () => {
                h(this.element, m) && qn(this);
            });
            d(this, '_toggleEventListeners', e => {
                const n = e ? _ : B;
                const { triggers: o } = this;
                o.length && o.forEach(i => n(i, N, qi));
            });
            const { element: o } = this;
            const i = D(`.${U}-dialog`, o);
            i &&
                ((this.modalDialog = i),
                (this.triggers = [...et(Kn, E(o))].filter(c => V(c) === o)),
                (this.isStatic = this.options.backdrop === 'static'),
                (this.hasFade = h(o, W)),
                (this.relatedTarget = null),
                this._toggleEventListeners(!0));
        }
        get name() {
            return bs;
        }
        get defaults() {
            return Yi;
        }
        toggle() {
            h(this.element, m) ? this.hide() : this.show();
        }
        show() {
            const { element: e, options: n, hasFade: o, relatedTarget: i } = this;
            const { backdrop: c } = n;
            let a = 0;
            if (!h(e, m) && ((je.relatedTarget = i || void 0), w(e, je), !je.defaultPrevented)) {
                const l = Mt(e);
                if (l && l !== e) {
                    const r = ue(l) || F(l, ws);
                    r?.hide();
                }
                c
                    ? (Es(I) ? Ts(!0) : Fn(e, o, !0),
                      (a = zt(I)),
                      jn(),
                      setTimeout(() => Jn(this), a))
                    : (Jn(this), l && h(I, m) && Fe());
            }
        }
        hide() {
            const { element: e, hasFade: n, relatedTarget: o } = this;
            h(e, m) &&
                ((ys.relatedTarget = o || void 0),
                w(e, ys),
                ys.defaultPrevented ||
                    (b(e, m), O(e, Se, 'true'), At(e, He), n ? P(e, () => to(this)) : to(this)));
        }
        dispose() {
            const e = { ...this };
            const { element: n, modalDialog: o } = e;
            const i = () => super.dispose();
            this._toggleEventListeners(), this.hide(), h(n, 'fade') ? P(o, i) : i();
        }
    }
    d(te, 'selector', Ki), d(te, 'init', Ui), d(te, 'getInstance', ue);
    const Ji = `.${Z}`;
    const Cs = `[${rt}="${Z}"]`;
    const tc = `[${Me}="${Z}"]`;
    const ze = `${Z}-toggling`;
    const ec = { backdrop: !0, keyboard: !0, scroll: !1 };
    const me = t => F(t, ws);
    const sc = t => new ee(t);
    const Ve = $(`show.bs.${Z}`);
    const eo = $(`shown.bs.${Z}`);
    const Ss = $(`hide.bs.${Z}`);
    const so = $(`hidden.bs.${Z}`);
    const nc = t => {
        const { element: s } = t;
        const { clientHeight: e, scrollHeight: n } = ft(s);
        Nn(s, e !== n);
    };
    const no = (t, s) => {
        const e = s ? _ : B;
        const n = E(t.element);
        e(n, Pe, ac), e(n, N, cc);
    };
    const oo = t => {
        const { element: s, options: e } = t;
        e.scroll || (nc(t), L(wt(s), { overflow: 'hidden' })),
            f(s, ze),
            f(s, m),
            L(s, { visibility: 'visible' }),
            P(s, () => rc(t));
    };
    const oc = t => {
        const { element: s, options: e } = t;
        const n = Mt(s);
        s.blur(), !n && e.backdrop && h(I, m) && Fe(), P(s, () => lc(t));
    };
    const ic = t => {
        const s = M(t.target, Cs);
        const e = s && V(s);
        const n = e && me(e);
        n && ((n.relatedTarget = s), n.toggle(), s && s.tagName === 'A' && t.preventDefault());
    };
    const cc = t => {
        const { target: s } = t;
        const e = D($s, E(s));
        const n = D(tc, e);
        const o = e && me(e);
        if (o) {
            const { options: i, triggers: c } = o;
            const { backdrop: a } = i;
            const l = M(s, Cs);
            const r = E(e).getSelection();
            (!I.contains(s) || a !== 'static') &&
                (!r?.toString().length &&
                    ((!e.contains(s) && a && (!l || c.includes(s))) || n?.contains(s)) &&
                    ((o.relatedTarget = n?.contains(s) ? n : null), o.hide()),
                l && l.tagName === 'A' && t.preventDefault());
        }
    };
    const ac = ({ code: t, target: s }) => {
        const e = D($s, E(s));
        const n = e && me(e);
        n?.options.keyboard && t === es && ((n.relatedTarget = null), n.hide());
    };
    const rc = t => {
        const { element: s } = t;
        b(s, ze), At(s, Se), O(s, He, 'true'), O(s, 'role', 'dialog'), w(s, eo), no(t, !0), ht(s);
    };
    const lc = t => {
        const { element: s, triggers: e } = t;
        O(s, Se, 'true'), At(s, He), At(s, 'role'), L(s, { visibility: '' });
        const n = Ve.relatedTarget || e.find(Vn);
        n && ht(n), zn(s), w(s, so), b(s, ze), Mt(s) || no(t);
    };
    class ee extends st {
        constructor(e, n) {
            super(e, n);
            d(this, '_toggleEventListeners', e => {
                const n = e ? _ : B;
                this.triggers.forEach(o => n(o, N, ic));
            });
            const { element: o } = this;
            (this.triggers = [...et(Cs, E(o))].filter(i => V(i) === o)),
                (this.relatedTarget = null),
                this._toggleEventListeners(!0);
        }
        get name() {
            return ws;
        }
        get defaults() {
            return ec;
        }
        toggle() {
            h(this.element, m) ? this.hide() : this.show();
        }
        show() {
            const { element: e, options: n, relatedTarget: o } = this;
            let i = 0;
            if (
                !h(e, m) &&
                ((Ve.relatedTarget = o || void 0),
                (eo.relatedTarget = o || void 0),
                w(e, Ve),
                !Ve.defaultPrevented)
            ) {
                const c = Mt(e);
                if (c && c !== e) {
                    const a = me(c) || F(c, bs);
                    a?.hide();
                }
                n.backdrop
                    ? (Es(I) ? Ts() : Fn(e, !0), (i = zt(I)), jn(), setTimeout(() => oo(this), i))
                    : (oo(this), c && h(I, m) && Fe());
            }
        }
        hide() {
            const { element: e, relatedTarget: n } = this;
            h(e, m) &&
                ((Ss.relatedTarget = n || void 0),
                (so.relatedTarget = n || void 0),
                w(e, Ss),
                Ss.defaultPrevented || (f(e, ze), b(e, m), oc(this)));
        }
        dispose() {
            const e = { ...this };
            const { element: n, options: o } = e;
            const i = o.backdrop ? zt(I) : 0;
            const c = () => setTimeout(() => super.dispose(), i + 17);
            this._toggleEventListeners(), this.hide(), h(n, m) ? P(n, c) : c();
        }
    }
    d(ee, 'selector', Ji), d(ee, 'init', sc), d(ee, 'getInstance', me);
    const _t = 'popover';
    const Ke = 'Popover';
    const ut = 'tooltip';
    const io = t => {
        const s = t === ut;
        const e = s ? `${t}-inner` : `${t}-body`;
        const n = s ? '' : `<h3 class="${t}-header"></h3>`;
        const o = `<div class="${t}-arrow"></div>`;
        const i = `<div class="${e}"></div>`;
        return `<div class="${t}" role="${ut}">${n + o + i}</div>`;
    };
    const co = { top: 'top', bottom: 'bottom', left: 'start', right: 'end' };
    const Hs = t => {
        const s = /\b(top|bottom|start|end)+/;
        const { element: e, tooltip: n, container: o, options: i, arrow: c } = t;
        if (n) {
            const a = { ...co };
            const l = Et(e);
            L(n, { top: '', left: '', right: '', bottom: '' });
            const r = t.name === Ke;
            const { offsetWidth: g, offsetHeight: p } = n;
            const { clientWidth: v, clientHeight: k, offsetWidth: J } = ft(e);
            let { placement: y } = i;
            const { clientWidth: X, offsetWidth: q } = o;
            const mt = z(o, 'position') === 'fixed';
            const S = Math.abs(mt ? X - q : v - J);
            const ot = l && mt ? S : 0;
            const lt = v - (l ? 0 : S) - 1;
            const { width: j, height: Y, left: x, right: ae, top: Ht } = fe(e, !0);
            const { x: R, y: Pt } = { x, y: Ht };
            L(c, { top: '', left: '', right: '', bottom: '' });
            let Wt = 0;
            let Ee = '';
            let Dt = 0;
            let ks = '';
            let re = '';
            let Xe = '';
            let Ns = '';
            const Ft = c.offsetWidth || 0;
            const xt = c.offsetHeight || 0;
            const Os = Ft / 2;
            let $e = Ht - p - xt < 0;
            let Te = Ht + p + Y + xt >= k;
            let ye = x - g - Ft < ot;
            let Ce = x + g + j + Ft >= lt;
            const Ye = ['left', 'right'];
            const Ms = ['top', 'bottom'];
            ($e = Ye.includes(y) ? Ht + Y / 2 - p / 2 - xt < 0 : $e),
                (Te = Ye.includes(y) ? Ht + p / 2 + Y / 2 + xt >= k : Te),
                (ye = Ms.includes(y) ? x + j / 2 - g / 2 < ot : ye),
                (Ce = Ms.includes(y) ? x + g / 2 + j / 2 >= lt : Ce),
                (y = Ye.includes(y) && ye && Ce ? 'top' : y),
                (y = y === 'top' && $e ? 'bottom' : y),
                (y = y === 'bottom' && Te ? 'top' : y),
                (y = y === 'left' && ye ? 'right' : y),
                (y = y === 'right' && Ce ? 'left' : y),
                n.className.includes(y) || (n.className = n.className.replace(s, a[y])),
                Ye.includes(y)
                    ? (y === 'left' ? (Dt = R - g - (r ? Ft : 0)) : (Dt = R + j + (r ? Ft : 0)),
                      $e && Te
                          ? ((Wt = 0), (Ee = 0), (re = Ht + Y / 2 - xt / 2))
                          : $e
                            ? ((Wt = Pt), (Ee = ''), (re = Y / 2 - Ft))
                            : Te
                              ? ((Wt = Pt - p + Y), (Ee = ''), (re = p - Y / 2 - Ft))
                              : ((Wt = Pt - p / 2 + Y / 2), (re = p / 2 - xt / 2)))
                    : Ms.includes(y) &&
                      (y === 'top' ? (Wt = Pt - p - (r ? xt : 0)) : (Wt = Pt + Y + (r ? xt : 0)),
                      ye
                          ? ((Dt = 0), (Xe = R + j / 2 - Os))
                          : Ce
                            ? ((Dt = 'auto'), (ks = 0), (Ns = j / 2 + lt - ae - Os))
                            : ((Dt = R - g / 2 + j / 2), (Xe = g / 2 - Os))),
                L(n, {
                    top: `${Wt}px`,
                    bottom: Ee === '' ? '' : `${Ee}px`,
                    left: Dt === 'auto' ? Dt : `${Dt}px`,
                    right: ks !== '' ? `${ks}px` : ''
                }),
                T(c) &&
                    (re !== '' && (c.style.top = `${re}px`),
                    Xe !== ''
                        ? (c.style.left = `${Xe}px`)
                        : Ns !== '' && (c.style.right = `${Ns}px`));
            const zc = $(`updated.bs.${Vt(t.name)}`);
            w(e, zc);
        }
    };
    const Ps = {
        template: io(ut),
        title: '',
        customClass: '',
        trigger: 'hover focus',
        placement: 'top',
        sanitizeFn: void 0,
        animation: !0,
        delay: 200,
        container: document.body,
        content: '',
        dismissible: !1,
        btnClose: ''
    };
    const ao = 'data-original-title';
    const Bt = 'Tooltip';
    const Ct = (t, s, e) => {
        if (he(s) && s.length) {
            let n = s.trim();
            oi(e) && (n = e(n));
            const i = new DOMParser().parseFromString(n, 'text/html');
            t.append(...i.body.childNodes);
        } else T(s) ? t.append(s) : (ii(s) || (ni(s) && s.every(A))) && t.append(...s);
    };
    const dc = t => {
        const s = t.name === Bt;
        const { id: e, element: n, options: o } = t;
        const {
            title: i,
            placement: c,
            template: a,
            animation: l,
            customClass: r,
            sanitizeFn: g,
            dismissible: p,
            content: v,
            btnClose: k
        } = o;
        const J = s ? ut : _t;
        const y = { ...co };
        let X = [];
        let q = [];
        Et(n) && ((y.left = 'end'), (y.right = 'start'));
        const ce = `bs-${J}-${y[c]}`;
        let mt;
        if (T(a)) mt = a;
        else {
            const ot = vt('div');
            Ct(ot, a, g), (mt = ot.firstChild);
        }
        t.tooltip = T(mt) ? mt.cloneNode(!0) : void 0;
        const { tooltip: S } = t;
        if (S) {
            O(S, 'id', e), O(S, 'role', ut);
            const ot = s ? `${ut}-inner` : `${_t}-body`;
            const lt = s ? null : D(`.${_t}-header`, S);
            const j = D(`.${ot}`, S);
            t.arrow = D(`.${J}-arrow`, S);
            const { arrow: Y } = t;
            if (T(i)) X = [i.cloneNode(!0)];
            else {
                const x = vt('div');
                Ct(x, i, g), (X = [...x.childNodes]);
            }
            if (T(v)) q = [v.cloneNode(!0)];
            else {
                const x = vt('div');
                Ct(x, v, g), (q = [...x.childNodes]);
            }
            if (p)
                if (i)
                    if (T(k)) X = [...X, k.cloneNode(!0)];
                    else {
                        const x = vt('div');
                        Ct(x, k, g), (X = [...X, x.firstChild]);
                    }
                else if ((lt?.remove(), T(k))) q = [...q, k.cloneNode(!0)];
                else {
                    const x = vt('div');
                    Ct(x, k, g), (q = [...q, x.firstChild]);
                }
            s
                ? i && j && Ct(j, i, g)
                : (i && lt && Ct(lt, X, g),
                  v && j && Ct(j, q, g),
                  (t.btn = D('.btn-close', S) || void 0)),
                f(S, 'position-fixed'),
                f(Y, 'position-absolute'),
                h(S, J) || f(S, J),
                l && !h(S, W) && f(S, W),
                r && !h(S, r) && f(S, r),
                h(S, ce) || f(S, ce);
        }
    };
    const hc = t => {
        const s = ['HTML', 'BODY'];
        const e = [];
        let { parentNode: n } = t;
        while (n && !s.includes(n.nodeName)) (n = si(n)), Us(n) || ci(n) || e.push(n);
        return (
            e.find((o, i) =>
                z(o, 'position') !== 'relative' &&
                e.slice(i + 1).every(c => z(c, 'position') === 'static')
                    ? o
                    : null
            ) || E(t).body
        );
    };
    const fc = `[${rt}="${ut}"],[data-tip="${ut}"]`;
    const ro = 'title';
    let lo = t => F(t, Bt);
    const gc = t => new St(t);
    const pc = t => {
        const { element: s, tooltip: e, container: n, offsetParent: o } = t;
        At(s, it), Mn(e, n === o ? n : o);
    };
    const ve = t => {
        const { tooltip: s, container: e, offsetParent: n } = t;
        return s && Es(s, e === n ? e : n);
    };
    const uc = (t, s) => {
        const { element: e } = t;
        t._toggleEventListeners(), Ne(e, ao) && t.name === Bt && uo(t), s?.();
    };
    const ho = (t, s) => {
        const e = s ? _ : B;
        const { element: n } = t;
        e(E(n), Ge, t.handleTouch, tt),
            [Ae, xe].forEach(o => {
                e(Xt(n), o, t.update, tt);
            });
    };
    const fo = t => {
        const { element: s } = t;
        const e = $(`shown.bs.${Vt(t.name)}`);
        ho(t, !0), w(s, e), u.clear(s, 'in');
    };
    const go = t => {
        const { element: s } = t;
        const e = $(`hidden.bs.${Vt(t.name)}`);
        ho(t), pc(t), w(s, e), u.clear(s, 'out');
    };
    const po = (t, s) => {
        const e = s ? _ : B;
        const { element: n, container: o, offsetParent: i } = t;
        const { offsetHeight: c, scrollHeight: a } = o;
        const l = M(n, `.${U}`);
        const r = M(n, `.${Z}`);
        const g = Xt(n);
        const v = o === i && c !== a ? o : g;
        e(v, xe, t.update, tt),
            e(v, Ae, t.update, tt),
            l && e(l, `hide.bs.${U}`, t.handleHide),
            r && e(r, `hide.bs.${Z}`, t.handleHide);
    };
    const uo = (t, s) => {
        const e = [ao, ro];
        const { element: n } = t;
        O(n, e[s ? 0 : 1], s || at(n, e[0]) || ''), At(n, e[s ? 1 : 0]);
    };
    class St extends st {
        constructor(e, n) {
            super(e, n);
            d(this, 'handleFocus', () => ht(this.element));
            d(this, 'handleShow', () => this.show());
            d(this, 'handleHide', () => this.hide());
            d(this, 'update', () => {
                Hs(this);
            });
            d(this, 'toggle', () => {
                const { tooltip: e } = this;
                e && !ve(this) ? this.show() : this.hide();
            });
            d(this, 'handleTouch', ({ target: e }) => {
                const { tooltip: n, element: o } = this;
                n?.contains(e) || e === o || (e && o.contains(e)) || this.hide();
            });
            d(this, '_toggleEventListeners', e => {
                const n = e ? _ : B;
                const { element: o, options: i, btn: c } = this;
                const { trigger: a } = i;
                const r = !!(this.name !== Bt && i.dismissible);
                a.includes('manual') ||
                    ((this.enabled = !!e),
                    a.split(' ').forEach(p => {
                        p === Wo
                            ? (n(o, Rs, this.handleShow),
                              n(o, De, this.handleShow),
                              r || (n(o, Ze, this.handleHide), n(E(o), Ge, this.handleTouch, tt)))
                            : p === N
                              ? n(o, p, r ? this.handleShow : this.toggle)
                              : p === qe &&
                                (n(o, Qe, this.handleShow),
                                r || n(o, Bs, this.handleHide),
                                qo && n(o, N, this.handleFocus)),
                            r && c && n(c, N, this.handleHide);
                    }));
            });
            const { element: o } = this;
            const i = this.name === Bt;
            const c = i ? ut : _t;
            const a = i ? Bt : Ke;
            (lo = r => F(r, a)), (this.enabled = !0), (this.id = `${c}-${Zs(o, c)}`);
            const { options: l } = this;
            (!l.title && i) ||
                (!i && !l.content) ||
                (dt(Ps, { titleAttr: '' }),
                Ne(o, ro) && i && typeof l.title === 'string' && uo(this, l.title),
                (this.container = hc(o)),
                (this.offsetParent = ['sticky', 'fixed'].some(
                    r => z(this.container, 'position') === r
                )
                    ? this.container
                    : E(this.element).body),
                dc(this),
                this._toggleEventListeners(!0));
        }
        get name() {
            return Bt;
        }
        get defaults() {
            return Ps;
        }
        show() {
            const {
                options: e,
                tooltip: n,
                element: o,
                container: i,
                offsetParent: c,
                id: a
            } = this;
            const { animation: l } = e;
            const r = u.get(o, 'out');
            const g = i === c ? i : c;
            u.clear(o, 'out'),
                n &&
                    !r &&
                    !ve(this) &&
                    u.set(
                        o,
                        () => {
                            const p = $(`show.bs.${Vt(this.name)}`);
                            w(o, p),
                                p.defaultPrevented ||
                                    (On(n, g),
                                    O(o, it, `#${a}`),
                                    this.update(),
                                    po(this, !0),
                                    h(n, m) || f(n, m),
                                    l ? P(n, () => fo(this)) : fo(this));
                        },
                        17,
                        'in'
                    );
        }
        hide() {
            const { options: e, tooltip: n, element: o } = this;
            const { animation: i, delay: c } = e;
            u.clear(o, 'in'),
                n &&
                    ve(this) &&
                    u.set(
                        o,
                        () => {
                            const a = $(`hide.bs.${Vt(this.name)}`);
                            w(o, a),
                                a.defaultPrevented ||
                                    (this.update(),
                                    b(n, m),
                                    po(this),
                                    i ? P(n, () => go(this)) : go(this));
                        },
                        c + 17,
                        'out'
                    );
        }
        enable() {
            const { enabled: e } = this;
            e || (this._toggleEventListeners(!0), (this.enabled = !e));
        }
        disable() {
            const { tooltip: e, options: n, enabled: o } = this;
            const { animation: i } = n;
            o &&
                (e && ve(this) && i
                    ? (this.hide(), P(e, () => this._toggleEventListeners()))
                    : this._toggleEventListeners(),
                (this.enabled = !o));
        }
        toggleEnabled() {
            this.enabled ? this.disable() : this.enable();
        }
        dispose() {
            const { tooltip: e, options: n } = this;
            const o = { ...this, name: this.name };
            const i = () => setTimeout(() => uc(o, () => super.dispose()), 17);
            n.animation && ve(o) ? ((this.options.delay = 0), this.hide(), P(e, i)) : i();
        }
    }
    d(St, 'selector', fc), d(St, 'init', gc), d(St, 'getInstance', lo), d(St, 'styleTip', Hs);
    const mc = `[${rt}="${_t}"],[data-tip="${_t}"]`;
    const vc = dt({}, Ps, {
        template: io(_t),
        content: '',
        dismissible: !1,
        btnClose: '<button class="btn-close" aria-label="Close"></button>'
    });
    const bc = t => F(t, Ke);
    const wc = t => new Rt(t);
    class Rt extends St {
        constructor(e, n) {
            super(e, n);
            d(this, 'show', () => {
                super.show();
                const { options: e, btn: n } = this;
                e.dismissible && n && setTimeout(() => ht(n), 17);
            });
        }
        get name() {
            return Ke;
        }
        get defaults() {
            return vc;
        }
    }
    d(Rt, 'selector', mc), d(Rt, 'init', wc), d(Rt, 'getInstance', bc), d(Rt, 'styleTip', Hs);
    const Ec = 'scrollspy';
    const mo = 'ScrollSpy';
    const $c = '[data-bs-spy="scroll"]';
    const Tc = { offset: 10, target: null };
    const yc = t => F(t, mo);
    const Cc = t => new se(t);
    const vo = $(`activate.bs.${Ec}`);
    const Sc = t => {
        const {
            target: s,
            scrollTarget: e,
            options: n,
            itemsLength: o,
            scrollHeight: i,
            element: c
        } = t;
        const { offset: a } = n;
        const l = ns(e);
        const r = s && is('A', s);
        const g = e ? bo(e) : i;
        if (((t.scrollTop = l ? e.scrollY : e.scrollTop), r && (g !== i || o !== r.length))) {
            let p;
            let v;
            let k;
            (t.items = []),
                (t.offsets = []),
                (t.scrollHeight = g),
                (t.maxScroll = t.scrollHeight - Hc(t)),
                [...r].forEach(J => {
                    (p = at(J, 'href')),
                        (v = p && p.charAt(0) === '#' && p.slice(-1) !== '#' && D(p, E(c))),
                        v &&
                            (t.items.push(J),
                            (k = fe(v)),
                            t.offsets.push((l ? k.top + t.scrollTop : v.offsetTop) - a));
                }),
                (t.itemsLength = t.items.length);
        }
    };
    const bo = t => (T(t) ? t.scrollHeight : ft(t).scrollHeight);
    const Hc = ({ element: t, scrollTarget: s }) => (ns(s) ? s.innerHeight : fe(t).height);
    const wo = t => {
        [...is('A', t)].forEach(s => {
            h(s, C) && b(s, C);
        });
    };
    const Eo = (t, s) => {
        const { target: e, element: n } = t;
        T(e) && wo(e), (t.activeItem = s), f(s, C);
        const o = [];
        let i = s;
        while (i !== wt(n))
            (i = i.parentElement), (h(i, 'nav') || h(i, 'dropdown-menu')) && o.push(i);
        o.forEach(c => {
            const a = c.previousElementSibling;
            a && !h(a, C) && f(a, C);
        }),
            (vo.relatedTarget = s),
            w(n, vo);
    };
    class se extends st {
        constructor(e, n) {
            super(e, n);
            d(this, 'refresh', () => {
                const { target: e } = this;
                if (T(e) && e.offsetHeight > 0) {
                    Sc(this);
                    const {
                        scrollTop: n,
                        maxScroll: o,
                        itemsLength: i,
                        items: c,
                        activeItem: a
                    } = this;
                    if (n >= o) {
                        const r = c[i - 1];
                        a !== r && Eo(this, r);
                        return;
                    }
                    const { offsets: l } = this;
                    if (a && n < l[0] && l[0] > 0) {
                        (this.activeItem = null), e && wo(e);
                        return;
                    }
                    c.forEach((r, g) => {
                        a !== r &&
                            n >= l[g] &&
                            (typeof l[g + 1] > 'u' || n < l[g + 1]) &&
                            Eo(this, r);
                    });
                }
            });
            d(this, '_toggleEventListeners', e => {
                (e ? _ : B)(this.scrollTarget, Ae, this.refresh, tt);
            });
            const { element: o, options: i } = this;
            (this.target = D(i.target, E(o))),
                this.target &&
                    ((this.scrollTarget = o.clientHeight < o.scrollHeight ? o : Xt(o)),
                    (this.scrollHeight = bo(this.scrollTarget)),
                    this._toggleEventListeners(!0),
                    this.refresh());
        }
        get name() {
            return mo;
        }
        get defaults() {
            return Tc;
        }
        dispose() {
            this._toggleEventListeners(), super.dispose();
        }
    }
    d(se, 'selector', $c), d(se, 'init', Cc), d(se, 'getInstance', yc);
    const be = 'tab';
    const $o = 'Tab';
    const To = `[${rt}="${be}"]`;
    const yo = t => F(t, $o);
    const Pc = t => new ne(t);
    const Ds = $(`show.bs.${be}`);
    const Co = $(`shown.bs.${be}`);
    const xs = $(`hide.bs.${be}`);
    const So = $(`hidden.bs.${be}`);
    const we = new Map();
    const Ho = t => {
        const { tabContent: s, nav: e } = t;
        s && h(s, Nt) && ((s.style.height = ''), b(s, Nt)), e && u.clear(e);
    };
    const Po = t => {
        const { element: s, tabContent: e, content: n, nav: o } = t;
        const { tab: i } = (T(o) && we.get(o)) || { tab: null };
        if (e && n && h(n, W)) {
            const { currentHeight: c, nextHeight: a } = we.get(s) || {
                currentHeight: 0,
                nextHeight: 0
            };
            c === a
                ? Ho(t)
                : setTimeout(() => {
                      (e.style.height = `${a}px`), It(e), P(e, () => Ho(t));
                  }, 50);
        } else o && u.clear(o);
        (Co.relatedTarget = i), w(s, Co);
    };
    const Do = t => {
        const { element: s, content: e, tabContent: n, nav: o } = t;
        const { tab: i, content: c } = (o && we.get(o)) || { tab: null, content: null };
        let a = 0;
        if (
            (n &&
                e &&
                h(e, W) &&
                ([c, e].forEach(l => {
                    T(l) && f(l, 'overflow-hidden');
                }),
                (a = T(c) ? c.scrollHeight : 0)),
            (Ds.relatedTarget = i),
            (So.relatedTarget = s),
            w(s, Ds),
            !Ds.defaultPrevented)
        ) {
            if ((e && f(e, C), c && b(c, C), n && e && h(e, W))) {
                const l = e.scrollHeight;
                we.set(s, { currentHeight: a, nextHeight: l, tab: null, content: null }),
                    f(n, Nt),
                    (n.style.height = `${a}px`),
                    It(n),
                    [c, e].forEach(r => {
                        r && b(r, 'overflow-hidden');
                    });
            }
            e && e && h(e, W)
                ? setTimeout(() => {
                      f(e, m),
                          P(e, () => {
                              Po(t);
                          });
                  }, 1)
                : (e && f(e, m), Po(t)),
                i && w(i, So);
        }
    };
    const xo = t => {
        const { nav: s } = t;
        if (!T(s)) return { tab: null, content: null };
        const e = gt(C, s);
        let n = null;
        e.length === 1 && !Ot.some(i => h(e[0].parentElement, i))
            ? ([n] = e)
            : e.length > 1 && (n = e[e.length - 1]);
        const o = T(n) ? V(n) : null;
        return { tab: n, content: o };
    };
    const Ao = t => {
        if (!T(t)) return null;
        const s = M(t, `.${Ot.join(',.')}`);
        return s ? D(`.${Ot[0]}-toggle`, s) : null;
    };
    const Dc = t => {
        const s = yo(t.target);
        s && (t.preventDefault(), s.show());
    };
    class ne extends st {
        constructor(e) {
            super(e);
            d(this, '_toggleEventListeners', e => {
                (e ? _ : B)(this.element, N, Dc);
            });
            const { element: n } = this;
            const o = V(n);
            if (o) {
                const i = M(n, '.nav');
                const c = M(o, '.tab-content');
                (this.nav = i), (this.content = o), (this.tabContent = c), (this.dropdown = Ao(n));
                const { tab: a } = xo(this);
                if (i && !a) {
                    const l = D(To, i);
                    const r = l && V(l);
                    r && (f(l, C), f(r, m), f(r, C), O(n, Ue, 'true'));
                }
                this._toggleEventListeners(!0);
            }
        }
        get name() {
            return $o;
        }
        show() {
            const { element: e, content: n, nav: o, dropdown: i } = this;
            if (!(o && u.get(o)) && !h(e, C)) {
                const { tab: c, content: a } = xo(this);
                if (
                    (o && we.set(o, { tab: c, content: a, currentHeight: 0, nextHeight: 0 }),
                    (xs.relatedTarget = e),
                    T(c) && (w(c, xs), !xs.defaultPrevented))
                ) {
                    f(e, C), O(e, Ue, 'true');
                    const l = T(c) && Ao(c);
                    if ((l && h(l, C) && b(l, C), o)) {
                        const r = () => {
                            c && (b(c, C), O(c, Ue, 'false')), i && !h(i, C) && f(i, C);
                        };
                        a && (h(a, W) || (n && h(n, W))) ? u.set(o, r, 1) : r();
                    }
                    a && (b(a, m), h(a, W) ? P(a, () => Do(this)) : Do(this));
                }
            }
        }
        dispose() {
            this._toggleEventListeners(), super.dispose();
        }
    }
    d(ne, 'selector', To), d(ne, 'init', Pc), d(ne, 'getInstance', yo);
    const G = 'toast';
    const Lo = 'Toast';
    const xc = `.${G}`;
    const Ac = `[${Me}="${G}"]`;
    const Io = `[${rt}="${G}"]`;
    const oe = 'showing';
    const ko = 'hide';
    const Lc = { animation: !0, autohide: !0, delay: 5e3 };
    const As = t => F(t, Lo);
    const Ic = t => new ie(t);
    const No = $(`show.bs.${G}`);
    const kc = $(`shown.bs.${G}`);
    const Oo = $(`hide.bs.${G}`);
    const Nc = $(`hidden.bs.${G}`);
    const Mo = t => {
        const { element: s, options: e } = t;
        b(s, oe), u.clear(s, oe), w(s, kc), e.autohide && u.set(s, () => t.hide(), e.delay, G);
    };
    const _o = t => {
        const { element: s } = t;
        b(s, oe), b(s, m), f(s, ko), u.clear(s, G), w(s, Nc);
    };
    const Oc = t => {
        const { element: s, options: e } = t;
        f(s, oe), e.animation ? (It(s), P(s, () => _o(t))) : _o(t);
    };
    const Mc = t => {
        const { element: s, options: e } = t;
        u.set(
            s,
            () => {
                b(s, ko), It(s), f(s, m), f(s, oe), e.animation ? P(s, () => Mo(t)) : Mo(t);
            },
            17,
            oe
        );
    };
    const _c = t => {
        u.clear(t.element, G), t._toggleEventListeners();
    };
    const Bc = t => {
        const { target: s } = t;
        const e = s && M(s, Io);
        const n = e && V(e);
        const o = n && As(n);
        o && (e && e.tagName === 'A' && t.preventDefault(), (o.relatedTarget = e), o.show());
    };
    const Rc = t => {
        const s = t.target;
        const e = As(s);
        const { type: n, relatedTarget: o } = t;
        e &&
            s !== o &&
            !s.contains(o) &&
            ([De, Qe].includes(n) ? u.clear(s, G) : u.set(s, () => e.hide(), e.options.delay, G));
    };
    class ie extends st {
        constructor(e, n) {
            super(e, n);
            d(this, 'show', () => {
                const { element: e, isShown: n } = this;
                e && !n && (w(e, No), No.defaultPrevented || Mc(this));
            });
            d(this, 'hide', () => {
                const { element: e, isShown: n } = this;
                e && n && (w(e, Oo), Oo.defaultPrevented || Oc(this));
            });
            d(this, '_toggleEventListeners', e => {
                const n = e ? _ : B;
                const { element: o, triggers: i, dismiss: c, options: a, hide: l } = this;
                c && n(c, N, l),
                    a.autohide && [Qe, Bs, De, Ze].forEach(r => n(o, r, Rc)),
                    i.length && i.forEach(r => n(r, N, Bc));
            });
            const { element: o, options: i } = this;
            i.animation && !h(o, W) ? f(o, W) : !i.animation && h(o, W) && b(o, W),
                (this.dismiss = D(Ac, o)),
                (this.triggers = [...et(Io, E(o))].filter(c => V(c) === o)),
                this._toggleEventListeners(!0);
        }
        get name() {
            return Lo;
        }
        get defaults() {
            return Lc;
        }
        get isShown() {
            return h(this.element, m);
        }
        dispose() {
            const { element: e, isShown: n } = this;
            n && b(e, m), _c(this), super.dispose();
        }
    }
    d(ie, 'selector', xc), d(ie, 'init', Ic), d(ie, 'getInstance', As);
    const Ls = new Map();
    [Ut, qt, Qt, Zt, Jt, te, ee, Rt, se, ne, ie, St].forEach(t => Ls.set(t.prototype.name, t));
    const Wc = (t, s) => {
        [...s].forEach(e => t(e));
    };
    const Fc = (t, s) => {
        const e = Lt.getAllFor(t);
        e &&
            [...e].forEach(([n, o]) => {
                s.contains(n) && o.dispose();
            });
    };
    const Is = t => {
        const s = t?.nodeName ? t : document;
        const e = [...is('*', s)];
        Ls.forEach(n => {
            const { init: o, selector: i } = n;
            Wc(
                o,
                e.filter(c => Js(c, i))
            );
        });
    };
    const jc = t => {
        const s = t?.nodeName ? t : document;
        Ls.forEach(e => {
            Fc(e.prototype.name, s);
        });
    };
    return (
        document.body ? Is() : _(document, 'DOMContentLoaded', () => Is(), { once: !0 }),
        (H.Alert = Ut),
        (H.Button = qt),
        (H.Carousel = Qt),
        (H.Collapse = Zt),
        (H.Dropdown = Jt),
        (H.Modal = te),
        (H.Offcanvas = ee),
        (H.Popover = Rt),
        (H.ScrollSpy = se),
        (H.Tab = ne),
        (H.Toast = ie),
        (H.Tooltip = St),
        (H.initCallback = Is),
        (H.removeDataAPI = jc),
        Object.defineProperty(H, Symbol.toStringTag, { value: 'Module' }),
        H
    );
})({});
//# sourceMappingURL=bootstrap-native.js.map

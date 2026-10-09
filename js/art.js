/* Hand-drawn product illustrations. Every product is a tiny flat SVG on a 120×120 grid,
   built from a handful of primitives so the whole catalogue reads as one illustration set. */
window.ART = (() => {
  const sh = (rx = 34, cy = 104) => `<ellipse cx="60" cy="${cy}" rx="${rx}" ry="5" fill="#13261D" opacity=".1"/>`;
  const hl = (x, y, rx, ry, r = 0, o = .3) =>
    `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" transform="rotate(${r} ${x} ${y})" fill="#fff" opacity="${o}"/>`;
  const f = n => +n.toFixed(1);

  // Қошқар мүйіз — ram-horn ornament, reused on labels, logo and banners
  const horn = (x, y, s, color, w = 2) =>
    `<g transform="translate(${x} ${y}) scale(${s})" fill="none" stroke="${color}" stroke-width="${w / s}" stroke-linecap="round" stroke-linejoin="round">
      <path d="M0 18V2M0 2c0-8-10-12-15-7-3.5 3.5-1 9 3.5 8 3-.5 3.5-4.5 1-5.5M0 2c0-8 10-12 15-7 3.5 3.5 1 9-3.5 8-3-.5-3.5-4.5-1-5.5"/></g>`;

  function apple(c, dark, stripes) {
    return `${sh(30)}
      <path d="M60 40C49 30 26 33 26 60c0 24 17 42 34 37 17 5 34-13 34-37 0-27-23-30-34-20z" fill="${c}"/>
      ${stripes ? `<path d="M38 52c-3 12-1 26 6 37M50 46c-2 16 0 32 6 47M72 46c3 15 2 31-5 46M84 54c2 10 0 22-6 32" stroke="${dark}" stroke-width="2.6" fill="none" opacity=".35" stroke-linecap="round"/>` : ''}
      <path d="M60 97c17 5 34-13 34-37 0-8-2-14-5-18 1 4 1 8 1 12 0 24-15 40-30 43z" fill="${dark}" opacity=".2"/>
      <path d="M60 42c0-8 2-14 7-19" stroke="#5B3A21" stroke-width="4" fill="none" stroke-linecap="round"/>
      <path d="M65 31c5-11 17-13 24-9-5 10-15 13-24 9z" fill="#3F8F55"/>
      ${hl(42, 58, 6, 12, 20)}`;
  }

  function lemon() {
    let seg = '';
    for (let i = 0; i < 8; i++) {
      const a = i / 8 * Math.PI * 2;
      seg += `M84 86L${f(84 + Math.cos(a) * 12)} ${f(86 + Math.sin(a) * 12)}`;
    }
    return `${sh(38)}
      <ellipse cx="54" cy="62" rx="34" ry="25" transform="rotate(-18 54 62)" fill="#F0C93A"/>
      <ellipse cx="87" cy="51" rx="5" ry="4" fill="#F0C93A"/><ellipse cx="21" cy="73" rx="5" ry="4" fill="#E2B52A"/>
      ${hl(44, 54, 12, 5, -18, .35)}
      <circle cx="84" cy="86" r="17" fill="#E9BC2C"/><circle cx="84" cy="86" r="14" fill="#FBE79A"/>
      <path d="${seg}" stroke="#F2CF55" stroke-width="2"/><circle cx="84" cy="86" r="2.5" fill="#F2CF55"/>`;
  }

  const tomato = () => `${sh(32)}
    <path d="M60 42C36 40 24 56 26 72c2 18 18 26 34 26s32-8 34-26c2-16-10-32-34-30z" fill="#D9452E"/>
    <path d="M94 72c-2 18-18 26-34 26 10-4 22-14 24-30 1-8-1-16-6-22 10 6 17 15 16 26z" fill="#A82B1A" opacity=".35"/>
    <path d="M60 36l4 8 10-3-6 8 10 4-12 1-6 7-6-7-12-1 10-4-6-8 10 3z" fill="#3B8A4E"/>
    <path d="M60 38v-8" stroke="#3B8A4E" stroke-width="4" stroke-linecap="round"/>
    ${hl(42, 64, 6, 11, 30)}`;

  function cucumber() {
    let dots = '';
    for (let i = 0; i < 7; i++) dots += `<circle cx="${30 + i * 9}" cy="${i % 2 ? 60 : 55}" r="1.4" fill="#A6D08A"/>`;
    return `${sh(38)}
      <g transform="rotate(-12 60 74)"><rect x="22" y="66" width="80" height="22" rx="11" fill="#225F33"/><rect x="30" y="70" width="56" height="4" rx="2" fill="#fff" opacity=".18"/></g>
      <g transform="rotate(-32 60 56)"><rect x="18" y="44" width="84" height="24" rx="12" fill="#2F7D44"/><rect x="26" y="48" width="62" height="5" rx="2.5" fill="#fff" opacity=".25"/>${dots}</g>`;
  }

  const carrot = () => `${sh(30)}
    <path d="M84 36l12-22M88 40l20-12M80 33l-2-21" stroke="#3F8F55" stroke-width="6" stroke-linecap="round"/>
    <path d="M76 30c9-3 18 6 15 15L42 98c-4 4-10 0-8-5z" fill="#EC7F2E"/>
    <path d="M91 45L42 98c-4 4-10 0-8-5 6-4 30-30 57-48z" fill="#C25E1A" opacity=".3"/>
    <path d="M62 52l8 6M54 66l7 5M47 80l6 4M70 42l7 5" stroke="#C25E1A" stroke-width="2.5" stroke-linecap="round"/>`;

  const potato = () => `${sh(40)}
    <path d="M18 72c-2-14 12-24 28-22 14 2 22 12 20 24-2 12-14 18-26 17-12-1-20-7-22-19z" fill="#B3803F"/>
    <path d="M48 58c2-14 18-22 32-18 14 4 20 16 16 28-4 12-18 18-30 15-12-3-20-12-18-25z" fill="#CFA060"/>
    <circle cx="70" cy="52" r="1.8" fill="#9B6E33"/><circle cx="82" cy="66" r="1.6" fill="#9B6E33"/><circle cx="62" cy="72" r="1.6" fill="#9B6E33"/>
    <circle cx="34" cy="70" r="1.6" fill="#8A5E28"/><circle cx="44" cy="80" r="1.4" fill="#8A5E28"/>
    ${hl(66, 50, 9, 4, -20, .3)}`;

  const onion = () => `${sh(30)}
    <path d="M60 30s-1 12-14 20c-15 9-17 33-1 43 9 6 21 6 30 0 16-10 14-34-1-43-13-8-14-20-14-20z" fill="#C8723A"/>
    <path d="M60 34c-2 12-8 20-10 34-1 12 2 22 10 27M60 34c2 12 8 20 10 34 1 12-2 22-10 27" stroke="#A3552A" stroke-width="2" fill="none" opacity=".6"/>
    <path d="M56 96l-4 6M60 97v7M64 96l4 6" stroke="#8A6A45" stroke-width="2" stroke-linecap="round"/>
    <path d="M60 31c-2-6-1-12 3-16" stroke="#9BB86A" stroke-width="3" stroke-linecap="round" fill="none"/>
    ${hl(48, 66, 5, 12, 15, .25)}`;

  const watermelon = () => `${sh(36, 104)}
    <path d="M60 100L27 53Q60 26 93 53Z" fill="#E4483A"/>
    <path d="M20 42Q60 10 100 42L96 49Q60 20 24 49Z" fill="#2F7D44"/>
    <path d="M24 49Q60 20 96 49L93 53Q60 26 27 53Z" fill="#F3EED6"/>
    ${[[48, 58], [60, 50], [72, 58], [54, 70], [66, 70], [60, 84]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="2" ry="3.2" fill="#2B1D16"/>`).join('')}`;

  const melon = () => `${sh(42)}
    <g transform="rotate(-14 60 66)"><ellipse cx="60" cy="66" rx="46" ry="26" fill="#E7C04F"/>
    <path d="M26 54q34 10 68 0M18 66q42 8 84 0M26 78q34-8 68 0M44 42q-6 24 0 48M76 42q6 24 0 48" stroke="#C9A033" stroke-width="2" fill="none" opacity=".7"/>
    <ellipse cx="44" cy="54" rx="14" ry="4" fill="#fff" opacity=".3"/></g>`;

  function grapes() {
    const pts = [[46, 44], [60, 44], [74, 44], [40, 57], [53, 57], [67, 57], [80, 57], [46, 70], [60, 70], [74, 70], [53, 83], [67, 83], [60, 95]];
    return `${sh(26)}<path d="M60 40V24" stroke="#6B4A2A" stroke-width="3.5" stroke-linecap="round"/>
      <path d="M62 30c8-10 22-8 26-2-8 8-18 8-26 2z" fill="#3F8F55"/>
      ${pts.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="9" fill="#A9C25A"/><circle cx="${x - 3}" cy="${y - 3}" r="2.6" fill="#fff" opacity=".45"/>`).join('')}`;
  }

  const carton = (c, side, cap = c) => `${sh(30)}
    <path d="M36 48h36v52H36z" fill="#FBF8EF"/>
    <path d="M72 48l14-7v52l-14 7z" fill="#E2DCCB"/>
    <path d="M36 48l18-16 18 16z" fill="#F2EEE2"/>
    <path d="M54 32l14-7 18 16-14 7z" fill="#D7D0BD"/>
    <rect x="55" y="23" width="10" height="7" rx="2" fill="${cap}"/>
    <path d="M36 64h36v22H36z" fill="${c}"/>
    <path d="M72 64l14-7v22l-14 7z" fill="${side}"/>
    <path d="M42 72h20M42 78h13" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".9"/>`;

  const bottle = (body, label, cap, ink, ornament) => `${sh(24)}
    <path d="M51 24h18v12c0 6 11 10 11 22v38c0 4-3 6-6 6H46c-3 0-6-2-6-6V58c0-12 11-16 11-22z" fill="${body}"/>
    <rect x="49" y="16" width="22" height="11" rx="3" fill="${cap}"/>
    <rect x="40" y="62" width="40" height="26" fill="${label}"/>
    ${ornament ? horn(60, 70, .62, ink, 1.6) : `<path d="M48 71h24M48 78h15" stroke="${ink}" stroke-width="3" stroke-linecap="round"/>`}
    <rect x="45" y="42" width="4.5" height="52" rx="2.2" fill="#fff" opacity=".35"/>`;

  const jar = (fill, lid, label, ink) => `${sh(30)}
    <rect x="34" y="30" width="52" height="13" rx="4" fill="${lid}"/>
    <path d="M38 43h44c4 0 6 3 6 7v42c0 6-4 10-10 10H42c-6 0-10-4-10-10V50c0-4 2-7 6-7z" fill="${fill}"/>
    <rect x="38" y="60" width="44" height="26" rx="5" fill="${label}"/>
    ${horn(60, 67, .6, ink, 1.6)}
    <rect x="38" y="47" width="4.5" height="46" rx="2.2" fill="#fff" opacity=".35"/>`;

  const honey = () => `${sh(30)}
    <path d="M38 43h44c4 0 6 3 6 7v42c0 6-4 10-10 10H42c-6 0-10-4-10-10V50c0-4 2-7 6-7z" fill="#E39A2E"/>
    <path d="M32 40c4-10 12-12 28-12s24 2 28 12l-3 7-6-4-6 5-6-4-7 5-7-5-6 4-6-5-6 4z" fill="#D8472E"/>
    <path d="M34 42h52" stroke="#F7F1E1" stroke-width="2" stroke-dasharray="3 3"/>
    <rect x="40" y="62" width="40" height="24" rx="5" fill="#F7F1E1"/>
    <path d="M54 68l6-3.5 6 3.5v7l-6 3.5-6-3.5z" fill="none" stroke="#C47B16" stroke-width="2"/>
    <rect x="38" y="50" width="4.5" height="42" rx="2.2" fill="#fff" opacity=".35"/>`;

  const eggs = () => `${sh(42)}
    <ellipse cx="38" cy="58" rx="12" ry="16" fill="#E9D3B3"/><ellipse cx="62" cy="54" rx="12" ry="16" fill="#F3E6D2"/><ellipse cx="85" cy="58" rx="12" ry="16" fill="#E4C9A4"/>
    ${hl(34, 52, 3, 6, 15, .5)}${hl(58, 48, 3, 6, 15, .55)}${hl(81, 52, 3, 6, 15, .5)}
    <path d="M16 68h88l-6 28c-1 4-4 6-8 6H30c-4 0-7-2-8-6z" fill="#BFA27C"/>
    <path d="M16 68h88" stroke="#A88B64" stroke-width="3"/>
    <path d="M28 84c4 6 10 6 14 0M53 84c4 6 10 6 14 0M78 84c4 6 10 6 14 0" stroke="#A88B64" stroke-width="2" fill="none"/>`;

  const tvorog = () => `${sh(30)}
    <path d="M32 50h56l-7 46c-1 4-4 6-8 6H47c-4 0-7-2-8-6z" fill="#FBF8EF"/>
    <path d="M34 64h52l-2 16H36z" fill="#2D7A4C"/>
    ${horn(60, 66, .5, '#F7F1E1', 1.4)}
    <ellipse cx="60" cy="50" rx="30" ry="8" fill="#DDE9C5"/><ellipse cx="60" cy="48" rx="30" ry="8" fill="#E8F1D6"/>`;

  const cheese = () => `${sh(42)}
    <path d="M18 66L80 40l22 16-62 26z" fill="#F6D368"/>
    <path d="M18 66l22 16v18L18 84z" fill="#E3B23A"/>
    <path d="M40 82l62-26v18l-62 26z" fill="#EFC24A"/>
    <ellipse cx="62" cy="80" rx="4" ry="3" fill="#D8A532"/><ellipse cx="84" cy="70" rx="3" ry="2.4" fill="#D8A532"/><ellipse cx="28" cy="80" rx="2.4" ry="3" fill="#C99A2C"/>
    <ellipse cx="58" cy="58" rx="4" ry="2" fill="#E9BE4C"/><ellipse cx="76" cy="52" rx="3" ry="1.6" fill="#E9BE4C"/>`;

  function tandyr() {
    let dots = '', seeds = '';
    for (let i = 0; i < 12; i++) {
      const a = i / 12 * Math.PI * 2;
      dots += `<circle cx="${f(60 + Math.cos(a) * 17)}" cy="${f(64 + Math.sin(a) * 10)}" r="2" fill="#A86A2C"/>`;
      seeds += `<ellipse cx="${f(60 + Math.cos(a + .2) * 38)}" cy="${f(64 + Math.sin(a + .2) * 24)}" rx="1.6" ry="1" fill="#FFF3D6"/>`;
    }
    return `${sh(46, 102)}
      <ellipse cx="60" cy="68" rx="48" ry="32" fill="#C47F37"/>
      <ellipse cx="60" cy="64" rx="48" ry="31" fill="#DFA154"/>
      <ellipse cx="60" cy="65" rx="30" ry="18" fill="#C98840"/><ellipse cx="60" cy="64" rx="28.5" ry="17" fill="#EBC07E"/>
      ${dots}<circle cx="60" cy="64" r="3" fill="#A86A2C"/>${seeds}
      ${hl(36, 50, 10, 4, -15, .25)}`;
  }

  function baursak() {
    const p = [[38, 76, -12], [60, 78, 8], [83, 76, -6], [48, 62, 14], [72, 62, -10], [60, 48, 4]];
    return `${sh(46, 102)}
      <ellipse cx="60" cy="90" rx="48" ry="13" fill="#F8F3E8"/><ellipse cx="60" cy="90" rx="40" ry="9" fill="none" stroke="#2E6D8E" stroke-width="1.6" stroke-dasharray="3 3"/>
      ${p.map(([x, y, r]) => `<g transform="translate(${x} ${y}) rotate(${r})"><rect x="-13" y="-11" width="26" height="22" rx="9" fill="#D48F3B"/><rect x="-9" y="-8" width="15" height="9" rx="4.5" fill="#EFBD70" opacity=".85"/></g>`).join('')}`;
  }

  const samsa = () => `${sh(42)}
    <path d="M84 50l20 38H64z" fill="#CF8E43" stroke="#CF8E43" stroke-width="12" stroke-linejoin="round"/>
    <path d="M50 38l30 52H20z" fill="#E0A353" stroke="#E0A353" stroke-width="14" stroke-linejoin="round"/>
    <path d="M50 54l16 30M50 54L34 84" stroke="#C98840" stroke-width="2" opacity=".6"/>
    ${[[44, 62], [54, 66], [48, 74], [58, 78], [40, 80], [86, 72], [92, 80]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="1.5" ry="1" fill="#FFF3D6"/>`).join('')}
    ${hl(38, 70, 4, 10, 30, .2)}`;

  const baton = () => `${sh(44)}
    <g transform="rotate(-16 60 66)"><ellipse cx="60" cy="66" rx="48" ry="19" fill="#C9883F"/><ellipse cx="60" cy="63" rx="47" ry="17" fill="#DCA05A"/>
    <path d="M30 54l8 16M46 50l8 18M62 49l8 18M78 50l8 16" stroke="#F0C98C" stroke-width="5" stroke-linecap="round"/></g>`;

  const rye = () => `${sh(40)}
    <rect x="20" y="44" width="80" height="54" rx="14" fill="#5E3E25"/>
    <rect x="20" y="40" width="80" height="44" rx="16" fill="#76502F"/>
    ${[[36, 56], [52, 52], [68, 58], [84, 54], [44, 68], [76, 70], [60, 66]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="2" ry="1" transform="rotate(30 ${x} ${y})" fill="#C9A06C"/>`).join('')}
    ${hl(40, 48, 14, 3, 0, .18)}`;

  const steak = (c, fat, bone) => `${sh(38)}
    <path d="M24 64c0-18 20-28 40-26 20 2 32 14 30 30-2 18-20 26-40 24-18-2-30-12-30-28z" fill="${c}"/>
    <path d="M24 64c0-18 20-28 40-26 20 2 32 14 30 30" stroke="${fat}" stroke-width="6" fill="none" stroke-linecap="round"/>
    <path d="M38 72c8-6 16 2 24-4M46 84c8-4 16 2 26-6M44 56c6-2 10 2 16-2" stroke="#fff" stroke-width="2.4" fill="none" opacity=".45" stroke-linecap="round"/>
    ${bone ? `<circle cx="72" cy="66" r="8" fill="#F4EEDD"/><circle cx="72" cy="66" r="3.4" fill="#DCCBA6"/>` : ''}`;

  const kazy = () => `${sh(40)}
    <path d="M30 88C22 58 38 30 62 30s38 26 30 56" stroke="#7E2E22" stroke-width="18" fill="none" stroke-linecap="round"/>
    <path d="M34 78C30 54 42 38 60 38" stroke="#fff" stroke-width="3" fill="none" opacity=".2" stroke-linecap="round"/>
    <path d="M26 98l8-6M98 96l-8-6" stroke="#E7DCC6" stroke-width="3" stroke-linecap="round"/>
    <circle cx="56" cy="88" r="13" fill="#9A3A2C"/><circle cx="52" cy="85" r="6" fill="#F4E6CF"/>
    <circle cx="74" cy="94" r="10" fill="#8C3225"/><circle cx="77" cy="92" r="4.5" fill="#F4E6CF"/>`;

  const chicken = () => `${sh(40)}
    ${[[-30, 50, 58], [-10, 66, 70]].map(([r, x, y]) => `<g transform="rotate(${r} ${x} ${y})"><ellipse cx="${x - 10}" cy="${y}" rx="24" ry="18" fill="#EBB3A1"/><ellipse cx="${x - 16}" cy="${y - 6}" rx="10" ry="5" fill="#fff" opacity=".3"/><rect x="${x + 8}" y="${y - 4.5}" width="22" height="9" rx="4.5" fill="#F3ECDC"/><circle cx="${x + 30}" cy="${y - 5}" r="6" fill="#F3ECDC"/><circle cx="${x + 30}" cy="${y + 5}" r="6" fill="#F3ECDC"/></g>`).join('')}`;

  const bowl = (inner, c = '#2E6D8E') => `${sh(40, 104)}${inner}
    <path d="M18 66h84c0 20-18 34-42 34S18 86 18 66z" fill="${c}"/>
    <path d="M24 76h72" stroke="#F3EEE1" stroke-width="2" stroke-dasharray="5 4" opacity=".8"/>
    <ellipse cx="60" cy="66" rx="42" ry="4" fill="#13261D" opacity=".18"/>`;

  const kurt = () => bowl([[42, 60], [60, 58], [78, 60], [51, 48], [69, 48], [60, 38]]
    .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="10" fill="#F4EFE2"/><circle cx="${x + 3}" cy="${y + 3}" r="6" fill="#E2D9C3" opacity=".7"/><circle cx="${x - 3}" cy="${y - 3}" r="2.5" fill="#fff"/>`).join(''));

  const kuraga = () => bowl([[40, 60, 20], [58, 58, -10], [78, 60, 30], [50, 48, -25], [68, 48, 15], [60, 40, 0]]
    .map(([x, y, r]) => `<g transform="translate(${x} ${y}) rotate(${r})"><ellipse rx="12" ry="8" fill="#E8862C"/><path d="M-6 0h12" stroke="#B85F12" stroke-width="2" stroke-linecap="round"/></g>`).join(''), '#B4573A');

  function raisins() {
    let s = '';
    for (let i = 0; i < 26; i++) {
      const x = 30 + (i * 37) % 60, y = 44 + ((i * 53) % 24);
      s += `<ellipse cx="${x}" cy="${y}" rx="4.5" ry="3.2" transform="rotate(${(i * 47) % 180} ${x} ${y})" fill="${i % 3 ? '#6E3B2A' : '#8A4E32'}"/>`;
    }
    return bowl(s, '#2D7A4C');
  }

  const irimshik = () => `${sh(44, 102)}
    <ellipse cx="60" cy="90" rx="48" ry="12" fill="#F8F3E8"/>
    <path d="M24 84l6-16 18-4 6 14-10 10z" fill="#E2B56A"/>
    <path d="M44 80l8-22 22-2 6 20-16 10z" fill="#EBC47C"/>
    <path d="M70 84l4-18 20 0 4 16-14 8z" fill="#D9A55C"/>
    <path d="M52 60l12-2" stroke="#fff" stroke-width="2" opacity=".5" stroke-linecap="round"/>`;

  function dough() {
    let s = '';
    for (let i = 0; i < 5; i++) {
      const y = 82 - i * 7, x = 60 + (i % 2 ? 3 : -3);
      s += `<path d="M${x} ${y - 15}L${x + 38} ${y + 3}L${x} ${y + 21}L${x - 38} ${y + 3}Z" fill="#D9BE86"/><path d="M${x} ${y - 18}L${x + 38} ${y}L${x} ${y + 18}L${x - 38} ${y}Z" fill="#F6E7C1"/>`;
    }
    return `${sh(42)}${s}${[[52, 52], [66, 50], [60, 58], [74, 56]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.2" fill="#fff"/>`).join('')}`;
  }

  function zhent() {
    const p = [[36, 76], [60, 80], [84, 76], [48, 62], [72, 62], [60, 48]];
    return `${sh(46, 102)}<ellipse cx="60" cy="90" rx="48" ry="12" fill="#F8F3E8"/>
      ${p.map(([x, y]) => `<path d="M${x} ${y - 12}l14 12-14 12-14-12z" fill="#C38D4E"/><path d="M${x} ${y - 9}l10 9" stroke="#E8C27E" stroke-width="2.5" stroke-linecap="round"/>`).join('')}
      ${[[34, 76], [58, 82], [86, 74], [50, 60], [70, 64], [62, 46]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.3" fill="#F3D9A4"/>`).join('')}`;
  }

  const sack = (label, grain) => `${sh(32)}
    <path d="M38 44c-4 18-8 36-6 52 0 4 4 6 8 6h40c4 0 8-2 8-6 2-16-2-34-6-52z" fill="#EADFC3"/>
    <path d="M42 44c2-8 10-10 10-16h16c0 6 8 8 10 16z" fill="#DCCDA6"/>
    <rect x="44" y="40" width="32" height="6" rx="3" fill="#B08D57"/>
    <rect x="40" y="60" width="40" height="30" rx="6" fill="${label}"/>
    <g fill="${grain}"><ellipse cx="54" cy="75" rx="3" ry="6" transform="rotate(-25 54 75)"/><ellipse cx="60" cy="72" rx="3" ry="6"/><ellipse cx="66" cy="75" rx="3" ry="6" transform="rotate(25 66 75)"/></g>
    <path d="M44 50c-2 12-4 26-3 40" stroke="#fff" stroke-width="3" opacity=".35" stroke-linecap="round" fill="none"/>`;

  const oil = () => `${sh(22)}
    <rect x="53" y="12" width="14" height="9" rx="2" fill="#2D7A4C"/>
    <path d="M54 21h12v10c0 4 12 8 12 18v48c0 4-3 6-6 6H48c-3 0-6-2-6-6V49c0-10 12-14 12-18z" fill="#F2C14E"/>
    <rect x="42" y="62" width="36" height="24" fill="#2D7A4C"/>
    <circle cx="60" cy="74" r="7" fill="none" stroke="#F2C14E" stroke-width="2"/><circle cx="60" cy="74" r="2.5" fill="#F2C14E"/>
    <rect x="46" y="38" width="4.5" height="56" rx="2.2" fill="#fff" opacity=".35"/>`;

  const tea = () => `${sh(44)}
    <path d="M22 40h40v58H22z" fill="#1E5A43"/>
    <path d="M62 40l14-8v58l-14 8z" fill="#123E2D"/>
    <path d="M22 40l14-8h40l-14 8z" fill="#2D7A4C"/>
    <circle cx="42" cy="62" r="11" fill="none" stroke="#F3D58A" stroke-width="2"/>
    ${horn(42, 60, .5, '#F3D58A', 1.4)}
    <path d="M32 84h20" stroke="#F3D58A" stroke-width="3" stroke-linecap="round"/>
    <path d="M62 80h44c0 13-10 22-22 22s-22-9-22-22z" fill="#FBF7EE"/>
    <path d="M65 88h38" stroke="#2E6D8E" stroke-width="3"/>
    <ellipse cx="84" cy="80" rx="22" ry="4" fill="#B6602A"/><ellipse cx="80" cy="79" rx="8" ry="1.4" fill="#fff" opacity=".35"/>`;

  const water = () => `${sh(22)}
    <rect x="52" y="12" width="16" height="9" rx="2" fill="#2E6D8E"/>
    <path d="M53 21h14v8c0 4 12 8 12 18v48c0 5-3 8-8 8H49c-5 0-8-3-8-8V47c0-10 12-14 12-18z" fill="#CFE6EA"/>
    <rect x="41" y="58" width="38" height="24" fill="#fff"/><path d="M44 79l10-13 6 7 5-5 11 11z" fill="#2E6D8E"/><path d="M51 70l3-4 3 3z" fill="#fff"/>
    <path d="M42 90h36M42 96h36" stroke="#B5D6DC" stroke-width="2"/>
    <rect x="46" y="36" width="4.5" height="56" rx="2.2" fill="#fff" opacity=".6"/>`;

  const choc = () => `${sh(42)}
    <g transform="rotate(-14 60 64)"><rect x="18" y="42" width="84" height="44" rx="4" fill="#5E321F"/>
    <path d="M32 42v44M18 57h30M18 71h30" stroke="#4A2616" stroke-width="2"/>
    <rect x="46" y="40" width="58" height="48" rx="4" fill="#B23A2A"/>
    <rect x="46" y="56" width="58" height="16" fill="#F3D58A"/>
    ${horn(75, 60, .45, '#B23A2A', 1.6)}</g>`;

  const bag = () => `${sh(38)}
    <path d="M46 44c-8-14 0-28 8-30 3 10 1 22-8 30z" fill="#3F8F55"/>
    <rect x="60" y="10" width="14" height="44" rx="7" transform="rotate(14 67 32)" fill="#D79A4E"/>
    <path d="M70 44c4-10 14-14 22-10-4 10-14 14-22 10z" fill="#5FA868"/>
    <path d="M28 42h64l4 58c0 3-2 5-5 5H29c-3 0-5-2-5-5z" fill="#CFA978"/>
    <path d="M28 42h64l.6 8H27.4z" fill="#B88F5C"/>
    ${horn(60, 70, .9, '#0F3B2C', 2.4)}`;

  const D = {
    aport: () => apple('#D6402B', '#7A1A10', true),
    granny: () => apple('#8DC24F', '#4E7A22', false),
    tomato, cucumber, carrot, potato, onion, watermelon, melon, grapes, lemon,
    milk: () => carton('#2D7A4C', '#215C39', '#2D7A4C'),
    juice: () => carton('#EE9B45', '#C77A2C', '#D8472E'),
    ayran: () => bottle('#F5F2EA', '#2E6D8E', '#2E6D8E', '#F5F2EA'),
    kumys: () => bottle('#F1EDE2', '#0F3B2C', '#C9A24A', '#E9D9A6', true),
    shubat: () => bottle('#F4EEDF', '#B4573A', '#7A3B23', '#F7E2C8', true),
    tarhun: () => bottle('#6DB673', '#F7F1E1', '#0F3B2C', '#2D7A4C'),
    kaymak: () => jar('#FBF6E9', '#2E6D8E', '#2E6D8E', '#F7F1E1'),
    honey, eggs, tvorog, cheese,
    tandyr, baursak, samsa, baton, rye,
    beef: () => steak('#B83A33', '#F2E3CF', false),
    lamb: () => steak('#C9504A', '#F6EBDC', true),
    horse: () => steak('#8E2C27', '#F1DFC4', false),
    chicken, kazy, kurt, irimshik, dough, zhent,
    rice: () => sack('#2D7A4C', '#F7F1E1'),
    buckwheat: () => sack('#8A5A3B', '#E9C79A'),
    flour: () => sack('#2E6D8E', '#F7F1E1'),
    oil, tea, water, choc, kuraga, raisins, bag,
  };

  const art = key => `<svg viewBox="0 0 120 120" aria-hidden="true" focusable="false">${(D[key] || bag)()}</svg>`;
  art.horn = horn;
  return art;
})();

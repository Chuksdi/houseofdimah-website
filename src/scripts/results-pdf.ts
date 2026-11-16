// "Download your results": builds a PDF of the visitor's Brand Check in their browser.
// Nothing is sent anywhere. Loaded only when someone clicks the button (jsPDF is ~100 KB+).
// Reads what the page has already shown them (score, band, areas, fixes, answers) from the DOM.
import { jsPDF } from 'jspdf';

type Area = { name: string; got: number; max: number; colour: string };
type Fix = { n: string; title: string; text: string; tag: string };
type Answer = { n: string; q: string; a: string };
export type Results = { score: number; band: string; bandText: string; areas: Area[]; fixes: Fix[]; answers: Answer[]; fixIntro: string };

const INK = '#0B0B0B', PAPER = '#F6FAFE', WHITE = '#FFFFFF', MUTE = '#5C6066', ORANGE = '#FF5B23', AQUA = '#8BDAE4', VIOLET = '#788CE3';
const AREA_COLOUR: Record<string, string> = { story: AQUA, brand: ORANGE, content: VIOLET };

export function readResults(): Results {
  const $ = (s: string) => document.querySelector(s);
  const txt = (s: string) => ($(s)?.textContent || '').trim();
  const areas: Area[] = Array.from(document.querySelectorAll<HTMLElement>('[data-area-val]')).map((el) => {
    const k = el.dataset.areaVal || '';
    const [got, max] = (el.textContent || '0 / 0').split('/').map((x) => Number(x.trim()) || 0);
    const name = (el.parentElement?.firstElementChild?.textContent || k).trim();
    return { name, got, max, colour: AREA_COLOUR[k] || AQUA };
  });
  const fixes: Fix[] = Array.from(document.querySelectorAll('#bc-fixes li')).map((li) => ({
    n: (li.querySelector('.n')?.textContent || '').trim(),
    title: (li.querySelector('b')?.textContent || '').trim(),
    text: (li.querySelector('p')?.textContent || '').trim(),
    tag: (li.querySelector('small')?.textContent || '').trim(),
  }));
  const answers: Answer[] = Array.from(document.querySelectorAll<HTMLElement>('.q')).map((f, i) => {
    const picked = f.querySelector<HTMLInputElement>('input:checked');
    const a = picked ? (picked.parentElement?.textContent || '').trim() : '';
    const q = (f.querySelector('h2')?.textContent || '').trim();
    return { n: String(i + 1).padStart(2, '0'), q, a };
  });
  return { score: Number(txt('#bc-score')) || 0, band: txt('#bc-band'), bandText: txt('#bc-band-text'), areas, fixes, answers, fixIntro: txt('#bc-fix-intro') };
}

async function asDataUrl(url: string) {
  const blob = await (await fetch(url)).blob();
  return await new Promise<string>((ok, bad) => { const r = new FileReader(); r.onload = () => ok(String(r.result)); r.onerror = bad; r.readAsDataURL(blob); });
}
async function asBase64(url: string) {
  const buf = new Uint8Array(await (await fetch(url)).arrayBuffer());
  let s = ''; for (let i = 0; i < buf.length; i += 0x8000) s += String.fromCharCode(...buf.subarray(i, i + 0x8000));
  return btoa(s);
}

export async function buildResultsPdf(r: Results) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4', compress: true });
  const [fd, s4, s6, logo] = await Promise.all([
    asBase64('/fonts/pdf/funnel-display-800.ttf'), asBase64('/fonts/pdf/saira-400.ttf'), asBase64('/fonts/pdf/saira-600.ttf'), asDataUrl('/media/logo-white.png'),
  ]);
  doc.addFileToVFS('fd.ttf', fd); doc.addFont('fd.ttf', 'Funnel', 'normal');
  doc.addFileToVFS('s4.ttf', s4); doc.addFont('s4.ttf', 'Saira', 'normal');
  doc.addFileToVFS('s6.ttf', s6); doc.addFont('s6.ttf', 'Saira', 'bold');

  const W = 210, H = 297, M = 20, CW = W - M * 2;
  const date = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  const font = (f: 'Funnel' | 'Saira', size: number, colour: string, style: 'normal' | 'bold' = 'normal') => { doc.setFont(f, style); doc.setFontSize(size); doc.setTextColor(colour); };
  const lines = (t: string, w: number) => doc.splitTextToSize(t, w) as string[];
  const lh = (size: number, k = 1.35) => size * 0.3528 * k; // pt -> mm line height

  // ---------- page 1: the cover, dark ----------
  doc.setFillColor(INK); doc.rect(0, 0, W, H, 'F');
  doc.addImage(logo, 'PNG', M, M, 30, 30 * 940 / 900);
  font('Saira', 10, PAPER); doc.setTextColor(170, 174, 180);
  doc.text(date, W - M, M + 4, { align: 'right' });

  let y = 92;
  font('Funnel', 40, PAPER);
  doc.text('Your Dimah', M, y); y += lh(40, 1.0);
  doc.text('Brand Check', M, y); y += 16;

  // score
  font('Funnel', 72, PAPER); doc.text(String(r.score), M, y + 18);
  const sw = doc.getTextWidth(String(r.score));
  font('Funnel', 24, PAPER); doc.setTextColor(170, 174, 180); doc.text('/ 20', M + sw + 3, y + 18);
  y += 32;
  font('Funnel', 18, PAPER); doc.text(r.band, M, y); y += 7;
  font('Saira', 11.5, PAPER); doc.setTextColor(214, 218, 222);
  const bt = lines(r.bandText, 120); doc.text(bt, M, y); y += bt.length * lh(11.5) + 10;

  // the three colour rules from the printable guide
  const third = (CW - 6) / 3;
  [AQUA, ORANGE, VIOLET].forEach((c, i) => { doc.setFillColor(c); doc.roundedRect(M + i * (third + 3), y, third, 2.2, 1.1, 1.1, 'F'); });
  y += 14;

  // areas
  r.areas.forEach((a) => {
    font('Saira', 11, PAPER, 'bold'); doc.text(a.name, M, y);
    font('Saira', 11, PAPER); doc.setTextColor(214, 218, 222); doc.text(`${a.got} / ${a.max}`, W - M, y, { align: 'right' });
    y += 3.5;
    doc.setFillColor(40, 40, 40); doc.roundedRect(M, y, CW, 3.2, 1.6, 1.6, 'F');
    const fw = a.max ? (CW * a.got) / a.max : 0;
    if (fw > 0) { doc.setFillColor(a.colour); doc.roundedRect(M, y, Math.max(fw, 3.2), 3.2, 1.6, 1.6, 'F'); }
    y += 12;
  });

  // cover footer
  doc.setDrawColor(60, 60, 60); doc.setLineWidth(0.2); doc.line(M, H - 22, W - M, H - 22);
  font('Saira', 8.5, PAPER); doc.setTextColor(150, 154, 160);
  doc.text('House of Dimah · Branding, content and social media marketing', M, H - 15);
  doc.text('houseofdimah.co.uk', W - M, H - 15, { align: 'right' });

  // ---------- page 2+: light pages ----------
  let page = 1;
  const newPage = () => {
    doc.addPage(); page += 1;
    doc.setFillColor(PAPER); doc.rect(0, 0, W, H, 'F');
    font('Saira', 8.5, MUTE); doc.text('The Dimah Brand Check · your results', M, H - 12); doc.text(String(page), W - M, H - 12, { align: 'right' });
    return M + 6;
  };
  const room = (need: number) => { if (y + need > H - 24) y = newPage(); };

  y = newPage();
  font('Funnel', 26, INK); doc.text('What to fix first', M, y + 6); y += 14;
  font('Saira', 11, MUTE); const fi = lines(r.fixIntro || 'One practical step for each.', CW); doc.text(fi, M, y); y += fi.length * lh(11) + 6;

  // all yes: the intro line above already says so, nothing else to list
  r.fixes.forEach((f) => {
    font('Funnel', 12, INK); const tl = lines(f.title, CW - 34);
    font('Saira', 10.5, INK); const xl = lines(f.text, CW - 34);
    const h = 10 + tl.length * lh(12) + xl.length * lh(10.5) + 8;
    room(h + 4);
    doc.setFillColor(WHITE); doc.roundedRect(M, y, CW, h, 2.5, 2.5, 'F');
    doc.setFillColor(f.tag.startsWith('No') ? ORANGE : AQUA); doc.rect(M, y, 1.4, h, 'F');
    font('Funnel', 16, INK); doc.text(f.n, M + 7, y + 11);
    let yy = y + 9;
    font('Funnel', 12, INK); doc.text(tl, M + 24, yy); yy += tl.length * lh(12) + 1;
    font('Saira', 10.5, '#33373C'); doc.text(xl, M + 24, yy); yy += xl.length * lh(10.5) + 1;
    font('Saira', 8.5, MUTE); doc.text(f.tag.toUpperCase(), M + 24, yy + 1.5);
    y += h + 4;
  });

  // all ten answers
  room(30);
  y += 6; font('Funnel', 18, INK); doc.text('Your answers', M, y); y += 8;
  r.answers.forEach((a) => {
    font('Saira', 10.5, INK); const ql = lines(a.q, CW - 46);
    const h = Math.max(ql.length * lh(10.5) + 4, 8);
    room(h + 1);
    doc.setDrawColor(220, 224, 228); doc.setLineWidth(0.2); doc.line(M, y, W - M, y);
    font('Saira', 10, MUTE); doc.text(a.n, M, y + 5.5);
    font('Saira', 10.5, INK); doc.text(ql, M + 10, y + 5.5);
    const c = a.a === 'Yes' ? '#1F7A4D' : a.a === 'No' ? ORANGE : '#4A5BB8';
    font('Saira', 10.5, c, 'bold'); doc.text(a.a || '-', W - M, y + 5.5, { align: 'right' });
    y += h + 1;
  });
  doc.setDrawColor(220, 224, 228); doc.line(M, y, W - M, y);

  // the offer, dark block
  room(52); y += 10;
  doc.setFillColor(INK); doc.roundedRect(M, y, CW, 44, 3, 3, 'F');
  font('Funnel', 17, PAPER); doc.text('Want us to go through it with you?', M + 9, y + 13);
  font('Saira', 10.5, PAPER); doc.setTextColor(214, 218, 222);
  const ol = lines('Ask for your free bespoke audit. We look at your story, brand identity, website and social channels ourselves, and send back the three changes that would make the biggest difference.', CW - 18);
  doc.text(ol, M + 9, y + 21);
  font('Saira', 10.5, PAPER, 'bold');
  // link back to wherever they took the check (the domain may not point at the site yet)
  const back = location.origin + '/brand-check/#audit';
  doc.textWithLink(back.replace(/^https?:\/\//, '').replace(/#audit$/, ''), M + 9, y + 38, { url: back });
  doc.textWithLink('hello@houseofdimah.co.uk', W - M - 9, y + 38, { url: 'mailto:hello@houseofdimah.co.uk', align: 'right' } as any);

  doc.setProperties({ title: 'Your Dimah Brand Check results', author: 'House of Dimah', subject: `Score ${r.score} / 20 · ${r.band}` });
  doc.save(`Dimah-Brand-Check-results-${new Date().toISOString().slice(0, 10)}.pdf`);
}

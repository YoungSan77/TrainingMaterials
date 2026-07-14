const IN = pt => pt / 72;
const isWide = c => /[\u1100-\u11FF\u2E80-\u9FFF\uAC00-\uD7A3\u3000-\u303F\uFF00-\uFFEF]/.test(c);
const EM = { wide: 1.00, latin: 0.55, space: 0.30 };   // em 단위 자폭 (한글=전각=1em)
const SAFE = 1.05;                                      // 폰트 대체·자간 오차 흡수
const textW = (t, fs) => [...String(t)].reduce((w, c) =>
    w + IN(fs) * (c === ' ' ? EM.space : isWide(c) ? EM.wide : EM.latin), 0);
const avail = (boxW, bulletPt) => boxW - IN(5.67) * 2 - IN(bulletPt);
const lineCount = (t, av, fs = 12) => Math.max(1, Math.ceil(textW(t, fs) * SAFE / av));
module.exports = { IN, textW, avail, lineCount };
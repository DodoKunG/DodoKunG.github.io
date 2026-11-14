(function (root) {
  'use strict';

  function sevenDates(endDate) {
    const end = new Date(endDate + 'T00:00:00Z');
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(end);
      date.setUTCDate(date.getUTCDate() - 6 + i);
      return date.toISOString().slice(0, 10);
    });
  }

  function monthKeys(date) {
    const [year, month] = date.split('-').map(Number);
    const prefix = 'lottery_wp_' + String(month).padStart(2, '0') + '_';
    return [prefix + (year + 543), prefix + String(year + 543).slice(-2), prefix + year];
  }

  function summarizeSevenDays(endDate, readDay) {
    const used = new Set();
    const rows = sevenDates(endDate).map(date => {
      const data = readDay(date) || {};
      const morning = String(data.morning || '').trim();
      const evening = String(data.evening || '').trim();
      const holiday = morning.includes('หยุด');
      (holiday ? [] : [morning, evening]).forEach(value => {
        if (/^[0-9]{1,2}$/.test(value) && Number(value) >= 1 && Number(value) <= 36) used.add(Number(value));
      });
      return { date, morning, evening, holiday };
    });
    const all = Array.from({ length: 36 }, (_, i) => i + 1);
    return { rows, drawn: all.filter(n => used.has(n)), undrawn: all.filter(n => !used.has(n)) };
  }

  const api = { sevenDates, monthKeys, summarizeSevenDays };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (!root.document) return;

  function bangkokToday() {
    const parts = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Bangkok', year: 'numeric', month: '2-digit', day: '2-digit'
    }).formatToParts(new Date());
    const value = type => parts.find(part => part.type === type).value;
    return value('year') + '-' + value('month') + '-' + value('day');
  }

  function readDay(date) {
    const [year, month, day] = date.split('-').map(Number);
    const title = document.querySelector('[data-id="main-title"]').textContent;
    const period = title.match(/(\d{1,2})\/(\d{2,4})/);
    if (period) {
      let currentYear = Number(period[2]);
      if (currentYear < 100) currentYear += 2500;
      if (currentYear >= 2400) currentYear -= 543;
      if (Number(period[1]) === month && currentYear === year) {
        return {
          morning: document.querySelector('[data-id="m' + day + 'a"]')?.textContent || '',
          evening: document.querySelector('[data-id="m' + day + 'e"]')?.textContent || ''
        };
      }
    }
    for (const key of monthKeys(date)) {
      try {
        const raw = localStorage.getItem(key);
        if (!raw) continue;
        const data = JSON.parse(raw);
        return { morning: data['text_m' + day + 'a'] || '', evening: data['text_m' + day + 'e'] || '' };
      } catch (_) { /* ข้อมูลเดือนที่เสียหายแสดงเป็นช่องว่าง ไม่แก้ข้อมูลต้นฉบับ */ }
    }
    return {};
  }

  function dateLabel(date) {
    const [year, month, day] = date.split('-').map(Number);
    return day + '/' + month + '/' + (year + 543);
  }

  root.renderSevenDays = function () {
    const body = document.getElementById('weekly-body');
    if (!body) return;
    const summary = summarizeSevenDays(bangkokToday(), readDay);
    document.getElementById('weekly-range').textContent = dateLabel(summary.rows[0].date) + ' – ' + dateLabel(summary.rows[6].date);
    document.getElementById('weekly-capture').classList.toggle('week-light', document.querySelector('.lottery-container').classList.contains('theme-light'));
    body.replaceChildren();
    summary.rows.forEach(row => {
      const tr = document.createElement('tr');
      const date = document.createElement('th');
      date.scope = 'row';
      date.textContent = dateLabel(row.date);
      tr.appendChild(date);
      const results = row.holiday ? [row.morning] : [row.morning || '—', row.evening || '—'];
      results.forEach(value => {
        const cell = document.createElement('td');
        cell.textContent = value;
        if (row.holiday) { cell.colSpan = 2; cell.className = 'week-holiday'; }
        if (!row.holiday && /^[0-9]{1,2}$/.test(row.morning) && Number(row.morning) === Number(row.evening)) cell.className = 'week-match';
        tr.appendChild(cell);
      });
      body.appendChild(tr);
    });
    ['drawn', 'undrawn'].forEach(type => {
      document.getElementById('weekly-' + type + '-count').textContent = summary[type].length;
      document.getElementById('weekly-' + type).textContent = summary[type].map(n => String(n).padStart(2, '0')).join(' · ') || 'ไม่มี';
    });
  };

  root.downloadSevenDays = async function () {
    const button = document.getElementById('weekly-download');
    button.disabled = true;
    try {
      await document.fonts.ready;
      root.renderSevenDays();
      const element = document.getElementById('weekly-capture');
      const canvas = await html2canvas(element, { scale: Math.max(2, 1600 / element.offsetWidth), backgroundColor: null });
      const link = document.createElement('a');
      link.download = 'wangpring_7days_' + bangkokToday() + '.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (_) {
      alert('บันทึกรูปภาพไม่สำเร็จ กรุณาลองใหม่');
    } finally {
      button.disabled = false;
    }
  };

  window.addEventListener('storage', root.renderSevenDays);
  window.addEventListener('focus', root.renderSevenDays);
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) root.renderSevenDays();
  });
  let lastDate = bangkokToday();
  window.setInterval(() => {
    const today = bangkokToday();
    if (today !== lastDate) { lastDate = today; root.renderSevenDays(); }
  }, 60000);
})(globalThis);

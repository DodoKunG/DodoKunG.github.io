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

  const api = { sevenDates, summarizeSevenDays };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (!root.document) return;

  const STORE_KEY = 'lottery_weekly_v1';
  const undo = [];
  function loadData() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORE_KEY));
      if (saved && saved.rows && typeof saved.rows === 'object') return saved;
    } catch (_) { /* เริ่มตารางว่างเมื่อยังไม่มีข้อมูลที่อ่านได้ */ }
    return { rows: {}, title: 'ตารางย้อนหลัง 7 วัน', theme: 'dark' };
  }
  let state = loadData();

  function saveData() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); }
    catch (_) { alert('บันทึกตาราง 7 วันไม่สำเร็จ กรุณาตรวจพื้นที่จัดเก็บของเบราว์เซอร์'); }
  }

  function pushWeeklyUndo() {
    undo.push(JSON.stringify(state));
    if (undo.length > 30) undo.shift();
  }

  function bangkokToday() {
    const parts = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Bangkok', year: 'numeric', month: '2-digit', day: '2-digit'
    }).formatToParts(new Date());
    const value = type => parts.find(part => part.type === type).value;
    return value('year') + '-' + value('month') + '-' + value('day');
  }

  function readDay(date) {
    return state.rows[date] || {};
  }

  function endDate() {
    const value = state.endDate;
    if (typeof value === 'string' && /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(value)) {
      const parsed = new Date(value + 'T00:00:00Z');
      if (!isNaN(parsed) && parsed.toISOString().slice(0, 10) === value) return value;
    }
    return bangkokToday();
  }

  function chooseEndDate(value) {
    if (state.endDate === value) return;
    pushWeeklyUndo();
    state.endDate = value;
    saveData(); root.renderSevenDays();
  }
  const dateInput = document.getElementById('weekly-end-date');
  root.applySevenDaysDate = function () {
    if (!dateInput.value || !dateInput.validity.valid) return;
    chooseEndDate(dateInput.value);
  };
  dateInput.addEventListener('input', root.applySevenDaysDate);
  dateInput.addEventListener('change', root.applySevenDaysDate);
  root.useTodaySevenDays = function () { chooseEndDate(''); };

  function dateLabel(date) {
    const [year, month, day] = date.split('-').map(Number);
    return day + '/' + month + '/' + (year + 543);
  }

  root.renderSevenDays = function () {
    const body = document.getElementById('weekly-body');
    if (!body) return;
    const summary = summarizeSevenDays(endDate(), readDay);
    document.getElementById('weekly-end-date').value = endDate();
    document.getElementById('weekly-range').textContent = dateLabel(summary.rows[0].date) + ' – ' + dateLabel(summary.rows[6].date);
    document.getElementById('weekly-heading').textContent = state.title || 'ตารางย้อนหลัง 7 วัน';
    body.replaceChildren();
    summary.rows.forEach(row => {
      const tr = document.createElement('tr');
      const date = document.createElement('th');
      date.scope = 'row';
      date.textContent = dateLabel(row.date);
      tr.appendChild(date);
      ['morning', 'evening'].forEach(slot => {
        const cell = document.createElement('td');
        cell.textContent = row[slot];
        cell.contentEditable = 'true';
        cell.dataset.weeklyDate = row.date;
        cell.dataset.weeklySlot = slot;
        cell.setAttribute('aria-label', dateLabel(row.date) + (slot === 'morning' ? ' เช้า' : ' เย็น'));
        tr.appendChild(cell);
      });
      body.appendChild(tr);
    });
    refreshWeeklySummary();
  };

  function refreshWeeklySummary() {
    const summary = summarizeSevenDays(endDate(), readDay);
    summary.rows.forEach(row => {
      const am = document.querySelector('[data-weekly-date="' + row.date + '"][data-weekly-slot="morning"]');
      const pm = document.querySelector('[data-weekly-date="' + row.date + '"][data-weekly-slot="evening"]');
      if (!am || !pm) return;
      am.colSpan = row.holiday ? 2 : 1;
      pm.hidden = row.holiday;
      am.classList.toggle('week-holiday', row.holiday);
      const same = !row.holiday && /^[0-9]{1,2}$/.test(row.morning) && Number(row.morning) === Number(row.evening);
      am.classList.toggle('week-match', same);
      pm.classList.toggle('week-match', same);
    });
    ['drawn', 'undrawn'].forEach(type => {
      document.getElementById('weekly-' + type + '-count').textContent = summary[type].length;
      document.getElementById('weekly-' + type).textContent = summary[type].map(n => String(n).padStart(2, '0')).join(' · ') || 'ไม่มี';
    });
    document.getElementById('weekly-capture').classList.toggle('week-light', state.theme === 'light');
    document.getElementById('weekly-theme').textContent = state.theme === 'light' ? '🌙 ธีมดำ' : '☀️ ธีมขาว';
    document.getElementById('weekly-undo').disabled = undo.length === 0;
  }

  document.querySelector('.weekly-container').addEventListener('focusin', event => {
    if (event.target.isContentEditable) pushWeeklyUndo();
  });
  document.querySelector('.weekly-container').addEventListener('input', event => {
    const cell = event.target;
    if (cell.id === 'weekly-heading') state.title = cell.textContent.trim();
    else if (cell.dataset.weeklyDate && cell.dataset.weeklySlot) {
      const date = cell.dataset.weeklyDate;
      state.rows[date] = { ...readDay(date), [cell.dataset.weeklySlot]: cell.textContent.trim() };
    } else return;
    saveData();
    refreshWeeklySummary();
  });

  root.undoSevenDays = function () {
    if (!undo.length) return;
    state = JSON.parse(undo.pop());
    saveData(); root.renderSevenDays();
  };
  root.clearSevenDays = function () {
    if (!confirm('ล้างเฉพาะผลเช้า–เย็นในช่วง 7 วันที่แสดงนี้? ตารางเดิมจะไม่เปลี่ยน')) return;
    pushWeeklyUndo();
    sevenDates(endDate()).forEach(date => delete state.rows[date]);
    saveData(); root.renderSevenDays();
  };
  root.toggleSevenDaysTheme = function () {
    state.theme = state.theme === 'light' ? 'dark' : 'light';
    saveData(); refreshWeeklySummary();
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
      link.download = 'wangpring_7days_' + endDate() + '.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (_) {
      alert('บันทึกรูปภาพไม่สำเร็จ กรุณาลองใหม่');
    } finally {
      button.disabled = false;
    }
  };

  function reloadWeekly() { state = loadData(); root.renderSevenDays(); }
  function reloadUnlessChoosingDate() {
    if (document.activeElement !== dateInput) reloadWeekly();
  }
  window.addEventListener('storage', event => { if (event.key === STORE_KEY || event.key === null) reloadWeekly(); });
  window.addEventListener('focus', reloadUnlessChoosingDate);
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) reloadUnlessChoosingDate();
  });
  let lastDate = bangkokToday();
  window.setInterval(() => {
    const today = bangkokToday();
    if (today !== lastDate) { lastDate = today; if (!state.endDate) root.renderSevenDays(); }
  }, 60000);
})(globalThis);

const { test } = require('node:test');
const assert = require('node:assert/strict');
const { sevenDates, summarizeSevenDays } = require('../seven-days.js');

test('seven days include today and cross month/year boundaries', () => {
  assert.deepEqual(sevenDates('2027-01-03'), ['2026-12-28','2026-12-29','2026-12-30','2026-12-31','2027-01-01','2027-01-02','2027-01-03']);
  assert.equal(sevenDates('2024-03-01')[5], '2024-02-29');
});

test('statistics use only seven days and ignore evening on a holiday', () => {
  const data = {'2026-11-08': {morning:'01',evening:'1'}, '2026-11-09': {morning:'หยุด',evening:'36'}, '2026-11-14': {morning:'5',evening:'12'}};
  const result = summarizeSevenDays('2026-11-14', date => data[date] || {});
  assert.equal(result.rows.length, 7);
  assert.deepEqual(result.drawn, [1,5,12]);
  assert.equal(result.undrawn.length, 33);
  assert.equal(result.rows[1].holiday, true);
});

test('empty days stay empty and invalid results do not count as numbers', () => {
  const result = summarizeSevenDays('2026-11-14', () => ({morning:'37',evening:'12abc'}));
  assert.deepEqual(result.drawn, []);
  assert.equal(result.undrawn.length, 36);
  assert.equal(summarizeSevenDays('2026-11-14', () => ({})).rows[0].morning, '');
});

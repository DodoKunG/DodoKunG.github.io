# วังปริง — ตารางหวย (Wangpring Lottery Table)

เว็บแอปสำหรับจดบันทึกผลหวย พร้อมเครื่องมือจัดรูปแบบข้อความทำนายเลข ใช้งานผ่านเบราว์เซอร์ รองรับ PWA (ติดตั้งเป็นแอปบนมือถือได้)

🔗 **Live demo:** https://dodokung.github.io/DodoKunG.github.io/

## Features

- 📋 **ตารางบันทึกหวย** — บันทึกผลรอบเช้า/บ่ายรายวัน แก้ไขได้ในตาราง
- 🎉 **ตรวจจับวันหยุด** — รวมช่องเช้า/บ่ายอัตโนมัติเมื่อเป็นวันหยุด
- 📊 **สถิติเลขออก/ไม่ออก** — แสดงเลข 01–36 พร้อมสถานะสี
- ✍️ **Text Formatter** — จัดรูปแบบข้อความทำนายพร้อมชื่อผู้แต่ง แปลงเป็นรูปภาพการ์ด
- 🖼️ **Export เป็นรูปภาพ** — ดาวน์โหลดตารางเป็น PNG (ใช้ html2canvas)
- ↩️ **Undo** — ย้อนกลับได้สูงสุด 30 ขั้นตอน
- 🌓 **สลับธีม** — โหมดมืด/สว่าง
- 💾 **บันทึกอัตโนมัติ** — เก็บข้อมูลราย เดือน/ปี ใน Local Storage

## Tech Stack

- HTML / CSS / JavaScript (vanilla, ไม่มี framework)
- [html2canvas](https://html2canvas.hertzen.com/) — export ตารางเป็นรูปภาพ
- Google Fonts (Sarabun, Noto Sans Thai)
- PWA (installable web app)

## การใช้งาน

1. เปิดเว็บ https://dodokung.github.io/DodoKunG.github.io/
2. กรอกผลหวยในตาราง ระบบบันทึกอัตโนมัติ
3. ใช้ช่อง Text Formatter เพื่อสร้างข้อความ/การ์ดทำนายเลข
4. กดปุ่มดาวน์โหลดเพื่อ export ตารางเป็นรูปภาพ

## Local Development

```bash
git clone https://github.com/DodoKunG/DodoKunG.github.io.git
cd DodoKunG.github.io
# เปิด index.html ตรงๆ ในเบราว์เซอร์ หรือรัน local server เช่น
python -m http.server 8000
```

## License

ระบุ license ที่นี่ (เช่น MIT) หรือระบุว่าเป็น personal project

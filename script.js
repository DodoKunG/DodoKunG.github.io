document.addEventListener('DOMContentLoaded', () => {
    const inputText = document.getElementById('inputText');
    const authorNameInput = document.getElementById('authorName');
    const convertButton = document.getElementById('convertButton');
    const outputArea = document.getElementById('outputArea');

    convertButton.addEventListener('click', () => {
        const rawText = inputText.value.trim();
        const author = authorNameInput.value.trim();

        if (!rawText) {
            outputArea.innerHTML = '<p style="color: red;">กรุณาป้อนข้อความก่อนครับ</p>';
            return;
        }

        const convertedText = convertToListToNewTemplate(rawText, author);
        outputArea.innerHTML = convertedText.split('\n').map(line => `<span class="output-line">${line}</span>`).join('<br>');
    });

    function convertToListToNewTemplate(text, author) {
        let resultText = [];

        // แบ่งข้อความเป็นบล็อกตาม '------------'
        const blocks = text.split('------------').map(block => block.trim()).filter(block => block.length > 0);

        blocks.forEach(block => {
            const lines = block.split('\n').map(line => line.trim()).filter(line => line.length > 0);
            if (lines.length === 0) return;

            // บรรทัดแรกคือหัวข้อ
            const titleLine = lines[0];
            let listItems = lines.slice(1); // ที่เหลือคือรายการลิสต์

            let newTitle = '';
            let newContent = '';

            // Regex สำหรับหัวข้อ "ในไพรสน วนหากิน 08"
            const pattern1 = /^(ในไพรสน วนหากิน)\s*(\d+)$/;
            // Regex สำหรับหัวข้อ "ไม่สนคนมอง พวกพ้องมากมี 19"
            const pattern2 = /^(ไม่สนคนมอง พวกพ้องมากมี)\s*(\d+)$/;

            let match;
            if ((match = titleLine.match(pattern1))) {
                const prefix = match[1]; // "ในไพรสน วนหากิน"
                const number = match[2]; // "08"
                newTitle = `${prefix} ซ.${number} By ${author}`;

                // จัดการลิสต์รายการ: รายการที่ 1 / รายการที่ 2 / รายการที่ 3 รายการที่ 4
                // ลบ * ออกจากทุกรายการ
                listItems = listItems.map(item => item.replace(/^\*\s*/, ''));

                if (listItems.length >= 4) {
                    newContent = `${listItems[0]} / ${listItems[1]} / ${listItems[2]} ${listItems[3]}`;
                } else if (listItems.length > 0) {
                    newContent = listItems.join(' / '); // กรณีมีน้อยกว่า 4 รายการ
                }

            } else if ((match = titleLine.match(pattern2))) {
                const prefix = match[1]; // "ไม่สนคนมอง พวกพ้องมากมี"
                const number = match[2]; // "19"
                newTitle = `${prefix} ย.${number}`;

                // จัดการลิสต์รายการ: ทุกคนเรียกว่าพ่อ / 14 อีกครั้ง / เบี้ยแหม็ดต้องเติม / กินได้ไม่เบื่อ
                // ลบ * ออกจากทุกรายการ
                listItems = listItems.map(item => item.replace(/^\*\s*/, ''));
                newContent = listItems.join(' / '); // รวมทุกรายการด้วย /

            } else {
                // หากไม่ตรงกับ pattern ที่คาดไว้ ให้ใส่เป็นข้อความเดิม
                newTitle = titleLine;
                newContent = listItems.join('\n'); // เก็บลิสต์ไว้เหมือนเดิม
            }

            // เพิ่มส่วนหัวข้อ
            resultText.push(`<span class="output-title">${newTitle}</span>`);

            // เพิ่มเนื้อหา โดยจัดการเรื่องความยาว
            const MAX_CHARS_PER_LINE = 80; // กำหนดความยาวสูงสุดต่อบรรทัด (ปรับได้ตามต้องการ)
            let currentLine = '';
            const words = newContent.split(' ');

            for (let i = 0; i < words.length; i++) {
                if ((currentLine + words[i]).length > MAX_CHARS_PER_LINE && currentLine.length > 0) {
                    resultText.push(currentLine.trim());
                    currentLine = words[i] + ' ';
                } else {
                    currentLine += words[i] + ' ';
                }
            }
            if (currentLine.trim().length > 0) {
                resultText.push(currentLine.trim());
            }

            resultText.push(''); // เพิ่มบรรทัดว่างคั่นระหว่างบล็อก
        });

        // เข้ารหัส HTML entities เพื่อป้องกัน XSS และแสดงผลข้อความดิบได้ถูกต้อง
        // แต่เนื่องจากเราใส่ span ไปแล้ว อาจจะไม่จำเป็นต้องทำอีกรอบ
        // return resultText.join('\n'); // คืนค่าเป็นสตริง โดยแต่ละองค์ประกอบจะขึ้นบรรทัดใหม่
        return resultText.join('\n');
    }
});
});

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
        // แสดงผลลัพธ์ โดยแต่ละบรรทัดที่ได้จากฟังก์ชันจะถูกครอบด้วย span และขึ้นบรรทัดใหม่
        outputArea.innerHTML = convertedText.split('\n').map(line => {
            // เราจะใช้ <br> เพื่อขึ้นบรรทัดใหม่ใน HTML
            // และใช้ white-space: pre-wrap ใน CSS เพื่อควบคุมการแสดงผล
            if (line.trim() === '') { // บรรทัดว่างเปล่า
                return '<br>';
            }
            return `<span class="output-line">${line}</span>`;
        }).join(''); // ไม่ต้องมีตัวคั่นอีก เพราะ <br> จัดการแล้ว
    });

    /**
     * แปลงข้อความจากรูปแบบลิสต์ (* รายการ) เป็นรูปแบบหัวข้อ / เนื้อหา
     * @param {string} text - ข้อความต้นฉบับ
     * @param {string} author - ชื่อผู้เขียนสำหรับส่วน By
     * @returns {string} ข้อความที่ถูกแปลงแล้วในรูปแบบที่ต้องการ
     */
    function convertToListToNewTemplate(text, author) {
        let resultLines = []; // เก็บแต่ละบรรทัดของผลลัพธ์
        
        // แบ่งข้อความเป็นบล็อกตาม '------------'
        // ใช้ /\s*------------\s*/ เพื่อรองรับช่องว่างรอบๆ เส้นคั่น
        const blocks = text.split(/\s*------------\s*/).map(block => block.trim()).filter(block => block.length > 0);

        blocks.forEach((block, index) => {
            const lines = block.split('\n').map(line => line.trim()).filter(line => line.length > 0);
            if (lines.length === 0) return;

            const titleLine = lines[0]; // บรรทัดแรกคือหัวข้อ
            const listItems = lines.slice(1); // ที่เหลือคือรายการลิสต์

            let newTitle = '';
            let newContent = '';
            
            // Regex เพื่อจับส่วนนำหน้าหัวข้อและตัวเลขท้ายหัวข้อ
            // เช่น "ในไพรสน วนหากิน 08" -> prefix="ในไพรสน วนหากิน", number="08"
            const titlePattern = /^(.*?)\s*(\d+)$/;
            const titleMatch = titleLine.match(titlePattern);

            if (titleMatch) {
                const prefix = titleMatch[1];
                const number = titleMatch[2];
                const typePrefix = (index === 0) ? 'ซ.' : 'ย.'; // บล็อกแรกใช้ ซ. บล็อกที่สองใช้ ย.
                
                newTitle = `${prefix} ${typePrefix}${number}`;
                if (index === 0) { // เฉพาะบล็อกแรกเท่านั้นที่จะมี "By ชื่อใครก็ได้"
                    newTitle += ` By ${author}`;
                }
            } else {
                // กรณีที่ไม่ตรงกับรูปแบบหัวข้อที่คาดไว้
                newTitle = titleLine; // ใช้หัวข้อเดิม
            }

            // จัดการรายการลิสต์: ใส่ / หลังทุกรายการยกเว้นรายการสุดท้าย
            if (listItems.length > 0) {
                const cleanedItems = listItems.map(item => item.replace(/^\*\s*/, '').trim()); // ลบ * และ trim
                
                // สร้างสตริงเนื้อหาโดยใส่ '/' หลังทุกรายการยกเว้นรายการสุดท้าย
                newContent = cleanedItems.join(' / ');
            } else {
                newContent = "ไม่พบรายการ";
            }

            // เพิ่มหัวข้อลงในผลลัพธ์
            resultLines.push(newTitle);

            // เพิ่มเนื้อหาลงในผลลัพธ์ พร้อมจัดการการขึ้นบรรทัดใหม่เมื่อยาวเกิน
            const MAX_CHARS_PER_LINE = 80; // กำหนดความยาวสูงสุดต่อบรรทัด (ปรับได้)
            let currentLineBuffer = '';
            const wordsInContent = newContent.split(' ');

            for (let i = 0; i < wordsInContent.length; i++) {
                const word = wordsInContent[i];
                if ((currentLineBuffer + word).length > MAX_CHARS_PER_LINE && currentLineBuffer.length > 0) {
                    resultLines.push(currentLineBuffer.trim());
                    currentLineBuffer = word + ' ';
                } else {
                    currentLineBuffer += word + ' ';
                }
            }
            if (currentLineBuffer.trim().length > 0) {
                resultLines.push(currentLineBuffer.trim());
            }

            // เพิ่มบรรทัดว่างคั่นระหว่างบล็อก ถ้าไม่ใช่บล็อกสุดท้าย
            if (index < blocks.length - 1) {
                resultLines.push(''); 
            }
        });

        // รวมทุกบรรทัดด้วย \n เพื่อให้ง่ายต่อการแตกใน HTML ด้วย <br>
        return resultLines.join('\n');
    }
});

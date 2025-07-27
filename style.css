document.addEventListener('DOMContentLoaded', () => {
    const inputText = document.getElementById('inputText');
    const authorNameInput = document.getElementById('authorName');
    const generateImageButton = document.getElementById('generateImageButton');
    const textCanvas = document.getElementById('textCanvas');
    const ctx = textCanvas.getContext('2d');
    const downloadLink = document.getElementById('downloadLink');

    const initialCanvasWidth = 800;
    const padding = 40;

    // โหลดฟอนต์ Sarabun
    const fontReadyPromise = document.fonts.load('16px Sarabun');

    generateImageButton.addEventListener('click', async () => {
        const rawText = inputText.value.trim();
        const author = authorNameInput.value.trim();

        if (!rawText) {
            alert('กรุณาป้อนข้อความก่อนครับ');
            return;
        }

        await fontReadyPromise;

        // ประมวลผลข้อความตาม Logic ใหม่
        const processedLines = processCustomTextToLinesForCanvas(rawText, author, ctx, initialCanvasWidth - 2 * padding);

        // คำนวณความสูงของ Canvas
        let totalHeight = padding;
        processedLines.forEach(lineInfo => {
            const [text, isTitle] = lineInfo;
            if (text === "") { // บรรทัดว่าง
                totalHeight += 20; // ระยะห่างสำหรับบรรทัดว่าง
            } else if (isTitle) {
                ctx.font = '700 24px Sarabun, sans-serif'; // ฟอนต์สำหรับหัวข้อ
                totalHeight += ctx.measureText(text).actualBoundingBoxAscent + ctx.measureText(text).actualBoundingBoxDescent + 20;
            } else {
                ctx.font = '400 20px Sarabun, sans-serif'; // ฟอนต์สำหรับเนื้อหา
                totalHeight += ctx.measureText(text).actualBoundingBoxAscent + ctx.measureText(text).actualBoundingBoxDescent + 10;
            }
        });
        totalHeight += padding; // Padding ด้านล่าง

        textCanvas.width = initialCanvasWidth;
        textCanvas.height = totalHeight;

        // วาดรูปภาพบน Canvas
        drawTextOnCanvas(ctx, processedLines, initialCanvasWidth, totalHeight, padding);

        // สร้างลิงก์ดาวน์โหลด
        const imageDataURL = textCanvas.toDataURL('image/png');
        downloadLink.href = imageDataURL;
        downloadLink.style.visibility = 'visible'; // แสดงปุ่มดาวน์โหลด
    });

    /**
     * ประมวลผลข้อความที่ผู้ใช้ป้อนเอง
     * @param {string} text - ข้อความต้นฉบับ
     * @param {string} author - ชื่อผู้เขียนสำหรับ By
     * @param {CanvasRenderingContext2D} ctx - Context ของ Canvas สำหรับวัดข้อความ
     * @param {number} maxWidth - ความกว้างสูงสุดของข้อความต่อบรรทัด
     * @returns {Array<[string, boolean]>} Array ของบรรทัดข้อความและสถานะว่าเป็นหัวข้อหรือไม่
     */
    function processCustomTextToLinesForCanvas(text, author, ctx, maxWidth) {
        let resultLines = [];
        // แยกบล็อกด้วยเส้นคั่น '------------'
        const blocks = text.split(/\s*------------\s*/).map(block => block.trim()).filter(block => block.length > 0);

        blocks.forEach((block, index) => {
            const lines = block.split('\n').map(line => line.trim()).filter(line => line.length > 0);
            if (!lines.length) return;

            const titleLine = lines[0]; // บรรทัดแรกของบล็อกคือหัวข้อ
            const listItems = lines.slice(1); // ที่เหลือคือรายการลิสต์

            let finalTitle = '';
            let finalContent = '';
            
            // Regex เพื่อจับส่วนนำหน้าหัวข้อและตัวเลขท้ายหัวข้อ (ถ้ามี)
            // ตัวอย่าง: "หัวข้อของฉัน 123" -> prefix="หัวข้อของฉัน", number="123"
            const titlePattern = /^(.*?)(?:\s*(\d+))?$/; // ?: ทำให้ group ไม่ถูกจับเป็น index
            const titleMatch = titleLine.match(titlePattern);

            let prefix = titleLine;
            let number = '';
            if (titleMatch) {
                prefix = titleMatch[1] ? titleMatch[1].trim() : titleLine;
                number = titleMatch[2] ? titleMatch[2].trim() : '';
            }

            // กำหนด ซ. หรือ ย. ตามลำดับบล็อก
            const typePrefix = (index === 0) ? 'ซ.' : 'ย.';
            
            finalTitle = prefix;
            if (number) { // ถ้ามีตัวเลข
                finalTitle += ` ${typePrefix}${number}`;
            }
            if (index === 0 && author) { // เฉพาะบล็อกแรกและมีชื่อผู้เขียน
                finalTitle += ` By ${author}`;
            }

            // จัดการรายการลิสต์: ใส่ / หลังทุกรายการยกเว้นรายการสุดท้าย
            if (listItems.length > 0) {
                const cleanedItems = listItems.map(item => item.replace(/^\*\s*/, '').trim()); // ลบ * และ trim
                finalContent = cleanedItems.join(' / ');
            } else {
                finalContent = "ไม่พบรายการ"; // หรือปล่อยว่าง
            }

            // เพิ่มหัวข้อลงในผลลัพธ์
            resultLines.push([finalTitle, true]); // [ข้อความ, isTitle]

            // จัดการการขึ้นบรรทัดใหม่สำหรับเนื้อหาด้วย Canvas context
            ctx.font = '400 20px Sarabun, sans-serif'; // ใช้ฟอนต์สำหรับเนื้อหาเพื่อวัด
            let currentLineBuffer = '';
            const wordsInContent = finalContent.split(' ');

            for (let i = 0; i < wordsInContent.length; i++) {
                const word = wordsInContent[i];
                const testLine = currentLineBuffer + (currentLineBuffer ? ' ' : '') + word;
                const textWidth = ctx.measureText(testLine).width;

                if (textWidth > maxWidth && currentLineBuffer) {
                    resultLines.push([currentLineBuffer.trim(), false]);
                    currentLineBuffer = word;
                } else {
                    currentLineBuffer = testLine;
                }
            }
            if (currentLineBuffer.trim()) {
                resultLines.push([currentLineBuffer.trim(), false]);
            }

            // เพิ่มบรรทัดว่างคั่นระหว่างบล็อก ถ้าไม่ใช่บล็อกสุดท้าย
            if (index < blocks.length - 1) {
                resultLines.push(["", false]);
            }
        });
        return resultLines;
    }

    /**
     * วาดข้อความที่ประมวลผลแล้วลงบน Canvas
     * (ฟังก์ชันนี้เหมือนเดิม)
     */
    function drawTextOnCanvas(ctx, linesToDraw, canvasWidth, canvasHeight, padding) {
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        let y_pos = padding;

        linesToDraw.forEach(lineInfo => {
            const [text, isTitle] = lineInfo;
            ctx.fillStyle = 'black';

            if (isTitle) {
                ctx.font = '700 24px Sarabun, sans-serif';
                ctx.fillText(text, padding, y_pos + ctx.measureText(text).actualBoundingBoxAscent);
                y_pos += ctx.measureText(text).actualBoundingBoxAscent + ctx.measureText(text).actualBoundingBoxDescent + 20;
            } else if (text === "") {
                y_pos += 20;
            } else {
                ctx.font = '400 20px Sarabun, sans-serif';
                ctx.fillText(text, padding, y_pos + ctx.measureText(text).actualBoundingBoxAscent);
                y_pos += ctx.measureText(text).actualBoundingBoxAscent + ctx.measureText(text).actualBoundingBoxDescent + 10;
            }
        });
    }
});

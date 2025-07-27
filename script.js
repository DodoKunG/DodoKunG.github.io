document.addEventListener('DOMContentLoaded', () => {
    const inputText = document.getElementById('inputText');
    const authorNameInput = document.getElementById('authorName');
    const generateImageButton = document.getElementById('generateImageButton');
    const textCanvas = document.getElementById('textCanvas');
    const ctx = textCanvas.getContext('2d');
    const downloadLink = document.getElementById('downloadLink');

    // กำหนดขนาดเริ่มต้นของ Canvas (จะถูกปรับอัตโนมัติภายหลัง)
    const initialCanvasWidth = 800;
    const padding = 40;
    const lineHeightFactor = 1.6; // ปัจจัยคูณกับขนาดฟอนต์เพื่อกำหนดความสูงบรรทัด

    // โหลดฟอนต์ Sarabun (จาก Google Fonts)
    // การโหลดฟอนต์ภายนอกอาจใช้เวลา ทำให้ต้องรอฟอนต์โหลดเสร็จก่อนวาด
    const fontReadyPromise = document.fonts.load('16px Sarabun'); // โหลดขนาด 16px ใดๆ เพื่อให้แน่ใจว่าฟอนต์พร้อม

    generateImageButton.addEventListener('click', async () => {
        const rawText = inputText.value.trim();
        const author = authorNameInput.value.trim();

        if (!rawText) {
            alert('กรุณาป้อนข้อความก่อนครับ');
            return;
        }

        // รอให้ฟอนต์โหลดเสร็จก่อนเริ่มวาด
        await fontReadyPromise;

        // ประมวลผลข้อความตาม Logic ที่ตกลงกัน
        const processedLines = processTextToLinesForCanvas(rawText, author, ctx, initialCanvasWidth - 2 * padding);

        // คำนวณความสูงของ Canvas
        let totalHeight = padding;
        processedLines.forEach(lineInfo => {
            const [text, isTitle] = lineInfo;
            if (text === "") { // บรรทัดว่าง
                totalHeight += (isTitle ? 0 : 20); // ระยะห่างน้อยลงสำหรับบรรทัดว่าง
            } else if (isTitle) {
                ctx.font = '700 24px Sarabun, sans-serif'; // ใช้ฟอนต์สำหรับหัวข้อ
                totalHeight += ctx.measureText(text).actualBoundingBoxAscent + ctx.measureText(text).actualBoundingBoxDescent + 20; // + ระยะห่าง
            } else {
                ctx.font = '400 20px Sarabun, sans-serif'; // ใช้ฟอนต์สำหรับเนื้อหา
                totalHeight += ctx.measureText(text).actualBoundingBoxAscent + ctx.measureText(text).actualBoundingBoxDescent + 10; // + ระยะห่าง
            }
        });
        totalHeight += padding; // Padding ด้านล่าง

        textCanvas.width = initialCanvasWidth;
        textCanvas.height = totalHeight;

        // วาดรูปภาพบน Canvas
        drawTextOnCanvas(ctx, processedLines, author, initialCanvasWidth, totalHeight, padding);

        // สร้างลิงก์ดาวน์โหลด
        const imageDataURL = textCanvas.toDataURL('image/png');
        downloadLink.href = imageDataURL;
        downloadLink.style.visibility = 'visible'; // แสดงปุ่มดาวน์โหลด
    });

    /**
     * ประมวลผลข้อความจากรูปแบบลิสต์ (* รายการ) เป็นรูปแบบหัวข้อ / เนื้อหาสำหรับ Canvas
     * @param {string} text - ข้อความต้นฉบับ
     * @param {string} author - ชื่อผู้เขียนสำหรับ By
     * @param {CanvasRenderingContext2D} ctx - Context ของ Canvas สำหรับวัดข้อความ
     * @param {number} maxWidth - ความกว้างสูงสุดของข้อความต่อบรรทัด
     * @returns {Array<[string, boolean]>} Array ของบรรทัดข้อความและสถานะว่าเป็นหัวข้อหรือไม่
     */
    function processTextToLinesForCanvas(text, author, ctx, maxWidth) {
        let resultLines = [];
        const blocks = text.split(/\s*------------\s*/).map(block => block.trim()).filter(block => block.length > 0);

        blocks.forEach((block, index) => {
            const lines = block.split('\n').map(line => line.trim()).filter(line => line.length > 0);
            if (!lines.length) return;

            const titleLine = lines[0];
            const listItems = lines.slice(1);

            let newTitle = '';
            let newContent = '';
            
            const titlePattern = /^(.*?)\s*(\d+)$/;
            const titleMatch = titleLine.match(titlePattern);

            if (titleMatch) {
                const prefix = titleMatch[1].trim();
                const number = titleMatch[2].trim();
                const typePrefix = (index === 0) ? 'ซ.' : 'ย.';
                
                newTitle = `${prefix} ${typePrefix}${number}`;
                if (index === 0) {
                    newTitle += ` By ${author}`;
                }
            } else {
                newTitle = titleLine;
            }

            // จัดการรายการลิสต์: ใส่ / หลังทุกรายการยกเว้นรายการสุดท้าย
            if (listItems.length > 0) {
                const cleanedItems = listItems.map(item => item.replace(/^\*\s*/, '').trim());
                newContent = cleanedItems.join(' / ');
            } else {
                newContent = "ไม่พบรายการ";
            }

            // เพิ่มหัวข้อ
            resultLines.push([newTitle, true]); // [ข้อความ, isTitle]

            // จัดการการขึ้นบรรทัดใหม่สำหรับเนื้อหาด้วย Canvas context
            ctx.font = '400 20px Sarabun, sans-serif'; // ใช้ฟอนต์สำหรับเนื้อหาเพื่อวัด
            let currentLineBuffer = '';
            const wordsInContent = newContent.split(' ');

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
                resultLines.push(["", false]); // บรรทัดว่าง
            }
        });
        return resultLines;
    }

    /**
     * วาดข้อความที่ประมวลผลแล้วลงบน Canvas
     */
    function drawTextOnCanvas(ctx, linesToDraw, author, canvasWidth, canvasHeight, padding) {
        // Clear canvas
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);

        // Background
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        let y_pos = padding;

        linesToDraw.forEach(lineInfo => {
            const [text, isTitle] = lineInfo;

            ctx.fillStyle = 'black'; // สีข้อความ

            if (isTitle) {
                ctx.font = '700 24px Sarabun, sans-serif'; // ฟอนต์สำหรับหัวข้อ
                ctx.fillText(text, padding, y_pos + ctx.measureText(text).actualBoundingBoxAscent);
                y_pos += ctx.measureText(text).actualBoundingBoxAscent + ctx.measureText(text).actualBoundingBoxDescent + 20; // + ระยะห่าง
            } else if (text === "") {
                y_pos += 20; // ระยะห่างสำหรับบรรทัดว่าง
            } else {
                ctx.font = '400 20px Sarabun, sans-serif'; // ฟอนต์สำหรับเนื้อหา
                ctx.fillText(text, padding, y_pos + ctx.measureText(text).actualBoundingBoxAscent);
                y_pos += ctx.measureText(text).actualBoundingBoxAscent + ctx.measureText(text).actualBoundingBoxDescent + 10; // + ระยะห่าง
            }
        });
    }
});

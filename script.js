document.addEventListener('DOMContentLoaded', () => {
    const inputText = document.getElementById('inputText');
    const convertButton = document.getElementById('convertButton');
    const outputArea = document.getElementById('outputArea');

    convertButton.addEventListener('click', () => {
        const rawText = inputText.value.trim();
        if (!rawText) {
            outputArea.innerHTML = '<p style="color: red;">กรุณาป้อนข้อความก่อนครับ</p>';
            return;
        }

        const convertedHtml = convertTextToTemplate(rawText);
        outputArea.innerHTML = convertedHtml;
    });

    // ฟังก์ชันหลักในการแปลงข้อความ
    function convertTextToTemplate(text) {
        let htmlContent = '';

        // *** ส่วนที่ 1: ดึงข้อมูลจากบรรทัดแรก (คล้ายภาพที่สอง) ***
        const mainHeaderRegex = /หลบหลีกคน วนอยู่ในป่า\s*(?:ซ\.)?(\d+)\s*by\s*([ก-ฮะ-์a-zA-Z\s]+)/;
        const mainSubtitle1Regex = /น้ำหวานอาบยาพิษ\s*\/\s*เหยี่ยวเวหา\s*\/\s*ตาก/;
        const mainSubtitle2Regex = /ตามราวผ้า\s*\/\s*เปิดขายตลอดเวลา/;

        // *** ส่วนที่ 2: ดึงข้อมูลจากส่วน "ในไพรสน วนหากิน 08" ***
        const section1TitleRegex = /ในไพรสน วนหากิน\s*(\d+)\s*\n\*([^\n]+)\n\*([^\n]+)\n\*([^\n]+)\n\*([^\n]+)/;

        // *** ส่วนที่ 3: ดึงข้อมูลจากส่วน "เที่ยวทนในไพร มาไปในน้ำ ย.29" ***
        const section2TitleRegex = /เที่ยวทนในไพร มาไปในน้ำ\s*(?:ย\.)?(\d+)/;
        const section2Subtitle1Regex = /ลพบุรีมีลุย\s*\/\s*มีเขี้ยวขอไว้ล่อเหยื่อ\s*\/\s*ชักยึด/;
        const section2Subtitle2Regex = /ชักไย\s*\/\s*นกแอ่นเล่นลม/;

        // *** ส่วนที่ 4: ดึงข้อมูลจากส่วน "ไม่สนคนมอง พวกพ้อง มากมี 19" ***
        const section3TitleRegex = /ไม่สนคนมอง พวกพ้อง มากมี\s*(\d+)\s*\n\*([^\n]+)\n\*([^\n]+)\n\*([^\n]+)\n\*([^\n]+)/;


        // --- เริ่มต้นสร้าง HTML ---
        htmlContent += '<header>';

        const mainHeaderMatch = text.match(mainHeaderRegex);
        if (mainHeaderMatch) {
            const chapterNum = mainHeaderMatch[1] || '';
            const author = mainHeaderMatch[2] || '';
            htmlContent += `<h1 class="main-title">หลบหลีกคน วนอยู่ในป่า <span class="chapter-info">ซ.${chapterNum} by ${author.trim()}</span></h1>`;
        } else {
            htmlContent += `<h1 class="main-title">ไม่พบหัวข้อหลัก <span class="chapter-info">by โดโด้</span></h1>`;
        }

        const mainSubtitle1Match = text.match(mainSubtitle1Regex);
        if (mainSubtitle1Match) {
            htmlContent += `<p class="subtitle">น้ำหวานอาบยาพิษ / เหยี่ยวเวหา / ตาก</p>`;
        }
        const mainSubtitle2Match = text.match(mainSubtitle2Regex);
        if (mainSubtitle2Match) {
            htmlContent += `<p class="subtitle">ตามราวผ้า / เปิดขายตลอดเวลา</p>`;
        }
        htmlContent += '</header>';

        // --- ส่วน "ในไพรสน วนหากิน 08" (จากภาพแรก) ---
        const section1Match = text.match(section1TitleRegex);
        if (section1Match) {
            const num = section1Match[1];
            const item1 = section1Match[2].trim();
            const item2 = section1Match[3].trim();
            const item3 = section1Match[4].trim();
            const item4 = section1Match[5].trim();

            htmlContent += `
                <section class="content-section">
                    <h2 class="section-title">ในไพรสน วนหากิน <span class="number">${num}</span></h2>
                    <ul>
                        <li>${item1}</li>
                        <li>${item2}</li>
                        <li>${item3}</li>
                        <li>${item4}</li>
                    </ul>
                </section>
            `;
        } else {
            // ถ้าไม่พบรูปแบบนี้ อาจจะใส่ Placeholder หรือแจ้งเตือน
            htmlContent += `
                <section class="content-section">
                    <h2 class="section-title">ในไพรสน วนหากิน <span class="number">??</span></h2>
                    <p>ไม่พบข้อมูลสำหรับส่วนนี้ในข้อความที่ป้อน</p>
                </section>
            `;
        }

        htmlContent += '<hr class="divider">';

        // --- ส่วน "เที่ยวทนในไพร มาไปในน้ำ ย.29" (จากภาพที่สอง) ---
        const section2Match = text.match(section2TitleRegex);
        if (section2Match) {
            const chapterNum = section2Match[1];
            htmlContent += `
                <section class="content-section">
                    <h2 class="section-title-alt">เที่ยวทนในไพร มาไปในน้ำ <span class="chapter-info">ย.${chapterNum}</span></h2>
            `;
            const section2Subtitle1Match = text.match(section2Subtitle1Regex);
            if (section2Subtitle1Match) {
                htmlContent += `<p class="subtitle">ลพบุรีมีลุย / มีเขี้ยวขอไว้ล่อเหยื่อ / ชักยึด</p>`;
            }
            const section2Subtitle2Match = text.match(section2Subtitle2Regex);
            if (section2Subtitle2Match) {
                htmlContent += `<p class="subtitle">ชักไย / นกแอ่นเล่นลม</p>`;
            }
            htmlContent += `</section>`;
        } else {
            htmlContent += `
                <section class="content-section">
                    <h2 class="section-title-alt">เที่ยวทนในไพร มาไปในน้ำ <span class="chapter-info">ย.ไม่พบ</span></h2>
                    <p>ไม่พบข้อมูลสำหรับส่วน "เที่ยวทนในไพร" ในข้อความที่ป้อน</p>
                </section>
            `;
        }

        // --- ส่วน "ไม่สนคนมอง พวกพ้อง มากมี 19" (จากภาพแรก) ---
        const section3Match = text.match(section3TitleRegex);
        if (section3Match) {
            const num = section3Match[1];
            const item1 = section3Match[2].trim();
            const item2 = section3Match[3].trim();
            const item3 = section3Match[4].trim();
            const item4 = section3Match[5].trim();

            htmlContent += `
                <section class="content-section">
                    <h2 class="section-title">ไม่สนคนมอง พวกพ้อง มากมี <span class="number">${num}</span></h2>
                    <ul>
                        <li>${item1}</li>
                        <li>${item2}</li>
                        <li>${item3}</li>
                        <li>${item4}</li>
                    </ul>
                </section>
            `;
        } else {
            htmlContent += `
                <section class="content-section">
                    <h2 class="section-title">ไม่สนคนมอง พวกพ้อง มากมี <span class="number">??</span></h2>
                    <p>ไม่พบข้อมูลสำหรับส่วน "ไม่สนคนมอง" ในข้อความที่ป้อน</p>
                </section>
            `;
        }

        return htmlContent;
    }
});

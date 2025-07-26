document.addEventListener('DOMContentLoaded', () => {
    // โค้ด JavaScript สำหรับฟังก์ชันเพิ่มเติมในอนาคต
    // เช่น การจัดการอีเวนต์, การดึงข้อมูลจาก API
    console.log('เว็บไซต์ Social Media ของโดโด้ โหลดเรียบร้อยแล้ว!');

    // ตัวอย่างการเพิ่มรูปภาพ Instagram ด้วย JavaScript (แบบจำลอง)
    // ในความเป็นจริง การดึงรูปภาพจาก Instagram โดยตรงผ่าน JavaScript
    // จะต้องใช้ Instagram Basic Display API ซึ่งต้องมีการตั้งค่าและ
    // Token ที่ซับซ้อนกว่านี้มาก หรือใช้บริการ 3rd-party
    const instagramGallery = document.getElementById('instagram-gallery');
    const instagramImages = [
        // เปลี่ยน URL เหล่านี้เป็นรูปภาพ Instagram ของคุณ
        'POST /<DodoKunG>/media',
        'https://via.placeholder.com/150/33FF57/FFFFFF?text=InstaPic2',
        'https://via.placeholder.com/150/3357FF/FFFFFF?text=InstaPic3',
        'https://via.placeholder.com/150/FF33A1/FFFFFF?text=InstaPic4',
        'https://via.placeholder.com/150/A133FF/FFFFFF?text=InstaPic5',
        'https://via.placeholder.com/150/33A1FF/FFFFFF?text=InstaPic6'
    ];

    // ลบรูปภาพ placeholder เก่าออกก่อน
    instagramGallery.innerHTML = '';

    instagramImages.forEach(src => {
        const img = document.createElement('img');
        img.src = src;
        img.alt = 'Instagram Post';
        instagramGallery.appendChild(img);
    });

    // คุณสามารถเพิ่มโค้ดสำหรับดึง feed จาก Twitter/X ได้ที่นี่
    // ซึ่งมักจะต้องใช้ Twitter API และฝั่งโค้ดจาก Twitter โดยตรง
});

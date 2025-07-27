// ตัวอย่าง JavaScript สำหรับอนาคต (ตอนนี้ยังไม่มีฟังก์ชันการทำงานที่ซับซ้อน)
document.addEventListener('DOMContentLoaded', () => {
    const playButtons = document.querySelectorAll('.play-button');
    let currentPlayingButton = null; // เก็บปุ่มที่กำลังเล่นอยู่

    playButtons.forEach(button => {
        button.addEventListener('click', () => {
            const icon = button.querySelector('i');

            // ถ้ามีปุ่มอื่นกำลังเล่นอยู่ ให้หยุดปุ่มนั้นก่อน
            if (currentPlayingButton && currentPlayingButton !== button) {
                const currentIcon = currentPlayingButton.querySelector('i');
                currentIcon.classList.remove('fa-pause');
                currentIcon.classList.add('fa-play');
                currentPlayingButton.classList.remove('playing');
                currentPlayingButton.dataset.status = 'paused';
            }

            // สลับสถานะของปุ่มที่คลิก
            if (button.dataset.status === 'paused') {
                // เปลี่ยนเป็นเล่น
                icon.classList.remove('fa-play');
                icon.classList.add('fa-pause');
                button.classList.add('playing');
                button.dataset.status = 'playing';
                currentPlayingButton = button; // กำหนดให้เป็นปุ่มที่กำลังเล่นอยู่
                console.log(`กำลังเล่น: ${button.closest('.song-card').querySelector('.song-title').textContent}`);
            } else {
                // เปลี่ยนเป็นหยุดชั่วคราว
                icon.classList.remove('fa-pause');
                icon.classList.add('fa-play');
                button.classList.remove('playing');
                button.dataset.status = 'paused';
                currentPlayingButton = null; // ไม่มีปุ่มใดกำลังเล่นอยู่
                console.log(`หยุดเพลง: ${button.closest('.song-card').querySelector('.song-title').textContent}`);
            }
        });
    });
});

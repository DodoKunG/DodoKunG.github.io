document.addEventListener('DOMContentLoaded', () => {
   const playButtons = document.querySelectorAll('.album-card .play-button');
   const audioPlayer = document.getElementById('audio-player');
   const playPauseButton = document.querySelector('.main-play-button');
   const playPauseIcon = playPauseButton.querySelector('i');
   const seekSlider = document.getElementById('seek-slider');
   const volumeSlider = document.getElementById('volume-slider');
   const currentTimeDisplay = document.querySelector('.current-time');
   const durationDisplay = document.querySelector('.duration');
   const nowPlayingTitle = document.querySelector('.now-playing .song-name');
   const nowPlayingArtist = document.querySelector('.now-playing .artist-name');

   let currentSong = null;
   let isPlaying = false;

   playButtons.forEach(button => {
       button.addEventListener('click', () => {
           const songFile = button.dataset.song;
           const songTitle = button.dataset.title;
           const artist = button.closest('.album-card').querySelector('.artist').textContent;

           if (currentSong !== songFile) {
               audioPlayer.src = songFile;
               currentSong = songFile;
               nowPlayingTitle.textContent = songTitle;
               nowPlayingArtist.textContent = artist;
               isPlaying = true;
               playPauseIcon.classList.remove('fa-play');
               playPauseIcon.classList.add('fa-pause');
               audioPlayer.play();
           } else {
               if (isPlaying) {
                   audioPlayer.pause();
                   isPlaying = false;
                   playPauseIcon.classList.remove('fa-pause');
                   playPauseIcon.classList.add('fa-play');
               } else {
                   audioPlayer.play();
                   isPlaying = true;
                   playPauseIcon.classList.remove('fa-play');
                   playPauseIcon.classList.add('fa-pause');
               }
           }
       });
   });

   playPauseButton.addEventListener('click', () => {
       if (currentSong) {
           if (isPlaying) {
               audioPlayer.pause();
               isPlaying = false;
               playPauseIcon.classList.remove('fa-pause');
               playPauseIcon.classList.add('fa-play');
           } else {
               audioPlayer.play();
               isPlaying = true;
               playPauseIcon.classList.remove('fa-play');
               playPauseIcon.classList.add('fa-pause');
           }
       } else {
           alert('กรุณาเลือกเพลงก่อนครับ');
       }
   });

   audioPlayer.addEventListener('loadedmetadata', () => {
       const duration = formatTime(audioPlayer.duration);
       durationDisplay.textContent = duration;
       seekSlider.max = Math.floor(audioPlayer.duration);
   });

   audioPlayer.addEventListener('timeupdate', () => {
       const currentTime = formatTime(audioPlayer.currentTime);
       currentTimeDisplay.textContent = currentTime;
       seekSlider.value = Math.floor(audioPlayer.currentTime);
   });

   seekSlider.addEventListener('input', () => {
       audioPlayer.currentTime = seekSlider.value;
   });

   volumeSlider.addEventListener('input', () => {
       audioPlayer.volume = volumeSlider.value / 100;
   });

   function formatTime(seconds) {
       const minutes = Math.floor(seconds / 60);
       const remainingSeconds = Math.floor(seconds % 60).toString().padStart(2, '0');
       return `${minutes}:${remainingSeconds}`;
   }

   audioPlayer.addEventListener('ended', () => {
       isPlaying = false;
       playPauseIcon.classList.remove('fa-pause');
       playPauseIcon.classList.add('fa-play');
       audioPlayer.currentTime = 0;
       currentTimeDisplay.textContent = '0:00';
       seekSlider.value = 0;
   });
});

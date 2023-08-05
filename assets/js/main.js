const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const minimizeBtnList = $$('.minimize__control > .btn');
minimizeBtnList.forEach(function(minimizeBtn, index) {
    minimizeBtn.onclick = function(e) {
        e.preventDefault();
    }
});

const fill = $('.fill');
const minimizeTimer = $('.minimize__timer');
const player = $('.player');
const playBtnList = $$('.toggle-play-btn');
const timeTotal = $('.time-total');
const timeCurrent = $('.time-current');
const volume = $('#volume');
const volumeOff = $('.volume__off');
const volumeLow = $('.volume__low');            
const volumeMedium = $('.volume__medium');
const volumeMedium_2 = $('.volume__medium-2');
const volumeHigh = $('.volume__high');



const songName = $('.current-song__name');
const songArtist = $('.current-song__artist');
const songThumb = $('.thumb__img');
const songThumbMini = $('.minimize__img');
const songNameMini = $('.minimize__info > h4');
const songArtistMini = $('.minimize__info > h5');
const progress = $('#progress');
const audio = $('#audio');
const playList = $('.playlist__list')


const nextBtnList = $$('.next-btn');
const prevBtnList = $$('.prev-btn');
const shuffleBtn = $('.shuffle-btn');
const repeatBtn = $('.repeat-btn');
const volumeFill = $('.volume__fill');
const volumeBtn = $('.volume--icon-wrap');


const PLAYER_STORAGE_KEY = 'Music_Player';

function setBar() {
    fill.style.width = progress.value + '%';
    minimizeTimer.style.width = progress.value + '%';
}

function hideVolumeIcon() {
    $$('.volume--icon').forEach(function(volumeIcon) {
        volumeIcon.classList.add('volume--hide');
    })
}

function volumeIconChange(value) {
    if (value == 0) {
        hideVolumeIcon();
        volumeOff.classList.remove('volume--hide');
    }
    else if (value > 0 && value <= 20) {
        hideVolumeIcon();
        volumeLow.classList.remove('volume--hide');
    }
    else if (value > 20 && value <= 50) {
        hideVolumeIcon();
        volumeMedium.classList.remove('volume--hide');
    }
    else if (value > 50 && value <= 80) {
        hideVolumeIcon();
        volumeMedium_2.classList.remove('volume--hide');
    }
    else {
        hideVolumeIcon();
        volumeHigh.classList.remove('volume--hide');
    }
}

setBar();
const app = {
    currentIndex: 0,
    currentVolume: 0.2,
    isPlaying: false,
    isRandom: false,
    playedList: [],
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs: [
        {
            name: 'Entertainer',
            artist: 'Zayn',
            path: './assets/music/ZAYN  Entertainer Official Video.mp3',
            thumb: './assets/img/zayn-entertainer.jpg'
        },
        {
            name: 'Sprinter',
            artist: 'Central Cee, Dave',
            path: './assets/music/Central Cee x Dave  Sprinter Music Video.mp3',
            thumb: './assets/img/Sprinter-CentralCee&Dave.jpg'
        },
        {
            name: 'Dusk Till Dawn',
            artist: 'Zayn, Sia',
            path: './assets/music/ZAYN-Sia-Dusk-Till-Dawn.mp3',
            thumb: './assets/img/Dusk_Till_Dawn_Zayn_Malik.jpg'
        },
        {
            name: 'Runnin',
            artist: '21 Savage, Metro Boomin',
            path: './assets/music/21 Savage x Metro Boomin  Runnin Official Audio.mp3',
            thumb: './assets/img/runnin-21savage&metroboomin.jpg'
        },
        {
            name: 'Look Alive',
            artist: 'BlocBoy JB, Drake',
            path: './assets/music/BlocBoy JB Drake  Look Alive.mp3',
            thumb: './assets/img/Lookaliveblocboyjb.jpg'
        },
        {
            name: 'Starlight',
            artist: 'Dave',
            path: './assets/music/Dave-Starlight.mp3',
            thumb: './assets/img/starlight-dave.jpg'
        }
    ],
    setConfig: function(key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
    },
    render: function() {
        const htmls = this.songs.map((song, index) => {
            return `
            <li class="song ${index == this.currentIndex ? 'song--active' : ''}" data-index="${index}">
                <div class="song__info-wrap">
                    <div class="song__thumb-wrap">
                        <div class="song__thum-overlay"></div>
                        <img src="${song.thumb}" alt="" class="song__thumb">
                        <div class="song-playing">
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                        </div>
                    </div>
                    <div class="song-info">
                        <h4 class="song-name">${song.name}</h4>
                        <h5 class="song-artist">${song.artist}</h5>
                    </div>
                </div>
                <div class="song-option">
                    <i class="fa-solid fa-ellipsis"></i>
                </div>
            </li>`;
        });
        playList.innerHTML = htmls.join('');
    }, 
    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex];
            }
        })
    },

    handleEvents: function() {
        const _this = this;

        // Xử lý cd quay và dừng
        const songThumbAnimate = songThumb.animate([
            { transform: 'rotate(360deg)'}
        ], 
        {
            duration: 12000, // 10s
            iterations: Infinity
        })
        songThumbAnimate.pause();

        // Xử lý khi click play
        playBtnList.forEach(function(playBtn) {
            playBtn.addEventListener('click', function() {
                if (_this.isPlaying) {
                    audio.pause();
                }
                else {
                    audio.play();
                }
            })
        })

        // Khi song được play
        audio.onplay = function() {
            _this.isPlaying = true;
            player.classList.add('playing');
            $('.song--active').classList.add('song--playing');
            songThumbAnimate.play();
        }

        // Khi song bị pause
        audio.onpause = function() {
            _this.isPlaying = false;
            player.classList.remove('playing');
            $('.song--active').classList.remove('song--playing');
            songThumbAnimate.pause();
        }

        // Khi tiến độ bài hát thay đổi
        audio.addEventListener('timeupdate', function() {
            if (audio.duration) {
                const progressPercent = Math.floor(audio.currentTime * 100 / audio.duration);
                progress.value = progressPercent;
            }
        })

        // Xử lý thanh progress khi thời gian bài hát thay đổi
        audio.addEventListener('timeupdate', setBar);
        progress.addEventListener('input',  setBar);


        // Xử lý khi tua song
        progress.addEventListener('change', function(e) {
            const seekTime = audio.duration / 100 * e.target.value;
            audio.currentTime = seekTime;
        })
        progress.addEventListener('input', function(e) {
            audio.muted = true;
            const seekTime = audio.duration / 100 * e.target.value;
            audio.currentTime = seekTime;
            setTimeout(function() {
                audio.muted = false;
            }, 500)
        })

        // Xử lý thời gian song
        audio.addEventListener('loadeddata', function() {
            const minute = Math.floor(audio.duration / 60);
            var second = Math.floor(audio.duration - minute*60);
            if (second < 10) {
                second = '0' + second;
            }
            timeTotal.innerText = minute + ':' + second;
        })
        audio.addEventListener('timeupdate', function() {
            const curMinute = Math.floor(audio.currentTime / 60);
            var curSecond = Math.floor(audio.currentTime - curMinute*60);
            if (curSecond < 10) 
                curSecond = '0' + curSecond;
            timeCurrent.innerText = curMinute + ':' + curSecond;
        })


        // Xử lý thanh volume
        volumeBtn.addEventListener('click', function() {
            if (_this.currentVolume == 0 && !volumeOff.classList.contains('volume--hide')) {
                return;
            }
            if (audio.volume == 0) {
                volume.value = _this.currentVolume * 100;
                audio.volume = _this.currentVolume;
            }
            else {
                volume.value = 0;
                audio.volume = 0;
            }
            volumeFill.style.width = volume.value + '%';
            if (volumeOff.classList.contains('volume--hide')) {
                if ($('.volume--icon:not(.volume--hide, .volume__off)'))
                    $('.volume--icon:not(.volume--hide, .volume__off)').style.visibility = 'hidden';
                volumeOff.classList.remove('volume--hide');
            }
            else {
                if ($('.volume--icon:not(.volume--hide, .volume__off)'))
                    $('.volume--icon:not(.volume--hide, .volume__off)').style.visibility = 'unset';
                volumeOff.classList.add('volume--hide');
            }
            _this.setConfig('currentVolume', audio.volume);
        });
        volume.addEventListener('input', function() {
            volumeFill.style.width = this.value + '%';
            audio.muted = false;
            audio.volume = this.value / 100;
            _this.currentVolume = audio.volume;
            _this.setConfig('currentVolume', _this.currentVolume);
            volumeIconChange(volume.value);
        })

        // Xử lý khi next song
        nextBtnList.forEach(function(nextBtn) {
            nextBtn.addEventListener('click', function() {
                if (_this.isRandom) {
                    _this.playRandomSong();
                }
                else {
                    _this.nextSong();
                }
                audio.play();
                audio.volume = _this.currentVolume;
                _this.loadActiveSong();
                _this.scrollToActiveSong();
                _this.setConfig('currentIndex', _this.currentIndex);
            })
        });

        // Xử lý khi prev song
        prevBtnList.forEach(function(prevBtn) {
            prevBtn.addEventListener('click', function() {
                if (_this.isRandom) {
                    _this.playRandomSong();
                }
                else {
                    _this.prevSong();
                }
                audio.play();
                audio.volume = _this.currentVolume;
                _this.loadActiveSong();
                _this.scrollToActiveSong();
                _this.setConfig('currentIndex', _this.currentIndex);
            })
        });

        // Xử lý random song
        shuffleBtn.addEventListener('click', function() {
            _this.isRandom = !_this.isRandom;
            _this.setConfig('isRandom', _this.isRandom);
            shuffleBtn.classList.toggle('shuffle-bt--active', _this.isRandom);
        })

        // Xử lý lặp lại 1 song
        repeatBtn.addEventListener('click', function() {
            _this.isRepeat = !_this.isRepeat;
            _this.setConfig('isRepeat', _this.isRepeat);
            repeatBtn.classList.toggle('repeat--active', _this.isRepeat);
        })

        // Xử lý next song khi audio ended
        audio.addEventListener('ended', function() {
            if (_this.isRepeat) {
                audio.play();
            }
            else {
                nextBtnList[0].click();
            }
        })

        // Xử lý khi click vào playlist
        playList.addEventListener('click', function(e) {
            const songNode = e.target.closest('.song:not(.song--active)');
            if (songNode || e.target.closest('.song-option')) {
                if (songNode) {
                    _this.currentIndex = songNode.dataset.index;
                    _this.loadCurrentSong();
                    _this.loadActiveSong();
                    audio.play();
                }
                else if (e.target.closest('.song-option')) {
                    console.log('option');
                }
            }
        })
    },
    loadConfig: function() {
        this.isRandom = (this.config.isRandom == undefined) ? this.isRandom : this.config.isRandom;
        this.isRepeat = (this.config.isRepeat == undefined) ? this.isRepeat : this.config.isRepeat;
        this.currentVolume = (this.config.currentVolume == undefined) ? this.currentVolume : this.config.currentVolume;
        this.currentIndex = (this.config.currentIndex == undefined) ? this.currentIndex : this.config.currentIndex;
    },
    scrollToActiveSong: function() {
        setTimeout(function() {
            $('.song--active').scrollIntoView({
                behavior : 'smooth',
                block :'nearest'
            });
        }, 100);
    },
    loadActiveSong: function() {
        const playListSong = $$('.playlist__list .song');
        $('.song--active').classList.remove('song--active')
        playListSong[this.currentIndex].classList.add('song--active');
    },
    loadCurrentSong: function() {
        songName.textContent = this.currentSong.name;
        songNameMini.textContent = this.currentSong.name;
        songArtist.textContent = this.currentSong.artist;
        songArtistMini.textContent = this.currentSong.artist;
        songThumb.src = this.currentSong.thumb;
        songThumbMini.src = this.currentSong.thumb;
        audio.src = this.currentSong.path;
        audio.volume = this.currentVolume;
        volumeFill.style.width = audio.volume * 100 + '%';
        volume.value = audio.volume * 100;
        volumeIconChange(volume.value);
    },
    nextSong: function() {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },
    prevSong: function() {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },
    playRandomSong: function() {
        if (this.playedList.length == 0) {
            this.playedList.push(this.currentIndex);
        }
        if (this.playedList.length == this.songs.length) {
            this.playedList = [];
        }
        var newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        }while(this.playedList.includes(newIndex, 0));
        this.playedList.push(newIndex);
        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },
    start: function() {
        // Gán cấu hình vào app
        this.loadConfig();

        this.defineProperties();
        this.handleEvents();
        this.loadCurrentSong();
        this.render();
        shuffleBtn.classList.toggle('shuffle-bt--active', this.isRandom);
        repeatBtn.classList.toggle('repeat--active', this.isRepeat);
    }
}

app.start();
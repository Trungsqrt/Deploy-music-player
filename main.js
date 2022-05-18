/**
 * Project name: Music player
 * 
 * Author: Trungsqrt
 * 
 */

/**
 * to-do list
 * 1. render UI
 * 2. scroll up (zoom in when scroll up, zoom out when scroll down)
 * 3. Play, pause
 * 4. nextm previous
 * 5. Mix
 * 6. Repeat
 * 7. 
 */

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const cd = $('.cd');
const playList = $('.playlist');
const heading = $('header h2');
const CDthumbnail = $('.cd-thumb');
const audio = $('#audio');
const btnTogglePlay = $('.btn-toggle-play');
const player = $('.player');
const progress = $('#progress');
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const song = [
    {
        name: "Poem for Everyone's Souls",
        singer: "Shihoko Hira",
        path: "assets/music/Poem for Everyone_s Souls - Shihoko Hira.mp3",
        image: "assets/img/persona4.jpg"
    },

    {
        name: "Mirror of the world",
        singer: "Daisuke Ishiwatari",
        path: "assets/music/Mirror-of-the-world(baiken-theme).mp3",
        image: "assets/img/baiken.jpg"
    },

    {
        name: "うっせぇわ",
        singer: "Ado",
        path: "assets/music/うっせぇわ - Ado.flac",
        image: "assets/img/うっせぇわ.jpg"
    },

    {
        name: "ギラギラ",
        singer: "Ado",
        path: "assets/music/ギラギラ - Ado.flac",
        image: "assets/img/ギラギラ.jpg"
    },

    {
        name: "僕が死のうと思ったのは",
        singer: "Amazarashi",
        path: "assets/music/僕が死のうと思ったのは - amazara.flac",
        image: "assets/img/僕が死のうと思ったのは.png"
    },

    {
        name: "境界線",
        singer: "Amazarashi",
        path: "assets/music/境界線.flac",
        image: "assets/img/境界線.jpg"
    },

    {
        name: "怪物",
        singer: "YOASOBI",
        path: "assets/music/怪物 - YOASOBI.flac",
        image: "assets/img/怪物.jpg"
    },

    {
        name: "正しくなれない",
        singer: "Zutomayo",
        path: "assets/music/正しくなれない - Zutomayo.flac",
        image: "assets/img/正しくなれない.jpg"
    },

    {
        name: "残響散歌",
        singer: "Aimer",
        path: "assets/music/残響散歌 - Aimer.flac",
        image: "assets/img/残響散歌.jpg"
    },

    {
        name: "秒針を噛む",
        singer: "Zutomayo",
        path: "assets/music/秒針を噛む - Zutomayo .flac",
        image: "assets/img/秒針を噛む.jpg"
    },

    {
        name: "踊",
        singer: "Ado",
        path: "assets/music/踊 - Ado.flac",
        image: "assets/img/踊.png"
    }
]

const app = {
    currentIndex: 0,
    isPlaying: false,
    songs: song,
    isRandom: false,
    isRepeat: false,

    start: function(){ 
        //dinh nghia cac thuoc tinh cho obj app (this.currentSong)
        this.defineProperties();

        //xu li su kien
        this.handleEvent();

        //get index cua currentSong
        this.loadCurrentSong();

        //render len trinh duyet
        this.render();      
    },

    nextSong: function(){
        if(this.currentIndex == this.songs.length-1)
            this.currentIndex = 0;
        else
            this.currentIndex++;  
        
        this.loadCurrentSong();
    },

    prevSong: function(){
        if(this.currentIndex == 0)
            this.currentIndex = this.songs.length-1;
        else
            this.currentIndex--;

        this.loadCurrentSong();
    },

    playRandomSong: function(){
        let newIndex;
        do{
            newIndex = Math.floor(Math.random() * this.songs.length);
        }while(newIndex == this.currentIndex);

        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },

    repeatSong: function(){
        if(this.isRepeat)
            audio.loop = true;
        else
            audio.loop = false;
    },

    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function(){
                return this.songs[this.currentIndex];
            }
        });
    },

    render: function(){
        const htmls = this.songs.map((song, index) => {
            return`
                <div class="song ${index === this.currentIndex? 'active' : ''}" data-index="${index}">
                    <div class="thumb"
                        style="background-image: url('${song.image}')">
                    </div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `;
        });
        playList.innerHTML = htmls.join('');
    },

    handleEvent: function(){
        const _this = this;
        const cdWidth = cd.offsetWidth;

        document.onscroll = function(){
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop;
            cd.style.width = newCdWidth  > 0 ? newCdWidth + 'px' : 0;
            cd.style.opacity = newCdWidth/cdWidth;
        }

        const cdThumbAnimate = CDthumbnail.animate([
            {
                transform: 'rotate(360deg)'
            }
        ],
        {
            duration: 10000,
            iterations: Infinity
        })
        cdThumbAnimate.pause();

        //#region event play-pause
        //toggle to play or pause
        btnTogglePlay.onclick = function(){
            if(_this.isPlaying){
                audio.pause();
            }
            else{
                audio.play();
            }
        }
        
        //when play do something
        audio.onplay = function(){
            player.classList.add('playing');
            _this.isPlaying = true;
            cdThumbAnimate.play();
        }
        //when pause do something
        audio.onpause = function(){
            player.classList.remove('playing');
            _this.isPlaying = false;
            cdThumbAnimate.pause();
        } 
        //#endregion
        
        //seek progress
        audio.ontimeupdate = function(){
            if(audio.duration){ // !=NaN(audio.duration)
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
                progress.value = progressPercent;                
            }
        }

        // change progress audio
        progress.oninput = function(e){ //e la mouse event. tra ve toa do click
            const seekTime = e.target.value * audio.duration / 100;
            audio.currentTime = seekTime; //e.target return chinh cai element click vao
        }

        nextBtn.onclick = function(){
            if(_this.isRandom){
                _this.playRandomSong()
            }
            else{
                _this.nextSong();
            }
            audio.play();
            cdThumbAnimate.currentTime = 0;
            _this.render();
            _this.scrollToActiveSong();
        }

        prevBtn.onclick = function(){
            if(_this.isRandom){
                _this.playRandomSong()
            }
            else{
                _this.prevSong();
            }
            audio.play();
            _this.scrollToActiveSong();
        }

        randomBtn.onclick = function(e){
            _this.isRandom = !_this.isRandom;
            e.target.classList.toggle('active', _this.isRandom);
        }

        audio.onended = function(){
            nextBtn.click();
        }

        repeatBtn.onclick = function(e){
            _this.isRepeat = !_this.isRepeat;
            e.target.classList.toggle('active',_this.isRepeat);
            _this.repeatSong();
        }

        playList.onclick = function(e){
            const songNode = e.target.closest('.song:not(.active)');
            if(songNode || e.target.closest('.option')){
                if(songNode){
                    _this.currentIndex = Number(songNode.dataset.index);
                    _this.loadCurrentSong();
                    _this.render();
                    audio.play();
                }
            }
        }

    },

    loadCurrentSong: function(){
        heading.textContent = this.currentSong.name;
        CDthumbnail.style.backgroundImage = `url(${this.currentSong.image})`;
        audio.src = this.currentSong.path;
    },

    scrollToActiveSong: function(){
        setTimeout(()=>{
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'end'
            });
        },300)
    }
    
}


app.start();











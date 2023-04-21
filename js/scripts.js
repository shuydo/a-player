import { data } from "../js/data.js"; //info 4 track list
import { shuffle, toMinAndSec } from "./utils.js";

const AudioController = {
  state: {
    audios: [], //objs 4 render AudioList from data.js with durations & DOM-node
    current: {}, //choised node 4 play
    repeating: false, //flag repeating current track
    playing: false, //flag life cycle 4 detect playing track
    volume: 0.5, //init volume level
  },

  init() {
    this.initVariables(); //run 4 collect selectors
    this.renderAudios(); //render list by data.js
    this.initEvents(); //start all Listeners
  },

  initVariables() {
    this.playButton = null;
    this.audioList = document.querySelector(".items"); //selector 4 list
    this.currentItem = document.querySelector(".current"); //selector 4 choised track
    this.repeatButton = document.querySelector(".handling-repeat");
    this.volumeButton = document.querySelector(".controls-volume"); //button? tuner!
    this.shuffleButton = document.querySelector(".handling-shuffle");
  },

  //start all Listeners 4 static DOM-node
  initEvents() {
    this.audioList.addEventListener("click", this.handleItem.bind(this));
    this.repeatButton.addEventListener("click", this.handleRepeat.bind(this));
    this.volumeButton.addEventListener("change", this.handleVolume.bind(this));
    this.shuffleButton.addEventListener("click", this.handleShuffle.bind(this));
  },

  handleShuffle() {
    const { children } = this.audioList;
    const shuffled = shuffle([...children]);

    this.audioList.innerHTML = ""; //clear list in browser
    shuffled.forEach(item => this.audioList.appendChild(item));
  },

  handleVolume({ target: { value } }) {
    //destr?
    const { current } = this.state;

    this.state.volume = value;

    if (!current?.audio) return;

    current.audio.volume = value;
  },

  handleRepeat({ currentTarget }) {
    const { repeating } = this.state;

    currentTarget.classList.toggle("active", !repeating); //? 2nd param?
    this.state.repeating = !repeating;
  },

  // cb fn - playbutton hendler
  handleAudioPlay() {
    // console.log("clicked");
    const { playing, current } = this.state;
    const { audio } = current;

    !playing ? audio.play() : audio.pause(); //audio.pause();

    this.state.playing = !playing; //toggling flag

    this.playButton.classList.toggle("playing", !playing); //toggle class 4 CSS
  },

  // cb fn - prevButton hendler
  handlePrev() {
    const { current } = this.state;

    const currentItem = document.querySelector(`[data-id="${current.id}"`);
    const prev = currentItem.previousSibling?.dataset; //maybe? last
    const last = this.audioList.lastChild?.dataset; //-"-

    const itemId = prev?.id || last?.id;

    if (!itemId) return; //case if along track in list

    this.setCurrentItem(itemId);
  },

  // cb fn - nextButton hendler
  handleNext() {
    //not work cycling

    const { current } = this.state;

    const currentItem = document.querySelector(`[data-id="${current.id}"`);
    const next = currentItem.nextSibling?.dataset; //maybe? last
    const first = this.audioList.firstChild?.dataset; //-"-

    const itemId = next?.id || first?.id;

    if (!itemId) return; //case if along track in list

    this.setCurrentItem(itemId);
  },

  //handler 4 buttons manage playing
  handlePlayer() {
    const play = document.querySelector(".controls-play");
    const prev = document.querySelector(".controls-prev");
    const next = document.querySelector(".controls-next"); // console.log(play);

    this.playButton = play; // before 1st click this btn is "play" (no "pause")

    play.addEventListener("click", this.handleAudioPlay.bind(this)); //Listener playbutton
    prev.addEventListener("click", this.handlePrev.bind(this)); //prev
    next.addEventListener("click", this.handleNext.bind(this)); //next
  },

  audioUpdateHandler({ audio, duration }) {
    const progress = document.querySelector(".progress-current"); //progress-bar //? id
    const timeline = document.querySelector(".timeline-start"); //? id    // audio.play();

    audio.addEventListener("timeupdate", ({ target }) => {
      const { currentTime } = target; // console.log(target.currentTime);//current time during play audio
      const width = (currentTime * 100) / duration;

      timeline.innerHTML = toMinAndSec(currentTime); //render change currentTime
      progress.style.width = `${width}%`; //render change progressbar
    });

    audio.addEventListener("ended", ({ target }) => {
      target.currentTime = 0; //reset timer in end track
      progress.style.width = `0%`; //reset progressbar in end track // ?why concaten.string?

      this.state.repeating ? target.play() : this.handleNext(); //toggling if flag repeating change
    });
  },

  //render choised track in player
  renderCurrentItem({ link, track, group, year, duration }) {
    const [img] = link.split("."); //why, maybe to ones
    return `<div
              class="current-image"
              style="background-image: url(../img/${img}.jpg)"
            ></div>

            <div class="current-info">
              <div class="current-info__top">
                <div class="current-info__titles">
                  <h2 class="current-info__group">${group}</h2>
                  <h3 class="current-info__track">${track}</h3>
                </div>

                <div class="current-info__year">${year}</div>
              </div>

              <div class="controls">
                <div class="controls-buttons">
                  <button class="controls-button controls-prev">
                    <svg class="icon-arrow">
                      <use xlink:href="img/sprite.svg#arrow"></use>
                    </svg>
                  </button>

                  <button class="controls-button controls-play">
                    <svg class="icon-pause">
                      <use xlink:href="img/sprite.svg#pause"></use>
                    </svg>

                    <svg class="icon-play">
                      <use xlink:href="img/sprite.svg#play"></use>
                    </svg>
                  </button>

                  <button class="controls-button controls-next">
                    <svg class="icon-arrow">
                      <use xlink:href="img/sprite.svg#arrow"></use>
                    </svg>
                  </button>
                </div>

                <div class="controls-progress">
                  <div class="progress">
                    <div class="progress-current"></div>
                  </div>

                  <div class="timeline">
                    <span class="timeline-start">00:00</span>
                    <span class="timeline-end">${toMinAndSec(duration)}</span>
                  </div>
                </div>     
              </div>
            </div>`;
  },

  pauseCurrentAudio() {
    //against playing 2tracks sametime
    const {
      current: { audio },
    } = this.state; //??????????

    if (!audio) return;

    audio.pause();
    audio.currentTime = 0; //reset timepointer in start
  },

  togglePlaying() {
    const { playing, current } = this.state;
    const { audio } = current;

    playing ? audio.play() : audio.pause(); //audio.pause();

    this.playButton.classList.toggle("playing", playing);
  },

  //record choised track to state 4 render in player
  setCurrentItem(itemId) {
    const current = this.state.audios.find(({ id }) => id === +itemId); //+ - becouse in data-set preserve string// console.log(current);
    if (!current) return;

    this.pauseCurrentAudio();

    this.state.current = current;
    this.currentItem.innerHTML = this.renderCurrentItem(current);

    current.audio.current = this.state.volume;

    this.handlePlayer(); //handler 4 buttons manage playing
    this.audioUpdateHandler(current);

    setTimeout(() => {
      this.togglePlaying();
    }, 0); //5 async across 4 continue playing when change track
  },

  //handle start by Listener "click" by item in AudioList
  handleItem({ target }) {
    // console.log(target);
    const { id } = target.dataset; // console.log(typeof id);
    if (!id) return; //return if DOM-node not have "id" in data-set attrib

    this.setCurrentItem(id); //record choised track to state 4 render in player
  },

  //render 1 item of AudoList
  renderItem({ id, link, track, group, genre, duration }) {
    // const { id, link, track, group, genre, duration } = audio;
    // console.log(img);
    // console.log(duration);
    // console.log(toMinAndSec(duration));

    // const item =
    const img = link.split(".")[0]; // const [img] = link.split(".")
    return `<div class="item" data-id="${id}">
              <div
                class="item-image"
                style="background-image: url(./img/${img}.jpg)"
              ></div>

              <div class="item-titles">
                <h2 class="item-group">${group}</h2>
                <h3 class="item-track">${track}</h3>
              </div>

              <p class="time-duration">${toMinAndSec(duration)}</p>
              <p class="item-genre">${genre}</p>

              <buttom class="item-play">
                <svg class="icon-play">
                  <use xlink:href="img/sprite.svg#play"></use>
                </svg>
              </buttom>
            </div>`;
  },

  //render all items of AudoList
  loadAudioData(audio) {
    this.audioList.innerHTML += this.renderItem(audio); // item; // ? +=
  },

  // render list by data.js
  renderAudios() {
    data.forEach(item => {
      const audio = new Audio(`./tracks/${item.link}`);

      audio.addEventListener("loadeddata", () => {
        const newItem = {
          ...item,
          duration: audio.duration,
          audio,
        }; // console.log(audio); // console.log(audio.duration); // this.state.audios = [...this.state.audios, newItem];
        this.state.audios.push(newItem); // console.log(this.state.audios);
        this.loadAudioData(newItem);
      });
    });
  },
};
// ----------------------------------------------------------------------------------------------------------
AudioController.init();

// const chili = new Audio("./tracks/chili.mp3");
// console.log(chili);
// setTimeout(() => console.log(chili.duration), .4);
// console.log(chili.duration);

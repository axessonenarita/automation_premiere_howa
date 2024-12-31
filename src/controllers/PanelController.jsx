import ReactDOM from "react-dom";

const _id = Symbol("_id");
const _root = Symbol("_root");
const _attachment = Symbol("_attachment");
const _Component = Symbol("_Component");
const _menuItems = Symbol("_menuItems");

export class PanelController {
  constructor(Component, { id, menuItems } = {}) {
    this[_id] = id || null;
    this[_root] = null;
    this[_attachment] = null;
    this[_Component] = Component || null;
    this[_menuItems] = menuItems || [];

    this.menuItems = this[_menuItems].map((menuItem) => ({
      id: menuItem.id,
      label: menuItem.label,
      enabled: menuItem.enabled !== undefined ? menuItem.enabled : true,
      checked: menuItem.checked !== undefined ? menuItem.checked : false,
    }));

    ["create", "show", "hide", "destroy", "invokeMenu"].forEach(
      (fn) => (this[fn] = this[fn].bind(this))
    );
  }

  create() {
    if (!this[_Component]) {
      throw new Error("Component is not defined");
    }
    this[_root] = document.createElement("div");
    this[_root].style.height = "100vh";
    this[_root].style.overflow = "auto";
    this[_root].style.padding = "8px";

    ReactDOM.render(this[_Component]({ panel: this }), this[_root]);

    return this[_root];
  }

  show(event) {
    if (!this[_root]) this.create();
    this[_attachment] = event;
    this[_attachment].appendChild(this[_root]);
  }

  hide() {
    if (this[_attachment] && this[_root]) {
      this[_attachment].removeChild(this[_root]);
      this[_attachment] = null;
    }
  }

  destroy() {
    if (this[_root]) {
      ReactDOM.unmountComponentAtNode(this[_root]);
      this[_root] = null;
    }
  }

  invokeMenu(id) {
    const menuItem = this[_menuItems].find((c) => c.id === id);
    if (menuItem) {
      const handler = menuItem.oninvoke;
      if (handler) {
        handler();
      }
    }
  }

  async processFiles() {
    try {
      console.log("Starting file processing");
      const project = await this.getProject();
      console.log("Project obtained:", project);
      const sequence = await this.getSequence(project);
      console.log("Sequence obtained:", sequence);
      const files = await this.getFiles();
      console.log("Files obtained:", files);
      this.placeAudioFiles(sequence, files.audio);
      this.placeCaptions(sequence, files.text);
      this.placeImages(sequence, files.images);
    } catch (error) {
      console.error("Error processing files:", error);
    }
  }

  async getProject() {
    const ppro = require("premierepro");
    const project = await ppro.Project.getActiveProject();
    if (!project) throw new Error("No active project found");
    return project;
  }

  async getSequence(project) {
    const sequence = await project.getActiveSequence();
    if (!sequence) throw new Error("No active sequence found");
    return sequence;
  }

  async getProjectPath() {
    const ppro = require("premierepro");
    const project = await ppro.Project.getActiveProject();
    if (!project) throw new Error("No active project found");
    
    // プロジェクトのパスからファイル名を取り除く
    const projectPath = project.path;
    const projectFolderPath = projectPath.substring(0, projectPath.lastIndexOf('/'));
    
    console.log("Project folder path:", projectFolderPath);
    return projectFolderPath;
  }

  async getFiles() {
    const fs = require('uxp').storage.localFileSystem;
    
    // // 現在のプロジェクトのパスを取得
    // const projectFolderPath = await this.getProjectPath();
    // if (!projectFolderPath) {
    //   throw new Error("プロジェクトのパスが取得できません");
    // }
    // console.log("projectFolderPath", projectFolderPath);

    // プロジェクトフォルダを取得
    const projectFolder = await fs.getFolder();
    if (!projectFolder || !projectFolder.isFolder) {
      throw new Error("プロジェクトフォルダが取得できません");
    }
    console.log("projectFolder", projectFolder);

    // 各フォルダを取得
    const voiceFolder = await projectFolder.getEntry('voice_raw');
    if (!voiceFolder || !voiceFolder.isFolder) {
      throw new Error("voiceフォルダが見つかりません");
    }
    console.log("voiceフォルダ", voiceFolder);

    const imgFolder = await projectFolder.getEntry('img');
    if (!imgFolder || !imgFolder.isFolder) {
      throw new Error("imgフォルダが見つかりません");
    }
    console.log("imgフォルダ", imgFolder);
    
    // 音声ファイルを取得
    const audioFiles = await voiceFolder.getEntries();
    const audioList = audioFiles.filter(file => file.name.endsWith('.wav'));

    // テキストファイルを取得
    const textList = audioFiles.filter(file => file.name.endsWith('.txt'));

    // 画像ファイルを取得
    const imageFiles = await imgFolder.getEntries();
    const imageList = imageFiles.filter(file => file.name.endsWith('.jpg'));

    return {
      audio: audioList,
      text: textList,
      images: imageList
    };
  }

  placeAudioFiles(sequence, audioFiles) {
    if (!sequence || !audioFiles || audioFiles.length === 0) {
        console.error("シーケンスまたは音声ファイルが無効です");
        return;
    }

    const group1StartTime = 2.5; // 秒
    const group2StartTime = 13.0; // 秒
    const clipGap = 0.8; // 秒

    try {
        // 音声ファイルを2グループに分割
        const group1 = audioFiles.slice(0, 2);
        const group2 = audioFiles.slice(2);

        // グループ1の配置
        let currentTime = group1StartTime;
        group1.forEach((audioFile, index) => {
            this.addAudioClipToSequence(sequence, audioFile, currentTime);
            currentTime += this.getClipDuration(audioFile) + (index >= 2 ? clipGap : 0);
        });

        // グループ2の配置
        currentTime = group2StartTime;
        group2.forEach((audioFile, index) => {
            this.addAudioClipToSequence(sequence, audioFile, currentTime);
            currentTime += this.getClipDuration(audioFile) + clipGap;
        });

    } catch (error) {
        console.error("音声ファイルの配置中にエラーが発生しました:", error);
    }
  }

  addAudioClipToSequence(sequence, audioFile, startTime) {
    try {
        // オーディオトラックを取得
        const track = sequence.getAudioTrack(0); // 0は最初のトラックを示します

        // クリップを追加　　まだ実装方法がなさそう
        // const clip = track.createClip(audioFile, startTime);
        // console.log(`音声クリップ ${audioFile.name} を ${startTime} 秒に配置`);
    } catch (error) {
        console.error("クリップの追加中にエラーが発生しました:", error);
    }
  }

  getClipDuration(audioFile) {
    // 音声ファイルの長さを取得するロジックを実装
    // 例: return audioFile.duration;
    return 5.0; // 仮の長さ（秒）
  }

  placeCaptions(sequence, textFiles) {
    // 字幕の配置ロジックを実装
  }

  placeImages(sequence, imageFiles) {
    // 画像の配置ロジックを実装
  }
}

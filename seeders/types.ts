export interface Data {
  songs: Song[];
  categories: CategoryElement[];
  versions: VersionElement[];
  types: TypeElement[];
  difficulties: DifficultyElement[];
  regions: Region[];
  updateTime: string;
}

export interface CategoryElement {
  category: CategoryEnum;
}

export enum CategoryEnum {
  Niconico = "niconico",
  Original = "ORIGINAL",
  PopsAnime = "POPS & ANIME",
  Variety = "VARIETY",
  WorldSEnd = "WORLD'S END",
  Irodori = "イロドリミドリ",
  Gekimai = "ゲキマイ",
  東方Project = "東方Project",
}

export interface DifficultyElement {
  difficulty: DifficultyEnum;
  name: string;
  color: string;
}

export enum DifficultyEnum {
  Advanced = "advanced",
  Basic = "basic",
  Difficulty = "【！】",
  Empty = "【？】",
  Expert = "expert",
  Master = "master",
  Ultima = "ultima",
  両 = "【両】",
  光 = "【光】",
  分 = "【分】",
  割 = "【割】",
  半 = "【半】",
  嘘 = "【嘘】",
  布 = "【布】",
  弾 = "【弾】",
  戻 = "【戻】",
  招 = "【招】",
  撃 = "【撃】",
  改 = "【改】",
  敷 = "【敷】",
  時 = "【時】",
  歌 = "【歌】",
  止 = "【止】",
  狂 = "【狂】",
  翔 = "【翔】",
  舞 = "【舞】",
  蔵 = "【蔵】",
  覚 = "【覚】",
  跳 = "【跳】",
  速 = "【速】",
  避 = "【避】",
}

export interface Region {
  region: string;
  name: string;
}

export interface Song {
  songId: string;
  category: CategoryEnum;
  title: string;
  artist: string;
  bpm: number | null;
  imageName: string;
  version: VersionEnum | null;
  releaseDate: string | null;
  isNew: boolean;
  isLocked: null;
  comment: null;
  sheets: Sheet[];
}

export interface Sheet {
  type: TypeEnum;
  difficulty: DifficultyEnum;
  level: string;
  levelValue: number;
  internalLevel: null | string;
  internalLevelValue: number;
  noteDesigner: null | string;
  noteCounts: NoteCounts;
  regions: Regions;
  isSpecial: boolean;
}

export interface NoteCounts {
  tap: number | null;
  hold: number | null;
  slide: number | null;
  air: number | null;
  flick: number | null;
  total: number | null;
}

export interface Regions {
  jp: boolean;
  intl: boolean;
}

export enum TypeEnum {
  Std = "std",
  We = "we",
}

export enum VersionEnum {
  Air = "AIR",
  AirPlus = "AIR PLUS",
  Amazon = "AMAZON",
  AmazonPlus = "AMAZON PLUS",
  Chunithm = "CHUNITHM",
  ChunithmNew = "CHUNITHM NEW",
  ChunithmNewPlus = "CHUNITHM NEW PLUS",
  ChunithmPlus = "CHUNITHM PLUS",
  Crystal = "CRYSTAL",
  CrystalPlus = "CRYSTAL PLUS",
  Luminous = "LUMINOUS",
  LuminousPlus = "LUMINOUS PLUS",
  Paradise = "PARADISE",
  ParadiseLost = "PARADISE LOST",
  Star = "STAR",
  StarPlus = "STAR PLUS",
  Sun = "SUN",
  SunPlus = "SUN PLUS",
}

export interface TypeElement {
  type: TypeEnum;
  name: string;
  abbr: string;
}

export interface VersionElement {
  version: VersionEnum;
  abbr: string;
}

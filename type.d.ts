export interface Datum {
  simpleSong: SimpleSong;
  coverId: string;
  lyricId: string;
  fileSize: number;
  album: string;
  artist: string;
  bitrate: number;
  songId: number;
  songName: string;
  addTime: number;
  cover: number;
  version: number;
  fileName: string;
}

export interface SimpleSong {
  name: string;
  id: number;
  pst: number;
  t: number;
  ar: Ar[];
  alia: string[];
  pop: number;
  st: number;
  rt: null | string;
  fee: number;
  v: number;
  crbt: null;
  cf: string;
  al: Al;
  dt: number;
  h: H;
  m: H;
  l: H;
  a: null;
  cd: string;
  no: number;
  rtUrl: null;
  ftype: number;
  rtUrls: any[];
  djId: number;
  copyright: number;
  s_id: number;
  mark: number;
  originCoverType: number;
  originSongSimpleData: null;
  single: number;
  noCopyrightRcmd: NoCopyrightRcmd | null;
  rtype: number;
  rurl: null;
  mst: number;
  cp: number;
  mv: number;
  publishTime: number;
  privilege: Privilege;
}

export interface Al {
  id: number;
  name: string;
  picUrl: string;
  tns: any[];
  pic_str?: string;
  pic: number;
}

export interface Ar {
  id: number;
  name: string;
  tns: any[];
  alias: any[];
}

export interface H {
  br: number;
  fid: number;
  size: number;
  vd: number;
}

export interface NoCopyrightRcmd {
  type: number;
  typeDesc: string;
  songId: null | string;
}

export interface Privilege {
  id: number;
  fee: number;
  payed: number;
  st: number;
  pl: number;
  dl: number;
  sp: number;
  cp: number;
  subp: number;
  cs: boolean;
  maxbr: number;
  fl: number;
  toast: boolean;
  flag: number;
}

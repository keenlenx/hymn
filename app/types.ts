// types.ts
export interface Hymn {
    id: string;
    title: string;
    lyrics: {
      type: 'stanza' | 'chorus'; // Type can be 'stanza' or 'chorus'
      text: string[]; // Array of lines (stanza or chorus)
    }[]; 
  }
  export interface foundHymn {
    id: string;
    title: string;
    lyrics: {
      type: 'stanza' | 'chorus'; // Type can be 'stanza' or 'chorus'
      text: string[]; // Array of lines (stanza or chorus)
    }[]; 
  }
  export type RootStackParamList = {
    HymnList: undefined;
    HymnDetail: { hymn: Hymn };
  };
  
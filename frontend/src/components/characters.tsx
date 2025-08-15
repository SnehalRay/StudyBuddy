export type Character = {
  name: string;
  image: string;
  description: string;
  audioSrc?: string;
};

export const characters: Character[] = [
  {
    name: 'Peter Griffin',
    image: 'src/character-pics/Peter.PNG',
    description: 'Peter Griffin from family guy',
    audioSrc: '/voices/peter.mp3',
  },
  {
    name: 'CaseOh',
    image: 'src/character-pics/CaseoH.PNG',
    description: 'The eater of worlds',
    audioSrc: '/voices/samantha.mp3',
  },
  {
    name: 'Stewie',
    image: 'src/character-pics/stewie.PNG',
    description: "Peter's friend",
    audioSrc: '/voices/robomax.mp3',
  },
  {
    name: 'IShowSpeed',
    image: 'src/character-pics/speed.PNG',
    description: 'The barking streamer with Aura',
    audioSrc: '/voices/luna.mp3',
  },
];

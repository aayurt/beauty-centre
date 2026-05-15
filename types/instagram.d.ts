interface InstagramEmbed {
  process: () => void;
}

interface Window {
  instgrm?: {
    Embeds: InstagramEmbed;
  };
}

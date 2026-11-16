/**
 * Temporary IMPILO PLAY catalogue data.
 * Replace these records with API data when the games service is ready.
 * `url` is intentionally empty: these are editorial mock records, not live games.
 */
export const mockGames = [
  {
    gameId: "fashion-runway",
    slug: "fashion-runway-challenge",
    title: "Fashion Runway Challenge",
    category: "STYLE & DESIGN",
    description: "Build a signature look, choose your styling details and prepare your model for the runway.",
    shortDescription: "Create the look. Own the runway.",
    status: "DRAFT",
    displayMode: "embedded",
    allowFullscreen: true,
    url: "http://localhost:5174",
    coverImage: "/images/games/fashion-runway-cover.jpg",
    estimatedMinutes: 5,
    featured: true,
    position: 1
  },
  {
    gameId: "impilo-trivia",
    slug: "impilo-trivia",
    title: "IMPILO Trivias",
    category: "KNOWLEDGE & CULTURE",
    description: "Test your knowledge of fashion, music, entertainment, technology and creative culture.",
    shortDescription: "How much do you know?",
    status: "DRAFT",
    displayMode: "embedded",
    allowFullscreen: true,
    url: "http://localhost:5174",
    coverImage: "/images/games/impilo-trivia-cover.jpg",
    estimatedMinutes: 3,
    featured: false,
    position: 2
  },
  {
    gameId: "creative-arcade",
    slug: "creative-arcade",
    title: "Creative Arcade",
    category: "ARCADE",
    description: "A quick-play arcade space for bite-sized challenges and creative competitions.",
    shortDescription: "Play a quick round.",
    status: "DRAFT",
    displayMode: "embedded",
    allowFullscreen: true,
    url: "http://localhost:5174",
    coverImage: "/images/games/creative-arcade-cover.jpg",
    estimatedMinutes: 2,
    featured: false,
    position: 3
  }
];

/** Convert a catalogue record into the GAME page shape consumed by PageRenderer. */
export function createMockGamePage(game, position = game.position) {
  return {
    id: `mock-game-page-${game.gameId}`,
    type: "GAME",
    title: game.title,
    position,
    game: {
      gameId: game.gameId,
      title: game.title,
      description: game.description,
      url: game.url,
      coverImage: game.coverImage,
      displayMode: game.displayMode,
      allowFullscreen: game.allowFullscreen,
      status: game.status,
      category: game.category,
      shortDescription: game.shortDescription,
      estimatedMinutes: game.estimatedMinutes
    }
  };
}

export const mockGamePages = mockGames.map((game, index) =>
  createMockGamePage(game, index + 1)
);

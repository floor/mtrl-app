// src/client/content/components/cards/artwork-data.js

// Famous paintings data for showcase content
export const artworks = [
  {
    title: 'Mona Lisa',
    artist: 'Leonardo da Vinci',
    year: '1503-1506',
    style: 'Renaissance',
    description: "Perhaps the most famous portrait ever painted, characterized by the subject's enigmatic smile."
  },
  {
    title: 'The Starry Night',
    artist: 'Vincent van Gogh',
    year: '1889',
    style: 'Post-Impressionism',
    description: "A swirling night sky over a peaceful village, painted during van Gogh's stay at an asylum."
  },
  {
    title: 'The Persistence of Memory',
    artist: 'Salvador Dalí',
    year: '1931',
    style: 'Surrealism',
    description: 'Famous for its melting clocks, this masterpiece explores concepts of time and reality.'
  },
  {
    title: 'Guernica',
    artist: 'Pablo Picasso',
    year: '1937',
    style: 'Cubism',
    description: 'A powerful anti-war statement created in response to the bombing of Guernica, Spain.'
  },
  {
    title: 'The Night Watch',
    artist: 'Rembrandt',
    year: '1642',
    style: 'Baroque',
    description: "A masterpiece of group portraiture showing Rembrandt's brilliant use of light and shadow."
  },
  {
    title: 'The Scream',
    artist: 'Edvard Munch',
    year: '1893',
    style: 'Expressionism',
    description: 'An iconic expression of human anxiety and existential dread.'
  },
  {
    title: 'Girl with a Pearl Earring',
    artist: 'Johannes Vermeer',
    year: '1665',
    style: 'Baroque',
    description: "Often called the 'Dutch Mona Lisa,' known for its masterful use of light and the subject's gaze."
  },
  {
    title: 'The Kiss',
    artist: 'Gustav Klimt',
    year: '1908',
    style: 'Art Nouveau/Symbolism',
    description: "A masterpiece featuring Klimt's signature use of gold leaf and ornate patterns."
  },
  {
    title: 'American Gothic',
    artist: 'Grant Wood',
    year: '1930',
    style: 'Regionalism',
    description: 'An iconic portrayal of rural American life that became one of the most recognizable images in American art.'
  },
  {
    title: 'The Great Wave off Kanagawa',
    artist: 'Katsushika Hokusai',
    year: '1831',
    style: 'Ukiyo-e',
    description: 'A woodblock print that has become an iconic image of Japanese art and a global symbol of Japan.'
  }
]

// Helper function to generate placeholder image URLs when actual images aren't available
export const getPlaceholderUrl = (artwork) => `/api/placeholder/400/300?text=${encodeURIComponent(artwork.title)}`

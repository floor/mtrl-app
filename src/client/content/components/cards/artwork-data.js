// src/client/content/components/cards/artwork-data.js

/**
 * Famous paintings data for showcase content
 * Each artwork includes a direct link to a public domain or freely usable image
 */
export const artworks = [
  {
    title: 'Mona Lisa',
    artist: 'Leonardo da Vinci',
    year: '1503-1506',
    style: 'Renaissance',
    description: "Perhaps the most famous portrait ever painted, characterized by the subject's enigmatic smile.",
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg/800px-Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg'
  },
  {
    title: 'The Starry Night',
    artist: 'Vincent van Gogh',
    year: '1889',
    style: 'Post-Impressionism',
    description: "A swirling night sky over a peaceful village, painted during van Gogh's stay at an asylum.",
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/1280px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg'
  },
  {
    title: 'The Persistence of Memory',
    artist: 'Salvador Dalí',
    year: '1931',
    style: 'Surrealism',
    description: 'Famous for its melting clocks, this masterpiece explores concepts of time and reality.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/en/d/dd/The_Persistence_of_Memory.jpg'
  },
  {
    title: 'Guernica',
    artist: 'Pablo Picasso',
    year: '1937',
    style: 'Cubism',
    description: 'A powerful anti-war statement created in response to the bombing of Guernica, Spain.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/en/7/74/PicassoGuernica.jpg'
  },
  {
    title: 'The Night Watch',
    artist: 'Rembrandt',
    year: '1642',
    style: 'Baroque',
    description: "A masterpiece of group portraiture showing Rembrandt's brilliant use of light and shadow.",
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Rembrandt_van_Rijn-De_Nachtwacht-1642.jpg/1280px-Rembrandt_van_Rijn-De_Nachtwacht-1642.jpg'
  },
  {
    title: 'The Scream',
    artist: 'Edvard Munch',
    year: '1893',
    style: 'Expressionism',
    description: 'An iconic expression of human anxiety and existential dread.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Edvard_Munch%2C_1893%2C_The_Scream%2C_oil%2C_tempera_and_pastel_on_cardboard%2C_91_x_73_cm%2C_National_Gallery_of_Norway.jpg/800px-Edvard_Munch%2C_1893%2C_The_Scream%2C_oil%2C_tempera_and_pastel_on_cardboard%2C_91_x_73_cm%2C_National_Gallery_of_Norway.jpg'
  },
  {
    title: 'Girl with a Pearl Earring',
    artist: 'Johannes Vermeer',
    year: '1665',
    style: 'Baroque',
    description: "Often called the 'Dutch Mona Lisa,' known for its masterful use of light and the subject's gaze.",
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/1665_Girl_with_a_Pearl_Earring.jpg/800px-1665_Girl_with_a_Pearl_Earring.jpg'
  },
  {
    title: 'The Kiss',
    artist: 'Gustav Klimt',
    year: '1908',
    style: 'Art Nouveau/Symbolism',
    description: "A masterpiece featuring Klimt's signature use of gold leaf and ornate patterns.",
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/The_Kiss_-_Gustav_Klimt_-_Google_Cultural_Institute.jpg/800px-The_Kiss_-_Gustav_Klimt_-_Google_Cultural_Institute.jpg'
  },
  {
    title: 'American Gothic',
    artist: 'Grant Wood',
    year: '1930',
    style: 'Regionalism',
    description: 'An iconic portrayal of rural American life that became one of the most recognizable images in American art.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Grant_Wood_-_American_Gothic_-_Google_Art_Project.jpg/800px-Grant_Wood_-_American_Gothic_-_Google_Art_Project.jpg'
  },
  {
    title: 'The Great Wave off Kanagawa',
    artist: 'Katsushika Hokusai',
    year: '1831',
    style: 'Ukiyo-e',
    description: 'A woodblock print that has become an iconic image of Japanese art and a global symbol of Japan.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Tsunami_by_hokusai_19th_century.jpg/1280px-Tsunami_by_hokusai_19th_century.jpg'
  }
]

/**
 * Helper function to get the image URL for an artwork
 * Falls back to a placeholder if the image URL is not available
 *
 * @param {Object} artwork - The artwork object
 * @returns {string} The URL to the image
 */
export const getImageUrl = (artwork) => {
  return artwork.imageUrl || `/api/placeholder/400/300?text=${encodeURIComponent(artwork.title)}`
}

/**
 * Legacy function for backward compatibility
 * @deprecated Use getImageUrl instead
 */
export const getPlaceholderUrl = (artwork) => {
  console.warn('getPlaceholderUrl is deprecated. Please use getImageUrl instead.')
  return getImageUrl(artwork)
}

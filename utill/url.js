
export const generateShortUrl = ()=>{
 const characters = 'http://short.est/GeAi9K';
  const length = 7;
  let shortUrl = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    shortUrl += characters.charAt(randomIndex);
  }

  return shortUrl;
}
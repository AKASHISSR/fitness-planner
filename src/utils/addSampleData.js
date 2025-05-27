// u0421u043au0440u0438u043fu0442 u0434u043bu044f u0434u043eu0431u0430u0432u043bu0435u043du0438u044f u0442u0435u0441u0442u043eu0432u044bu0445 u0434u0430u043du043du044bu0445 u0432 localStorage
import sampleReviews from '../data/sampleReviews';

// u0424u0443u043du043au0446u0438u044f u0434u043bu044f u0434u043eu0431u0430u0432u043bu0435u043du0438u044f u043eu0442u0437u044bu0432u043eu0432
export const addSampleReviews = () => {
  // u041fu043eu043bu0443u0447u0430u0435u043c u0442u0435u043au0443u0449u0438u0435 u043eu043fu0443u0431u043bu0438u043au043eu0432u0430u043du043du044bu0435 u043eu0442u0437u044bu0432u044b
  const currentReviews = JSON.parse(localStorage.getItem('fitgenius_reviews_published') || '[]');
  
  // u0414u043eu0431u0430u0432u043bu044fu0435u043c u0442u043eu043bu044cu043au043e u043du043eu0432u044bu0435 u043eu0442u0437u044bu0432u044b
  const newReviews = sampleReviews.filter(newReview => {
    return !currentReviews.some(existingReview => 
      existingReview.name === newReview.name && existingReview.date === newReview.date
    );
  });
  
  const updatedReviews = [...currentReviews, ...newReviews];
  localStorage.setItem('fitgenius_reviews_published', JSON.stringify(updatedReviews));
  
  return newReviews.length;
};

// u0424u0443u043du043au0446u0438u044f u0434u043bu044f u0434u043eu0431u0430u0432u043bu0435u043du0438u044f u0438u0441u0442u043eu0440u0438u0438 u0437u0430u0445u043eu0434u043eu0432
export const addSampleVisits = () => {
  const currentDate = new Date();
  
  // u0421u043eu0437u0434u0430u0435u043c u0442u0435u0441u0442u043eu0432u044bu0435 u0437u0430u0445u043eu0434u044b u0437u0430 u043fu043eu0441u043bu0435u0434u043du0438u0435 7 u0434u043du0435u0439
  const sampleVisits = [];
  
  for (let i = 0; i < 30; i++) {
    const visitDate = new Date(currentDate);
    visitDate.setDate(currentDate.getDate() - Math.floor(Math.random() * 7)); // u0421u043bu0443u0447u0430u0439u043du044bu0439 u0434u0435u043du044c u0432 u043fu0440u0435u0434u0435u043bu0430u0445 u043du0435u0434u0435u043bu0438
    
    const hours = Math.floor(Math.random() * 24);
    const minutes = Math.floor(Math.random() * 60);
    visitDate.setHours(hours, minutes, 0, 0);
    
    const randomIp = `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
    
    sampleVisits.push({
      date: visitDate.toLocaleString(),
      ip: randomIp,
      page: ['/home', '/about', '/reviews', '/faq', '/dashboard'][Math.floor(Math.random() * 5)],
      device: ['desktop', 'mobile', 'tablet'][Math.floor(Math.random() * 3)]
    });
  }
  
  // u0421u043eu0445u0440u0430u043du044fu0435u043c u0432 localStorage
  localStorage.setItem('fitgenius_visits', JSON.stringify(sampleVisits));
  
  return sampleVisits.length;
};

// u0414u043eu0431u0430u0432u043bu044fu0435u043c u0432u0441u0435 u0442u0435u0441u0442u043eu0432u044bu0435 u0434u0430u043du043du044bu0435
export const addAllSampleData = () => {
  const reviewsAdded = addSampleReviews();
  const visitsAdded = addSampleVisits();
  
  return { reviewsAdded, visitsAdded };
};

import whiteStar from '@/assets/stars/white-star.png';
import whiteStar2 from '@/assets/stars/white-star2.png';
import blueStar from '@/assets/stars/blue-star.png';
import blueStar2 from '@/assets/stars/blue-star2.png';
import redStar from '@/assets/stars/red-star.png';
import redStar2 from '@/assets/stars/red-star2.png';
import yellowStar from '@/assets/stars/yellow-star.png';
import yellowStar2 from '@/assets/stars/yellow-star2.png';

const baseConfig = {
    numStars: 10000,
    radius: 49000,
    size: 10,
    range: [0.3, 1]
};

const starConfigs = [
    { ...baseConfig, image: whiteStar, ratio: 0.3 },
    { ...baseConfig, image: whiteStar2, ratio: 0.4 },
    { ...baseConfig, image: blueStar, ratio: 0.05 },
    { ...baseConfig, image: blueStar2, ratio: 0.05 },
    { ...baseConfig, image: redStar, ratio: 0.075 },
    { ...baseConfig, image: redStar2, ratio: 0.075 },
    { ...baseConfig, image: yellowStar, ratio: 0.1 },
    { ...baseConfig, image: yellowStar2, ratio: 0.1 }
];

export default starConfigs;
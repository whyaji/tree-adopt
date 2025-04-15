import { HomeCarousel } from '../components/home-carousel';
import { HomeChartImpact } from '../components/home-chart-impact';
import { HomePartner } from '../components/home-partner';

function HomeScreen() {
  return (
    <div className="m-auto mt-6 max-w-4xl flex flex-col gap-6">
      <HomeCarousel />
      <HomeChartImpact />
      <HomePartner />
    </div>
  );
}

export default HomeScreen;

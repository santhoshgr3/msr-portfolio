import HeroSection from '@/components/home/HeroSection';
import ImpactTicker from '@/components/home/ImpactTicker';
import LiveCounters from '@/components/home/LiveCounters';
import StoryReveal from '@/components/home/StoryReveal';
import MissionPillars from '@/components/home/MissionPillars';
import JoinSection from '@/components/home/JoinSection';
import MemberWall from '@/components/home/MemberWall';
import Testimonials from '@/components/home/Testimonials';
import MediaStrip from '@/components/home/MediaStrip';
import GalleryPreview from '@/components/home/GalleryPreview';

export default function Home() {
  return (
    <>
      <HeroSection />
      <ImpactTicker />
      <LiveCounters />
      <StoryReveal />
      <MissionPillars />
      <GalleryPreview />
      <JoinSection />
      <MemberWall />
      <Testimonials />
      <MediaStrip />
    </>
  );
}

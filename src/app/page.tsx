import Timeline from "@/components/home/timeline";
import TimelineHeader from "@/components/home/timeline-header";
//import Navbar2 from './Navbar2'
import Header from './header'

export default async function Home() {
  return (
    <>
      <div className="grid lg:grid-cols-12 mb-5">
        <div className="col-span-4">

        </div>
        <div className="col-span-4">
          <TimelineHeader />
          <Timeline />
        </div>
        <div className="col-span-4">
        </div>
      </div>


    </>
  );
}

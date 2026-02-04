import ChatApp from "./components/ChatApp";
import Footer from "./components/Footer";
import LenisScroll from "./components/LenisScroll";
import Navbar from "./components/Navbar";
import Ability from "./sections/Ability";
import Contact from "./sections/Contact";
import HeroSection from "./sections/HeroSection";
import Projects from "./sections/MyProjects";
import WorkflowSteps from "./sections/WorkflowSteps";

export default function HomePage() {
    return (
        <>
            <LenisScroll />
            <Navbar />
            <main className="px-10 md:px-4">
                <div className="fixed inset-0 overflow-hidden -z-20 pointer-events-none">
                    <div className="absolute rounded-full top-80 left-2/5 -translate-x-0 md:-translate-x-1/2 size-300 md:size-130 bg-[#D10A8A] blur-[100px]" />
                    <div className="absolute rounded-full top-80 right-0 -translate-x-1/2 size-130 bg-[#2E08CF] blur-[100px] hidden md:block" />
                    <div className="absolute rounded-full top-0 left-1/2 -translate-x-1/2 size-130 bg-[#F26A06] blur-[100px] hidden md:block" />
                </div>
                <HeroSection />
                <Ability />
                <WorkflowSteps />
                <Projects />
                <Contact />
            </main>
            <ChatApp />
            <Footer />
        </>
    );
}

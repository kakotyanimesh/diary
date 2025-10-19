import { Footer } from "@/components/footer";
import { GitHub } from "@/components/icons/github";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
    return (
        <div>
            <Navbar />
            <div className='min-h-screen flex flex-col justify-center text-center items-center space-y-5'>
                {/* <h1 className='text-6xl font-paper'>
                    Your thoughts deserve a <span className="text-pink">Home</span>
                </h1>
                <div className="space-x-4">
                    <Button asChild className="px-5">
                        <Link href={"/"}>Start Writing</Link>
                    </Button>
                    <Button asChild className="px-5" variants={"secondary"}>
                        <Link href={"/"}>Want to Self Host ?</Link>
                    </Button>
                </div> */}
                <h1 className='xl:text-6xl md:text-4xl text-2xl mx-10 font-paper md:mx-25 xl:mx-62'>
                    We are building Self hosted Open sources Digital Diary
                    called Jurno for <br />{" "}
                    <span className='text-pink'>GEN-Z writers</span>
                </h1>
                <div className="flex flex-col items-center space-y-2">
                    <Button asChild className='px-5' variants={"secondary"}>
                        <Link
                            href={"https://forms.gle/d2avM2XcCVQiRFvw7"}
                            target='_blank'>
                            Help Us to build a better product
                        </Link>
                    </Button>
                    <Button asChild className=' bg-slate-600 rounded-full' variants={"transparent"}>
                        <Link
                            href={"https://github.com/kakotyanimesh/diary"}
                            target='_blank'>
                            <GitHub/>
                        </Link>
                    </Button>
                </div>

                <Footer />
            </div>
        </div>
    );
}

import { Button } from "@/components/ui/button";
import Image from "next/image";

interface About3Props {
  title?: string;
  description?: string;
  mainImage?: {
    src: string;
    alt: string;
  };
  secondaryImage?: {
    src: string;
    alt: string;
  };
  breakout?: {
    src: string;
    alt: string;
    title?: string;
    description?: string;
    buttonText?: string;
    buttonUrl?: string;
  };
  companiesTitle?: string;
  companies?: Array<{
    src: string;
    alt: string;
  }>;
  achievementsTitle?: string;
  achievementsDescription?: string;
  achievements?: Array<{
    label: string;
    value: string;
  }>;
}

const defaultCompanies = [
  {
    src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/company/fictional-company-logo-1.svg",
    alt: "Arc",
  },
  {
    src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/company/fictional-company-logo-2.svg",
    alt: "Descript",
  },
  {
    src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/company/fictional-company-logo-3.svg",
    alt: "Mercury",
  },
  {
    src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/company/fictional-company-logo-4.svg",
    alt: "Ramp",
  },
  {
    src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/company/fictional-company-logo-5.svg",
    alt: "Retool",
  },
  {
    src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/company/fictional-company-logo-6.svg",
    alt: "Watershed",
  },
];

const defaultAchievements = [
  { label: "Companies ", value: "300+" },
  { label: "Projects Finalized", value: "800+" },
  { label: "Happy Customers", value: "99%" },
  { label: "Recognized Awards", value: "10+" },
];

const About3 = ({
  title = "About Us",
  description = "Shadcnblocks is a passionate team dedicated to creating innovative solutions that empower businesses to thrive in the digital age.",
  mainImage = {
    src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-1.svg",
    alt: "placeholder",
  },
  secondaryImage = {
    src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-2.svg",
    alt: "placeholder",
  },
  breakout = {
    src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/block-1.svg",
    alt: "logo",
    title: "Hundreds of blocks at Shadcnblocks.com",
    description:
      "Providing businesses with effective tools to improve workflows, boost efficiency, and encourage growth.",
    buttonText: "Discover more",
    buttonUrl: "https://shadcnblocks.com",
  },
  companiesTitle = "Valued by clients worldwide",
  companies = defaultCompanies,
  achievementsTitle = "Our Achievements in Numbers",
  achievementsDescription = "Providing businesses with effective tools to improve workflows, boost efficiency, and encourage growth.",
  achievements = defaultAchievements,
}: About3Props = {}) => {
  return (
    <div className="flex flex-col gap-10 mx-auto px-9 lg:px-20 lg:flex-row">
      <div className="flex flex-1 flex-col gap-5 ">
        <p className="">About Our Alumni</p>
        <h1 className="text-2xl md:text-3xl text-center lg:text-left">
          Your Journey Didn&apos;t End Here—It Evolved
        </h1>
        <p className="text-xl font-normal text-justify md:px-14 lg:px-0">
          We bring together graduates from every year and program, creating a
          space where connections thrive and opportunities flourish. Our
          community shares experiences, celebrates milestones, and supports one
          another—building lasting relationships and opening doors for personal
          and professional growth.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-7 md:flex-nowrap md:gap-2 lg:gap-4 lg:items-start lg:justify-start">
          <div className="flex flex-row md:flex-col gap-1.5 w-fit">
            <h1>10+</h1>
            <p>Cohorts of Graduates</p>
          </div>
          <div className="flex flex-row md:flex-col gap-1.5 w-fit">
            <h1>700+</h1>
            <p>Members</p>
          </div>
          <div className="flex flex-row md:flex-col gap-1.5 w-fit">
            <h1>Infinite</h1>
            <p>Meaningful connections</p>
          </div>
        </div>
      </div>
      <div className="flex flex-1 relative items-center lg:justify-end justify-center">
        <Image
          src="/aboutImage.png"
          alt=""
          width={350}
          height={50}
          // fill
          className="w-100 h-[93%]"
          loading="eager"
        />
      </div>
    </div>
  );
};

export { About3 };

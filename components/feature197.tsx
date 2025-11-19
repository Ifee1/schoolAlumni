"use client";

import { useState } from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FeatureItem {
  id: number;
  title: string;
  image?: string;
  description: string;
}

interface Feature197Props {
  features?: FeatureItem[];
}

const Feature197 = ({
  features = [
    {
      id: 1,
      title: "Who can join the alumni community?",
      // image:
      //   "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-1.svg",
      description:
        "All graduates of the school are welcome to join, regardless of graduation year or program.",
    },
    {
      id: 2,
      title: "How do I register as a member?",
      // image:
      //   "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-2.svg",
      description:
        "Simply visit our registration page, fill in your details, and submit the form. Your profile will be activated once verified",
    },
    {
      id: 3,
      title: "Is there a membership fee?",
      // image:
      //   "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-3.svg",
      description: "No. Joining the alumni community is completely free.",
    },
    {
      id: 4,
      title: "What benefits do members receive?",
      // image:
      //   "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-4.svg",
      description:
        "Members gain access to networking opportunities, career resources, event updates, mentorship programs, and alumni-only announcements.",
    },
    {
      id: 5,
      title: "Can I contribute to the alumni community?",
      // image:
      //   "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-5.svg",
      description:
        "Yes! You can volunteer, mentor current students, share opportunities, or donate to support community initiatives.",
    },
  ],
}: Feature197Props) => {
  const [activeTabId, setActiveTabId] = useState<number | null>(1);
  const [activeImage, setActiveImage] = useState(features[0].image);

  return (
    <section className="py-32">
      <div className="container mx-auto px-6">
        <div className="mb-12 flex w-full items-start justify-between gap-12">
          <div className="w-full md:w-1/2">
            <Accordion type="single" className="w-full" defaultValue="item-1">
              {features.map((tab) => (
                <AccordionItem
                  key={tab.id}
                  value={`item-${tab.id}`}
                  className="transition-opacity hover:opacity-80"
                >
                  <AccordionTrigger
                    onClick={() => {
                      setActiveImage(tab.image);
                      setActiveTabId(tab.id);
                    }}
                    className="no-underline! cursor-pointer py-5 transition"
                  >
                    <h4
                      className={`text-xl font-semibold ${
                        tab.id === activeTabId
                          ? "text-foreground"
                          : "text-muted-foreground"
                      }`}
                    >
                      {tab.title}
                    </h4>
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground text-base">
                      {tab.description}
                    </p>
                    <div className="mt-4 md:hidden">
                      {/* <img
                        src={tab.image}
                        alt={tab.title}
                        className="h-full max-h-80 w-full rounded-md object-cover"
                      /> */}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          <div className="bg-muted relative m-auto hidden w-1/2 overflow-hidden rounded-xl md:block">
            <img
              src="/aboutImage.png"
              alt="Feature preview"
              className="aspect-4/3 rounded-md object-cover pl-4"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export { Feature197 };

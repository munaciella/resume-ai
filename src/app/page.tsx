"use client";

import { useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  FileTextIcon,
  SparklesIcon,
  UserCircle2Icon,
  MailCheckIcon,
  FileCheck2Icon,
  RocketIcon,
} from "lucide-react";

const features = [
  {
    name: "AI-Powered Resume Builder",
    description:
      "Generate tailored, professional resumes in seconds using advanced AI.",
    icon: SparklesIcon,
  },
  {
    name: "Cover Letter Generation",
    description: "Create compelling, job-specific cover letters effortlessly.",
    icon: MailCheckIcon,
  },
  {
    name: "Job Description Parser",
    description:
      "Extract skills and experience from any job posting instantly.",
    icon: FileTextIcon,
  },
  {
    name: "Application Tracker",
    description:
      "Track your job application progress, notes, and statuses all in one place.",
    icon: FileCheck2Icon,
  },
  {
    name: "Personalized Dashboard",
    description:
      "All your jobs, documents, and statuses, neatly organized in your dashboard.",
    icon: UserCircle2Icon,
  },
  {
    name: "One-Click Save & Export",
    description:
      "Save, edit, or export resumes and cover letters with just a click.",
    icon: RocketIcon,
  },
];

export default function Home() {
  const { isSignedIn } = useAuth();

  const handleClick = () => {
    if (isSignedIn) {
      toast.info("Redirecting to dashboard...", {
        style: { backgroundColor: "#2563EB", color: "white" },
      });
    } else {
      toast.warning("You need to be signed in to get started.", {
        description: "Redirecting to sign in page...",
        style: { backgroundColor: "#EAB308", color: "black" },
      });
      localStorage.setItem("showSignInToast", "true");
    }

    setTimeout(() => {
      window.location.href = "/dashboard";
    }, 600);
  };

  return (
    <main className="flex-1 overflow-scroll text-foreground">
      <div className="py-20 rounded-md shadow-lg">
        <div className="absolute top-5 right-5"></div>

        <div className="flex flex-col items-center mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center space-y-6 px-6 lg:px-8">
            <p
              role="alert"
              className="inline-block bg-red-100 dark:bg-red-900 px-4 py-2 rounded-md text-red-700 dark:text-red-300 font-medium text-md"
            >
              <span className="mr-1">⚠️</span>
              <strong>Demo Notice:</strong>{" "}
              <span className="font-light">
                This live demo is provided solely for testing and development
                purposes. Functionality may be limited, unstable, or subject to
                sudden service restrictions. Use at your own risk;
                production-grade reliability is not guaranteed.
              </span>
            </p>

            <h2 className="text-lg font-semibold leading-7 text-primary mt-14">
              ApplyWise · Your Smart Career Companion
            </h2>
            <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
              Land Interviews with Effortless AI-Generated Documents
            </p>

            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
              Streamline your job hunt with AI-generated resumes, cover letters,
              and an intuitive dashboard. Let ApplyWise handle the busy work so
              you can focus on what matters.
            </p>
          </div>

          <Button
            onClick={handleClick}
            className="mt-10 px-6 py-4 text-lg cursor-pointer"
          >
            🚀 Get Started
          </Button>
        </div>

        {/* <div className="relative overflow-hidden pt-16">
          <div className="mx-auto max-w-6xl px-6 lg:px-8">
            <Image
              src="https://i.imgur.com/VciRSTI.jpeg" // Replace this with a job/resume relevant image later
              alt="App screenshot"
              width={2432}
              height={1442}
              className="mb-[-0%] rounded-xl shadow-2xl ring-1 ring-gray-900/10"
            />
          </div>
        </div> */}

        <div className="mx-auto mt-20 max-w-7xl px-6 lg:px-8">
          <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16 text-base text-gray-600 dark:text-gray-300">
            {features.map((feature) => (
              <div key={feature.name} className="relative pl-10">
                <feature.icon className="absolute left-0 top-1 h-6 w-6 text-primary" />
                <dt className="font-semibold text-gray-900 dark:text-white">
                  {feature.name}
                </dt>
                <dd className="mt-2">{feature.description}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </main>
  );
}

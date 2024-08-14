import JobFilterSidebar from "../components/JobFilterSidebar";
import H1 from "../components/ui/h1";
import JobResults from "../components/JobResults";
import { JobFilterValues } from "../lib/validation";
import { Metadata } from "next";

interface PageProps {
  searchParams: {
    q?: string;
    type?: string;
    location?: string;
    remote?: string;
    page?: string;
  };
}
function getTitle({ q, type, location, remote }: JobFilterValues) {
  const titlePrefix = q
    ? `${q} jobs`
    : type
      ? `${type} developer jobs`
      : remote
        ? "Remote developer jobs"
        : "All developer jobs";

  const titleSuffix = location ? ` in ${location}` : "";

  return `${titlePrefix}${titleSuffix}`;
}

export function generateMetadata({
  searchParams: { q, type, location, remote },
}: PageProps): Metadata {
  return {
    title: `${getTitle({
      q,
      type,
      location,
      remote: remote === "true",
    })} | bytehire.dev`,
  };
}

export default function Home({
  searchParams: { q, type, location, remote, page },
}: PageProps) {
  const filterValues: JobFilterValues = {
    q,
    type,
    location,
    remote: remote === "true",
  };
  return (
    <main className="mx-auto my-10 max-w-5xl space-y-10 px-4 sm:px-6 lg:px-8">
      <div className="space-y-5 text-center">
        <H1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          {getTitle(filterValues)}
        </H1>
        <p className="text-muted-foreground">Find your dream tech job.</p>
      </div>
      <section className="flex flex-col gap-4 sm:grid sm:grid-cols-[1fr_3fr]">
        <JobFilterSidebar defaultValues={filterValues} />
        <JobResults filterValues={filterValues} page={page ? parseInt(page) : 1} />
      </section>
    </main>
  );
}

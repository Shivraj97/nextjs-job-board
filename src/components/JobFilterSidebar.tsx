import React from "react";
import Select from "./ui/select";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { jobTypes } from "../lib/job-types";
import prisma from "../lib/prisma";
import { jobFilterSchema, JobFilterValues } from "../lib/validation";
import { redirect } from "next/navigation";
import { X } from "lucide-react";
import FormSubmitButton from "./FormSubmitButton";

type JobFilterSidebarProps = {
  defaultValues: JobFilterValues;
};

const filterJobs = async (formData: FormData) => {
  "use server";

  const values = Object.fromEntries(formData);
  const { q, type, location, remote } = jobFilterSchema.parse(values);

  const searchParams = new URLSearchParams({
    ...(q && { q: q.trim() }),
    ...(type && { type: type.trim() }),
    ...(location && { location: location.trim() }),
    ...(remote && { remote: String(remote) }),
  });

  redirect(`/?${searchParams.toString()}`);
};

const JobFilterSidebar = async ({ defaultValues }: JobFilterSidebarProps) => {
  const distinctLocations = (await prisma.job
    .findMany({
      where: {
        approved: true,
      },
      select: {
        location: true,
      },
      distinct: ["location"],
    })
    .then((locations) =>
      locations.map(({ location }) => location).filter(Boolean),
    )) as string[];

  return (
    <aside className="sticky top-[96px] h-fit rounded-lg border bg-background p-4 md:w-[260px]">
      <form action={filterJobs} key={JSON.stringify(defaultValues)}>
        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="q">Search</Label>
            <Input
              id="q"
              name="q"
              placeholder="Title, company, etc."
              defaultValue={defaultValues?.q}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="type">Type</Label>
            <Select
              id="type"
              name="type"
              defaultValue={defaultValues?.type || ""}
            >
              <option value="">All types</option>
              {jobTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="location">Location</Label>
            <Select
              id="location"
              name="location"
              defaultValue={defaultValues?.location || ""}
            >
              <option value="">All locations</option>
              {distinctLocations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <input
              id="remote"
              name="remote"
              type="checkbox"
              className="scale-125 accent-primary"
              defaultChecked={defaultValues?.remote || false}
            />
            <Label htmlFor="remote">Remote jobs</Label>
          </div>
          <FormSubmitButton className="w-full">Filter jobs</FormSubmitButton>
          {/* <Button
            variant={"outline"}
            type="button"
            className="flex w-full items-center gap-2"
            onClick={() => {
              redirect('/');
            }}
          >
            <X
              size={20}
              className="shrink-0 items-center rounded-full border p-[2px] text-muted-foreground"
            />
            Remove all filters
          </Button> */}
        </div>
      </form>
    </aside>
  );
};

export default JobFilterSidebar;
